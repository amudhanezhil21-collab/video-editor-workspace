#!/usr/bin/env python3
"""
Build every HyperFrames composition for daily-vs-weekly-vs-monthly-sip.

One script, shared CSS, one composition file per part. Never hand-write a graphic.

Engine rules honoured throughout (from .claude/skills/graphics/SKILL.md):
  - one master timeline, created paused, every tween at an ABSOLUTE second
  - fromTo everywhere, never a bare .to (the renderer SEEKS, it does not play)
  - no Math.random, no timers, no class-name tweens
  - never transform a <video> directly — animate a wrapper's left/top/width/height
  - no CSS blur filters, no raw emoji glyphs
  - every exit that lands on a boundary gets an explicit hard kill
  - instant state changes still get 0.2-0.35s so they survive a seek
"""
import json, os, sys

OUT = "/Volumes/vedev/graphics-build/dwm-sip/dwm/compositions"
FPS = 30

# ---------------------------------------------------------------- brand tokens
# Values come from brand.md. Never invent a colour here.
T = dict(
    accent="#00D09C", indigo="#5367FC", amber="#FCB31C", coral="#F26B55",
    mint="#67F9C8", ink="#44475B", muted="#B1B4B7", rule_strong="#CCCFD1",
    rule="#ECEDEE", bg="#F9FAFA", white="#FFFFFF", paper="#F3F2F0",
    subscribe_red="#FF333F",
)

# ------------------------------------------------------------------ beat times
# All from transcript/transcript.json (forced-aligned). Absolute seconds.
BEATS = {
    "p2": (3.32, 7.18), "p3": (9.24, 42.77), "p4": (42.77, 52.20),
    "p5": (52.20, 58.90), "p6": (58.90, 64.28), "p7": (64.28, 70.67),
}
TAIL = 0.5   # every part outlasts its window

