import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { Demo } from "./Demo";
import { CoverLandscape, CoverPortrait } from "./covers/Covers";
import { Film60 } from "./film60/Film60";
import { DURATION_IN_FRAMES as DURATION60 } from "./film60/timeline60";
import { Film110 } from "./film110/Film110";
import { DURATION_IN_FRAMES as DURATION110 } from "./film110/timeline110";
import {
  DURATION_IN_FRAMES,
  FPS,
  HEIGHT,
  WIDTH,
} from "./lib/beatmap";
import { fontsReady } from "./lib/fonts";

const handle = delayRender("Loading Chinese fonts");
fontsReady
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error("Font load failed", err);
    continueRender(handle);
  });

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CutCircleDemo"
      component={Demo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="CutCircle60"
      component={Film60}
      durationInFrames={DURATION60}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="CutCircleLong"
      component={Film110}
      durationInFrames={DURATION110}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="CutCircleCoverLandscape"
      component={CoverLandscape}
      durationInFrames={1}
      fps={FPS}
      width={1920}
      height={1440}
    />
    <Composition
      id="CutCircleCoverPortrait"
      component={CoverPortrait}
      durationInFrames={1}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
