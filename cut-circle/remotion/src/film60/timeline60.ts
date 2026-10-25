export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION_IN_FRAMES = 1800;

/**
 * 60-second cut of the first minute of bgm.mp3.
 *
 * Measured section changes:
 *   0.0–12.0   first groove
 *  12.0–16.5   breakdown, nearly silent at 15.5
 *  16.5–31.5   build
 *  31.7         drop / strongest onsets of the minute
 *  34.0–50.0   groove
 *  50.0–60.0   outro
 *
 * Every scene change below lands on a measured onset from
 * docs/bgm-analysis/beats.json.
 */
export const HITS60 = {
  open: 2,
  collapse: 33,
  ruler: 57,
  lineOnly: 65,
  paper: 73,
  title: 81,
  hexagon: 97,
  d12: 129,
  d24: 161,
  d48: 193,
  d96: 225,
  breakdown: 360,
  breakdownText: 390,
  breakdownFormula: 420,
  silence: 465,
  build: 495,
  three14: 607,
  d384: 671,
  d768: 735,
  d1536: 798,
  d3072: 862,
  hold: 926,
  result: 950,
  bound: 1035,
  error: 1118,
  bounds: 1245,
  boundMid: 1277,
  boundUpper: 1309,
  fraction: 1372,
  history: 1436,
  quote1: 1500,
  quote2: 1532,
  quote3: 1627,
  quote4: 1660,
  seal: 1692,
  holdEnd: 1755,
  end: 1800,
} as const;

export const SIDES60 = [
  { at: HITS60.hexagon, n: 6 },
  { at: HITS60.d12, n: 12 },
  { at: HITS60.d24, n: 24 },
  { at: HITS60.d48, n: 48 },
  { at: HITS60.d96, n: 96 },
  { at: HITS60.build, n: 192 },
  { at: HITS60.d384, n: 384 },
  { at: HITS60.d768, n: 768 },
  { at: HITS60.d1536, n: 1536 },
  { at: HITS60.d3072, n: 3072 },
] as const;

export const sideAtFrame60 = (frame: number): number | null => {
  for (let i = SIDES60.length - 1; i >= 0; i -= 1) {
    if (frame >= SIDES60[i].at) return SIDES60[i].n;
  }
  return null;
};

/** 0 -> 1 during the 8 frames after a doubling. */
export const morphAtFrame60 = (frame: number): number => {
  for (let i = SIDES60.length - 1; i >= 0; i -= 1) {
    if (frame >= SIDES60[i].at) {
      return Math.max(0, Math.min(1, (frame - SIDES60[i].at) / 8));
    }
  }
  return 0;
};

/** Frame of the current doubling, for the little pop on the side count. */
export const stepAtFrame60 = (frame: number): number => {
  for (let i = SIDES60.length - 1; i >= 0; i -= 1) {
    if (frame >= SIDES60[i].at) return SIDES60[i].at;
  }
  return HITS60.hexagon;
};
