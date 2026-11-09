"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { slides } from "@/slides";
import { importedAssetsBySlide } from "@/slides/imported";

const W = 1920;
const H = 1080;

// Crisp, luxury Apple Keynote depth-slide transition
const slideV: Variants = {
  enter: (d: number) => ({
    x: d > 0 ? "8%" : "-8%",
    opacity: 0,
    scale: 0.985,
    zIndex: 2,
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
    zIndex: 2,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
      opacity: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: (d: number) => ({
    x: d > 0 ? "-8%" : "8%",
    opacity: 0,
    scale: 0.985,
    zIndex: 1,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1],
      opacity: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
    },
  }),
};

const pad = (n: number) => String(n).padStart(2, "0");

/* SVG Icons */
function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

export default function Deck() {
  const total = slides.length;
  const [ready, setReady] = useState(false);
  const [[index, dir], setPage] = useState<[number, number]>([0, 1]);
  const [scale, setScale] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback(
    (target: number) => {
      const t = Math.max(0, Math.min(total - 1, target));
      setPage((prev) => {
        if (t === prev[0]) return prev;
        return [t, t > prev[0] ? 1 : -1];
      });
      setStartedAt((s) => s ?? Date.now());
    },
    [total],
  );

  const step = useCallback(
    (delta: number) => {
      setPage((prev) => {
        const next = Math.max(0, Math.min(total - 1, prev[0] + delta));
        if (next === prev[0]) return prev;
        return [next, delta > 0 ? 1 : -1];
      });
      setStartedAt((s) => s ?? Date.now());
    },
    [total],
  );

  // URL hash sync
  useEffect(() => {
    const n = parseInt(window.location.hash.replace("#", ""), 10);
    if (!Number.isNaN(n)) {
      const target = Math.max(0, Math.min(total - 1, n - 1));
      setPage([target, 1]);
    }
    setReady(true);
  }, [total]);

  useEffect(() => {
    if (ready) window.history.replaceState(null, "", `#${index + 1}`);
  }, [index, ready]);

  // Exact 1920×1080 stage fitting
  useEffect(() => {
    const fit = () =>
      setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const onButton = e.target instanceof HTMLButtonElement;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          step(1);
          break;
        case " ":
        case "Enter":
          if (onButton) return;
          e.preventDefault();
          step(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          e.preventDefault();
          step(-1);
          break;
        case "Home":
          goTo(0);
          break;
        case "End":
          goTo(total - 1);
          break;
        case "f":
        case "F":
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen?.();
          break;
        case "n":
        case "N":
          setShowNotes((v) => !v);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, goTo, total]);

  useEffect(() => {
    if (!showNotes) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [showNotes]);

  // Preload nearby images
  useEffect(() => {
    if (!ready) return;
    const srcs = [
      "tegmark",
      "cover-us-2017",
      "cover-uk-2017",
      "cover-us-2018",
      "cover-uk-2018",
      "cover-mn",
      "cover-omu",
      "deep-field",
      "earth",
      "life1-ecoli",
      "life2-child",
      "life3-asimo",
      "larry-page",
      "elon-musk",
      "andrew-ng",
      "stuart-russell",
      "chip-die",
      "deep-blue",
      "hopfield",
      "turing",
      "neurons",
      "ub-traffic",
    ];
    srcs.forEach((s) => {
      const img = new Image();
      img.src = `/img/${s}.jpg`;
    });
    const nearbyAssets = [slides[index], slides[index + 1], slides[index - 1]]
      .filter(Boolean)
      .flatMap((slide) => importedAssetsBySlide[slide.id] ?? []);
    nearbyAssets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [ready, index]);

  const current = slides[index];
  const Current = current.Component;
  const elapsed = startedAt
    ? Math.max(0, Math.floor((now - startedAt) / 1000))
    : 0;

  return (
    <MotionConfig reducedMotion="user">
      <main
        className="viewport"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {/* Subtle architectural ambient lighting */}
        <div className="viewport-ambient" />

        {/* 1920×1080 Presentation Canvas */}
        <div
          className="stage"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity: ready ? 1 : 0,
          }}
        >
          {/* Top Progress Line */}
          <div className="progress-track">
            <motion.div
              className="progress-bar"
              animate={{ scaleX: (index + 1) / total }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <AnimatePresence mode="popLayout" custom={dir}>
            {ready && (
              <motion.section
                key={index}
                className={`slide slide-${current.id}${current.id.startsWith("chapter") || current.id.startsWith("consciousness") ? " chapter3-slide" : ""}`}
                custom={dir}
                variants={slideV}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <Current />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Keynote Presentation HUD Controls */}
        <nav className="keynote-hud">
          <div className="hud-pill">
            <div className="hud-brand">
              <span className="hud-brand-title">Амьдрал 3.0</span>
              <span className="hud-brand-sep">·</span>
              <span className="hud-brand-author">Макс Тегмарк</span>
            </div>

            <div className="hud-divider" />

            <AnimatePresence mode="wait">
              <motion.span
                key={current.section}
                className="hud-section"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {current.section}
              </motion.span>
            </AnimatePresence>

            <div className="hud-divider" />

            <div className="hud-nav">
              <button
                type="button"
                className="hud-btn"
                aria-label="Өмнөх слайд"
                disabled={index === 0}
                onClick={() => step(-1)}
              >
                <ChevronLeft />
              </button>

              <span className="hud-counter">
                <b>{pad(index + 1)}</b>
                <span className="hud-counter-total">/ {pad(total)}</span>
              </span>

              <button
                type="button"
                className="hud-btn"
                aria-label="Дараах слайд"
                disabled={index === total - 1}
                onClick={() => step(1)}
              >
                <ChevronRight />
              </button>
            </div>

            <div className="hud-divider" />

            <div className="hud-tools">
              <button
                type="button"
                className={`hud-tool-btn${showNotes ? " is-active" : ""}`}
                aria-label="Тэмдэглэл харах (N)"
                title="Илтгэгчийн тэмдэглэл (N)"
                onClick={() => setShowNotes((v) => !v)}
              >
                <NotesIcon />
                <span>Тэмдэглэл</span>
              </button>

              <button
                type="button"
                className="hud-tool-btn"
                aria-label="Бүтэн дэлгэц (F)"
                title="Бүтэн дэлгэц (F)"
                onClick={() => {
                  if (document.fullscreenElement) document.exitFullscreen();
                  else document.documentElement.requestFullscreen?.();
                }}
              >
                <FullscreenIcon />
              </button>
            </div>
          </div>
        </nav>

        {/* Presenter Notes Panel */}
        <AnimatePresence>
          {showNotes && (
            <motion.aside
              className="notes"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="notes-head">
                <span className="notes-badge">
                  Илтгэгчийн тэмдэглэл · {index + 1} / {total}
                </span>
                <span className="timer">
                  {Math.floor(elapsed / 60)}:{pad(elapsed % 60)}
                </span>
              </div>
              <p className="notes-body">{current.notes}</p>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
