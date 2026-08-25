#!/usr/bin/env python3
"""
Assemble smallcap-250-index-hidden-midcaps.

Three passes, each simple enough to verify:
  1. base + camera moves + b-roll + takeover segments + overlays   -> p1.mov
  2. light leaks (ABOVE the graphics)  + global chrome             -> p2.mov
  3. captions                                                       -> final

Why chrome is in pass 2, not pass 1: style.md puts corner branding above the light leak
("composite it ABOVE the graphic overlays, below only branding and captions"). The six Remotion
takeover SEGMENTS bake their own chrome in, so the global layer is gated OFF across those windows
to avoid double-compositing the drop shadow.

Every window below is in FRAMES at 25fps. Two traps this encodes:
  * `trim` is half-open on SOURCE timestamps and yields one fewer frame than an `enable` window
    covers, so each input is trimmed generously and `enable` defines the real window.
  * An N-frame overlay's last frame sits at start+(N-1)/fps. Gating to start+N/fps leaves one
    uncovered frame at the boundary.
And one rule: consecutive graphics either abut exactly or leave a gap of more than a second.
A gap of a few tenths flashes raw un-graphiced footage. Every such gap is closed below by
extending the EARLIER part into its own tail margin (which is why parts carry one).
"""
import json, os, subprocess, sys

FPS = 25
TOTAL = 2231          # 89.24s — her cut's final frame is pure BLACK and is trimmed (ends cold)
JOB = "/Volumes/Extreme SSD/video-editor-jobs/smallcap-250-index-hidden-midcaps"
OUT = "/Volumes/vedev/smallcap-250-index-hidden-midcaps/remotion/out"
SEG = f"{JOB}/graphics-build/segments"
BRL = f"{JOB}/broll/conformed"
WORK = f"{JOB}/graphics-build/work"

# ---------------------------------------------------------------------------------------------
# OPAQUE parts, in z-order. `end` is the LAST frame the part covers (inclusive).
# `srcOffset` is the frame inside the part file that lines up with `start`.
# ---------------------------------------------------------------------------------------------
SEGMENTS = [
    # id,               file,                              start, end,  note
    ("ref01-zoom",  f"{SEG}/ref01-zoom-subtle.mov",            0,  215, "REF1: flat 1.000 until her beat opens at f18, ramp to f164, then HOLD to the ref3 takeover so the base never snaps back"),
    ("ref3",        f"{OUT}/ref3-name-takeover.mov",         216,  269, "REF3 takeover"),
    ("ref6",        f"{OUT}/ref6-seesaw-rebalance.mov",      366,  506, "REF6 seesaw; extended 6f to abut the b-roll (was a 0.24s flash)"),
    ("broll7",      f"{BRL}/ref07-terminal.mov",             507,  661, "REF7 AI b-roll; extended 2f to abut ref08"),
    ("ref08",       f"{OUT}/ref08-midcap-range.mov",         662,  745, "REF8; extended 2f to abut the rapid zoom"),
    ("ref09-zoom",  f"{SEG}/ref09-zoom-rapid.mov",           746,  819, "REF9 rapid push-in, then HOLD to the ref11 takeover"),
    ("ref11",       f"{OUT}/ref11-stays-till-rebalance.mov", 820, 1059, "REF11 vox build; extended 10f to abut the b-roll (was a 0.40s flash)"),
    ("broll12",     f"{BRL}/ref12-sheep.mov",               1060, 1253, "REF12 AI b-roll; extended 3f to abut the table"),
    ("ref13",       f"{OUT}/ref13-table.mov",               1254, 1626, "REF13 THE TABLE; holds through her last word, then to ref14"),
    ("ref14",       f"{OUT}/ref14-officially-functionally.mov", 1627, 1708, "REF14; starts as ref13 ends so we never bounce back to full-frame face between two graphics"),
    ("broll15",     f"{BRL}/ref15-ramp.mov",                1709, 1849, "REF15 AI b-roll; extended 5f to abut"),
    ("broll16",     f"{BRL}/ref16-piggy.mov",               1850, 1964, "REF16 AI b-roll; extended 6f to abut the zoom"),
    ("ref17-zoom",  f"{SEG}/ref17-zoom-subtle.mov",         1965, 2230, "REF17 subtle push-in, HELD to the end (a sanctioned held frame)"),
]

