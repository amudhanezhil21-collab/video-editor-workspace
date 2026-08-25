import React from 'react';
import {Composition} from 'remotion';
import {FRAME} from './tokens';
import {Ref13Table} from './comps/Ref13Table';

/**
 * smallcap-250-index-hidden-midcaps — composition registry.
 *
 * Beat windows come from transcript/beats.json, which is anchored to the word-level
 * transcript, NOT to the script's reading order. Frame = round(seconds * 25).
 */
const F = (s: number) => Math.round(s * FRAME.fps);

// REF13 — the TABLE beat, 50.15 -> 64.55 in the cut.
// Her first figure ("9%") lands at 55.33s, i.e. frame 130 of this beat, so the table must be
// whole well before that. buildEnd = frame 62 (2.48s in) leaves 3.0s of margin.
// Highlight cascade runs "more than 9%" (54.93) -> "kar chuke hain" (58.17).
const REF13_START = 50.15;
const REF13_END = 64.55;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ref13-table"
      component={Ref13Table}
      durationInFrames={F(REF13_END - REF13_START) + 13 /* ~0.5s tail margin per the graphics skill */}
      fps={FRAME.fps}
      width={FRAME.w}
      height={FRAME.h}
      defaultProps={{
        sourceStartFrame: F(REF13_START),
        buildEndFrame: 62,
        highlightFrames: [F(54.93 - REF13_START), F(58.17 - REF13_START)] as [number, number],
      }}
    />
  </>
);
