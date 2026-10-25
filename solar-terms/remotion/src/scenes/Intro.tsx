import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperBackground } from "../components/PaperBackground";
import { InkBloom } from "../components/InkBloom";
import { VerticalText } from "../components/VerticalText";
import { Seal } from "../components/Seal";
import { PALETTE } from "../lib/theme";

/**
 * 0:00–0:08 — six seconds of almost nothing, then the ink arrives.
 * The restraint is the hook; resist filling this.
 *
 * Composition: the ink sits left of centre as a landscape gesture; the title
 * occupies the right half on clean paper. Nothing overlaps anything.
 */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  // the first stroke: a single vertical line drawn downward
  const strokeT = interpolate(frame, [16, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.9, 0.24, 1),
  });

  const bloomAt = 40;
  const titleStart = 74;
  const sealAt = 186;

  const ruleT = interpolate(frame, [150, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <PaperBackground tone={0.3} />

      {/* ink gesture, left of centre */}
      <InkBloom
        at={bloomAt}
        duration={120}
        radius={330}
        cx={610}
        cy={530}
        seed={9}
        roughness={1.1}
        color="#4A4438"
      />

      {/* the drawn stroke, landing on the ink's axis */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <line
          x1={610}
          y1={190}
          x2={610}
          y2={190 + 700 * strokeT}
          stroke={PALETTE.ink}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={interpolate(frame, [16, 24, 130, 190], [0, 0.85, 0.85, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </svg>

      {/* title, right half */}
      <div style={{ position: "absolute", left: 1010, top: 236 }}>
        <VerticalText
          text="二十四节气"
          fontSize={112}
          startFrame={titleStart}
          stagger={7}
          duration={22}
          weight={600}
          letterSpacing={16}
          color={PALETTE.ink}
        />
      </div>

      {/* subtitle, one column left of the title */}
      <div style={{ position: "absolute", left: 892, top: 300 }}>
        <VerticalText
          text="太阳的刻度"
          fontSize={38}
          startFrame={titleStart + 30}
          stagger={5}
          duration={18}
          weight={400}
          letterSpacing={12}
          color={PALETTE.inkSoft}
        />
      </div>

      {/* seal, below the subtitle */}
      <div style={{ position: "absolute", left: 878, top: 700 }}>
        <Seal text="节气" size={96} at={sealAt} />
      </div>

      {/* baseline rule under the title block */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <line
          x1={1010}
          y1={812}
          x2={1010 + 300 * ruleT}
          y2={812}
          stroke={PALETTE.inkFaint}
          strokeWidth={1}
          opacity={0.45}
        />
      </svg>

      {/* caption, bottom-left, under the ink */}
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 906,
          fontFamily: "NotoSerifSC",
          fontSize: 25,
          letterSpacing: 7,
          color: PALETTE.inkSoft,
          opacity: interpolate(frame, [196, 232], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        一年 · 三百六十五日 · 太阳走过三百六十度
      </div>
    </AbsoluteFill>
  );
};
