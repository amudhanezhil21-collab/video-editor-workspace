import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

/**
 * Persistent corner branding — rebuilt 2026-08-23 from the creator's own reference screenshot and
 * the two official logo files she supplied (assets/logos/).
 *
 * style.md's ORIGINAL spec was right and matches her screenshot: a "Groww shorts" badge top-LEFT
 * *and* the Groww mark top-RIGHT. A stale `learned` note in style.json had claimed "wordmark
 * top-right only, white logo on small indigo chip", which is what the earlier build followed.
 *
 * Geometry from style.md, cross-checked against the screenshot:
 *   badge  top-left : circle centre ~(98,98), lockup running to x~245
 *   capsule top-right: x 815-1015, y 70-125
 *
 * Both files are white-artwork-on-transparent, so they carry a soft drop shadow to hold up over
 * bright footage — "same drop shadows" per her note.
 *
 * style.md: "Persistent corner branding from frame 1 on 100% of frames, rendered as the topmost
 * layer — above b-roll, takeovers, and even full-frame wipe covers."
 */
const BADGE = {x: 62, y: 63, h: 70};      // aspect 2.564 -> w ~180, circle centre lands ~(97,98)
const CAPSULE = {x: 815, y: 71, w: 200};  // aspect 3.854 -> h ~52, so it sits inside y70-125

const SHADOW = 'drop-shadow(0 3px 7px rgba(0,0,0,0.42)) drop-shadow(0 1px 2px rgba(0,0,0,0.30))';

export const Chrome: React.FC<{knockBackRanges?: [number, number][]}> = ({knockBackRanges = []}) => {
  const f = useCurrentFrame();
  // style.md: "Both bugs knock back to ~35% opacity over the light data-card layouts."
  let opacity = 1;
  for (const [a, b] of knockBackRanges) {
    if (f >= a && f < b) opacity = 0.35;
  }

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <Img
        src={staticFile('logos/groww-shorts-badge.png')}
        style={{position: 'absolute', left: BADGE.x, top: BADGE.y, height: BADGE.h, width: 'auto',
                filter: SHADOW, opacity}}
      />
      <Img
        src={staticFile('logos/groww-capsule.png')}
        style={{position: 'absolute', left: CAPSULE.x, top: CAPSULE.y, width: CAPSULE.w, height: 'auto',
                filter: SHADOW, opacity}}
      />
    </AbsoluteFill>
  );
};
