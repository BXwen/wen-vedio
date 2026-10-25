import React from "react";
import { interpolateColors } from "remotion";
import { HITS110 } from "./timeline110";
import { enter, leave, pulse } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";
import { InkWash } from "../components/InkWash";

const DIGITS = [
  "3.1415926",
  "53589793",
  "23846264",
  "33832795",
  "02884197",
  "16939937",
  "51058209",
  "74944592",
  "30781640",
  "62862089",
  "98628034",
  "82534211",
];

/** One row every beat, so the column keeps moving without becoming a blur. */
const ROW_TIMES = DIGITS.map(
  (_, i) => HITS110.coda1 + i * HITS110.codaRowStep,
);

const ROW_H = 70;
const ROW_BOTTOM = 640;
const STREAM_LEFT = 473;
const STREAM_WIDTH = 300;

const HEADLINE = [
  { ch: "一", at: HITS110.coda1 },
  { ch: "个", at: HITS110.coda1 + 4 },
  { ch: "圆", at: HITS110.coda1 + 8 },
  { ch: "，", at: HITS110.coda2 },
  { ch: "算", at: HITS110.coda2 + 4 },
  { ch: "不", at: HITS110.coda2 + 8 },
  { ch: "尽", at: HITS110.coda2 + 12 },
];

