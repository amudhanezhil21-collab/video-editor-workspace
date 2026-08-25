#!/usr/bin/env python3
"""Is each beat's asset actually ON SCREEN in the finished render? Measure it.

Why this exists
---------------
`assert_beat_assets.py` proves the assets were on disk. This proves they reached the picture. Two
different failures, both needed: draft 1 of `flexi-cap-large-cap-disguise` had three finished b-roll
clips present on disk *and* absent from the render, because a routing bug sent those beats down the
plain-footage branch.

Six review passes missed it, and the reason is worth stating plainly: **a reviewer looking at frames
sees what IS there, not what SHOULD have been.** Plain talking head at 26s is a perfectly good frame.
Nothing about it looks broken, so nothing gets flagged. The only way to catch it is to compare the
picture against the cutsheet's claim.

How it decides
--------------
Compare the render frame against the beat's OWN ASSET, not against the base footage. "Does the
picture match the thing it claims to show" is direct and the margin is enormous. Measured on the
real job (mean abs difference, 0-255, grey, 160px wide):

    beats whose asset landed      0.59 - 4.11
    ref02 / ref04 / ref27 (lost)  105.7 / 109.9 / 109.6

Comparing against the base footage also separates (124-142 vs 4.5-11.6) but far more weakly, and it
inverts for overlay beats, which legitimately keep most of the footage. So:

    OPAQUE kinds  (replace the frame)  -> render must MATCH its asset      (diff < MATCH)
    OVERLAY kinds (composite over it)  -> render must DIFFER from the base (diff > MOVED)

An unmeasurable beat is a FAILURE, never a pass. The first version of this script quieted ffmpeg
with `-v error`, which swallowed the `metadata=print` line it existed to read, returned -1.0 for
every beat, and scored -1.0 as a pass. It reported "27 beats changed the picture" on the very render
whose b-roll was missing. Same defect as the bug it hunts: absence given a legal meaning.

Usage
-----
    assert_beats_visible.py <job-root> --render PATH [--offset SECONDS] [--base PATH] [--verbose]

    --offset   seconds of head (disclaimer/intro) prepended to the body, so body time t sits at
               t+offset in the file. MEASURE it (ffprobe the head piece); do not assume 0. A wrong
               offset makes every beat look lost.
"""
import json
import os
import subprocess
import sys
import tempfile

# Kinds that REPLACE the frame. The render should look like the asset itself.
OPAQUE = {'stat', 'chart', 'table', 'takeover', 'topic-card', 'broll', 'vox'}
# Kinds that composite OVER the footage. The render will not match the alpha asset (measured ~60 for
# the two real lower-thirds), so these are judged on having changed the base instead.
OVERLAY = {'subscribe', 'bubble', 'lower-third', 'transition'}

MATCH = 15.0   # opaque: render-vs-asset below this = the asset is on screen (worst pass was 4.11)
MOVED = 8.0    # overlay: render-vs-base above this = something was composited (real ones hit 21.4)
FRAC = 0.55    # sample this far through the beat: past the entrance, before the exit


def grab(video, t, out):
    r = subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{t:.3f}', '-i', video,
                        '-frames:v', '1', '-vf', 'scale=160:-1,format=gray', out],
                       capture_output=True, text=True)
    return r.returncode == 0 and os.path.exists(out) and os.path.getsize(out) > 0


def mean_abs_diff(a, b):
    """Mean absolute difference of two same-size PNGs.

    No `-v error`: `metadata=print` writes at INFO level, so quieting ffmpeg swallows the one line
    this function exists to read. Raise rather than return a sentinel — a sentinel is how the first
    version turned an unmeasurable beat into a pass.
    """
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', a, '-i', b, '-filter_complex',
                        '[0:v][1:v]blend=all_mode=difference,signalstats,'
                        'metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-'],
                       capture_output=True, text=True)
    for line in r.stderr.splitlines() + r.stdout.splitlines():
        if 'signalstats.YAVG' in line:
            try:
                return float(line.split('=')[-1].strip())
            except ValueError:
                pass
    raise RuntimeError(f'could not measure {os.path.basename(a)} vs {os.path.basename(b)}:\n'
                       f'{r.stderr[-500:]}')


