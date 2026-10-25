import React from "react";
import { PALETTE, SEASONS, type SeasonKey } from "../lib/theme";
import { TERMS } from "../data/terms";

const SEASON_ORDER: SeasonKey[] = ["spring", "summer", "autumn", "winter"];

const polar = (cx: number, cy: number, r: number, deg: number) => {
  // 0° at 12 o'clock, clockwise — so 立春 sits at the top, the year runs clockwise
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
};

const annulusPath = (
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number,
) => {
  const [x1, y1] = polar(cx, cy, rOuter, startDeg);
  const [x2, y2] = polar(cx, cy, rOuter, endDeg);
  const [x3, y3] = polar(cx, cy, rInner, endDeg);
  const [x4, y4] = polar(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");
};

/**
 * The 24-segment wheel. This is the video's causal spine: the sun cursor
 * advances one segment per solar term, so the viewer sees *why* a term begins.
 *
 * `cursor` is in segment units (0..24): integer part = completed terms,
 * fraction = progress through the current one.
 */
export const SolarRing: React.FC<{
  size: number;
  /** 0..24 */
  cursor: number;
  /** 0..1 — how much of the wheel has appeared at all. */
  reveal?: number;
  /** 0..1 opacity for segments not yet reached. */
  dimUnreached?: number;
  /** Show the 24 term labels on the ring. */
  labels?: boolean;
  /** Show the sun dot. */
  sun?: boolean;
  /** Show the inner 四季 glyphs. */
  seasons?: boolean;
  /** Which term is emphasised right now (label + segment glow). */
  activeIndex?: number | null;
  style?: React.CSSProperties;
}> = ({
  size,
  cursor,
  reveal = 1,
  dimUnreached = 0.34,
  labels = true,
  sun = true,
  seasons = true,
  activeIndex = null,
  style,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.44;
  const rInner = size * 0.335;
  const rLabel = (rOuter + rInner) / 2;
  const seg = 360 / 24;

  const sunDeg = cursor * seg;
  const [sunX, sunY] = polar(cx, cy, rOuter + size * 0.028, sunDeg);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={style}>
      <defs>
        <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={size * 0.012} />
        </filter>
      </defs>

      {/* paper plate under the wheel */}
      <circle cx={cx} cy={cy} r={rOuter * 1.06} fill={PALETTE.paper} opacity={0.92 * reveal} />
      <circle
        cx={cx}
        cy={cy}
        r={rOuter * 1.06}
        fill="none"
        stroke={PALETTE.inkFaint}
        strokeWidth={1}
        opacity={0.3 * reveal}
      />

      {TERMS.map((t, i) => {
        const season = SEASON_ORDER[Math.floor(i / 6)];
        const accent = SEASONS[season].accent;
        const start = i * seg;
        const end = start + seg;
        const reached = cursor >= i;
        // partial fill for the term currently in progress
        const partial = cursor > i && cursor < i + 1 ? cursor - i : reached ? 1 : 0;
        const isActive = activeIndex === i;

        return (
          <g key={t.name} opacity={reveal}>
            <path
              d={annulusPath(cx, cy, rOuter, rInner, start, end)}
              fill={accent}
              opacity={reached ? 0.92 : dimUnreached * 0.55}
            />
            {partial > 0 && partial < 1 && (
              <path
                d={annulusPath(cx, cy, rOuter, rInner, start, start + seg * partial)}
                fill={accent}
                opacity={0.92}
              />
            )}
            <path
              d={annulusPath(cx, cy, rOuter, rInner, start, end)}
              fill="none"
              stroke={isActive ? PALETTE.ink : PALETTE.paper}
              strokeWidth={isActive ? 2.5 : 1.5}
              opacity={isActive ? 0.9 : 0.55}
            />
            {labels &&
              (() => {
                // Horizontal labels stay readable at small ring sizes — the
                // reference's radial labels are unreadable below ~700px.
                const [lx, ly] = polar(cx, cy, rLabel, start + seg / 2);
                return (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="NotoSerifSC"
                    fontSize={size * 0.034}
                    fontWeight={isActive ? 700 : 500}
                    fill={isActive ? PALETTE.ink : reached ? "#2A2621" : PALETTE.inkSoft}
                    opacity={reached ? 1 : 0.5}
                  >
                    {t.name}
                  </text>
                );
              })()}
          </g>
        );
      })}

      {/* inner 四季 */}
      {seasons &&
        SEASON_ORDER.map((s, si) => {
          const deg = si * 90 + 45;
          const [x, y] = polar(cx, cy, rInner * 0.58, deg);
          const reached = cursor >= si * 6;
          return (
            <text
              key={s}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="NotoSerifSC"
              fontSize={size * 0.1}
              fontWeight={600}
              fill={SEASONS[s].accent}
              opacity={reveal * (reached ? 0.95 : 0.3)}
            >
              {SEASONS[s].glyph}
            </text>
          );
        })}

      {/* sun cursor */}
      {sun && (
        <g opacity={reveal}>
          <circle cx={sunX} cy={sunY} r={size * 0.03} fill={PALETTE.seal} filter="url(#ring-glow)" opacity={0.55} />
          <circle cx={sunX} cy={sunY} r={size * 0.017} fill={PALETTE.seal} />
          <circle cx={sunX} cy={sunY} r={size * 0.017} fill="none" stroke={PALETTE.paper} strokeWidth={1.5} />
          <line
            x1={cx}
            y1={cy}
            x2={sunX}
            y2={sunY}
            stroke={PALETTE.seal}
            strokeWidth={1}
            opacity={0.22}
          />
        </g>
      )}
    </svg>
  );
};
