# 割圆术 · 用直线量圆

16:9 / 1920×1080 / 30fps。当前有两个版本：

| Composition | 长度 | 用途 |
|---|---|---|
| `CutCircleDemo` | 10 秒 | 抖音冷开场钩子 |
| `CutCircle60` | 60 秒 | 完整短片，使用 BGM 前 60 秒 |

- 分镜与卡点：`docs/storyboard-cut-circle.md`
- BGM：`remotion/public/audio/bgm.mp3`，113 BPM
- 节拍分析：`docs/bgm-analysis/`（波形、前 3 秒、频谱、`beats.json`）
- 重音卡点：0.05 / 1.12 / 3.24 / 5.36 / 7.49 / 9.61 秒；之后每 4 拍一个重音
- 10 秒版卡点表：`remotion/src/lib/beatmap.ts`
- 60 秒版卡点表：`remotion/src/film60/timeline60.ts`

## 运行

```bash
cd remotion
npm install
npm run dev          # Remotion Studio
npm run render       # CutCircle60 -> out/cut-circle-60.mp4
npm run render:demo  # CutCircleDemo -> out/cut-circle-demo.mp4
```

## 结构

| 目录 | 内容 |
|---|---|
| `remotion/src/film60/` | 60 秒版时间线、钩子之后的六段场景 |
| `remotion/src/components/` | 墨圆、多边形翻倍、直尺、两个放大镜、HUD、翻倍梯、印章 |
| `remotion/src/lib/beatmap.ts` | 10 秒版帧级卡点 |
| `tools/analyze_bgm.py` | 重新测 BPM、强拍和能量包络 |
| `docs/bgm-analysis/` | 分析图与 `beats.json` |

按当前要求保持 16:9，不做竖屏。
