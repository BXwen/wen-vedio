import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { HITS, morphAtFrame, sideAtFrame } from "./lib/beatmap";
import { enter, leave, pulse } from "./lib/motion";
import { PALETTE } from "./lib/theme";
import { DoublingLadder } from "./components/DoublingLadder";
import { Hook } from "./components/Hook";
import { Hud } from "./components/Hud";
import { InkCircle } from "./components/InkCircle";
import { Loupe } from "./components/Loupe";
import { NumberHero } from "./components/NumberHero";
import { PaperBackground } from "./components/PaperBackground";
import { PolygonMorph } from "./components/PolygonMorph";
import { ResultAnnotations } from "./components/ResultAnnotations";
import { Ruler } from "./components/Ruler";
import { SagittaLoupe } from "./components/SagittaLoupe";
import { SideHero } from "./components/SideHero";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Demo: React.FC = () => {
  const frame = useCurrentFrame();

  const cx = interpolate(frame, [HITS.title, HITS.hexagon], [960, 620], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const cy = 540;
  const r = 290;

  const sideCount = sideAtFrame(frame);
  const morph = morphAtFrame(frame);
  const circleProgress = enter(frame, HITS.collapse, 22);
  const circleDim =
    frame < HITS.hexagon
      ? interpolate(frame, [HITS.title, HITS.hexagon - 1], [1, 0.32], CLAMP)
      : 1;
  const rulerOpacity =
    enter(frame, HITS.ruler, 8) * leave(frame, HITS.hexagon, 6);
  const rulerAngle = interpolate(
    frame,
    [HITS.ruler, HITS.lineOnly],
    [-7, 0],
    { ...CLAMP, easing: Easing.out(Easing.cubic) },
  );
  const hexDraw = enter(frame, HITS.hexagon, 6);

  const tone = interpolate(
    frame,
    [0, HITS.collapse, HITS.hexagon, HITS.result, 300],
    [0.34, 0.42, 0.5, 0.58, 0.62],
    CLAMP,
  );

  const flash = Math.max(
    pulse(frame, HITS.open, 5),
    pulse(frame, HITS.collapse, 6) * 0.9,
    pulse(frame, HITS.ruler, 5) * 0.35,
    pulse(frame, HITS.hexagon, 6) * 0.65,
    pulse(frame, HITS.d192, 6) * 0.55,
    pulse(frame, HITS.result, 6) * 0.7,
    pulse(frame, HITS.seal, 6) * 0.8,
  );

  const loupeOpacity =
    enter(frame, HITS.outer, 8) * leave(frame, HITS.bounds, 8);
  const sagittaOpacity =
    enter(frame, HITS.d24, 8) * leave(frame, HITS.result, 8);
  const outerOpacity =
    enter(frame, HITS.outer, 8) * leave(frame, HITS.bounds, 8);

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
      <Audio src={staticFile("audio/bgm.mp3")} volume={0.9} />
      <PaperBackground tone={tone} />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,250,240,0) 50%, rgba(60,48,32,0.13) 100%)",
        }}
      />

      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <InkCircle
          cx={cx}
          cy={cy}
          r={r}
          progress={circleProgress}
          opacity={circleDim}
        />

        {frame >= HITS.collapse && frame < HITS.ruler && (
          <circle
            cx={cx}
            cy={cy}
            r={5.5}
            fill={PALETTE.seal}
            opacity={
              enter(frame, HITS.collapse, 4) * leave(frame, HITS.ruler, 4)
            }
          />
        )}

        {sideCount !== null && (
          <PolygonMorph
            n={sideCount}
            cx={cx}
            cy={cy}
            r={r}
            t={sideCount === 6 ? 1 : morph}
            draw={sideCount === 6 ? hexDraw : 1}
          />
        )}

        <Ruler
          cx={cx}
          cy={cy - r + 1}
          width={860}
          progress={enter(frame, HITS.ruler, 10)}
          angle={rulerAngle}
          opacity={rulerOpacity}
        />

        {frame >= HITS.outer && (
          <g opacity={outerOpacity}>
            <circle
              cx={cx}
              cy={cy}
              r={r + 7}
              fill="none"
              stroke={PALETTE.azurite}
              strokeWidth={2.6}
              opacity={0.5}
            />
            <circle
              cx={cx}
              cy={cy}
              r={r - 7}
              fill="none"
              stroke={PALETTE.ochre}
              strokeWidth={2.6}
              opacity={0.35}
            />
          </g>
        )}

        {sideCount !== null && frame >= HITS.d24 && (
          <SagittaLoupe
            cx={1570}
            cy={700}
            r={150}
            n={sideCount}
            opacity={sagittaOpacity}
          />
        )}

        <Loupe
          frame={frame}
          cx={1580}
          cy={720}
          r={150}
          opacity={loupeOpacity}
        />
      </svg>

      <Hook frame={frame} />
      <SideHero frame={frame} sideCount={sideCount} />
      <NumberHero frame={frame} />
      <ResultAnnotations frame={frame} />

      <Hud frame={frame} sideCount={sideCount} />
      <DoublingLadder frame={frame} sideCount={sideCount} />

      <AbsoluteFill
        style={{
          backgroundColor: "#FFF8E8",
          opacity: flash * 0.16,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
