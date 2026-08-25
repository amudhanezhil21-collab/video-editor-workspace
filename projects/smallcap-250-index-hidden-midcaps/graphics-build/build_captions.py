#!/usr/bin/env python3
"""
Caption groups for smallcap-250-index-hidden-midcaps.

brand.md: captions are an ENGLISH TRANSLATION of the Hindi/Hinglish VO — never a raw transcript,
never Devanagari. The translation source is Tab 2 of the creator's own script doc, so the wording
is hers, not mine.

TIMING — the rule that matters (finishing-pass skill):
  Do NOT distribute the English words evenly across a beat. She speaks a great deal of English
  vocabulary inside the Hinglish, and WhisperX writes those loanwords in DEVANAGARI. Transliterate
  them, match them greedily forward against the English caption tokens, and every match becomes a
  HARD TIME ANCHOR. Interpolate only the words between anchors.

Writes transcript/caption-groups.json. Placement is NOT decided here — that is solved by
measurement against the rendered graphics (caption_solver.py) once the composite exists.
"""
import json, os, re, sys

JOB = "/Volumes/Extreme SSD/video-editor-jobs/smallcap-250-index-hidden-midcaps"
REPO = "/Users/ezhilamudhan/Desktop/video-editor/projects/smallcap-250-index-hidden-midcaps"

# WhisperX writes English loanwords in Devanagari. Without this map the anchor count collapses
# and the captions drift seconds out of sync.
LOANWORDS = {
    "इंवेस्ट": "invest", "परसेंट": "percent", "एक्सपोजर": "exposure",
    "रियालिटी": "reality", "डिफरेंट": "different", "ट्विस्ट": "twist",
    "बैलेंस": "balance", "जून": "june", "डिसेंबर": "december",
    "सौ": "100", "कंपनी": "company", "स्टॉक": "stock", "फंड": "fund",
    "फंड्स": "funds", "इंडेक्स": "index",
}

# Tab 2 of the doc — the creator's own English, mapped to the anchored beats.
# `None` = suppressed: creator directive 2026-08-23, no captions over AI-generated b-roll.
LINES = {
    # REWRITTEN from Tab 2 to follow her SPOKEN clause order — Tab 2's "If you invest in a Small
    # Cap 250 Index Fund, you'll get..." front-loads a clause she says LAST, which stranded the
    # opening chip for 3.65s. Same meaning, her order.
    1:  "Small Cap 250 Index Fund - you invest, you get 100% small-cap exposure.",
    2:  "Sounds logical, right?",
    3:  "After all, it's called a Small Cap 250 Index Fund.",
    4:  "But the reality is a little different.",
    5:  "The twist lies inside the index.",
    6:  "The Nifty Smallcap 250 Index is rebalanced only twice a year — in June and December.",
    7:  None,   # AI b-roll: trading terminal
    8:  "Its market capitalization increases and moves into the mid-cap range.",
    9:  "Does the index remove it immediately?",
    10: "No.",
    11: "That stock remains in the index until the next rebalancing. And since an index fund "
        "tracks the index exactly, the fund continues to hold that stock as well.",
    12: None,   # AI b-roll: the black sheep
    13: "Take a look right now, before the June rebalancing. Across all the funds tracking this "
        "index, more than 9% of the stocks have already crossed the mid-cap threshold. That means "
        "roughly 9-10% of your small-cap fund exposure is in stocks that have technically become "
        "mid-caps.",
    14: "Officially small-cap. Functionally, not entirely.",
    15: None,   # AI b-roll: circles on the ramp
    16: None,   # AI b-roll: the piggy bank
    17: "Sometimes, that assumption can be inaccurate for a period of time.",
    18: "That's why, along with looking at a fund's name, it's important to understand its "
        "underlying holdings as well.",
    19: "Did you know this already? Let us know in the comments.",
}

# ALL-CAPS interjections get their own chip stacked above the main line (brand.md).
INTERJECTIONS = {"NOW,", "BUT WAIT...", "NO."}


def norm(tok: str) -> str:
    t = tok.strip().strip("।,.?!‍\"'")
    return LOANWORDS.get(t, t).lower()


def anchor(spoken, english):
    """Greedy forward match of spoken words onto English tokens -> hard time anchors."""
    anchors = []          # (english_index, time)
    si = 0
    for ei, ew in enumerate(english):
        e = re.sub(r"[^a-z0-9%]", "", ew.lower())
        if not e:
            continue
        for k in range(si, len(spoken)):
            s = re.sub(r"[^a-z0-9%]", "", norm(spoken[k]["word"]))
            if not s:
                continue
            if s == e or (len(e) > 3 and len(s) > 3 and (s.startswith(e[:4]) or e.startswith(s[:4]))):
                anchors.append((ei, spoken[k]["start"], spoken[k]["end"]))
                si = k + 1
                break
    return anchors


