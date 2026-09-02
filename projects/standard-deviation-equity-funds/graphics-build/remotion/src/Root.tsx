import React from 'react';
import {Composition} from 'remotion';
import {FRAME} from './tokens';
import {Chrome} from './components/Chrome';
import {SebiOpen, B15Outro} from './comps/furniture';
import {Leak30, LEAK30_FRAMES} from './comps/leak30';
import {Captions} from './comps/captions';
import {B3Volatility, B4Volatility} from './comps/volatility';
import {TableCompositions} from './comps/tables';
import {B8bStamp, B10QuestionWidget, B11RiskTolerance, B13Ratios, B14SharpeSortino} from './comps/support';

/**
 * standard-deviation-equity-funds — composition registry.
 * Beat windows come from transcript/cutsheet.json (word-anchored). Frame = round(t * 30).
 * The base runs 143.7s = 4311 frames @ 30fps.
 */
const F = (s: number) => Math.round(s * FRAME.fps);
const TOTAL = 4311;

// Chrome knockback windows (style.md: bugs at 35% over light data-card layouts):
// B3+B4 takeovers 17.95-40.49, B7+B8 tables 56.57-68.50, B11 top panel 102.64-111.83,
// B14 takeover 126.04-134.24.
const KNOCK: [number, number][] = [
  [F(17.95), F(40.49)],
  [F(56.57), F(68.50)],
  [F(102.64), F(112.57)],
  [F(126.04), F(134.24)],
];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="b3-volatility" component={B3Volatility} durationInFrames={369}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} defaultProps={{}} />
    <Composition id="b4-volatility" component={B4Volatility} durationInFrames={337}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} defaultProps={{}} />
    <TableCompositions />
    <Composition id="b10-question" component={B10QuestionWidget} durationInFrames={168}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} defaultProps={{totalFrames: 168}} />
    <Composition id="b11-risk-tolerance" component={B11RiskTolerance} durationInFrames={298}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} defaultProps={{totalFrames: 298}} />
    {/* B13 runs 273f (not the delivered 264) so its baked exit completes under the leak
        whose peak sits at abs f3781 — a 264f render fades out in the open. */}
    <Composition id="b8b-stamp" component={B8bStamp} durationInFrames={240}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} defaultProps={{totalFrames: 240}} />
    <Composition id="b13-ratios" component={B13Ratios} durationInFrames={273}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} defaultProps={{totalFrames: 273}} />
    <Composition id="b14-sharpe-sortino" component={B14SharpeSortino} durationInFrames={246}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} defaultProps={{totalFrames: 246}} />
    <Composition id="chrome" component={Chrome} durationInFrames={TOTAL}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h}
      defaultProps={{knockBackRanges: KNOCK}} />
    <Composition id="sebi-open" component={SebiOpen} durationInFrames={F(4.0)}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} />
    <Composition id="captions" component={Captions} durationInFrames={TOTAL}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} />
    <Composition id="leak30" component={Leak30} durationInFrames={LEAK30_FRAMES}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} />
    <Composition id="b15-outro" component={B15Outro} durationInFrames={F(143.23 - 134.91) + 3}
      fps={FRAME.fps} width={FRAME.w} height={FRAME.h} />
  </>
);