def dur(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                 '-of', 'csv=p=0', p], capture_output=True, text=True).stdout or 0)


def asset_for(job, beat):
    """The file this beat claims to put on screen: its clip, or its rendered part."""
    if beat.get('clip'):
        for e in ('.mp4', '.mov'):
            p = f'{job}/broll/{beat["clip"]}{e}'
            if os.path.exists(p):
                return p
        return None
    for e in ('.mp4', '.mov'):
        p = f'{job}/graphics-build/out/parts/{beat["id"]}{e}'
        if os.path.exists(p):
            return p
    return None


def detect_offset(job, render, beats):
    """MEASURE the head offset instead of trusting a typed number.

    A disclaimer card in front and an endscreen behind mean the deliverable's clock is not the
    cutsheet's clock. Getting that shift wrong corrupts the whole review: at offset 0 on a render
    whose true offset is 3s, this gate flagged ref06 and ref16 as lost assets when both were
    perfectly fine. **A reviewer handed those timestamps would go and 'confirm' two defects that do
    not exist**, and would describe whatever it saw 3 seconds early as the beat's content.

    So: derive it, don't declare it. It comes from the pipeline's own concat manifest — the parts
    listed before the body, summed — and is then CONFIRMED against the picture.

    Correlating pixels alone does not work, and it is worth knowing why: the natural probe is a long
    static beat, because a table holds still and matches stably. But that same stillness makes every
    offset inside the hold match equally well, so there is no peak to lock onto. The manifest knows
    the answer exactly; pixels are the check that it is the right manifest.
    """
    manifest = f'{job}/render/concat.txt'
    if not os.path.exists(manifest):
        sys.exit(f'ABORT: no {manifest} to derive the head offset from. Pass --offset explicitly '
                 f'(ffprobe the head piece). Never let it default to 0 — a wrong offset does not '
                 f'fail loudly, it silently reports the wrong beats.')
    parts, body_i = [], None
    for line in open(manifest):
        line = line.strip()
        if not line.startswith('file '):
            continue
        p = line[5:].strip().strip("'\"")
        if 'body' in os.path.basename(p):
            body_i = len(parts)
        parts.append(p)
    if body_i is None:
        sys.exit(f'ABORT: {manifest} has no body part — cannot tell where the cutsheet clock '
                 f'starts. Pass --offset explicitly.')
    head = sum(dur(p) for p in parts[:body_i])

    # Confirm against the picture. A manifest can be stale; a matching frame proves it is not.
    cands = [b for b in sorted(beats, key=lambda x: x['start'])
             if (b.get('composite') or 'replace') == 'replace'
             and b.get('kind') in OPAQUE and (b['end'] - b['start']) > 4.0
             and asset_for(job, b)]
    if cands:
        probe = cands[len(cands) // 2]
        asset = asset_for(job, probe)
        tmp = tempfile.mkdtemp()
        mid = probe['start'] + (probe['end'] - probe['start']) * FRAC
        if grab(asset, dur(asset) * FRAC, f'{tmp}/a.png') and grab(render, mid + head, f'{tmp}/r.png'):
            try:
                d = mean_abs_diff(f'{tmp}/r.png', f'{tmp}/a.png')
            except RuntimeError:
                d = None
            if d is not None and d >= MATCH:
                sys.exit(f'ABORT: manifest says the head is {head:.2f}s, but at that shift '
                         f'{probe["id"]} does not match its own asset ({d:.1f}, need <{MATCH}). '
                         f'The manifest, the cutsheet and this render disagree — resolve that '
                         f'before reviewing anything. A wrong offset invents defects.')
            print(f'offset: {head:.2f}s (from concat.txt, confirmed on {probe["id"]} at {d:.2f})')
            return head
    print(f'offset: {head:.2f}s (from concat.txt, UNCONFIRMED — no probe beat available)')
    return head


def main():
    pos = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not pos or '--render' not in sys.argv:
        sys.exit(__doc__)
    job = os.path.abspath(pos[0]).rstrip('/')
    render = sys.argv[sys.argv.index('--render') + 1]
    base = (sys.argv[sys.argv.index('--base') + 1] if '--base' in sys.argv
            else f'{job}/render/base-1080.mp4')
    verbose = '--verbose' in sys.argv

    for p in (render, base):
        if not os.path.exists(p):
            sys.exit(f'ABORT: missing {p}')
    beats = json.load(open(f'{job}/graphics-build/cutsheet.json'))
    beats = beats['beats'] if isinstance(beats, dict) else beats

    if '--offset' in sys.argv:
        offset = float(sys.argv[sys.argv.index('--offset') + 1])
        print(f'offset: {offset:.2f}s (given)')
    else:
        offset = detect_offset(job, render, beats)

    lost, broken, rows = [], [], []
    tmp = tempfile.mkdtemp()
    for b in sorted(beats, key=lambda x: x['start']):
        bid, kind = b['id'], b.get('kind', '')
        # A beat may declare HOW it lands, overriding what its kind implies: a 'takeover' graphic
        # built as a lower-third keeps the footage, so it must be judged as an overlay. The
        # cutsheet carries this; never a set hardcoded in the assembler, where no check can see it.
        how = b.get('composite')
        opaque = (how == 'replace') or (how is None and kind in OPAQUE)
        if not opaque and how != 'overlay' and kind not in OVERLAY:
            continue
        mid = b['start'] + (b['end'] - b['start']) * FRAC
        fr, fb = f'{tmp}/r.png', f'{tmp}/b.png'
        where = f"{b['start']:.2f}-{b['end']:.2f}s"
        if not (grab(render, mid + offset, fr) and grab(base, mid, fb)):
            broken.append((bid, kind, 0.0, f'{where}  could not grab a frame'))
            continue
        try:
            if opaque:
                asset = asset_for(job, b)
                if not asset:
                    broken.append((bid, kind, 0.0, f'{where}  no asset found to compare against'))
                    continue
                if not grab(asset, dur(asset) * FRAC, f'{tmp}/a.png'):
                    broken.append((bid, kind, 0.0, f'{where}  could not grab from {os.path.basename(asset)}'))
                    continue
                d = mean_abs_diff(fr, f'{tmp}/a.png')
                bad, test = d >= MATCH, f'vs asset {d:6.2f} (need <{MATCH})'
            else:
                d = mean_abs_diff(fr, fb)
                bad, test = d <= MOVED, f'vs base  {d:6.2f} (need >{MOVED})'
        except RuntimeError as e:
            broken.append((bid, kind, 0.0, f'{where}  {e}'))
            continue
        rows.append((bid, kind, d, test))
        if bad:
            lost.append((bid, kind, d, f'{where}  {test}'))

    def show(rs):
        return '\n'.join(f'  {i:10s} {k:12s} {n}' for i, k, _, n in rs)

    if verbose:
        print('all measured beats:')
        print('\n'.join(f'  {i:10s} {k:12s} {t}' for i, k, _, t in rows))
        print()
    if broken:
        print(f'UNMEASURABLE ({len(broken)}) — treat as failures, not passes:')
        print(show(broken))
    if lost:
        print(f'\nABORT: {len(lost)} beat(s) claim an asset that is NOT on screen. '
              f'The asset never landed:')
        print(show(lost))
    if lost or broken:
        sys.exit(1)
    print(f'visible ok: {len(rows)} beats show the asset they claim')


if __name__ == '__main__':
    main()
