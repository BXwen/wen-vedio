import { Easing, interpolate } from "remotion";
import { clamp01 } from "./geometry";

export const enter = (frame: number, at: number, duration = 8): number =>
  interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const leave = (frame: number, at: number, duration = 8): number =>
  interpolate(frame, [at, at + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

/** Exponential decay after a hit; use for flashes and small punch-ins. */
export const pulse = (frame: number, at: number, decay = 7): number => {
  if (frame < at) return 0;
  return Math.exp(-(frame - at) / decay);
};

/** 1 above the resting value, settling to 0. */
export const slam = (frame: number, at: number, duration = 9): number => {
  const t = clamp01((frame - at) / duration);
  return 1 - Easing.out(Easing.cubic)(t);
};
