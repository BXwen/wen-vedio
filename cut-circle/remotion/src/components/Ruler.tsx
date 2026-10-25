import React from "react";
import { PALETTE } from "../lib/theme";

/** A straight edge laid against the circle. No measuring numbers: the line is the argument. */
export const Ruler: React.FC<{
  cx: number;
  cy: number;
  width: number;
  progress: number;
  angle: number;
  opacity?: number;
}> = ({ cx, cy, width, progress, angle, opacity = 1 }) => {
  const ticks = Array.from(
    { length: Math.floor(width / 26) + 1 },
    (_, i) => -width / 2 + i * 26,
  );

  return (
    <g
      transform={`translate(${cx} ${cy}) rotate(${angle})`}
      opacity={opacity}
    >
      <g transform={`scale(${progress} 1)`}>
        <line
          x1={-width / 2}
          y1={0}
          x2={width / 2}
          y2={0}
          stroke={PALETTE.ochreDeep}
          strokeWidth={4}
        />
        {ticks.map((x, i) => (
          <line
            key={x}
            x1={x}
            y1={0}
            x2={x}
            y2={i % 5 === 0 ? -20 : -10}
            stroke={PALETTE.ochreDeep}
            strokeWidth={i % 5 === 0 ? 2.2 : 1.2}
            opacity={0.9}
          />
        ))}
        <line
          x1={0}
          y1={-27}
          x2={0}
          y2={27}
          stroke={PALETTE.seal}
          strokeWidth={2.6}
        />
        <circle cx={0} cy={0} r={5.5} fill={PALETTE.seal} />
      </g>
    </g>
  );
};
