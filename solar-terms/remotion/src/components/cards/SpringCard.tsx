import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { PaintingFrame, Pentads } from "../PaintingFrame";
import { SolarRing } from "../SolarRing";
import { PALETTE, SEASONS } from "../../lib/theme";
import type { SolarTerm } from "../../data/terms";

const ease = Easing.bezier(0.22, 0.9, 0.24, 1);

/**
 * 春 — growth. The painting unfurls upward from a bottom edge while the term
 * name rises out of the paper. Light enters from above.
 *
 * Layout grid (1920x1080): name column 150–560, painting region 640–1520
 * (y 200–790), year ring 1560–1840 centred at y 470.
 */
export const SpringCard: React.FC<{ term: SolarTerm; progress: number }> = ({ term, progress }) => {
  const accent = SEASONS.spring.accent;

  const unfurl = interpolate(progress, [0.02, 0.22], [0, 1], {
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
  const ringT = interpolate(progress, [0.18, 0.34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* spring light: a soft shaft from the top-left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(150deg, rgba(255,253,240,${0.5 * unfurl}) 0%, rgba(255,253,240,0) 55%)`,
        }}
      />

      {/* painting — revealed from the bottom up, like a scroll opening */}
      <div
        style={{
          position: "absolute",
          left: 640,
          top: 200,
          width: 880,
          height: 590,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          clipPath: `inset(${(1 - unfurl) * 100}% 0 0 0)`,
        }}
      >
        <PaintingFrame
          lon={term.lon}
          boxWidth={880}
          boxHeight={590}
          accent={accent}
          zoom={1 + 0.03 * progress}
          align="bottom"
        />
      </div>

      {/* term name, rising out of the paper */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 268,
          width: 340,
          opacity: nameT,
          translate: `0 ${(1 - nameT) * 46}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "NotoSerifSC",
          fontSize: 124,
          fontWeight: 600,
          letterSpacing: 8,
          lineHeight: 1.05,
          color: PALETTE.ink,
        }}
      >
        {Array.from(term.name).map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      {/* the numbers — this is where we beat "二月四日前后" */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 640,
          width: 400,
          opacity: metaT,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          fontFamily: "NotoSerifSC",
          color: PALETTE.inkSoft,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 31, letterSpacing: 2 }}>{term.dateLabel}</span>
          <span
            style={{
              fontSize: 31,
              color: accent,
              fontVariantNumeric: "tabular-nums",
              fontWeight: 700,
            }}
          >
            {term.timeLabel}
          </span>
        </div>
        <div style={{ fontSize: 22, letterSpacing: 2, opacity: 0.85 }}>
          太阳黄经 {term.lon}°
        </div>
        <div
          style={{
            fontSize: 20,
            letterSpacing: 1,
            opacity: 0.75,
            fontFamily: "SimKai",
            lineHeight: 1.55,
            maxWidth: 380,
          }}
        >
          {term.note}
        </div>
      </div>

      {/* 三候 */}
      <div style={{ position: "absolute", left: 640, top: 812, width: 880 }}>
        <Pentads pentads={term.pentads} accent={accent} opacity={pentadT} />
      </div>

      {/* year ring */}
      <div style={{ position: "absolute", left: 1548, top: 300, opacity: ringT }}>
        <SolarRing size={300} cursor={term.index + progress} labels={false} sun seasons />
      </div>
    </AbsoluteFill>
  );
};
