import { describe, expect, it } from "vitest";
import {
  CARD_FRAMES,
  CARD_OVERLAP,
  FPS,
  SCENES,
  TOTAL_FRAMES,
  cardWindow,
  cardVisibility,
  ringCursorAtFrame,
  termAtFrame,
} from "./timeline";

describe("timeline", () => {
  it("totalFrames_matchesScenes", () => {
    expect(TOTAL_FRAMES).toBe(4800);
    expect(SCENES.outro.to).toBe(TOTAL_FRAMES);
  });

  it("cardWindows_areContiguousAndExact", () => {
    for (let i = 0; i < 24; i++) {
      const w = cardWindow(i);
      expect(w.to - w.from).toBe(CARD_FRAMES);
      if (i > 0) {
        expect(w.from).toBe(cardWindow(i - 1).to);
      }
    }
    expect(cardWindow(0).from).toBe(SCENES.terms.from);
    expect(cardWindow(23).to).toBe(SCENES.outro.from);
  });

  it("termAtFrame_mapsSceneStartToFirstTerm", () => {
    expect(termAtFrame(SCENES.terms.from).index).toBe(0);
    expect(termAtFrame(SCENES.terms.from).local).toBe(0);
    expect(termAtFrame(SCENES.terms.from + CARD_FRAMES).index).toBe(1);
    expect(termAtFrame(cardWindow(23).to - 1).index).toBe(23);
  });

  it("termAtFrame_progressIsMonotonicWithinCard", () => {
    const start = SCENES.terms.from;
    const a = termAtFrame(start + 10).progress;
    const b = termAtFrame(start + 100).progress;
    expect(b).toBeGreaterThan(a);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThanOrEqual(1);
  });

  it("ringCursor_advancesOneSegmentPerCard", () => {
    const start = SCENES.terms.from;
    expect(ringCursorAtFrame(start)).toBe(0);
    expect(ringCursorAtFrame(start + CARD_FRAMES)).toBe(1);
    expect(ringCursorAtFrame(start + CARD_FRAMES / 2)).toBe(0.5);
  });

  it("fps_is30", () => {
    expect(FPS).toBe(30);
  });

  it("cardVisibility_coversEverySeam", () => {
    // Regression: cards used to abut with no overlap, and every card starts
    // empty (progress 0 reveals nothing), so each of the 23 seams rendered one
    // frame of bare paper. At every seam, the outgoing card must still be
    // drawn and the incoming card must be fading up over it.
    for (let i = 1; i < 24; i++) {
      const seam = cardWindow(i).from;
      expect(cardVisibility(i - 1, seam), `seam ${i}: outgoing blank`).toBeGreaterThan(0.9);
      expect(cardVisibility(i, seam), `seam ${i}: incoming blank`).toBeGreaterThan(0);
    }
  });

  it("cardVisibility_fadesAcrossTheSeam", () => {
    const seam = cardWindow(5).from;
    // the outgoing card is still solid on the seam itself
    expect(cardVisibility(4, seam - 1)).toBeGreaterThan(0.9);
    // and the incoming card is fully up CARD_OVERLAP frames later
    expect(cardVisibility(5, seam + CARD_OVERLAP)).toBe(1);
  });
});
