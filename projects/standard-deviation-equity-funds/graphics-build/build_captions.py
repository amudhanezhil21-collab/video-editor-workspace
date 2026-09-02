#!/usr/bin/env python3
"""
Caption groups for standard-deviation-equity-funds.

brand.md: captions are an ENGLISH TRANSLATION of the Hinglish VO — never a raw transcript, never
Devanagari. Translation source: Tab 1 of the creator's own script doc (her English draft), lightly
reordered to HER SPOKEN clause order per beat. Karaoke word timing comes from hard anchors:
the English loanwords she speaks inside the Hinglish (WhisperX writes many in Devanagari —
transliterate, then greedy-forward match). Interpolate between anchors only.

Creator directive 2026-08-23 (style file): NO captions over AI-generated b-roll -> segs 2,7,8 None.
Placement is NOT decided here; solve_captions measures against the rendered composite.
"""
import json, re, os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

LOANWORDS = {
    "इक्विटी":"equity","फंड":"fund","फंड्स":"funds","रिटर्न्स":"returns","रिटर्न":"return",
    "वोलेटाइल":"volatile","वोलैटिलिटी":"volatility","स्टैंडर्ड":"standard","डेविएशन":"deviation",
    "एवरेज":"average","एनुअल":"annual","परसेंट":"percent","बेंचमार्क":"benchmark",
    "कैटेगरी":"category","कंपैरिजन":"comparison","रिस्क":"risk","इन्वेस्ट":"invest",
    "इंवेस्ट":"invest","मेट्रिक्स":"metrics","चेक":"check","रेशो":"ratio","शार्प":"sharpe",
    "सॉर्टिनो":"sortino","अल्फा":"alpha","डाउनसाइड":"downside","कंसिस्टेंट":"consistent",
    "एक्सपीरियंस":"experience","रोलर":"roller","कोस्टर":"coaster","फैक्टर":"factor",
    "फ्लक्चुएट":"fluctuate","इलस्ट्रेशन":"illustration","जेनरेट":"generate","परफॉर्मेंस":"performance",
}

# seg index -> creator's English (Tab 1 wording, her spoken clause order). None = suppressed.
LINES = {
    0:"Hey, do you know how risky your equity fund is?",
    1:"Well, standard deviation shows you how volatile your equity fund is.",
    2:None,   # AI b-roll: trading terminal
    3:"For example, if a fund's average annual return is 10% and standard deviation is 6%,",
    4:"in a typical year returns can fluctuate between 4% and 16%.",
    5:"But with the same 10% average annual return and a standard deviation of 12%,",
    6:"returns could swing from -2% to 22%.",
    7:None,   # AI b-roll: roller coaster
    8:None,   # AI b-roll tail
    9:"If a fund's standard deviation is higher than its benchmark or category, its returns have been relatively more volatile.",
    10:"Here are equity funds with higher standard deviation than their benchmark and category.",
    11:"And these funds carry lower standard deviation than their benchmark and category.",
    12:"So what if your equity funds are relatively more volatile than the rest?",
    13:"Higher standard deviation doesn't mean the fund is bad.",
    14:"It just means the fund is more volatile.",
    15:"Funds that move up sharply could also face higher downside risk.",
    16:"Lower standard deviation means the fund is relatively more consistent.",
    17:"Now, should one avoid funds with higher standard deviation?",
    18:"NOT NECESSARILY.",   # interjection chip
    19:"A fund with higher standard deviation isn't automatically a bad fund.",
    20:"It also depends on your risk tolerance and the fund's risk-return profile.",
    21:"So standard deviation shouldn't be the only deciding factor.",
    22:"You can also check the fund's Alpha, Sharpe and Sortino ratios for risk-adjusted returns.",
    23:"Sharpe ratio shows return earned for the risk taken, while Sortino focuses on downside risk.",
    24:"So don't judge a fund by its standard deviation alone.",
    25:"Look at risk and risk-adjusted performance along with returns.",
}

def norm(tok):
    t=tok.strip().strip("।,.?!\"'…").lower()
    return LOANWORDS.get(t,t)

def main():
    tr=json.load(open('transcript/transcript.json'))
    segs=tr['segments']
    groups=[]; suppressed=[]; matched=0; total=0
    for i,seg in enumerate(segs):
        line=LINES.get(i)
        if line is None:
            suppressed.append({"seg":i,"why":"AI b-roll (creator directive: no captions over AI b-roll)"})
            continue
        ewords=line.split()
        etok=[re.sub(r"[^a-z0-9%\-]","",w.lower()) for w in ewords]
        sw=[w for w in seg.get('words',[]) if 'start' in w]
        anchors=[]; si=0
        for ei,e in enumerate(etok):
            if not e: continue
            for j in range(si,len(sw)):
                s=norm(sw[j]['word'])
                s=re.sub(r"[^a-z0-9%\-]","",s)
                if not s: continue
                if s==e or (len(e)>3 and (s.startswith(e[:4]) or e.startswith(s[:4]))) or \
                   (e in ("10%","6%","12%","4%","16%","22%","-2%") and re.sub(r"[^0-9%\-]","",sw[j]['word'])==e):
                    anchors.append((ei,sw[j]['start'],sw[j]['end'])); si=j+1; break
        total+=len([e for e in etok if e]); matched+=len(anchors)
        t0,t1=seg['start'],seg['end']
        times=[None]*len(ewords)
        for ei,a,b in anchors: times[ei]=[round(a,3),round(b,3)]
        # interpolate the unanchored words between neighbouring anchors (or seg bounds)
        idx=[k for k,v in enumerate(times) if v]
        for k in range(len(times)):
            if times[k]: continue
            prev=max([j for j in idx if j<k],default=None)
            nxt=min([j for j in idx if j>k],default=None)
            a=times[prev][1] if prev is not None else t0
            b=times[nxt][0] if nxt is not None else t1
            span_ct=(nxt if nxt is not None else len(times))-(prev+1 if prev is not None else 0)
            pos=k-(prev+1 if prev is not None else 0)
            step=(b-a)/max(span_ct,1)
            times[k]=[round(a+pos*step,3),round(a+(pos+1)*step,3)]
        # split into chip groups of 2-6 words (interjections stay whole)
        interj=line.isupper()
        if interj:
            chunks=[(0,len(ewords))]
        else:
            chunks=[]; k=0
            while k<len(ewords):
                n=min(5,len(ewords)-k)
                if len(ewords)-k-n==1: n=min(6,len(ewords)-k)  # avoid orphan
                chunks.append((k,k+n)); k+=n
        for a,b in chunks:
            groups.append({"text":" ".join(ewords[a:b]),"words":ewords[a:b],
                           "wordTimes":times[a:b],"start":times[a][0],"end":times[b-1][1],
                           "seg":i,"isInterjection":interj})
    out={"fps":30,"note":"Tab-1 creator English; karaoke via loanword anchors","anchorsMatched":f"{matched}/{total}","groups":groups,"suppressed":suppressed}
    json.dump(out,open('transcript/caption-groups.json','w'),indent=1,ensure_ascii=False)
    print(f"groups {len(groups)}  anchors {matched}/{total}  suppressed segs {[s['seg'] for s in suppressed]}")
    for g in groups[:8]: print(f"  {g['start']:6.2f}-{g['end']:6.2f}  {g['text']}")

main()
