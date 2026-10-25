import React from "react";
import { HITS60, sideAtFrame60, stepAtFrame60 } from "./timeline60";
import { enter, leave, slam } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

/**
 * 20.2s: 3.14 lands. 22.4s onward: the side count becomes the hero while 3.14
 * stays as a small reminder. 31.7s: 3.1416 takes over on the drop.
 */
export const RunHero60: React.FC<{ frame: number }> = ({ frame }) => {
  const three14 = enter(frame, HITS60.three14, 6) * leave(frame, HITS60.d384 - 4, 5);
  const run = enter(frame, HITS60.d384, 6) * leave(frame, HITS60.result - 4, 5);
  // The big 3.1416 is a stage prop: it leaves on the beat that starts the
  // bounds. A cross-dissolve here would stack two large numbers on top of
  // each other for six frames.
  const result = frame < HITS60.bounds ? enter(frame, HITS60.result, 6) : 0;

  const n = sideAtFrame60(frame) ?? 3072;
  const at = stepAtFrame60(frame);
  const stepIn = enter(frame, at, 4);
  const scale = 1 + 0.1 * (1 - stepIn);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 1130,
          top: 300,
          opacity: three14,
          transform: `scale(${1 + 0.16 * slam(frame, HITS60.three14, 9)})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 230,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: 2,
            color: PALETTE.seal,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          3.14
        </div>
        <div
          style={{
            marginTop: 16,
            height: 3,
            width: 500,
            backgroundColor: PALETTE.seal,
            transform: `scaleX(${enter(frame, HITS60.three14 + 2, 9)})`,
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
          }}
        >
          192 边 · 刘徽
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1130,
          top: 210,
          opacity: run,
          fontFamily: FONTS.serif,
          color: PALETTE.seal,
        }}
      >
        <span
          style={{
            fontSize: 66,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: 2,
          }}
        >
          3.14
        </span>
        <span
          style={{
            marginLeft: 18,
            fontSize: 24,
            color: PALETTE.inkFaint,
            letterSpacing: 3,
          }}
        >
          继续逼近
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1130,
          top: 330,
          opacity: run,
          transform: `scale(${scale})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            fontFamily: FONTS.serif,
            color: PALETTE.ink,
          }}
        >
          <span
            style={{
              fontSize: 210,
              fontWeight: 600,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {n}
          </span>
          <span style={{ fontSize: 40, color: PALETTE.inkSoft }}>边</span>
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: FONTS.serif,
            fontSize: 24,
            letterSpacing: 3,
            color: PALETTE.inkFaint,
          }}
        >
          每次翻一倍
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1130,
          top: 300,
          opacity: result,
          transform: `scale(${1 + 0.18 * slam(frame, HITS60.result, 10)})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.serif,
            fontSize: 182,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: 2,
            color: PALETTE.seal,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          3.1416
        </div>
        <div
          style={{
            marginTop: 16,
            height: 3,
            width: 610,
            backgroundColor: PALETTE.seal,
            transform: `scaleX(${enter(frame, HITS60.result + 2, 9)})`,
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
          }}
        >
          3072 边 · 刘徽
        </div>
      </div>
    </>
  );
};
