import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {T} from '../tokens';

/**
 * style.md: "No dead space below a table/chart card: fill it with topic-matched motion
 * graphics — a bobbing 3D icon or doodle that matches what the card is about (… mcap mix →
 * piggy …), bottom-left, with the candle doodle bottom-right."
 *
 * The creator's reference frame leaves y1408→1920 bare; the house rule says fill it. Flagged
 * in the harvest as Conflict §6 — following the style file, which is the standing rule.
 *
 * Deterministic bob: pure function of useCurrentFrame(), so a seek to any frame is identical.
 * Per the creator's directive 2026-08-23 these carry shadow-soft like every other element.
 */
export const LowerFill: React.FC<{startFrame?: number; opacity?: number}> = ({startFrame = 0, opacity = 1}) => {
  const f = useCurrentFrame() - startFrame;
  const inA = interpolate(f, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  // slow idle bob, a few px over seconds — 4.4s and 5.6s periods so they never sync up
  const bobL = Math.sin((f / 25) * ((2 * Math.PI) / 4.4)) * 7;
  const bobR = Math.sin((f / 25) * ((2 * Math.PI) / 5.6) + 1.1) * 6;

  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920"
         style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: opacity * inA}}>
      <defs>
        <filter id="doodleShadow" x="-40%" y="-40%" width="200%" height="200%">
          <feDropShadow dx="4" dy="7" stdDeviation="9" floodColor="#000000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* bottom-left: piggy — the card is about market-cap mix */}
      <g transform={`translate(196 ${1596 + bobL})`} filter="url(#doodleShadow)">
        <ellipse cx="0" cy="0" rx="86" ry="64" fill={T.indigo} />
        <ellipse cx="62" cy="-8" rx="30" ry="26" fill={T.indigo} />
        <circle cx="78" cy="-10" r="6" fill={T.white} opacity="0.85" />
        <circle cx="88" cy="-10" r="6" fill={T.white} opacity="0.85" />
        <circle cx="46" cy="-22" r="5.5" fill={T.white} />
        <path d="M -34 -52 L -14 -60 L -18 -34 Z" fill={T.indigo} />
        <path d="M 18 -56 L 40 -60 L 26 -36 Z" fill={T.indigo} />
        <rect x="-52" y="52" width="20" height="26" rx="7" fill={T.indigo} />
        <rect x="8" y="52" width="20" height="26" rx="7" fill={T.indigo} />
        {/* coin slot + a coin dropping in, on the same slow cycle */}
        <rect x="-30" y="-58" width="52" height="9" rx="4.5" fill={T.white} opacity="0.9" />
        <circle cx="-4" cy={-96 + ((f % 110) / 110) * 34} r="15" fill={T.amber} />
      </g>

      {/* bottom-right: the house candle doodle */}
      <g transform={`translate(884 ${1600 + bobR})`} filter="url(#doodleShadow)">
        <rect x="-64" y="-6" width="20" height="54" rx="5" fill={T.indigo} />
        <rect x="-58" y="-30" width="8" height="26" rx="4" fill={T.indigo} />
        <rect x="-58" y="44" width="8" height="20" rx="4" fill={T.indigo} />
        <rect x="-24" y="-46" width="20" height="62" rx="5" fill={T.accent} />
        <rect x="-18" y="-72" width="8" height="30" rx="4" fill={T.accent} />
        <rect x="-18" y="12" width="8" height="22" rx="4" fill={T.accent} />
        <rect x="16" y="6" width="20" height="46" rx="5" fill={T.coral} />
        <rect x="22" y="-14" width="8" height="24" rx="4" fill={T.coral} />
        <rect x="22" y="48" width="8" height="18" rx="4" fill={T.coral} />
      </g>
    </svg>
  );
};
