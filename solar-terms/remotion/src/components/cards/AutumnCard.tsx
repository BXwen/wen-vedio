import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaintingFrame, Pentads } from "../PaintingFrame";
import { SolarRing } from "../SolarRing";
import { PALETTE, SEASONS } from "../../lib/theme";
import type { SolarTerm } from "../../data/terms";

const ease = Easing.bezier(0.33, 0, 0.2, 1);

/** Deterministic leaf field — no Math.random, so renders are reproducible. */
const LEAVES = Array.from({ length: 16 }, (_, i) => ({
  x: ((i * 137) % 100) / 100,
  delay: (i * 6) % 46,
  size: 10 + ((i * 13) % 14),
  spin: (i * 47) % 360,
  drift: 40 + ((i * 29) % 80),
}));

/**
 * 秋 — drift. Everything translates sideways; leaves fall through the frame;
 * the palette desaturates as the season advances (`desat` 0..1).
 */
export const AutumnCard: React.FC<{
  term: SolarTerm;
  progress: number;
  /** 0..1 — how far into autumn this card is; drives the desaturation. */
  desat?: number;
}> = ({ term, progress, desat = 0 }) => {
  const frame = useCurrentFrame();
  const accent = SEASONS.autumn.accent;

  const slide = interpolate(progress, [0.02, 0.22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const nameT = interpolate(progress, [0.06, 0.26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const metaT = interpolate(progress, [0.2, 0.36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pentadT = interpolate(progress, [0.28, 0.44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* painting drifts in from the right */}
      <div
        style={{
          position: "absolute",
          left: 620 + (1 - slide) * 130,
          top: 200,
          width: 900,
          height: 590,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: slide,
        }}
      >
        <PaintingFrame
          lon={term.lon}
          boxWidth={900}
          boxHeight={590}
          accent={accent}
          zoom={1 + 0.04 * progress}
          style={{ filter: `saturate(${1 - desat * 0.4})` }}
        />
      </div>

      {/* falling leaves */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {LEAVES.map((l, i) => {
          const t = Math.max(0, Math.min(1, (frame - l.delay) / 96));
          if (t <= 0) return null;
          const y = -60 + t * 1080;
          const x = l.x * 1920 + Math.sin(t * Math.PI * 2 + i) * l.drift;
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx={l.size * 0.4}
              ry={l.size}
              fill={accent}
              transform={`rotate(${l.spin + t * 220} ${x} ${y})`}
              opacity={0.42 * (1 - Math.max(0, (t - 0.75) / 0.25))}
            />
          );
        })}
      </svg>

      {/* name, sliding in from the left */}
      <div
        style={{
          position: "absolute",
          left: 150 - (1 - slide) * 70,
          top: 272,
          width: 340,
          opacity: nameT,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "NotoSerifSC",
          fontSize: 124,
          fontWeight: 500,
          letterSpacing: 10,
          lineHeight: 1.05,
          color: PALETTE.ink,
          filter: `saturate(${1 - desat * 0.35})`,
        }}
      >
        {Array.from(term.name).map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      {/* meta */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 640,
          width: 420,
          opacity: metaT,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          fontFamily: "NotoSerifSC",
          color: PALETTE.inkSoft,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 31 }}>{term.dateLabel}</span>
          <span style={{ fontSize: 31, color: accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {term.timeLabel}
          </span>
        </div>
        <div style={{ fontSize: 22, opacity: 0.85 }}>太阳黄经 {term.lon}°</div>
        <div style={{ fontSize: 20, fontFamily: "SimKai", opacity: 0.75, lineHeight: 1.55, maxWidth: 400 }}>
          {term.note}
        </div>
      </div>

      {/* 三候 */}
      <div style={{ position: "absolute", left: 620, top: 812, width: 900, opacity: pentadT }}>
        <Pentads pentads={term.pentads} accent={accent} />
      </div>

      {/* ring */}
      <div style={{ position: "absolute", left: 1548, top: 300, opacity: metaT }}>
        <SolarRing size={300} cursor={term.index + progress} labels={false} sun seasons />
      </div>
    </AbsoluteFill>
  );
};
