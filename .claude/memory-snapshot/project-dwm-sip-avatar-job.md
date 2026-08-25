---
name: project-dwm-sip-avatar-job
description: "Job daily-vs-weekly-vs-monthly-sip-avatar (started 2026-08-23 evening): the SIP-frequency script rebuilt with NO creator footage — HeyGen 'Aleena' avatar + ElevenLabs 'Aleena Rais' clone + generated background; state, blockers, decisions"
metadata: 
  node_type: memory
  type: project
  originSessionId: 20728406-7896-4f82-bd7c-84472c5f6eb4
  modified: 2026-08-23T15:42:15.412Z
---

**Job:** `projects/daily-vs-weekly-vs-monthly-sip-avatar` → symlink to
`/Volumes/Extreme SSD/video-editor-jobs/daily-vs-weekly-vs-monthly-sip-avatar` (user: "do everything
in SSD"). Remotion project at `/Volumes/vedev/jobs/daily-vs-weekly-vs-monthly-sip-avatar/remotion`
(node_modules symlinked to `/Volumes/vedev/graphics-build/remotion/node_modules`). Spec:
`assets/harvest/edit-spec.md` in the job (anchors REF1–REF7 + chat directives + b-roll style brief).

**What it is (2026-08-23):** same script/comments as the earlier `daily-vs-weekly-vs-monthly-sip` job
(4 reviewed drafts, creator footage), but the creator asked for an edit *without* her footage: the
presenter is her **HeyGen avatar** — private group "Aleena" (`6d745a6df8ac4cac877d8945fb16fc9b`),
portrait looks: digital twin `0cfe6cc1a53e442f93bd4135f5336eae` ("Aleena (Eye Contact Correction)",
720x1280) and photo avatar `21433ed1c489457fa5aa7848283bf185` ("Serene Elegance", 768x1365) — over a
generated background matching her reference photo (`assets/refs/background-ref.png`: teal wall, brick +
bookshelf left, brass lamp + painting right). 9:16 Shorts, groww-shorts style.

**Voice:** ElevenLabs cloned voice **"Aleena Rais"** `jn5XDoGkL6DX0VwSknae` (starter tier, ~35k chars
left). Plain-Latin Hinglish mangles numbers (₹6,997 → "6… 9.97"); Devanagari text with spelled-out
Hindi number words is the safer input. Score variants by WhisperX (`--language hi`) re-transcription.

**BLOCKER 2026-08-23 21:05:** HeyGen v3 `POST /v3/videos` returns `insufficient_credit` — the API
wallet (billing_type wallet, `james.bond@groww.in`) is $0; API credits are separate from the app plan.
User asked to top up or approve a fallback. Higgsfield CLI has NO lip-sync/avatar model (only
Seedance/Kling/Veo/Wan + background removers); Kie.ai has 7,288 credits — check its market for a
lipsync model if the user picks fallback. HeyGen v3 API facts: `output_format: "webm"` = transparent
background; `audio_asset_id` via `POST /v3/assets` (multipart `file`, ≤32MB); `aspect_ratio: "9:16"`,
`resolution: "1080p"`; poll `GET /v3/videos/{id}` (status pending/processing/completed/failed,
`video_url`).

**Other machine facts:** two other Claude sessions were concurrently active on vedev (smallcap,
flexi-cap jobs) — CPU/disk contention; iCloud has evicted most small repo files (brand.md, fonts, skill
scripts) and `brctl download` does not rehydrate while the internal drive is <6GB free — SSD copies:
fonts/logos at `/Volumes/vedev/graphics-build/remotion/public/`, brand.md (Aug 17) at
`/Volumes/Extreme SSD/VIideo Editor/brand.md`.

**Decisions stated to the user:** b-roll (REF4/REF6) in the gouache/children's-book style from the
reference short `d97J4TbIwXw` (chat brief wins over the comment's "ultra realistic"); REF2 coin bags
and REF5 hourglass reuse the previous job's keyed clips; REF7 subscribe/like unit built on the
channel's outro grammar (the reference short has none); music bed = user's
`_A_Promise_of_Hope_Emotional_Piano_Strings.mp3` (copied to `audio/music-bed.mp3`).

See [[project-pipeline-state]] for the earlier jobs and [[lesson-whisperx-hallucinated-timeline]].

**State 2026-08-23 ~21:30:** VO final = `audio/vo.mp3` (66.08s; Devanagari + spelled-out Hindi
numbers, `<break time="0.45s"/>` between paragraphs; exact word/line timings in
`transcript/lines.json` from the ElevenLabs with-timestamps alignment; WhisperX record in
`transcript/transcript.json` — its word ALIGNMENT drops L5/L9 timings though the text is complete, so
lines.json is the timing authority). Plan + cutsheet in `graphics-build/` (plan.md, cutsheet.json);
assemble.py / build_base.py / heygen_aroll.py written there. Background plate done
(`assets/background-plate.png`, gpt_image_2 from her photo). REF4 gouache still done
(`broll/stills/ref4-three-people.png`: woman DAILY / moustache man WEEKLY / older man MONTHLY, equal
coin stacks). Two workflows were running: `dwm-sip-avatar-assets` (b-roll i2v + critics) and
`dwm-sip-avatar-graphics-build` (Remotion builders per graphic + critics) — outputs land in
`/Volumes/vedev/jobs/daily-vs-weekly-vs-monthly-sip-avatar/remotion/out/`. Still waiting on the
creator's HeyGen decision; when funded: `python3 graphics-build/heygen_aroll.py JOB --poll`, then
`build_base.py`, then `assemble.py`, then the finishing review loop (brief in
`assets/harvest/review-brief.md`).

**Avatar pivot 2026-08-24 ~01:50 (creator, explicit):** the presenter is **PRISHITA**, not Aleena —
group `244a1e61b969427f80fefec6c9d08f0c`, chosen look `5d526684e483401faa26e886c229da33` ("Prishita in
a maroon blazer", photo_avatar, 1536x2752 portrait, engines v/iv/iii; group also has digital twins
that avatar_v uses as animation reference). Voice: creator chose **keep the existing VO track**
(Aleena-Rais-clone ElevenLabs render) — timings stay. HeyGen access is via **their MCP
(mcp.heygen.com, OAuth Bearer in `_heygen/oauth/token.json`, client mcp.py)** which bills the
SUBSCRIPTION credits (4,000 add-on) — the API-key wallet stays $0/blocked. S3 asset uploads need the
signed `x-amz-server-side-encryption: AES256` header. Full VO uploaded as asset
`edba5ea619f541c2bcfb5342c62d392a`. 7s webm tests on Aleena looks came back CLEAN: 1080x1920 **25fps
native**, VP9 alpha_mode 1 (~27% transparent), opus audio track (strip at composite).

**Overnight run 2026-08-24 02:00-03:30:** full Prishita A-roll rendered (66.06s transparent webm,
native 25fps) → base built (gesture-capped fit; zooms anchored on the MEASURED face from
base-fit.json) → draft2 assembled → 44-agent blind review: 37 findings, 28 confirmed / 9 refuted.
Root causes + fixes: (1) takeover overlays must be GATED to end at the leak PEAK frame (start+7) at
assemble time — they held to the leak end and re-emerged after the blowout (critical x3); (2) the
LightLeak comp peaks ~235 mean luma after compositing — a one-frame white@0.93 lavfi overlay at each
peak supplies the true blowout; (3) the 60.03s music bed ends before the 66.6s video — crossfade-loop
it into itself (acrossfade d=2) then 1s tail fade; (4) REF1 zoom must HOLD at 1.06 until the REF3
white flash hides the reset (snap-back mid-take reads as a glitch); (5) REF6 "coming" supplied by an
8% push-in on the b-roll layer at composite. Remotion fixes (workflow): REF3 old-highlight fade must
COMPLETE before the next sweep starts (3-frame double-highlight at handovers); L4 caption English
reordered to the spoken clause order ("From August 1996 to June 2026, ..." — dates first, anchored).
Review-refuted traps to remember: reviewers misread SFX timing from envelopes (xcorr said exact),
"-18 dB bed" is the applied GAIN not the measured RMS, and the 6.31% duplicate-frame figure was a
global-MAD artifact on static table holds. review-r1-confirmed.json in graphics-build/.

**DELIVERED 2026-08-24 ~03:55:** `outputs/daily-vs-weekly-vs-monthly-sip-avatar-final.mp4` (66.60s,
1665f @25, 113MB; copy in ~/Downloads; draft1/2 parked in outputs/drafts). Draft3 = draft2 + all 28
review fixes; focused re-verification measured clean: one >240 white-out frame per leak
(251.6/251.9/251.8/250.4), takeovers cut AT the peaks (post-peak frames correlate 0.33-0.93 with
b-roll, negative vs table), zoom hold (f82→83 diff 3.4), bed present in every gap
(-32..-41 dBFS) fading only at the tail, L4 captions date-first & anchored, REF6 push-in reads,
0.00% duplicate frames. Standing corrections absorbed WITH diffs pending creator ack: style.md
(leak cut gated at peak frame + one-frame white plate @0.93; zoom ramps never snap back — hold until
a covering transition) and finishing-pass SKILL.md (check bed duration vs video, crossfade-loop a
short bed; "-18dB" is applied gain not target RMS). Open with the creator: none blocking — voice is
the kept Aleena-Rais-clone track by their explicit choice; "ultra realistic" vs gouache b-roll
conflict resolved to the chat brief; subscribe/like unit is the channel outro grammar
interpretation.
**Post-delivery fix 2026-08-24 ~04:20 (creator: mask had a lot of headroom):** the Haar-derived face box over-extends upward — the face-in-mask crop now measures the REAL hair top from the fitted layer alpha (y~423 vs assumed 261) and leaves 5% headroom, face = 78% of crop width. draft4 promoted to final. Standing rule: NEVER derive a PIP/mask crop from a Haar box — measure the silhouette.