def word_times(spoken, english, t0, t1):
    """Per-English-word (start,end), anchored where possible, interpolated between."""
    a = anchor(spoken, english)
    n = len(english)
    pts = [(-1, t0, t0)] + a + [(n, t1, t1)]
    times = [None] * n
    for (i0, _, e0), (i1, s1, _) in zip(pts, pts[1:]):
        span = i1 - i0
        if span <= 0:
            continue
        for k in range(max(i0, 0), min(i1, n)):
            if k < 0 or k >= n:
                continue
            frac0 = (k - i0) / span
            frac1 = (k + 1 - i0) / span
            times[k] = (e0 + (s1 - e0) * frac0, e0 + (s1 - e0) * frac1)
    for (ei, s, e) in a:
        if 0 <= ei < n:
            times[ei] = (s, e)
    # monotonic repair
    for k in range(1, n):
        if times[k] and times[k - 1] and times[k][0] < times[k - 1][1]:
            times[k] = (times[k - 1][1], max(times[k][1], times[k - 1][1] + 0.06))
    return times, len(a)


def group(english, times, max_words=5):
    """Chips of 2-6 words (typically 3-5), broken on punctuation first."""
    out, cur = [], []
    for i, w in enumerate(english):
        cur.append(i)
        hard = w.endswith(('.', '?', '!', ',', '—', ':', ';'))
        if len(cur) >= max_words or (hard and len(cur) >= 2) or i == len(english) - 1:
            ws = [english[j] for j in cur]
            ts = [times[j] for j in cur if times[j]]
            if ts:
                out.append({"text": " ".join(ws),
                            "words": ws,
                            "wordTimes": [list(times[j]) for j in cur],
                            "start": round(ts[0][0], 3),
                            "end": round(ts[-1][1], 3)})
            cur = []
    return out


def main():
    tr = json.load(open(f"{JOB}/transcript/transcript.json"))["words"]
    beats = json.load(open(f"{JOB}/transcript/beats.json"))

    groups, suppressed, total_anchors = [], [], 0
    for b in beats:
        ref = b["ref"]
        line = LINES.get(ref)
        if line is None:
            suppressed.append({"ref": ref, "start": b["start"], "end": b["end"],
                               "reason": "AI-generated b-roll — creator directive 2026-08-23, "
                                         "no captions over AI b-roll"})
            continue
        spoken = [w for w in tr if w["start"] >= b["start"] - 0.01 and w["end"] <= b["end"] + 0.01]
        english = line.replace("—", "-").split()
        times, na = word_times(spoken, english, b["start"], b["end"])
        total_anchors += na
        for g in group(english, times):
            g["ref"] = ref
            g["isInterjection"] = g["text"].strip().upper() in INTERJECTIONS
            groups.append(g)

    # A chip is ~1-1.5s. Anything much longer means the anchors left a hole inside it, so split
    # it at its widest internal word gap rather than letting one chip sit on screen for 3 seconds.
    def split_long(gs, limit=1.8):
        out = []
        for g in gs:
            if g["end"] - g["start"] <= limit or len(g["words"]) < 4:
                out.append(g); continue
            wt = g["wordTimes"]
            gaps = [(wt[i + 1][0] - wt[i][1], i + 1) for i in range(len(wt) - 1)]
            gaps = [x for x in gaps if 1 <= x[1] <= len(wt) - 1]
            if not gaps:
                out.append(g); continue
            k = max(gaps)[1]
            for part in (slice(0, k), slice(k, None)):
                ws, ts = g["words"][part], wt[part]
                out.append({**g, "text": " ".join(ws), "words": ws, "wordTimes": ts,
                            "start": round(ts[0][0], 3), "end": round(ts[-1][1], 3)})
        return out

    before = len(groups)
    for _ in range(3):
        groups = split_long(groups)
    if len(groups) != before:
        print(f"split {len(groups) - before} over-long chip(s)")

    groups.sort(key=lambda g: g["start"])
    out = {"fps": 25,
           "note": "English translation of the Hinglish VO (creator's own Tab 2 wording). "
                   "Timing anchored on spoken loanwords, NOT evenly distributed. "
                   "Y placement is solved later by caption_solver.py against the rendered graphics.",
           "anchorsMatched": total_anchors,
           "groups": groups,
           "suppressed": suppressed}
    for p in (f"{JOB}/transcript/caption-groups.json", f"{REPO}/transcript/caption-groups.json"):
        json.dump(out, open(p, "w"), ensure_ascii=False, indent=1)

    print(f"groups: {len(groups)}   hard anchors: {total_anchors}")
    print(f"suppressed beats (AI b-roll): {[s['ref'] for s in suppressed]} "
          f"= {sum(s['end']-s['start'] for s in suppressed):.1f}s uncaptioned")
    for g in groups[:8]:
        print(f"  REF{g['ref']:2d} {g['start']:6.2f}-{g['end']:6.2f}  {g['text']}")
    print("  ...")
    for g in groups[-4:]:
        print(f"  REF{g['ref']:2d} {g['start']:6.2f}-{g['end']:6.2f}  {g['text']}")


if __name__ == "__main__":
    main()
