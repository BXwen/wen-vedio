import React from "react";
import { HITS } from "../lib/beatmap";
import { enter } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

export const Hud: React.FC<{
  frame: number;
  sideCount: number | null;
}> = ({ frame, sideCount }) => {
  const opacity = enter(frame, HITS.hexagon, 10);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
      }}
    >
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <g
          stroke={PALETTE.inkFaint}
          strokeWidth={1.4}
          fill="none"
          opacity={0.5}
        >
          <path d="M62 44 h-18 v-18" />
          <path d="M1858 44 h18 v-18" />
          <path d="M62 1036 h-18 v18" />
          <path d="M1858 1036 h18 v18" />
        </g>
        <line
          x1={96}
          y1={120}
          x2={1824}
          y2={120}
          stroke={PALETTE.inkFaint}
          strokeWidth={1}
          opacity={0.32}
        />
        <line
          x1={96}
          y1={884}
          x2={1824}
          y2={884}
          stroke={PALETTE.inkFaint}
          strokeWidth={1}
          opacity={0.32}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 52,
          fontFamily: FONTS.serif,
          fontSize: 27,
          letterSpacing: 3,
          color: PALETTE.inkSoft,
        }}
      >
        割圆术
        <span style={{ margin: "0 13px", opacity: 0.5 }}>·</span>
        <span style={{ fontSize: 22, opacity: 0.85 }}>用直线量圆</span>
      </div>

      {sideCount !== null && (
        <div
          style={{
            position: "absolute",
            right: 96,
            top: 50,
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            fontFamily: FONTS.serif,
            color: PALETTE.seal,
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: 1,
            }}
          >
            {sideCount}
          </span>
          <span style={{ fontSize: 22, color: PALETTE.inkSoft }}>边</span>
          <span
            style={{
              fontSize: 15,
              color: PALETTE.inkFaint,
              letterSpacing: 2,
              marginLeft: 6,
            }}
          >
            正多边形
          </span>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          right: 96,
          bottom: 30,
          fontFamily: FONTS.serif,
          fontSize: 15,
          letterSpacing: 1.2,
          color: PALETTE.inkFaint,
          opacity: 0.85,
        }}
      >
        刘徽《九章算术注》· 263 年
      </div>

      <div
        style={{
          position: "absolute",
          left: 96,
          bottom: 30,
          fontFamily: FONTS.serif,
          fontSize: 15,
          letterSpacing: 1,
          color: PALETTE.inkFaint,
          opacity: 0.6,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(Math.floor(frame / 30)).padStart(2, "0")}s
      </div>
    </div>
  );
};
