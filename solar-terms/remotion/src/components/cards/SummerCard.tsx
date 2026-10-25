import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { PaintingFrame, Pentads, paintingAspect } from "../PaintingFrame";
import { SolarRing } from "../SolarRing";
import { PALETTE, SEASONS } from "../../lib/theme";
import type { SolarTerm } from "../../data/terms";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * 夏 — fullness. The name is set horizontally and large (where the other
 * seasons set it vertically), and the painting takes the most area of any
 * season. The layout adapts to the painting's shape: a handscroll gets a wide
 * band under a centred banner; a hanging scroll gets a tall column beside the
 * name. A fixed frame would leave half the screen empty for one or the other.
 */
export const SummerCard: React.FC<{ term: SolarTerm; progress: number }> = ({ term, progress }) => {
  const accent = SEASONS.summer.accent;
  const aspect = paintingAspect(term.lon);
  const isWide = aspect >= 1.25;

  const fill = interpolate(progress, [0.02, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const nameT = interpolate(progress, [0.06, 0.26], [0, 1], {
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
      {/* heat haze */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 58%, rgba(255,236,196,${0.42 * fill}) 0%, rgba(255,236,196,0) 62%)`,
        }}
      />

      {isWide ? (
        <>
          {/* wide painting: banner name above a full-width band */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 168,
              textAlign: "center",
              opacity: nameT,
              scale: interpolate(nameT, [0, 1], [1.1, 1]),
              fontFamily: "NotoSerifSC",
              fontSize: 128,
              fontWeight: 700,
              letterSpacing: 34,
              color: PALETTE.ink,
            }}
          >
            {term.name}
          </div>
          <div
            style={{
              position: "absolute",
              left: 960 - 130 * nameT,
              width: 260 * nameT,
              top: 322,
              height: 3,
              backgroundColor: accent,
              opacity: nameT * 0.85,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 356,
              width: 1360,
              height: 404,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: interpolate(fill, [0, 1], [0.95, 1]),
              opacity: fill,
            }}
          >
            <PaintingFrame
              lon={term.lon}
              boxWidth={1360}
              boxHeight={404}
              accent={accent}
              zoom={1 + 0.03 * progress}
            />
          </div>
        </>
      ) : (
        <>
          {/* tall painting: horizontal name at the left, column at the right */}
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 250,
              width: 420,
              opacity: nameT,
              translate: `${(1 - nameT) * -30}px 0`,
              fontFamily: "NotoSerifSC",
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: 12,
              lineHeight: 1,
              color: PALETTE.ink,
              whiteSpace: "nowrap",
            }}
          >
            {term.name}
          </div>
          <div
            style={{
              position: "absolute",
              left: 156,
              top: 410,
              width: 200 * nameT,
              height: 3,
              backgroundColor: accent,
              opacity: nameT * 0.85,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 700,
              top: 190,
              width: 820,
              height: 580,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: interpolate(fill, [0, 1], [0.95, 1]),
              opacity: fill,
            }}
          >
            <PaintingFrame
              lon={term.lon}
              boxWidth={820}
              boxHeight={580}
              accent={accent}
              zoom={1 + 0.03 * progress}
            />
          </div>
        </>
      )}

      {/* meta strip, above the HUD rail */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 792,
          opacity: metaT,
          display: "flex",
          alignItems: "baseline",
          gap: 20,
          fontFamily: "NotoSerifSC",
          color: PALETTE.inkSoft,
        }}
      >
        <span style={{ fontSize: 31 }}>{term.dateLabel}</span>
        <span style={{ fontSize: 31, color: accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
          {term.timeLabel}
        </span>
        <span style={{ fontSize: 22, opacity: 0.85 }}>黄经 {term.lon}°</span>
        <span style={{ fontSize: 20, fontFamily: "SimKai", opacity: 0.75, marginLeft: 8 }}>
          {term.note}
        </span>
      </div>

      {/* 三候 */}
      <div style={{ position: "absolute", left: 150, top: 842, opacity: pentadT }}>
        <Pentads pentads={term.pentads} accent={accent} align="left" fontSize={30} />
      </div>

      {/* ring */}
      <div style={{ position: "absolute", left: 1548, top: 300, opacity: metaT }}>
        <SolarRing size={300} cursor={term.index + progress} labels={false} sun seasons />
      </div>
    </AbsoluteFill>
  );
};
