import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {T, FRAME} from '../tokens';
import {loadFonts} from '../fonts';

loadFonts();

/* ------------------------------------------------------------------ *
 * SEBI registration box — style.md compliance furniture #1:
 * bottom-left, first ~4s of the video. Identity text is the standing
 * legal identity used by prior jobs + this doc's RA line.
 * ------------------------------------------------------------------ */
export const SebiOpen: React.FC = () => {
  const f = useCurrentFrame();
  const inO = interpolate(f, [8, 21], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const inX = interpolate(f, [8, 21], [-40, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outO = interpolate(f, [99, 110], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const eased = 1 - Math.pow(1 - inO, 3);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{
        position: 'absolute', left: 78 + inX * (1 - eased), top: 1496, maxWidth: 660,
        background: 'rgba(255,255,255,0.92)', borderRadius: 16, padding: '20px 26px',
        fontFamily: 'InterTight', fontSize: 24, lineHeight: 1.35, fontWeight: 600,
        color: T.ink, opacity: eased * outO,
        boxShadow: '8px 10px 26px rgba(0,0,0,0.20)',
      }}>
        Groww Invest Tech Pvt. Ltd. (formerly Nextbillion Technology Pvt. Ltd.)<br />
        SEBI Research Analyst Reg. No. INH000015818
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ *
 * B15 outro — RA panel + subscribe micro-skit (style.md outro spec).
 * Beat window 134.91-143.23 (8.32s = 250 frames @30). t=0 at beat start.
 * RA identity from the script doc, verbatim. End cold — panel holds to
 * the last frame, no fade-out.
 * ------------------------------------------------------------------ */
const RA_LINES = [
  'Research Analyst: Shreesha Ramesh Desai',
  'Report date: 31-08-2026',
  'RA disclaimer: groww.in/p/sebi-research-analyst-regulations',
];

export const B15Outro: React.FC = () => {
  const f = useCurrentFrame();
  // RA panel: slides up at ~0.5s, holds to end (cold ending).
  const paO = interpolate(f, [15, 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const paY = 1 - Math.pow(1 - paO, 3);
  // Subscribe skit: banner rises at ~5.9s (f177), cursor clicks ~7.0s (f210), flips ~7.3s (f219).
  const bO = interpolate(f, [177, 192], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bY = (1 - Math.pow(1 - bO, 3)) * 0 + (1 - bO) * 220;
  const clicked = f >= 219;
  const cursorX = interpolate(f, [192, 210], [980, 800], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cursorY = interpolate(f, [192, 210], [1860, 1712], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const press = f >= 210 && f < 219 ? 0.92 : 1;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', fontFamily: 'InterTight'}}>
      {/* RA compliance panel — indigo, lower third, above the subscribe zone */}
      <div style={{
        position: 'absolute', left: 90, top: 1330 + (1 - paY) * 46, width: 900,
        background: T.indigo, borderRadius: 22, padding: '22px 30px', opacity: paO,
        boxShadow: '10px 12px 30px rgba(0,0,0,0.30)',
      }}>
        {RA_LINES.map((l, i) => (
          <div key={i} style={{
            color: T.white, fontSize: i === 0 ? 30 : 25, fontWeight: i === 0 ? 700 : 500,
            lineHeight: 1.5, opacity: 0.97,
          }}>{l}</div>
        ))}
      </div>
      {/* Subscribe micro-skit */}
      {bO > 0 && (
        <div style={{
          position: 'absolute', left: 119, top: 1560 + bY, width: 856, height: 150,
          background: T.white, borderRadius: 26, opacity: bO,
          boxShadow: '10px 12px 30px rgba(0,0,0,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 34px',
        }}>
          <Img src={staticFile('logos/groww-capsule.png')}
               style={{width: 250, height: 'auto', filter: 'invert(0.75)'}} />
          <div style={{
            background: clicked ? '#B8BCC2' : '#FF333F', borderRadius: 14,
            transform: `scale(${press})`,
            color: T.white, fontWeight: 800, fontSize: 34, padding: '18px 30px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            {clicked ? 'SUBSCRIBED' : 'SUBSCRIBE'}
            {!clicked && <span style={{fontSize: 30}}>🔔</span>}
          </div>
        </div>
      )}
      {/* cursor */}
      {bO > 0 && !clicked && (
        <div style={{
          position: 'absolute', left: cursorX, top: cursorY, width: 0, height: 0,
          borderLeft: '16px solid transparent', borderRight: '10px solid transparent',
          borderTop: '30px solid #14151A', transform: 'rotate(-18deg)',
          filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.4))',
        }} />
      )}
    </AbsoluteFill>
  );
};
