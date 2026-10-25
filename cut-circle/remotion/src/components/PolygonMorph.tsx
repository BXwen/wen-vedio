import React, { useMemo } from "react";
import { morphPolygonPoints, pointsToPath } from "../lib/geometry";
import { PALETTE } from "../lib/theme";

/**
 * Inscribed polygon. During a doubling, the new vertices are born on the old
 * edge midpoints and travel out to the circle, so the shape blooms open.
 */
export const PolygonMorph: React.FC<{
  n: number;
  cx: number;
  cy: number;
  r: number;
  /** 0 = n/2 sides, 1 = n sides. */
  t?: number;
  draw?: number;
  opacity?: number;
  color?: string;
}> = ({
  n,
  cx,
  cy,
  r,
  t = 1,
  draw = 1,
  opacity = 1,
  color = PALETTE.ochreDeep,
}) => {
  const points = useMemo(
    () => morphPolygonPoints(n, cx, cy, r, t),
    [n, cx, cy, r, t],
  );
  const d = useMemo(() => pointsToPath(points), [points]);

  const strokeWidth =
    n <= 12 ? 4.2 : n <= 48 ? 3.2 : n <= 192 ? 2.2 : n <= 768 ? 1.3 : 0.8;
  const lineOpacity =
    n <= 48 ? 1 : n <= 192 ? 0.9 : n <= 768 ? 0.75 : 0.55;
  const showVertices = n <= 192;
  const vertexStride = n <= 48 ? 1 : 2;

  return (
    <g opacity={opacity}>
      {/* ink bleed under the line */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 3.2}
        strokeLinejoin="round"
        opacity={0.08}
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={lineOpacity}
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - draw}
      />
      {showVertices &&
        points
          .filter((_, i) => i % vertexStride === 0)
          .map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={n <= 24 ? 5 : 3.4}
              fill={color}
              opacity={0.9}
            />
          ))}
    </g>
  );
};
