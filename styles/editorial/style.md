# Style: editorial

Creative direction for the default look. The bar for this file: **you can make new videos in this style from this file alone, without rewatching any reference.** If it reads like a mood board of adjectives, it is not done.

## What this style is

Calm, print-inspired short-form explainer. Feels like a well-set magazine page that happens to move. Restraint over energy: few elements, generous space, one accent moment per scene. Face carries the delivery; graphics carry the evidence.

## Scene vocabulary

The scenes this style uses and what they are called:

- **head** — full-frame talking head, no graphics. The default state.
- **takeover** — full-frame graphic, face gone. For stats, charts, diagrams.
- **pip** — face shrinks into a picture-in-picture corner while a graphic owns the frame. Enters once per graphics run; everything between the entry and exit chains within the PiP layout.
- **card** — lower-half or upper-half card over the head shot. For labels, chips, small stats.

## Transition mechanics at every boundary

- **head → takeover:** graphic wipes in from the bottom over 0.35s with a named ease (`power3.out`). Never a crossfade.
- **takeover → head:** graphic exits with a designed exit (slide up + fade over 0.3s, hard-killed at the boundary). Face is simply there underneath — no re-entrance animation on the face.
- **graphic → graphic:** hard cut between card contents is fine. Never bounce out to full-frame face and back in between graphics.
- **into/out of pip:** PiP geometry animates once on entry (0.4s, `power2.inOut`) and once on exit. Between those, only the graphic layer changes.

## Picture-in-picture geometry (exact)

- Short form: face PiP bottom band, 420px wide, anchored 60px from left edge, 80px above the 300px bottom background band. Rounded 24px, 2px `$rule` border.
- Long form: face PiP bottom-right, 480×270, 48px margins, no border, 12px radius.

## Title card anatomy

Hook card: `$bg` panel, headline in display font at 120–160px, one `$accent` underline element that draws in (0.4s, after the text reveal), one supporting line in `$muted`. Never more than three text elements on a title card.

## Camera behaviour inside a scene

Slow push-in on head scenes longer than 8s (2–3% scale over the scene, FFmpeg geometry, never the browser). No motion on head scenes under 8s. Takeovers get internal motion (count-ups, draws, staggers) instead of camera motion.

## Texture

Backgrounds are never flat: fine grid at 8% opacity in `$rule`, or a soft radial vignette toward `$accent-soft`. No noise, no gradients louder than 10% between stops.

## Font jobs

- Display font: hook cards, big stats, takeover headlines.
- Caption font: captions, chips, labels, axis text, everything small.
- Never a third font.

## Measured pacing

- Caption groups: 2–4 words per group, lead the audio by ~80ms.
- Stat count-ups: 60% of the beat window, minimum 1.2s, never finish in the first third of a long beat.
- Stagger between entering elements: 0.4s minimum.
- Graphics hold until the next part starts — no early fade leaving dead air.

## Extended style colours (style-level, not brand tokens)

- **Callout pills:** indigo `#5367FC`. Pills, tags, and callout chips use this, not `$accent`.
- **Down / negative accent:** coral `#F26B55` is reserved exclusively for negative movement (losses, drops, red-flag stats). Never decorative.
- `$accent` green remains the up/positive and primary brand moment.

## Notes

This is a starter style. Every review correction that should apply to all future videos gets absorbed into this file (and its knobs into `style.json`) before a job closes.