CSS = f"""
@font-face {{ font-family:'InterTight'; src:url('../assets/fonts/InterTight-Regular.ttf'); font-weight:400 }}
@font-face {{ font-family:'InterTight'; src:url('../assets/fonts/InterTight-Medium.ttf'); font-weight:500 }}
@font-face {{ font-family:'InterTight'; src:url('../assets/fonts/InterTight-SemiBold.ttf'); font-weight:600 }}
@font-face {{ font-family:'InterTight'; src:url('../assets/fonts/InterTight-Bold.ttf'); font-weight:700 }}
@font-face {{ font-family:'InterTight'; src:url('../assets/fonts/InterTight-ExtraBold.ttf'); font-weight:800 }}
@font-face {{ font-family:'InterTight'; src:url('../assets/fonts/InterTight-Black.ttf'); font-weight:900 }}
@font-face {{ font-family:'IvyPresto'; src:url('../assets/fonts/Ivy-Presto-Display-Semi-Bold.otf'); font-weight:600 }}
@font-face {{ font-family:'IvyPresto'; src:url('../assets/fonts/Ivy-Presto-Display-.otf'); font-weight:400 }}

*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:transparent}}
body{{font-family:'InterTight',sans-serif;-webkit-font-smoothing:antialiased}}

.ground{{position:absolute;inset:0;background-image:url('../assets/img/gradient-ground.png');
        background-size:1080px 1920px;opacity:0}}

/* brand.md: shadow-soft on gradient/footage, down-right, blur scales with element */
.sh-soft{{box-shadow:10px 14px 42px rgba(0,0,0,.22)}}
.sh-soft-lg{{box-shadow:14px 18px 64px rgba(0,0,0,.26)}}

/* face mask — square, rounded, drop shadow (creator's reference frame) */
.mask{{position:absolute;overflow:hidden;border-radius:44px;opacity:0}}
.mask video{{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover}}

.card{{position:absolute;background:{T['white']};border-radius:40px;opacity:0}}

/* table */
.tbl{{position:absolute;width:100%;border-collapse:separate;border-spacing:0}}
.tbl th,.tbl td{{font-family:'InterTight';text-align:center;vertical-align:middle}}
.hcell{{background:{T['indigo']};color:#fff;font-weight:800;font-size:30px;letter-spacing:.2px;
       text-align:center;opacity:0}}
.rlabel{{text-align:left !important;color:{T['ink']};font-weight:600;font-size:29px;padding-left:26px;opacity:0}}
.val{{color:{T['ink']};font-weight:700;font-size:30px;text-align:center;white-space:nowrap;opacity:0}}
.val-strong{{font-weight:800;font-size:30px}}
.gridline{{position:absolute;background:{T['rule']};opacity:0}}
.gridline-s{{position:absolute;background:{T['rule_strong']}}}

/* one amber marker sweep, left->right, per spoken claim */
.sweep{{position:absolute;background:{T['amber']};opacity:0;border-radius:8px;transform-origin:left center}}

.src{{position:absolute;font-family:'InterTight';font-weight:700;font-size:27px;color:{T['ink']};opacity:0}}

/* chrome */
.badge{{position:absolute;left:15px;top:39px;height:120px;opacity:1}}
.wordmark{{position:absolute;right:29px;top:47px;height:102px;opacity:1}}

/* bottom gradient — cosine falloff to TRUE zero, never a linear ramp with a visible edge */
/* Measured off the creator's reference (youtu.be/2ndjrtVgrOY @42s): the scrim reaches ~0.94 alpha
   at the frame edge and feathers to TRUE zero over ~48% of the frame height — a long falloff, never
   a short one. The inward-facing edge must never be findable. */
.botgrad{{position:absolute;left:0;right:0;bottom:0;height:920px;pointer-events:none;opacity:0}}
/* ...and the scrim is not flat: faint wavy light streaks drift through it, which is what makes
   overlaid type pop. Measured: contrast std 6.6 luma, drift ~20px/s. */
.streaks{{position:absolute;left:0;right:0;bottom:0;height:920px;pointer-events:none;opacity:0;
         background-image:url('../assets/img/scrim-streaks.png');
         background-size:2160px 920px;background-repeat:repeat-x;background-position:0px 0px}}

.title-serif{{position:absolute;font-family:'IvyPresto';font-weight:600;color:{T['indigo']};
             text-align:center;width:100%;line-height:1.06;font-style:italic;opacity:0;
             text-shadow:8px 11px 26px rgba(20,22,34,.30)}}
"""

# cosine falloff to true zero — the style file's "thumb rule for every video"
def cosine_grad(rgba, stops=24, peak=0.90):
    parts = []
    for i in range(stops + 1):
        p = i / stops
        import math
        a = peak * (0.5 * (1 + math.cos(math.pi * p)))  # peak at bottom -> true 0 at top
        parts.append(f"rgba({rgba},{a:.4f}) {100*p:.1f}%")
    return "linear-gradient(to top, " + ", ".join(parts) + ")"


def doc(cid, dur, body, script, extra_css=""):
    return f"""<!doctype html>
<html lang="en" data-resolution="portrait">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>{CSS}{extra_css}</style></head>
<body>
<div id="root" data-composition-id="{cid}" data-start="0" data-duration="{dur:.3f}"
     data-width="1080" data-height="1920">
{body}
</div>
<script>
window.__timelines = window.__timelines || {{}};
const tl = gsap.timeline({{paused:true}});
{script}
window.__timelines["{cid}"] = tl;
</script>
</body></html>
"""

