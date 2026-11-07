import slide21 from "./chapter3-data/slide-21";
import slide22 from "./chapter3-data/slide-22";
import slide23 from "./chapter3-data/slide-23";
import slide24 from "./chapter3-data/slide-24";
import slide25 from "./chapter3-data/slide-25";
import slide26 from "./chapter3-data/slide-26";
import slide27 from "./chapter3-data/slide-27";
import slide28 from "./chapter3-data/slide-28";
import slide29 from "./chapter3-data/slide-29";
import slide30 from "./chapter3-data/slide-30";
import slide31 from "./chapter3-data/slide-31";

export const chapter3SlideData = [
  slide21,
  slide22,
  slide23,
  slide24,
  slide25,
  slide26,
  slide27,
  slide28,
  slide29,
  slide30,
  slide31,
] as const;

export const chapter3AssetPaths = Array.from(
  new Set(
    chapter3SlideData.flatMap((slide) =>
      slide.nodes.flatMap((node) => ("src" in node ? [node.src] : [])),
    ),
  ),
);
