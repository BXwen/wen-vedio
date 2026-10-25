import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { PaintingFrame, Pentads } from "../PaintingFrame";
import { SolarRing } from "../SolarRing";
import { SEASONS } from "../../lib/theme";
import type { SolarTerm } from "../../data/terms";

const ease = Easing.bezier(0.4, 0, 0.3, 1);

/**
 * 冬 — contraction. The painting recedes and darkens, the name drops low and
 * gains weight, the frame closes in. Winter should feel like the year folding.
 */
export const WinterCard: React.FC<{ term: SolarTerm; progress: number }> = ({ term, progress }) => {
  const accent = SEASONS.winter.accent;

  const recede = interpolate(progress, [0.02, 0.26], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const nameT = interpolate(progress, [0.06, 0.28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const metaT = interpolate(progress, [0.22, 0.38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pentadT = interpolate(progress, [0.3, 0.46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* cold wash: darkens toward the edges as the card proceeds */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 42%, rgba(24,32,42,0) 28%, rgba(24,32,42,${0.18 + 0.14 * progress}) 100%)`,
        }}
      />

      {/* painting recedes */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 210,
          width: 880,
          height: 570,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: 1 - 0.055 * recede,
          opacity: 1 - 0.2 * recede,
        }}
      >
        <PaintingFrame
          lon={term.lon}
          boxWidth={880}
          boxHeight={570}
          accent={accent}
          borderWidth={4}
          zoom={1 - 0.02 * progress}
          style={{ filter: `brightness(${1 - 0.08 * progress})` }}
        />
      </div>

      {/* name, low and heavy */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 340 - (1 - nameT) * 40,
          width: 340,
          opacity: nameT,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "NotoSerifSC",
          fontSize: 128,
          fontWeight: 800,
          letterSpacing: 6,
          lineHeight: 1.0,
          color: "#141A22",
        }}
      >
        {Array.from(term.name).map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      {/* meta, under the name */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 700,
          width: 420,
          opacity: metaT,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          fontFamily: "NotoSerifSC",
          color: "#3A4654",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 30 }}>{term.dateLabel}</span>
          <span style={{ fontSize: 30, color: accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {term.timeLabel}
          </span>
        </div>
        <div style={{ fontSize: 21, opacity: 0.88 }}>太阳黄经 {term.lon}°</div>
        <div style={{ fontSize: 20, fontFamily: "SimKai", opacity: 0.78, lineHeight: 1.55, maxWidth: 400 }}>
          {term.note}
        </div>
      </div>

      {/* 三候 */}
      <div style={{ position: "absolute", left: 640, top: 806, width: 880, opacity: pentadT }}>
        <Pentads pentads={term.pentads} accent={accent} />
      </div>

      {/* ring, colder */}
      <div style={{ position: "absolute", left: 1548, top: 300, opacity: metaT }}>
        <SolarRing size={300} cursor={term.index + progress} labels={false} sun seasons />
      </div>
    </AbsoluteFill>
  );
};
