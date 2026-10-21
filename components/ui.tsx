'use client';

import { motion, type MotionStyle, type Variants } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IN = [0.7, 0, 0.84, 0] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

// Слайдын доторх элементүүд ээлжлэн, зөөлөн гарч ирнэ
export const itemV: Variants = {
  enter: { opacity: 0, y: 26 },
  center: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
  exit: {},
};

// Зураг дээрээс доош «нээгдэж», дотроо бага зэрэг томролтоос буурна
const photoV: Variants = {
  enter: { clipPath: 'inset(0% 0% 100% 0%)' },
  center: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: EASE } },
  exit: {},
};

const photoImgV: Variants = {
  enter: { scale: 1.14 },
  center: { scale: 1, transition: { duration: 1.6, ease: EASE } },
  exit: {},
};

const groupV: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.08 } },
  exit: {},
};

type BoxProps = { children?: ReactNode; className?: string; style?: CSSProperties };

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
  fit = 'cover',
}: {
  src: string;
  alt: string;
  credit?: string;
  className?: string;
  style?: CSSProperties;
  pos?: string;
  fit?: 'cover' | 'contain';
}) {
  return (
    <figure className={`photo ${className ?? ''}`} style={style}>
      <motion.div className="photo-frame" variants={photoV}>
        <motion.img src={src} alt={alt} variants={photoImgV} style={{ objectFit: fit, objectPosition: pos }} draggable={false} />
      </motion.div>
      {credit && <figcaption>{credit}</figcaption>}
    </figure>
  );
}

/** Номын хавтас — сүүдэртэй, зөөлөн гарч ирнэ */
export function BookCover({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: MotionStyle }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`book-cover ${className ?? ''}`}
      style={style}
      variants={itemV}
      draggable={false}
    />
  );
}

export function Header({ kicker, title, sub }: { kicker: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="header">
      <R className="kicker">{kicker}</R>
      <R>
        <h2 className="title">{title}</h2>
      </R>
      {sub && <R className="sub">{sub}</R>}
    </div>
  );
}
