#!/usr/bin/env python3
"""WCAG contrast check on a rendered video.

Palette checks compare two hex values. This checks the thing that actually
breaks: text composited over moving footage, where the backdrop changes every
frame. It samples the real pixels behind each text element in the real render.

Usage:
    contrast_check.py RENDER.mp4 checks.json [--fps 25] [--json out.json]

checks.json — a list of elements to test:
    [
      {"label": "stamp_under", "png": "graphics-build/assets/stamp_under_f.png",
       "x": "c", "y": 260, "w": 1040, "at": [19.6, 20.1, 20.5],
       "large": true}
    ]

  png    overlay artwork; its alpha marks which pixels are text
  x      left edge, or "c" to centre
  y      top edge
  w      composited width (omit for the PNG's native width)
  at     one or more timestamps in seconds to sample
  large  true for display type (>=~34px bold) -> 3.0:1 floor, else 4.5:1

Exit code 1 if any sample falls below its floor.
"""
import json
import subprocess
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

AA_TEXT, AA_LARGE = 4.5, 3.0


def parse_hex_color(h):
    """#fff or #ffffff -> (r, g, b) floats 0..1."""
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def relative_luminance(rgb):
    """W3C sRGB gamma expansion: L = 0.2126R + 0.7152G + 0.0722B."""
    r, g, b = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
               for c in rgb]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(rgb_a, rgb_b):
    """(L_lighter + 0.05) / (L_darker + 0.05) — 1.0 to 21.0."""
    la, lb = relative_luminance(rgb_a), relative_luminance(rgb_b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def grab_frame(video, t):
    """One decoded RGB frame at t seconds."""
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v",
         "-show_entries", "stream=width,height", "-of", "csv=p=0", video],
        capture_output=True, text=True).stdout.strip().split(",")
    w, h = int(probe[0]), int(probe[1])
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", str(t), "-i", video, "-frames:v", "1",
         "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        capture_output=True).stdout
    if len(raw) < w * h * 3:
        raise RuntimeError(f"could not decode a frame at {t}s")
    return np.frombuffer(raw[:w * h * 3], dtype=np.uint8).reshape(h, w, 3)


def sample(frame, spec):
    """Median text colour and median backdrop colour behind the text.

    The overlay's own alpha says which pixels are ink. The backdrop is the
    ring of frame pixels immediately around that ink — what the eye actually
    compares the text against.
    """
    png = Image.open(spec["png"]).convert("RGBA")
    w = spec.get("w") or png.width
    png = png.resize((w, round(png.height * w / png.width)), Image.LANCZOS)
    alpha = np.array(png)[:, :, 3] / 255.0

    fh, fw = frame.shape[:2]
    x = (fw - w) // 2 if spec.get("x", "c") == "c" else int(spec["x"])
    y = int(spec.get("y", 0))
    ah, aw = alpha.shape
    # clip to frame
    y0, x0 = max(0, y), max(0, x)
    y1, x1 = min(fh, y + ah), min(fw, x + aw)
    if y1 <= y0 or x1 <= x0:
        raise ValueError(
            f"element sits outside the frame: art {aw}x{ah} at ({x},{y}) "
            f"vs frame {fw}x{fh}")
    a = alpha[y0 - y:y1 - y, x0 - x:x1 - x]
    region = frame[y0:y1, x0:x1].astype(float) / 255.0

    ink = a > 0.75
    if ink.sum() < 40:
        return None
    near = ndimage.binary_dilation(ink, iterations=10) & (a < 0.10)
    if near.sum() < 40:
        near = (a < 0.10)
    if near.sum() < 40:
        return None

    fg = np.median(region[ink], axis=0)
    bg = np.median(region[near], axis=0)
    return tuple(fg), tuple(bg)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    video, checks_path = sys.argv[1], sys.argv[2]
    out_path = None
    if "--json" in sys.argv:
        out_path = sys.argv[sys.argv.index("--json") + 1]
    checks = json.load(open(checks_path))

    results, failed = [], 0
    print(f"{'element':26} {'t':>7} {'ratio':>8}  floor  verdict")
    print("-" * 62)
    for spec in checks:
        floor = AA_LARGE if spec.get("large") else AA_TEXT
        for t in spec.get("at", [0]):
            try:
                got = sample(grab_frame(video, t), spec)
            except Exception as e:
                print(f"{spec['label'][:26]:26} {t:7.2f}  {'error':>8}  "
                      f"{floor:5.1f}  {e}")
                continue
            if got is None:
                print(f"{spec['label'][:26]:26} {t:7.2f} {'no ink':>8}  "
                      f"{floor:5.1f}  skipped (element not on screen?)")
                continue
            fg, bg = got
            r = contrast_ratio(fg, bg)
            ok = r >= floor
            failed += 0 if ok else 1
            print(f"{spec['label'][:26]:26} {t:7.2f} {r:7.2f}:1  "
                  f"{floor:5.1f}  {'pass' if ok else 'FAIL'}")
            results.append({"label": spec["label"], "t": t,
                            "ratio": round(r, 2), "floor": floor, "pass": ok,
                            "textRGB": [round(c, 3) for c in fg],
                            "backdropRGB": [round(c, 3) for c in bg]})
    if out_path:
        json.dump(results, open(out_path, "w"), indent=2)
    print("-" * 62)
    print(f"{len(results)} samples, {failed} below floor")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
