import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { PaperBackground } from "../components/PaperBackground";
import { VerticalText } from "../components/VerticalText";
import { SolarRing } from "../components/SolarRing";
import { PALETTE, SEASONS, type SeasonKey } from "../lib/theme";

const ease = Easing.bezier(0.65, 0, 0.35, 1);
const ORDER: SeasonKey[] = ["spring", "summer", "autumn", "winter"];

/**
 * 0:20–0:30 — four colour bands, then they close into the wheel.
 * The bands are the wheel unrolled; watching them wrap is the point.
 */
export const Seasons: React.FC = () => {
  const frame = useCurrentFrame();

  // bands slide in 0–60, hold, then rotate/contract 150–290
  const bandT = ORDER.map((_, i) =>
    interpolate(frame, [i * 8, i * 8 + 34], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  );

  const wrap = interpolate(frame, [150, 290], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  const bandW = 300;
  const gap = 14;
  const totalW = bandW * 4 + gap * 3;
  const startX = 960 - totalW / 2;

  return (
    <AbsoluteFill>
      <PaperBackground tone={0.55} />

      {/* the four bands, which contract into the wheel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(wrap, [0.72, 1], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {ORDER.map((s, i) => {
          const t = bandT[i];
          return (
            <div
              key={s}
              style={{
                position: "absolute",
                left: startX + i * (bandW + gap),
                top: 220,
                width: bandW,
                height: 640,
                backgroundColor: SEASONS[s].accent,
                opacity: 0.9 * t,
                translate: `0 ${(1 - t) * 60}px`,
                scale: `${1 + (1 - t) * 0.06} ${1 - (1 - t) * 0.12}`,
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.14), rgba(0,0,0,0.16))`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 40,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <VerticalText
                  text={SEASONS[s].glyph}
                  fontSize={150}
                  startFrame={i * 8 + 18}
                  stagger={0}
                  duration={24}
                  color="#FDF8EE"
                  weight={600}
                  letterSpacing={0}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: "NotoSerifSC",
                  fontSize: 30,
                  letterSpacing: 8,
                  color: "#FDF8EE",
                  opacity: 0.92,
                }}
              >
                {["春生", "夏长", "秋收", "冬藏"][i]}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 96,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: "NotoSerifSC",
                  fontSize: 19,
                  letterSpacing: 3,
                  color: "#FDF8EE",
                  opacity: 0.7,
                }}
              >
                {["2月—4月", "5月—7月", "8月—10月", "11月—1月"][i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* the wheel they become */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(wrap, [0.35, 0.95], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <SolarRing
          size={620}
          cursor={24}
          reveal={wrap}
          labels
          sun={false}
          seasons
          dimUnreached={1}
        />
      </div>

      {/* closing line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 168,
          textAlign: "center",
          fontFamily: "NotoSerifSC",
          fontSize: 26,
          letterSpacing: 12,
          color: PALETTE.inkSoft,
          opacity: interpolate(frame, [20, 56], [0, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        二十四节，二十四格
      </div>
    </AbsoluteFill>
  );
};