/** Endless π, pouring through the ring it came from. */
export const Coda110: React.FC<{ frame: number }> = ({ frame }) => {
  const meta = enter(frame, HITS110.meta, 8);
  const infinite = meta * leave(frame, HITS110.coda1 - 6, 10);
  const calloutFade = leave(frame, HITS110.coda1 - 14, 10);
  const selfRef = enter(frame, HITS110.selfRef, 8) * calloutFade;
  const straight = enter(frame, HITS110.straight, 8) * calloutFade;

  const count = Math.round(
    Math.max(
      0,
      Math.min(
        160,
        ((frame - HITS110.straight - 2) / 22) * 160,
      ),
    ),
  );

  const codaFade = leave(frame, HITS110.codaEvery - 10, 10);
  const rowsIn = ROW_TIMES.reduce(
    (sum, at) => sum + enter(frame, at, 12),
    0,
  );

  const topRule = enter(frame, HITS110.coda1, 14);
  const headline = enter(frame, HITS110.coda1, 10);
  const stmt1In = enter(frame, HITS110.codaEndless, 8);
  const stmt2In = enter(frame, HITS110.codaNoSide, 8);
  const stmt1 = stmt1In * codaFade;
  const stmt2 = stmt2In * codaFade;
  // The thesis steps back as the two precise statements land beneath it.
  const headlineDim = headline * (1 - 0.4 * stmt1In);

  const final = enter(frame, HITS110.codaEvery, 10);
  const finalRule = enter(frame, HITS110.codaEvery + 8, 14);
  const sealPulse = pulse(frame, HITS110.seal, 12);

  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: codaFade }}>
        <InkWash
          cx={1300}
          cy={470}
          size={720}
          opacity={0.3 * enter(frame, HITS110.coda1, 10)}
        />

        <div
          style={{
            position: "absolute",
            left: 620,
            top: 540,
            transform: `translate(-50%, -50%) scale(${0.96 + 0.04 * meta})`,
            opacity: infinite,
            fontFamily: FONTS.serif,
            fontSize: 104,
            letterSpacing: 10,
            whiteSpace: "nowrap",
            color: PALETTE.seal,
          }}
        >
          无限
        </div>

        <div
          style={{
            position: "absolute",
            left: 858,
            top: 524,
            width: 96,
            height: 1,
            backgroundColor: PALETTE.inkSoft,
            opacity: 0.35 * selfRef,
            transform: `scaleX(${selfRef})`,
            transformOrigin: "left center",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 978,
            top: 486,
            opacity: selfRef,
            fontFamily: FONTS.serif,
            fontSize: 30,
            letterSpacing: 1.5,
            color: PALETTE.ink,
            whiteSpace: "nowrap",
          }}
        >
          这个 3D 环，也是直边拼的
        </div>
        <div
          style={{
            position: "absolute",
            left: 978,
            top: 548,
            opacity: straight,
            fontFamily: FONTS.serif,
            fontSize: 24,
            letterSpacing: 2,
            color: PALETTE.inkSoft,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 64,
              lineHeight: 1,
              letterSpacing: -1,
              fontVariantNumeric: "tabular-nums",
              color: PALETTE.seal,
            }}
          >
            {count}
          </span>
          <span style={{ marginLeft: 14 }}>段直边</span>
        </div>

        {/* The digits stream inside the ring's opening. */}
        <div
          style={{
            position: "absolute",
            left: STREAM_LEFT,
            top: 0,
            width: STREAM_WIDTH,
            height: "100%",
            pointerEvents: "none",
            maskImage:
              "linear-gradient(to bottom, transparent 330px, #000 385px, #000 700px, transparent 745px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 330px, #000 385px, #000 700px, transparent 745px)",
          }}
        >
          {DIGITS.map((digits, i) => {
            const at = ROW_TIMES[i];
            if (frame < at) return null;
            const e = enter(frame, at, 12);
            const y = ROW_BOTTOM + (i - rowsIn + 1) * ROW_H;
            return (
              <div
                key={digits}
                style={{
                  position: "absolute",
                  left: 0,
                  top: y,
                  width: STREAM_WIDTH,
                  height: ROW_H,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: enter(frame, at, 6),
                  transform: `translateX(${(1 - e) * 12}px)`,
                  fontFamily: FONTS.serif,
                  fontSize: 46,
                  lineHeight: 1,
                  letterSpacing: 2,
                  fontVariantNumeric: "tabular-nums",
                  color: interpolateColors(
                    frame,
                    [at, at + 20],
                    [PALETTE.seal, PALETTE.ink],
                  ),
                  whiteSpace: "nowrap",
                }}
              >
                {digits}
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 214,
            opacity: enter(frame, HITS110.coda1, 8),
            display: "flex",
            alignItems: "baseline",
            fontFamily: FONTS.serif,
            color: PALETTE.ink,
          }}
        >
          <span style={{ fontSize: 56, lineHeight: 1 }}>π</span>
          <span
            style={{
              marginLeft: 14,
              fontSize: 18,
              letterSpacing: 4,
              color: PALETTE.inkFaint,
            }}
          >
            圆周率
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 290,
            width: 600,
            height: 2,
            backgroundColor: PALETTE.seal,
            opacity: 0.9 * topRule,
            transform: `scaleX(${topRule})`,
            transformOrigin: "left center",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 344,
            opacity: enter(frame, HITS110.coda1, 8),
            fontFamily: FONTS.serif,
            fontSize: 24,
            letterSpacing: 6,
            whiteSpace: "nowrap",
            color: PALETTE.inkFaint,
          }}
        >
          π 的小数
        </div>
        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 386,
            display: "flex",
            alignItems: "baseline",
            opacity: headlineDim,
            fontFamily: FONTS.serif,
            fontSize: 80,
            lineHeight: 1.1,
            letterSpacing: 4,
            whiteSpace: "nowrap",
            color: PALETTE.ink,
          }}
        >
          {HEADLINE.map(({ ch, at }, i) => {
            const e = enter(frame, at, 10);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: e,
                  transform: `translateY(${(1 - e) * 12}px)`,
                  color:
                    ch === "圆"
                      ? PALETTE.seal
                      : ch === "，"
                        ? PALETTE.inkSoft
                        : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
          {(() => {
            const e = enter(frame, HITS110.coda2 + 20, 8);
            return (
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 10,
                  opacity: 0.5 * e,
                  transform: `translateY(${(1 - e) * 6}px)`,
                  color: PALETTE.inkSoft,
                }}
              >
                ……
              </span>
            );
          })()}
        </div>

        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 544,
            opacity: stmt1,
            transform: `translateY(${(1 - stmt1) * 14}px)`,
            fontFamily: FONTS.serif,
            whiteSpace: "nowrap",
            color: PALETTE.ink,
          }}
        >
          <span
            style={{
              fontSize: 62,
              lineHeight: 1,
              color: PALETTE.seal,
            }}
          >
            π
          </span>
          <span
            style={{
              marginLeft: 16,
              fontSize: 54,
              letterSpacing: 3,
            }}
          >
            没有最后一位
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 632,
            opacity: stmt2,
            transform: `translateY(${(1 - stmt2) * 14}px)`,
            fontFamily: FONTS.serif,
            fontSize: 54,
            letterSpacing: 3,
            whiteSpace: "nowrap",
            color: PALETTE.ink,
          }}
        >
          割圆术没有最后一边
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: final }}>
        <InkWash cx={920} cy={470} size={620} opacity={0.32 * final} />

        <div
          style={{
            position: "absolute",
            left: 605,
            top: 390,
            width: 630,
            height: 2,
            backgroundColor: PALETTE.seal,
            opacity: 0.9 * finalRule,
            transform: `scaleX(${finalRule})`,
            transformOrigin: "center",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 920,
            top: 442,
            transform: `translateX(-50%) scale(${0.97 + 0.03 * final + 0.02 * sealPulse})`,
            transformOrigin: "center",
            display: "flex",
            fontFamily: FONTS.serif,
            fontSize: 86,
            letterSpacing: 8,
            whiteSpace: "nowrap",
            color: PALETTE.seal,
          }}
        >
          {[..."但每一步都算数"].map((ch, i) => {
            const e = enter(frame, HITS110.codaEvery + i * 3, 8);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: e,
                  transform: `translateY(${(1 - e) * 10}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 920,
            top: 618,
            transform: "translateX(-50%)",
            opacity: enter(frame, HITS110.seal, 8),
            fontFamily: FONTS.serif,
            fontSize: 24,
            letterSpacing: 3,
            color: PALETTE.inkSoft,
            whiteSpace: "nowrap",
          }}
        >
          祖冲之 · 429–500
        </div>
      </div>
    </>
  );
};
