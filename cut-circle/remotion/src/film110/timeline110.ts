export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION_IN_FRAMES = 2760;

/**
 * 92-second long cut. 0–45.75s is the approved math. The back half follows
 * the reference's strongest moves instead of a long history:
 *  45.75–50  113355 → 113 | 355 → 355/113
 *  50–60     phone-pixel payoff, then a low-poly 3D paper sphere
 *  60–68.5   the full five-column quote
 *  69–92     self-reference, π digits, "no last side", final seal
 */
export const HITS110 = {
  fraction: 1372,
  split: 1382,
  splitOpen: 1392,
  fractionResult: 1408,
  fractionDetail: 1422,
  fractionProof: 1438,
  fractionEnd: 1500,
  ringStart: 1500,
  pixel: 1500,
  // 52.1s — the zoom fills the phone before the 0.29px payoff.
  pixelZoom: 1563,
  pixelProof: 1582,
  // 54.25s — a strong onset in the BGM, so the faceted sphere lands on it.
  games: 1628,
  gamesLine2: 1658,
  quote1: 1800,
  quote2: 1816,
  quote3: 1832,
  quote4: 1848,
  quote5: 1864,
  quoteSource: 1910,
  quoteSeal: 1970,
  quoteEnd: 2056,
  meta: 2070,
  selfRef: 2100,
  straight: 2130,
  coda1: 2205,
  coda2: 2265,
  coda3: 2325,
  coda4: 2393,
  // One new digit row per beat while the camera holds on the endless stream.
  codaRowStep: 32,
  codaEndless: 2455,
  codaNoSide: 2518,
  codaEvery: 2584,
  seal: 2670,
  end: 2760,
} as const;
