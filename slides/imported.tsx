import type { ComponentType } from "react";
import importedPptxData from "./imported-pptx.json";
import { PptxSlideView, type SlideData } from "./chapter3";

type ImportedDeckKey = "chapter3" | "chapter4" | "chapter6" | "consciousness";

type ImportedSlideDef = {
  id: string;
  section: string;
  Component: ComponentType;
  notes: string;
  transition?: "morph";
};

const decks = importedPptxData as Record<ImportedDeckKey, SlideData[]>;

function makeSlides(deckKey: ImportedDeckKey, section: string, idPrefix: string): ImportedSlideDef[] {
  return decks[deckKey].map((data, index) => {
    const Component: ComponentType = () => <PptxSlideView data={data} />;

    return {
      id: `${idPrefix}-${String(index + 1).padStart(2, "0")}`,
      section,
      Component,
      notes: data.notes ?? "",
    };
  });
}

export const importedChapter3Slides = makeSlides("chapter3", "3-р бүлэг", "chapter3");
export const importedChapter4Slides = makeSlides("chapter4", "4-р бүлэг", "chapter4");
export const importedChapter6Slides = makeSlides("chapter6", "6-р бүлэг", "chapter6");
export const importedConsciousnessSlides = makeSlides("consciousness", "Ухамсар", "consciousness");

const slideDefsByDeck: [ImportedDeckKey, ImportedSlideDef[]][] = [
  ["chapter3", importedChapter3Slides],
  ["chapter4", importedChapter4Slides],
  ["chapter6", importedChapter6Slides],
  ["consciousness", importedConsciousnessSlides],
];

export const importedAssetsBySlide: Record<string, string[]> = Object.fromEntries(
  slideDefsByDeck.flatMap(([deckKey, slideDefs]) =>
    slideDefs.map((slide, index) => [
      slide.id,
      decks[deckKey][index].nodes.flatMap((node) =>
        node.kind === "image" ? [node.src] : [],
      ),
    ]),
  ),
);

export const importedAssetPaths = Array.from(
  new Set(Object.values(importedAssetsBySlide).flat()),
);
