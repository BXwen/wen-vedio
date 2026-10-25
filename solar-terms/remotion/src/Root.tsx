import React from "react";
import { Composition, delayRender, continueRender } from "remotion";
import { Main } from "./Main";
import { fontsReady } from "./lib/fonts";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./lib/timeline";

// Block the first paint until both faces are registered, otherwise text
// renders in a fallback serif on the first frame of a render.
const handle = delayRender("Loading Chinese fonts");
fontsReady.then(() => continueRender(handle)).catch((err) => {
  console.error("Font load failed", err);
  continueRender(handle);
});

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SolarTerms"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
