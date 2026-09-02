#!/usr/bin/env python3
"""Knock out the capture magenta (#ff00ff) so share-bar pills float on the studio plate."""

from pathlib import Path

from PIL import Image

src = Path(__file__).resolve().parent / "captures" / "bar.png"
dst = Path(__file__).resolve().parent / "captures" / "bar-cutout.png"

im = Image.open(src).convert("RGBA")
pix = im.load()
width, height = im.size
for y in range(height):
    for x in range(width):
        red, green, blue, _alpha = pix[x, y]
        magenta = (red + blue) / 2 - green
        if red > 200 and blue > 200 and green < 80:
            pix[x, y] = (0, 0, 0, 0)
        elif magenta > 70 and green > 160:
            pix[x, y] = (0, 0, 0, 0)
        elif magenta > 25:
            # Despill AA fringes on dark type/icons
            value = min(red, green, blue)
            pix[x, y] = (value, value, value, 255)

dst.parent.mkdir(parents=True, exist_ok=True)
im.save(dst)
print(f"wrote {dst}")