# ============================================================ p3 — the table
def build_p3():
    """
    The table is a faithful rebuild of the creator's own script table (assets/harvest/maindoc-img1.png)
    in brand colours: a SOLID header band (not floating pills), light row rules, a strong rule above
    % XIRR, and a tinted band behind that row.

    Round 1 review caught the row/column grids being invisible: they were drawn in $rule #ECEDEE on a
    #FFFFFF card, which measures luma 252 vs 251 — one unit apart. Separators use $rule-strong.
    """
    s, e = BEATS["p3"]; dur = e - s + TAIL
    MASK = dict(x=350, y=212, w=380, h=380)
    CARD = dict(x=60, y=640, w=960, h=690)
    HDRH = 104
    PADX = 24
    COL0 = 270
    BODY_Y = CARD["y"] + HDRH
    COLW = (CARD["w"] - 2*PADX - COL0) // 3   # 214 exactly — no fractional pixels
    COLX = CARD["x"] + PADX + COL0
    ROWH = 142
    rows = [
        ("SIP Instalment Amount", ["\u20b91,000", "\u20b96,997", "\u20b930,384"], False),
        ("Total Amount Invested", ["\u20b9109.08 Lac", "\u20b9109.08 Lac", "\u20b9109.08 Lac"], False),
        ("Current Valuation",     ["\u20b912.33 Crore", "\u20b912.33 Crore", "\u20b912.45 Crore"], True),
        ("% XIRR",                ["13.47%", "13.47%", "13.47%"], True),
    ]
    b = ['<div class="ground" style="opacity:1"></div>']
    b.append(f'''<div id="mask" class="mask sh-soft" style="left:{MASK['x']}px;top:{MASK['y']}px;
      width:{MASK['w']}px;height:{MASK['h']}px">
      <video src="../assets/media/face-mask.mp4" data-start="0" data-media-start="{s:.3f}" muted></video></div>''')
    b.append(f'''<div id="card" class="card sh-soft-lg" style="left:{CARD['x']}px;top:{CARD['y']}px;
      width:{CARD['w']}px;height:{CARD['h']}px"></div>''')
    # tinted band behind the % XIRR row (the script table has one)
    xirr_y = BODY_Y + 3*ROWH
    b.append(f'<div id="xband" style="position:absolute;left:{CARD["x"]}px;top:{xirr_y}px;'
             f'width:{CARD["w"]}px;height:{ROWH}px;background:{T["rule"]};opacity:0"></div>')
    # SOLID indigo header band, top corners matching the card
    b.append(f'<div id="hdr" style="position:absolute;left:{CARD["x"]}px;top:{CARD["y"]}px;'
             f'width:{CARD["w"]}px;height:{HDRH}px;background:{T["indigo"]};'
             f'border-radius:40px 40px 0 0;opacity:0;transform-origin:left center"></div>')
    b.append(f'<div id="h0" style="position:absolute;left:{CARD["x"]+PADX}px;top:{CARD["y"]+HDRH/2-19}px;'
             f'width:{COL0}px;font-size:27px;color:#fff;font-weight:700;opacity:0">SIP Frequency</div>')
    for i, name in enumerate(["DAILY", "WEEKLY", "MONTHLY"]):
        x = COLX + i*COLW
        b.append(f'<div id="hc{i}" class="hcell" style="position:absolute;left:{x:.0f}px;'
                 f'top:{CARD["y"]+HDRH/2-20}px;width:{COLW:.0f}px">{name}</div>')
    # row rules: light between rows, STRONG above % XIRR (as in the script table)
    RULE = 3                                   # ONE weight for every rule in the table
    for r in range(1, 4):
        y = BODY_Y + r*ROWH
        b.append(f'<div class="gridline" id="gl{r}" style="left:{CARD["x"]}px;top:{y}px;'
                 f'width:{CARD["w"]}px;height:{RULE}px;background:{T["rule_strong"]}"></div>')
    b.append(f'<div class="gridline" id="glb" style="left:{CARD["x"]}px;top:{xirr_y+ROWH}px;'
             f'width:{CARD["w"]}px;height:{RULE}px;background:{T["rule_strong"]}"></div>')
    # column separators — $rule-strong knocked back so they read as grid, not as borders
    for i in range(1, 3):
        x = COLX + i*COLW
        b.append(f'<div class="gridline" id="cs{i}" style="left:{x:.0f}px;top:{BODY_Y}px;'
                 f'width:{RULE}px;height:{4*ROWH}px;background:{T["rule_strong"]};opacity:0"></div>')
    for r, (label, vals, strong) in enumerate(rows):
        ry = BODY_Y + r*ROWH
        b.append(f'<div id="rl{r}" class="rlabel" style="position:absolute;left:{CARD["x"]+PADX}px;'
                 f'top:{ry+ROWH/2-19}px;width:{COL0}px;font-size:25px;'
                 f'{"font-weight:800;" if strong else ""}padding-left:0">{label}</div>')
        for c, v in enumerate(vals):
            x = COLX + c*COLW
            cls = "val val-strong" if strong else "val"
            b.append(f'<div id="sw{r}{c}" class="sweep" style="left:{x+14:.0f}px;top:{ry+ROWH/2-32}px;'
                     f'width:{COLW-28:.0f}px;height:62px"></div>')
            b.append(f'<div id="c{r}{c}" class="{cls}" style="position:absolute;left:{x:.0f}px;'
                     f'top:{ry+ROWH/2-22}px;width:{COLW:.0f}px">{v}</div>')
    b.append(f'<div id="src" class="src" style="left:{CARD["x"]+9}px;top:{CARD["y"]+CARD["h"]+26}px">'
             f'Source: Whiteoak Capital</div>')

    def L(t): return round(t - s, 3)
    js = ["const E='power3.out';"]

    js.append(f"tl.fromTo('#mask',{{y:-140,opacity:0,scale:0.86}},"
              f"{{y:0,opacity:1,scale:1,duration:0.46,ease:E,immediateRender:false}},0.06);")
    js.append(f"tl.fromTo('#card',{{y:130,opacity:0,scale:0.90}},"
              f"{{y:0,opacity:1,scale:1,duration:0.48,ease:E,immediateRender:false}},{L(10.40)});")
    js.append(f"tl.fromTo('#hdr',{{scaleX:0,opacity:0}},{{scaleX:1,opacity:1,duration:0.46,"
              f"ease:E,immediateRender:false}},{L(11.20)});")
    for i in range(3):
        js.append(f"tl.fromTo('#hc{i}',{{opacity:0,y:-14}},{{opacity:1,y:0,duration:0.34,"
                  f"ease:E,immediateRender:false}},{L(11.42)+i*0.11:.3f});")
    js.append(f"tl.fromTo('#h0',{{opacity:0,x:-24}},{{opacity:1,x:0,duration:0.34,ease:E,immediateRender:false}},{L(11.32)});")
    for r in range(1, 4):
        js.append(f"tl.fromTo('#gl{r}',{{scaleX:0,opacity:0,transformOrigin:'left center'}},"
                  f"{{scaleX:1,opacity:1,duration:0.40,ease:E,immediateRender:false}},{L(11.60)+r*0.08:.3f});")
    js.append(f"tl.fromTo('#glb',{{scaleX:0,opacity:0,transformOrigin:'left center'}},"
              f"{{scaleX:1,opacity:1,duration:0.40,ease:E,immediateRender:false}},{L(11.90)});")
    for i in (1, 2):
        js.append(f"tl.fromTo('#cs{i}',{{scaleY:0,opacity:0,transformOrigin:'top center'}},"
                  f"{{scaleY:1,opacity:1,duration:0.45,ease:E,immediateRender:false}},{L(11.84)+i*0.08:.3f});")
    js.append(f"tl.fromTo('#xband',{{opacity:0}},{{opacity:1,duration:0.34,ease:'none',immediateRender:false}},{L(11.90)});")
    js.append(f"tl.fromTo('#src',{{opacity:0}},{{opacity:0.72,duration:0.30,ease:'none',immediateRender:false}},{L(12.90)});")

    row_in = {0: 11.98, 1: 12.16, 2: 12.34, 3: 12.52}      # all four rows land in the build
    for r, t0 in row_in.items():
        js.append(f"tl.fromTo('#rl{r}',{{opacity:0,x:-20}},{{opacity:1,x:0,duration:0.34,ease:E,immediateRender:false}},{L(t0)});")
    # every value is on screen by 12.86s — well before the first VO highlight at 13.98
    cell_in = {}
    for r in range(4):
        for c in range(3):
            cell_in[(r, c)] = round(12.06 + r*0.18 + c*0.06, 3)
    for (r,c), t0 in cell_in.items():
        js.append(f"tl.fromTo('#c{r}{c}',{{opacity:0,y:16}},{{opacity:1,y:0,duration:0.32,ease:E,immediateRender:false}},{L(t0)});")
    # Highlights land on the spoken word. Round 1 review: the XIRR row lit at 42.29 ("13.47%") gave
    # only 0.1s of read time before the beat's light leak, while the monthly valuation stayed lit
    # through the whole XIRR sentence. The XIRR claim starts at "XIRR" (39.85), so it lights there.
    sweeps = {
        (1,0):13.98,(1,1):14.20,(1,2):14.42,
        (0,0):17.93,(2,0):21.11,
        (0,1):24.15,(2,1):27.05,
        (0,2):31.17,(2,2):36.23,
        (3,0):39.85,(3,1):39.98,(3,2):40.11,
    }
    for (r,c), t0 in sweeps.items():
        js.append(f"tl.fromTo('#sw{r}{c}',{{scaleX:0,opacity:0}},"
                  f"{{scaleX:1,opacity:0.42,duration:0.30,ease:'power2.out',immediateRender:false}},{L(t0)});")
    fade = {(1,0):17.10,(1,1):17.10,(1,2):17.10,
            (0,0):20.85, (2,0):23.30,
            (0,1):26.80, (2,1):30.70,
            (0,2):35.95, (2,2):39.60}
    for (r,c), t0 in fade.items():
        js.append(f"tl.fromTo('#sw{r}{c}',{{opacity:0.42}},{{opacity:0,duration:0.28,ease:'none',immediateRender:false}},{L(t0)});")
    # NO exit animation: the light leak at 42.77 is the whole transition. The table holds at full
    # strength through the last word of "...13.47%" (42.69) and the leak takes the cut.

    return doc("p3-table", dur, "\n".join(b), "\n".join(js))


