import React, { useMemo } from "react";
import { PALETTE } from "../lib/theme";

type P3 = readonly [number, number, number];
type P2 = readonly [number, number];

const SEGMENTS = 160;
const TICKS = 36;
const HALF_THICKNESS = 9;
const BAND = 22;
const FOCAL = 1600;
const CAMERA_Z = 1600;

const project = (
  p: P3,
  rx: number,
  ry: number,
  rz: number,
  cx: number,
  cy: number,
): P2 => {
  const rad = Math.PI / 180;
  const cxr = Math.cos(rx * rad);
  const sxr = Math.sin(rx * rad);
  const cyr = Math.cos(ry * rad);
  const syr = Math.sin(ry * rad);
  const czr = Math.cos(rz * rad);
  const szr = Math.sin(rz * rad);
  const [x, y, z] = p;

  const y1 = y * cxr - z * sxr;
  const z1 = y * sxr + z * cxr;
  const x2 = x * cyr + z1 * syr;
  const z2 = -x * syr + z1 * cyr;
  const x3 = x2 * czr - y1 * szr;
  const y3 = x2 * szr + y1 * czr;

  const s = FOCAL / (CAMERA_Z - z2);
  return [cx + x3 * s, cy + y3 * s];
};

const ringPoints = (radius: number, z: number): P3[] =>
  Array.from({ length: SEGMENTS }, (_, i) => {
    const a = (i / SEGMENTS) * Math.PI * 2;
    const jitter = ((i * 37) % 11) / 11 - 0.5;
    const rr = radius + jitter * 0.7;
    return [Math.cos(a) * rr, Math.sin(a) * rr, z] as const;
  });

const pathOf = (pts: readonly P2[], close = true): string =>
  pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ") + (close ? " Z" : "");

