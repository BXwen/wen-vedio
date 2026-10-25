import React from "react";
import { HITS60 } from "./timeline60";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

/** The 3072-gon's inner/outer squeeze, placed right after the count pops. */
export const Error60: React.FC<{ frame: number }> = ({ frame }) => {
  const note =
    enter(frame, HITS60.errorStart, 8) *
    leave(frame, HITS60.errorEnd - 3, 5);
  const formula =
    enter(frame, HITS60.errorFormula, 6) *
    leave(frame, HITS60.errorEnd - 3, 5);

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
    </>
  );
};
