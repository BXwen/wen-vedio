import React from "react";

/**
 * A soft ink wash under large type. Two offset radial gradients give an
 * irregular edge without a per-frame blur filter, which would be expensive
 * over a 60-second render.
 */
export const InkWash: React.FC<{
  cx: number;
  cy: number;
  size: number;
  opacity?: number;
}> = ({ cx, cy, size, opacity = 0.55 }) => (
  <div
    style={{
      position: "absolute",
      left: cx - size / 2,
      top: cy - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      background:
        "radial-gradient(circle at 46% 44%, rgba(58,52,43,0.14) 0%, rgba(58,52,43,0.07) 38%, rgba(58,52,43,0.02) 62%, rgba(58,52,43,0) 74%), radial-gradient(circle at 58% 56%, rgba(58,52,43,0.08) 0%, rgba(58,52,43,0) 60%)",
      mixBlendMode: "multiply",
      opacity,
      pointerEvents: "none",
    }}
  />
);
