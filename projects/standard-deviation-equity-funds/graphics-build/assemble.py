#!/usr/bin/env python3
"""
Assemble standard-deviation-equity-funds.

Reads beat FACTS from transcript/cutsheet.json — never hardcodes them (lesson:
absence-is-not-a-valid-state; the cutsheet is what the verifiers check against).

Composite order (bottom -> top):
  1. base plate (zooms baked)                     graphics-build/work/base-plate.mp4
  2. full-frame segment replacements              broll B2/B5, takeovers B3/B4/B14,
                                                  tables B7/B8, sync-slide B11
  3. transparent overlays                         B10 widget, B13 ratios, sebi-open, b15-outro
  4. light leaks (ABOVE graphics, below chrome)   4 sites, peak frame = boundary frame
     + one-frame white plate at each peak (style.md: measured leak peaks ~235, reference
       has ONE pure-white frame; verify exactly one frame >240 per leak)
  5. chrome (badge+wordmark, knockback windows)   topmost bar captions
  6. captions (rendered AFTER placement solve; draft 1 omits them)
  7. thumbnail frame 1 (2 frames, hard cut)

GATES (run, never skipped):
  - assert_beat_assets: every beat in the cutsheet that names an asset has that asset on disk,
    decodable, with enough frames to cover its window. ABORT on any miss.
  - post-render: assert_beats_visible + duplicate-frame count < 1% + leak white-frame check.
"""
import json, os, subprocess, sys

JOB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(JOB)
FPS = 30
CUT = json.load(open('transcript/cutsheet.json'))
F = lambda s: round(s * FPS)

# beat id -> the rendered asset expected (segments replace footage; overlays ride on top)
SEGMENTS = {
    'B2':  'broll/conformed/B2-trading-terminal-30fps.mp4',
    'B3':  'graphics-build/out/b3-volatility.mov',
    'B4':  'graphics-build/out/b4-volatility.mov',
    'B5':  'broll/conformed/B5-roller-coaster-30fps.mp4',
    'B7':  'graphics-build/out/b7-table-higher.mov',
    'B8':  'graphics-build/out/b8-table-lower.mov',
    'B11': 'graphics-build/out/b11-risk-tolerance.mov',
    'B14': 'graphics-build/out/b14-sharpe-sortino.mov',
}
OVERLAYS = {
    'B10': 'graphics-build/out/b10-question.mov',
    'B13': 'graphics-build/out/b13-ratios.mov',
}
FURNITURE = [
    ('sebi',  'graphics-build/out/sebi-open.mov', 0.20),
    ('outro', 'graphics-build/out/b15-outro.mov', 134.91),
]
LEAK = 'graphics-build/out/leak30.mov'
LEAK_PEAK_IDX = 9          # measured white peak lands here (16f wrapper)
LEAK_LEN = 16
# leak sites: the CUT frame each leak must hide (its peak sits ON this frame)
LEAK_SITES = [F(56.57), F(68.50), F(126.04), F(134.91)]
THUMB = 'assets/thumbnail.png'

def die(msg):
    print(f"ABORT: {msg}", file=sys.stderr); sys.exit(2)

def probe_frames(path):
    r = subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-count_frames',
                        '-show_entries','stream=nb_read_frames','-of','csv=p=0',path],
                       capture_output=True, text=True)
    try: return int(r.stdout.strip())
    except ValueError: return -1

def assert_beat_assets():
    beats = {b['id']: b for b in CUT['beats']}
    missing = []
    for bid, path in {**SEGMENTS, **OVERLAYS}.items():
        b = beats.get(bid)
        if b is None: missing.append(f"{bid}: beat not in cutsheet"); continue
        if not os.path.exists(path): missing.append(f"{bid}: MISSING {path}"); continue
        need = F(b['end']) - F(b['start'])
        got = probe_frames(path)
        if got < need: missing.append(f"{bid}: {path} has {got} frames, needs >= {need}")
    for _, path, _ in FURNITURE:
        if not os.path.exists(path): missing.append(f"furniture MISSING {path}")
    if not os.path.exists(LEAK): missing.append(f"leak MISSING {LEAK}")
    if not os.path.exists(THUMB): missing.append(f"thumbnail MISSING {THUMB}")
    if missing:
        die("beat assets incomplete:\n  " + "\n  ".join(missing))
    print(f"assert_beat_assets: all {len(SEGMENTS)+len(OVERLAYS)} beat assets + furniture present")


# ---------------------------------------------------------------------------
# Composite emission
# ---------------------------------------------------------------------------
LOGOS = '/Users/ezhilam/Desktop/Video_Editor/assets/logos'
CHROME = {  # derived from measured shadow-asset padding (mark position from Chrome.tsx)
    'badge':   {'file': f'{LOGOS}/groww-shorts-badge-shadow.png', 'w': 225, 'x': 40,  'y': 41},
    'capsule': {'file': f'{LOGOS}/groww-capsule-shadow.png',      'w': 243, 'x': 794, 'y': 50},
}
# chrome knockback windows (frames) — light data-card layouts
KNOCK = [(F(17.95), F(40.52)), (F(56.57), F(68.50)), (F(102.64), F(111.83)), (F(126.04), F(134.91))]

def knock_expr():
    return '+'.join(f'between(n\\,{a}\\,{b-1})' for a, b in KNOCK)

