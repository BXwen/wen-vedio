import React from "react";
import { HITS60 } from "./timeline60";
import { enter } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";
import { Seal } from "../components/Seal";
import { VerticalText } from "../components/VerticalText";

/** Four vertical columns, right to left, then 祖率. */
export const Quote60: React.FC<{ frame: number }> = ({ frame }) => {
  const columns = [
    { left: 1680, text: "割之弥细", at: HITS60.quote1 },
    { left: 1570, text: "所失弥少", at: HITS60.quote2 },
    { left: 1460, text: "与圆合体", at: HITS60.quote3 },
    { left: 1350, text: "而无所失", at: HITS60.quote4 },
  ];
  const seal = enter(frame, HITS60.seal, 6);
  const source = enter(frame, HITS60.seal, 8);

  return (
    <>
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
          top: 620,
          opacity: seal,
        }}
      >
        <Seal text="祖率" size={160} at={HITS60.seal} duration={10} />
      </div>

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
    </>
  );
};
