import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, interpolate, useCurrentFrame, Easing} from 'remotion';
import {loadFonts} from '../fonts';
import {FRAME, T, GRADIENT_GROUND as G, REF13} from '../tokens';
import {DataTable} from '../components/DataTable';
import {Chrome} from '../components/Chrome';
import {LowerFill} from '../components/LowerFill';

/**
 * REF13 — the TABLE beat. 50.15 -> 64.55 in the cut (14.41s).
 *
 * Creator's doc (1Ibfjc...): "this type of frame where creator is in square mask, the mask
 * should have drop shadow in it as shown in the reference, maintain similar background as
 * shown in the reference (a gradient of both brand purple and brand green, a subtle grid with
 * a very low opacity). Here there is a graph animation in a white square rounded corner box,
 * instead of bar graph animation, I need chart animation of the table in the script."
 *
 * Every measurement below is from the harvest of her own reference frame, converted to 1080x1920.
 * This is a SEGMENT (opaque, full frame, replaces the footage) because the face is composited
 * inside the mask rather than left showing through.
 */

const GRID_PITCH = G.gridPitch;      // 73px square, measured
const BASE_FPS = FRAME.fps;

export const Ref13Table: React.FC<{
  /** frame offset of this beat inside source.mp4, so the face crop tracks the real take */
  sourceStartFrame: number;
  buildEndFrame: number;
  highlightFrames: [number, number];
}> = ({sourceStartFrame, buildEndFrame, highlightFrames}) => {
  loadFonts();
  const f = useCurrentFrame();
  const {w, h} = FRAME;

  // ---- ground: gradient-ground, 3-stop diagonal at 135deg -----------------
  // Measured: the gradient is carried almost entirely by the green channel rising
  // left->right, so a 2-stop would be wrong. Periwinkle TL -> white mid -> mint BR.
  const grid: React.ReactNode[] = [];
  for (let x = G.gridFirstX; x <= w; x += GRID_PITCH) {
    grid.push(<rect key={`v${x}`} x={x} y={0} width={1} height={h} fill={`rgba(0,0,0,${G.gridAlpha})`} />);
  }
  for (let y = G.gridFirstX % GRID_PITCH; y <= h; y += GRID_PITCH) {
    grid.push(<rect key={`h${y}`} x={0} y={y} width={w} height={1} fill={`rgba(0,0,0,${G.gridAlpha})`} />);
  }

  // ---- face mask entrance -------------------------------------------------
  const maskIn = interpolate(f, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const maskY = interpolate(f, [0, 8], [-26, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{backgroundColor: '#FFFFFF'}}>
      {/* ground */}
      <AbsoluteFill style={{
        background: `linear-gradient(${G.angle}deg, ${G.periwinkle} 0%, ${G.mid} 46%, ${G.mint} 100%)`,
      }} />
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0}}>
        {grid}
      </svg>

      {/* face mask — rounded square 328x400 (0.82:1), r57, top-centre.
          The measured shadow is strictly down-right: peak a~0.36 right / 0.48 bottom at the
          edge, zero by +20px right / +27px down, and NOTHING on the left or top. A single
          symmetric box-shadow cannot do that, so it is two stacked asymmetric shadows. */}
      <div style={{
        position: 'absolute',
        left: REF13.mask.x, top: REF13.mask.y + maskY,
        width: REF13.mask.w, height: REF13.mask.h,
        borderRadius: REF13.mask.r,
        overflow: 'hidden',
        opacity: maskIn,
        boxShadow: '3px 6px 14px rgba(0,0,0,0.42), 1px 2px 4px rgba(0,0,0,0.28)',
      }}>
        {/* verified crop 660x800 from (210,340) fills the 0.82:1 mask exactly.
            The video is NOT transformed — it is laid out oversized inside a clipping
            parent, which is the render-safe way to reframe. */}
        <OffthreadVideo
          src={staticFile('base/source.mp4')}
          startFrom={sourceStartFrame}
          muted
          style={{
            position: 'absolute',
            width: (REF13.mask.w / REF13.faceCrop.sw) * w,
            height: (REF13.mask.h / REF13.faceCrop.sh) * h,
            left: -(REF13.faceCrop.sx / REF13.faceCrop.sw) * REF13.mask.w,
            top: -(REF13.faceCrop.sy / REF13.faceCrop.sh) * REF13.mask.h,
            objectFit: 'fill',
          }}
        />
      </div>

      {/* the table — lands COMPLETE, then the mint sweep walks the value column */}
      <DataTable buildEnd={buildEndFrame} highlight={highlightFrames} />

      {/* style.md: no dead space below the card */}
      <LowerFill startFrame={28} />

      {/* chrome, topmost, knocked back over this light card layout */}
      <Chrome knockBackRanges={[[0, 10_000]]} />
    </AbsoluteFill>
  );
};
