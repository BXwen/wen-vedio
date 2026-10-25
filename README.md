# video

两个互不混合的项目：

| 目录 | 项目 | 成片 |
|---|---|---|
| `solar-terms/` | 二十四节气 · 太阳的刻度 | `solar-terms/remotion/out/solar-terms.mp4` |
| `cut-circle/` | 割圆术 · 用直线量圆 | `cut-circle/remotion/out/cut-circle-60.mp4`（60s）<br>`cut-circle/remotion/out/cut-circle-demo.mp4`（10s） |

每个项目的 Remotion 工程都在各自的 `remotion/` 下：

```bash
cd solar-terms/remotion && npm run dev
cd cut-circle/remotion && npm run dev
```