# ==================================================== p4 / p6 — keyed AI b-roll
def build_broll(pid, media, beat, headline=None, sub=None):
    s, e = BEATS[beat]; dur = e - s + TAIL
    b = [f'<div class="ground" style="opacity:1"></div>']
    b.append(f'''<div id="clipwrap" style="position:absolute;left:0;top:0;width:1080px;height:1920px;
      overflow:hidden;opacity:1"><video id="clip" src="../assets/media/{media}" data-start="0" muted
      style="position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover"></video></div>''')
    if headline:
        b.append(f'<div id="hl" class="title-serif" style="top:246px;font-size:118px">{headline}</div>')
    if sub:
        b.append(f'<div id="sub" style="position:absolute;top:{262+150}px;width:100%;text-align:center;'
                 f'font-weight:700;font-size:42px;color:{T["ink"]};opacity:.86">{sub}</div>')
    js = ["const E='power3.out';",
          "tl.fromTo('#clipwrap',{scale:1.06},{scale:1,duration:0.34,ease:E,immediateRender:false},0.0);"]
    if headline:
        js.append("tl.fromTo('#hl',{opacity:0,y:-34},{opacity:1,y:0,duration:0.46,ease:E,immediateRender:false},0.30);")
    if sub:
        js.append("tl.fromTo('#sub',{opacity:0,y:20},{opacity:1,y:0,duration:0.40,ease:E,immediateRender:false},0.62);")
    # NO exit: a light leak sits on this beat's out-point and IS the transition.
    return doc(pid, dur, "\n".join(b), "\n".join(js))


