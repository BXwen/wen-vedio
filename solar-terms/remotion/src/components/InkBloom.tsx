import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Ink spreading through paper.
 *
 * Real 水墨 does not fill evenly: pigment migrates outward and accumulates at
 * the rim, so a wash is pale in the middle and dark where it stops. We build
 * that from three layers — a wide pale body, a rim-weighted ring, and fine
 * speckle — each displaced by its own turbulence so the boundary reads as
 * absorbed fibre rather than a drawn edge.
 */
export const InkBloom: React.FC<{
  /** Frame the bloom starts. */
  at: number;
  duration: number;
  /** Final radius in px. */
  radius: number;
  cx: number;
  cy: number;
  color?: string;
  seed?: number;
  /** 0..1 — overall strength of the wash. */
  strength?: number;
  /** 0..1 — how ragged the edge is. */
  roughness?: number;
}> = ({
  at,
  duration,
  radius,
  cx,
  cy,
  color = "#3A342B",
  seed = 3,
  strength = 1,
  roughness = 1,
}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0) return null;

  const t = Math.min(1, local / duration);
  // ink spreads fast then creeps — a strong ease-out
  const e = 1 - Math.pow(1 - t, 3);
  const r = radius * e;
  // the wash keeps deepening slightly after it stops spreading
  const density = strength * (0.35 + 0.65 * Math.min(1, t * 1.6));
  const uid = `bloom-${seed}-${Math.round(cx)}-${Math.round(cy)}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        {/* ragged edge, wide-scale */}
        <filter id={`${uid}-edge`} x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency={0.008} numOctaves="4" seed={seed} result="t1" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="t1"
            scale={r * 0.22 * roughness}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        {/* fine fibre breakup */}
        <filter id={`${uid}-fibre`} x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency={0.05} numOctaves="5" seed={seed + 4} result="t2" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="t2"
            scale={r * 0.07 * roughness}
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>

        {/* body: nearly clear centre, pigment gathering toward the rim */}
        <radialGradient id={`${uid}-body`}>
          <stop offset="0%" stopColor={color} stopOpacity="0.10" />
          <stop offset="45%" stopColor={color} stopOpacity="0.22" />
          <stop offset="72%" stopColor={color} stopOpacity="0.46" />
          <stop offset="88%" stopColor={color} stopOpacity="0.62" />
          <stop offset="97%" stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        {/* the darker tide-line just inside the edge */}
        <radialGradient id={`${uid}-tide`}>
          <stop offset="60%" stopColor={color} stopOpacity="0" />
          <stop offset="86%" stopColor={color} stopOpacity="0.34" />
          <stop offset="94%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        <filter id={`${uid}-grain`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed={seed + 9} result="g" />
          <feColorMatrix
            in="g"
            type="matrix"
            values="0 0 0 0 0.22
                    0 0 0 0 0.19
                    0 0 0 0 0.14
                    0 0 0 1.4 -0.62"
          />
        </filter>
        <mask id={`${uid}-grainmask`}>
          <circle cx={cx} cy={cy} r={Math.max(1, r * 0.96)} fill="white" filter={`url(#${uid}-edge)`} />
        </mask>
      </defs>

      <g opacity={density}>
        {/* A single circle reads as a stain. Three offset lobes, each with its
            own displacement, make an irregular mass with direction — the way a
            wet brush deposits ink when it is pressed and dragged. */}
        {[
          { dx: -0.16, dy: -0.1, s: 0.82, seed: seed },
          { dx: 0.2, dy: 0.14, s: 0.66, seed: seed + 11 },
          { dx: 0.02, dy: 0.24, s: 0.5, seed: seed + 23 },
        ].map((lobe, i) => (
          <g key={i} filter={`url(#${uid}-edge)`}>
            <circle
              cx={cx + r * lobe.dx}
              cy={cy + r * lobe.dy}
              r={Math.max(1, r * lobe.s)}
              fill={`url(#${uid}-body)`}
              filter={`url(#${uid}-fibre)`}
            />
            <circle
              cx={cx + r * lobe.dx}
              cy={cy + r * lobe.dy}
              r={Math.max(1, r * lobe.s)}
              fill={`url(#${uid}-tide)`}
              opacity={i === 0 ? 0.9 : 0.4}
            />
          </g>
        ))}
        {/* speckle: pigment sitting in the paper's valleys */}
        <g mask={`url(#${uid}-grainmask)`} opacity={0.45}>
          <rect x={cx - r * 1.2} y={cy - r * 1.2} width={r * 2.4} height={r * 2.4} filter={`url(#${uid}-grain)`} />
        </g>
      </g>
    </svg>
  );
};
