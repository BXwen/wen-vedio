"""Bake the paper texture to a PNG so the renderer stops re-rasterising two
full-screen feTurbulence filters on every one of 4800 frames.

The SVG original was a multiply layer: near-white with fine fibre, coarse
mottle, faint laid lines and a vignette. We reproduce that as a luminance
field and multiply it over the warmth gradient in CSS.
"""
import numpy as np
from PIL import Image, ImageFilter
from pathlib import Path

W, H = 1920, 1080


def band_noise(w, h, seed, blur, gain):
    """White noise low-passed by `blur` px, normalised to mean 0 / unit spread.

    Blurring white noise gives a noise field with energy concentrated near the
    scale of the blur radius, which is how the SVG filters are tuned: a small
    radius is fibre, a large one is mottle.
    """
    r = np.random.default_rng(seed)
    a = (r.random((h, w)) * 255).astype(np.uint8)
    img = Image.fromarray(a, "L").filter(ImageFilter.GaussianBlur(blur))
    v = np.asarray(img, dtype=np.float32)
    v -= v.mean()
    s = v.std()
    return v / s * gain if s > 1e-6 else v


# fine fibre — the dominant texture, roughly 1px scale
fibre = band_noise(W, H, 7, 0.7, 1.0)
# slightly coarser tooth so the grain is not uniform
tooth = band_noise(W, H, 19, 1.8, 0.55)
# coarse mottle — uneven pulp density, several hundred px scale
mottle = band_noise(W, H, 23, 90.0, 0.5)

# darkness field in 0..1: only the positive half of each noise contributes,
# so the paper reads as white with darker specks rather than grey overall
dark = (
    np.clip(fibre, 0, None) * 0.115
    + np.clip(tooth, 0, None) * 0.075
    + np.clip(mottle, 0, None) * 0.050
)

# laid lines: 48 vertical ribs every 40px, very faint
laid = np.zeros((H, W), dtype=np.float32)
laid[:, (np.arange(48) * 40) % W] = 1.0
dark += laid * 0.030

# vignette: radial falloff from just above centre
yy, xx = np.mgrid[0:H, 0:W]
r = np.sqrt(((xx - W / 2) / (W * 0.72)) ** 2 + ((yy - H * 0.46) / (H * 0.72)) ** 2)
dark += np.clip((r - 0.55) / 0.45, 0, 1) ** 2 * 0.16

dark = np.clip(dark, 0, 1)

# warm ink tone, matching the SVG colour matrices
ink = np.array([0.42, 0.36, 0.28])
rgb = np.clip((1.0 - dark[..., None] * ink[None, None, :]) * 255, 0, 255).astype(np.uint8)

out = Path(__file__).resolve().parent.parent / "remotion/public/paper-texture.png"
Image.fromarray(rgb, "RGB").save(out, optimize=True)
print(f"{out}  {out.stat().st_size / 1e6:.2f} MB  dark mean={dark.mean():.4f} max={dark.max():.3f}")
