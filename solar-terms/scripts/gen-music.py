"""Synthesize the score for 二十四节气 · 太阳的刻度.

The score and the picture share one grid: every solar-term card starts on a
beat of this score, and the beat positions are emitted as beats.json so the
video can be verified against the audio rather than eyeballed.

Instrumentation is a Karplus-Strong plucked string (guzheng/qin family) in a
D pentatonic mode, plus a low drone, a soft frame drum, and a bell at each
season boundary. Everything is generated here — no samples, no model.

Run:  python scripts/gen-music.py
Out:  remotion/public/audio/score.wav
      remotion/src/data/beats.json
"""
import json
import os
import sys

import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve

sys.stdout.reconfigure(encoding="utf-8")

SR = 48000
FPS = 30
DURATION = 160.0  # matches TOTAL_FRAMES / FPS
N = int(SR * DURATION)

# Card boundaries, in frames, from the shared timeline.
CARD_FRAMES = 125
TERMS_START = 900
SCENES = {
    "intro": (0, 240),
    "numbers": (240, 600),
    "seasons": (600, 900),
    "terms": (900, 3900),
    "outro": (3900, 4800),
}

rng = np.random.default_rng(20261025)


def t_of_frame(frame: int) -> float:
    return frame / FPS


# D pentatonic: D E F# A B, across four octaves.
def note_hz(semitones_from_d4: float) -> float:
    return 293.66 * (2 ** (semitones_from_d4 / 12.0))


PENTA = [0, 2, 4, 7, 9]  # D E F# A B


def penta_note(degree: int, octave: int = 0) -> float:
    """Degree 0 = D4; walks the pentatonic scale, wrapping octaves."""
    oct_shift, idx = divmod(degree, len(PENTA))
    return note_hz(PENTA[idx] + 12 * (octave + oct_shift))


def karplus_strong(freq: float, dur: float, decay: float = 0.996, bright: float = 0.5) -> np.ndarray:
    """Plucked string. The excitation is filtered noise, which gives the
    characteristic bright attack that dies into a soft sine."""
    n = int(SR * dur)
    delay = max(2, int(SR / freq))
    # excitation: noise shaped by a one-pole lowpass (brightness)
    exc = rng.uniform(-1, 1, delay)
    b = bright
    for i in range(1, delay):
        exc[i] = b * exc[i] + (1 - b) * exc[i - 1]

    buf = np.zeros(n)
    ring = exc.copy()
    idx = 0
    for i in range(n):
        buf[i] = ring[idx]
        nxt = (idx + 1) % delay
        ring[idx] = decay * 0.5 * (ring[idx] + ring[nxt])
        idx = nxt
    # gentle body resonance
    t = np.arange(n) / SR
    buf *= np.exp(-t * 2.2)
    return buf


def pluck(freq: float, dur: float, amp: float, pan: float = 0.0, decay: float = 0.996) -> tuple:
    """Returns (left, right) for a plucked note at `pan` (-1..1)."""
    sig = karplus_strong(freq, dur, decay=decay, bright=0.42 + rng.uniform(-0.1, 0.1))
    # soft attack, no click
    atk = int(SR * 0.004)
    if atk > 0:
        sig[:atk] *= np.linspace(0, 1, atk)
    l = np.sqrt((1 - pan) / 2)
    r = np.sqrt((1 + pan) / 2)
    return sig * amp * l, sig * amp * r


