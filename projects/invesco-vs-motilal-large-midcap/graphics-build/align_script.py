#!/usr/bin/env python3
"""Align script.json paragraphs to the base cut's WhisperX word stream.

Outputs transcript/basecut-anchors.json: per-paragraph t0/t1 plus per-word
times, so every graphic lands on its exact line of dialogue (§2.7).

Method: normalize both sides to comparable Latin tokens (WhisperX emits a
Hinglish mix of Devanagari + English; the script is Hinglish in Latin), then
run a banded monotonic DP over script words x ASR words with a char-bigram
Dice similarity. ASR is unreliable word-for-word in places, so per-word times
are attached only where similarity is high; paragraph spans come from robust
first/last strong matches.
"""
import json, re, sys, unicodedata
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]

# --- Devanagari -> Latin (compact ISO-ish scheme, phonetic not strict) ---
DEV = {
    "अ":"a","आ":"aa","इ":"i","ई":"ee","उ":"u","ऊ":"oo","ऋ":"ri","ए":"e","ऐ":"ai","ओ":"o","औ":"au",
    "क":"k","ख":"kh","ग":"g","घ":"gh","ङ":"n","च":"ch","छ":"chh","ज":"j","झ":"jh","ञ":"n",
    "ट":"t","ठ":"th","ड":"d","ढ":"dh","ण":"n","त":"t","थ":"th","द":"d","ध":"dh","न":"n",
    "प":"p","फ":"ph","ब":"b","भ":"bh","म":"m","य":"y","र":"r","ल":"l","व":"v","श":"sh",
    "ष":"sh","स":"s","ह":"h","ज़":"z","फ़":"f","ड़":"r","ढ़":"rh","क़":"q","ख़":"kh","ग़":"g",
    "ा":"a","ि":"i","ी":"i","ु":"u","ू":"u","ृ":"ri","े":"e","ै":"ai","ो":"o","ौ":"au",
    "ं":"n","ँ":"n","ः":"","्":"","़":"","।":"","॥":"",
    "०":"0","१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9",
}

def dev2lat(s: str) -> str:
    out = []
    for ch in s:
        out.append(DEV.get(ch, ch))
    return "".join(out)

def norm(w: str) -> str:
    w = unicodedata.normalize("NFC", w)
    w = dev2lat(w).lower()
    w = re.sub(r"[^a-z0-9%₹.]+", "", w)
    w = w.replace("₹", "rs").replace("%", " percent").strip(".")
    # cheap phonetic squeeze: collapse double letters, drop trailing h clusters
    w = re.sub(r"(.)\1+", r"\1", w)
    w = re.sub(r"h", "", w) if len(w) > 3 else w
    return w

def bigrams(w): return {w[i:i+2] for i in range(len(w)-1)} if len(w) > 1 else {w}

def sim(a: str, b: str) -> float:
    if not a or not b: return 0.0
    if a == b: return 1.0
    A, B = bigrams(a), bigrams(b)
    inter = len(A & B)
    if not inter: return 0.0
    return 2*inter/(len(A)+len(B))

# --- load ---
script = json.loads((JOB/"transcript/script.json").read_text())
asr = json.loads((JOB/"transcript/basecut-asr/basecut.json").read_text())

asr_words = []
for seg in asr["segments"]:
    for w in seg.get("words", []):
        if "start" in w:
            asr_words.append({"t0": w["start"], "t1": w["end"], "raw": w["word"], "n": norm(w["word"])})
asr_words = [w for w in asr_words if w["n"]]

sw = []  # (para_id, word_index_in_para, norm)
for p in script["paragraphs"]:
    words = [x for x in re.split(r"\s+", p["text"]) if x]
    for i, wtxt in enumerate(words):
        n = norm(wtxt)
        if n:
            sw.append({"pid": p["id"], "i": i, "raw": wtxt, "n": n})

NS, NA = len(sw), len(asr_words)
print(f"script words: {NS}, asr words: {NA}")

