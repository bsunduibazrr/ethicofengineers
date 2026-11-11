"use client";
import { useEffect, useRef } from "react";
import content from "@/slides/content.source.json";
import design from "@/slides/design.json";
import { mountDeck, type SourceSlide } from "./deck-runtime";

/** Frozen copy + the shared-template layouts for the imported chapters. */
const layouts = design as Record<string, string>;
const deck = (content as SourceSlide[]).map(slide => (layouts[slide.id] ? { ...slide, html: layouts[slide.id] } : slide));

export default function Deck() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (root.current) return mountDeck(root.current, deck);
  }, []);
  return <main ref={root} className="deck-root" aria-label="Амьдрал 3.0" />;
}
