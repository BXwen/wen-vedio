import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Intro } from "./scenes/Intro";
import { Numbers } from "./scenes/Numbers";
import { Seasons } from "./scenes/Seasons";
import { Outro } from "./scenes/Outro";
import { TermCard } from "./components/TermCard";
import { CARD_FRAMES, CARD_OVERLAP, SCENES } from "./lib/timeline";

/**
 * Scene assembly. Each scene is a plain Sequence with an explicit window taken
 * from lib/timeline — the single source of truth for where anything happens.
 *
 * The score was generated against the same windows (scripts/gen-music.py writes
 * cardOnsets from these numbers), so a card boundary and a plucked note are the
 * same instant rather than two timelines kept in sync by hand.
 */
export const Main: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("audio/score.wav")} />

      <Sequence name="Intro" from={SCENES.intro.from} durationInFrames={SCENES.intro.to - SCENES.intro.from}>
        <Intro />
      </Sequence>

      <Sequence name="Numbers" from={SCENES.numbers.from} durationInFrames={SCENES.numbers.to - SCENES.numbers.from}>
        <Numbers />
      </Sequence>

      <Sequence name="Seasons" from={SCENES.seasons.from} durationInFrames={SCENES.seasons.to - SCENES.seasons.from}>
        <Seasons />
      </Sequence>

      {/* Each card stays mounted CARD_OVERLAP frames past its window so it is
          still on screen while the next card dissolves in on top of it. A
          Sequence `from` cannot be negative, so the overlap is carried by the
          outgoing card's tail rather than the incoming card's head. */}
      {Array.from({ length: 24 }, (_, i) => (
        <Sequence
          key={i}
          name={`Term-${i}`}
          from={SCENES.terms.from + i * CARD_FRAMES}
          durationInFrames={CARD_FRAMES + CARD_OVERLAP}
        >
          <TermCard index={i} />
        </Sequence>
      ))}

      <Sequence name="Outro" from={SCENES.outro.from} durationInFrames={SCENES.outro.to - SCENES.outro.from}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
