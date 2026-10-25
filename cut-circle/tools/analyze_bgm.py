"""Analyse bgm.mp3: tempo, beat grid, onsets and energy in the first bars.

Outputs plots to docs/bgm-analysis and a beats.json the Remotion project can
import.  Run from the cut-circle folder:

    python tools/analyze_bgm.py
"""

import json
import os
import subprocess

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import soundfile as sf
from scipy.ndimage import gaussian_filter1d, uniform_filter1d
from scipy.signal import find_peaks, stft

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WAV = os.path.join(ROOT, ".cache", "bgm-mono.wav")
OUT = os.path.join(ROOT, "docs", "bgm-analysis")
os.makedirs(OUT, exist_ok=True)
os.makedirs(os.path.dirname(WAV), exist_ok=True)

SR = 22050
N_FFT = 1024
HOP = 256

if not os.path.exists(WAV):
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            os.path.join(ROOT, "remotion", "public", "audio", "bgm.mp3"),
            "-ac",
            "1",
            "-ar",
            str(SR),
            WAV,
        ],
        check=True,
    )

x, sr = sf.read(WAV)
if x.ndim > 1:
    x = x.mean(axis=1)
x = x.astype(np.float64)
x /= max(1e-9, np.max(np.abs(x)))
duration = len(x) / sr

# ---- STFT, spectral flux, onset envelope -------------------------------
freqs, times, Z = stft(
    x,
    fs=SR,
    nperseg=N_FFT,
    noverlap=N_FFT - HOP,
    boundary=None,
    padded=False,
)
S = np.log1p(10 * np.abs(Z))
flux = np.concatenate(
    [[0.0], np.sum(np.maximum(0, np.diff(S, axis=1)), axis=0)]
)
frame_rate = SR / HOP
flux = (flux - flux.mean()) / (flux.std() + 1e-9)
onset = np.maximum(gaussian_filter1d(flux, 1.0), 0)
onset_times = np.arange(len(onset)) / frame_rate

# ---- tempo: comb-filter score over BPM + phase -------------------------
def comb_score(bpm):
    interval = 60.0 / bpm * frame_rate
    best_score = -1e9
    best_phase = 0.0
    for phase in np.arange(0, interval, 0.5):
        beats = np.arange(phase, len(onset) - 1, interval)
        idx = np.clip(np.round(beats).astype(int), 0, len(onset) - 1)
        score = float(np.mean(onset[idx]))
        if score > best_score:
            best_score = score
            best_phase = phase
    return best_score, best_phase


candidates = []
for bpm in np.arange(60.0, 200.0, 0.25):
    score, phase = comb_score(bpm)
    candidates.append((score, bpm, phase))
candidates.sort(reverse=True)

print(f"duration {duration:.3f}s")
print("top tempo candidates:")
for score, bpm, phase in candidates[:12]:
    print(f"  {bpm:6.2f} BPM  score {score:.4f}  phase {phase / frame_rate:.3f}s")

# The comb score's top candidate (75.25) is a 3-against-4 reading of the same
# pulse. The strong onsets repeat every 2.124s, which is exactly four beats at
# 113 BPM; that is the grid the cut uses.
bpm = 113.0

interval = 60.0 / bpm
# Anchor the grid on the first strong hit (the pickup). The mean comb phase
# sits about 33ms late on this track, which is enough to blur a 1/8-note cut.
search = int(0.15 * frame_rate)
first_beat = float(onset_times[int(np.argmax(onset[:search]))])
beats = first_beat + np.arange(0, duration + interval, interval)
beats = beats[beats < duration]
print(f"chosen {bpm:.2f} BPM, first beat {beats[0]:.3f}s, {len(beats)} beats")

# ---- strong onsets -----------------------------------------------------
peaks, props = find_peaks(
    onset,
    distance=int(frame_rate * 0.08),
    prominence=0.35,
)
strong = [
    {
        "time": round(float(onset_times[i]), 4),
        "strength": round(float(onset[i]), 4),
    }
    for i in peaks
]
strong_sorted = sorted(strong, key=lambda d: d["strength"], reverse=True)

print("strong onsets in first 12s:")
for item in strong:
    if item["time"] <= 12:
        print(f"  {item['time']:6.3f}s  {item['strength']:.3f}")

# ---- RMS and band energy ----------------------------------------------
rms_win = int(0.02 * SR)
rms = np.sqrt(uniform_filter1d(x * x, rms_win))
rms_t = np.arange(len(rms)) / SR

band_edges = [(30, 120), (120, 2000), (2000, 8000)]
bands = []
for lo, hi in band_edges:
    mask = (freqs >= lo) & (freqs < hi)
    bands.append(np.log1p(np.sum(np.abs(Z[mask]) ** 2, axis=0)))

# ---- plots -------------------------------------------------------------
plt.rcParams.update({"figure.dpi": 130, "font.size": 8})

