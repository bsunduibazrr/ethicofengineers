"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { chapter3SlideData } from "./chapter3-data";

type Rect = { x: number; y: number; w: number; h: number };
type Run = { text: string; style: Record<string, string | number> };
type Paragraph = {
  align: "left" | "center" | "right" | "justify";
  marginLeft: number;
  indent: number;
  bullet: string;
  runs: Run[];
};
type TextData = {
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
type PptxNode =
  | {
      kind: "image";
      rect: Rect;
      src: string;
      id: string;
      morphId?: string;
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
type SlideData = {
  sourceSlide: number;
  background:
    | { color: string }
    | { type: "linear"; angle: number; stops: { offset: number; color: string }[] };
  nodes: PptxNode[];
};

const sourceSlides = chapter3SlideData as unknown as SlideData[];

function fontStack(fontFamily?: string) {
  if (fontFamily === "Computer Says No") {
    return '"Computer Says No", "Arial Narrow", Impact, sans-serif';
  }
  if (fontFamily?.startsWith("Poppins")) {
    return '"Poppins", var(--sans), sans-serif';
  }
  return fontFamily ? `"${fontFamily}", var(--sans), sans-serif` : "var(--sans)";
}

function slideBackground(background: SlideData["background"]) {
  if ("color" in background) return background.color;
  const stops = background.stops
    .map(({ color, offset }) => `${color} ${offset}%`)
    .join(", ");
  // DrawingML angle 0 is horizontal; CSS angle 90 is left to right.
  return `linear-gradient(${(background.angle + 90) % 360}deg, ${stops})`;
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

function TextNode({ node }: { node: Extract<PptxNode, { kind: "text" }> }) {
  const condensed = node.text.paragraphs.some((paragraph) =>
    paragraph.runs.some((run) => run.style.fontFamily === "Computer Says No"),
  )
    ? 0.62
    : 1;
  const style: CSSProperties = {
    ...rectStyle(node.rect),
    width: node.rect.w / condensed,
    height: node.text.body.autoFit ? undefined : node.rect.h,
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
    overflow: node.text.body.autoFit ? "visible" : "hidden",
    transform: node.rotation ? `rotate(${node.rotation}deg)` : undefined,
    transformOrigin: "left top",
  };

  return (
    <SharedNode morphId={node.morphId} className="chapter3-node chapter3-text" style={style}>
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
            }}
          >
            {paragraph.bullet && (
              <span
                className="chapter3-bullet"
                aria-hidden="true"
                style={{ left: paragraph.indent }}
              >
                {paragraph.bullet}
              </span>
            )}
            {paragraph.runs.map((run, runIndex) => (
              <span
                key={`${node.id}-run-${paragraphIndex}-${runIndex}`}
                style={{
                  fontFamily: fontStack(String(run.style.fontFamily ?? "")),
                  fontSize: run.style.fontSize as number | undefined,
                  fontWeight: run.style.fontWeight as CSSProperties["fontWeight"],
                  fontStyle: run.style.fontStyle as CSSProperties["fontStyle"],
                  textDecoration: run.style.textDecoration as CSSProperties["textDecoration"],
                  color: String(run.style.color ?? "#FFFFFF"),
                }}
              >
                {run.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </SharedNode>
  );
}

function TableNode({ node }: { node: Extract<PptxNode, { kind: "table" }> }) {
  let top = 0;
  return (
    <div className="chapter3-node chapter3-table" style={rectStyle(node.rect)}>
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
                    background: cell.fill,
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
                            fontFamily: fontStack(String(run.style.fontFamily ?? "")),
                            fontSize: run.style.fontSize as number | undefined,
                            fontWeight: run.style.fontWeight as CSSProperties["fontWeight"],
                            color: String(run.style.color ?? "#000000"),
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
    </div>
  );
}

function PptxNodeView({ node }: { node: PptxNode }) {
  if (node.kind === "image") {
    return (
      <SharedNode
        morphId={node.morphId}
        className="chapter3-node chapter3-image-node"
        style={rectStyle(node.rect)}
      >
        <img src={node.src} alt="" draggable={false} />
      </SharedNode>
    );
  }

  if (node.kind === "text") return <TextNode node={node} />;
  if (node.kind === "table") return <TableNode node={node} />;

  const isLine = node.preset === "line";
  return (
    <div
      className={`chapter3-node chapter3-shape${isLine ? " is-line" : ""}`}
      style={{
        ...rectStyle(node.rect),
        minHeight: isLine ? Math.max(node.strokeWidth, 1) : undefined,
        backgroundColor: node.fill ?? "transparent",
        border: node.stroke ? `${Math.max(node.strokeWidth, 1)}px solid ${node.stroke}` : undefined,
        borderRadius: node.preset === "ellipse" ? "50%" : undefined,
      }}
    />
  );
}

function PptxSlide({ data }: { data: SlideData }) {
  return (
    <div className="chapter3-canvas" style={{ background: slideBackground(data.background) }}>
      {data.nodes.map((node, index) => (
        <PptxNodeView key={`${node.id}-${index}`} node={node} />
      ))}
    </div>
  );
}

export function Chapter3Slide1() {
  return <PptxSlide data={sourceSlides[0]} />;
}
export function Chapter3Slide2() {
  return <PptxSlide data={sourceSlides[1]} />;
}
export function Chapter3Slide3() {
  return <PptxSlide data={sourceSlides[2]} />;
}
export function Chapter3Slide4() {
  return <PptxSlide data={sourceSlides[3]} />;
}
export function Chapter3Slide5() {
  return <PptxSlide data={sourceSlides[4]} />;
}
export function Chapter3Slide6() {
  return <PptxSlide data={sourceSlides[5]} />;
}
export function Chapter3Slide7() {
  return <PptxSlide data={sourceSlides[6]} />;
}
export function Chapter3Slide8() {
  return <PptxSlide data={sourceSlides[7]} />;
}
export function Chapter3Slide9() {
  return <PptxSlide data={sourceSlides[8]} />;
}
export function Chapter3Slide10() {
  return <PptxSlide data={sourceSlides[9]} />;
}
