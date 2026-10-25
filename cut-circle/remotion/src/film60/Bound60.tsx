import React from "react";
import { HITS60 } from "./timeline60";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

/** Inner/outer squeeze, then Zu's two bounds. */
export const Bound60: React.FC<{ frame: number }> = ({ frame }) => {
  const note =
    enter(frame, HITS60.bound, 8) *
    leave(frame, HITS60.bounds - 1, 3);
  const formula =
    enter(frame, HITS60.error, 8) *
    leave(frame, HITS60.bounds - 1, 3);
  const lower = enter(frame, HITS60.bounds, 6);
  const middle = enter(frame, HITS60.boundMid, 6);
  const upper = enter(frame, HITS60.boundUpper, 6);
  const fadeBounds = leave(frame, HITS60.fraction - 4, 4);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 140,
          opacity: note,
          fontFamily: FONTS.serif,
          fontSize: 52,
          lineHeight: 1.5,
          letterSpacing: 4,
          color: PALETTE.ink,
        }}
      >
        内接不足
        <br />
        外切有余
      </div>

      <div
        style={{
          position: "absolute",
          left: 172,
          top: 308,
          opacity: formula,
          fontFamily: FONTS.serif,
          fontSize: 28,
          letterSpacing: 2,
          color: PALETTE.inkSoft,
        }}
      >
        误差 ∝ 1/n²
      </div>

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
    </>
  );
};