# ============================================ p5 — full-screen motion graphic
def build_p5():
    s, e = BEATS["p5"]; dur = e - s + TAIL
    b = [f'<div class="ground" style="opacity:1"></div>']
    b.append('<div id="ttl" class="title-serif" style="top:206px;font-size:132px">'
             'Forget the<br/>frequency</div>')
    # contact shadow: a radial ellipse div, NOT a CSS filter — drop-shadow() is a filter and
    # filters are not render-safe in HyperFrames (they silently do not render).
    b.append('''<div id="hgsh" style="position:absolute;left:340px;top:1252px;width:400px;height:104px;
      background:radial-gradient(ellipse at center, rgba(20,22,34,.34) 0%, rgba(20,22,34,.18) 42%,
      rgba(20,22,34,0) 72%);opacity:0"></div>''')
    # The hero occupies only x262-811 / y234-1705 of its 1080x1920 source (measured off the keyed
    # alpha). Sizing the wrapper to the FULL source aspect and offsetting it puts the hourglass
    # itself at y520-1420 without a re-encode and without distorting it.
    b.append(f'''<div id="hgwrap" style="position:absolute;left:259px;top:398px;width:565px;height:1005px;
      overflow:visible;opacity:0"><video id="hg" src="../assets/media/b5-hourglass.webm" muted data-start="0"
      style="position:absolute;left:0;top:0;width:565px;height:1005px"></video></div>''')
    # two supporting pills enter in VO order — "discipline" then "long term". Inside the safe zone.
    for i,(txt,x) in enumerate([("Discipline", 116),("Long term", 606)]):
        b.append(f'<div id="pill{i}" style="position:absolute;left:{x}px;top:1496px;padding:26px 52px;'
                 f'background:{T["indigo"]};color:#fff;font-weight:800;font-size:54px;border-radius:999px;opacity:0;'
                 f'box-shadow:10px 14px 34px rgba(0,0,0,.22)">{txt}</div>')
    def L(t): return round(t - s, 3)
    js = ["const E='power3.out';",
          f"tl.fromTo('#ttl',{{opacity:0,y:-40,scale:0.94}},{{opacity:1,y:0,scale:1,duration:0.52,ease:E,immediateRender:false}},{L(52.30)});",
          f"tl.fromTo('#hgwrap',{{opacity:0,scale:0.88}},{{opacity:1,scale:1,duration:0.54,ease:E,immediateRender:false}},{L(52.75)});",
          f"tl.fromTo('#hgsh',{{opacity:0,scaleX:0.6}},{{opacity:1,scaleX:1,duration:0.54,ease:E,immediateRender:false}},{L(52.78)});",
          # pills land on the spoken words: "discipline" 55.02, "long term investing" 56.28
          f"tl.fromTo('#pill0',{{opacity:0,x:-70}},{{opacity:1,x:0,duration:0.42,ease:E,immediateRender:false}},{L(55.02)});",
          f"tl.fromTo('#pill1',{{opacity:0,x:70}},{{opacity:1,x:0,duration:0.42,ease:E,immediateRender:false}},{L(56.28)});"]
    # NO exit: the 58.90 light leak is the transition.
    return doc("p5-lesson", dur, "\n".join(b), "\n".join(js))


