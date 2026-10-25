/**
 * Design tokens for the solar-terms video.
 * Season accents are muted mineral pigments — not pure hue — so they sit on paper
 * without glowing the way saturated screen colours would.
 */

export const PALETTE = {
  paper: "#F2EDE4",
  paperDeep: "#E8E0D2",
  ink: "#1C1A17",
  inkSoft: "#4A453D",
  inkFaint: "#8C8478",
  seal: "#B3271E",
  sealDeep: "#8E1C15",
  gold: "#B08A4A",
} as const;

export type SeasonKey = "spring" | "summer" | "autumn" | "winter";

export const SEASONS: Record<
  SeasonKey,
  { label: string; glyph: string; accent: string; accentSoft: string }
> = {
  spring: { label: "春", glyph: "春", accent: "#7BA05B", accentSoft: "#B7C79A" },
  summer: { label: "夏", glyph: "夏", accent: "#C4453A", accentSoft: "#E0A093" },
  autumn: { label: "秋", glyph: "秋", accent: "#C98A3E", accentSoft: "#E4C08A" },
  winter: { label: "冬", glyph: "冬", accent: "#3E5A72", accentSoft: "#9DAFBE" },
};

export const FONTS = {
  serif: "NotoSerifSC",
  kai: "SimKai",
} as const;

/** Safe-area and HUD metrics at 1920x1080. */
export const HUD = {
  marginX: 96,
  marginY: 84,
  ruleTop: 128,
  ruleBottom: 900,
  ringSize: 560,
} as const;
