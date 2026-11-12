import type { Metadata } from "next";
import content from "@/slides/content.source.json";
import CrosswordExercise from "./CrosswordExercise";

export const metadata: Metadata = {
  title: "Үгийн сүлжээ · Амьдрал 3.0",
  description:
    "Амьдрал 3.0 илтгэлийн нэр томьёо, эрдэмтдийн нэрийг бататгах хоёр үгийн сүлжээ. Сүлжээ бүр хөндлөн 3, босоо 3 үгтэй.",
};

export default function AjilbarPage() {
  const closingSlide = content.find((slide) => slide.id === "thanks");
  return <CrosswordExercise backHref={`/#${closingSlide?.order ?? content.length}`} />;
}
