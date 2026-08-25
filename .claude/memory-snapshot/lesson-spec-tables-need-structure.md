---
name: lesson-spec-tables-need-structure
description: "Never reconstruct a data table's structure from a prose description of it — find the structured source (or ask for it); inferring where labels end and values begin produced a whole edit the creator rejected"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1098f93b-0a91-4c2f-a23a-c7fa8c3f11dc
  modified: 2026-08-17T19:48:04.482Z
---

On invesco-vs-motilal (2026-08-17) the first full build was rejected outright
("your video came as shit"). The single biggest cause: the instruction sheet's
per-beat section described tables only in **prose** — measured geometry plus the
cell contents run together into one string, e.g.
`"Definition | An open ended equity mutual fund … of the Indian market Asset
allocation | Minimum investment in equity …"`. I inferred where a label ended
and a value began, and 127 data panels rendered as full-width text rows with a
dead empty column beside them.

The creator then supplied an updated sheet whose **§3 gave every data element as
a real table** — declared row × column counts, cells, and the source line — plus
a separate "Source Assets" PDF containing the actual screenshots. With that,
all 23 elements parsed exactly and 273 beats got genuine tables.

**Why:** a prose description of a table is lossy in exactly the dimension that
matters. No amount of heuristic splitting recovers it, and the failure is
invisible in code review — it only shows when rendered.

**How to apply:**
- If a spec describes tabular data as prose, **stop and ask whether a structured
  version exists** before building. It usually does (the script doc, the source
  deck, an appendix).
- When a document declares dimensions ("2 rows × 3 columns"), treat that as
  **ground truth** and reconcile the parse against it. Row counts that come out
  as an exact multiple mean cells are splitting across baselines; counts that
  come out slightly high mean a cell wrapped. Fold continuations until the
  declared count is met.
- Recover columns from **real PDF word x-coordinates** (pymupdf `get_text("words")`
  clustered into column edges), never from whitespace runs — a cell containing
  spaces ("Consumer Discretionary", "Oct 2024 – Feb 2025 (5 months)") splits
  otherwise. Cluster row baselines with a tolerance (~5pt), not by rounding.
- Drive figure highlights off the **transcript**, not the spec's timecodes:
  match the numbers she actually speaks in a beat against the table's cells.
  That lands the highlight on the spoken figure and needs no timecode mapping.
- Beware spec fields that DESCRIBE the frame instead of quoting copy —
  "(banner shell on screen but still empty — no lettering yet)". 17 beats
  rendered those as on-screen text. Filter parentheticals and descriptive
  phrases out of anything destined for the screen.

Related: [[lesson-remotion-sequence-remount]], [[project-pipeline-state]].
