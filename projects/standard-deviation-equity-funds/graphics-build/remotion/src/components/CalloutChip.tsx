import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {T} from '../tokens';

/**
 * Callout chip — measured off the creator's reference: solid blue rectangle,
 * ~2px WHITE KEYLINE, heavy neo-grotesque sans, tight tracking, NO drop shadow
 * (pixels return to background within ~3px outside the keyline).
 *
 * Fill uses brand.md's $indigo token, not the screenshot-sampled #5F6FF3 —
 * CLAUDE.md: "Colours come from brand.md tokens, never hardcoded hex".
 */
export const CalloutChip: React.FC<{
  text: string;
  fontSize?: number;
  delay?: number;
  align?: 'center' | 'left';
}> = ({text, fontSize = 96, delay = 0, align = 'center'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 200, mass: 0.6, stiffness: 140}});
  const scale = interpolate(s, [0, 1], [0.86, 1]);
  const op = interpolate(s, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'inline-block',
        background: T.indigo,
        border: '2px solid #FFFFFF',
        padding: `${Math.round(fontSize * 0.17)}px ${Math.round(fontSize * 0.30)}px`,
        transform: `scale(${scale})`,
        opacity: op,
        alignSelf: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      <span
        style={{
          fontFamily: 'InterTight, sans-serif',
          fontWeight: 800,
          fontSize,
          lineHeight: 1.0,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          display: 'block',
        }}
      >
        {text}
      </span>
    </div>
  );
};
