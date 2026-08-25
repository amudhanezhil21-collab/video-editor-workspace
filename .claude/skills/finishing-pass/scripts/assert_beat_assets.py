#!/usr/bin/env python3
"""Preflight: every beat that owes an asset has one. Run BEFORE the assembler encodes anything.

Why this exists
---------------
An assembler routes each beat through an if/elif chain, and the branches are naturally written as
"is this kind of beat AND is its asset there?":

    if   kind in SEGMENT and part:                  ...   # rendered graphic replaces the frame
    elif bid in BROLL and os.path.exists(clip):     ...   # b-roll clip replaces the frame
    elif kind == 'transition' and exists(TRANS):    ...
    else:                                           ...   # plain footage

That shape makes a MISSING FILE indistinguishable from "this beat is meant to be plain footage".
The beat falls to the `else`, the piece encodes cleanly, the runtime is exactly right, the
duplicate-frame gate passes, and the render looks finished. Nothing to notice.

flexi-cap-large-cap-disguise, draft 1 (2026-08-24): three finished AI b-roll clips shipped
completely unused. The clips were at `broll/b02-shop-crowd.mp4`; the branch tested
`render/ref02-broll.mp4` — a name no build ever produced. Three beats, 21 seconds, silently became
plain talking head. The creator found it, not the review loop.

So: a missing asset ABORTS. It never degrades. Exit 1 and name the beats.

Usage
-----
    assert_beat_assets.py <job-root> [--pieces] [--assembler PATH]

    --pieces      also report cached pieces that are stale (older than their asset or the
                  assembler script). A stale piece makes a real fix look like a no-op.
    --assembler   assembler script whose mtime invalidates pieces (default graphics-build/assemble.py)

Convention it checks (override with graphics-build/assets.json — see below)
    graphics-build/cutsheet.json          the beat list
    graphics-build/out/parts/<id>.mp4|mov Remotion part for a graphic beat
    broll/<clip>.mp4                      b-roll clip, named by the cutsheet's `clip` field
    render/base-1080.mp4                  the base video

A beat declares what it needs via its own fields, so this stays true when the layout changes:
    {"id": "ref02", "kind": "broll", "clip": "b02-shop-crowd"}
Or drop an explicit map at graphics-build/assets.json to bypass the convention entirely:
    {"ref02": ["broll/b02-shop-crowd.mp4"], "ref15": ["graphics-build/out/parts/ref15.mov"]}
"""
import json
import os
import sys

# Beat kinds that REPLACE the frame with a rendered part, and those that composite over it. Either
# way the part is mandatory — its absence is what turns the beat back into plain footage.
NEEDS_PART = {'stat', 'chart', 'table', 'takeover', 'topic-card', 'subscribe', 'bubble',
              'lower-third', 'vox'}
NEEDS_CLIP = {'broll'}


def candidates(job, beat):
    """Paths that would satisfy this beat. Any one existing is enough."""
    bid, kind = beat['id'], beat.get('kind', '')
    if kind in NEEDS_CLIP or beat.get('clip'):
        clip = beat.get('clip')
        if not clip:
            # A b-roll beat with no `clip` field cannot be checked, and an unknown-shaped beat is
            # exactly how the original bug hid. Report it rather than passing it.
            return None
        return [f'{job}/broll/{clip}.mp4', f'{job}/broll/{clip}.mov']
    if kind in NEEDS_PART:
        return [f'{job}/graphics-build/out/parts/{bid}.mp4',
                f'{job}/graphics-build/out/parts/{bid}.mov']
    return []


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        sys.exit(__doc__)
    job = os.path.abspath(args[0]).rstrip('/')
    want_pieces = '--pieces' in sys.argv
    asm = f'{job}/graphics-build/assemble.py'
    if '--assembler' in sys.argv:
        asm = sys.argv[sys.argv.index('--assembler') + 1]

    cut = f'{job}/graphics-build/cutsheet.json'
    if not os.path.exists(cut):
        sys.exit(f'ABORT: no cutsheet at {cut}')
    beats = json.load(open(cut))
    beats = beats['beats'] if isinstance(beats, dict) else beats

    override = {}
    ov_path = f'{job}/graphics-build/assets.json'
    if os.path.exists(ov_path):
        override = json.load(open(ov_path))

    missing, unknown = [], []
    checked = 0
    for b in beats:
        bid = b['id']
        cands = ([f'{job}/{p}' for p in override[bid]] if bid in override
                 else candidates(job, b))
        if cands is None:
            unknown.append(f"  {bid:10s} kind={b.get('kind','?'):12s} declares no `clip` — cannot verify")
            continue
        if not cands:
            continue
        checked += 1
        if not any(os.path.exists(c) for c in cands):
            shown = ' | '.join(os.path.relpath(c, job) for c in cands)
            missing.append(f"  {bid:10s} kind={b.get('kind','?'):12s} {shown}")

    stale = []
    if want_pieces:
        pdir = f'{job}/render/pieces'
        asm_mt = os.path.getmtime(asm) if os.path.exists(asm) else 0.0
        if os.path.isdir(pdir):
            for f in sorted(os.listdir(pdir)):
                if not f.endswith(('.mp4', '.mov')):
                    continue
                fp = f'{pdir}/{f}'
                if os.path.getmtime(fp) < asm_mt:
                    stale.append(f'  {f} predates {os.path.basename(asm)}')

    if unknown:
        print('UNVERIFIABLE beats (shape not understood — treat as a failure, not a pass):')
        print('\n'.join(unknown))
    if missing:
        print('ABORT: assets missing. These beats would render as PLAIN FOOTAGE, silently:')
        print('\n'.join(missing))
    if stale:
        print(f'STALE: {len(stale)} cached pieces predate the assembler — they will be reused and '
              f'your fix will look like a no-op. Delete render/pieces/ before re-running.')
        print('\n'.join(stale[:10]) + ('\n  ...' if len(stale) > 10 else ''))
    if missing or unknown:
        sys.exit(1)
    print(f'preflight ok: {checked} beat assets present'
          + (f', {len(stale)} stale pieces' if stale else ''))


if __name__ == '__main__':
    main()
