import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  HITS60,
  morphAtFrame60,
  sideAtFrame60,
  stepAtFrame60,
} from "../film60/timeline60";
import { HITS110 } from "./timeline110";
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
import { SideHero60 } from "../film60/SideHero60";
import { Breakdown60 } from "../film60/Breakdown60";
import { RunHero60 } from "../film60/RunHero60";
import { Error60 } from "../film60/Error60";
import { Bound60 } from "../film60/Bound60";
import { InkRing3D } from "../components/InkRing3D";
import { PaperSphere3D } from "../components/PaperSphere3D";
import { FacetedSphere3D } from "../components/FacetedSphere3D";
import { FractionSplit } from "./FractionSplit";
import { PixelPayoff } from "./PixelPayoff";
import { Quote110 } from "./Quote110";
import { Coda110 } from "./Coda110";
import { Finale110 } from "./Finale110";

const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const Film110: React.FC = () => {
  const frame = useCurrentFrame();

  const cx = interpolate(frame, [HITS60.title, HITS60.hexagon], [960, 620], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const cy = 540;
  const r = 290;
  const twoD =
    frame < HITS110.ringStart ? 1 : leave(frame, HITS110.ringStart, 12);
  const ringTime = (frame - HITS110.ringStart) / 30;
  const ringHit = Math.max(
    pulse(frame, HITS110.ringStart, 8),
    pulse(frame, HITS110.pixelZoom, 8),
    pulse(frame, HITS110.games, 8),
    pulse(frame, HITS110.quote1, 12),
    pulse(frame, HITS110.quoteSeal, 10),
    pulse(frame, HITS110.selfRef, 10),
    pulse(frame, HITS110.coda2, 10),
    pulse(frame, HITS110.coda4, 10),
    pulse(frame, HITS110.codaEvery, 12),
    pulse(frame, HITS110.seal, 14),
  );
  // A slow, bounded turn: the ring stays readable instead of spinning
  // through edge-on every few seconds. In the coda it settles to one angle so
  // the π stream can sit inside its opening without drifting.
  const codaSettle = enter(frame, HITS110.coda1 - 10, 16);
  const ambientRx = -24 + 6 * Math.sin(ringTime * 0.5 + 0.6);
  const ambientRy =
    20 +
    20 * Math.sin(ringTime * 0.28) +
    6 * Math.sin(ringTime * 0.61 + 1.3);
  const ambientRz = 6 * Math.sin(ringTime * 0.4);
  const ringRx =
    interpolate(codaSettle, [0, 1], [ambientRx, -18], CLAMP) +
    (1 - codaSettle) * 14 * ringHit;
  const ringRy =
    interpolate(codaSettle, [0, 1], [ambientRy, 26], CLAMP) +
    (1 - codaSettle) * 12 * ringHit;
  const ringRz = interpolate(codaSettle, [0, 1], [ambientRz, 0], CLAMP);
  const ringScale = 1 + 0.05 * ringHit;

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
    [0, 33, 97, 360, 495, 950, 1500, 1800, 2760],
    [0.34, 0.42, 0.5, 0.56, 0.52, 0.6, 0.62, 0.62, 0.63],
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
    pulse(frame, HITS110.pixelZoom, 6) * 0.4,
    pulse(frame, HITS110.games, 6) * 0.5,
    pulse(frame, HITS110.quote1, 6) * 0.35,
    pulse(frame, HITS110.quoteSeal, 6) * 0.4,
    pulse(frame, HITS110.selfRef, 6) * 0.45,
    pulse(frame, HITS110.coda4, 6) * 0.5,
    pulse(frame, HITS110.codaEvery, 6) * 0.6,
    pulse(frame, HITS110.seal, 6) * 1.0,
  );

  // The local-zoom window rides the doubling ladder: 12→96 before the
  // breakdown, then 192→3072 once the build resumes.
  const sagittaOpacity = Math.min(
    1,
    enter(frame, HITS60.d12, 8) * leave(frame, HITS60.breakdown, 10) +
      enter(frame, HITS60.d192 - 10, 10) *
        leave(frame, HITS60.errorStart, 8),
  );
  const sagittaPop = pulse(frame, stepAtFrame60(frame), 12);
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
        {frame < HITS60.ruler + 20 && (
          <PaperSphere3D
            cx={960}
            cy={520}
            r={260}
            rotateX={-12 + 6 * Math.sin(frame * 0.045)}
            rotateY={frame * 0.8}
            scale={1 + 0.85 * enter(frame, HITS60.collapse, 26)}
            opacity={
              enter(frame, 0, 8) * leave(frame, HITS60.ruler, 12)
            }
            meridians={24}
            parallels={12}
          />
        )}

        <InkCircle
          cx={cx}
          cy={cy}
          r={r}
          progress={circleProgress}
          opacity={circleDim * twoD}
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
            opacity={twoD}
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

        {frame >= HITS110.ringStart && (
          <InkRing3D
            cx={cx}
            cy={cy}
            r={272}
            rotateX={ringRx}
            rotateY={ringRy}
            rotateZ={ringRz}
            scale={ringScale}
            opacity={
              enter(frame, HITS110.ringStart, 14) *
              leave(frame, HITS110.codaEvery - 12, 10)
            }
            seams={160}
            seamProgress={enter(frame, HITS110.straight, 26)}
          />
        )}

        {frame >= HITS110.games && frame < HITS110.quote1 && (
          <FacetedSphere3D
            cx={1480}
            cy={500}
            r={195}
            rotateX={-18 + 4 * Math.sin((frame - HITS110.games) * 0.04)}
            rotateY={22 + (frame - HITS110.games) * 1.1}
            reveal={interpolate(
              frame,
              [HITS110.games, HITS110.games + 40],
              [0, 1],
              CLAMP,
            )}
            opacity={
              enter(frame, HITS110.games, 8) *
              leave(frame, HITS110.quote1 - 8, 6)
            }
          />
        )}

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

        {sideCount !== null && frame >= HITS60.d12 && (
          <SagittaLoupe
            cx={1570}
            cy={700}
            r={150}
            n={sideCount}
            opacity={sagittaOpacity}
            pop={sagittaPop}
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
      <FractionSplit frame={frame} />
      <PixelPayoff frame={frame} />
      <Quote110 frame={frame} />
      <Coda110 frame={frame} />
      <Finale110 frame={frame} />

      <Hud
        frame={frame}
        sideCount={frame < HITS110.fraction ? sideCount : null}
        fade={leave(frame, HITS110.fraction - 2, 8)}
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
