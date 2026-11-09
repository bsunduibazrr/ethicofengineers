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
import { importedAssetsBySlide } from "@/slides/imported";
import { EASE, EASE_IN_OUT } from "./ui";

const W = 1920;
const H = 1080;

// Ultra-premium 3D cinematic spatial slide transition
const slideV: Variants = {
  enter: (d: number) => ({
    x: d > 0 ? "14%" : "-14%",
    rotateY: d > 0 ? -7 : 7,
    z: -120,
    scale: 0.91,
    opacity: 0,
    filter: "blur(14px)",
    zIndex: 2,
  }),
  center: {
    x: "0%",
    rotateY: 0,
    z: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    zIndex: 2,
    transition: {
      duration: 0.68,
      ease: [0.19, 1, 0.22, 1],
      opacity: { duration: 0.45, ease: [0.19, 1, 0.22, 1] },
      scale: { type: "spring", stiffness: 240, damping: 28, mass: 0.8 },
      filter: { duration: 0.52, ease: [0.19, 1, 0.22, 1] },
      delayChildren: 0.12,
      staggerChildren: 0.05,
    },
  },
  exit: (d: number) => ({
    x: d > 0 ? "-14%" : "14%",
    rotateY: d > 0 ? 7 : -7,
    z: -120,
    scale: 0.91,
    opacity: 0,
    filter: "blur(14px)",
    zIndex: 1,
    transition: {
      duration: 0.52,
      ease: [0.65, 0, 0.35, 1],
      opacity: { duration: 0.35 },
      filter: { duration: 0.45 },
    },
  }),
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

  // Эхлэхдээ URL-ын #дугаараас слайдаа сэргээнэ
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
    const nearbyAssets = [slides[index], slides[index + 1]]
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
        {/* Ambient cosmic void with dynamic volumetric aura */}
        <div className="viewport-cosmos" aria-hidden="true">
          <motion.div
            className="cosmos-orb cosmos-orb-cyan"
            animate={{
              x: [-40, 50, -20, -40],
              y: [-30, 40, -50, -30],
              scale: [1, 1.15, 0.95, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="cosmos-orb cosmos-orb-violet"
            animate={{
              x: [30, -40, 20, 30],
              y: [40, -30, 30, 40],
              scale: [0.95, 1.2, 1, 0.95],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="cosmos-stars" />
        </div>

        <div
          className="stage"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity: ready ? 1 : 0,
            perspective: 1800,
          }}
        >
          {/* Futuristic Stage Corner Accents */}
          <div className="stage-corner stage-corner-tl" />
          <div className="stage-corner stage-corner-tr" />
          <div className="stage-corner stage-corner-bl" />
          <div className="stage-corner stage-corner-br" />

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

          <div className="progress-container">
            <motion.div
              className="progress"
              animate={{ scaleX: (index + 1) / total }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            />
            <motion.div
              className="progress-beacon"
              animate={{ left: `${((index + 1) / total) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            />
          </div>

          <footer className="footer">
            <div className="footer-brand">
              <span className="brand-dot" />
              <i>Амьдрал 3.0</i> <span className="brand-sep">/</span> <span>Макс Тегмарк</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.section}
                className="footer-section-pill"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              >
                <span className="pill-dot" />
                <span className="footer-section">{current.section}</span>
              </motion.div>
            </AnimatePresence>
            <div className="footer-nav">
              <span className="footer-hint">← / → Гүйлгэх</span>
              <motion.button
                aria-label="Өмнөх слайд"
                disabled={index === 0}
                onClick={(e) => {
                  step(-1);
                  e.currentTarget.blur();
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
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
                transition={{ duration: 0.15 }}
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