# TRANSPARENT overlays, composited over whatever is beneath.
OVERLAYS = [
    ("ref2",       f"{OUT}/ref2-sounds-logical.mov",  172,  203, "REF2 bottom gradient + 'Sounds logical?'"),
    ("ref5",       f"{OUT}/ref5-market-swirl.mov",    328,  363, "REF5 swirling market widgets"),
    ("ref10",      f"{OUT}/ref10-no.mov",             805,  818, "REF10 'No' over the gradient"),
    ("ref17-red",  f"{OUT}/ref17-red-alarm.mov",     1965, 2045, "REF17 red alarm, lit ONLY across 'galat' (80.65-80.85)"),
    ("ref18",      f"{OUT}/ref18-notepad.mov",       2047, 2177, "REF18 notepad; extended 5f to abut the subscribe widget"),
    ("ref19",      f"{OUT}/ref19-subscribe.mov",     2178, 2222, "REF19 subscribe widget"),
]

# 13-frame measured leak; the SHOT CHANGE sits under its one-frame white peak at index 7,
# so the leak starts 7 frames before the cut it hides.
LEAKS = [("leakA", 366 - 7, "REF5 -> REF6: 'A lightleak after sfx after it' — BASE -> ref6 takeover"),
         ("leakB", 1850 - 7, "REF15 -> REF16: 'A light leak after it' — broll15 -> broll16")]
# leakC (REF17 -> REF18) REMOVED, creator directive 2026-08-23 ("that last lightleak can be
# avoided"). Verified on the plan: both sides of that boundary are the SAME shot, ref17-zoom ->
# ref17-zoom. The footage runs continuously underneath, so the leak had no cut to hide and simply
# flashed the presenter — style.md's "the creator never appears inside one". REF18's notepad
# rising from the bottom is the transition there, and it is already built.

# The six Remotion takeovers bake their own chrome, so the global layer is muted there.
CHROME_OFF = [("ref3", 216, 269), ("ref6", 366, 506), ("ref08", 662, 745),
              ("ref11", 820, 1059), ("ref13", 1254, 1626), ("ref14", 1627, 1708)]


def probe_frames(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v",
                        "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", path],
                       capture_output=True, text=True)
    return int(r.stdout.strip() or 0)


def check():
    """Fail loudly BEFORE a two-minute composite rather than halfway through it."""
    ok = True
    covered = [None] * TOTAL
    for sid, f, s, e in [(a, b, c, d) for a, b, c, d, _ in SEGMENTS]:
        if not os.path.exists(f):
            print(f"  MISSING {sid}: {f}"); ok = False; continue
        have = probe_frames(f)
        need = e - s + 1
        flag = "OK " if have >= need else "SHORT"
        if have < need: ok = False
        print(f"  {flag} {sid:12s} needs {need:4d}f, part has {have:4d}f  ({s}-{e})")
        for i in range(s, min(e + 1, TOTAL)):
            covered[i] = sid
    # gap report: anything under a second between opaque parts is a flash of raw footage
    runs, cur, start = [], covered[0], 0
    for i in range(1, TOTAL):
        if covered[i] != cur:
            runs.append((cur, start, i - 1)); cur, start = covered[i], i
    runs.append((cur, start, TOTAL - 1))
    print("\n  base-visible stretches (None = her plain A-roll showing through):")
    for who, a, b in runs:
        if who is None:
            d = (b - a + 1) / FPS
            mark = "  <-- SUB-SECOND GAP, would flash" if 0 < d < 1.0 else ""
            print(f"    {a:5d}-{b:5d}  {d:5.2f}s{mark}")
            if 0 < d < 1.0:
                ok = False
    for oid, f, s, e, _ in OVERLAYS:
        if not os.path.exists(f):
            print(f"  MISSING overlay {oid}"); ok = False; continue
        have, need = probe_frames(f), e - s + 1
        if have < need:
            print(f"  SHORT overlay {oid}: needs {need}, has {have}"); ok = False
    return ok


