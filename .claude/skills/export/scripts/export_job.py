#!/usr/bin/env python3
"""
Promote the newest real render to one unambiguous final, and retire the drafts.

Dry run by default. Nothing is deleted or moved until --apply is passed, and the
"never delete anything newer than the deliverable" guard lives INSIDE this script
so a later session cannot talk itself past it.

usage:
  export_job.py JOBDIR [--apply] [--reclaim] [--copy-to DIR]
"""
import argparse, os, shutil, subprocess, sys, time

KEEP_ALWAYS = ("raw", "transcript", "graphics-build", "instructions", "broll", "audio")
RECLAIMABLE = ("review/pack-", "review/audit-", "review/allframes")


def probe_ok(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                        "-show_entries", "stream=nb_frames", "-of", "csv=p=0", p],
                       capture_output=True, text=True)
    return r.returncode == 0 and r.stdout.strip() not in ("", "N/A")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("job")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--reclaim", action="store_true")
    ap.add_argument("--copy-to")
    a = ap.parse_args()

    out = os.path.join(a.job, "outputs")
    if not os.path.isdir(out):
        sys.exit("no outputs/ in " + a.job)

    vids = [os.path.join(out, f) for f in os.listdir(out)
            if f.lower().endswith((".mp4", ".mov")) and not f.startswith("._")]
    real = [v for v in vids if os.path.getsize(v) > 2_000_000 and probe_ok(v)]
    if not real:
        sys.exit("no complete render found in outputs/")

    # newest REAL render wins; a preview never wins over a master
    masters = [v for v in real if "preview" not in os.path.basename(v).lower()]
    pick = max(masters or real, key=os.path.getmtime)
    job_name = os.path.basename(a.job.rstrip("/"))
    final = os.path.join(out, f"{job_name}-FINAL{os.path.splitext(pick)[1]}")

    print(f"PROMOTE  {os.path.basename(pick)}  ->  {os.path.basename(final)}")
    retire = [v for v in real if v != pick and v != final]
    for v in retire:
        newer = os.path.getmtime(v) > os.path.getmtime(pick)
        print(f"{'KEEP (newer than the deliverable - guard)' if newer else 'RETIRE':<44} {os.path.basename(v)}")
    print("KEEP     " + ", ".join(KEEP_ALWAYS))

    if a.reclaim:
        for root, dirs, _ in os.walk(a.job):
            for d in list(dirs):
                rel = os.path.relpath(os.path.join(root, d), a.job)
                if any(rel.startswith(x) for x in RECLAIMABLE):
                    sz = sum(os.path.getsize(os.path.join(dp, f))
                             for dp, _, fs in os.walk(os.path.join(root, d)) for f in fs) // 1048576
                    print(f"RECLAIM  {rel}  ({sz} MB)")

    if not a.apply:
        print("\n-- dry run. Nothing changed. Re-run with --apply once this plan reads correctly. --")
        return

    shutil.copy2(pick, final)
    for v in retire:
        if os.path.getmtime(v) > os.path.getmtime(pick):
            continue                     # the guard, enforced here and not in prose
        os.remove(v)
    if a.copy_to:
        shutil.copy2(final, os.path.join(a.copy_to, os.path.basename(final)))
    print("\napplied.")


if __name__ == "__main__":
    main()
