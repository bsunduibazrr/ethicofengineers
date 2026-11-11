"use client";
import { useEffect, useRef } from "react";
import content from "@/slides/content.source.json";
import { mountDeck, type SourceSlide } from "./deck-runtime";

export default function Deck() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (root.current) return mountDeck(root.current, content as SourceSlide[]);
  }, []);
  return <main ref={root} className="deck-root" aria-label="Амьдрал 3.0" />;
}
