import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { HITS60, morphAtFrame60, sideAtFrame60 } from "./timeline60";
import { enter, leave, pulse } from "../lib/motion";
import { PALETTE } from "../lib/theme";
import { PaperBackground } from "../components/PaperBackground";
import { InkCircle } from "../components/InkCircle";
import { PolygonMorph } from "../components/PolygonMorph";
import { Ruler } from "../components/Ruler";
import { SagittaLoupe } from "../components/SagittaLoupe";
import { Loupe } from "../components/Loupe";
import { Hook } from "../components/Hook";
import { Hud } from "../components/Hud";
import { DoublingLadder } from "../components/DoublingLadder";
import { SideHero60 } from "./SideHero60";
import { Breakdown60 } from "./Breakdown60";
import { RunHero60 } from "./RunHero60";
import { Error60 } from "./Error60";
import { Bound60 } from "./Bound60";
import { Fraction60 } from "./Fraction60";
import { History60 } from "./History60";
import { Quote60 } from "./Quote60";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Film60: React.FC = () => {
  const frame = useCurrentFrame();

  const cx = interpolate(frame, [HITS60.title, HITS60.hexagon], [960, 620], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const cy = 540;
  const r = 290;

  const sideCount = sideAtFrame60(frame);
  const morph = morphAtFrame60(frame);
  const circleProgress = enter(frame, HITS60.collapse, 22);
  const circleDim =
    frame < HITS60.hexagon
      ? interpolate(
          frame,
          [HITS60.title, HITS60.hexagon - 1],
          [1, 0.32],
          CLAMP,
        )
      : 1;
  const rulerOpacity =
    enter(frame, HITS60.ruler, 8) * leave(frame, HITS60.hexagon, 6);
  const rulerAngle = interpolate(
    frame,
    [HITS60.ruler, HITS60.lineOnly],
    [-7, 0],
    { ...CLAMP, easing: Easing.out(Easing.cubic) },
  );
  const hexDraw = enter(frame, HITS60.hexagon, 6);

  const tone = interpolate(
    frame,
    [0, 33, 97, 360, 495, 950, 1500, 1800],
    [0.34, 0.42, 0.5, 0.56, 0.52, 0.6, 0.62, 0.62],
    CLAMP,
  );

  const flash = Math.max(
    pulse(frame, HITS60.open, 5),
    pulse(frame, HITS60.collapse, 6) * 0.9,
    pulse(frame, HITS60.ruler, 5) * 0.35,
    pulse(frame, HITS60.hexagon, 6) * 0.65,
    pulse(frame, HITS60.three14, 6) * 0.6,
    pulse(frame, HITS60.result, 6) * 1.0,
    pulse(frame, HITS60.bound, 6) * 0.4,
    pulse(frame, HITS60.fraction, 6) * 0.7,
    pulse(frame, HITS60.seal, 6) * 0.8,
  );

  const sagittaOpacity =
    enter(frame, HITS60.d48, 8) * leave(frame, HITS60.errorStart, 8);
  const loupeOpacity =
    enter(frame, HITS60.errorStart, 8) * leave(frame, HITS60.result, 8);
  const outerOpacity =
    enter(frame, HITS60.errorStart, 8) * leave(frame, HITS60.result, 8);

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

        {frame >= HITS60.collapse && frame < HITS60.ruler && (
          <circle
            cx={cx}
            cy={cy}
            r={5.5}
            fill={PALETTE.seal}
            opacity={
              enter(frame, HITS60.collapse, 4) *
              leave(frame, HITS60.ruler, 4)
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
          progress={enter(frame, HITS60.ruler, 10)}
          angle={rulerAngle}
          opacity={rulerOpacity}
        />

        {frame >= HITS60.bound && (
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

        {sideCount !== null && frame >= HITS60.d48 && (
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
          startFrame={HITS60.errorStart}
          endFrame={HITS60.errorEnd - 2}
        />
      </svg>

      <Hook frame={frame} />
      <SideHero60 frame={frame} sideCount={sideCount} />
      <Breakdown60 frame={frame} />
      <RunHero60 frame={frame} />
      <Error60 frame={frame} />
      <Bound60 frame={frame} />
      <Fraction60 frame={frame} />
      <History60 frame={frame} />
      <Quote60 frame={frame} />

      <Hud
        frame={frame}
        sideCount={frame < HITS60.quote1 ? sideCount : null}
      />
      <DoublingLadder
        frame={frame}
        sideCount={sideCount}
        fadeOutAt={HITS60.errorStart}
      />

      <AbsoluteFill
        style={{
          backgroundColor: "#FFF8E8",
          opacity: flash * 0.18,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};