def pass1(dst):
    ins, fc, cur = [f"{JOB}/raw/source.mp4"], [], "base"
    fc.append(f"[0:v]trim=end_frame={TOTAL},setpts=PTS-STARTPTS,fps={FPS}[base]")
    idx = 1
    for sid, f, s, e, _ in SEGMENTS:
        ins.append(f)
        # trim generously (+8f), let `enable` define the true window
        fc.append(f"[{idx}:v]trim=end_frame={e-s+9},setpts=PTS-STARTPTS+{s}/{FPS}/TB,fps={FPS}[s{idx}]")
        fc.append(f"[{cur}][s{idx}]overlay=eof_action=pass:shortest=0:"
                  f"enable='between(n,{s},{e})'[c{idx}]")
        cur = f"c{idx}"; idx += 1
    for oid, f, s, e, _ in OVERLAYS:
        ins.append(f)
        fc.append(f"[{idx}:v]trim=end_frame={e-s+9},setpts=PTS-STARTPTS+{s}/{FPS}/TB,fps={FPS},"
                  f"format=yuva444p10le[o{idx}]")
        fc.append(f"[{cur}][o{idx}]overlay=eof_action=pass:shortest=0:"
                  f"enable='between(n,{s},{e})'[c{idx}]")
        cur = f"c{idx}"; idx += 1
    fc.append(f"[{cur}]format=yuv422p10le[vout]")
    cmd = ["ffmpeg", "-y", "-v", "error", "-stats"]
    for i in ins: cmd += ["-i", i]
    cmd += ["-filter_complex", ";".join(fc), "-map", "[vout]", "-an",
            "-c:v", "prores_ks", "-profile:v", "3", dst]
    return cmd


def verify_leak_hue(path, leak_start):
    """Assert the leak still reads MAGENTA (creator's choice), not warm orange.

    This look rides on ffmpeg's format negotiation, so it can regress silently on an upgrade.
    Measured on the approved draft: the leak adds roughly +106 R, -18 G, +121 B over the base,
    i.e. B >= R and G going DOWN. Warm orange would be R > G > B with G going up.
    """
    import numpy as np
    from PIL import Image
    import io
    def frame(src, n):
        r = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf",
                            f"select='eq(n\\,{n})',scale=180:320", "-vsync", "0", "-frames:v", "1",
                            "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True)
        return np.array(Image.open(io.BytesIO(r.stdout)).convert("RGB")).astype(float)
    n = leak_start + 1
    a = frame(path, n); b = frame(f"{JOB}/raw/source.mp4", n)
    d = (a - b).reshape(-1, 3).mean(0)
    magenta = d[2] >= d[0] * 0.85 and d[1] < d[0] * 0.5
    print(f"  leak hue @f{n}: dR{d[0]:+.1f} dG{d[1]:+.1f} dB{d[2]:+.1f}  -> "
          f"{'MAGENTA (as approved)' if magenta else 'NOT MAGENTA — negotiation changed, see pass2()'}")
    return magenta


