import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Local font loading. Both faces ship in public/ so rendering never touches
 * the network. The returned promise is awaited in Root.tsx via `delayRender`.
 */
export const fontsReady = Promise.all([
  loadFont({
    family: "NotoSerifSC",
    url: staticFile("NotoSerifSC-VF.ttf"),
    format: "truetype",
    weight: "200 900",
  }),
  loadFont({
    family: "SimKai",
    url: staticFile("SimKai.ttf"),
    format: "truetype",
    weight: "400",
  }),
]);
