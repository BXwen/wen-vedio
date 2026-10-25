import React from "react";
import { HITS60, stepAtFrame60 } from "./timeline60";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

/** Side-count hero during the first run and the 192-side build. */
export const SideHero60: React.FC<{
  frame: number;
  sideCount: number | null;
}> = ({ frame, sideCount }) => {
  if (sideCount === null) return null;

  // Only 6–96 live here. The 192 milestone lands with 3.14 in RunHero60.
  const opacity =
    frame < HITS60.breakdown
      ? enter(frame, HITS60.hexagon, 8) * leave(frame, HITS60.breakdown - 4, 5)
      : 0;

  if (opacity <= 0.001) return null;

  const at = stepAtFrame60(frame);
  const stepIn = enter(frame, at, 4);
  const scale = 1 + 0.08 * (1 - stepIn);
  const isFirst = sideCount === 6;

  return (
    <div
      style={{
        position: "absolute",
        left: 1140,
        top: 330,
        width: 620,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      }}
    >
      {isFirst ? (
        <>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 128,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: 8,
              color: PALETTE.ink,
            }}
          >
            六觚
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONTS.serif,
              fontSize: 27,
              letterSpacing: 5,
              color: PALETTE.inkSoft,
            }}
          >
            正六边形
          </div>
        </>
      ) : (
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
              fontSize: 128,
              fontWeight: 600,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {sideCount}
          </span>
          <span style={{ fontSize: 38, color: PALETTE.inkSoft }}>边</span>
        </div>
      )}

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

      {isFirst && (
        <div
          style={{
            marginTop: 38,
            fontFamily: FONTS.serif,
            fontSize: 46,
            letterSpacing: 2,
            color: PALETTE.seal,
            opacity: leave(frame, HITS60.d12 - 2, 5),
          }}
        >
          π ≈ 3
        </div>
      )}
    </div>
  );
};
