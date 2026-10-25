import React from "react";
import { HITS } from "../lib/beatmap";
import { enter, leave } from "../lib/motion";
import { FONTS, PALETTE } from "../lib/theme";
import { Seal } from "./Seal";

export const ResultAnnotations: React.FC<{ frame: number }> = ({ frame }) => {
  const note = enter(frame, HITS.band, 8) * leave(frame, HITS.bounds, 6);
  const formula = enter(frame, HITS.error, 8) * leave(frame, HITS.bounds, 6);
  const lower = enter(frame, HITS.bounds, 6);
  const middle = enter(frame, HITS.pi, 6);
  const upper = enter(frame, HITS.zu, 6);
  const attribution = enter(frame, HITS.seal, 6);
  const seal = enter(frame, HITS.seal, 6);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 140,
          opacity: note,
          fontFamily: FONTS.serif,
          fontSize: 52,
          lineHeight: 1.5,
          letterSpacing: 4,
          color: PALETTE.ink,
        }}
      >
        内接不足
        <br />
        外切有余
      </div>

      <div
        style={{
          position: "absolute",
          left: 172,
          top: 308,
          opacity: formula,
          fontFamily: FONTS.serif,
          fontSize: 28,
          letterSpacing: 2,
          color: PALETTE.inkSoft,
        }}
      >
        误差 ∝ 1/n²
      </div>

      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 250,
          fontFamily: FONTS.serif,
          color: PALETTE.seal,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        <div style={{ fontSize: 88, opacity: lower }}>3.1415926</div>
        <div
          style={{
            margin: "16px 0",
            fontSize: 60,
            opacity: middle,
            color: PALETTE.inkSoft,
            letterSpacing: 6,
          }}
        >
          &lt; π &lt;
        </div>
        <div style={{ fontSize: 88, opacity: upper }}>3.1415927</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 704,
          opacity: attribution,
          fontFamily: FONTS.serif,
          fontSize: 26,
          letterSpacing: 2,
          color: PALETTE.inkSoft,
        }}
      >
        祖冲之 · 429–500
      </div>

      <div
        style={{
          position: "absolute",
          left: 1500,
          top: 650,
          opacity: seal,
        }}
      >
        <Seal text="祖率" size={170} at={HITS.seal} duration={10} />
      </div>
    </>
  );
};
