import React from "react";
import { useCurrentFrame } from "remotion";
import { FONTS, PALETTE } from "../lib/theme";

/**
 * 朱印 — a vermilion stamp. The distress comes from a turbulence displacement
 * over the glyph so the edges break up the way pressed ink on paper does.
 *
 * Layout: two-character seals stack vertically (as on real 姓名印); four-character
 * seals use the traditional 2x2 reading order, right column then left column.
 */
export const Seal: React.FC<{
  text: string;
  size: number;
  /** Frame the stamp lands on. */
  at: number;
  /** Frames for the press animation. */
  duration?: number;
  color?: string;
  /** Show the carved border. */
  border?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  size,
  at,
  duration = 10,
  color = PALETTE.seal,
  border = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0) return null;

  const t = Math.min(1, local / duration);
  // press: overshoot down in scale, settle
  const scale = 1.18 - 0.18 * (1 - Math.pow(1 - t, 3)) - (t < 1 ? 0.06 * Math.sin(t * Math.PI) : 0);
  const opacity = Math.min(1, t * 2.2);

  const chars = Array.from(text);
  const cols = chars.length > 2 ? 2 : 1;
  const rows = Math.ceil(chars.length / cols);
  // Cell width and height are independent: a 2-character seal is one column
  // of two rows, so its cells are full-width and half-height. Using a single
  // square `cell` would centre the glyphs in the left half only.
  const cellW = size / cols;
  const cellH = size / rows;

  // 2x2 reading order: top-right, bottom-right, top-left, bottom-left
  const placed =
    chars.length === 4
      ? [
          { c: chars[0], col: 1, row: 0 },
          { c: chars[1], col: 1, row: 1 },
          { c: chars[2], col: 0, row: 0 },
          { c: chars[3], col: 0, row: 1 },
        ]
      : chars.map((c, i) => ({ c, col: 0, row: i }));

  const uid = `seal-${text}-${size}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        opacity,
        scale,
        position: "relative",
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id={`${uid}-distress`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={size * 0.035} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter={`url(#${uid}-distress)`}>
          {border && (
            <rect
              x={size * 0.055}
              y={size * 0.055}
              width={size * 0.89}
              height={size * 0.89}
              fill="none"
              stroke={color}
              strokeWidth={size * 0.052}
            />
          )}
          {placed.map((p, i) => (
            <text
              key={i}
              x={p.col * cellW + cellW / 2}
              y={p.row * cellH + cellH / 2}
              fill={color}
              fontFamily={FONTS.kai}
              fontWeight={700}
              fontSize={Math.min(cellW, cellH) * 0.74}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ paintOrder: "stroke" }}
            >
              {p.c}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};
