import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { Demo } from "./Demo";
import { Film60 } from "./film60/Film60";
import { DURATION_IN_FRAMES as DURATION60 } from "./film60/timeline60";
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
  </>
);
