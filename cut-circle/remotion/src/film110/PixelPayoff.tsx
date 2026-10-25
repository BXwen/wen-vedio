import React from "react";
import { Easing, interpolate } from "remotion";
import { HITS110 } from "./timeline110";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";

const polygon = (n: number, cx: number, cy: number, r: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return `${i === 0 ? "M" : "L"} ${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`;
  }).join(" ") + " Z";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const SCREEN_W = 352;
const SCREEN_H = 692;
const LENS_X = 176;
const LENS_Y = 178;
const LENS_MAX = 560;

/** 96-gon on a phone screen, a pixel-level magnifier, then a faceted sphere. */
export const PixelPayoff: React.FC<{ frame: number }> = ({ frame }) => {
  const copy =
    enter(frame, HITS110.pixel, 8) * leave(frame, HITS110.games - 4, 6);
  const phone =
    enter(frame, HITS110.pixel, 8) * leave(frame, HITS110.games - 4, 6);
  const proof =
    enter(frame, HITS110.pixelProof, 8) *
    leave(frame, HITS110.games - 4, 6);
  const games =
    enter(frame, HITS110.games, 6) * leave(frame, HITS110.quote1 - 4, 6);
  const line2 = enter(frame, HITS110.gamesLine2, 8);

  const dim = interpolate(
    frame,
    [HITS110.pixelProof, HITS110.pixelProof + 12],
    [1, 0.55],
    CLAMP,
  );
  const lens = interpolate(
    frame,
    [HITS110.pixelZoom, HITS110.pixelZoom + 19],
    [0, 1],
    { ...CLAMP, easing: Easing.out(Easing.cubic) },
  );
  const lensR = LENS_MAX * lens;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: 918,
          top: 168,
          width: 330,
          opacity: copy * dim,
          fontFamily: FONTS.serif,
          fontSize: 26,
          lineHeight: 1.6,
          letterSpacing: 1,
          color: PALETTE.ink,
        }}
      >
        96 边形画满屏，
        <br />
        手机上差不到 1 像素
      </div>

      <div
        style={{
          position: "absolute",
          left: 918,
          top: 372,
          opacity: proof,
          fontFamily: FONTS.serif,
          fontSize: 26,
          letterSpacing: 4,
          color: PALETTE.inkSoft,
        }}
      >
        差
      </div>
      <div
        style={{
          position: "absolute",
          left: 912,
          top: 400,
          opacity: proof,
          fontFamily: FONTS.serif,
          fontSize: 128,
          lineHeight: 1,
          letterSpacing: -1,
          fontVariantNumeric: "tabular-nums",
          color: PALETTE.seal,
        }}
      >
        0.29
      </div>
      <div
        style={{
          position: "absolute",
          left: 918,
          top: 540,
          opacity: proof,
          fontFamily: FONTS.serif,
          fontSize: 26,
          letterSpacing: 4,
          color: PALETTE.inkSoft,
        }}
      >
        像素
      </div>
      <div
        style={{
          position: "absolute",
          left: 918,
          top: 602,
          opacity: proof,
          fontFamily: FONTS.serif,
          fontSize: 17,
          letterSpacing: 3,
          color: PALETTE.inkFaint,
        }}
      >
        96 边形与圆的最大间隙
      </div>

      <div
        style={{
          position: "absolute",
          left: 1320,
          top: 130,
          width: 380,
          height: 720,
          opacity: phone,
          border: `2px solid ${PALETTE.inkSoft}`,
          borderRadius: 34,
          backgroundColor: "#F8F2E7",
          boxShadow: "0 24px 60px rgba(60,48,32,0.16)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 14,
            borderRadius: 24,
            backgroundColor: "#F3EBDD",
            overflow: "hidden",
          }}
        >
          <svg width={SCREEN_W} height={SCREEN_H} viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`}>
            <circle
              cx={176}
              cy={320}
              r={145}
              fill="none"
              stroke={PALETTE.ink}
              strokeWidth={2}
            />
            <path
              d={polygon(96, 176, 320, 145)}
              fill="none"
              stroke={PALETTE.ochreDeep}
              strokeWidth={1.6}
              opacity={0.9}
            />
            <text
              x={176}
              y={505}
              textAnchor="middle"
              fontFamily={FONTS.serif}
              fontSize={22}
              letterSpacing={3}
              fill={PALETTE.inkSoft}
            >
              96 边
            </text>
          </svg>

          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `circle(${lensR}px at ${LENS_X}px ${LENS_Y}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#F7F1E6",
                backgroundImage:
                  "linear-gradient(to right, rgba(28,26,23,0.13) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,26,23,0.13) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <svg
              width={SCREEN_W}
              height={SCREEN_H}
              viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* One pixel cell is 20px here; the 0.29px sagitta is the
                  6px sliver between the arc and its chord. */}
              <path
                d="M 40 340 Q 176 328 312 340 L 40 340 Z"
                fill={PALETTE.seal}
                opacity={0.26}
              />
              <path
                d="M 40 340 Q 176 328 312 340"
                fill="none"
                stroke={PALETTE.seal}
                strokeWidth={2}
              />
              <path
                d="M 40 340 L 312 340"
                fill="none"
                stroke={PALETTE.ochreDeep}
                strokeWidth={2}
              />
              <line
                x1={176}
                y1={326}
                x2={176}
                y2={348}
                stroke={PALETTE.seal}
                strokeWidth={1}
                opacity={0.45}
              />
              <text
                x={176}
                y={574}
                textAnchor="middle"
                fontFamily={FONTS.serif}
                fontSize={16}
                letterSpacing={3}
                fill={PALETTE.inkSoft}
              >
                1 格 = 1 像素
              </text>
              <text
                x={176}
                y={606}
                textAnchor="middle"
                fontFamily={FONTS.serif}
                fontSize={13}
                letterSpacing={2}
                fill={PALETTE.inkFaint}
              >
                放大 20 倍
              </text>
            </svg>
          </div>

          <svg
            width={SCREEN_W}
            height={SCREEN_H}
            viewBox={`0 0 ${SCREEN_W} ${SCREEN_H}`}
            style={{ position: "absolute", inset: 0, opacity: 1 - lens }}
          >
            <circle
              cx={LENS_X}
              cy={LENS_Y}
              r={lensR}
              fill="none"
              stroke={PALETTE.seal}
              strokeWidth={2}
              opacity={0.8}
            />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 940,
          top: 540,
          width: 300,
          opacity: games,
          fontFamily: FONTS.serif,
          fontSize: 32,
          lineHeight: 1.55,
          letterSpacing: 1,
          color: PALETTE.ink,
        }}
      >
        游戏和三维动画，
        <br />
        <span style={{ opacity: line2 }}>至今还在用直边拼圆</span>
      </div>
    </div>
  );
};
