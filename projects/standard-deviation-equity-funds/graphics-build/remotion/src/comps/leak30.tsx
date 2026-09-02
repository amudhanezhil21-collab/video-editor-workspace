import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
// Reuse the measured 13-frame @25fps leak by nearest-neighbour resampling to 16 frames @30fps
// (0.52s preserved). The measured component itself is untouched per SHARED-API.
// Peak (measured index 7) lands at wrapper frame round(7*15/12)=9; the assemble script cuts
// beats at leakStart+9 and drops the one-frame white plate there (style.md leak rules).
import {LEAK_FRAMES} from '../components/LightLeak';

// Import the internals by re-rendering LightLeak with a remapped frame is not possible from
// outside (it reads useCurrentFrame itself), so we re-export a remapped wrapper via context:
// Remotion's <Freeze> can pin a child's frame. Freeze is the sanctioned way to remap.
import {Freeze} from 'remotion';
import {LightLeak} from '../components/LightLeak';

export const LEAK30_FRAMES = 16;

export const LEAK30_PEAK = 9;

export const Leak30: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.round((Math.min(f, LEAK30_FRAMES - 1) * (LEAK_FRAMES - 1)) / (LEAK30_FRAMES - 1));
  return (
    <>
      <Freeze frame={idx}>
        <LightLeak />
      </Freeze>
      {/* The reference has exactly ONE pure-white blowout frame (~251 RGB). The measured shader
          alone peaks ~235 under the screen blend, so the white plate is baked HERE, riding the
          same stream as the leak — an assemble-side overlay proved frame-misaligned (PTS jitter
          across 50 filter stages put it a frame off at 3 of 4 sites). Through the composite
          blend expr, 0.98 white lands at ~251, matching the reference. */}
      {f === LEAK30_PEAK && (
        <div style={{position: 'absolute', inset: 0, background: '#FFFFFF', opacity: 0.98}} />
      )}
    </>
  );
};
