import React from "react";
import { AbsoluteFill } from "remotion";
import { InkCircle } from "../components/InkCircle";
import { PaperBackground } from "../components/PaperBackground";
import { PolygonMorph } from "../components/PolygonMorph";
import { Seal } from "../components/Seal";
import { FONTS, PALETTE } from "../lib/theme";

const CornerTicks: React.FC<{ inset?: number; len?: number }> = ({
  inset = 48,
  len = 26,
}) => {
  const corners: React.CSSProperties[] = [
    { left: inset, top: inset, borderLeftWidth: 1, borderTopWidth: 1 },
    { right: inset, top: inset, borderRightWidth: 1, borderTopWidth: 1 },
    { left: inset, bottom: inset, borderLeftWidth: 1, borderBottomWidth: 1 },
    { right: inset, bottom: inset, borderRightWidth: 1, borderBottomWidth: 1 },
  ];

  return (
    <>
      {corners.map((corner, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: len,
            height: len,
            borderStyle: "solid",
            borderColor: PALETTE.inkFaint,
            borderWidth: 0,
            opacity: 0.55,
            ...corner,
          }}
        />
      ))}
    </>
  );
};

const kicker: React.CSSProperties = {
  position: "absolute",
  fontFamily: FONTS.serif,
  color: PALETTE.inkFaint,
  letterSpacing: 6,
};

const caption: React.CSSProperties = {
  position: "absolute",
  fontFamily: FONTS.serif,
  fontSize: 26,
  letterSpacing: 7,
  color: PALETTE.inkSoft,
};

const Landscape: React.FC = () => {
  const cx = 1450;
  const cy = 700;
  const r = 330;

  return (
    <AbsoluteFill>
      <PaperBackground tone={0.62} />
      <CornerTicks />

      <div style={{ ...kicker, left: 132, top: 130, fontSize: 26 }}>
        刘徽 · 263 年
      </div>

      <div
        style={{
          ...kicker,
          left: 132,
          top: 360,
          fontSize: 44,
          color: PALETTE.inkSoft,
          letterSpacing: 16,
        }}
      >
        用直线量圆
      </div>

      <div
        style={{
          position: "absolute",
          left: 122,
          top: 435,
          fontFamily: FONTS.serif,
          fontSize: 224,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: 18,
          color: PALETTE.ink,
          whiteSpace: "nowrap",
        }}
      >
        割圆术
      </div>

      <div
        style={{
          position: "absolute",
          left: 138,
          top: 730,
          width: 480,
          height: 2,
          backgroundColor: PALETTE.ochreDeep,
          opacity: 0.75,
        }}
      />

      <div
        style={{
          ...kicker,
          left: 136,
          top: 762,
          fontSize: 24,
          letterSpacing: 10,
        }}
      >
        圆周率
      </div>

      <div
        style={{
          position: "absolute",
          left: 130,
          top: 796,
          fontFamily: FONTS.serif,
          fontSize: 116,
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: 3,
          fontVariantNumeric: "tabular-nums",
          color: PALETTE.seal,
          whiteSpace: "nowrap",
        }}
      >
        3.1415926
      </div>

      <Seal
        text="祖率"
        size={92}
        at={-100}
        duration={1}
        style={{
          position: "absolute",
          left: 762,
          top: 792,
          transform: "rotate(-2deg)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 134,
          top: 1010,
          fontFamily: FONTS.serif,
          fontSize: 42,
          letterSpacing: 10,
          color: PALETTE.inkSoft,
        }}
      >
        一个圆，算不尽
      </div>

      <div
        style={{
          position: "absolute",
          left: 136,
          top: 1290,
          fontFamily: FONTS.serif,
          fontSize: 24,
          letterSpacing: 5,
          color: PALETTE.inkFaint,
        }}
      >
        《九章算术注》 · 割圆至 3072 边
      </div>

      <svg
        width={1920}
        height={1440}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <InkCircle cx={cx} cy={cy} r={r} strokeWidth={3.2} />
        <PolygonMorph n={12} cx={cx} cy={cy} r={r} />
      </svg>

      <div
        style={{
          ...caption,
          left: cx - 200,
          top: cy + r + 48,
          width: 400,
          fontSize: 28,
          textAlign: "center",
        }}
      >
        12 边 · 每次翻倍
      </div>
    </AbsoluteFill>
  );
};

const Portrait: React.FC = () => {
  const cx = 540;
  const cy = 990;
  const r = 288;

  return (
    <AbsoluteFill>
      <PaperBackground tone={0.66} />
      <CornerTicks inset={40} len={24} />

      <div
        style={{
          ...kicker,
          left: 0,
          top: 266,
          width: 1080,
          fontSize: 26,
          textAlign: "center",
        }}
      >
        刘徽 · 263 年
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 330,
          width: 1080,
          textAlign: "center",
          fontFamily: FONTS.serif,
          fontSize: 210,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: 16,
          color: PALETTE.ink,
        }}
      >
        割圆术
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 578,
          width: 1080,
          textAlign: "center",
          fontFamily: FONTS.serif,
          fontSize: 42,
          letterSpacing: 18,
          color: PALETTE.inkSoft,
        }}
      >
        用直线量圆
      </div>

      <div
        style={{
          position: "absolute",
          left: 350,
          top: 664,
          width: 380,
          height: 2,
          backgroundColor: PALETTE.ochreDeep,
          opacity: 0.75,
        }}
      />

      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <InkCircle cx={cx} cy={cy} r={r} strokeWidth={3.2} />
        <PolygonMorph n={12} cx={cx} cy={cy} r={r} />
      </svg>

      <div
        style={{
          ...caption,
          left: cx - 190,
          top: cy + r + 42,
          width: 380,
          textAlign: "center",
        }}
      >
        12 边 · 每次翻倍
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1408,
          width: 1080,
          textAlign: "center",
          fontFamily: FONTS.serif,
          fontSize: 112,
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: 2,
          fontVariantNumeric: "tabular-nums",
          color: PALETTE.seal,
        }}
      >
        3.1415926
      </div>

      <div
        style={{
          ...kicker,
          left: 0,
          top: 1540,
          width: 1080,
          fontSize: 22,
          letterSpacing: 10,
          textAlign: "center",
        }}
      >
        圆周率
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1596,
          width: 1080,
          textAlign: "center",
          fontFamily: FONTS.serif,
          fontSize: 40,
          letterSpacing: 8,
          color: PALETTE.ink,
        }}
      >
        一个圆，算不尽
      </div>

      <Seal
        text="祖率"
        size={82}
        at={-100}
        duration={1}
        style={{
          position: "absolute",
          left: 812,
          top: 1572,
          transform: "rotate(-2deg)",
        }}
      />
    </AbsoluteFill>
  );
};

export const CoverLandscape: React.FC = () => <Landscape />;
export const CoverPortrait: React.FC = () => <Portrait />;
