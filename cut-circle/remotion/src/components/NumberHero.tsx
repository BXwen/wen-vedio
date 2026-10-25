import React from "react";
import { HITS } from "../lib/beatmap";
import { enter, leave, slam } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

const BigNumber: React.FC<{
  frame: number;
  text: string;
  label: string;
  at: number;
  until: number;
  size: number;
}> = ({ frame, text, label, at, until, size }) => {
  const opacity = enter(frame, at, 6) * leave(frame, until, 6);
  const scale = 1 + 0.16 * slam(frame, at, 9);
  const underline = enter(frame, at + 2, 9);

  return (
    <div
      style={{
        position: "absolute",
        left: 1130,
        top: 300,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      <div
        style={{
          fontFamily: FONTS.serif,
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: 2,
          color: PALETTE.seal,
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      <div
        style={{
          marginTop: 16,
          height: 3,
          width: text.length * size * 0.56,
          backgroundColor: PALETTE.seal,
          transform: `scaleX(${underline})`,
          transformOrigin: "left center",
          opacity: 0.75,
        }}
      />
      <div
        style={{
          marginTop: 22,
          fontFamily: FONTS.serif,
          fontSize: 25,
          letterSpacing: 3,
          color: PALETTE.inkSoft,
          opacity: enter(frame, at + 4, 6),
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const NumberHero: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {frame >= HITS.d192 && frame < HITS.result && (
      <BigNumber
        frame={frame}
        text="3.14"
        label="192 边 · 刘徽"
        at={HITS.d192}
        until={HITS.result - 4}
        size={230}
      />
    )}
    {frame >= HITS.result && frame < HITS.bounds && (
      <BigNumber
        frame={frame}
        text="3.1416"
        label="3072 边 · 刘徽"
        at={HITS.result}
        until={HITS.bounds - 2}
        size={182}
      />
    )}
  </>
);
