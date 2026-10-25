import React from "react";
import { HITS60 } from "./timeline60";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";
import { InkWash } from "../components/InkWash";
import { VerticalText } from "../components/VerticalText";

/**
 * The 12–16.5s breakdown: the music drops out, so the film stops doubling and
 * names the idea instead. "逼近" holds through the near-silence at 15.5s.
 */
export const Breakdown60: React.FC<{ frame: number }> = ({ frame }) => {
  const heading =
    enter(frame, HITS60.breakdown, 8) * leave(frame, HITS60.build - 5, 5);
  const line =
    enter(frame, HITS60.breakdownText, 6) *
    leave(frame, HITS60.silence - 3, 5);
  const formula =
    enter(frame, HITS60.breakdownFormula, 6) *
    leave(frame, HITS60.silence - 3, 5);
  // Keep the 96-side label through the build pickup; the 192 hero takes over
  // at 18.1s, so the 16.5–18.1s gap is not an empty frame.
  const countLabel =
    enter(frame, HITS60.breakdown, 8) * leave(frame, HITS60.d192 - 4, 4);

  return (
    <>
      <InkWash cx={1510} cy={320} size={520} opacity={0.55 * heading} />

      <div
        style={{
          position: "absolute",
          left: 1450,
          top: 140,
          opacity: heading,
        }}
      >
        <VerticalText
          text="逼近"
          fontSize={150}
          startFrame={HITS60.breakdown}
          stagger={6}
          duration={12}
          color={PALETTE.ink}
          weight={600}
          letterSpacing={14}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 1450,
          top: 500,
          opacity: countLabel,
          fontFamily: FONTS.serif,
          fontSize: 34,
          letterSpacing: 4,
          color: PALETTE.inkSoft,
        }}
      >
        96 边 · 正多边形
      </div>

      <div
        style={{
          position: "absolute",
          left: 1030,
          top: 590,
          opacity: line,
          fontFamily: FONTS.serif,
          fontSize: 34,
          letterSpacing: 4,
          color: PALETTE.inkSoft,
        }}
      >
        边数越多，越像圆
      </div>

      <div
        style={{
          position: "absolute",
          left: 1030,
          top: 652,
          opacity: formula,
          fontFamily: FONTS.serif,
          fontSize: 28,
          letterSpacing: 2,
          color: PALETTE.inkFaint,
        }}
      >
        误差 ∝ 1/n²
      </div>
    </>
  );
};
