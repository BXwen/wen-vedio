export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 4800;

/** Card duration in frames. 24 cards * 125 = 3000 frames. */
export const CARD_FRAMES = 125;

/**
 * Frames each card starts before its nominal window, so it can dissolve in
 * over the previous card.
 *
 * Cards abut exactly and every card starts empty (progress 0 reveals nothing).
 * With no overlap, each of the 23 seams shows one frame of bare paper. Instead
 * each card is mounted CARD_OVERLAP frames early: the outgoing card is still
 * fully drawn underneath, and the incoming card fades in on top of it. The
 * incoming card's empty first frames are hidden behind the outgoing image.
 */
export const CARD_OVERLAP = 14;

export const SCENES = {
  intro: { from: 0, to: 240 },
  numbers: { from: 240, to: 600 },
  seasons: { from: 600, to: 900 },
  terms: { from: 900, to: 3900 },
  outro: { from: 3900, to: 4800 },
} as const;

export const cardWindow = (index: number): { from: number; to: number } => {
  const from = SCENES.terms.from + index * CARD_FRAMES;
  return { from, to: from + CARD_FRAMES };
};

/**
 * How visible card `index` is on absolute frame `frame`, 0..1.
 *
 * Cards are mounted for CARD_FRAMES + CARD_OVERLAP and dissolve against their
 * neighbours: the outgoing card holds its final image and fades out over the
 * tail, the incoming card fades in over its first frames. Both fades are
 * needed because a card at progress 0 has revealed nothing yet — fading the
 * outgoing card alone would expose bare paper at every seam.
 *
 * Returns 0 outside the card's mount window.
 */
export const cardVisibility = (index: number, frame: number): number => {
  const start = SCENES.terms.from + index * CARD_FRAMES;
  const raw = frame - start;
  if (raw < 0 || raw > CARD_FRAMES + CARD_OVERLAP) return 0;
  const tail = Math.max(0, raw - CARD_FRAMES);
  const fadeOut = 1 - Math.min(1, tail / CARD_OVERLAP);
  // The first card has no predecessor to dissolve from, so it enters at full
  // opacity — otherwise the terms scene opens on bare paper.
  const fadeIn = index === 0 ? 1 : Math.min(1, (raw + 1) / CARD_OVERLAP);
  return Math.min(fadeOut, fadeIn);
};

export type TermFrame = {
  /** 0..23, clamped to the terms scene. */
  index: number;
  /** Frames elapsed within the current card. */
  local: number;
  /** 0..1 progress within the current card. */
  progress: number;
};

export const termAtFrame = (frame: number): TermFrame => {
  const relative = frame - SCENES.terms.from;
  const index = Math.max(0, Math.min(23, Math.floor(relative / CARD_FRAMES)));
  const local = Math.max(0, Math.min(CARD_FRAMES, relative - index * CARD_FRAMES));
  return { index, local, progress: local / CARD_FRAMES };
};

/** Continuous position along the 24-segment ring, in segment units. */
export const ringCursorAtFrame = (frame: number): number => {
  const t = termAtFrame(frame);
  return t.index + t.progress;
};