def pass2(src, dst):
    """Light leaks above the graphics, then the global chrome above those."""
    ins = [src, f"{OUT}/lightleak.mov", f"{OUT}/chrome.mov"]
    # ---- THE LEAK IS MAGENTA ON PURPOSE (creator directive 2026-08-24) --------------------
    # The leak ASSET is warm orange and correct: its per-frame R/G curve matches style.md's
    # measured 2.81 / 2.80 / 2.69 / 2.60 ... to within 0.03. The magenta comes from this blend.
    #
    # `blend`'s all_expr runs the same expression on every plane. p1.mov is ProRes yuv422p10le,
    # so with an RGB leak ffmpeg negotiates a common format and the screen-style curve ends up
    # running over the CHROMA planes, which adds blue over red and pushes green negative
    # (measured against the source: +106 R, -18 G, +121 B) — magenta.
    #
    # The blind review filed that as a blocker and it was "fixed" to warm orange by forcing both
    # sides to gbrp10le. The creator then chose the magenta: "magenta was nice". So it stays.
    # DO NOT add `format=gbrp10le` to the base to "correct" this — that is the fix that removes it.
    #
    # It is deliberate but FRAGILE: it depends on ffmpeg's format negotiation, so an ffmpeg
    # upgrade could silently restore the orange. `verify_leak_hue()` below asserts the hue and
    # is called after every pass 2 — if it starts failing, the negotiation changed, and the leak
    # needs an explicit colourchannelmixer instead of this implicit route.
    fc = [f"[0:v]fps={FPS}[base]"]
    cur = "base"
    for n, (lid, s, _) in enumerate(LEAKS):
        # style.md: a pure `screen` saturates to white on a near-white base, so the warm cast
        # vanishes over bright data cards. Screen PLUS an intensity-weighted tint.
        fc.append(f"[1:v]trim=end_frame=13,setpts=PTS-STARTPTS+{s}/{FPS}/TB,fps={FPS},"
                  f"format=gbrp10le,loop=loop=0:size=13:start=0[lk{n}]")
        fc.append(f"[{cur}]split[b{n}a][b{n}b]")
        fc.append(f"[b{n}a][lk{n}]blend=all_expr='(A+B-A*B/1023)*(1-B/2046)+B*B/2046':"
                  f"shortest=1[bl{n}]")
        fc.append(f"[b{n}b][bl{n}]overlay=eof_action=pass:shortest=0:"
                  f"enable='between(n,{s},{s+12})'[c{n}]")
        cur = f"c{n}"
    # chrome, muted across the six segments that already carry it
    off = "+".join(f"between(n,{a},{b})" for _, a, b in CHROME_OFF)
    fc.append(f"[2:v]fps={FPS},format=yuva444p10le[chr]")
    fc.append(f"[{cur}][chr]overlay=eof_action=pass:shortest=0:enable='not({off})'[vout]")
    cmd = ["ffmpeg", "-y", "-v", "error", "-stats"]
    for i in ins: cmd += ["-i", i]
    cmd += ["-filter_complex", ";".join(fc), "-map", "[vout]", "-an",
            "-c:v", "prores_ks", "-profile:v", "3", dst]
    return cmd


if __name__ == "__main__":
    os.makedirs(WORK, exist_ok=True)
    print("PREFLIGHT")
    if not check():
        print("\nPREFLIGHT FAILED — not compositing.")
        sys.exit(1)
    print("\npreflight clean.\n")
    plan = {"fps": FPS, "totalFrames": TOTAL,
            "segments": [dict(zip(("id", "file", "start", "end", "note"), s)) for s in SEGMENTS],
            "overlays": [dict(zip(("id", "file", "start", "end", "note"), o)) for o in OVERLAYS],
            "leaks": [dict(zip(("id", "start", "note"), l)) for l in LEAKS],
            "chromeOff": [dict(zip(("id", "start", "end"), c)) for c in CHROME_OFF]}
    json.dump(plan, open(f"{JOB}/graphics-build/composite-plan.json", "w"), indent=1)

    if "--preflight" in sys.argv:
        sys.exit(0)
    for label, cmd, dst in (("PASS 1", pass1(f"{WORK}/p1.mov"), f"{WORK}/p1.mov"),
                            ("PASS 2", pass2(f"{WORK}/p1.mov", f"{WORK}/p2.mov"), f"{WORK}/p2.mov")):
        print(f"\n{label}")
        r = subprocess.run(cmd)
        if r.returncode != 0 or not os.path.exists(dst):
            print(f"{label} FAILED"); sys.exit(1)
        print(f"  -> {dst}  {probe_frames(dst)} frames")