def bell(freq: float, dur: float, amp: float) -> np.ndarray:
    """A small bronze bell: inharmonic partials with fast-decaying highs."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for mult, a, d in [(1.0, 1.0, 1.6), (2.76, 0.42, 2.6), (5.4, 0.2, 4.0), (8.9, 0.1, 6.0)]:
        sig += a * np.sin(2 * np.pi * freq * mult * t) * np.exp(-t * d)
    atk = int(SR * 0.002)
    sig[:atk] *= np.linspace(0, 1, atk)
    return sig * amp


def drum(dur: float = 0.5, amp: float = 0.3) -> np.ndarray:
    """Framed drum: a pitched thump plus a short noise transient."""
    n = int(SR * dur)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 78 * t * np.exp(-t * 2.5)) * np.exp(-t * 7.5)
    noise = rng.uniform(-1, 1, n) * np.exp(-t * 42) * 0.35
    return (body + noise) * amp


def place(track: np.ndarray, sig: np.ndarray, at_sec: float, gain: float = 1.0):
    i = int(at_sec * SR)
    if i >= len(track) or i < 0:
        return
    j = min(len(track), i + len(sig))
    track[i:j] += sig[: j - i] * gain


# ---------------------------------------------------------------- composition
left = np.zeros(N)
right = np.zeros(N)


def add_pluck(freq, at, amp, dur=2.6, pan=0.0, decay=0.996):
    l, r = pluck(freq, dur, amp, pan, decay)
    place(left, l, at)
    place(right, r, at)


def add_bell(freq, at, amp=0.2):
    b = bell(freq, 3.0, amp)
    place(left, b, at, 0.85)
    place(right, b, at, 1.0)


def add_drum(at, amp=0.28):
    d = drum(amp=amp)
    place(left, d, at)
    place(right, d, at)


# --- 1. Opening (0:00–0:08): a single low note, then the first pluck lands
#     exactly on the ink bloom.
add_pluck(note_hz(-24), 0.0, 0.30, dur=8.0, decay=0.9992)
add_pluck(penta_note(0, 1), 1.55, 0.26, dur=5.0, pan=-0.2)
add_pluck(penta_note(2, 1), 2.45, 0.20, dur=4.5, pan=0.15)
add_bell(note_hz(12), 2.45, 0.10)

# --- 2. Numbers (0:08–0:20): a measured pulse, one note per number landing
number_lands = [8.0, 9.95, 11.15, 12.87]
for i, t in enumerate(number_lands):
    add_pluck(penta_note(i + 2, 1), t, 0.22, pan=-0.35 + i * 0.22)
    add_bell(note_hz(24 + PENTA[i % 5]), t, 0.07)
    add_drum(t, 0.12)

# the wheel fills: a rising arpeggio under the numbers
for i in range(12):
    add_pluck(penta_note(i, 1), 8.4 + i * 0.42, 0.09, pan=-0.5 + i * 0.09, decay=0.993)

# --- 3. Seasons (0:20–0:30): four chords, one per band, then the wrap
for i, t in enumerate([20.0, 20.28, 20.56, 20.84]):
    add_pluck(penta_note(i * 2, 0), t, 0.24, pan=-0.6 + i * 0.4)
    add_bell(note_hz(19 + PENTA[i % 5]), t, 0.09)
# the wheel closing
for i in range(8):
    add_pluck(penta_note(i, 2), 25.0 + i * 0.2, 0.07, pan=-0.6 + i * 0.17, decay=0.992)
add_bell(note_hz(31), 29.6, 0.16)

# --- 4. The 24 cards (0:30–2:10). Each card gets:
#     a low anchor on the downbeat, a melody figure, and a soft tick that
#     marks the boundary. This is what makes picture and sound inseparable.
MELODY = [
    [0, 2, 4, 2], [2, 4, 6, 4], [4, 6, 8, 6], [6, 4, 2, 0],
    [0, 4, 2, 4], [2, 6, 4, 6], [4, 2, 0, 2], [6, 8, 6, 4],
    [0, 2, 4, 7], [2, 4, 6, 9], [4, 7, 9, 7], [6, 4, 2, 4],
    [0, 4, 7, 4], [2, 6, 9, 6], [4, 8, 6, 2], [7, 9, 11, 9],
    [0, 2, 7, 2], [2, 4, 9, 4], [4, 7, 11, 7], [6, 9, 13, 9],
    [0, 7, 4, 2], [2, 9, 6, 4], [4, 11, 8, 6], [6, 13, 9, 7],
]
SEASON_ROOT = [0, 2, 4, 6]  # 春 D, 夏 E, 秋 F#, 冬 A — a step up each season

card_onsets = []
for i in range(24):
    start_f = TERMS_START + i * CARD_FRAMES
    t0 = t_of_frame(start_f)
    card_onsets.append(round(t0, 4))
    season = i // 6
    root = SEASON_ROOT[season]

    # downbeat: low anchor + drum
    add_pluck(penta_note(root - 5, 0), t0, 0.26, dur=4.2, decay=0.9985)
    add_drum(t0, 0.16 if i % 6 else 0.26)

    # melody figure across the card, landing on the card's second and third
    # beat so the picture's own reveals have room
    fig = MELODY[i]
    offsets = [0.0, 0.55, 1.35, 2.1]
    for k, (deg, off) in enumerate(zip(fig, offsets)):
        amp = 0.16 if k else 0.10
        add_pluck(penta_note(root + deg, 1), t0 + off, amp, pan=-0.4 + 0.25 * k, decay=0.995)

    # a soft high tick exactly on the boundary — the audio mirror of the cut
    if i > 0:
        add_bell(note_hz(36 + PENTA[season]), t0, 0.045)

    # season boundary: a bell and a longer chord
    if i % 6 == 0:
        add_bell(note_hz(24 + PENTA[season]), t0, 0.16)
        for j, deg in enumerate([0, 2, 4]):
            add_pluck(penta_note(root + deg, 0), t0 + 0.08 * j, 0.15, dur=5.0, decay=0.9985)

# --- 5. Outro (2:10–2:40): the year resolves down to the tonic
outro_t = t_of_frame(SCENES["outro"][0])
add_pluck(note_hz(-24), outro_t, 0.24, dur=12.0, decay=0.9995)
for i, deg in enumerate([0, 2, 4, 2, 0]):
    add_pluck(penta_note(deg, 1), outro_t + 0.6 + i * 1.15, 0.16, dur=5.0, pan=-0.3 + i * 0.15)
add_bell(note_hz(31), outro_t + 2.4, 0.18)
# final: the tonic, alone, ringing out
final_t = t_of_frame(4700)
add_pluck(penta_note(0, 0), final_t, 0.30, dur=12.0, decay=0.9996)
add_pluck(penta_note(0, 2), final_t + 0.04, 0.10, dur=9.0, decay=0.9994)
add_bell(note_hz(43), final_t, 0.14)

# ---------------------------------------------------------------- reverb + mix
def make_ir(seconds=3.4, decay=2.6, seed=7):
    n = int(SR * seconds)
    t = np.arange(n) / SR
    r = np.random.default_rng(seed)
    ir = r.uniform(-1, 1, n) * np.exp(-t * decay)
    # roll off the highs so the tail is warm, not hissy
    ir = np.convolve(ir, np.ones(24) / 24, mode="same")
    return ir / np.max(np.abs(ir))


IR = make_ir()
wet_l = fftconvolve(left, IR)[:N] * 0.16
wet_r = fftconvolve(right, IR)[:N] * 0.16
mix_l = left * 0.82 + wet_l
mix_r = right * 0.82 + wet_r

# master: gentle high-pass, soft clip, normalise to -1 dBFS peak
def highpass(x, hz=38):
    # one-pole high-pass, cheap and transparent at this cutoff
    a = np.exp(-2 * np.pi * hz / SR)
    y = np.empty_like(x)
    prev_x = 0.0
    prev_y = 0.0
    for i in range(len(x)):
        prev_y = a * (prev_y + x[i] - prev_x)
        prev_x = x[i]
        y[i] = prev_y
    return y


mix_l = highpass(mix_l)
mix_r = highpass(mix_r)

stereo = np.stack([mix_l, mix_r], axis=1)

# Slow bus compression so the quiet outro is not lost under the card section.
# A 2s window RMS envelope drives the gain; attack/release are long, which is
# what a real bus compressor does to a sustained bed like this.
# Section gain automation. The structure is known exactly, so explicit
# automation is more predictable than a generic compressor: the outro is
# written quiet on purpose (few notes, long tails) and needs lifting, while
# the 24-card section is dense and needs holding back.
SECTION_GAIN_DB = [
    (0.0, 8.0, 3.0),      # intro — sparse, needs presence
    (8.0, 20.0, 2.0),     # numbers
    (20.0, 30.0, 2.5),    # seasons
    (30.0, 130.0, 0.0),   # 24 cards — reference level
    (130.0, 160.0, 10.0),  # outro — lift the long decay
]

def apply_section_gain(x, sections, ramp_sec=1.2):
    gain_db = np.zeros(len(x))
    for a, b, g in sections:
        i0, i1 = int(a * SR), min(len(x), int(b * SR))
        gain_db[i0:i1] = g
    # smooth the steps into ramps so there are no audible jumps
    r = int(SR * ramp_sec)
    k = np.ones(r) / r
    nfft = 1 << (len(gain_db) + r - 1).bit_length()
    smooth = np.fft.irfft(np.fft.rfft(gain_db, nfft) * np.fft.rfft(k, nfft), nfft)
    smooth = smooth[(r - 1) // 2 : (r - 1) // 2 + len(gain_db)]
    # keep the plateaus exact: the smoothing rounds the corners, so re-anchor
    # each section's midpoint to its intended value
    for a, b, g in sections:
        mid = (int(a * SR) + min(len(x), int(b * SR))) // 2
        if 0 <= mid < len(smooth):
            smooth[mid] = g
    return x * (10 ** (smooth[:, None] / 20))

stereo = apply_section_gain(stereo, SECTION_GAIN_DB)

# soft saturation on the peaks only, then normalise to -1 dBFS
peak = np.max(np.abs(stereo))
stereo = stereo / peak * 1.10
stereo = np.tanh(stereo * 0.92) / np.tanh(0.92)
stereo = stereo / np.max(np.abs(stereo)) * 0.891  # -1 dBFS

# fade in/out so the file does not click
fade_in = int(SR * 0.8)
fade_out = int(SR * 1.6)
stereo[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
stereo[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None]

OUT = os.path.join(os.path.dirname(__file__), "..", "remotion", "public", "audio", "score.wav")
os.makedirs(os.path.dirname(OUT), exist_ok=True)
sf.write(OUT, stereo, SR, subtype="PCM_16")
print(f"wrote {OUT}  {len(stereo)/SR:.3f}s  {stereo.shape}")

beats = {
    "fps": FPS,
    "durationSec": DURATION,
    "cardOnsets": card_onsets,
    "sceneOnsets": {k: round(t_of_frame(v[0]), 4) for k, v in SCENES.items()},
    "seasonOnsets": [round(t_of_frame(TERMS_START + s * 6 * CARD_FRAMES), 4) for s in range(4)],
}
BJ = os.path.join(os.path.dirname(__file__), "..", "remotion", "src", "data", "beats.json")
with open(BJ, "w", encoding="utf-8") as f:
    json.dump(beats, f, ensure_ascii=False, indent=1)
print(f"wrote {BJ}")
