#!/usr/bin/env python3
"""
Generate responsive WebP variants for the photos in site/images/.

Every source file listed in SOURCES is rendered at each width in LADDER that is
smaller than the source, plus the source width itself. Output goes to
site/images/resp/ as <name>-<width>.webp. Originals are never touched — they
stay as the fallback for browsers without WebP support.

Re-run after adding new photos:

    python build-images.py

Requires Pillow:  pip install Pillow
"""

from pathlib import Path
from PIL import Image

# Root of the site, relative to this file
SITE = Path(__file__).resolve().parent / "site"
SRC_DIR = SITE / "images"
OUT_DIR = SRC_DIR / "resp"

# Target widths in CSS-independent pixels. Chosen from the measured layout:
# a gallery tile is at most 526 px wide (1052 px at 2x), the full-width tile
# at most 1072 px. Widths above the source width are skipped.
LADDER = [400, 600, 800, 1200]

# WebP encoder settings. method=6 is the slowest/best setting; these files are
# built once and served many times, so the extra seconds are free.
QUALITY = 82
METHOD = 6

# Every photo rendered on index.html or uslugi.html.
SOURCES = [
    # home page gallery + services subpage
    "oproznianie-mieszkania-przed.jpg",
    "oproznianie-mieszkania-po.jpg",
    "oproznianie-piwnicy-przed.jpg",
    "oproznianie-piwnicy-po.jpg",
    "wywoz-mebli-przed.jpg",
    "wywoz-mebli-po.jpg",
    "rozbiorka-pieca-2-przed.jpg",
    "rozbiorka-pieca-2-po.jpg",
    "oproznianie-strychu-przed.jpg",
    "oproznianie-strychu-po.jpg",
    # services subpage only
    "przeprowadzki.jpg",
    "wywoz-mebli-2-przed.jpg",
    "wywoz-mebli-2-po.jpg",
    "wywoz-agd-przed.jpg",
    "wywoz-agd-po.jpg",
    "rozbiorka-pieca-przed.jpg",
    "rozbiorka-pieca-po.jpg",
]


def widths_for(source_width):
    """Ladder entries below the source width, plus the source width itself."""
    widths = [w for w in LADDER if w < source_width]
    widths.append(source_width)
    return widths


def build():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    total_src = 0
    total_out = 0

    for name in SOURCES:
        path = SRC_DIR / name
        if not path.exists():
            print(f"  ! brak pliku: {name}")
            continue

        image = Image.open(path).convert("RGB")
        src_w, src_h = image.size
        total_src += path.stat().st_size
        stem = path.stem

        made = []
        for width in widths_for(src_w):
            height = round(src_h * width / src_w)
            resized = image if width == src_w else image.resize(
                (width, height), Image.LANCZOS
            )
            out = OUT_DIR / f"{stem}-{width}.webp"
            resized.save(out, "WEBP", quality=QUALITY, method=METHOD)
            total_out += out.stat().st_size
            made.append(f"{width}px={out.stat().st_size // 1024}kB")

        print(f"  {stem}  ({src_w}x{src_h}, {path.stat().st_size // 1024}kB)")
        print(f"      {'  '.join(made)}")

    print()
    print(f"  oryginaly:  {total_src // 1024} kB")
    print(f"  warianty:   {total_out // 1024} kB  ({len(list(OUT_DIR.glob('*.webp')))} plikow)")


if __name__ == "__main__":
    build()
