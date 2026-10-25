import React from "react";
import { HITS60 } from "./timeline60";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

/** Zu's two bounds, after the 3072-gon has already given 3.1416. */
export const Bound60: React.FC<{ frame: number }> = ({ frame }) => {
  const lower = enter(frame, HITS60.bound, 6);
  const middle = enter(frame, HITS60.boundMid, 6);
  const upper = enter(frame, HITS60.boundUpper, 6);
  const attribution =
    enter(frame, HITS60.boundUpper, 6) *
    leave(frame, HITS60.fraction - 4, 4);
  const precision =
    enter(frame, HITS60.precision, 6) *
    leave(frame, HITS60.fraction - 4, 4);
  const fadeBounds = leave(frame, HITS60.fraction - 4, 4);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 250,
          fontFamily: FONTS.serif,
          color: PALETTE.seal,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          opacity: fadeBounds,
        }}
      >
        <div style={{ fontSize: 88, opacity: lower }}>3.1415926</div>
        <div
          style={{
            margin: "16px 0",
            fontSize: 60,
            opacity: middle,
            color: PALETTE.inkSoft,
            letterSpacing: 6,
          }}
        >
          &lt; π &lt;
        </div>
        <div style={{ fontSize: 88, opacity: upper }}>3.1415927</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 620,
          opacity: precision,
          fontFamily: FONTS.serif,
          fontSize: 30,
          letterSpacing: 1.5,
          color: PALETTE.inkSoft,
        }}
      >
        误差 &lt; 10⁻⁷
      </div>

      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 704,
          opacity: attribution,
          fontFamily: FONTS.serif,
          fontSize: 26,
          letterSpacing: 2,
          color: PALETTE.inkSoft,
        }}
      >
        祖冲之 · 429–500
      </div>
    </>
  );
};
