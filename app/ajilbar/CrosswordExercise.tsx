"use client";

import { useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import {
  crosswords,
  type CrosswordEntry,
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

// Зөвхөн нэг сүлжээ ашиглана
const puzzle = crosswords[0];

const cellKey = (row: number, col: number) => `${row}:${col}`;
const toLetter = (value: string) =>
  value
    .normalize("NFKC")
    .toUpperCase()
    .match(/[А-ЯЁӨҮ]/u)?.[0] ?? "";
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

export default function CrosswordExercise({ backHref }: { backHref: string }) {
  const cells = useMemo(() => {
    const map = new Map<string, Cell>();
    for (const entry of puzzle.entries) {
      const letters = Array.from(entry.answer);
      entryCells(entry).forEach((key, index) => {
        const cell = map.get(key) ?? {
          key,
          row: entry.row + (entry.direction === "down" ? index : 0),
          col: entry.col + (entry.direction === "across" ? index : 0),
          answer: letters[index],
          entries: [],
        };
        cell.entries.push(entry);
        if (index === 0) cell.number = entry.number;
        map.set(key, cell);
      });
    }
    return map;
  }, []);

  const firstEntry = puzzle.entries.find((e) => e.direction === "across")!;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState(firstEntry.id);
  const [selected, setSelected] = useState(entryCells(firstEntry)[0]);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("");
  const inputs = useRef(new Map<string, HTMLInputElement>());

  const active = puzzle.entries.find((e) => e.id === activeId) ?? firstEntry;
  const activeKeys = entryCells(active);
  const filled = [...cells.keys()].filter((key) => answers[key]).length;
  const isSolved = (entry: CrosswordEntry) =>
    entryCells(entry).every(
      (key, i) => answers[key] === Array.from(entry.answer)[i],
    );
  const total = puzzle.entries.length;

  function focusCell(key: string, entry = active) {
    const cell = cells.get(key);
    if (!cell) return;
    const next =
      cell.entries.find((e) => e.id === entry.id) ??
      cell.entries.find((e) => e.direction === entry.direction) ??
      cell.entries[0];
    setSelected(key);
    setActiveId(next.id);
    requestAnimationFrame(() => inputs.current.get(key)?.select());
    inputs.current.get(key)?.focus();
  }

  function selectEntry(entry: CrosswordEntry) {
    const keys = entryCells(entry);
    focusCell(keys.find((key) => !answers[key]) ?? keys[0], entry);
  }

  function setLetter(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setChecked(false);
    setMessage("");
  }

  function switchDirection(cell: Cell) {
    const other = cell.entries.find((e) => e.id !== active.id);
    if (other) focusCell(cell.key, other);
  }

  function handleKey(event: KeyboardEvent<HTMLInputElement>, cell: Cell) {
    const moves: Record<string, [number, number, Direction]> = {
      ArrowLeft: [0, -1, "across"],
      ArrowRight: [0, 1, "across"],
      ArrowUp: [-1, 0, "down"],
      ArrowDown: [1, 0, "down"],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      const [dr, dc, direction] = move;
      const entry = cell.entries.find((e) => e.direction === direction);
      const next = cellKey(cell.row + dr, cell.col + dc);
      focusCell(cells.has(next) ? next : cell.key, entry ?? active);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      if (answers[cell.key]) setLetter(cell.key, "");
      else {
        const prev = activeKeys[activeKeys.indexOf(cell.key) - 1];
        if (prev) {
          setLetter(prev, "");
          focusCell(prev);
        }
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      switchDirection(cell);
    }
  }

  function checkAnswers() {
    setChecked(true);
    const correct = puzzle.entries.filter(isSolved).length;
    if (correct === total)
      setMessage(`Баяр хүргэе! Бүх ${total} үгийг зөв бөглөлөө.`);
    else if (filled === 0)
      setMessage("Эхлээд тайлбараа сонгоод үсгээ оруулаарай.");
    else
      setMessage(
        `${correct}/${total} үг зөв. Улаан нүднүүдээ дахин шалгаарай.`,
      );
  }

  function reveal() {
    setAnswers(
      Object.fromEntries([...cells].map(([key, cell]) => [key, cell.answer])),
    );
    setChecked(true);
    setMessage(
      "Хариунуудыг харууллаа. «Дахин эхлэх» товчоор дахин оролдоорой.",
    );
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    setMessage("");
    focusCell(entryCells(firstEntry)[0], firstEntry);
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
          <h1>Үгийн сүлжээ</h1>
        </header>

        <section className={styles.exercise} aria-labelledby="puzzle-title">
          <div className={styles.exerciseHeading}>
            <div>
              <h2 id="puzzle-title">{puzzle.title}</h2>
              <p className={styles.subtitle}>{puzzle.subtitle}</p>
            </div>
            <div className={styles.progress}>
              <span>
                <strong>{filled}</strong> / {cells.size}
              </span>
              <span className={styles.progressLabel}>үсэг бөглөсөн</span>
            </div>
          </div>

          <div className={styles.workspace}>
            <div className={styles.boardColumn}>
              <div className={styles.activeClue} id="active-clue">
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
                  aria-label="Үсэг оруулах хүснэгт"
                  style={{ "--columns": puzzle.cols } as CSSProperties}
                >
                  {Array.from({ length: puzzle.rows * puzzle.cols }, (_, i) => {
                    const row = Math.floor(i / puzzle.cols);
                    const col = i % puzzle.cols;
                    const cell = cells.get(cellKey(row, col));
                    if (!cell)
                      return (
                        <span
                          key={i}
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
                        key={i}
                        className={`${styles.cell} ${activeKeys.includes(cell.key) ? styles.inWord : ""} ${state} ${isSelected ? styles.selected : ""}`}
                      >
                        {cell.number && (
                          <span
                            className={styles.cellNumber}
                            aria-hidden="true"
                          >
                            {cell.number}
                          </span>
                        )}
                        <input
                          ref={(el) => {
                            if (el) inputs.current.set(cell.key, el);
                            else inputs.current.delete(cell.key);
                          }}
                          type="text"
                          maxLength={1}
                          autoComplete="off"
                          autoCapitalize="characters"
                          spellCheck={false}
                          value={value}
                          tabIndex={isSelected ? 0 : -1}
                          aria-label={`Мөр ${row + 1}, багана ${col + 1}`}
                          aria-describedby="active-clue"
                          aria-invalid={
                            checked && !!value && value !== cell.answer
                          }
                          onClick={() => {
                            if (isSelected) switchDirection(cell);
                          }}
                          onFocus={(e) => {
                            setSelected(cell.key);
                            if (!activeKeys.includes(cell.key)) {
                              setActiveId(
                                (
                                  cell.entries.find(
                                    (en) => en.direction === active.direction,
                                  ) ?? cell.entries[0]
                                ).id,
                              );
                            }
                            e.currentTarget.select();
                          }}
                          onChange={(e) => {
                            const letter = toLetter(e.target.value);
                            setLetter(cell.key, letter);
                            const next =
                              activeKeys[activeKeys.indexOf(cell.key) + 1];
                            if (letter && next) focusCell(next);
                          }}
                          onKeyDown={(e) => handleKey(e, cell)}
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
                  onClick={reveal}
                >
                  Хариу харах
                </button>
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={reset}
                >
                  Дахин эхлэх
                </button>
              </div>
              <p role="status">{message}</p>
            </div>

            <div className={styles.clues}>
              {(["across", "down"] as Direction[]).map((direction) => {
                const list = puzzle.entries.filter(
                  (e) => e.direction === direction,
                );
                return (
                  <section className={styles.clueSection} key={direction}>
                    <h3>
                      <span>{direction === "across" ? "→" : "↓"}</span>{" "}
                      {direction === "across" ? "Хөндлөн" : "Босоо"}
                      <small>{list.length} үг</small>
                    </h3>
                    <ol>
                      {list.map((entry) => (
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
                                {checked && isSolved(entry) ? " · Зөв ✓" : ""}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
