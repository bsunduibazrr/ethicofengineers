"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import {
  crosswords,
  type CrosswordEntry,
  type CrosswordPuzzle,
  type Direction,
} from "@/lib/crosswords";
import styles from "./ajilbar.module.css";

type Cell = {
  key: string;
  row: number;
  col: number;
  answer: string;
  number?: number;
  entries: CrosswordEntry[];
};
type Answers = Record<string, string>;

const cellKey = (row: number, col: number) => `${row}:${col}`;
const letters = (value: string) =>
  value
    .normalize("NFKC")
    .toUpperCase()
    .match(/[А-ЯЁӨҮ]/gu) ?? [];
const entryCells = (entry: CrosswordEntry) =>
  Array.from(entry.answer).map((_, index) =>
    cellKey(
      entry.row + (entry.direction === "down" ? index : 0),
      entry.col + (entry.direction === "across" ? index : 0),
    ),
  );

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={back ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrosswordBoard({ puzzle }: { puzzle: CrosswordPuzzle }) {
  const cells = useMemo(() => {
    const map = new Map<string, Cell>();
    for (const entry of puzzle.entries) {
      entryCells(entry).forEach((key, index) => {
        const row = entry.row + (entry.direction === "down" ? index : 0);
        const col = entry.col + (entry.direction === "across" ? index : 0);
        const cell = map.get(key) ?? {
          key,
          row,
          col,
          answer: Array.from(entry.answer)[index],
          entries: [],
        };
        cell.entries.push(entry);
        if (index === 0) cell.number = entry.number;
        map.set(key, cell);
      });
    }
    return map;
  }, [puzzle]);
  const firstEntry = puzzle.entries.find(
    (entry) => entry.direction === "across",
  )!;
  const [answers, setAnswers] = useState<Answers>({});
  const [activeId, setActiveId] = useState(firstEntry.id);
  const [selected, setSelected] = useState(entryCells(firstEntry)[0]);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const pointerWasFocused = useRef(false);
  const active =
    puzzle.entries.find((entry) => entry.id === activeId) ?? firstEntry;
  const activeKeys = entryCells(active);
  const signature = puzzle.entries
    .map(
      (entry) => `${entry.answer}:${entry.row}:${entry.col}:${entry.direction}`,
    )
    .join("|");
  const storageKey = `life3-crossword-v1:${puzzle.id}`;

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (
        stored?.signature === signature &&
        stored.answers &&
        typeof stored.answers === "object"
      ) {
        const restored: Answers = {};
        for (const [key, value] of Object.entries(stored.answers)) {
          const normalized = typeof value === "string" ? letters(value) : [];
          const letter = normalized[0];
          if (cells.has(key) && normalized.length === 1 && letter) {
            restored[key] = letter;
          }
        }
        setAnswers(restored);
      }
    } catch {
      // The exercise also works when browser storage is unavailable.
    }
    setLoaded(true);
  }, [cells, signature, storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ signature, answers }));
    } catch {
      // Storage is optional; keep the current exercise usable.
    }
  }, [answers, loaded, signature, storageKey]);

  const filled = [...cells.keys()].filter((key) => answers[key]).length;
  const correctEntries = puzzle.entries.filter((entry) =>
    entryCells(entry).every(
      (key, index) => answers[key] === Array.from(entry.answer)[index],
    ),
  ).length;

  function focusCell(key: string, entry = active) {
    const cell = cells.get(key);
    if (!cell) return;
    const nextEntry =
      cell.entries.find((candidate) => candidate.id === entry.id) ??
      cell.entries.find(
        (candidate) => candidate.direction === entry.direction,
      ) ??
      cell.entries[0];
    setSelected(key);
    setActiveId(nextEntry.id);
    requestAnimationFrame(() => {
      const input = inputs.current.get(key);
      input?.focus();
      input?.select();
    });
  }

  function selectEntry(entry: CrosswordEntry) {
    const keys = entryCells(entry);
    focusCell(keys.find((key) => !answers[key]) ?? keys[0], entry);
  }

  function updateAnswer(key: string, value: string) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
    setChecked(false);
    setMessage("");
  }

  function advance(key: string) {
    const index = activeKeys.indexOf(key);
    if (index >= 0 && index < activeKeys.length - 1)
      focusCell(activeKeys[index + 1]);
  }

  function switchDirection(cell: Cell) {
    if (cell.entries.length < 2) return;
    const next = cell.entries.find((entry) => entry.id !== active.id)!;
    focusCell(cell.key, next);
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>, cell: Cell) {
    const movement: Record<string, [number, number, Direction]> = {
      ArrowLeft: [0, -1, "across"],
      ArrowRight: [0, 1, "across"],
      ArrowUp: [-1, 0, "down"],
      ArrowDown: [1, 0, "down"],
    };
    if (movement[event.key]) {
      event.preventDefault();
      const [row, col, direction] = movement[event.key];
      const entry = cell.entries.find(
        (candidate) => candidate.direction === direction,
      );
      const nextKey = cellKey(cell.row + row, cell.col + col);
      if (cells.has(nextKey)) focusCell(nextKey, entry ?? active);
      else if (entry) focusCell(cell.key, entry);
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      if (answers[cell.key]) updateAnswer(cell.key, "");
      else {
        const previous = activeKeys[activeKeys.indexOf(cell.key) - 1];
        if (previous) {
          updateAnswer(previous, "");
          focusCell(previous);
        }
      }
    } else if (event.key === "Delete") {
      event.preventDefault();
      updateAnswer(cell.key, "");
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      switchDirection(cell);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusCell(activeKeys[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      focusCell(activeKeys[activeKeys.length - 1]);
    }
  }

  function checkAnswers() {
    setChecked(true);
    if (correctEntries === puzzle.entries.length) {
      setMessage("Баяр хүргэе! Бүх 6 үгийг зөв бөглөлөө.");
    } else if (filled === 0) {
      setMessage("Эхлээд тайлбараа сонгоод үсгээ оруулаарай.");
    } else {
      const empty = cells.size - filled;
      const incorrect = [...cells].filter(
        ([key, cell]) => answers[key] && answers[key] !== cell.answer,
      ).length;
      setMessage(
        `${correctEntries}/6 үг зөв.${empty ? ` ${empty} нүд хоосон байна.` : ""}${incorrect ? " Улаан нүднүүдээ дахин шалгаарай." : " Оруулсан үсгүүд зөв байна. Үргэлжлүүлээрэй."}`,
      );
    }
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    setMessage("Сүлжээг цэвэрлэлээ. Дахин эхлээрэй.");
    focusCell(entryCells(firstEntry)[0], firstEntry);
  }

  function reveal() {
    setAnswers(
      Object.fromEntries([...cells].map(([key, cell]) => [key, cell.answer])),
    );
    setChecked(true);
    setMessage(
      "Хариунуудыг харууллаа. «Дахин эхлэх» товчоор өөрийгөө сорьж болно.",
    );
  }

  return (
    <section
      className={styles.exercise}
      aria-labelledby={`puzzle-${puzzle.id}`}
    >
      <div className={styles.exerciseHeading}>
        <div>
          <h2 id={`puzzle-${puzzle.id}`}>{puzzle.title}</h2>
          <p className={styles.subtitle}>{puzzle.subtitle}</p>
        </div>
        <div
          className={styles.progress}
          aria-label={`${filled} үсэг бөглөсөн, нийт ${cells.size}`}
        >
          <span>
            <strong>{filled}</strong> / {cells.size}
          </span>
          <span className={styles.progressLabel}>үсэг бөглөсөн</span>
          <div className={styles.progressTrack} aria-hidden="true">
            <div style={{ width: `${(filled / cells.size) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.boardColumn}>
          <div className={styles.activeClue} id={`active-clue-${puzzle.id}`}>
            <span className={styles.activeClueNumber}>{active.number}</span>
            <div>
              <span className={styles.directionLabel}>
                {active.direction === "across" ? "Хөндлөн →" : "Босоо ↓"} ·{" "}
                {Array.from(active.answer).length} үсэг
              </span>
              <p>{active.clue}</p>
            </div>
          </div>

          <div className={styles.gridScroll}>
            <div
              className={styles.grid}
              role="group"
              aria-label={`${puzzle.title}, үсэг оруулах хүснэгт`}
              style={{ "--columns": puzzle.cols } as CSSProperties}
            >
              {Array.from({ length: puzzle.rows * puzzle.cols }, (_, index) => {
                const row = Math.floor(index / puzzle.cols);
                const col = index % puzzle.cols;
                const cell = cells.get(cellKey(row, col));
                if (!cell)
                  return (
                    <span
                      key={index}
                      className={styles.block}
                      aria-hidden="true"
                    />
                  );
                const value = answers[cell.key] ?? "";
                const isSelected = selected === cell.key;
                const state =
                  checked && value
                    ? value === cell.answer
                      ? styles.correct
                      : styles.incorrect
                    : "";
                return (
                  <label
                    key={index}
                    className={`${styles.cell} ${activeKeys.includes(cell.key) ? styles.inWord : ""} ${state} ${isSelected ? styles.selected : ""}`}
                    data-cell={cell.key}
                  >
                    {cell.number && (
                      <span className={styles.cellNumber} aria-hidden="true">
                        {cell.number}
                      </span>
                    )}
                    <input
                      ref={(element) => {
                        if (element) inputs.current.set(cell.key, element);
                        else inputs.current.delete(cell.key);
                      }}
                      type="text"
                      inputMode="text"
                      maxLength={1}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      value={value}
                      tabIndex={isSelected ? 0 : -1}
                      aria-label={`Мөр ${row + 1}, багана ${col + 1}${cell.number ? `, ${cell.number}-р үгийн эхлэл` : ""}`}
                      aria-describedby={`active-clue-${puzzle.id}`}
                      aria-invalid={checked && !!value && value !== cell.answer}
                      onPointerDown={(event) => {
                        pointerWasFocused.current =
                          document.activeElement === event.currentTarget;
                      }}
                      onClick={() => {
                        if (pointerWasFocused.current) switchDirection(cell);
                        pointerWasFocused.current = false;
                      }}
                      onFocus={(event) => {
                        setSelected(cell.key);
                        if (!activeKeys.includes(cell.key)) {
                          setActiveId(
                            (
                              cell.entries.find(
                                (entry) => entry.direction === active.direction,
                              ) ?? cell.entries[0]
                            ).id,
                          );
                        }
                        event.currentTarget.select();
                      }}
                      onChange={(event) => {
                        const value = letters(event.target.value)[0] ?? "";
                        updateAnswer(cell.key, value);
                        if (value) advance(cell.key);
                      }}
                      onKeyDown={(event) => handleKey(event, cell)}
                      onPaste={(event) => {
                        event.preventDefault();
                        const pasted = letters(
                          event.clipboardData.getData("text"),
                        );
                        const start = activeKeys.indexOf(cell.key);
                        const available = activeKeys.slice(
                          start,
                          start + pasted.length,
                        );
                        if (!available.length) return;
                        setAnswers((previous) => ({
                          ...previous,
                          ...Object.fromEntries(
                            available.map((key, index) => [key, pasted[index]]),
                          ),
                        }));
                        setChecked(false);
                        setMessage("");
                        focusCell(available[available.length - 1]);
                      }}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.checkButton}
              onClick={checkAnswers}
            >
              Хариу шалгах <Arrow />
            </button>
            <button
              type="button"
              className={styles.resetButton}
              onClick={reset}
            >
              Дахин эхлэх
            </button>
          </div>
        </div>

        <div className={styles.clues}>
          {(["across", "down"] as Direction[]).map((direction) => (
            <section className={styles.clueSection} key={direction}>
              <h3>
                <span>{direction === "across" ? "→" : "↓"}</span>{" "}
                {direction === "across" ? "Хөндлөн" : "Босоо"}
                <small>3 үг</small>
              </h3>
              <ol>
                {puzzle.entries
                  .filter((entry) => entry.direction === direction)
                  .map((entry) => {
                    const solved =
                      checked &&
                      entryCells(entry).every(
                        (key, index) =>
                          answers[key] === Array.from(entry.answer)[index],
                      );
                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          className={`${styles.clueButton} ${active.id === entry.id ? styles.activeClueButton : ""}`}
                          onClick={() => selectEntry(entry)}
                          aria-pressed={active.id === entry.id}
                        >
                          <span className={styles.clueNumber}>
                            {entry.number}
                          </span>
                          <span>
                            {entry.clue}
                            <span className={styles.letterCount}>
                              {Array.from(entry.answer).length} үсэг
                              {solved ? " · Зөв ✓" : ""}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
              </ol>
            </section>
          ))}
          <div className={styles.revealArea}>
            <span>Тусламж хэрэгтэй бол</span>
            <button type="button" onClick={reveal}>
              Хариунуудыг харах
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CrosswordExercise({ backHref }: { backHref: string }) {
  const [activePuzzle, setActivePuzzle] = useState(0);
  const tabRefs = useRef(new Map<number, HTMLButtonElement>());

  function selectTab(index: number) {
    setActivePuzzle(index);
    tabRefs.current.get(index)?.focus();
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.topbar} aria-label="Хуудасны навигац">
          <a href={backHref} className={styles.brand}>
            Амьдрал <span>3.0</span>
          </a>
          <a href={backHref} className={styles.backLink}>
            <Arrow back /> Слайд руу буцах
          </a>
        </nav>

        <header className={styles.header}>
          <div>
            <h1>Үгийн сүлжээ</h1>
          </div>
          <div className={styles.headerNote}>
            <div className={styles.gridMark} aria-hidden="true">
              {Array.from({ length: 9 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
          </div>
        </header>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Үгийн сүлжээ сонгох"
        >
          {crosswords.map((puzzle, index) => (
            <button
              key={puzzle.id}
              ref={(element) => {
                if (element) tabRefs.current.set(index, element);
                else tabRefs.current.delete(index);
              }}
              type="button"
              role="tab"
              id={`tab-${puzzle.id}`}
              aria-controls={`panel-${puzzle.id}`}
              aria-selected={activePuzzle === index}
              tabIndex={activePuzzle === index ? 0 : -1}
              className={`${styles.tab} ${activePuzzle === index ? styles.activeTab : ""}`}
              onClick={() => setActivePuzzle(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  selectTab(
                    (index +
                      (event.key === "ArrowRight" ? 1 : -1) +
                      crosswords.length) %
                      crosswords.length,
                  );
                } else if (event.key === "Home" || event.key === "End") {
                  event.preventDefault();
                  selectTab(event.key === "Home" ? 0 : crosswords.length - 1);
                }
              }}
            >
              <span className={styles.tabNumber}>0{index + 1}</span>
              <span>{puzzle.title}</span>
              <span className={styles.tabArrow} aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>

        {crosswords.map((puzzle, index) => (
          <div
            key={puzzle.id}
            role="tabpanel"
            id={`panel-${puzzle.id}`}
            aria-labelledby={`tab-${puzzle.id}`}
            hidden={activePuzzle !== index}
          >
            <CrosswordBoard puzzle={puzzle} />
          </div>
        ))}
      </div>
    </main>
  );
}
