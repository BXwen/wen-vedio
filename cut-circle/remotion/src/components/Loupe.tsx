import React from "react";
import { interpolate } from "remotion";
import { HITS } from "../lib/beatmap";
import { FONTS, PALETTE } from "../lib/theme";

/**
 * A schematic loupe on the error between the inscribed and circumscribed
 * polygons. At 3072 sides the real gap is sub-pixel, so the loupe exaggerates
 * it and says so. The widening/narrowing band is what the numbers then close.
 */
export const Loupe: React.FC<{
  frame: number;
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  /** Defaults are the 10s demo's band window. */
  startFrame?: number;
  endFrame?: number;
}> = ({
  frame,
  cx,
  cy,
  r,
  opacity,
  startFrame = HITS.band,
  endFrame = HITS.bounds - 2,
}) => {
  const gap = interpolate(frame, [startFrame, endFrame], [46, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labels = interpolate(gap, [8, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id="loupe-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={PALETTE.paper} opacity={0.96} />
      <g clipPath="url(#loupe-clip)">
        <rect
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          fill={PALETTE.paper}
          opacity={0.9}
        />
        <rect
          x={cx - r}
          y={cy - gap / 2}
          width={r * 2}
          height={gap}
          fill={PALETTE.azurite}
          opacity={0.14}
        />
        <line
          x1={cx - r}
          y1={cy}
          x2={cx + r}
          y2={cy}
          stroke={PALETTE.ink}
          strokeWidth={3.2}
        />
        <line
          x1={cx - r}
          y1={cy - gap / 2}
          x2={cx + r}
          y2={cy - gap / 2}
          stroke={PALETTE.azurite}
          strokeWidth={2}
        />
        <line
          x1={cx - r}
          y1={cy + gap / 2}
          x2={cx + r}
          y2={cy + gap / 2}
          stroke={PALETTE.ochreDeep}
          strokeWidth={2.2}
        />
        <line
          x1={cx + r * 0.58}
          y1={cy - gap / 2}
          x2={cx + r * 0.58}
          y2={cy + gap / 2}
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <path
          d={`M ${cx + r * 0.58 - 5} ${cy - gap / 2 + 7} L ${cx + r * 0.58} ${cy - gap / 2} L ${cx + r * 0.58 + 5} ${cy - gap / 2 + 7}`}
          fill="none"
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <path
          d={`M ${cx + r * 0.58 - 5} ${cy + gap / 2 - 7} L ${cx + r * 0.58} ${cy + gap / 2} L ${cx + r * 0.58 + 5} ${cy + gap / 2 - 7}`}
          fill="none"
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <text
          x={cx - r * 0.62}
          y={cy - gap / 2 - 10}
          fontFamily={FONTS.serif}
          fontSize={18}
          fill={PALETTE.azurite}
          opacity={labels}
        >
          外切
        </text>
        <text
          x={cx - r * 0.62}
          y={cy + gap / 2 + 24}
          fontFamily={FONTS.serif}
          fontSize={18}
          fill={PALETTE.ochreDeep}
          opacity={labels}
        >
          内接
        </text>
        <text
          x={cx + r * 0.58 + 10}
          y={cy + 5}
          fontFamily={FONTS.serif}
          fontSize={16}
          fill={PALETTE.inkSoft}
          opacity={labels}
        >
          误差
        </text>
      </g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={PALETTE.inkSoft}
        strokeWidth={1.6}
        opacity={0.5}
      />
      <text
        x={cx}
        y={cy + r + 30}
        textAnchor="middle"
        fontFamily={FONTS.serif}
        fontSize={20}
        letterSpacing={3}
        fill={PALETTE.inkFaint}
      >
        放大示意
      </text>
    </g>
  );
};
