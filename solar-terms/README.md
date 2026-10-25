# 二十四节气 · 太阳的刻度

A 2:40 motion-graphics film about the 24 solar terms, built entirely in code with Remotion.

The reference video this adapts showed the 24 terms as 24 cards on paper with a colour
wheel at the end. This version keeps that grammar and adds a causal spine: **the sun's
position generates every term.** A sun cursor advances one segment of the wheel per card,
so the viewer sees *why* 立春 begins rather than being told that it does.

## What it does differently

| | Reference | This |
|---|---|---|
| Why 24 terms | never explained; the wheel is decoration | the wheel is the engine; the cursor advances continuously |
| Card layout | one template × 24 | four season-specific spatial logics |
| Dates | "二月四日前后" | exact Beijing time to the minute, from JPL DE421 |
| 三候 (pentads) | too small to read | set at 29–33px with their own reveal |
| Season changes | hard cuts | continuous deformation |
| Music | separate pipeline | score and picture share one beat grid |
| Card seams | — | cards cross-dissolve, no blank frames |

## Structure

| Time | Scene | Frames |
|---|---|---|
| 0:00–0:08 | Intro — paper, a drawn stroke, ink blooms, title rises | 0–240 |
| 0:08–0:20 | Numbers — 24 / 15° / 365.2422 / 72 counted up | 240–600 |
| 0:20–0:30 | Seasons — four bands close into the wheel | 600–900 |
| 0:30–2:10 | 24 term cards, 125 frames each | 900–3900 |
| 2:10–2:40 | Outro — the wheel completes, contracts to a seal | 3900–4800 |

## Season layouts

- **春** — growth. Painting unfurls upward from a bottom edge; name rises out of the paper.
- **夏** — fullness. Horizontal name banner; largest painting area; branches on the painting's
  aspect (wide handscroll vs tall hanging scroll).
- **秋** — drift. Lateral translation, falling leaves, progressive desaturation across six cards.
- **冬** — contraction. Painting recedes and darkens; name drops low and gains weight.

## Data

- `data/terms-2026.json` — 24 instants from JPL DE421 (via skyfield), exact to the second.
- `remotion/src/data/paintings.json` — 24 Metropolitan Museum works, all public domain,
  curated so each image answers its term's weather.
- `remotion/src/data/beats.json` — the shared beat grid. The score is generated from it.

## Scripts

```bash
python scripts/gen-terms.py        # DE421 -> data/terms-2026.json
python scripts/fetch-paintings.py  # download 24 CC0 paintings
python scripts/prepare-paintings.py# trim scan borders, remove mounting silk
python scripts/gen-music.py        # synthesize score.wav + beats.json
python scripts/gen-paper.py        # bake paper-texture.png (render speed)
```

## Run

```bash
cd remotion
npm install
npm run dev          # Remotion Studio preview
npx remotion render SolarTerms out/solar-terms.mp4
npm test             # vitest: timeline, data integrity, audio alignment
```

## Credits

Paintings: The Metropolitan Museum of Art, Open Access (CC0).
Ephemeris: JPL DE421 via skyfield.
Type: Noto Serif SC, SimKai.

Note: the 2026 solar-term instants were computed for the year 2026 (立春 2026-02-04
through 大寒 2027-01-20). To make another year's film, re-run `scripts/gen-terms.py`
with the target year.
