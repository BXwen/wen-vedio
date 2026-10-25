import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperBackground } from "../components/PaperBackground";
import { SolarRing } from "../components/SolarRing";
import { VerticalText } from "../components/VerticalText";
import { Seal } from "../components/Seal";
import { PALETTE } from "../lib/theme";

/**
 * 2:10–2:40 — the wheel completes, all 24 segments hold lit, then it
 * contracts to a seal. The last card left the cursor at 24, so this picks up
 * exactly where the year ended.
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  // 70–150: the whole wheel pulses once, all segments at full strength
  const pulse = interpolate(frame, [70, 108, 150], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 150–250: wheel contracts and fades as the title returns
  const contract = interpolate(frame, [150, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.75, 0),
  });

  const titleT = interpolate(frame, [170, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sealAt = 262;

  // closing line
  const lineT = interpolate(frame, [250, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PaperBackground tone={0.45} />

      {/* the wheel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: 1 - 0.42 * contract,
          opacity: 1 - contract,
          translate: `0 ${-70 * contract}px`,
        }}
      >
        <div style={{ position: "relative" }}>
          <SolarRing
            size={760}
            cursor={24}
            reveal={1}
            labels
            sun={frame < 150}
            seasons
            dimUnreached={1}
          />
          {/* the closing pulse */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              boxShadow: `0 0 0 ${28 * pulse}px rgba(179,39,30,${0.16 * pulse})`,
            }}
          />
        </div>
      </div>

      {/* title returns, centred as one vertical column */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 168,
          display: "flex",
          justifyContent: "center",
          opacity: titleT,
          translate: `0 ${(1 - titleT) * 26}px`,
        }}
      >
        <VerticalText
          text="二十四节气"
          fontSize={86}
          startFrame={170}
          stagger={6}
          duration={20}
          weight={600}
          letterSpacing={10}
          color={PALETTE.ink}
        />
      </div>

      {/* subtitle and seal, side by side under the title */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 812,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          opacity: titleT,
        }}
      >
        <div
          style={{
            fontFamily: "NotoSerifSC",
            fontSize: 28,
            letterSpacing: 12,
            color: PALETTE.inkSoft,
          }}
        >
          一岁四时 · 周而复始
        </div>
        <Seal text="节气" size={92} at={sealAt} />
      </div>

      {/* closing line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 78,
          textAlign: "center",
          fontFamily: "NotoSerifSC",
          fontSize: 20,
          letterSpacing: 3,
          color: PALETTE.inkFaint,
          opacity: lineT,
        }}
      >
        二十四节气 · 太阳黄经每 15° 一个 · 交节时刻依 JPL DE421 历表 · 画作均为大都会艺术博物馆公有领域藏品
      </div>
    </AbsoluteFill>
  );
};