# ================================================= p2 — gold coin bags overlay
def build_p2():
    s, e = BEATS["p2"]; dur = e - s + TAIL
    grad = cosine_grad("14,16,26")
    b = [f'<div id="bg" class="botgrad" style="background:{grad};opacity:0"></div>']
    # The settled bags occupy x6-1077 / y1002-1571 of their 1080x1920 source (measured off the keyed
    # alpha) — i.e. the FULL frame width. Round-1 review: at 1:1 they dominated the frame and covered
    # her torso. Scaled to 0.747 and offset, they read as a bottom-band element rising into frame.
    b.append(f'''<div id="bagwrap" style="position:absolute;left:0;top:0;width:1080px;height:1920px;
      overflow:hidden;opacity:0"><video id="bags" src="../assets/media/b2-coin-bags.webm" data-start="0" muted
      style="position:absolute;left:135px;top:582px;width:807px;height:1434px"></video></div>''')
    js = ["const E='power3.out';",
          "tl.fromTo('#bg',{opacity:0},{opacity:1,duration:0.50,ease:'power2.out',immediateRender:false},0.02);",
          "tl.fromTo('#bgstreaks',{opacity:0},{opacity:1,duration:0.50,ease:'power2.out',immediateRender:false},0.02);",
          "tl.fromTo('#bgstreaks',{backgroundPositionX:'0px'},{backgroundPositionX:'-98px',duration:4.9,ease:'none',immediateRender:false},0.0);",
          # the clip already rises; the wrapper only fades so nothing double-moves
          "tl.fromTo('#bagwrap',{opacity:0},{opacity:1,duration:0.30,ease:E,immediateRender:false},0.06);"]
    ex = dur - TAIL - 0.32
    js.append(f"tl.fromTo('#bagwrap',{{opacity:1,y:0}},{{opacity:0,y:130,duration:0.32,ease:'power2.in',immediateRender:false}},{ex:.3f});")
    js.append(f"tl.fromTo('#bg',{{opacity:1}},{{opacity:0,duration:0.50,ease:'power2.in',immediateRender:false}},{ex-0.20:.3f});")
    js.append(f"tl.fromTo('#bgstreaks',{{opacity:1}},{{opacity:0,duration:0.50,ease:'power2.in',immediateRender:false}},{ex-0.20:.3f});")
    return doc("p2-coinbags", dur, "\n".join(b), "\n".join(js))