# --- banded monotonic DP ---
import numpy as np
BAND = 400  # generous: creator's cut may drop/keep different amounts
NEG = -1e9
score = np.full((NS+1, NA+1), NEG, dtype=np.float32)
back = np.zeros((NS+1, NA+1), dtype=np.int8)  # 1=diag 2=skip_s 3=skip_a
score[0, :] = 0.0
GAP_S = -0.35  # skipping a script word (creator dropped/ASR missed)
GAP_A = -0.20  # skipping an ASR word (filler/hallucination)
for si in range(1, NS+1):
    centre = int(si/NS * NA)
    lo = max(1, centre-BAND); hi = min(NA, centre+BAND)
    srow = score[si]; prow = score[si-1]
    w_n = sw[si-1]["n"]
    # allow skipping script word from any aligned prefix
    for ai in range(lo-1, hi+1):
        if prow[ai] > NEG/2:
            v = prow[ai] + GAP_S
            if v > srow[ai]:
                srow[ai] = v; back[si, ai] = 2
    for ai in range(lo, hi+1):
        m = sim(w_n, asr_words[ai-1]["n"])
        v = prow[ai-1] + (m*2 - 0.8)  # reward good matches, punish bad
        if v > srow[ai]:
            srow[ai] = v; back[si, ai] = 1
        v2 = srow[ai-1] + GAP_A
        if v2 > srow[ai]:
            srow[ai] = v2; back[si, ai] = 3
best_ai = int(np.argmax(score[NS]))
# --- traceback ---
pairs = []  # (script_idx, asr_idx)
si, ai = NS, best_ai
while si > 0 and ai > 0:
    b = back[si, ai]
    if b == 1:
        pairs.append((si-1, ai-1)); si, ai = si-1, ai-1
    elif b == 2:
        si -= 1
    elif b == 3:
        ai -= 1
    else:
        break
pairs.reverse()

# --- assemble per-paragraph anchors ---
from collections import defaultdict
para_words = defaultdict(list)
matched = 0
for sidx, aidx in pairs:
    s, a = sw[sidx], asr_words[aidx]
    m = sim(s["n"], a["n"])
    if m >= 0.5:
        matched += 1
        para_words[s["pid"]].append({
            "w": s["raw"], "i": s["i"], "t0": round(a["t0"], 3), "t1": round(a["t1"], 3),
            "asr": a["raw"].strip(), "conf": round(m, 2),
        })

anchors = []
for p in script["paragraphs"]:
    ws = para_words.get(p["id"], [])
    entry = {"id": p["id"], "text": p["text"], "nWords": len([x for x in re.split(r"\s+", p["text"]) if x]),
             "nMatched": len(ws)}
    if ws:
        strong = [w for w in ws if w["conf"] >= 0.7] or ws
        entry["t0"] = strong[0]["t0"]; entry["t1"] = strong[-1]["t1"]
        entry["words"] = ws
    else:
        entry["t0"] = None; entry["t1"] = None; entry["words"] = []
    anchors.append(entry)

# monotonic repair: paragraph spans must not go backwards
prev_t1 = 0.0
for e in anchors:
    if e["t0"] is None: continue
    if e["t0"] < prev_t1 - 1.0:
        e["flag"] = "non-monotonic vs previous paragraph — check"
    prev_t1 = max(prev_t1, e["t1"] or prev_t1)

out = {"source": "basecut-asr/basecut.json + script.json banded-DP alignment",
       "video": "assets/reference-basecut.mp4", "fps": 25,
       "scriptWords": NS, "asrWords": NA, "matchedWords": matched,
       "paragraphs": anchors}
(JOB/"transcript/basecut-anchors.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))

unanchored = [e["id"] for e in anchors if e["t0"] is None]
weak = [e["id"] for e in anchors if e["t0"] is not None and e["nMatched"] < max(3, e["nWords"]*0.3)]
print(f"matched {matched}/{NS} script words ({100*matched/NS:.1f}%)")
print("unanchored paragraphs:", unanchored or "none")
print("weak paragraphs (<30% words):", weak or "none")
for e in anchors[:8]:
    print(f'{e["id"]}: {e["t0"]}–{e["t1"]}  ({e["nMatched"]}/{e["nWords"]})')
