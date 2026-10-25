export type Point = readonly [number, number];

/** 0 degrees at 12 o'clock, clockwise. */
export const polar = (cx: number, cy: number, r: number, deg: number): Point => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

export const pointsToPath = (points: readonly Point[], close = true): string => {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return [
    `M ${first[0].toFixed(2)} ${first[1].toFixed(2)}`,
    ...rest.map((p) => `L ${p[0].toFixed(2)} ${p[1].toFixed(2)}`),
    close ? "Z" : "",
  ]
    .filter(Boolean)
    .join(" ");
};

export const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  sweepDeg: number,
): string => {
  const [x1, y1] = polar(cx, cy, r, startDeg);
  const [x2, y2] = polar(cx, cy, r, startDeg + sweepDeg);
  const large = sweepDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

/**
 * Vertices while doubling from n/2 to n sides.
 *
 * Even vertices are the old polygon's vertices and stay on the circle. Odd
 * vertices are born at the midpoint of an old edge (radius r*cos(pi/oldN))
 * and travel outward to the circle. This is why the shape blooms rather than
 * simply swapping one outline for another.
 */
export const morphPolygonPoints = (
  n: number,
  cx: number,
  cy: number,
  r: number,
  t: number,
): Point[] => {
  if (n < 3) return [];
  const oldN = n / 2;
  const innerR = oldN >= 3 ? r * Math.cos(Math.PI / oldN) : r;
  return Array.from({ length: n }, (_, i) => {
    const angle = (i * 360) / n;
    const radius = i % 2 === 0 ? r : innerR + (r - innerR) * t;
    return polar(cx, cy, radius, angle);
  });
};

/** A regular n-gon whose sides are tangent to the circle of radius r. */
export const circumscribedPoints = (
  n: number,
  cx: number,
  cy: number,
  r: number,
): Point[] => {
  const R = r / Math.cos(Math.PI / n);
  return Array.from({ length: n }, (_, i) =>
    polar(cx, cy, R, ((i + 0.5) * 360) / n),
  );
};

export const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
