import React from "react";
import { interpolate } from "remotion";
import { FONTS, PALETTE } from "../lib/theme";

/**
 * Magnified view of one edge: the arc above, the chord below, and the sagitta
 * between them. The gap is schematic but shrinks as the side count grows, so
 * the middle of the film keeps a visible quantity even after the polygon has
 * become indistinguishable from the circle at full scale.
 */
export const SagittaLoupe: React.FC<{
  cx: number;
  cy: number;
  r: number;
  n: number;
  opacity: number;
}> = ({ cx, cy, r, n, opacity }) => {
  const gap = Math.max(7, 46 * Math.pow(24 / Math.max(24, n), 0.38));
  const half = r * 0.82;
  const labels = interpolate(gap, [8, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id="sagitta-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={PALETTE.paper} opacity={0.96} />
      <g clipPath="url(#sagitta-clip)">
        <rect
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          fill={PALETTE.paper}
          opacity={0.9}
        />
        <path
          d={`M ${cx - half} ${cy + 5} Q ${cx} ${cy - 7} ${cx + half} ${cy + 5}`}
          fill="none"
          stroke={PALETTE.ink}
          strokeWidth={3.2}
        />
        <line
          x1={cx - half}
          y1={cy + gap}
          x2={cx + half}
          y2={cy + gap}
          stroke={PALETTE.ochreDeep}
          strokeWidth={3}
        />
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy + gap}
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <path
          d={`M ${cx - 5} ${cy + 7} L ${cx} ${cy} L ${cx + 5} ${cy + 7}`}
          fill="none"
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <path
          d={`M ${cx - 5} ${cy + gap - 7} L ${cx} ${cy + gap} L ${cx + 5} ${cy + gap - 7}`}
          fill="none"
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <text
          x={cx + 12}
          y={cy + gap / 2 + 5}
          fontFamily={FONTS.serif}
          fontSize={17}
          fill={PALETTE.inkSoft}
          opacity={labels}
        >
          矢高
        </text>
        <text
          x={cx - half + 8}
          y={cy - 16}
          fontFamily={FONTS.serif}
          fontSize={17}
          fill={PALETTE.ink}
          opacity={labels}
        >
          弧
        </text>
        <text
          x={cx - half + 8}
          y={cy + gap + 25}
          fontFamily={FONTS.serif}
          fontSize={17}
          fill={PALETTE.ochreDeep}
          opacity={labels}
        >
          弦
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
        y={cy + r + 28}
        textAnchor="middle"
        fontFamily={FONTS.serif}
        fontSize={19}
        letterSpacing={2}
        fill={PALETTE.inkFaint}
      >
        放大示意 · {n} 边
      </text>
    </g>
  );
};
