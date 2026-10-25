import React, { useMemo } from "react";
import { PALETTE } from "../lib/theme";

type P3 = readonly [number, number, number];

const FOCAL = 1600;
const CAMERA_Z = 1600;
const ROWS = 8;
const COLS = 16;

const rad = Math.PI / 180;

const rotate = (
  [x, y, z]: P3,
  rx: number,
  ry: number,
): readonly [number, number, number] => {
  const cxr = Math.cos(rx * rad);
  const sxr = Math.sin(rx * rad);
  const cyr = Math.cos(ry * rad);
  const syr = Math.sin(ry * rad);
  const y1 = y * cxr - z * sxr;
  const z1 = y * sxr + z * cxr;
  return [x * cyr + z1 * syr, y1, -x * syr + z1 * cyr];
};

const spherePoint = (latDeg: number, lonDeg: number, r: number): P3 => {
  const lat = latDeg * rad;
  const lon = lonDeg * rad;
  return [
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.sin(lat),
    r * Math.cos(lat) * Math.sin(lon),
  ];
};

const mix = (t: number) => {
  const light = [247, 239, 224];
  const dark = [176, 154, 118];
  const c = light.map((v, i) => Math.round(v + (dark[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

const LIGHT = (() => {
  const v = [-0.48, -0.56, 0.68];
  const n = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / n, v[1] / n, v[2] / n] as const;
})();

/**
 * A paper sphere built from flat plates. Each quad is lit as a single flat
 * face, so the facets read as straight edges instead of a smooth ball.
 * `reveal` 0–1 tiles the faces on from the top down.
 */
export const FacetedSphere3D: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rotateX: number;
  rotateY: number;
  reveal?: number;
  scale?: number;
  opacity?: number;
}> = ({
  cx,
  cy,
  r,
  rotateX,
  rotateY,
  reveal = 1,
  scale = 1,
  opacity = 1,
}) => {
  const uid = `fac-${Math.round(cx)}-${Math.round(cy)}-${Math.round(r)}`;

  const faces = useMemo(() => {
    const list: {
      d: string;
      fill: string;
      z: number;
      order: number;
    }[] = [];

    for (let i = 0; i < ROWS; i += 1) {
      const lat0 = -90 + (180 * i) / ROWS;
      const lat1 = lat0 + 180 / ROWS;
      for (let j = 0; j < COLS; j += 1) {
        const lon0 = (360 * j) / COLS;
        const lon1 = lon0 + 360 / COLS;
        const local = [
          spherePoint(lat0, lon0, r),
          spherePoint(lat1, lon0, r),
          spherePoint(lat1, lon1, r),
          spherePoint(lat0, lon1, r),
        ];
        const pts = local.map((p) => {
          const [x, y, z] = rotate(p, rotateX, rotateY);
          const s = FOCAL / (CAMERA_Z - z);
          return { x: cx + x * s, y: cy + y * s, z };
        });

        const z = pts.reduce((a, p) => a + p.z, 0) / 4;
        const centre = local.reduce(
          (a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4, a[2] + p[2] / 4] as P3,
          [0, 0, 0] as P3,
        );
        const [nx, ny, nz] = rotate(centre, rotateX, rotateY);
        const len = Math.hypot(nx, ny, nz) || 1;
        const lambert = Math.max(
          0,
          (nx / len) * LIGHT[0] +
            (ny / len) * LIGHT[1] +
            (nz / len) * LIGHT[2],
        );

        const d = pts
          .map(
            (p, k) =>
              `${k === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
          )
          .join(" ") + " Z";

        list.push({
          d,
          fill: mix(0.62 - 0.62 * lambert),
          z,
          order: (i + (j / COLS) * 0.9) / (ROWS - 1 + 0.9),
        });
      }
    }

    return list.sort((a, b) => a.z - b.z);
  }, [cx, cy, r, rotateX, rotateY]);

  const body = Math.min(1, reveal * 2.4);

  return (
    <g
      opacity={opacity}
      transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
    >
      <defs>
        <radialGradient id={`${uid}-shadow`}>
          <stop offset="0%" stopColor={PALETTE.ink} stopOpacity="0.15" />
          <stop offset="70%" stopColor={PALETTE.ink} stopOpacity="0.04" />
          <stop offset="100%" stopColor={PALETTE.ink} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        cx={cx + r * 0.08}
        cy={cy + r * 1.08}
        rx={r * 0.78}
        ry={r * 0.12}
        fill={`url(#${uid}-shadow)`}
        opacity={body}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#E9DDC8"
        opacity={0.34 * body}
      />

      {faces.map((f, i) => {
        const local = (reveal - f.order * 0.72) / 0.28;
        if (local <= 0) return null;
        return (
          <path
            key={i}
            d={f.d}
            fill={f.fill}
            fillOpacity={Math.min(1, local)}
            stroke={PALETTE.inkSoft}
            strokeOpacity={0.5 * Math.min(1, local)}
            strokeWidth={0.7}
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
};
