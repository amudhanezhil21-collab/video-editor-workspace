#!/usr/bin/env python3
"""A table is BUILT, never pasted. Detect source bitmaps that are really tables.

Why this exists
---------------
`flexi-cap-large-cap-disguise` draft 1 shipped two beats where the creator's own spreadsheet
screenshot was dropped straight onto the card — foreign font, spreadsheet gridlines, pale grid
cells bleeding past the data — sitting a few beats away from properly built brand tables with teal
headers, amber highlights and a source line. She spotted it immediately: "instead of table being
generated, just the image from script was put as it is."

The excuse in the code was that one of them held 18 rows and would be unreadable rebuilt at 31px a
row. That excuse was already answered by her own earlier directive, which nobody connected to it:

    "use ivy presto, let them land as two stacked halves rather than one 13 row card"

**A long table splits into stacked halves. It does not become a screenshot.**

What this does NOT ban
----------------------
Genuinely non-tabular source visuals — a news headline, an app UI, a photograph, a real chart image
— are legitimate as images, in a designed brand card with their source line. Banning those outright
would be a worse rule than the fault it fixes. So this measures the CONTENT rather than policing the
category: a bitmap with a regular grid of rules is a table and must be rebuilt; anything else passes.

Detection: a table has long straight rules. For each row, count the columns where the vertical
gradient exceeds a threshold; a rule spans most of the width. Same by column. Three or more
horizontal rules plus two or more vertical rules is a table. Verified on the real assets:

    mirae-industries.png   24 h-rules,  4 v-rules  -> TABLE
    over70-allocation.png  14 h-rules,  6 v-rules  -> TABLE
    amfi-inflows.png       13 h-rules, 10 v-rules  -> TABLE
    a talking-head frame    0 h-rules,  0 v-rules  -> not a table
    an AI b-roll frame      0 h-rules,  0 v-rules  -> not a table

Run it only on SOURCE BITMAPS, never on rendered frames. A built brand table measures 9 h-rules and
0 v-rules, because its rules are carried by alpha rather than by hard black lines — which is a fine
way to tell the two apart by eye, but not something to depend on as a test.

Usage
-----
    assert_no_pasted_tables.py <job-root> [--images FILE ...] [--verbose]

Beats declare an image in the cutsheet — `"render": "image", "image_src": "src/foo.png"` — never in
a map inside the composition, where no check can see it.
"""
import json
import os
import sys

import numpy as np
from PIL import Image

EDGE = 26          # gradient step that counts as a rule pixel
SPAN = 0.60        # a rule must run this fraction of the width/height
MIN_H, MIN_V = 3, 2


def rules(gray, axis):
    """Count long straight rules along an axis. axis=0 -> horizontal rules, 1 -> vertical."""
    g = gray if axis == 0 else gray.T
    d = np.abs(np.diff(g.astype(int), axis=0))          # step between adjacent rows
    span = (d > EDGE).mean(axis=1)                      # fraction of the width that steps
    hits = np.where(span > SPAN)[0]
    # collapse adjacent indices: a 2px rule reads as two lines otherwise
    return sum(1 for i, h in enumerate(hits) if i == 0 or h - hits[i - 1] > 2)


def looks_like_table(path):
    im = Image.open(path).convert('L')
    g = np.array(im)
    h, v = rules(g, 0), rules(g, 1)
    return (h >= MIN_H and v >= MIN_V), h, v


def main():
    pos = [a for a in sys.argv[1:] if not a.startswith('--')]
    verbose = '--verbose' in sys.argv
    if '--images' in sys.argv:
        imgs = [(os.path.basename(p), p) for p in sys.argv[sys.argv.index('--images') + 1:]
                if not p.startswith('--')]
        bad = []
        for name, p in imgs:
            t, h, v = looks_like_table(p)
            print(f'  {name:28s} {h:3d} h-rules {v:3d} v-rules  '
                  f'{"TABLE — must be rebuilt" if t else "not a table"}')
            if t:
                bad.append(name)
        sys.exit(1 if bad else 0)

    if not pos:
        sys.exit(__doc__)
    job = os.path.abspath(pos[0]).rstrip('/')
    beats = json.load(open(f'{job}/graphics-build/cutsheet.json'))
    beats = beats['beats'] if isinstance(beats, dict) else beats
    pub = f'{job}/graphics-build/remotion/public'

    pasted, undeclared, ok = [], [], 0
    for b in sorted(beats, key=lambda x: x['start']):
        if b.get('render') != 'image':
            continue
        src = b.get('image_src')
        if not src:
            undeclared.append((b['id'], 'render=image with no image_src — cannot verify'))
            continue
        p = f'{pub}/{src}'
        if not os.path.exists(p):
            undeclared.append((b['id'], f'image_src {src} not found'))
            continue
        t, h, v = looks_like_table(p)
        if verbose:
            print(f'  {b["id"]:9s} {os.path.basename(src):26s} {h:3d} h-rules {v:3d} v-rules')
        if t:
            pasted.append((b['id'], f'{os.path.basename(src)} is a TABLE ({h} rows x {v} cols of '
                                    f'rules) pasted as a bitmap'))
        else:
            ok += 1
    if verbose:
        print()
    if undeclared:
        print(f'UNVERIFIABLE ({len(undeclared)}):')
        print('\n'.join(f'  {i:9s} {m}' for i, m in undeclared))
    if pasted:
        print(f'ABORT: {len(pasted)} beat(s) paste a TABLE as a source bitmap instead of building '
              f'it:')
        print('\n'.join(f'  {i:9s} {m}' for i, m in pasted))
        print('\nRebuild each as a brand table: tokens, teal header (or headerless if only one '
              'column would carry a heading), amber highlights driven off the transcript, source '
              'line beneath. If it is too long for one card, land it as TWO STACKED HALVES — the '
              'creator\'s own directive — never as a screenshot.')
    if pasted or undeclared:
        sys.exit(1)
    print(f'no pasted tables: {ok} source image(s) checked, none are tables')


if __name__ == '__main__':
    main()
