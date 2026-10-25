export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION_IN_FRAMES = 300;

/**
 * Measured from bgm.mp3 with tools/analyze_bgm.py.
 * 113 BPM, eighth-note pulse ~0.2655s, phrase accent every four beats.
 * Frame numbers below are the measured onsets rounded to 30fps.
 */
export const BPM = 113;
export const EIGHTH_SECONDS = 0.2655;

export const HITS = {
  open: 2,
  digit: 3,
  number: 25,
  collapse: 33,
  ruler: 57,
  lineOnly: 65,
  paper: 73,
  title: 81,
  hexagon: 97,
  d12: 113,
  d24: 129,
  d48: 145,
  d96: 153,
  d192: 161,
  d384: 177,
  d768: 185,
  d1536: 193,
  d3072: 201,
  settle: 209,
  result: 225,
  outer: 233,
  band: 241,
  error: 257,
  bounds: 265,
  pi: 272,
  zu: 280,
  seal: 288,
  end: 300,
} as const;

export const SIDES = [
  { at: HITS.hexagon, n: 6 },
  { at: HITS.d12, n: 12 },
  { at: HITS.d24, n: 24 },
  { at: HITS.d48, n: 48 },
  { at: HITS.d96, n: 96 },
  { at: HITS.d192, n: 192 },
  { at: HITS.d384, n: 384 },
  { at: HITS.d768, n: 768 },
  { at: HITS.d1536, n: 1536 },
  { at: HITS.d3072, n: 3072 },
] as const;

export const sideAtFrame = (frame: number): number | null => {
  for (let i = SIDES.length - 1; i >= 0; i -= 1) {
    if (frame >= SIDES[i].at) return SIDES[i].n;
  }
  return null;
};

/** 0 -> 1 during the 8 frames after a doubling. */
export const morphAtFrame = (frame: number): number => {
  for (let i = SIDES.length - 1; i >= 0; i -= 1) {
    if (frame >= SIDES[i].at) {
      return Math.max(0, Math.min(1, (frame - SIDES[i].at) / 8));
    }
  }
  return 0;
};
