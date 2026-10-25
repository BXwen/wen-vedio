import React from "react";
import { HITS, SIDES } from "../lib/beatmap";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

const stepAt = (frame: number): number => {
  for (let i = SIDES.length - 1; i >= 0; i -= 1) {
    if (frame >= SIDES[i].at) return SIDES[i].at;
  }
  return HITS.hexagon;
};

/** Big side count during the doubling run, 97–160. */
export const SideHero: React.FC<{
  frame: number;
  sideCount: number | null;
}> = ({ frame, sideCount }) => {
  if (sideCount === null || sideCount > 192) return null;
  const at = stepAt(frame);
  const opacity = enter(frame, HITS.hexagon, 8) * leave(frame, 157, 5);
  const stepIn = enter(frame, at, 4);
  const scale = 1 + 0.08 * (1 - stepIn);

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
      {sideCount === 6 ? (
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

      {sideCount === 6 && (
        <div
          style={{
            marginTop: 38,
            fontFamily: FONTS.serif,
            fontSize: 46,
            letterSpacing: 2,
            color: PALETTE.seal,
            opacity: leave(frame, HITS.d12 - 2, 5),
          }}
        >
          π ≈ 3
        </div>
      )}
    </div>
  );
};
