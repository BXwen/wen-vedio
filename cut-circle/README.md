# 割圆术 · 用直线量圆

16:9 / 1920×1080 / 30fps。当前三个版本：

| Composition | 长度 | 用途 |
|---|---|---|
| `CutCircleDemo` | 10 秒 | 抖音冷开场钩子 |
| `CutCircle60` | 60 秒 | 1 分钟短版 |
| `CutCircleLong` | 1:32 | 正式长版，使用 BGM 前 92 秒 |

- 分镜与卡点：`docs/storyboard-cut-circle.md`
- BGM：`remotion/public/audio/bgm.mp3`，113 BPM
- 节拍分析：`docs/bgm-analysis/`（波形、前 3 秒、频谱、`beats.json`）
- 重音卡点：0.05 / 1.12 / 3.24 / 5.36 / 7.49 / 9.61 秒；之后每 4 拍一个重音
- 10 秒版卡点表：`remotion/src/lib/beatmap.ts`
- 60 秒版卡点表：`remotion/src/film60/timeline60.ts`
- 1:32 版卡点表：`remotion/src/film110/timeline110.ts`

## 运行

```bash
cd remotion
npm install
npm run dev          # Remotion Studio
npm run render       # CutCircleLong -> out/cut-circle-long.mp4
npm run render:60    # CutCircle60 -> out/cut-circle-60.mp4
npm run render:demo  # CutCircleDemo -> out/cut-circle-demo.mp4
```

## 封面

| Composition | 输出 | 尺寸 |
|---|---|---|
| `CutCircleCoverLandscape` | `remotion/out/covers/cover-4x3.png` | 1920×1440（4:3） |
| `CutCircleCoverPortrait` | `remotion/out/covers/cover-9x16.png` | 1080×1920（9:16） |

```bash
cd remotion
npx remotion still CutCircleCoverLandscape out/covers/cover-4x3.png --frame=0
npx remotion still CutCircleCoverPortrait out/covers/cover-9x16.png --frame=0
ffmpeg -y -i out/covers/cover-9x16.png -vf "crop=1080:1440:0:240" -frames:v 1 out/covers/cover-3x4.png
```

抖音横版用 4:3，竖版母版用 9:16；竖版所有文字收在中央 3:4 安全区，另导出 `out/covers/cover-3x4.png`（1080×1440），供按 3:4 展示或上传时直接使用。排版源文件：`remotion/src/covers/Covers.tsx`。

## 结构

| 目录 | 内容 |
|---|---|
| `remotion/src/film110/` | 1:32 版时间线、密率拆分、像素证明、引文、无限尾声 |
| `remotion/src/film60/` | 60 秒版时间线与六段场景 |
| `remotion/src/covers/` | 横版 / 竖版封面排版 |
| `remotion/src/components/` | 墨圆、多边形翻倍、直尺、两个放大镜、HUD、翻倍梯、印章 |
| `remotion/src/lib/beatmap.ts` | 10 秒版帧级卡点 |
| `tools/analyze_bgm.py` | 重新测 BPM、强拍和能量包络 |
| `docs/bgm-analysis/` | 分析图与 `beats.json` |

正片保持 16:9；封面另出 9:16 竖版，内容收在 3:4 安全区。
