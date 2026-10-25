import React from "react";
import { HITS110 } from "./timeline110";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";
import { InkWash } from "../components/InkWash";

const COLUMN = {
  left: 1000,
  width: 620,
} as const;

/** 113355, split down the middle, becomes 355/113. */
export const FractionSplit: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity =
    enter(frame, HITS110.fraction, 6) *
    leave(frame, HITS110.fractionEnd - 4, 4);
  const hint =
    enter(frame, HITS110.fraction, 6) * leave(frame, HITS110.splitOpen, 4);
  const full =
    enter(frame, HITS110.fraction, 4) *
    leave(frame, HITS110.splitOpen - 2, 3);
  const line =
    enter(frame, HITS110.split, 6) *
    leave(frame, HITS110.fractionResult + 4, 4);
  const split =
    enter(frame, HITS110.splitOpen, 6) *
    leave(frame, HITS110.fractionResult + 6, 4);
  const frac = enter(frame, HITS110.fractionResult, 6);
  const detail = enter(frame, HITS110.fractionDetail, 6);
  const six = enter(frame, HITS110.fractionProof, 6);
  const lost = enter(frame, HITS110.fractionProof + 12, 6);

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <InkWash
        cx={1300}
        cy={400}
        size={620}
        opacity={0.42 * enter(frame, HITS110.fraction, 6)}
      />

      <div
        style={{
          position: "absolute",
          ...COLUMN,
          top: 220,
          textAlign: "center",
          opacity: hint,
          fontFamily: FONTS.serif,
          fontSize: 27,
          letterSpacing: 3,
          color: PALETTE.inkSoft,
        }}
      >
        把 113355 从中间劈开
      </div>

      <div
        style={{
          position: "absolute",
          ...COLUMN,
          top: 300,
          textAlign: "center",
          opacity: full,
          fontFamily: FONTS.serif,
          fontSize: 112,
          letterSpacing: 4,
          color: PALETTE.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        113355
      </div>

      <div
        style={{
          position: "absolute",
          left: COLUMN.left + COLUMN.width / 2 - 1.5,
          top: 285,
          width: 3,
          height: 170,
          backgroundColor: PALETTE.seal,
          opacity: 0.9 * line,
          transform: `scaleY(${line})`,
          transformOrigin: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          ...COLUMN,
          top: 312,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          opacity: split,
          fontFamily: FONTS.serif,
          fontSize: 96,
          letterSpacing: 4,
          color: PALETTE.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>113</span>
        <span>355</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: COLUMN.left + 220,
          top: 260,
          width: 180,
          textAlign: "center",
          opacity: frac,
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
            margin: "16px 0 14px",
            opacity: 0.85,
          }}
        />
        <div style={{ fontSize: 112, lineHeight: 1, fontWeight: 600 }}>113</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1440,
          top: 292,
          opacity: frac,
          fontFamily: FONTS.serif,
          fontSize: 26,
          letterSpacing: 3,
          color: PALETTE.seal,
        }}
      >
        祖冲之 · 密率
      </div>

      <div
        style={{
          position: "absolute",
          ...COLUMN,
          top: 630,
          textAlign: "center",
          opacity: detail,
          fontFamily: FONTS.serif,
          fontSize: 34,
          letterSpacing: 1,
          color: PALETTE.inkSoft,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        = 3.141592920…
      </div>

      <div
        style={{
          position: "absolute",
          ...COLUMN,
          top: 692,
          textAlign: "center",
          opacity: six,
          fontFamily: FONTS.serif,
          fontSize: 30,
          letterSpacing: 3,
          color: PALETTE.seal,
        }}
      >
        小数点后六位，一位不差
      </div>

      <div
        style={{
          position: "absolute",
          ...COLUMN,
          top: 756,
          textAlign: "center",
          opacity: lost,
          fontFamily: FONTS.serif,
          fontSize: 20,
          letterSpacing: 2,
          color: PALETTE.inkFaint,
        }}
      >
        他的算法没有传下来
      </div>
    </div>
  );
};
