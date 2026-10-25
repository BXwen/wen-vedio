import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import beats from "./beats.json";
import { CARD_FRAMES, FPS, SCENES, TOTAL_FRAMES } from "../lib/timeline";

const AUDIO = join(__dirname, "..", "..", "public", "audio", "score.wav");

describe("audio and beat grid", () => {
  it("scoreExists", () => {
    expect(existsSync(AUDIO)).toBe(true);
    // a 160s 48k stereo 16-bit file is ~30 MB; anything tiny means a failed run
    expect(statSync(AUDIO).size).toBeGreaterThan(20_000_000);
  });

  it("beatGridDurationMatchesComposition", () => {
    expect(beats.durationSec).toBeCloseTo(TOTAL_FRAMES / FPS, 3);
    expect(beats.fps).toBe(FPS);
  });

  it("everyCardOnsetMatchesTheTimeline", () => {
    expect(beats.cardOnsets).toHaveLength(24);
    beats.cardOnsets.forEach((t, i) => {
      const expected = (SCENES.terms.from + i * CARD_FRAMES) / FPS;
      // within a single frame
      expect(Math.abs(t - expected)).toBeLessThanOrEqual(1 / FPS);
    });
  });

  it("seasonOnsetsLandOnCardsZeroSixTwelveEighteen", () => {
    expect(beats.seasonOnsets).toHaveLength(4);
    [0, 6, 12, 18].forEach((card, i) => {
      expect(beats.seasonOnsets[i]).toBeCloseTo(beats.cardOnsets[card], 4);
    });
  });

  it("sceneOnsetsMatchTheSceneTable", () => {
    expect(beats.sceneOnsets.intro).toBeCloseTo(SCENES.intro.from / FPS, 4);
    expect(beats.sceneOnsets.terms).toBeCloseTo(SCENES.terms.from / FPS, 4);
    expect(beats.sceneOnsets.outro).toBeCloseTo(SCENES.outro.from / FPS, 4);
  });
});
