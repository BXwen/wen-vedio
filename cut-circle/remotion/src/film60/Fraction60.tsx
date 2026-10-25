import React from "react";
import { HITS60 } from "./timeline60";
import { enter, leave, slam } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";
import { InkWash } from "../components/InkWash";

/** 355/113, the 密率, with the decimal and the lost method. */
export const Fraction60: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity =
    enter(frame, HITS60.fraction, 8) * leave(frame, HITS60.history - 4, 5);
  const scale = 1 + 0.12 * slam(frame, HITS60.fraction, 9);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "60% 45%",
      }}
    >
      <InkWash cx={1320} cy={400} size={660} opacity={0.5} />

      <div
        style={{
          position: "absolute",
          left: 1180,
          top: 246,
          width: 280,
          textAlign: "center",
          fontFamily: FONTS.serif,
          color: PALETTE.seal,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 600 }}>355</div>
        <div
          style={{
            height: 6,
            backgroundColor: PALETTE.seal,
            margin: "14px 0 12px",
            opacity: 0.85,
          }}
        />
        <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 600 }}>113</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1490,
          top: 280,
          fontFamily: FONTS.serif,
          fontSize: 44,
          letterSpacing: 8,
          color: PALETTE.seal,
        }}
      >
        密率
      </div>

      <div
        style={{
          position: "absolute",
          left: 1150,
          top: 640,
          fontFamily: FONTS.serif,
          fontSize: 34,
          letterSpacing: 1,
          color: PALETTE.inkSoft,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: PALETTE.inkFaint }}>≈ </span>
        <span style={{ color: PALETTE.ink }}>3.141592</span>
        <span style={{ color: PALETTE.inkFaint }}>920…</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1150,
          top: 700,
          fontFamily: FONTS.serif,
          fontSize: 30,
          letterSpacing: 2,
          color: PALETTE.inkSoft,
        }}
      >
        约率 22/7
      </div>

      <div
        style={{
          position: "absolute",
          left: 1150,
          top: 770,
          fontFamily: FONTS.serif,
          fontSize: 22,
          letterSpacing: 2,
          color: PALETTE.inkFaint,
        }}
      >
        他的算法没有传下来
      </div>
    </div>
  );
};
