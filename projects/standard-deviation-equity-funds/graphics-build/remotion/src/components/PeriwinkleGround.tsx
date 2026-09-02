import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FRAME, PERIWINKLE as P, STARS, T} from '../tokens';

/**
 * The takeover ground the creator supplied five times over (REF3, REF6, REF8, REF11, REF14).
 * Every number here was MEASURED off her reference frames in the 2026-08-23 harvest —
 * nothing is estimated.
 *
 *   base #ECEEFE, flat
 *   $indigo @ 0.124 radial shade in the TOP-LEFT and BOTTOM-RIGHT corners
 *   white @ 0.89 radial glow in the TOP-RIGHT and BOTTOM-LEFT (behind each star)
 *   97px square dot lattice: 2px lines at black 0.008, 6.5px dots at black 0.085
 *
 * NOTE this is deliberately NOT brand.md's `gradient-ground`: her references carry no
 * mint and a DARK grid, where the style file said mint + a white 85px grid. Creator
 * decision 2026-08-23 — build to the references, and the style file gets updated to match.
 *
 * Deterministic: nothing here reads a clock or a random. Safe to seek.
 */
export const PeriwinkleGround: React.FC<{withGlow?: boolean}> = ({withGlow = true}) => {
  const {w, h} = FRAME;

  // Grid drawn as an SVG pattern so the phase is exact and lands on whole pixels.
  const cells = Math.ceil(Math.max(w, h) / P.gridPitch) + 2;
  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= cells; i++) {
    const x = P.gridPhaseX + i * P.gridPitch;
    const y = P.gridPhaseY + i * P.gridPitch;
    if (x <= w) lines.push(<rect key={`v${i}`} x={x - P.lineWidth / 2} y={0} width={P.lineWidth} height={h} fill={`rgba(0,0,0,${P.lineAlpha})`} />);
    if (y <= h) lines.push(<rect key={`hz${i}`} x={0} y={y - P.lineWidth / 2} width={w} height={P.lineWidth} fill={`rgba(0,0,0,${P.lineAlpha})`} />);
  }
  const dots: React.ReactNode[] = [];
  for (let i = 0; i <= cells; i++) {
    for (let j = 0; j <= cells; j++) {
      const x = P.gridPhaseX + i * P.gridPitch;
      const y = P.gridPhaseY + j * P.gridPitch;
      if (x > w || y > h) continue;
      dots.push(<circle key={`d${i}-${j}`} cx={x} cy={y} r={P.dotDia / 2} fill={`rgba(0,0,0,${P.dotAlpha})`} />);
    }
  }

  const glowR = STARS.topRight.tipR * w + P.glowReach;

  return (
    <AbsoluteFill style={{background: P.base}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0}}>
        <defs>
          {/* corner shade: $indigo 0.124, full to r=356, base by r=745 */}
          <radialGradient id="shadeTL" cx="0" cy="0" r={P.cornerFade} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={P.cornerTint} stopOpacity={P.cornerAlpha} />
            <stop offset={String(P.cornerFull / P.cornerFade)} stopColor={P.cornerTint} stopOpacity={P.cornerAlpha} />
            <stop offset="1" stopColor={P.cornerTint} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="shadeBR" cx={w} cy={h} r={P.cornerFade} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={P.cornerTint} stopOpacity={P.cornerAlpha} />
            <stop offset={String(P.cornerFull / P.cornerFade)} stopColor={P.cornerTint} stopOpacity={P.cornerAlpha} />
            <stop offset="1" stopColor={P.cornerTint} stopOpacity={0} />
          </radialGradient>
          {/* white glow behind each star */}
          <radialGradient id="glowTR" cx={STARS.topRight.cx * w} cy={STARS.topRight.cy * h} r={glowR} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={P.glowAlpha} />
            <stop offset="0.55" stopColor="#FFFFFF" stopOpacity={P.glowAlpha * 0.72} />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="glowBL" cx={STARS.bottomLeft.cx * w} cy={STARS.bottomLeft.cy * h} r={glowR} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={P.glowAlpha} />
            <stop offset="0.55" stopColor="#FFFFFF" stopOpacity={P.glowAlpha * 0.72} />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={w} height={h} fill="url(#shadeTL)" />
        <rect width={w} height={h} fill="url(#shadeBR)" />
        {withGlow ? <rect width={w} height={h} fill="url(#glowTR)" /> : null}
        {withGlow ? <rect width={w} height={h} fill="url(#glowBL)" /> : null}
        {lines}
        {dots}
      </svg>
    </AbsoluteFill>
  );
};

/**
 * The four-point sparkle "stars" the creator asks for by name ("swirling stars at top right
 * corner and bottom left corner"). Concave-sided twinkle, flat $indigo, blurred sigma ~21px.
 * Fitted to her reference by IoU (0.79 TR / 0.85 BL) — two tips run off-frame, which is correct.
 *
 * `spin` drives the "swirling": a slow continuous rotation, so the beat never freezes
 * (style.md: continuous motion, and an entrance is not enough on a held graphic).
 */
export const SparkleStar: React.FC<{
  which: 'topRight' | 'bottomLeft';
  spinDeg?: number;
  scale?: number;
  opacity?: number;
}> = ({which, spinDeg = 0, scale = 1, opacity = 1}) => {
  const {w, h} = FRAME;
  const s = STARS[which];
  const cx = s.cx * w;
  const cy = s.cy * h;
  const R = s.tipR * w * scale;
  const r = R * s.waist;

  // 4-point concave star: tip, control-in via the waist radius at 45deg, tip, ...
  const pt = (ang: number, rad: number) => {
    const a = ((ang - 90) * Math.PI) / 180;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };
  let d = '';
  for (let i = 0; i < 4; i++) {
    const [tx, ty] = pt(i * 90, R);
    const [qx, qy] = pt(i * 90 + 45, r * 0.42); // deep concave waist -> the sparkle read
    if (i === 0) d += `M ${tx} ${ty}`;
    else d += ` Q ${qx} ${qy} ${tx} ${ty}`;
    if (i === 3) {
      const [q2x, q2y] = pt(360 - 45, r * 0.42);
      const [t0x, t0y] = pt(0, R);
      d += ` Q ${q2x} ${q2y} ${t0x} ${t0y} Z`;
    }
  }

  const blurId = `starBlur-${which}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <defs>
        <filter id={blurId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={STARS.blurSigma} />
        </filter>
      </defs>
      <g transform={`rotate(${s.rot + spinDeg} ${cx} ${cy})`} filter={`url(#${blurId})`} opacity={opacity}>
        <path d={d} fill={T.indigo} />
      </g>
    </svg>
  );
};
