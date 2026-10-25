import React from "react";
import { useCurrentFrame } from "remotion";
import { FONTS } from "../lib/theme";

/**
 * 竖排 text. Each glyph is its own block so we can reveal them one by one
 * and control the column rhythm (Chinese vertical type reads top-to-bottom,
 * right-to-left).
 */
export const VerticalText: React.FC<{
  text: string;
  fontSize: number;
  /** Frame at which the first glyph starts. */
  startFrame: number;
  /** Frames between glyph starts. */
  stagger?: number;
  /** Frames each glyph takes to fade/slide in. */
  duration?: number;
  color?: string;
  fontFamily?: string;
  weight?: number;
  letterSpacing?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  fontSize,
  startFrame,
  stagger = 3,
  duration = 14,
  color = "#1C1A17",
  fontFamily = FONTS.serif,
  weight = 500,
  letterSpacing = 0,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily,
        fontWeight: weight,
        color,
        lineHeight: 1,
        ...style,
      }}
    >
      {Array.from(text).map((char, i) => {
        const local = frame - (startFrame + i * stagger);
        const t = Math.max(0, Math.min(1, local / duration));
        // ease-out cubic
        const e = 1 - Math.pow(1 - t, 3);
        return (
          <span
            key={i}
            style={{
              fontSize,
              display: "block",
              opacity: e,
              translate: `0 ${(1 - e) * -14}px`,
              paddingBottom: letterSpacing,
              filter: t < 1 ? `blur(${(1 - e) * 3}px)` : undefined,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