# ============================================== p7 — outro: subscribe + like
def build_p7():
    s, e = BEATS["p7"]; dur = e - s + TAIL
    grad = cosine_grad("14,16,26")
    b = [f'<div id="bg" class="botgrad" style="background:{grad};opacity:0"></div>',
         '<div id="bgstreaks" class="streaks"></div>']
    b.append(f'''<div id="subpill" style="position:absolute;left:150px;top:1508px;width:430px;height:118px;
      background:{T['subscribe_red']};border-radius:999px;color:#fff;font-weight:800;font-size:46px;
      text-align:center;line-height:118px;letter-spacing:.6px;opacity:0;
      box-shadow:10px 14px 36px rgba(0,0,0,.28)">SUBSCRIBE</div>''')
    b.append(f'''<div id="likepill" style="position:absolute;left:614px;top:1508px;width:316px;height:118px;
      background:{T['white']};border-radius:999px;color:{T['ink']};font-weight:800;font-size:46px;
      text-align:center;line-height:118px;opacity:0;box-shadow:10px 14px 36px rgba(0,0,0,.24)">LIKE</div>''')

    def L(t): return round(t - s, 3)
    js = ["const E='back.out(1.6)';",
          f"tl.fromTo('#bg',{{opacity:0}},{{opacity:1,duration:0.55,ease:'power2.out',immediateRender:false}},{L(64.36)});",
          f"tl.fromTo('#bgstreaks',{{opacity:0}},{{opacity:1,duration:0.55,ease:'power2.out',immediateRender:false}},{L(64.36)});",
          f"tl.fromTo('#bgstreaks',{{backgroundPositionX:'0px'}},{{backgroundPositionX:'-128px',duration:6.4,ease:'none',immediateRender:false}},{L(64.30)});",

          # "coming and going" — they arrive, hold, leave, and the second pair arrives late
          f"tl.fromTo('#subpill',{{opacity:0,y:150,scale:0.8}},{{opacity:1,y:0,scale:1,duration:0.52,ease:E,immediateRender:false}},{L(65.10)});",
          f"tl.fromTo('#likepill',{{opacity:0,y:150,scale:0.8}},{{opacity:1,y:0,scale:1,duration:0.52,ease:E,immediateRender:false}},{L(65.42)});",
          f"tl.fromTo('#subpill',{{y:0,opacity:1}},{{y:150,opacity:0,duration:0.36,ease:'power2.in',immediateRender:false}},{L(67.05)});",
          f"tl.fromTo('#likepill',{{y:0,opacity:1}},{{y:150,opacity:0,duration:0.36,ease:'power2.in',immediateRender:false}},{L(67.20)});",
          f"tl.fromTo('#subpill',{{opacity:0,y:150,scale:0.8}},{{opacity:1,y:0,scale:1,duration:0.50,ease:E,immediateRender:false}},{L(68.60)});",
          f"tl.fromTo('#likepill',{{opacity:0,y:150,scale:0.8}},{{opacity:1,y:0,scale:1,duration:0.50,ease:E,immediateRender:false}},{L(68.86)});"]
    # the gradient dissolves out too — a black band that simply stops reads as abrupt
    js.append(f"tl.fromTo('#bg',{{opacity:1}},{{opacity:0,duration:0.55,ease:'power2.in',immediateRender:false}},{L(69.95)});")
    js.append(f"tl.fromTo('#bgstreaks',{{opacity:1}},{{opacity:0,duration:0.55,ease:'power2.in',immediateRender:false}},{L(69.95)});")
    # ends COLD on the footage — no fade to black.

    return doc("p7-outro", dur, "\n".join(b), "\n".join(js))


