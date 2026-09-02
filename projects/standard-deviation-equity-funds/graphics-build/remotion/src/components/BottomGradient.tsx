import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

/**
 * Bottom gradient — creator's spec: "a subtle gradient at the bottom part of the video
 * should arise", "25% coverage", "dissolve in / dissolve out", feathered with "no line".
 *
 * style.md golden rule: "any top or bottom gradient band uses a smooth cosine falloff that
 * reaches fully transparent — never a linear ramp that terminates mid-frame with a visible edge."
 * So: alpha(u) = peak * (0.5 - 0.5*cos(pi*u)) — zero VALUE and zero DERIVATIVE at the onset,
 * which is what kills the visible line.
 *
 * Z-order rule: background -> gradient -> logo/chrome. The chrome layer composites above this.
 */
const STOPS = 40;

export const BottomGradient: React.FC<{
  coveragePct?: number;   // share of frame height, from the bottom
  peak?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  totalFrames: number;
}> = ({coveragePct = 25, peak = 0.85, fadeInFrames = 10, fadeOutFrames = 10, totalFrames}) => {
  const f = useCurrentFrame();

  // dissolve in / dissolve out (opacity of the whole layer, not a wipe or a grow)
  const dissolve = Math.min(
    interpolate(f, [0, fadeInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(f, [totalFrames - fadeOutFrames, totalFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );

  const stops: string[] = [];
  for (let i = 0; i <= STOPS; i++) {
    const u = i / STOPS;                       // 0 at onset (top of band) -> 1 at frame bottom
    const a = peak * (0.5 - 0.5 * Math.cos(Math.PI * u));
    stops.push(`rgba(0,0,0,${a.toFixed(5)}) ${(100 - coveragePct + coveragePct * u).toFixed(3)}%`);
  }

  return (
    <AbsoluteFill
      style={{
        opacity: dissolve,
        background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${stops.join(', ')})`,
        pointerEvents: 'none',
      }}
    />
  );
};
