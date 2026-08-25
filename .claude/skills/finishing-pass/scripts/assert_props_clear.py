#!/usr/bin/env python3
"""No foreground edge may land INSIDE a floating background prop. Measure every beat.

Why this exists
---------------
The little chart stickers behind the card have two acceptable relationships with it and one that
reads as a mistake:

    entirely clear of the card, by a real margin   -> fine, this is the reference look
    entirely behind the card, invisible            -> fine, nothing to see
    STRADDLING the card's edge                     -> broken: a sliver of sticker poking out

`flexi-cap-large-cap-disguise` draft 1 shipped four of them. The creator screenshotted one and said
it "looks weird" — correctly. The cause is structural: prop anchors are fixed fractions of the frame
while card widths vary per beat, so nothing compared the two. Measured card right edges were 1421-
1447 on nine beats (clear), 1647 on ref11/ref14/ref18 and 1682 on ref06 (straddling), and 1717-1725
on ref16/ref17 (fully behind, fine).

Note ref03 at 1622: a 2px gap. Not clear. The props DRIFT (+-3.5px x, +-5.5px y) and carry a hard
down-right shadow, so a gap under ~20px is a straddle a second later. Clearance is measured against
the prop's drifted, shadowed box, never its static one.

What NOT to do about a straddle — each of these trades the fault for a worse one:
  - do not remove the props when a card is up (her own frames carry both; background goes dead)
  - do not shrink them (size is measured off her artwork; smaller reads as noise)
  - do not move them in front of the card (decoration over data is a bigger error)
  - do not animate them out on card entry (popping is louder, and it replays every beat boundary)
  - do not push them to the frame edge (x=1728 is title-safe; the badge and lockup own the corners)
Move the prop to the nearest fully-clear spot in its own region, or drop that ONE prop for that beat.

Usage
-----
    assert_props_clear.py <job-root> [--parts DIR] [--props FILE.json] [--clearance PX]

    --props   JSON list of prop boxes in frame fractions, e.g.
              [{"name":"top-right","fx":0.848,"fy":0.150,"scale":1.00}, ...]
              Defaults to the groww-longform three. Height is 96px * scale, aspect 100:124.
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image

W, H = 1920, 1080
PROP_H = 96                 # measured sticker height at scale 1.0
ASPECT = 100 / 124          # sticker viewBox
DRIFT_X, DRIFT_Y = 3.5, 5.5  # the idle drift amplitude
SHADOW_X, SHADOW_Y = 2.2, 3.0
CLEARANCE = 24              # must exceed drift + shadow, or a clear prop straddles a second later
HIDDEN = 0.10               # below this fraction visible, the prop is behind the card: fine
CLEAR_FRAC = 0.88           # above this, fully in the open: fine. Between the two is the fault.
MIN_SIGNAL = 200            # px of prop ink needed to trust a prop's measurement at all

DEFAULT_PROPS = [
    # `alpha` mirrors tokens.ts ICONS.opacities — the props are NOT all full strength, and a check
    # that assumes they are can only see the first one.
    {'name': 'top-right', 'fx': 0.848, 'fy': 0.150, 'scale': 1.00, 'alpha': 1.00},
    {'name': 'lower-left', 'fx': 0.142, 'fy': 0.704, 'scale': 0.92, 'alpha': 0.38},
    {'name': 'lower-mid', 'fx': 0.618, 'fy': 0.700, 'scale': 0.86, 'alpha': 0.28},
]

OPAQUE = {'stat', 'chart', 'table', 'takeover', 'topic-card'}


def prop_box(p):
    """The prop's box INCLUDING drift and shadow — the only box worth testing against."""
    h = PROP_H * p.get('scale', 1.0)
    w = h * ASPECT
    x0, y0 = p['fx'] * W, p['fy'] * H
    return (int(x0 - DRIFT_X), int(y0 - DRIFT_Y),
            int(x0 + w + DRIFT_X + SHADOW_X), int(y0 + h + DRIFT_Y + SHADOW_Y))


# The prop's OWN palette (FloatingIcons.tsx): blue title bar / panel and the teal candle bodies.
# Measuring the prop rather than the card is what makes this robust. Two earlier metrics failed:
#   - a bounding box of bright pixels caught the wave highlights and returned the whole frame
#   - "how far does the card edge reach into the prop's box" called ref19 a straddle when the card
#     covered all but 3px of it, i.e. the prop was invisible and perfectly fine
# The only quantity that matters is HOW MUCH OF THE PROP IS SHOWING: none is fine (hidden), all is
# fine (clear), a fraction is the fault. And the prop's white window body cannot be used at all —
# it is the same near-white as a card cell.
PROP_INK = (
    (0x6C, 0x9F, 0xD3),   # title bar
    (0x6D, 0xAA, 0xE3),   # panel
    (0x63, 0xAA, 0x98),   # candle body
)
INK_TOL = 26