# full overview
fig, axes = plt.subplots(3, 1, figsize=(14, 7), sharex=True)
axes[0].plot(np.arange(len(x)) / SR, x, lw=0.2, color="#333")
axes[0].set_ylabel("wave")
axes[1].plot(onset_times, onset, lw=0.6, color="#B3271E")
axes[1].set_ylabel("onset")
axes[2].plot(rms_t, rms, lw=0.5, color="#3E5A72")
axes[2].set_ylabel("rms")
axes[2].set_xlabel("seconds")
for ax in axes:
    for beat in beats[::4]:
        ax.axvline(beat, color="#B08A4A", lw=0.3, alpha=0.35)
fig.tight_layout()
fig.savefig(os.path.join(OUT, "overview.png"))
plt.close(fig)

# first 12 seconds
end = 12.0
fig, axes = plt.subplots(3, 1, figsize=(14, 8), sharex=True)
mask = rms_t <= end
axes[0].plot(rms_t[mask], rms[mask], lw=0.8, color="#1C1A17")
for beat in beats[beats <= end]:
    axes[0].axvline(beat, color="#B08A4A", lw=0.8, alpha=0.6)
for item in strong:
    if item["time"] <= end:
        axes[0].axvline(item["time"], color="#B3271E", lw=0.6, alpha=0.5)
axes[0].set_ylabel("rms")
axes[0].set_title("first 12s — gold=beat grid, red=strong onset")

mask2 = onset_times <= end
axes[1].plot(onset_times[mask2], onset[mask2], lw=0.8, color="#B3271E")
axes[1].scatter(
    [d["time"] for d in strong if d["time"] <= end],
    [d["strength"] for d in strong if d["time"] <= end],
    s=14,
    color="#B3271E",
    zorder=3,
)
axes[1].set_ylabel("onset")

for band, label, color in zip(
    bands,
    ["low 30-120Hz", "mid 120-2k", "high 2-8k"],
    ["#3E5A72", "#B08A4A", "#7BA05B"],
):
    axes[2].plot(times, band, lw=0.8, label=label, color=color)
axes[2].legend(loc="upper right", frameon=False)
axes[2].set_ylabel("band energy")
axes[2].set_xlabel("seconds")
axes[2].set_xlim(0, end)
fig.tight_layout()
fig.savefig(os.path.join(OUT, "first-12s.png"))
plt.close(fig)

# first 3 seconds zoom
end3 = 3.0
fig, axes = plt.subplots(2, 1, figsize=(12, 5), sharex=True)
mask = rms_t <= end3
axes[0].plot(rms_t[mask], rms[mask], lw=1.0, color="#1C1A17")
for beat in beats[beats <= end3]:
    axes[0].axvline(beat, color="#B08A4A", lw=1.0, alpha=0.7)
for item in strong:
    if item["time"] <= end3:
        axes[0].axvline(item["time"], color="#B3271E", lw=0.8, alpha=0.6)
        axes[0].annotate(
            f"{item['time']:.2f}",
            (item["time"], item["strength"]),
            fontsize=6,
            rotation=90,
            va="bottom",
        )
axes[0].set_ylabel("rms")
axes[0].set_title("first 3s — the hook window")
mask2 = onset_times <= end3
axes[1].plot(onset_times[mask2], onset[mask2], lw=1.0, color="#B3271E")
axes[1].set_ylabel("onset")
axes[1].set_xlabel("seconds")
axes[1].set_xlim(0, end3)
fig.tight_layout()
fig.savefig(os.path.join(OUT, "first-3s.png"))
plt.close(fig)

# spectrogram first 12s
fig, ax = plt.subplots(figsize=(14, 4))
spec = np.log1p(10 * np.abs(Z))
ax.imshow(
    spec,
    origin="lower",
    aspect="auto",
    extent=[times[0], times[-1], freqs[0], freqs[-1]],
    cmap="magma",
)
ax.set_ylim(0, 4000)
ax.set_xlim(0, end)
ax.set_xlabel("seconds")
ax.set_ylabel("Hz")
ax.set_title("spectrogram — first 12s")
fig.tight_layout()
fig.savefig(os.path.join(OUT, "spectrogram-first-12s.png"))
plt.close(fig)

# ---- beats.json --------------------------------------------------------
data = {
    "bpm": round(float(bpm), 3),
    "interval": round(float(interval), 4),
    "firstBeat": round(float(beats[0]), 4),
    "duration": round(float(duration), 4),
    "beats": [round(float(b), 4) for b in beats],
    "strongOnsets": strong_sorted[:80],
}
with open(os.path.join(OUT, "beats.json"), "w", encoding="utf-8") as fh:
    json.dump(data, fh, ensure_ascii=False, indent=1)

print(f"wrote {OUT}/beats.json")
