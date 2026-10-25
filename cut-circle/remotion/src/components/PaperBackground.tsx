import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { PALETTE } from "../lib/theme";

/**
 * 宣纸 ground: warm paper, fibre grain, faint laid lines, soft vignette.
 *
 * The fibre and mottle are a baked PNG (`scripts/gen-paper.py`), not SVG
 * filters. Two full-screen feTurbulence filters cost Skia a per-pixel CPU
 * pass on every frame, and they produced the same image 4800 times over —
 * baking them cut render time roughly in half. The texture is a multiply
 * layer, so `tone` stays a live CSS gradient on top of it.
 */
export const PaperBackground: React.FC<{
  /** 0 = cool white, 1 = warm deep paper. */
  tone?: number;
  /** Multiplier for the grain opacity. */
  grain?: number;
}> = ({ tone = 0.5, grain = 1 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom,
            rgba(255,249,238,${0.55 * (1 - tone)}) 0%,
            rgba(246,239,226,0.25) 55%,
            rgba(227,215,195,${0.35 + 0.25 * tone}) 100%)`,
        }}
      />
      <Img
        src={staticFile("paper-texture.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "multiply",
          opacity: grain,
        }}
      />
    </AbsoluteFill>
  );
};