def local_ground(img, box, pad=26):
    """Median background colour in a ring outside the prop box, ignoring card fill.

    Needed because the props are drawn at THREE opacities (1.0 / 0.38 / 0.28, from tokens.ts), so
    the two dim ones are blended toward the lavender ground and never match the raw ink colours.
    The first version of this check matched raw ink only, measured 0px for `lower-mid` on every
    single beat, and skipped it as "not calibratable" — silently checking one prop out of three
    while printing a clean pass. Exactly the fault this whole gate exists to prevent.
    """
    x0, y0, x1, y1 = box
    ry0, ry1 = max(0, y0 - pad), min(H, y1 + pad)
    rx0, rx1 = max(0, x0 - pad), min(W, x1 + pad)
    ring = img[ry0:ry1, rx0:rx1].astype(int).reshape(-1, 3)
    if ring.size == 0:
        return np.array([200, 200, 225])
    mx, mn = ring.max(1), ring.min(1)
    keep = ~(((mx > 238) & ((mx - mn) < 24))                                   # card white
             | ((ring[:, 1] > 170) & ((ring[:, 1] - ring[:, 2]) > 10) & (ring[:, 0] < 190)))
    sel = ring[keep] if keep.any() else ring
    return np.median(sel, axis=0)


def prop_visible_px(img, box, alpha=1.0):
    """Pixels inside `box` showing the prop, at the opacity the prop is actually drawn with.

    Expected colour is the ink composited over the measured local ground: alpha*ink + (1-alpha)*bg.
    """
    x0, y0, x1, y1 = box
    crop = img[max(0, y0):min(H, y1), max(0, x0):min(W, x1)].astype(int)
    if crop.size == 0:
        return 0
    bg = local_ground(img, box)
    # A dim prop sits closer to the ground, so the tolerance has to tighten with it or the wave
    # texture starts matching. Scaled by alpha, floored so full opacity keeps its original window.
    tol = max(9.0, INK_TOL * alpha)
    hit = np.zeros(crop.shape[:2], bool)
    for c in PROP_INK:
        want = alpha * np.array(c) + (1 - alpha) * bg
        hit |= (np.abs(crop - want).max(2) < tol)
    return int(hit.sum())


def card_columns(img, y0, y1):
    """Columns, within the prop's rows, that are card fill — used only to report the gap.

    A column profile, not a bounding box. Prop-ink columns are excluded so the prop's own body
    cannot masquerade as the card.
    """
    band = img[max(0, y0):min(H, y1)].astype(int)
    if band.size == 0:
        return np.array([])
    mx, mn = band.max(2), band.min(2)
    white = (mx > 238) & ((mx - mn) < 24)
    teal = (band[:, :, 1] > 170) & ((band[:, :, 1] - band[:, :, 2]) > 10) & (band[:, :, 0] < 190)
    ink = np.zeros(band.shape[:2], bool)
    for c in PROP_INK:
        ink |= (np.abs(band - np.array(c)).max(2) < INK_TOL)
    solid = (white | teal) & ~ink
    return np.where(solid.mean(0) > 0.55)[0]


def frame_at(video, t, out='/tmp/_prop.png'):
    r = subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{t:.2f}', '-i', video,
                        '-frames:v', '1', out], capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(out):
        return None
    return np.array(Image.open(out).convert('RGB'))


def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                 '-of', 'csv=p=0', p], capture_output=True, text=True).stdout or 0)


