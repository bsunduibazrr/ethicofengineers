"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { chapter3SlideData } from "./chapter3-data";

export type Rect = { x: number; y: number; w: number; h: number };
export type Run = { text: string; style: Record<string, string | number> };
export type Paragraph = {
  align: "left" | "center" | "right" | "justify";
  marginLeft: number;
  indent: number;
  bullet: string;
  runs: Run[];
  spacingAfter?: number;
};
export type TextData = {
  body: {
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    anchor?: "top" | "middle" | "bottom";
    fontSize?: number;
    autoFit?: boolean;
  };
  paragraphs: Paragraph[];
};
export type PptxNode =
  | {
      kind: "image";
      rect: Rect;
      src: string;
      id: string;
      morphId?: string;
      alt?: string;
      fit?: "cover" | "contain" | "fill";
      objectPosition?: string;
      opacity?: number;
    }
  | {
      kind: "text";
      rect: Rect;
      text: TextData;
      id: string;
      morphId?: string;
      rotation?: number;
    }
  | {
      kind: "shape";
      rect: Rect;
      preset: string;
      fill: string | null;
      stroke: string | null;
      strokeWidth: number;
      id: string;
    }
  | {
      kind: "table";
      rect: Rect;
      cols: number[];
      rows: { h: number; cells: { text: TextData | null; fill: string }[] }[];
      id: string;
    };
export type SlideData = {
  sourceSlide: number;
  background:
    | { color: string }
    | { type: "linear"; angle: number; stops: { offset: number; color: string }[] };
  nodes: PptxNode[];
  notes?: string;
};

const sourceSlides = chapter3SlideData as unknown as SlideData[];

function fontStack() {
  return "var(--sans), sans-serif";
}

const canvasStyle: CSSProperties = {
  backgroundColor: "var(--bg)",
  backgroundImage:
    "radial-gradient(ellipse at 70% 10%, rgba(59, 130, 246, 0.04) 0%, transparent 60%), radial-gradient(ellipse at 10% 90%, rgba(30, 58, 138, 0.05) 0%, transparent 50%)",
};

