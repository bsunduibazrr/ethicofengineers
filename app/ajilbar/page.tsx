import type { Metadata } from "next";
import content from "@/slides/content.source.json";
import CrosswordExercise from "./CrosswordExercise";

export const metadata: Metadata = {
  title: "life3.0",
  description: "life3.0",
};

export default function AjilbarPage() {
  const closingSlide = content.find((slide) => slide.id === "thanks");
  return (
    <CrosswordExercise
      backHref={`/#${closingSlide?.order ?? content.length}`}
    />
  );
}
