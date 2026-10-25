import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperBackground } from "../components/PaperBackground";
import { SolarRing } from "../components/SolarRing";
import { PALETTE, SEASONS } from "../lib/theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Counts from 0 to `to` over [from,to] frames. */
const useCount = (frame: number, from: number, to: number, target: number, decimals = 0) => {
  const t = interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (target * t).toFixed(decimals);
};

const Row: React.FC<{
  frame: number;
  at: number;
  value: string;
  unit?: string;
  label: string;
  detail: string;
  accent?: string;
}> = ({ frame, at, value, unit, label, detail, accent = PALETTE.ink }) => {
  const t = interpolate(frame, [at, at + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 26,
        opacity: t,
        translate: `${(1 - t) * -26}px 0`,
      }}
    >
      <div
        style={{
          fontFamily: "NotoSerifSC",
          fontSize: 96,
          fontWeight: 500,
          color: accent,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          minWidth: 300,
          textAlign: "right",
        }}
      >
        {value}
        {unit && <span style={{ fontSize: 40, marginLeft: 8, opacity: 0.8 }}>{unit}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontFamily: "NotoSerifSC", fontSize: 34, color: PALETTE.ink, letterSpacing: 4 }}>
          {label}
        </div>
        <div style={{ fontFamily: "NotoSerifSC", fontSize: 20, color: PALETTE.inkFaint, letterSpacing: 2 }}>
          {detail}
        </div>
      </div>
    </div>
  );
};

/**
 * 0:08–0:20 — the arithmetic of the year, counted up.
 * The reference printed these numbers statically; here each one arrives as a
 * measurement, which is what makes the wheel that follows feel derived.
 */
export const Numbers: React.FC = () => {
  const frame = useCurrentFrame();

  const ringReveal = interpolate(frame, [120, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  // ring fills as the numbers land
  const cursor = interpolate(frame, [130, 330], [0, 24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const headingT = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PaperBackground tone={0.5} />

      <div
        style={{
          position: "absolute",
          left: 180,
          top: 210,
          display: "flex",
          flexDirection: "column",
          gap: 46,
        }}
      >
        <div
          style={{
            fontFamily: "NotoSerifSC",
            fontSize: 30,
            letterSpacing: 10,
            color: PALETTE.seal,
            opacity: headingT,
            marginBottom: 6,
          }}
        >
          为什么是二十四个
        </div>

        <Row
          frame={frame}
          at={20}
          value={useCount(frame, 20, 60, 24)}
          unit="个"
          label="节气"
          detail="太阳每走十五度，交一个节气"
        />
        <Row
          frame={frame}
          at={58}
          value={useCount(frame, 58, 96, 15)}
          unit="°"
          label="一个间隔"
          detail="360° ÷ 24 = 15°"
          accent={SEASONS.spring.accent}
        />
        <Row
          frame={frame}
          at={94}
          value={useCount(frame, 94, 150, 365.2422, 4)}
          unit="日"
          label="回归年"
          detail="地球绕太阳一周的真实长度"
          accent={SEASONS.summer.accent}
        />
        <Row
          frame={frame}
          at={146}
          value={useCount(frame, 146, 190, 72)}
          unit="候"
          label="物候"
          detail="每个节气三候，五日一候"
          accent={SEASONS.autumn.accent}
        />
      </div>

      <div style={{ position: "absolute", right: 150, top: 200 }}>
        <SolarRing
          size={640}
          cursor={cursor}
          reveal={ringReveal}
          labels={ringReveal > 0.9}
          sun
          seasons
        />
      </div>
    </AbsoluteFill>
  );
};