function colorChannels(value: string): [number, number, number] | null {
  const hex = value.match(/^#([\da-f]{6})$/i);
  if (hex) {
    return [0, 2, 4].map((i) => Number.parseInt(hex[1].slice(i, i + 2), 16)) as [
      number,
      number,
      number,
    ];
  }
  const rgb = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

function relativeLuminance(value: string): number | null {
  const channels = colorChannels(value);
  if (!channels) return null;
  const [r, g, b] = channels.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function themedTextColor(value: string | number | undefined, heading: boolean) {
  if (heading) return "var(--text)";
  const color = String(value ?? "").toLowerCase();
  const luminance = relativeLuminance(color);
  if (luminance !== null && luminance < 0.18) return "var(--text)";
  if (color === "#a9bbd3" || color === "#8b9cc7" || color === "#6b7280") {
    return "var(--text-secondary)";
  }
  if (["#a78bfa", "#c4b5fd", "#d8b4fe", "#0e9aa7", "#2dd4bf", "#22d3ee"].includes(color)) {
    return "var(--accent-bright)";
  }
  if (["#34d399", "#22c55e"].includes(color)) return "var(--green)";
  if (["#fbbf24", "#d97706"].includes(color)) return "#fbbf24";
  if (color === "#ef4444" || color === "#c00000") return "var(--red)";
  return "var(--text)";
}

function themedShapeColor(value: string | null, role: "fill" | "stroke") {
  if (!value) return "transparent";
  const color = value.toLowerCase();
  if (["#0a0f1e", "#000000"].includes(color)) return "var(--bg)";
  if (["#111b31", "#0f1629", "#162238", "#17243a", "#1a2942"].includes(color)) {
    return "var(--bg-card)";
  }
  if (color === "#c00000" || color === "#ef4444") return "var(--red)";
  if (color === "#22c55e" || color === "#34d399") return "var(--green)";
  if (["#fbbf24", "#d97706"].includes(color)) return "#fbbf24";
  if (role === "stroke") return "var(--border-glow)";

  const luminance = relativeLuminance(color);
  const channels = colorChannels(color);
  if (
    luminance !== null &&
    channels &&
    Math.max(...channels) - Math.min(...channels) < 64 &&
    luminance > 0.25
  ) {
    return "rgba(59, 130, 246, 0.16)";
  }
  if (luminance !== null && luminance > 0.72) return "rgba(59, 130, 246, 0.16)";
  if (["#a78bfa", "#c4b5fd", "#d8b4fe"].includes(color)) return "#1e3a8a";
  if (["#0e9aa7", "#2dd4bf", "#22d3ee", "#60a5fa", "#93c5fd"].includes(color)) {
    return "var(--accent)";
  }
  if (luminance !== null && luminance < 0.18) return "var(--bg-card)";
  return "var(--accent-bright)";
}

function nodeText(node: Extract<PptxNode, { kind: "text" }>) {
  return node.text.paragraphs.map((paragraph) => paragraph.runs.map((run) => run.text).join("")).join("\n");
}

function isDisplayHeading(node: Extract<PptxNode, { kind: "text" }>) {
  const { y, w, h } = node.rect;
  const content = nodeText(node).trim();
  if (!content) return false;
  const deck = node.id.split("-")[0];
  const allCapsCover =
    deck === "chapter3" &&
    y >= 450 &&
    y < 720 &&
    h >= 170 &&
    w >= 680 &&
    content.length < 120 &&
    content === content.toLocaleUpperCase("mn");
  const shortCoverTitle =
    deck === "chapter4" && y >= 250 && y < 500 && h >= 170 && w >= 1200 && content.length < 50;
  const longCoverTitle = deck === "chapter6" && y >= 250 && y < 500 && h >= 450 && content.length < 120;
  const finalHeading = deck === "consciousness" && y >= 300 && y < 450 && h >= 250 && w >= 1500 && content.length < 50;
  const coverTitle = allCapsCover || shortCoverTitle || longCoverTitle || finalHeading;
  const topTitle = y < 230 && h >= 100 && w >= 500 && content.length < 95;
  return coverTitle || topTitle;
}

function fittedFontSize(node: Extract<PptxNode, { kind: "text" }>, heading: boolean) {
  const validSourceSize = node.text.paragraphs
    .flatMap((paragraph) => paragraph.runs.map((run) => Number(run.style.fontSize)))
    .filter((size) => Number.isFinite(size) && size >= 12);
  const { w, h } = node.rect;
  const content = nodeText(node);
  const paragraphLengths = node.text.paragraphs
    .map((paragraph) => paragraph.runs.map((run) => run.text).join("").length)
    .filter(Boolean);

  let size = validSourceSize.length
    ? Math.min(...validSourceSize)
    : heading
      ? h >= 380
        ? 64
        : h >= 190
          ? 58
          : 48
      : h < 54
        ? 16
        : h < 88
          ? 20
          : w < 600
            ? 23
            : 25;

  if (/^\d{1,3}$/.test(content.trim()) && w < 150) size = 16;
  const paragraphGap = Math.max(0, paragraphLengths.length - 1) * 8;
  const availableHeight = Math.max(
    20,
    h -
      (node.text.body.paddingTop ?? 0) -
      (node.text.body.paddingBottom ?? 0) -
      paragraphGap,
  );
  const width = Math.max(80, w - (node.text.body.paddingLeft ?? 0) - (node.text.body.paddingRight ?? 0));
  const fontWidthRatio = heading ? 0.59 : 0.54;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const estimatedLines = paragraphLengths.reduce(
      (sum, length) => sum + Math.max(1, Math.ceil((length * size * fontWidthRatio) / width)),
      0,
    );
    const heightLimit = availableHeight / Math.max(1.18, estimatedLines * 1.18);
    if (heightLimit >= size) break;
    size = Math.max(14, heightLimit);
  }

  return Math.round(Math.max(14, Math.min(72, size)));
}

function rectStyle(rect: Rect): CSSProperties {
  return {
    position: "absolute",
    left: rect.x,
    top: rect.y,
    width: rect.w,
    height: rect.h,
  };
}

function SharedNode({
  morphId,
  children,
  className,
  style,
}: {
  morphId?: string;
  children: ReactNode;
  className: string;
  style: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      layout={morphId ? true : undefined}
      layoutId={morphId}
      transition={{
        layout: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 2, ease: "easeInOut" },
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function getDeckKicker(id: string): string {
  if (id.startsWith("chapter3")) return "3-р бүлэг · Ойрын ирээдүй";
  if (id.startsWith("chapter4")) return "4-р бүлэг · Оюун ухааны тэсрэлт";
  if (id.startsWith("chapter6")) return "6-р бүлэг · Дараагийн тэрбум жил";
  if (id.startsWith("consciousness")) return "8-р бүлэг · Ухамсар";
  return "Амьдрал 3.0";
}

function TextNode({ node }: { node: Extract<PptxNode, { kind: "text" }> }) {
  const heading = isDisplayHeading(node);
  const fontSize = fittedFontSize(node, heading);
  const condensed = node.text.paragraphs.some((paragraph) =>
    paragraph.runs.some((run) => run.style.fontFamily === "Computer Says No"),
  )
    ? 0.62
    : 1;

  const delay = Math.min(
    0.45,
    0.06 + (node.rect.y / 1080) * 0.25 + (node.rect.x / 1920) * 0.08,
  );

  const style: CSSProperties = {
    ...rectStyle(node.rect),
    width: node.rect.w / condensed,
    height: node.rect.h,
    display: "flex",
    flexDirection: "column",
    justifyContent:
      node.text.body.anchor === "middle"
        ? "center"
        : node.text.body.anchor === "bottom"
          ? "flex-end"
          : "flex-start",
    paddingLeft: node.text.body.paddingLeft ?? 0,
    paddingRight: node.text.body.paddingRight ?? 0,
    paddingTop: node.text.body.paddingTop ?? 0,
    paddingBottom: node.text.body.paddingBottom ?? 0,
    overflow: "hidden",
    transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined,
    transformOrigin: "left top",
    fontFamily: heading ? "var(--serif), Georgia, serif" : fontStack(),
    fontSize,
    fontWeight: heading ? 700 : 400,
    lineHeight: heading ? 1.18 : 1.45,
    letterSpacing: heading ? "-0.015em" : "normal",
  };

  return (
    <motion.div
      className={`chapter3-node chapter3-text${heading ? " is-heading" : ""}`}
      style={style}
      initial={{ opacity: 0, y: heading ? -18 : 18, scale: heading ? 0.98 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {heading && (
        <div className="kicker-wrapper" style={{ marginBottom: 12 }}>
          <div className="kicker-pill">
            <span className="kicker-diamond">◆</span>
            <span className="kicker-label">{getDeckKicker(node.id)}</span>
          </div>
        </div>
      )}
      <div
        className="chapter3-text-content"
        style={{
          width: "100%",
          transform: condensed < 1 ? `scaleX(${condensed})` : undefined,
          transformOrigin: "left top",
        }}
      >
        {node.text.paragraphs.map((paragraph, paragraphIndex) => (
          <div
            className="chapter3-paragraph"
            key={`${node.id}-paragraph-${paragraphIndex}`}
            style={{
              textAlign: paragraph.align,
              marginLeft: paragraph.marginLeft,
              textIndent: paragraph.indent,
              marginBottom: paragraph.spacingAfter ?? 8,
              position: "relative",
            }}
          >
            {paragraph.bullet && (
              <span
                className="kicker-diamond"
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  marginRight: 10,
                  fontSize: 10,
                  verticalAlign: "middle",
                }}
              >
                ◆
              </span>
            )}
            {paragraph.runs.map((run, runIndex) => (
              <span
                key={`${node.id}-run-${paragraphIndex}-${runIndex}`}
                className={heading ? "chapter3-heading-run" : "chapter3-body-run"}
                style={{
                  fontFamily: heading ? "var(--serif), Georgia, serif" : fontStack(),
                  fontWeight: heading ? 700 : (run.style.fontWeight as CSSProperties["fontWeight"]),
                  fontStyle: run.style.fontStyle as CSSProperties["fontStyle"],
                  textDecoration: run.style.textDecoration as CSSProperties["textDecoration"],
                  color: themedTextColor(run.style.color, heading),
                }}
              >
                {run.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TableNode({ node }: { node: Extract<PptxNode, { kind: "table" }> }) {
  let top = 0;
  const delay = Math.min(
    0.45,
    0.08 + (node.rect.y / 1080) * 0.25 + (node.rect.x / 1920) * 0.08,
  );
  return (
    <motion.div
      className="chapter3-node chapter3-table"
      style={rectStyle(node.rect)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {node.rows.map((row, rowIndex) => {
        const rowTop = top;
        top += row.h;
        let left = 0;
        return (
          <div
            className="chapter3-table-row"
            key={`${node.id}-row-${rowIndex}`}
            style={{ top: rowTop, height: row.h }}
          >
            {row.cells.map((cell, colIndex) => {
              const cellLeft = left;
              left += node.cols[colIndex] ?? 0;
              return (
                <div
                  className="chapter3-table-cell"
                  key={`${node.id}-cell-${rowIndex}-${colIndex}`}
                  style={{
                    left: cellLeft,
                    width: node.cols[colIndex] ?? 0,
                    height: row.h,
                    background: themedShapeColor(cell.fill, "fill"),
                  }}
                >
                  {cell.text?.paragraphs.map((paragraph, pIndex) => (
                    <div
                      key={`${node.id}-cell-p-${rowIndex}-${colIndex}-${pIndex}`}
                      style={{ textAlign: paragraph.align }}
                    >
                      {paragraph.runs.map((run, rIndex) => (
                        <span
                          key={`${node.id}-cell-r-${rowIndex}-${colIndex}-${pIndex}-${rIndex}`}
                          style={{
                            fontFamily: fontStack(),
                            fontSize:
                              Number(run.style.fontSize) >= 12
                                ? (run.style.fontSize as number)
                                : Math.max(14, Math.min(22, row.h * 0.34)),
                            fontWeight: run.style.fontWeight as CSSProperties["fontWeight"],
                            color: themedTextColor(run.style.color, false),
                          }}
                        >
                          {run.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </motion.div>
  );
}

function PptxNodeView({ node }: { node: PptxNode }) {
  const delay = Math.min(
    0.45,
    0.05 + (node.rect.y / 1080) * 0.25 + (node.rect.x / 1920) * 0.08,
  );

  if (node.kind === "image") {
    return (
      <motion.div
        className="chapter3-node chapter3-image-node"
        style={rectStyle(node.rect)}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02 }}
      >
        <img
          src={node.src}
          alt={node.alt ?? ""}
          draggable={false}
          style={{
            objectFit: node.fit === "fill" ? "fill" : node.fit ?? "cover",
            objectPosition: node.objectPosition ?? "50% 50%",
            opacity: node.opacity,
          }}
        />
      </motion.div>
    );
  }

  if (node.kind === "text") return <TextNode node={node} />;
  if (node.kind === "table") return <TableNode node={node} />;

  const isLine = node.preset === "line";
  const rawFill = node.fill?.toLowerCase() ?? "";
  const isRed = rawFill === "#c00000" || rawFill === "#ef4444";
  const isGreen = rawFill === "#22c55e" || rawFill === "#34d399";
  const isAmber = rawFill === "#fbbf24" || rawFill === "#d97706";

  let shapeBackground: string | undefined;
  let shapeBorder: string | undefined;
  let shapeBoxShadow: string | undefined;

  if (isLine) {
    shapeBackground = "linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.6), transparent)";
    shapeBoxShadow = "0 0 14px rgba(0, 240, 255, 0.4)";
  } else if (isRed) {
    shapeBackground = "linear-gradient(135deg, rgba(45, 12, 22, 0.8) 0%, rgba(20, 8, 14, 0.9) 100%)";
    shapeBorder = "1px solid rgba(244, 63, 94, 0.45)";
    shapeBoxShadow = "0 20px 48px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(244, 63, 94, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
  } else if (isGreen) {
    shapeBackground = "linear-gradient(135deg, rgba(8, 38, 25, 0.8) 0%, rgba(6, 20, 15, 0.9) 100%)";
    shapeBorder = "1px solid rgba(16, 185, 129, 0.45)";
    shapeBoxShadow = "0 20px 48px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
  } else if (isAmber) {
    shapeBackground = "linear-gradient(135deg, rgba(42, 30, 8, 0.8) 0%, rgba(22, 16, 6, 0.9) 100%)";
    shapeBorder = "1px solid rgba(245, 158, 11, 0.45)";
    shapeBoxShadow = "0 20px 48px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
  } else if (node.preset === "roundRect" || node.preset === "rect") {
    shapeBackground = "linear-gradient(135deg, rgba(14, 20, 36, 0.72) 0%, rgba(8, 12, 24, 0.82) 100%)";
    shapeBorder = "1px solid rgba(255, 255, 255, 0.09)";
    shapeBoxShadow = "0 20px 48px -12px rgba(0, 0, 0, 0.8), 0 0 30px -5px rgba(0, 240, 255, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)";
  } else {
    shapeBackground = themedShapeColor(node.fill, "fill");
    shapeBorder = node.stroke
      ? `${Math.max(node.strokeWidth, 1)}px solid ${themedShapeColor(node.stroke, "stroke")}`
      : undefined;
  }

  return (
    <motion.div
      className={`chapter3-node chapter3-shape${isLine ? " is-line" : ""}`}
      style={{
        ...rectStyle(node.rect),
        minHeight: isLine ? Math.max(node.strokeWidth, 1) : undefined,
        background: shapeBackground,
        border: shapeBorder,
        boxShadow: shapeBoxShadow,
        backdropFilter: isLine ? undefined : "blur(16px)",
        WebkitBackdropFilter: isLine ? undefined : "blur(16px)",
        borderRadius:
          node.preset === "ellipse"
            ? "50%"
            : isLine
              ? 0
              : 16,
        clipPath:
          node.preset === "triangle"
            ? "polygon(50% 0, 100% 100%, 0 100%)"
            : undefined,
      }}
      initial={{ opacity: 0, y: isLine ? 0 : 20, scale: isLine ? 1 : 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

export function PptxSlideView({ data }: { data: SlideData }) {
  return (
    <div className="chapter3-canvas">
      <div className="canvas-ambient-glow" />
      <div className="canvas-grid-pattern" />
      {data.nodes.map((node, index) => (
        <PptxNodeView key={`${node.id}-${index}`} node={node} />
      ))}
    </div>
  );
}

export function Chapter3Slide1() {
  return <PptxSlideView data={sourceSlides[0]} />;
}
export function Chapter3Slide2() {
  return <PptxSlideView data={sourceSlides[1]} />;
}
export function Chapter3Slide3() {
  return <PptxSlideView data={sourceSlides[2]} />;
}
export function Chapter3Slide4() {
  return <PptxSlideView data={sourceSlides[3]} />;
}
export function Chapter3Slide5() {
  return <PptxSlideView data={sourceSlides[4]} />;
}
export function Chapter3Slide6() {
  return <PptxSlideView data={sourceSlides[5]} />;
}
export function Chapter3Slide7() {
  return <PptxSlideView data={sourceSlides[6]} />;
}
export function Chapter3Slide8() {
  return <PptxSlideView data={sourceSlides[7]} />;
}
export function Chapter3Slide9() {
  return <PptxSlideView data={sourceSlides[8]} />;
}
export function Chapter3Slide10() {
  return <PptxSlideView data={sourceSlides[9]} />;
}
export function Chapter3Slide11() {
  return <PptxSlideView data={sourceSlides[10]} />;
}
