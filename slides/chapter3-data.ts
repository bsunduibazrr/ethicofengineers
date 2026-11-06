import slide21 from "./chapter3-data/slide-21";
import slide22 from "./chapter3-data/slide-22";
import slide23 from "./chapter3-data/slide-23";
import slide24 from "./chapter3-data/slide-24";
import slide25 from "./chapter3-data/slide-25";
import slide26 from "./chapter3-data/slide-26";
import slide27 from "./chapter3-data/slide-27";

export const chapter3SlideData = [
  slide21,
  slide22,
  slide23,
  slide24,
  slide25,
  slide26,
  slide27,
] as const;

export const chapter3AssetPaths = Array.from(
  new Set(
    chapter3SlideData.flatMap((slide) =>
      slide.nodes.flatMap((node) => ("src" in node ? [node.src] : [])),
    ),
  ),
);