/** A paper/ink ring with real thickness, projected in perspective. */
export const InkRing3D: React.FC<{
  cx: number;
  cy: number;
  r: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale?: number;
  opacity?: number;
  /** Draw this many radial seams across the band, revealing with progress. */
  seams?: number;
  seamProgress?: number;
}> = ({
  cx,
  cy,
  r,
  rotateX,
  rotateY,
  rotateZ,
  scale = 1,
  opacity = 1,
  seams = 0,
  seamProgress = 0,
}) => {
  const outer = useMemo(() => ringPoints(r, HALF_THICKNESS), [r]);
  const inner = useMemo(
    () => ringPoints(r - BAND, HALF_THICKNESS),
    [r],
  );
  const outerBack = useMemo(() => ringPoints(r, -HALF_THICKNESS), [r]);
  const innerBack = useMemo(
    () => ringPoints(r - BAND, -HALF_THICKNESS),
    [r],
  );

  const projected = useMemo(() => {
    const map = (pts: P3[]) =>
      pts.map((p) => project(p, rotateX, rotateY, rotateZ, cx, cy));
    return {
      of: map(outer),
      inf: map(inner),
      ob: map(outerBack),
      inb: map(innerBack),
    };
  }, [outer, inner, outerBack, innerBack, rotateX, rotateY, rotateZ, cx, cy]);

  const { of, inf, ob, inb } = projected;

  const frontFace = `${pathOf(of)} ${pathOf(inf)}`;
  const backFace = `${pathOf(ob)} ${pathOf(inb)}`;

  const sideWalls = useMemo(() => {
    let d = "";
    for (let i = 0; i < SEGMENTS; i += 1) {
      const j = (i + 1) % SEGMENTS;
      d += `M ${of[i][0].toFixed(2)} ${of[i][1].toFixed(2)} L ${of[j][0].toFixed(2)} ${of[j][1].toFixed(2)} L ${ob[j][0].toFixed(2)} ${ob[j][1].toFixed(2)} L ${ob[i][0].toFixed(2)} ${ob[i][1].toFixed(2)} Z `;
      d += `M ${inf[i][0].toFixed(2)} ${inf[i][1].toFixed(2)} L ${inf[j][0].toFixed(2)} ${inf[j][1].toFixed(2)} L ${inb[j][0].toFixed(2)} ${inb[j][1].toFixed(2)} L ${inb[i][0].toFixed(2)} ${inb[i][1].toFixed(2)} Z `;
    }
    return d;
  }, [of, inf, ob, inb]);

  const ticks = useMemo(() => {
    let d = "";
    for (let i = 0; i < TICKS; i += 1) {
      const a = (i / TICKS) * Math.PI * 2;
      const long = i % 5 === 0;
      const p1 = project(
        [Math.cos(a) * (r - 1.5), Math.sin(a) * (r - 1.5), HALF_THICKNESS],
        rotateX,
        rotateY,
        rotateZ,
        cx,
        cy,
      );
      const p2 = project(
        [
          Math.cos(a) * (r - (long ? 18 : 12)),
          Math.sin(a) * (r - (long ? 18 : 12)),
          HALF_THICKNESS,
        ],
        rotateX,
        rotateY,
        rotateZ,
        cx,
        cy,
      );
      d += `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} L ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
    }
    return d;
  }, [r, rotateX, rotateY, rotateZ, cx, cy]);

  const shadow = useMemo(
    () =>
      pathOf(
        of.map(([x, y]) => [x + 18, y + 30] as const),
      ),
    [of],
  );

  // The ring is a 160-segment extrusion; these seams make that visible when
  // the film says "这个 3D 环，也是直边拼的".
  const seamLines = useMemo(() => {
    if (seams <= 0) return [];
    return Array.from({ length: seams }, (_, i) => {
      const a = (i / seams) * Math.PI * 2;
      const p1 = project(
        [Math.cos(a) * (r - 1.5), Math.sin(a) * (r - 1.5), HALF_THICKNESS],
        rotateX,
        rotateY,
        rotateZ,
        cx,
        cy,
      );
      const p2 = project(
        [
          Math.cos(a) * (r - BAND + 1.5),
          Math.sin(a) * (r - BAND + 1.5),
          HALF_THICKNESS,
        ],
        rotateX,
        rotateY,
        rotateZ,
        cx,
        cy,
      );
      return `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} L ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    });
  }, [seams, r, rotateX, rotateY, rotateZ, cx, cy]);

  const revealed = seamProgress * seams;

  return (
    <g
      opacity={opacity}
      transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}
    >
      <path d={shadow} fill={PALETTE.ink} opacity={0.07} />
      <path d={backFace} fillRule="evenodd" fill="#D8C9B2" opacity={0.6} />
      <path
        d={backFace}
        fillRule="evenodd"
        fill="none"
        stroke={PALETTE.inkSoft}
        strokeWidth={0.8}
        opacity={0.45}
      />
      <path
        d={sideWalls}
        fill="#C2B092"
        opacity={0.6}
        stroke={PALETTE.inkSoft}
        strokeWidth={0.35}
      />
      <path
        d={frontFace}
        fillRule="evenodd"
        fill="#EDE2D0"
        opacity={0.97}
        stroke={PALETTE.ochreDeep}
        strokeWidth={1.4}
      />
      <path
        d={pathOf(of)}
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth={1.9}
        opacity={0.88}
      />
      <path
        d={pathOf(inf)}
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth={1.2}
        opacity={0.7}
      />
      <path
        d={ticks}
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth={1.15}
        opacity={0.7}
      />
      {seamLines.map((d, i) => {
        const on = i < revealed;
        // The red sweep must clear once the last seam lands, otherwise the
        // final eight seams stay highlighted for the rest of the film.
        const lead = on && i > revealed - 8 && seamProgress < 0.999;
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={lead ? PALETTE.seal : PALETTE.ink}
            strokeWidth={lead ? 1.7 : 0.8}
            opacity={on ? (lead ? 0.9 : 0.42) : 0}
          />
        );
      })}
    </g>
  );
};
