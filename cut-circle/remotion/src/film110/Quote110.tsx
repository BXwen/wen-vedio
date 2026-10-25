import React from "react";
import { HITS110 } from "./timeline110";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";
import { InkWash } from "../components/InkWash";
import { Seal } from "../components/Seal";
import { VerticalText } from "../components/VerticalText";

/** Five columns, right to left: the full quote, then a small 刘徽 seal. */
export const Quote110: React.FC<{ frame: number }> = ({ frame }) => {
  const columns = [
    { left: 1680, text: "割之弥细", at: HITS110.quote1 },
    { left: 1570, text: "所失弥少", at: HITS110.quote2 },
    { left: 1460, text: "割之又割", at: HITS110.quote3 },
    { left: 1350, text: "与圆合体", at: HITS110.quote4 },
    { left: 1240, text: "而无所失", at: HITS110.quote5 },
  ];
  const fade = leave(frame, HITS110.quoteEnd - 4, 4);
  const source = enter(frame, HITS110.quoteSource, 8);
  const seal = enter(frame, HITS110.quoteSeal, 6);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fade }}>
      <InkWash
        cx={1260}
        cy={300}
        size={600}
        opacity={0.35 * enter(frame, HITS110.quote1, 8)}
      />

      {columns.map((c) => (
        <div
          key={c.text}
          style={{
            position: "absolute",
            left: c.left,
            top: 140,
          }}
        >
          <VerticalText
            text={c.text}
            fontSize={88}
            startFrame={c.at}
            stagger={4}
            duration={12}
            color={PALETTE.ink}
            weight={500}
            letterSpacing={12}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: 1180,
          top: 820,
          opacity: source,
          fontFamily: FONTS.serif,
          fontSize: 20,
          letterSpacing: 2,
          color: PALETTE.inkFaint,
          whiteSpace: "nowrap",
        }}
      >
        刘徽《九章算术注》· 263 年
      </div>

      <div
        style={{
          position: "absolute",
          left: 1530,
          top: 740,
          opacity: seal,
        }}
      >
        <Seal text="刘徽" size={80} at={HITS110.quoteSeal} duration={8} />
      </div>
    </div>
  );
};
