import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { serif, sans } from "../base";
import { T } from "../tokens";

/* motion-craft discipline: transform+opacity primaries, one easing language.
   Entrances 140-220ms scaled to shot (25fps: 4-6f small elements, 8-12f cards). */

export const EASE = Easing.bezier(0.22, 1, 0.36, 1); // easeOutQuint-ish, THE house curve

/** Bottom-to-top entrance (§3.1/§9: every element enters bottom→top with in-animation) */
export const RiseIn: React.FC<{
  from: number; // frame the entrance starts (relative to span)
  dur?: number;
  dist?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ from, dur = 10, dist = 90, children, style }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <div style={{ ...style, opacity: t, transform: `translateY(${(1 - t) * dist}px)` }}>
      {children}
    </div>
  );
};

/** Pop entrance for icons/circles (fig10 grammar) */
export const PopIn: React.FC<{
  from: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ from, children, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - from, fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });
  return (
    <div style={{ ...style, opacity: f < from ? 0 : 1, transform: `scale(${s})` }}>{children}</div>
  );
};

/** Word-by-word reveal: brand purple, right-to-left applied IN PLACE (§3.1 — words appear
    at their own final position with the directional animation, never flying from frame edge) */
export const WordByWord: React.FC<{
  text: string;
  from: number;
  perWord?: number; // frames between word starts
  wordDur?: number;
  style?: React.CSSProperties;
}> = ({ text, from, perWord = 3, wordDur = 5, style }) => {
  const f = useCurrentFrame();
  const words = text.split(/\s+/);
  return (
    <span style={style}>
      {words.map((w, i) => {
        const s = from + i * perWord;
        const t = interpolate(f, [s, s + wordDur], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: t,
              transform: `translateX(${(1 - t) * 38}px)`, // right-to-left, in place
              marginRight: "0.28em",
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
};

/** Continuous rotation (coins, football — "the small motion matters") */
export const Rotate: React.FC<{
  rpm?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  axis?: "z" | "y";
}> = ({ rpm = 6, children, style, axis = "y" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const deg = (f / fps) * rpm * 6; // rpm*360/60
  const tf = axis === "y" ? `rotateY(${deg}deg)` : `rotate(${deg}deg)`;
  return <div style={{ ...style, transform: tf, transformStyle: "preserve-3d" }}>{children}</div>;
};

/** Animated stroke shimmer for circles/cards (§3.4 "motion on the stroke is preferred") */
export const strokeShimmer = (frame: number, base = T.indigo) => ({
  border: `10px solid ${base}`,
  boxShadow: `0 0 0 ${2 + 2 * Math.sin(frame / 9)}px rgba(87,113,235,${0.18 + 0.1 * Math.sin(frame / 9)})`,
});

/** Peak-velocity frame of a RiseIn/entrance — where the SFX whoosh peak lands (sound-design.md).
    For the house EASE curve, max velocity sits ~28% into the entrance. */
export const peakFrame = (from: number, dur = 10) => Math.round(from + dur * 0.28);
