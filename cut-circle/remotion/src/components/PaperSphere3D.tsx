import React, { useMemo } from "react";
import { PALETTE } from "../lib/theme";

type P3 = readonly [number, number, number];
type P2 = readonly [number, number];

const FOCAL = 1800;
const CAMERA_Z = 1800;

const transform = (
  p: P3,
  rx: number,
  ry: number,
): readonly [number, number, number] => {
  const rad = Math.PI / 180;
  const cxr = Math.cos(rx * rad);
  const sxr = Math.sin(rx * rad);
  const cyr = Math.cos(ry * rad);
  const syr = Math.sin(ry * rad);
  const [x, y, z] = p;
  const y1 = y * cxr - z * sxr;
  const z1 = y * sxr + z * cxr;
  const x2 = x * cyr + z1 * syr;
  const z2 = -x * syr + z1 * cyr;
  return [x2, y1, z2];
};

const project = (
  p: P3,
  rx: number,
  ry: number,
  cx: number,
  cy: number,
): { p: P2; z: number } => {
  const [x, y, z] = transform(p, rx, ry);
  const s = FOCAL / (CAMERA_Z - z);
  return { p: [cx + x * s, cy + y * s], z };
};

const spherePoint = (latDeg: number, lonDeg: number, r: number): P3 => {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  return [
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.sin(lat),
    r * Math.cos(lat) * Math.sin(lon),
  ] as const;
};

const add = (
  target: [string, string],
  a: { p: P2; z: number },
  b: { p: P2; z: number },
  r: number,
) => {
  if (a.z <= 0 && b.z <= 0) return;
  const strong = Math.min(a.z, b.z) > r * 0.38;
  const d = `M ${a.p[0].toFixed(2)} ${a.p[1].toFixed(2)} L ${b.p[0].toFixed(2)} ${b.p[1].toFixed(2)} `;
  if (strong) target[0] += d;
  else target[1] += d;
};

/** A paper globe with a rotating 3D grid. Fine grid for the hook, coarse for the coda. */
export const PaperSphere3D: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rotateX: number;
  rotateY: number;
  scale?: number;
  opacity?: number;
  meridians?: number;
  parallels?: number;
}> = ({
  cx,
  cy,
  r,
  rotateX,
  rotateY,
  scale = 1,
  opacity = 1,
  meridians = 24,
  parallels = 12,
}) => {
  const uid = `ps-${Math.round(cx)}-${Math.round(cy)}-${Math.round(r)}`;

  const grid = useMemo(() => {
    const target: [string, string] = ["", ""];
    const latSteps = 24;
    for (let u = 0; u < meridians; u += 1) {
      const lon = (u * 360) / meridians;
      let prev = project(spherePoint(-90, lon, r), rotateX, rotateY, cx, cy);
      for (let v = 1; v <= latSteps; v += 1) {
        const lat = -90 + (180 * v) / latSteps;
        const cur = project(spherePoint(lat, lon, r), rotateX, rotateY, cx, cy);
        add(target, prev, cur, r);
        prev = cur;
      }
    }
    const lonSteps = 36;
    for (let v = 1; v < parallels; v += 1) {
      const lat = -90 + (180 * v) / parallels;
      let prev = project(spherePoint(lat, 0, r), rotateX, rotateY, cx, cy);
      for (let u = 1; u <= lonSteps; u += 1) {
        const lon = (360 * u) / lonSteps;
        const cur = project(spherePoint(lat, lon, r), rotateX, rotateY, cx, cy);
        add(target, prev, cur, r);
        prev = cur;
      }
    }
    return target;
  }, [cx, cy, r, rotateX, rotateY, meridians, parallels]);

  return (
    <g
      opacity={opacity}
      transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
    >
      <defs>
        <radialGradient id={`${uid}-body`} cx="34%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FDF8EE" />
          <stop offset="48%" stopColor="#EFE5D4" />
          <stop offset="82%" stopColor="#DCCEB9" />
          <stop offset="100%" stopColor="#CBBB9F" />
        </radialGradient>
        <radialGradient id={`${uid}-shadow`}>
          <stop offset="0%" stopColor={PALETTE.ink} stopOpacity="0.16" />
          <stop offset="65%" stopColor={PALETTE.ink} stopOpacity="0.05" />
          <stop offset="100%" stopColor={PALETTE.ink} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        cx={cx + r * 0.1}
        cy={cy + r * 1.08}
        rx={r * 0.82}
        ry={r * 0.14}
        fill={`url(#${uid}-shadow)`}
      />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-body)`} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={PALETTE.inkSoft}
        strokeWidth={1.2}
        opacity={0.45}
      />
      <path
        d={grid[1]}
        fill="none"
        stroke={PALETTE.inkSoft}
        strokeWidth={0.9}
        opacity={0.16}
      />
      <path
        d={grid[0]}
        fill="none"
        stroke={PALETTE.ochreDeep}
        strokeWidth={1.05}
        opacity={0.46}
      />
    </g>
  );
};
