import React from "react";
import { HITS } from "../lib/beatmap";
import { enter, leave, slam } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";
import { Seal } from "./Seal";
import { VerticalText } from "./VerticalText";

const DigitRow: React.FC<{
  frame: number;
  text: string;
  startFrame: number;
  stagger: number;
}> = ({ frame, text, startFrame, stagger }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "baseline",
      gap: 4,
      fontFamily: FONTS.serif,
      color: PALETTE.ink,
      fontVariantNumeric: "tabular-nums",
    }}
  >
    {Array.from(text).map((char, i) => {
      const o = enter(frame, startFrame + i * stagger, 5);
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            fontSize: char === "." ? 48 : 64,
            fontWeight: 500,
            letterSpacing: 4,
            opacity: o,
            transform: `translateY(${(1 - o) * 16}px)`,
          }}
        >
          {char}
        </span>
      );
    })}
  </div>
);

/**
 * Cold open. The result lands first; the method starts after the second accent.
 * Everything here is on the measured BGM frames.
 */
export const Hook: React.FC<{ frame: number }> = ({ frame }) => {
  const piOpacity =
    frame < HITS.collapse ? 1 : leave(frame, HITS.collapse, 10);
  const piScale =
    1 +
    0.18 * slam(frame, HITS.open, 10) -
    0.85 * enter(frame, HITS.collapse, 12);
  const piLabel = enter(frame, 6, 8) * leave(frame, HITS.collapse, 6);
  const digits = enter(frame, HITS.digit, 5) * leave(frame, HITS.collapse, 8);
  const meta = enter(frame, HITS.number, 8) * leave(frame, HITS.collapse, 6);
  const underline = enter(frame, HITS.number, 8) * leave(frame, HITS.collapse, 6);
  const left = enter(frame, HITS.ruler, 5) * leave(frame, HITS.title, 8);
  // The title lands with the ruler at 1.9s and holds through the hexagon cut,
  // so the name is readable for ~1.5s rather than the old half second.
  const title =
    enter(frame, HITS.ruler, 8) * leave(frame, HITS.hexagon, 3);
  const seal = enter(frame, HITS.paper, 6) * leave(frame, HITS.hexagon, 3);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 100,
          height: 640,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: piOpacity,
          transform: `scale(${piScale})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 880,
            height: 880,
            marginLeft: -440,
            marginTop: -440,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(58,52,43,0.17) 0%, rgba(58,52,43,0.07) 55%, rgba(58,52,43,0) 72%)",
            filter: "blur(20px)",
            mixBlendMode: "multiply",
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: FONTS.serif,
            fontSize: 720,
            fontWeight: 600,
            lineHeight: 1,
            color: PALETTE.seal,
            textShadow: "0 0 30px rgba(179,39,30,0.12)",
          }}
        >
          π
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 118,
          textAlign: "center",
          opacity: piLabel,
          fontFamily: FONTS.serif,
          fontSize: 30,
          letterSpacing: 24,
          color: PALETTE.inkFaint,
        }}
      >
        圆周率
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 786,
          opacity: digits,
        }}
      >
        <DigitRow
          frame={frame}
          text="3.1415926"
          startFrame={HITS.digit}
          stagger={2}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 872,
          width: 520,
          height: 3,
          marginLeft: -260,
          backgroundColor: PALETTE.seal,
          opacity: 0.8 * underline,
          transform: `scaleX(${underline})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          textAlign: "center",
          opacity: meta,
          fontFamily: FONTS.serif,
          fontSize: 30,
          letterSpacing: 5,
          color: PALETTE.inkSoft,
        }}
      >
        祖冲之 · 公元 5 世纪
      </div>

      <div
        style={{
          position: "absolute",
          left: 170,
          top: 576,
          opacity: left,
          fontFamily: FONTS.serif,
          color: PALETTE.ink,
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 7,
            color: PALETTE.seal,
            opacity: enter(frame, HITS.ruler, 6),
            transform: `translateY(${(1 - enter(frame, HITS.ruler, 6)) * 18}px)`,
          }}
        >
          公元 5 世纪
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 64,
            lineHeight: 1.36,
            letterSpacing: 4,
            opacity: enter(frame, HITS.ruler, 6),
            transform: `translateY(${(1 - enter(frame, HITS.ruler, 6)) * 18}px)`,
          }}
        >
          没有微积分
        </div>
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.36,
            letterSpacing: 4,
            opacity: enter(frame, HITS.lineOnly, 6),
            transform: `translateY(${(1 - enter(frame, HITS.lineOnly, 6)) * 18}px)`,
          }}
        >
          只有直线
        </div>
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.36,
            letterSpacing: 4,
            opacity: enter(frame, HITS.paper, 6),
            transform: `translateY(${(1 - enter(frame, HITS.paper, 6)) * 18}px)`,
          }}
        >
          和一张纸
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1440,
          top: 120,
          opacity: title,
        }}
      >
        <VerticalText
          text="割圆术"
          fontSize={150}
          startFrame={HITS.ruler}
          stagger={2}
          duration={10}
          color={PALETTE.ink}
          weight={600}
          letterSpacing={16}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 1460,
          top: 672,
          opacity: seal,
          textAlign: "center",
        }}
      >
        <Seal text="刘徽" size={110} at={HITS.paper} duration={10} />
        <div
          style={{
            marginTop: 14,
            fontFamily: FONTS.serif,
            fontSize: 20,
            letterSpacing: 3,
            color: PALETTE.inkSoft,
          }}
        >
          263 年
        </div>
      </div>
    </>
  );
};
