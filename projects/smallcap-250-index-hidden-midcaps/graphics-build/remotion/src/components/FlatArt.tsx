import React from 'react';
import {T} from '../tokens';

/**
 * Flat-vector illustrations in the style the creator pointed at:
 * "flat vector with a heavy dark-navy outline, flat unshaded fills, a slightly hand-drawn
 * wobble to the strokes, and a small muted palette. NOT 3D, NOT gradient-shaded, NOT line art."
 *
 * Palette is mapped onto brand.md tokens (CLAUDE.md: never hardcode hex):
 *   reference dark-navy outline #2C335E -> T.ink
 *   reference cornflower blue        -> T.indigo
 *   reference sea-green              -> T.mint
 *   reference off-white              -> T.white
 *
 * Size rule from the spec is HEIGHT-driven: ~10.3% of frame height = ~199px at 1080x1920.
 */

const SW = 7; // outline stroke width in the 200-unit viewBox — reads as the reference's heavy outline

export const ThumbsUp: React.FC<{height: number; flip?: boolean}> = ({height, flip}) => (
  <svg viewBox="0 0 200 200" height={height} width={height} style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <g stroke={T.ink} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round" fill="none">
      {/* cuff */}
      <path d="M44 108 q-4 -6 2 -8 l30 -4 q6 -1 6 6 l0 62 q0 7 -6 6 l-30 -4 q-6 -1 -2 -8 z" fill={T.indigo} />
      {/* palm + fingers */}
      <path d="M84 96 q10 -3 14 -12 l16 -38 q4 -10 14 -8 q11 2 10 15 l-4 34 q-1 6 5 6 l30 0 q14 0 14 14 q0 9 -8 12 q7 3 6 12 q-1 9 -10 11 q6 4 4 12 q-2 8 -11 9 q5 4 2 11 q-3 7 -12 7 l-48 0 q-12 0 -22 -7 z" fill={T.mint} />
      {/* knuckle creases — the hand-drawn wobble */}
      <path d="M150 119 q-9 2 -18 1" strokeWidth={4} />
      <path d="M152 142 q-9 2 -18 1" strokeWidth={4} />
      <path d="M148 165 q-9 2 -18 1" strokeWidth={4} />
    </g>
  </svg>
);

/** Flat-vector piggy bank, drawn in the same outlined style. */
export const PiggyBank: React.FC<{height: number}> = ({height}) => (
  <svg viewBox="0 0 240 200" height={height} width={height * 1.2} style={{overflow: 'visible'}}>
    <g stroke={T.ink} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
      {/* back legs */}
      <path d="M58 148 l0 30 q0 6 -7 6 l-10 0 q-7 0 -7 -6 l0 -30 z" fill={T.indigo} />
      <path d="M186 148 l0 30 q0 6 -7 6 l-10 0 q-7 0 -7 -6 l0 -30 z" fill={T.indigo} />
      {/* body */}
      <ellipse cx="118" cy="106" rx="86" ry="62" fill={T.mint} />
      {/* ear */}
      <path d="M150 52 q14 -26 30 -20 q10 4 4 26 q-4 14 -16 16 z" fill={T.indigo} />
      {/* snout */}
      <ellipse cx="202" cy="112" rx="26" ry="22" fill={T.indigo} />
      <circle cx="196" cy="110" r="4.5" fill={T.ink} stroke="none" />
      <circle cx="210" cy="110" r="4.5" fill={T.ink} stroke="none" />
      {/* eye */}
      <circle cx="168" cy="86" r="6" fill={T.ink} stroke="none" />
      {/* coin slot */}
      <path d="M92 56 l44 0" strokeWidth={11} />
      {/* front legs */}
      <path d="M84 152 l0 28 q0 6 -7 6 l-10 0 q-7 0 -7 -6 l0 -28 z" fill={T.mint} />
      <path d="M162 152 l0 28 q0 6 -7 6 l-10 0 q-7 0 -7 -6 l0 -28 z" fill={T.mint} />
      {/* curly tail */}
      <path d="M32 92 q-16 -4 -14 10 q2 12 14 8" fill="none" strokeWidth={6} />
    </g>
  </svg>
);
