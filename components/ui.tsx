"use client";

import { motion, type MotionStyle, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IN = [0.7, 0, 0.84, 0] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

// Слайдын доторх элементүүд ээлжлэн, зөөлөн гарч ирнэ
export const itemV: Variants = {
  enter: { opacity: 0, y: 40, scale: 0.95 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: EASE,
      opacity: { duration: 0.7 },
      scale: { type: "spring", stiffness: 200, damping: 24, mass: 0.8 },
    },
  },
  exit: {},
};

// Зураг дээрээс доош "нээгдэж", дотроо бага зэрэг томролтоос буурна
const photoV: Variants = {
  enter: { clipPath: "inset(0% 0% 100% 0%)", filter: "blur(6px)" },
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE },
  },
  exit: {},
};

const photoImgV: Variants = {
  enter: { scale: 1.14 },
  center: {
    scale: 1.02,
    transition: { duration: 1.6, ease: EASE },
  },
  exit: {},
};

const groupV: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.08 } },
  exit: {},
};

// ---- New animation variants ----

/** Scale-in for cards */
export const scaleInV: Variants = {
  enter: { opacity: 0, scale: 0.8 },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASE,
      scale: { type: "spring", stiffness: 220, damping: 22 },
    },
  },
  exit: {},
};

/** Slide in from the left */
export const slideInLeftV: Variants = {
  enter: { opacity: 0, x: -60 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE },
  },
  exit: {},
};

/** Slide in from the right */
export const slideInRightV: Variants = {
  enter: { opacity: 0, x: 60 },
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE },
  },
  exit: {},
};

/** Subtle glow pulse */
export const glowPulseV: Variants = {
  enter: { opacity: 0 },
  center: {
    opacity: [0.4, 0.8, 0.4],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
  exit: { opacity: 0 },
};

type BoxProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Reveal — ээлжлэн гарч ирэх блок */
export function R({ children, className, style }: BoxProps) {
  return (
    <motion.div className={className} style={style} variants={itemV}>
      {children}
    </motion.div>
  );
}

/** Group — доторх R-үүдээ дахин ээлжлүүлнэ */
export function Group({ children, className, style }: BoxProps) {
  return (
    <motion.div className={className} style={style} variants={groupV}>
      {children}
    </motion.div>
  );
}

export function Photo({
  src,
  alt,
  credit,
  className,
  style,
  pos,
  fit = "cover",
}: {
  src: string;
  alt: string;
  credit?: string;
  className?: string;
  style?: CSSProperties;
  pos?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <figure className={`photo ${className ?? ""}`} style={style}>
      <motion.div
        className="photo-frame photo-hover"
        variants={photoV}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <motion.img
          src={src}
          alt={alt}
          variants={photoImgV}
          style={{ objectFit: fit, objectPosition: pos }}
          draggable={false}
        />
      </motion.div>
      {credit && <figcaption>{credit}</figcaption>}
    </figure>
  );
}

/** Номын хавтас — сүүдэртэй, зөөлөн гарч ирнэ */
export function BookCover({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: MotionStyle;
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`book-cover ${className ?? ""}`}
      style={style}
      variants={itemV}
      draggable={false}
    />
  );
}

export function Header({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="header">
      <R className="kicker">
        <motion.span
          className="kicker-bar"
          style={{
            display: "block",
            width: 40,
            height: 3,
            marginBottom: 12,
            borderRadius: 2,
            background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
          }}
          variants={{
            enter: { scaleX: 0, originX: 0 },
            center: {
              scaleX: 1,
              transition: { duration: 0.7, ease: EASE },
            },
            exit: {},
          }}
        />
        {kicker}
      </R>
      <R>
        <h2 className="title">{title}</h2>
      </R>
      {sub && <R className="sub">{sub}</R>}
    </div>
  );
}
