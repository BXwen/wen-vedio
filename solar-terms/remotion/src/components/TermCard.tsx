import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBackground } from "./PaperBackground";
import { Hud } from "./Hud";
import { SpringCard } from "./cards/SpringCard";
import { SummerCard } from "./cards/SummerCard";
import { AutumnCard } from "./cards/AutumnCard";
import { WinterCard } from "./cards/WinterCard";
import { TERMS } from "../data/terms";
import { CARD_FRAMES, SCENES, cardVisibility } from "../lib/timeline";

const SEASON_INDEX = { spring: 0, summer: 1, autumn: 2, winter: 3 } as const;

/**
 * One solar term. Chooses the season's layout and supplies the shared frame
 * (paper + HUD) so the cards differ only in how they arrange their content.
 *
 * NOTE: this component lives inside a <Sequence>, so useCurrentFrame() is
 * LOCAL to the card (0..124). The global frame is reconstructed for the HUD.
 */
export const TermCard: React.FC<{ index: number }> = ({ index }) => {
  // Mounted for CARD_FRAMES + CARD_OVERLAP frames. The last CARD_OVERLAP of
  // those belong to the next card's window, where this card sits underneath it
  // holding its final image — so `local` saturates at the last real frame.
  const raw = useCurrentFrame();
  const local = Math.min(CARD_FRAMES - 1, raw);
  const term = TERMS[index];
  // Every reveal starts at 0.02–0.06 of progress, so at exactly 0 a card draws
  // nothing but paper. Cards 1–23 are covered by the outgoing card while they
  // are still empty. Card 0 has no predecessor, so it starts most of the way
  // through its own reveal — the scene opens on a formed card rather than a
  // blank one — and plays out the remaining reveal.
  const p = local / CARD_FRAMES;
  const progress = index === 0 ? 0.45 + p * 0.55 : Math.max(0.03, p);
  const globalFrame = SCENES.terms.from + index * CARD_FRAMES + local;

  const seasonIdx = SEASON_INDEX[term.season];
  const chapter = {
    index: seasonIdx,
    label: ["春", "夏", "秋", "冬"][seasonIdx],
    season: term.season,
  };

  // how far into the season this card is, 0..1 — drives autumn's desaturation
  const withinSeason = (index % 6) / 5;

  // Two-sided dissolve across the seam; see cardVisibility for why both sides
  // fade. Shared with the test that proves no frame of the scene is blank.
  const fade = cardVisibility(index, globalFrame);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <PaperBackground
        tone={term.season === "winter" ? 0.7 : term.season === "spring" ? 0.35 : 0.5}
      />
      <AbsoluteFill>
        {term.season === "spring" && <SpringCard term={term} progress={progress} />}
        {term.season === "summer" && <SummerCard term={term} progress={progress} />}
        {term.season === "autumn" && (
          <AutumnCard term={term} progress={progress} desat={withinSeason} />
        )}
        {term.season === "winter" && <WinterCard term={term} progress={progress} />}
      </AbsoluteFill>
      <Hud
        termIndex={index}
        progress={progress}
        chapter={chapter}
        frame={globalFrame}
        opacity={Math.min(1, (globalFrame - SCENES.terms.from) / 30)}
      />
    </AbsoluteFill>
  );
};
