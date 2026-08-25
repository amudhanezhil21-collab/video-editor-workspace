#!/usr/bin/env python3
"""
Burn-in captions for daily-vs-weekly-vs-monthly-sip.

brand.md caption voice: an ENGLISH TRANSLATION of the Hindi/Hinglish VO — never a raw transcript,
never Devanagari. White bold Inter Tight on near-black rounded chips, 2-6 words a group, and
karaoke advancing exactly ONE word at a time to $amber through every word.

Placement is SOLVED, not chosen (style.md, creator directive 2026-08-22). Each scene's graphics
occupy known rows, measured off the build, and the caption band is the first ladder position that
clears them, the face and the safe zones:

  0.00-9.42   y1400  A-roll; her chin sits at ~950 in the reframed base
  9.42-42.77  y1452  table card ends 1330, source line 1352 -> clear band below
  42.77-52.20 y1400  b-roll is NOT a collision (style.md) - captions ride over it
  52.20-58.90 y1420  hero raised to end 1290, pills start 1500 -> band between
  58.90-64.28 y1400  b-roll
  64.28-70.67 y1180  outro furniture owns 1372-1626, so the band moves up onto her torso
"""
import json, os

OUT = "/Volumes/vedev/graphics-build/dwm-sip/dwm/compositions/captions.html"
TR  = "/Users/ezhilamudhan/Desktop/video-editor/projects/daily-vs-weekly-vs-monthly-sip/transcript/transcript.json"
AMBER, CHIP = "#FCB31C", "#040304"

# English translation, mapped to the Hindi word span it covers. Word indices are into
# transcript.json's word list (forced-aligned), so the timing is the real timing.
LINES = [
    (0,   6,  "Daily SIP, weekly, or monthly?"),
    (7,   14, "Which frequency earns the highest returns?"),
    (15,  21, "Let's see what the data says."),
    (22,  35, "Say you invested 109.08 lakh rupees from August 1996 to June 2026."),
    (36,  49, "A daily SIP of 1,000 rupees becomes 12.33 crore."),
    (50,  59, "Weekly at 6,997 rupees? Also 12.33 crore."),
    (60,  73, "And monthly at 30,384 rupees still gives 12.45 crore."),
    (74,  81, "All three had exactly the same XIRR: 13.47%."),
    (82,  91, "So over the long term, frequency makes no difference."),
    (92, 101, "Daily, weekly or monthly, returns are almost the same."),
    (102,105, "So what's the lesson?"),
    (106,117, "Don't fuss over frequency. Focus on discipline and long-term investing."),
    (118,134, "Monthly SIP suits most people because it matches their salary cycle."),
    (135,141, "So which SIP frequency is yours?"),
    (142,145, "Daily, weekly or monthly?"),
    (146,151, "Let us know in the comments."),
]

BANDS = [(0.0, 9.24, 1400), (9.24, 42.62, 1452), (52.05, 58.75, 1420), (64.10, 71.0, 1180)]

# Creator directive 2026-08-23: captions are SUPPRESSED over AI-generated b-roll — putting them on
# the generated people reads as odd. The b-roll carries those lines on its own.
SUPPRESS = [(42.62, 52.05), (58.75, 64.10)]

def suppressed(t):
    return any(a <= t < b for a, b in SUPPRESS)

def band_for(t):
    for a, b, y in BANDS:
        if a <= t < b:
            return y
    return 1400

MAX_GROUP = 1.5     # style.md: one group is roughly 1-1.5s

def word_times(ws, i0, i1, n_en):
    """
    Map the N English words onto the REAL Hindi word rhythm rather than spreading them evenly
    across the sentence. Spreading evenly drifts badly wherever she pauses, and this VO has
    several 1s+ pauses inside single sentences.
    """
    src = ws[i0:i1 + 1]
    m = len(src)
    times = []
    for k in range(n_en):
        j = min(m - 1, int(k * m / n_en))
        times.append(float(src[j]["start"]))
    end = float(src[-1]["end"])
    # strictly increasing, so karaoke never stalls or goes backwards
    for k in range(1, n_en):
        if times[k] <= times[k - 1]:
            times[k] = times[k - 1] + 0.06
    return times, max(end, times[-1] + 0.18)


