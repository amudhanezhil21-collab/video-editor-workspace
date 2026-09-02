import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {T, FRAME} from '../tokens';
import {loadFonts} from '../fonts';
import solved from '../caption-solved.json';

loadFonts();

/**
 * Karaoke captions — brand.md caption voice:
 * white bold Inter Tight on near-black chips (#040304, r16, pad 22px), groups of 2-6 words
 * popping instantly, EXACTLY one word at a time turning $amber, advancing through every word.
 * ALL-CAPS interjections ride their own chip above the main line.
 * Y per group comes from caption-solved.json (solved by measurement, never by eye).
 * Suppressed groups simply do not appear in the file.
 */
type G = {text: string; words: string[]; wordTimes: [number, number][];
          start: number; end: number; y: number; isInterjection: boolean};

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FRAME.fps;
  const groups = (solved as {groups: G[]}).groups;
  const active = groups.filter((g) => t >= g.start && t < g.end);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', fontFamily: 'InterTight'}}>
      {active.map((g, gi) => {
        const y = g.y ?? 1500;
        return (
          <div key={`${g.start}-${gi}`} style={{
            position: 'absolute', left: 0, right: 0, top: y,
            display: 'flex', justifyContent: 'center',
          }}>
            <div style={{
              background: T.captionChip, borderRadius: 16, padding: '14px 22px',
              maxWidth: 940, textAlign: 'center', lineHeight: 1.32,
              boxShadow: '4px 5px 14px rgba(0,0,0,0.35)',
              fontSize: g.isInterjection ? 44 : 50, fontWeight: 800,
            }}>
              {g.words.map((w, i) => {
                const [a, b] = g.wordTimes[i];
                const lit = t >= a && t < Math.max(b, a + 0.15);
                return (
                  <span key={i} style={{color: lit ? T.amber : T.white}}>
                    {w}{i < g.words.length - 1 ? ' ' : ''}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
