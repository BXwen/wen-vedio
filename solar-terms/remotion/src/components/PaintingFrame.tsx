import React from "react";
import { Img, staticFile } from "remotion";
import { PALETTE } from "../lib/theme";
import paintings from "../data/paintings.json";

type PaintingMeta = {
  lon: number;
  file: string;
  title: string;
  artist: string;
  date: string;
  medium: string;
  w: number;
  h: number;
};

const META = paintings as PaintingMeta[];

export const paintingMeta = (lon: number): PaintingMeta => {
  const found = META.find((p) => p.lon === lon);
  if (!found) throw new Error(`No painting for longitude ${lon}`);
  return found;
};

/**
 * Sizes a painting to fit a box while keeping its own aspect ratio, rather
 * than letterboxing it. The collection runs from 0.22 (a narrow hanging
 * scroll) to 3.19 (a long handscroll), so a fixed frame would leave most of
 * the screen empty. Each painting instead occupies the space its shape earns.
 */
export const fitPainting = (
  lon: number,
  boxWidth: number,
  boxHeight: number,
): { width: number; height: number } => {
  const { w, h } = paintingMeta(lon);
  const aspect = w / h;
  let width = boxWidth;
  let height = boxWidth / aspect;
  if (height > boxHeight) {
    height = boxHeight;
    width = boxHeight * aspect;
  }
  return { width: Math.round(width), height: Math.round(height) };
};

/** Aspect ratio of a painting, width / height. */
export const paintingAspect = (lon: number): number => {
  const { w, h } = paintingMeta(lon);
  return w / h;
};

/**
 * The painting in its mount. The seasonal accent border is what ties each
 * card back to the wheel.
 */
export const PaintingFrame: React.FC<{
  lon: number;
  boxWidth: number;
  boxHeight: number;
  accent: string;
  /** Extra zoom, 1 = fit. */
  zoom?: number;
  /** Inner white mount width. */
  mount?: number;
  borderWidth?: number;
  style?: React.CSSProperties;
  opacity?: number;
  /** Vertical alignment inside the box. */
  align?: "center" | "top" | "bottom";
  /**
   * When a narrow painting sits in a wide box, the sides go empty. A backdrop
   * strip — the same painting, enlarged, blurred and desaturated — fills that
   * space so the composition reads as deliberate rather than accidental.
   */
  backdrop?: boolean;
}> = ({
  lon,
  boxWidth,
  boxHeight,
  accent,
  zoom = 1,
  mount = 16,
  borderWidth = 5,
  style,
  opacity = 1,
  align = "center",
  backdrop = false,
}) => {
  const { width, height } = fitPainting(lon, boxWidth, boxHeight);
  const meta = paintingMeta(lon);

  return (
    <div
      style={{
        width: boxWidth,
        height: boxHeight,
        position: "relative",
        display: "flex",
        alignItems: align === "top" ? "flex-start" : align === "bottom" ? "flex-end" : "center",
        justifyContent: "center",
        opacity,
        ...style,
      }}
    >
      {backdrop && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <Img
            src={staticFile(`paintings-clean/${meta.file}`)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(34px) saturate(0.55) brightness(1.06)",
              opacity: 0.5,
              scale: 1.18,
            }}
          />
          {/* wash the backdrop back toward paper so it never competes */}
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#F6F0E4", opacity: 0.42 }} />
        </div>
      )}

      <div
        style={{
          width,
          height,
          backgroundColor: "#FBF7EF",
          border: `${borderWidth}px solid ${accent}`,
          boxShadow: "0 20px 48px rgba(60,48,32,0.15), 0 2px 6px rgba(60,48,32,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Img
          src={staticFile(`paintings-clean/${meta.file}`)}
          style={{
            width: width - mount * 2,
            height: height - mount * 2,
            objectFit: "contain",
            scale: zoom,
          }}
        />
      </div>
    </div>
  );
};

/** The three 候, set at a size that is actually readable at 1080p. */
export const Pentads: React.FC<{
  pentads: [string, string, string];
  accent: string;
  opacity?: number;
  align?: "center" | "left" | "right";
  fontSize?: number;
}> = ({ pentads, accent, opacity = 1, align = "center", fontSize = 33 }) => (
  <div
    style={{
      display: "flex",
      gap: 40,
      justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
      opacity,
      fontFamily: "SimKai",
      fontSize,
      letterSpacing: 4,
      color: PALETTE.inkSoft,
      whiteSpace: "nowrap",
    }}
  >
    {pentads.map((p, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            backgroundColor: accent,
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
        {p}
      </div>
    ))}
  </div>
);