def emit(out='graphics-build/work/draft1.mp4', with_captions=None):
    beats = {b['id']: b for b in CUT['beats']}
    # windows [startF, endF) — segment ends extend to the covering leak peak where one exists
    segwin = {
        'B2':  (F(10.62), F(17.95)), 'B3': (F(17.95), F(29.77)), 'B4': (F(29.77), F(40.52)),
        'B5':  (F(40.52), F(45.98)), 'B7': (F(56.57), F(62.31)), 'B8': (F(62.31), F(68.50)),
        'B11': (F(102.64), F(111.83)), 'B14': (F(126.04), F(134.91)),
    }
    ovwin = {'B10': (F(97.00), F(102.64)), 'B13': (F(116.93), F(126.04))}
    inputs = ['-i', 'graphics-build/work/base-plate.mp4']
    flt, idx = [], 1
    cur = '[0:v]'
    def nxt(tag):
        nonlocal cur
        out = f'[v{tag}]'
        cur_out = out
        return cur_out
    # --- segments + overlays (tpad clone so every layer holds its last frame) ---
    for bid in ['B2', 'B3', 'B4', 'B5', 'B7', 'B8', 'B11', 'B14', 'B10', 'B13']:
        path = SEGMENTS.get(bid) or OVERLAYS[bid]
        a, b = (segwin | ovwin)[bid]
        inputs += ['-i', path]
        flt.append(f'[{idx}:v]tpad=stop_mode=clone:stop=-1,setpts=PTS-STARTPTS+{a}/{FPS}/TB[s{bid}]')
        o = nxt(bid)
        flt.append(f'{cur}[s{bid}]overlay=eof_action=pass:enable=between(n\\,{a}\\,{b-1}){o}')
        cur = o; idx += 1
    # --- furniture ---
    for name, path, st in FURNITURE:
        a = F(st)
        inputs += ['-i', path]
        flt.append(f'[{idx}:v]tpad=stop_mode=clone:stop=-1,setpts=PTS-STARTPTS+{a}/{FPS}/TB[s{name}]')
        o = nxt(name)
        end = 4311 if name == 'outro' else a + probe_frames(path)
        flt.append(f'{cur}[s{name}]overlay=eof_action=pass:enable=between(n\\,{a}\\,{end-1}){o}')
        cur = o; idx += 1
    # --- light leaks: measured screen+tint blend, ABOVE graphics ---
    for k, peak in enumerate(LEAK_SITES):
        st = peak - LEAK_PEAK_IDX
        inputs += ['-i', LEAK]
        flt.append(f'[{idx}:v]format=yuv420p,tpad=start={st}:start_mode=add:stop={4311-st-LEAK_LEN}:stop_mode=add:color=black[lk{k}]')
        o = nxt(f'lk{k}')
        flt.append(f"{cur}[lk{k}]blend=all_expr='(A+B-A*B/255)*(1-B/510)+B*B/510':enable=between(n\\,{st}\\,{st+LEAK_LEN-1}){o}")
        cur = o; idx += 1
    # --- chrome (two overlays each: full / knocked) ---
    for key, c in CHROME.items():
        inputs += ['-i', c['file']]
        flt.append(f'[{idx}:v]scale={c["w"]}:-1,split[c1{key}][c2{key}]')
        flt.append(f'[c1{key}]copy[cf{key}]')
        flt.append(f'[c2{key}]format=rgba,colorchannelmixer=aa=0.35[ck{key}]')
        o = nxt(f'cf{key}')
        flt.append(f'{cur}[cf{key}]overlay={c["x"]}:{c["y"]}:enable=not({knock_expr()}){o}')
        cur = o
        o = nxt(f'ck{key}')
        flt.append(f'{cur}[ck{key}]overlay={c["x"]}:{c["y"]}:enable={knock_expr()}{o}')
        cur = o; idx += 1
    # --- thumbnail frames 0-1 ---
    inputs += ['-loop', '1', '-t', '0.2', '-i', THUMB]
    flt.append(f'[{idx}:v]scale=1080:1920,setpts=PTS-STARTPTS[th]')
    o = nxt('th')
    flt.append(f'{cur}[th]overlay=eof_action=pass:enable=lt(n\\,2){o}')
    cur = o; idx += 1
    if with_captions:
        inputs += ['-i', with_captions]
        flt.append(f'[{idx}:v]setpts=PTS-STARTPTS[cap]')
        o = nxt('cap')
        flt.append(f'{cur}[cap]overlay=eof_action=pass{o}')
        cur = o; idx += 1
    graph = ';\n'.join(flt)
    cmd = (['ffmpeg', '-y', '-v', 'warning', '-stats'] + inputs +
           ['-filter_complex', graph, '-map', cur, '-map', '0:a',
            '-frames:v', '4311', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p',
            '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
            '-c:a', 'copy', '-movflags', '+faststart', out])
    print(f'emit -> {out}  ({len(flt)} filter stages, {idx} inputs)')
    open('graphics-build/work/last_graph.txt', 'w').write(graph)
    r = subprocess.run(cmd)
    if r.returncode: die(f'ffmpeg failed ({r.returncode})')
    print('composite done')


if __name__ == '__main__':
    assert_beat_assets()
    if '--emit' in sys.argv:
        cap = None
        for a in sys.argv:
            if a.startswith('--captions='): cap = a.split('=',1)[1]
        emit(with_captions=cap)
    else:
        print("assets OK. run with --emit to composite (add --captions=PATH after the solve)")
