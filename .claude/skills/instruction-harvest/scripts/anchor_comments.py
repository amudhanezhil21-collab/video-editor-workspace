#!/usr/bin/env python3
"""
Anchor a Google Doc's comments to the exact lines they were left on.

The Drive API returns comment threads sorted by ID, NOT in document order. Pairing them with script
lines top-to-bottom mis-anchors the whole job and the result looks plausible. The HTML export carries
positional markers, so it is the only trustworthy source for WHICH line a comment belongs to.

usage:
  1) download_file_content(fileId, exportMimeType="text/html")  -> save the tool result JSON
  2) anchor_comments.py TOOL_RESULT.json OUTDIR

writes OUTDIR/doc_marked.txt — the script with {{REF n}} inline where each comment sits, and
{{BODY n}} blocks at the bottom holding the comment text.
"""
import base64, html, json, os, re, sys


def load_html(path):
    raw = open(path, encoding="utf-8", errors="replace").read()
    try:
        content = json.loads(raw)["content"]
    except Exception:
        content = raw
    if not content.lstrip().startswith("<"):
        content = base64.b64decode(content).decode("utf-8", errors="replace")
    return content


def main():
    src, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    h = load_html(src)

    # the export is mostly base64 images; strip them first or everything downstream is unreadable
    stripped = re.sub(r"data:image/[^\"')]+", "IMG", h)
    open(os.path.join(outdir, "doc_stripped.html"), "w").write(stripped)

    n_ref = len(re.findall(r"cmnt_ref", stripped))
    n_body = len(re.findall(r'id="cmnt\d+"', stripped))
    print(f"inline comment anchors: {n_ref // 2 if n_ref else 0} refs, {n_body} bodies")
    print("NOTE: resolved comments are omitted from the HTML export — compare this count with the "
          "API's thread list; the difference is resolved threads, which are superseded.")

    t = re.sub(r'<a href="#cmnt(\d+)" id="cmnt_ref\1">\[[a-z]+\]</a>', r"{{REF\1}}", stripped)
    t = re.sub(r'<a href="#cmnt_ref(\d+)" id="cmnt(\d+)">\[[a-z]+\]</a>', r"{{BODY\2}}", t)
    t = re.sub(r"</p>|</h1>|</h2>|</h3>|<br[^>]*>|</tr>", "\n", t)
    t = re.sub(r"</td>", " | ", t)
    t = re.sub(r"<[^>]+>", "", t)
    t = html.unescape(t)
    t = re.sub(r"[ \t]+", " ", t)
    lines = [l.strip() for l in t.split("\n") if l.strip()]

    out = os.path.join(outdir, "doc_marked.txt")
    open(out, "w").write("\n".join(lines))
    print("wrote", out)

    # every URL found anywhere — these are the next level of the harvest
    urls = sorted(set(re.findall(r"https?://[^\s)>\"]+", t)))
    urls = [u for u in urls if "gstatic" not in u and "googleusercontent" not in u]
    print(f"\n{len(urls)} link(s) to follow:")
    for u in urls:
        print("  ", u)


if __name__ == "__main__":
    main()
