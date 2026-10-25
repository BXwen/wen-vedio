"""Normalise the 24 paintings: strip black scan borders and scroll mounting,
then write 1600px-wide JPEGs to remotion/public/paintings-clean/."""
import json
import os
import sys

import numpy as np
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "remotion", "public", "paintings")
DST = os.path.join(ROOT, "remotion", "public", "paintings-clean")
os.makedirs(DST, exist_ok=True)

# Per-file insets as fractions (left, top, right, bottom) applied after the
# black-border trim, to remove mounting silk and matting.
INSETS = {
    "315.jpg": (0.03, 0.03, 0.03, 0.03),
    "330.jpg": (0.0, 0.0, 0.0, 0.0),
    "345.jpg": (0.0, 0.0, 0.0, 0.0),
    "0.jpg": (0.02, 0.02, 0.02, 0.02),
    "15.jpg": (0.0, 0.0, 0.0, 0.0),
    "30.jpg": (0.08, 0.08, 0.08, 0.08),
    "45.jpg": (0.02, 0.02, 0.02, 0.02),
    "60.jpg": (0.19, 0.07, 0.19, 0.07),
    "75.jpg": (0.14, 0.04, 0.14, 0.04),
    "90.jpg": (0.14, 0.05, 0.14, 0.09),
    "105.jpg": (0.08, 0.10, 0.08, 0.10),
    "120.jpg": (0.05, 0.06, 0.05, 0.05),
    "135.jpg": (0.0, 0.0, 0.0, 0.0),
    "150.jpg": (0.06, 0.06, 0.06, 0.06),
    "165.jpg": (0.04, 0.04, 0.04, 0.04),
    "180.jpg": (0.13, 0.04, 0.13, 0.10),
    "195.jpg": (0.0, 0.0, 0.0, 0.0),
    "210.jpg": (0.03, 0.03, 0.03, 0.03),
    "225.jpg": (0.05, 0.08, 0.05, 0.08),
    "240.jpg": (0.02, 0.02, 0.02, 0.02),
    "255.jpg": (0.30, 0.07, 0.30, 0.09),
    "270.jpg": (0.17, 0.05, 0.17, 0.06),
    "285.jpg": (0.18, 0.05, 0.18, 0.06),
    "300.jpg": (0.04, 0.10, 0.04, 0.10),
}


def trim_black(im: Image.Image) -> Image.Image:
    """Drop uniform dark scan borders."""
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    # a row/column is 'border' when its mean brightness is very low
    row_mean = a.mean(axis=(1, 2))
    col_mean = a.mean(axis=(0, 2))
    thr = 42
    ys = np.where(row_mean > thr)[0]
    xs = np.where(col_mean > thr)[0]
    if len(ys) == 0 or len(xs) == 0:
        return im
    top, bottom = int(ys[0]), int(ys[-1]) + 1
    left, right = int(xs[0]), int(xs[-1]) + 1
    return im.crop((left, top, right, bottom))


def process(name: str) -> str:
    im = Image.open(os.path.join(SRC, name)).convert("RGB")
    im = trim_black(im)
    w, h = im.size
    l, t, r, b = INSETS[name]
    im = im.crop((int(w * l), int(h * t), int(w * (1 - r)), int(h * (1 - b))))
    w, h = im.size
    if w > 1600:
        im = im.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
    out = os.path.join(DST, name)
    im.save(out, quality=92, optimize=True)
    return f"{name}: {w}x{h} -> {im.size[0]}x{im.size[1]}"


for name in sorted(INSETS):
    print(process(name))
