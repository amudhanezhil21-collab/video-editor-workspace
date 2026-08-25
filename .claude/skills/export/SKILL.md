---
name: export
description: Turn a messy outputs folder into one unambiguous file — promote the newest real render to a clearly named final, retire superseded drafts, keep the reopenable sources, and optionally reclaim scratch space. Dry-run by default, apply flag required, never deletes anything newer than the deliverable.
---

# Skill 5: export

**Whole job:** turn a messy outputs folder into one unambiguous file.

By the end of a job there is a base cut, a graphics pass, a captions pass, a music pass, and two drafts — and in a week nobody will know which one shipped.

## Promote

- Promote the **newest real render** to a single, clearly named final.
- Retire the superseded drafts.
- **Keep** the base cut, the transcript, and the graphics build source, so the job can be reopened.
- Drop a copy somewhere convenient — the Downloads folder.

## Reclaim (separate, optional)

Reclaimable: render scratch, cached intermediate renders, stray `node_modules`.
**Never source footage. Never the outputs folder.**

## The two rules that make this safe enough to trust

1. **Dry run by default, always.** Both halves print exactly what they would promote, delete, and keep — and do nothing until an explicit apply flag is passed after the plan has been read.
2. **Never delete anything newer than the deliverable.** Put that guard **inside the script itself**, comparing modification times, so a future session cannot talk itself past it.

## The script

`scripts/export_job.py` implements both halves with the guards built in:

```bash
python3 scripts/export_job.py JOBDIR                     # dry run - always start here
python3 scripts/export_job.py JOBDIR --reclaim           # dry run, including scratch it would drop
python3 scripts/export_job.py JOBDIR --apply --copy-to ~/Downloads
```

It picks the newest render that actually DECODES (a half-written file is never promoted), never lets
a preview win over a master, and refuses to delete anything newer than the deliverable — that check
is inside the code, not in this document.
