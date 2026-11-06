"use client";

import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { slides } from "@/slides";
import { chapter3AssetPaths } from "@/slides/chapter3-data";
import { EASE, EASE_IN_OUT } from "./ui";

const W = 1920;
const H = 1080;
const PUSH = { duration: 0.7, ease: EASE_IN_OUT };
const MORPH = { duration: 2, ease: "easeInOut" as const };

// Cinematic depth-based slide transition with blur
const slideV: Variants = {
  enter: (d: number) =>
    d > 0
      ? { x: "5%", opacity: 0, scale: 0.96, filter: "blur(8px)", zIndex: 2 }
      : { x: "-5%", opacity: 0, scale: 0.96, filter: "blur(8px)", zIndex: 1 },
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    zIndex: 2,
    transition: {
      ...PUSH,
      opacity: { duration: 0.5, ease: EASE },
      scale: { type: "spring", stiffness: 180, damping: 26, mass: 0.9 },
      filter: { duration: 0.6, ease: EASE },
      zIndex: { duration: 0 },
      delayChildren: 0.35,
      staggerChildren: 0.06,
    },
  },
  exit: (d: number) =>
    d > 0
      ? {
          x: "-5%",
          opacity: 0,
          scale: 0.96,
          filter: "blur(8px)",
          zIndex: 1,
          transition: { ...PUSH, zIndex: { duration: 0 } },
        }
      : {
          x: "5%",
          opacity: 0,
          scale: 0.96,
          filter: "blur(8px)",
          zIndex: 3,
          transition: { ...PUSH, zIndex: { duration: 0 } },
        },
};

const morphV: Variants = {
  enter: { opacity: 0, scale: 0.985, filter: "blur(2px)", zIndex: 2 },
  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    zIndex: 2,
    transition: {
      ...MORPH,
      zIndex: { duration: 0 },
    },
  },
  exit: {
    opacity: 0,
    scale: 1.015,
    filter: "blur(2px)",
    zIndex: 1,
    transition: {
      ...MORPH,
      zIndex: { duration: 0 },
    },
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

/* SVG chevron arrow icons */
function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export default function Deck() {
  const total = slides.length;
  const [ready, setReady] = useState(false);
  const [[index, dir], setPage] = useState<[number, number]>([0, 1]);
  const [morphNav, setMorphNav] = useState(false);
  const [initialIndex, setInitialIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [showNotes, setShowNotes] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback(
    (target: number) => {
      const t = Math.max(0, Math.min(total - 1, target));
      setMorphNav(index >= 20 || t >= 20);
      setPage((prev) => {
        if (t === prev[0]) return prev;
        return [t, t > prev[0] ? 1 : -1];
      });
      setStartedAt((s) => s ?? Date.now());
    },
    [index, total],
  );

  const step = useCallback(
    (delta: number) => {
      const target = Math.max(0, Math.min(total - 1, index + delta));
      setMorphNav(index >= 20 || target >= 20);
      setPage((prev) => {
        const next = Math.max(0, Math.min(total - 1, prev[0] + delta));
        if (next === prev[0]) return prev;
        return [next, delta > 0 ? 1 : -1];
      });
      setStartedAt((s) => s ?? Date.now());
    },
    [index, total],
  );

  // Эхлэхдээ URL-ын #дугаараас слайдаа сэргээнэ
  useEffect(() => {
    const n = parseInt(window.location.hash.replace("#", ""), 10);
    if (!Number.isNaN(n)) {
      const target = Math.max(0, Math.min(total - 1, n - 1));
      setPage([target, 1]);
      setMorphNav(target >= 20);
      setInitialIndex(target);
    } else setInitialIndex(0);
    setReady(true);
  }, [total]);

  useEffect(() => {
    if (ready) window.history.replaceState(null, "", `#${index + 1}`);
  }, [index, ready]);

  // 1920×1080 тайзыг цонхонд яг багтаана — агуулга хэзээ ч слайдаас халихгүй
  useEffect(() => {
    const fit = () =>
      setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

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

  // Зургуудыг урьдчилан ачаална — шилжилтийн үед гацахгүй
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
    chapter3AssetPaths.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [ready]);

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
        {/* Subtle animated background gradient */}
        <motion.div
          className="viewport-bg"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(30,58,138,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(88,28,135,0.1) 0%, transparent 60%)",
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />

        <div
          className="stage"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity: ready ? 1 : 0,
          }}
        >
          <LayoutGroup id="presentation-morph">
            <AnimatePresence custom={dir}>
              {ready && (
                <motion.section
                  key={index}
                  className={`slide slide-${current.id}${current.id.startsWith("chapter3-") ? " chapter3-slide" : ""}`}
                  custom={dir}
                  variants={morphNav ? morphV : slideV}
                  initial={
                    current.transition === "morph" && index === initialIndex
                      ? false
                      : "enter"
                  }
                  animate="center"
                  exit="exit"
                >
                  <Current />
                </motion.section>
              )}
            </AnimatePresence>
          </LayoutGroup>

          <motion.div
            className="progress"
            animate={{ scaleX: (index + 1) / total }}
            transition={{ duration: 0.7, ease: EASE_IN_OUT }}
            style={{
              boxShadow: "0 0 8px 2px rgba(96,165,250,0.35)",
            }}
          />

          <footer className="footer">
            <span className="footer-brand">
              <i>Амьдрал 3.0</i> · Макс Тегмарк
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={current.section}
                className="footer-section"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {current.section}
              </motion.span>
            </AnimatePresence>
            <div className="footer-nav">
              <motion.button
                aria-label="Өмнөх слайд"
                disabled={index === 0}
                onClick={(e) => {
                  step(-1);
                  e.currentTarget.blur();
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft />
              </motion.button>
              <span className="page-no">
                {pad(index + 1)} <em>/ {pad(total)}</em>
              </span>
              <motion.button
                aria-label="Дараах слайд"
                disabled={index === total - 1}
                onClick={(e) => {
                  step(1);
                  e.currentTarget.blur();
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight />
              </motion.button>
            </div>
          </footer>
        </div>

        <AnimatePresence>
          {showNotes && (
            <motion.aside
              className="notes"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="notes-head">
                <span>
                  Илтгэгчийн тэмдэглэл · {index + 1}/{total}
                </span>
                <span className="timer">
                  {Math.floor(elapsed / 60)}:{pad(elapsed % 60)}
                </span>
              </div>
              <p>{current.notes}</p>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
