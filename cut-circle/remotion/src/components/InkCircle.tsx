import React from "react";
import { arcPath, polar } from "../lib/geometry";
import { PALETTE } from "../lib/theme";

/**
 * A brushed circle with a small gap at the lower left. The gap keeps it from
 * reading as a perfect vector shape, and it is where the "one stroke" ends.
 */
export const InkCircle: React.FC<{
  cx: number;
  cy: number;
  r: number;
  progress?: number;
  opacity?: number;
  color?: string;
  strokeWidth?: number;
}> = ({
  cx,
  cy,
  r,
  progress = 1,
  opacity = 1,
  color = PALETTE.ink,
  strokeWidth = 3.6,
}) => {
  const d = arcPath(cx, cy, r, -120, 357);
  const [sx, sy] = polar(cx, cy, r, -120);

  return (
    <g opacity={opacity}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - progress}
      />
      {/* a second, thinner pass with a pixel offset reads as a dry brush edge */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 0.38}
        strokeLinecap="round"
        transform="translate(1.2 0.8)"
        opacity={0.35}
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - progress}
      />
      {progress > 0.02 && (
        <circle
          cx={sx}
          cy={sy}
          r={4.4 * Math.min(1, progress * 4)}
          fill={color}
          opacity={0.85}
        />
      )}
    </g>
  );
};