def chunk_timed(words, times, end, lo=3, hi=5):
    """2-6 words a group (typically 3-5) AND no group longer than MAX_GROUP."""
    out, cur, cur_t = [], [], []
    for w, t in zip(words, times):
        cur.append(w); cur_t.append(t)
        ends = w.rstrip().endswith((".", "?", ",", ":", "!"))
        dur = t - cur_t[0]
        if (ends and len(cur) >= lo) or len(cur) >= hi or dur >= MAX_GROUP:
            out.append((cur, cur_t)); cur, cur_t = [], []
    if cur:
        if out and len(cur) == 1 and (cur_t[0] - out[-1][1][0]) < MAX_GROUP:
            out[-1][0].extend(cur); out[-1][1].extend(cur_t)
        else:
            out.append((cur, cur_t))
    return out

def main():
    ws = json.load(open(TR))["words"]
    groups = []
    for i0, i1, english in LINES:
        en = english.split()
        times, end = word_times(ws, i0, i1, len(en))
        gs = chunk_timed(en, times, end)
        for gi, (gw, gt) in enumerate(gs):
            nxt = gs[gi + 1][1][0] if gi + 1 < len(gs) else end
            groups.append(dict(words=gw, wtimes=[round(x, 3) for x in gt],
                               start=round(gt[0], 3), end=round(min(nxt, gt[0] + 2.6), 3)))
    ds = [g["end"] - g["start"] for g in groups]
    print(f"{len(groups)} caption groups over {len(LINES)} lines; "
          f"group duration min={min(ds):.2f}s max={max(ds):.2f}s mean={sum(ds)/len(ds):.2f}s")

    groups = [g for g in groups if not suppressed(g["start"])]
    print(f"  after b-roll suppression: {len(groups)} groups")
    body, js = [], []
    for gi, g in enumerate(groups):
        y = band_for(g["start"])
        spans = "".join(
            f'<span id="g{gi}w{wi}" style="display:inline-block;margin:0 11px;color:#fff">{w}</span>'
            for wi, w in enumerate(g["words"]))
        body.append(
            f'<div id="g{gi}" class="cap" style="top:{y}px">'
            f'<div class="chip">{spans}</div></div>')
        d = g["end"] - g["start"]
        # instant pop, not a fade — the chip swaps. 0.2s so it survives a seek.
        js.append(f"tl.fromTo('#g{gi}',{{opacity:0,scale:0.94}},"
                  f"{{opacity:1,scale:1,duration:0.14,ease:'power3.out',immediateRender:false}},{g['start']:.3f});")
        js.append(f"tl.fromTo('#g{gi}',{{opacity:1}},{{opacity:0,duration:0.10,ease:'none',immediateRender:false}},"
                  f"{max(g['start']+0.16, g['end']-0.11):.3f});")
        # karaoke: exactly ONE word amber at a time, advancing through EVERY word
        n = len(g["words"])
        last_ok = g["end"] - 0.20
        for wi in range(n):
            t = min(g["wtimes"][wi], last_ok)
            js.append(f"tl.fromTo('#g{gi}w{wi}',{{color:'#ffffff'}},{{color:'{AMBER}',"
                      f"duration:0.08,ease:'none',immediateRender:false}},{t:.3f});")
            if wi > 0:
                js.append(f"tl.fromTo('#g{gi}w{wi-1}',{{color:'{AMBER}'}},{{color:'#ffffff',"
                          f"duration:0.08,ease:'none',immediateRender:false}},{t:.3f});")

    css = f"""
@font-face {{ font-family:'InterTight'; src:url('../assets/fonts/InterTight-Bold.ttf'); font-weight:700 }}
@font-face {{ font-family:'InterTight'; src:url('../assets/fonts/InterTight-ExtraBold.ttf'); font-weight:800 }}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:transparent}}
.cap{{position:absolute;left:0;width:1080px;text-align:center;opacity:0}}
.chip{{display:inline-block;background:{CHIP};border-radius:16px;padding:14px 24px;
      font-family:'InterTight';font-weight:800;font-size:54px;line-height:64px;
      max-width:960px;box-shadow:0 6px 26px rgba(0,0,0,.34)}}
"""
    html = f"""<!doctype html>
<html lang="en" data-resolution="portrait">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>{css}</style></head>
<body>
<div id="root" data-composition-id="captions" data-start="0" data-duration="70.700"
     data-width="1080" data-height="1920">
{chr(10).join(body)}
</div>
<script>
window.__timelines = window.__timelines || {{}};
const tl = gsap.timeline({{paused:true}});
{chr(10).join(js)}
window.__timelines["captions"] = tl;
</script>
</body></html>
"""
    open(OUT, "w").write(html)
    print(f"wrote {OUT} ({len(html)} bytes)")
    for g in groups[:6]:
        print(f"   {g['start']:6.2f}-{g['end']:6.2f}  y{band_for(g['start'])}  {' '.join(g['words'])}")

if __name__ == "__main__":
    main()
