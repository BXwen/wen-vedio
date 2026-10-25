import React from "react";
import { HITS, SIDES } from "../lib/beatmap";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

/** The ten rungs of the doubling: 6 to 3072. */
export const DoublingLadder: React.FC<{
  frame: number;
  sideCount: number | null;
  /** Defaults to the 10s demo's result frame. */
  fadeOutAt?: number;
}> = ({ frame, sideCount, fadeOutAt = HITS.result }) => {
  // The ladder has done its job once the result lands; clear the corner for
  // the loupe and the final bounds.
  const opacity =
    enter(frame, HITS.hexagon, 10) *
    (frame < fadeOutAt ? 1 : leave(frame, fadeOutAt, 8));
  const currentIndex = SIDES.findIndex((s) => s.n === sideCount);

  return (
    <div
      style={{
        position: "absolute",
        left: 360,
        top: 912,
        width: 1200,
        height: 80,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          top: 43,
          height: 1,
          backgroundColor: PALETTE.inkFaint,
          opacity: 0.4,
        }}
      />
      {SIDES.map((s, i) => {
        const x = 30 + i * 126;
        const active = i <= currentIndex;
        const current = i === currentIndex;
        return (
          <div
            key={s.n}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONTS.serif,
                fontSize: current ? 21 : 17,
                fontWeight: current ? 700 : 500,
                color: current
                  ? PALETTE.seal
                  : active
                    ? PALETTE.inkSoft
                    : PALETTE.inkFaint,
                opacity: current ? 1 : 0.68,
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
                lineHeight: 1,
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                width: current ? 10 : 5.5,
                height: current ? 10 : 5.5,
                borderRadius: "50%",
                backgroundColor: current
                  ? PALETTE.seal
                  : active
                    ? PALETTE.inkSoft
                    : PALETTE.inkFaint,
                margin: "9px auto 0",
                opacity: active ? 1 : 0.45,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