# ================================================== chrome — every single frame
def build_chrome():
    dur = 71.60      # outlast the base so the assemble can never drop its final frame
    b = ['<img id="badge" class="badge" src="../assets/img/groww-shorts-badge-shadow.png"/>',
         '<img id="wm" class="wordmark" src="../assets/img/groww-capsule-shadow.png"/>']
    # knock back over the light data-card layouts so they don't compete (style.md)
    js = [
          # p3 table window: knock to 35%
          "tl.fromTo('#badge',{opacity:1},{opacity:0.28,duration:0.3,ease:'none',immediateRender:false},9.42);",
          "tl.fromTo('#wm',{opacity:1},{opacity:0.28,duration:0.3,ease:'none',immediateRender:false},9.42);",
          "tl.fromTo('#badge',{opacity:0.28},{opacity:1,duration:0.3,ease:'none',immediateRender:false},42.77);",
          "tl.fromTo('#wm',{opacity:0.28},{opacity:1,duration:0.3,ease:'none',immediateRender:false},42.77);"]
    return doc("chrome", dur, "\n".join(b), "\n".join(js))


def build_sebi():
    dur = 4.0
    b = [f'''<div id="sebi" style="position:absolute;left:78px;top:1496px;max-width:640px;
      background:rgba(255,255,255,.92);border-radius:16px;padding:20px 26px;
      font-size:24px;line-height:1.35;font-weight:600;color:{T['ink']};opacity:0;
      box-shadow:8px 10px 26px rgba(0,0,0,.20)">
      Groww Invest Tech Pvt. Ltd. (formerly Nextbillion Technology Pvt. Ltd.)<br/>
      SEBI Research Analyst Reg. No. INH000015818</div>''']
    js = ["tl.fromTo('#sebi',{opacity:0,x:-40},{opacity:1,x:0,duration:0.44,ease:'power3.out',immediateRender:false},0.25);",
          "tl.fromTo('#sebi',{opacity:1,x:0},{opacity:0,x:-40,duration:0.36,ease:'power2.in',immediateRender:false},3.30);"]
    return doc("sebi", dur, "\n".join(b), "\n".join(js))


PARTS = {
    "p2-coinbags": build_p2,
    "p3-table":    build_p3,
    "p4-broll":    lambda: build_broll("p4-broll", "b4-three-people.webm", "p4"),
    "p5-lesson":   build_p5,
    "p6-broll":    lambda: build_broll("p6-broll", "b6-thumbs-up.webm", "p6"),
    "p7-outro":    build_p7,
    "chrome":      build_chrome,
    "sebi":        build_sebi,
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    only = sys.argv[1:] or list(PARTS)
    for name in only:
        html = PARTS[name]()
        p = os.path.join(OUT, f"{name}.html")
        open(p, "w").write(html)
        print(f"  wrote {p}  ({len(html)} bytes)")
