import React from "react";
import { interpolate } from "remotion";
import { FONTS, PALETTE } from "../lib/theme";

/**
 * A local crop of one edge, magnified until the chord spans the window. The
 * caption doubles with the side count (12 sides → ×2, 3072 sides → ×512) while
 * the crescent between arc and chord thins. The gap is exaggerated and labeled
 * 示意: at 3072 sides the real sagitta is far below one pixel.
 */
export const SagittaLoupe: React.FC<{
  cx: number;
  cy: number;
  r: number;
  n: number;
  opacity: number;
  /** 1 on the frame a doubling lands; used for the magnification stamp. */
  pop?: number;
}> = ({ cx, cy, r, n, opacity, pop = 0 }) => {
  const halfChord = r * 0.86;
  // The true sagitta at 3072 sides is sub-pixel, so the window would go blank.
  // Keep the crescent legible but let it thin monotonically with every double.
  const gap = 46 * Math.pow(12 / Math.max(12, n), 0.33);
  const R = (halfChord * halfChord + gap * gap) / (2 * gap);
  // Chord endpoints sit on the fitting circle at ±phi from the apex, so the
  // neighbouring vertices one edge further sit at ±3phi.
  const phi = Math.atan2(halfChord, R - gap);
  // At high n the crop is a thin band, so sink the apex to keep the window
  // balanced instead of leaving its lower half empty. Low n stays put and
  // lets the neighbouring edges run out of the lens.
  const neighborDrop = R * (1 - Math.cos(3 * phi));
  const apexY = cy - Math.min(neighborDrop, r * 1.1) / 2;
  const centerY = apexY + R;
  const yChord = apexY + gap;
  const x1 = cx - halfChord;
  const x2 = cx + halfChord;
  const leftX = cx + R * Math.sin(-3 * phi);
  const rightX = cx + R * Math.sin(3 * phi);
  const belowY = centerY - R * Math.cos(3 * phi);
  const zoom = Math.max(2, Math.round(n / 6));
  // 矢高 needs vertical room between the two lines; 弧/弦 sit clear of the
  // crescent, so they can stay on screen much deeper into the ladder.
  const sagittaLabels = interpolate(gap, [18, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const edgeLabels = interpolate(gap, [8, 10], [0, 1], {
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
        <line
          x1={x1}
          y1={yChord}
          x2={leftX}
          y2={belowY}
          stroke={PALETTE.ink}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <line
          x1={x2}
          y1={yChord}
          x2={rightX}
          y2={belowY}
          stroke={PALETTE.ink}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <path
          d={`M ${x1} ${yChord} A ${R} ${R} 0 0 1 ${x2} ${yChord}`}
          fill="none"
          stroke={PALETTE.ink}
          strokeWidth={3.2}
        />
        <line
          x1={x1}
          y1={yChord}
          x2={x2}
          y2={yChord}
          stroke={PALETTE.ochreDeep}
          strokeWidth={3}
        />
        <line
          x1={cx}
          y1={apexY}
          x2={cx}
          y2={yChord}
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <path
          d={`M ${cx - 5} ${apexY + 7} L ${cx} ${apexY} L ${cx + 5} ${apexY + 7}`}
          fill="none"
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <path
          d={`M ${cx - 5} ${yChord - 7} L ${cx} ${yChord} L ${cx + 5} ${yChord - 7}`}
          fill="none"
          stroke={PALETTE.inkSoft}
          strokeWidth={1.3}
        />
        <text
          x={cx + 12}
          y={(apexY + yChord) / 2 + 5}
          fontFamily={FONTS.serif}
          fontSize={17}
          fill={PALETTE.inkSoft}
          opacity={sagittaLabels}
        >
          矢高
        </text>
        <text
          x={x1 + 40}
          y={apexY - 8}
          fontFamily={FONTS.serif}
          fontSize={17}
          fill={PALETTE.ink}
          opacity={edgeLabels}
        >
          弧
        </text>
        <text
          x={x1 + 8}
          y={yChord + 26}
          fontFamily={FONTS.serif}
          fontSize={17}
          fill={PALETTE.ochreDeep}
          opacity={edgeLabels}
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
      <g
        transform={`translate(${cx} ${cy + r + 32}) scale(${1 + 0.07 * pop})`}
      >
        <text
          textAnchor="middle"
          fontFamily={FONTS.serif}
          fontSize={18}
          letterSpacing={2}
          fill={PALETTE.inkFaint}
        >
          <tspan fontSize={15} fill={PALETTE.inkFaint}>
            局部示意
          </tspan>
          <tspan dx={8} fontSize={23} fill={PALETTE.seal}>
            ×{zoom}
          </tspan>
          <tspan dx={8}>· {n} 边</tspan>
        </text>
      </g>
    </g>
  );
};
