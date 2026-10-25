import React from "react";
import { useCurrentFrame } from "remotion";
import { HUD, PALETTE, SEASONS, type SeasonKey } from "../lib/theme";
import { TERMS } from "../data/terms";

/**
 * The frame that never moves: title top-left, chapter mark top-right,
 * the 24-dot year along the bottom, citation bottom-right, corner rules.
 * Because it is constant, the viewer always knows where in the year they are.
 */
export const Hud: React.FC<{
  /** 0..23, or null before the terms scene. */
  termIndex?: number | null;
  /** Fractional position within the current card, 0..1. */
  progress?: number;
  chapter?: { index: number; label: string; season?: SeasonKey } | null;
  /** 0..1 fade for the whole HUD. */
  opacity?: number;
  /** Show the bottom term rail. */
  rail?: boolean;
  /** Global frame, for scenes that sit inside a Sequence. */
  frame?: number;
}> = ({
  termIndex = null,
  progress = 0,
  chapter = null,
  opacity = 1,
  rail = true,
  frame: frameProp,
}) => {
  const localFrame = useCurrentFrame();
  const frame = frameProp ?? localFrame;
  const cursor = termIndex === null ? null : termIndex + progress;

  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {/* corner rules */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <g stroke={PALETTE.inkFaint} strokeWidth="1.5" fill="none" opacity="0.55">
          <path d={`M${HUD.marginX - 34} ${HUD.marginY - 26} h-22 v-22`} />
          <path d={`M${1920 - HUD.marginX + 34} ${HUD.marginY - 26} h22 v-22`} />
          <path d={`M${HUD.marginX - 34} ${1080 - HUD.marginY + 26} h-22 v22`} />
          <path d={`M${1920 - HUD.marginX + 34} ${1080 - HUD.marginY + 26} h22 v22`} />
        </g>
        <line x1={HUD.marginX} y1={HUD.ruleTop} x2={1920 - HUD.marginX} y2={HUD.ruleTop} stroke={PALETTE.inkFaint} strokeWidth="1" opacity="0.35" />
        <line x1={HUD.marginX} y1={HUD.ruleBottom} x2={1920 - HUD.marginX} y2={HUD.ruleBottom} stroke={PALETTE.inkFaint} strokeWidth="1" opacity="0.35" />
      </svg>

      {/* title, top-left */}
      <div
        style={{
          position: "absolute",
          left: HUD.marginX,
          top: HUD.marginY - 44,
          fontFamily: "NotoSerifSC",
          fontSize: 27,
          letterSpacing: 3,
          color: PALETTE.inkSoft,
        }}
      >
        二十四节气
        <span style={{ margin: "0 14px", opacity: 0.5 }}>·</span>
        <span style={{ fontSize: 22, opacity: 0.85 }}>太阳的刻度</span>
      </div>

      {/* chapter mark, top-right */}
      {chapter && (
        <div
          style={{
            position: "absolute",
            right: HUD.marginX,
            top: HUD.marginY - 44,
            fontFamily: "NotoSerifSC",
            fontSize: 26,
            letterSpacing: 5,
            color: chapter.season ? SEASONS[chapter.season].accent : PALETTE.seal,
          }}
        >
          第{["一", "二", "三", "四"][chapter.index]}章 · {chapter.label}
        </div>
      )}

      {/* 24-dot rail */}
      {rail && (
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          {TERMS.map((t, i) => {
            const x = 300 + i * 58;
            const y = HUD.ruleBottom + 54;
            const active = cursor !== null && i <= cursor;
            const current = cursor !== null && Math.floor(cursor) === i;
            return (
              <g key={t.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={current ? 6.5 : 3.6}
                  fill={active ? PALETTE.seal : PALETTE.inkFaint}
                  opacity={active ? 1 : 0.5}
                />
                <text
                  x={x}
                  y={y - 26}
                  textAnchor="middle"
                  fontFamily="NotoSerifSC"
                  fontSize={current ? 20 : 17}
                  fill={current ? PALETTE.seal : PALETTE.inkFaint}
                  opacity={current ? 1 : 0.55}
                >
                  {t.name}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* citation, bottom-right */}
      <div
        style={{
          position: "absolute",
          right: HUD.marginX,
          bottom: HUD.marginY - 42,
          fontFamily: "NotoSerifSC",
          fontSize: 15,
          letterSpacing: 1.5,
          color: PALETTE.inkFaint,
          opacity: 0.8,
        }}
      >
        交节时刻依 JPL DE421 历表 · 北京时 · 画作藏于大都会艺术博物馆（公有领域）
      </div>

      {/* frame counter — the "this is a film" cue, tiny */}
      <div
        style={{
          position: "absolute",
          left: HUD.marginX,
          bottom: HUD.marginY - 42,
          fontFamily: "NotoSerifSC",
          fontSize: 15,
          letterSpacing: 1,
          color: PALETTE.inkFaint,
          opacity: 0.55,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(Math.floor(frame / 30)).padStart(2, "0")}s
      </div>
    </div>
  );
};
