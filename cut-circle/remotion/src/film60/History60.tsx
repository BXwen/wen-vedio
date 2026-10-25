import React from "react";
import { HITS60 } from "./timeline60";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

/** 263 → 500 → 1424: the record holds for nearly nine hundred years. */
export const History60: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity =
    enter(frame, HITS60.history, 8) * leave(frame, HITS60.quote1 - 6, 5);

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <div
        style={{
          position: "absolute",
          left: 1000,
          top: 240,
          fontFamily: FONTS.serif,
          fontSize: 96,
          letterSpacing: 6,
          color: PALETTE.ink,
        }}
      >
        近九百年
      </div>
      <div
        style={{
          position: "absolute",
          left: 1000,
          top: 370,
          fontFamily: FONTS.serif,
          fontSize: 28,
          letterSpacing: 3,
          color: PALETTE.inkSoft,
        }}
      >
        直到十五世纪，才被超越
      </div>

      <div
        style={{
          position: "absolute",
          left: 930,
          top: 720,
          width: 790,
          height: 1,
          backgroundColor: PALETTE.inkFaint,
          opacity: 0.55,
        }}
      />
      {[
        { x: 60, year: "263", name: "刘徽", accent: false },
        { x: 260, year: "500", name: "祖冲之", accent: true },
        { x: 700, year: "1424", name: "十五世纪", accent: false },
      ].map((p) => (
        <React.Fragment key={p.year}>
          <div
            style={{
              position: "absolute",
              left: 930 + p.x - 5,
              top: 715,
              width: p.accent ? 10 : 7,
              height: p.accent ? 10 : 7,
              borderRadius: "50%",
              backgroundColor: p.accent ? PALETTE.seal : PALETTE.inkSoft,
              opacity: p.accent ? 1 : 0.7,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 930 + p.x - 34,
              top: 748,
              width: 140,
              textAlign: "center",
              fontFamily: FONTS.serif,
              fontSize: 21,
              letterSpacing: 1,
              color: p.accent ? PALETTE.seal : PALETTE.inkSoft,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {p.year} · {p.name}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