def main():
    pos = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not pos:
        sys.exit(__doc__)
    job = os.path.abspath(pos[0]).rstrip('/')
    parts = (sys.argv[sys.argv.index('--parts') + 1] if '--parts' in sys.argv
             else f'{job}/graphics-build/out/parts')
    props = DEFAULT_PROPS
    if '--props' in sys.argv:
        props = json.load(open(sys.argv[sys.argv.index('--props') + 1]))
    clear = (int(sys.argv[sys.argv.index('--clearance') + 1]) if '--clearance' in sys.argv
             else CLEARANCE)

    beats = json.load(open(f'{job}/graphics-build/cutsheet.json'))
    beats = beats['beats'] if isinstance(beats, dict) else beats

    # First pass: measure each prop's visibility on every beat, so "fully visible" is calibrated
    # from this job's own renders rather than from a constant that would drift with the artwork.
    seen = {}
    for b in sorted(beats, key=lambda x: x['start']):
        if b.get('kind') not in OPAQUE or b.get('composite') == 'overlay':
            continue
        part = next((f'{parts}/{b["id"]}{e}' for e in ('.mp4', '.mov')
                     if os.path.exists(f'{parts}/{b["id"]}{e}')), None)
        if not part:
            continue
        img = frame_at(part, dur(part) * 0.6)
        seen[b['id']] = (img, {p['name']: (prop_visible_px(img, prop_box(p), p.get('alpha', 1.0)) if img is not None
                                           else None) for p in props})
    full = {p['name']: max((v[1][p['name']] or 0) for v in seen.values()) if seen else 0
            for p in props}

    bad, tight, checked = [], [], 0
    for bid, (img, vis) in seen.items():
        if img is None:
            bad.append((bid, '-', 'could not read a frame — unverifiable, treat as a failure'))
            continue
        checked += 1
        for p in props:
            x0, y0, x1, y1 = prop_box(p)
            ref = full[p['name']]
            if ref < MIN_SIGNAL:
                continue                       # reported once, loudly, after the loop
            frac = vis[p['name']] / ref
            # Calibrated against the real renders, all three verified by eye:
            #   ref17  <6%  prop entirely behind the card — invisible, correct
            #   ref16   15% top sliver pokes above the card's top edge — a real fault, and one a
            #           column-profile test misses entirely because the cut is HORIZONTAL
            #   ref06   19% / ref11 58% / ref14 56% / ref18 56% — real faults
            #   ref19/20/25 93% — fully clear in open space; 93 rather than 100 is drift phase and
            #           antialiasing, so the clear threshold must sit below it, not at 1.0
            if frac < HIDDEN:                  # hidden behind the card: nothing to see, fine
                continue
            if frac < CLEAR_FRAC:
                bad.append((bid, p['name'],
                            f'only {frac*100:.0f}% of the prop is showing — a foreground edge is '
                            f'slicing it (prop x {x0}-{x1})'))
                continue
            # Fully visible: the remaining risk is a card edge close enough that the drift eats it.
            cols = card_columns(img, y0, y1)
            if len(cols) == 0:
                continue
            cl, cr = int(cols.min()), int(cols.max())
            gap = (x0 - cr) if cr < x0 else ((cl - x1) if cl > x1 else 0)
            if 0 <= gap < clear:
                tight.append((bid, p['name'],
                              f'{gap}px between the card edge and the prop — under {clear}px, '
                              f'the drift closes it'))

    def show(rs):
        return '\n'.join(f'  {i:9s} {n:11s} {m}' for i, n, m in rs)

    if '--verbose' in sys.argv:
        print('prop visibility per beat (% of the cleanest observation):')
        for bid, (img, vis) in seen.items():
            if img is None:
                continue
            cells = '  '.join(
                f"{p['name']}={((vis[p['name']] or 0)/full[p['name']]*100 if full[p['name']] else 0):5.1f}%"
                for p in props)
            print(f'  {bid:9s} {cells}')
        print()

    weak = [p['name'] for p in props if full[p['name']] < MIN_SIGNAL]
    if weak:
        print(f'UNVERIFIED props ({len(weak)}): ' + ', '.join(weak))
        print('  Never visible enough on any beat to measure. That is NOT a pass — either they are '
              'covered on every beat (check the layout) or this detector cannot see them (check '
              'their opacity against tokens.ts ICONS.opacities).')
    if tight:
        print(f'TOO TIGHT ({len(tight)}) — clear now, straddling once the prop drifts:')
        print(show(tight))
    if bad:
        print(f'\nABORT: {len(bad)} prop/card collision(s). A foreground edge is slicing a '
              f'background prop:')
        print(show(bad))
        print('\nFix by moving the prop fully clear (>=%dpx) inside its own region, or dropping '
              'that ONE prop for that beat. Do not shrink the props, remove them all, animate them '
              'out, or move them in front of the card — see style.md.' % clear)
    if bad or weak:
        sys.exit(1)
    print(f'props clear: {checked} beats checked, no edge slices a prop'
          + (f' ({len(tight)} tight)' if tight else ''))


if __name__ == '__main__':
    main()
