import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {T} from '../tokens';
import {loadFonts} from '../fonts';
import {PeriwinkleGround, SparkleStar} from '../components/PeriwinkleGround';

/* ===========================================================================
 * B3 / B4 — the volatility pair.
 *
 * ONE component, two prop sets. The whole point of the beat is the contrast:
 * same 10% average, standard deviation 6% vs 12%, so the value band is exactly
 * twice as tall in B4. Everything that carries that comparison — the vertical
 * scale, the average anchor line, the 0% baseline, the card geometry — is
 * IDENTICAL between the two, so the only thing that changes on screen is the
 * height of the band. B4 opens on B3's settled frame (`carryIn`) and the band
 * RIPS open live on the word "fluctuation". The viewer sees the doubling
 * happen; they never have to read it.
 *
 * Ground: PeriwinkleGround + the two indigo sparkle blobs (TR/BL). Imported,
 * not re-derived — confirmed against the creator's reference frame.
 *
 * Type: Ivy Presto ITALIC in $indigo for the one display-voice line
 * ("Standard Deviation"), per her reference frame. Everything functional —
 * the numbers, the % labels, the axis, her verbatim "10% Average Annual
 * Return" — is Inter Tight. (No true Ivy Presto Italic exists in
 * assets/fonts/; this is Chromium's synthetic oblique of Ivy Presto Display.)
 *
 * Determinism: every value below comes off useCurrentFrame(). No random, no
 * clock, no timers. Safe to seek.
 * =========================================================================== */

/* ---- geometry (whole pixels; the scale divides exactly) ------------------ */

const CARD_X = 55;                 // style.md side inset minimum
const CARD_W = 970;                // TABLE_GEOM.cardW — one card width everywhere

// y226 (not 214) so the card's shadow-soft feather stays clear of the y200 line:
// a 44px blur offset 14px down still reaches 8px ABOVE the element.
const MAST = {y: 226, h: 184};     // her verbatim average label
const SDROW = {y: 440, h: 118};    // display term + the value that changes
const PLOT = {y: 586, h: 850};     // the hero

// inner plot: 800px tall over a 32-point domain -> EXACTLY 25px per point.
const PLOT_IN = {x: 105, y: 616, w: 870, h: 800};
const DOMAIN = {lo: -6, hi: 26};
const PX_PER_PT = PLOT_IN.h / (DOMAIN.hi - DOMAIN.lo); // 25
const yFor = (v: number) => PLOT_IN.y + (DOMAIN.hi - v) * PX_PER_PT;

const BAND_X = 175;                // left gutter x95..165 carries the axis labels
const BAND_W = 800;
const GUTTER_R = 165;              // axis labels are right-aligned to here

const SOURCE_Y = 1462;

// ONE radius system: cards 32, chips 16. Documented, applied everywhere.
const R_CARD = 32;
const R_CHIP = 16;

/* ---- shadow-soft (brand.md: black 15-40%, 8-15px down-right, blur 25-70).
 *      rgba below is $outline #14151A = rgb(20,21,26) — token, not a new hex. */
const SH_CARD = '0 14px 44px rgba(20,21,26,0.17), 0 4px 12px rgba(20,21,26,0.10)';
const SH_CHIP = '0 9px 24px rgba(20,21,26,0.22), 0 2px 6px rgba(20,21,26,0.13)';
const SH_TEXT = '0 7px 18px rgba(20,21,26,0.20)';
const SH_SVG = 'drop-shadow(0 11px 26px rgba(20,21,26,0.20))';

const SANS = 'InterTight, sans-serif';
const SERIF = 'IvyPresto, serif';

/* ---- motion ------------------------------------------------------------- */

const EASE = Easing.bezier(0.16, 1, 0.3, 1); // strong ease-out settle, zero bounce

type Ent = {p: number; blur: number; live: boolean};
const enter = (f: number, start: number, dur: number, maxBlur = 9): Ent => {
  if (f < start) return {p: 0, blur: 0, live: false};
  const p = interpolate(f, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // motion blur tracks velocity: fast at the start of the move, gone at settle
  const blur = interpolate(f, [start, start + dur * 0.45, start + dur], [maxBlur, maxBlur * 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {p, blur, live: true};
};

/**
 * Odometer tick. Ticks evenly and reaches `target` exactly on the LAST frame of
 * the window, so the count settles on the frame the number is actually spoken.
 * A shared ease-out here lands the final digit up to 0.5s early (measured: the
 * 10% count hit "10" at f82 for a word spoken at f98), which is the whole thing
 * this brief is trying to avoid.
 */
const countTo = (f: number, win: [number, number], target: number) => {
  const [a, b] = win;
  if (b <= a || f >= b) return target;
  if (f <= a) return 0;
  return Math.min(target, Math.floor(((f - a) / (b - a)) * target));
};

/* ---- the wander trace: fixed sine sum, normalised once at module load ---- */

const TRACE_N = 181;
const wave = (u: number) =>
  0.62 * Math.sin(2 * Math.PI * 2.3 * u + 0.7) +
  0.3 * Math.sin(2 * Math.PI * 5.1 * u + 2.1) +
  0.14 * Math.sin(2 * Math.PI * 9.7 * u + 4.4);
const TRACE_RAW: number[] = Array.from({length: TRACE_N}, (_, i) => wave(i / (TRACE_N - 1)));
const TRACE_MAX = TRACE_RAW.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
// 0.90 keeps the trace inside the band edges at every SD
const TRACE: number[] = TRACE_RAW.map((v) => (v / TRACE_MAX) * 0.9);

const tracePath = (anchorY: number, sdPx: number) =>
  TRACE.map((v, i) => {
    const x = BAND_X + (i / (TRACE_N - 1)) * BAND_W;
    const y = anchorY - v * sdPx;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

/* ---- number primitives: nothing plain-fades, numbers count or flip ------- */

/** A digit box that slides its value up from below, motion-blurred. */
const FlipIn: React.FC<{
  value: string;
  start: number;
  dur: number;
  boxH: number;
  style: React.CSSProperties;
}> = ({value, start, dur, boxH, style}) => {
  const f = useCurrentFrame();
  const e = enter(f, start, dur, 7);
  if (!e.live) return null;
  return (
    <span style={{display: 'inline-block', height: boxH, overflow: 'hidden', verticalAlign: 'top'}}>
      <span
        style={{
          ...style,
          display: 'block',
          height: boxH,
          lineHeight: `${boxH}px`,
          transform: `translateY(${((1 - e.p) * boxH).toFixed(2)}px)`,
          filter: e.blur > 0.15 ? `blur(${e.blur.toFixed(2)}px)` : undefined,
        }}
      >
        {value}
      </span>
    </span>
  );
};

/** Odometer flip: the old value leaves upward as the new one arrives. */
const FlipSwap: React.FC<{
  from: string;
  to: string;
  start: number;
  dur: number;
  boxH: number;
  style: React.CSSProperties;
}> = ({from, to, start, dur, boxH, style}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + dur], [0, 1], {
    easing: EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // same clamp trap as bandBlur: no blur before the flip is cued
  const blur =
    f < start
      ? 0
      : interpolate(f, [start, start + dur * 0.45, start + dur], [8, 4, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const bf = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : undefined;
  // RIGHT-aligned: the box is sized to the WIDER value ("12%"), so a left-aligned
  // "6%" would sit ~37px left of where the plain span in the build path puts it,
  // and the carried-in value would visibly jump at the B3 -> B4 cut.
  const cell: React.CSSProperties = {
    ...style,
    display: 'block',
    height: boxH,
    lineHeight: `${boxH}px`,
    textAlign: 'right',
    filter: bf,
  };
  return (
    <span style={{display: 'inline-block', height: boxH, overflow: 'hidden', verticalAlign: 'top', textAlign: 'right'}}>
      <span style={{display: 'block', transform: `translateY(${(-p * boxH).toFixed(2)}px)`}}>
        <span style={cell}>{from}</span>
        <span style={cell}>{to}</span>
      </span>
    </span>
  );
};

/* ---- props -------------------------------------------------------------- */

export type VolatilityCues = {
  /** empty plot card + gridlines + 0% baseline land (the stage) */
  scaffold: number;
  /** her verbatim average label card slams in */
  masthead: number;
  /** the 10% count-up runs [from, to]; it SETTLES on the spoken "10%" */
  avgCount: [number, number];
  /** the "Standard Deviation" display line + its value */
  sdEnter: number;
  /** SD value count-up window (build) or flip window (carry-in) */
  sdNumber: [number, number];
  /** the dashed average anchor line draws L->R */
  anchor: number;
  /** the band expands out of the anchor line (or rips wider) */
  band: number;
  /** lower endpoint chip, pinned to the frame where its number is spoken */
  loChip: number;
  /** upper endpoint chip, same */
  hiChip: number;
  /** the ONE delayed VO-synced highlight: an $amber marker pass over the band */
  sweep: number;
};

export type VolatilityProps = {
  /** the constant across the pair */
  avg: number;
  /** this beat's standard deviation */
  sd: number;
  /**
   * SD the frame is already showing at frame 0. B4 carries in B3's 6 and rips
   * to 12 on screen. null/0 => the band is born out of the anchor line.
   */
  sdFrom: number;
  /** true => scaffold, masthead, anchor and band are already settled at frame 0 */
  carryIn: boolean;
  /** creator-supplied verbatim copy. Functional label => Inter Tight. */
  averageLabel: string;
  /** the display-voice line. Ivy Presto italic, $indigo, per her reference. */
  termTitle: string;
  /** the line every data graphic carries. See note in the report. */
  sourceLine: string;
  cues: VolatilityCues;
};

/* ---- the component ------------------------------------------------------ */

export const VolatilityBand: React.FC<VolatilityProps> = ({
  avg,
  sd,
  sdFrom,
  carryIn,
  averageLabel,
  termTitle,
  sourceLine,
  cues,
}) => {
  loadFonts();
  const f = useCurrentFrame();

  const ENT = 14; // 0.47s entrance — style.md 0.3-0.5s
  const settled: Ent = {p: 1, blur: 0, live: true};

  const eScaffold = carryIn ? settled : enter(f, cues.scaffold, ENT);
  const eMast = carryIn ? settled : enter(f, cues.masthead, ENT);
  const eSd = carryIn ? settled : enter(f, cues.sdEnter, ENT);
  const eAnchor = carryIn ? settled : enter(f, cues.anchor, ENT);

  /* --- the band ---------------------------------------------------------- */
  const bandDur = 15; // 0.5s rip
  const sdNow =
    f <= cues.band
      ? sdFrom
      : interpolate(f, [cues.band, cues.band + bandDur], [sdFrom, sd], {
          easing: EASE,
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  // NOTE the `f < cues.band ? 0` guard. `extrapolateLeft: 'clamp'` alone holds the
  // blur at its MAXIMUM before the cue, which on a carry-in leaves the band smeared
  // for its whole opening hold — invisible in a settled-frame check, obvious when
  // B3's last frame is differenced against B4's first.
  const bandBlur =
    f < cues.band
      ? 0
      : interpolate(f, [cues.band, cues.band + bandDur * 0.45, cues.band + bandDur], [10, 5, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const yHi = yFor(avg + sdNow);
  const yLo = yFor(avg - sdNow);
  const yZero = yFor(0);
  const yAvg = yFor(avg);
  const bandLive = sdNow > 0.04;
  const negLive = avg - sdNow < 0;

  // trace is revealed L->R with the first build; on a carry-in it is already drawn
  const traceReveal = carryIn
    ? 1
    : interpolate(f, [cues.band, cues.band + 20], [0, 1], {
        easing: EASE,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  /* --- the ONE highlight: an $amber marker pass across the band ----------- */
  const sweepDur = 11;
  const sweepP = interpolate(f, [cues.sweep, cues.sweep + sweepDur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sweepX = -0.16 * BAND_W + sweepP * 1.32 * BAND_W;
  const washA =
    f < cues.sweep
      ? 0
      : 0.24 *
        interpolate(f, [cues.sweep + sweepDur, cues.sweep + sweepDur + 16], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const barA = sweepP > 0 && sweepP < 1 ? 1 : 0;

  /* --- numbers ----------------------------------------------------------- */
  const avgShown = carryIn ? avg : countTo(f, cues.avgCount, avg);
  const avgText = averageLabel.replace(/^\s*-?\d+%/, `${avgShown}%`);
  const [avgNumPart, ...avgWordParts] = avgText.split(' ');
  const avgWords = avgWordParts.join(' ');

  const sdCounted = countTo(f, cues.sdNumber, sd);

  const loVal = avg - sd;
  const hiVal = avg + sd;
  const carryLo = avg - sdFrom;
  const carryHi = avg + sdFrom;

  /* --- carry-in endpoint chips retire inside the rip ---------------------- */
  const carryChipA = !carryIn
    ? 0
    : interpolate(f, [cues.band, cues.band + 10], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const CHIP_FONT = 46;
  const CHIP_BOX = 56;
  const chipStyle = (colour: string): React.CSSProperties => ({
    fontFamily: SANS,
    fontWeight: 800,
    fontSize: CHIP_FONT,
    letterSpacing: '-0.01em',
    color: colour,
  });

  const Chip: React.FC<{
    y: number;
    value: string;
    colour: string;
    start: number;
    opacity?: number;
  }> = ({y, value, colour, start, opacity = 1}) => {
    const e = carryIn && start < 0 ? settled : enter(f, start, 10, 7);
    if (!e.live || opacity <= 0.001) return null;
    const punch = interpolate(e.p, [0, 0.72, 1], [0.74, 1.05, 1]);
    return (
      <div
        style={{
          position: 'absolute',
          left: BAND_X + 30,
          top: y - CHIP_BOX / 2 - 9,
          padding: '9px 22px',
          background: T.white,
          border: `3px solid ${colour}`,
          borderRadius: R_CHIP,
          boxShadow: SH_CHIP,
          transform: `scale(${punch.toFixed(3)})`,
          transformOrigin: 'left center',
          opacity,
          filter: e.blur > 0.15 ? `blur(${e.blur.toFixed(2)}px)` : undefined,
        }}
      >
        <FlipIn
          value={value}
          start={start < 0 ? -9999 : start}
          dur={10}
          boxH={CHIP_BOX}
          style={chipStyle(colour)}
        />
      </div>
    );
  };

  /* --- render ------------------------------------------------------------ */
  return (
    <AbsoluteFill style={{background: T.bg}}>
      {/* GROUND — imported, never re-derived. The two indigo sparkle blobs are
          part of the ground, not decoration. */}
      <PeriwinkleGround />
      <SparkleStar which="topRight" />
      <SparkleStar which="bottomLeft" />

      {/* ---------- MASTHEAD: her verbatim copy, functional => Inter Tight --- */}
      {eMast.live ? (
        <div
          style={{
            position: 'absolute',
            left: CARD_X,
            top: MAST.y,
            width: CARD_W,
            height: MAST.h,
            background: T.white,
            borderRadius: R_CARD,
            boxShadow: SH_CARD,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateY(${((1 - eMast.p) * 26).toFixed(2)}px) scale(${(0.94 + eMast.p * 0.06).toFixed(4)})`,
            opacity: eMast.p,
            filter: eMast.blur > 0.15 ? `blur(${eMast.blur.toFixed(2)}px)` : undefined,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 106,
              lineHeight: '106px',
              letterSpacing: '-0.03em',
              color: T.indigo,
            }}
          >
            {avgNumPart}
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 44,
              lineHeight: '52px',
              letterSpacing: '0.02em',
              color: T.ink,
              marginTop: 6,
            }}
          >
            {avgWords}
          </div>
        </div>
      ) : null}

      {/* ---------- DISPLAY LINE + the value that changes -------------------- */}
      {eSd.live ? (
        <div
          style={{
            position: 'absolute',
            left: CARD_X,
            top: SDROW.y,
            width: CARD_W,
            height: SDROW.h,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transform: `translateY(${((1 - eSd.p) * 22).toFixed(2)}px)`,
            opacity: eSd.p,
            filter: eSd.blur > 0.15 ? `blur(${eSd.blur.toFixed(2)}px)` : undefined,
          }}
        >
          {/* Ivy Presto italic, $indigo — her reference frame's display voice */}
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 82,
              lineHeight: '104px',
              letterSpacing: '-0.005em',
              color: T.indigo,
              textShadow: SH_TEXT,
            }}
          >
            {termTitle}
          </div>
          <div style={{textShadow: SH_TEXT}}>
            {carryIn ? (
              <FlipSwap
                from={`${sdFrom}%`}
                to={`${sd}%`}
                start={cues.sdNumber[0]}
                dur={cues.sdNumber[1] - cues.sdNumber[0]}
                boxH={116}
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 104,
                  letterSpacing: '-0.035em',
                  color: T.indigo,
                }}
              />
            ) : (
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 104,
                  lineHeight: '116px',
                  letterSpacing: '-0.035em',
                  color: T.indigo,
                  display: 'inline-block',
                }}
              >
                {sdCounted}%
              </span>
            )}
          </div>
        </div>
      ) : null}

      {/* ---------- PLOT CARD (the stage) ------------------------------------ */}
      {eScaffold.live ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: CARD_X,
              top: PLOT.y,
              width: CARD_W,
              height: PLOT.h,
              background: T.white,
              borderRadius: R_CARD,
              boxShadow: SH_CARD,
              transform: `translateY(${((1 - eScaffold.p) * 30).toFixed(2)}px) scale(${(0.95 + eScaffold.p * 0.05).toFixed(4)})`,
              transformOrigin: '50% 40%',
              opacity: eScaffold.p,
              filter: eScaffold.blur > 0.15 ? `blur(${eScaffold.blur.toFixed(2)}px)` : undefined,
            }}
          />
          {/* gridlines + the 0% baseline */}
          <svg
            width={1080}
            height={1920}
            viewBox="0 0 1080 1920"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: eScaffold.p,
              filter: eScaffold.blur > 0.15 ? `blur(${eScaffold.blur.toFixed(2)}px)` : undefined,
            }}
          >
            {Array.from({length: (DOMAIN.hi - DOMAIN.lo) / 2 + 1}, (_, i) => {
              const v = DOMAIN.lo + i * 2;
              const y = yFor(v);
              if (v === 0 || v === avg) return null;
              return (
                <rect key={`g${i}`} x={BAND_X} y={y - 0.5} width={BAND_W} height={1} fill={T.ruleStrong} opacity={0.34} />
              );
            })}
            {/* 0% is the line that matters: below it the fund is losing money */}
            <rect x={BAND_X} y={yZero - 1} width={BAND_W} height={2} fill={T.ruleStrong} />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: yZero - 21,
              width: GUTTER_R,
              textAlign: 'right',
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 30,
              lineHeight: '42px',
              color: T.muted,
              opacity: eScaffold.p,
            }}
          >
            0%
          </div>
        </>
      ) : null}

      {/* ---------- BAND + trace (blurred while it moves) -------------------- */}
      {bandLive ? (
        <svg
          width={1080}
          height={1920}
          viewBox="0 0 1080 1920"
          style={{
            position: 'absolute',
            inset: 0,
            filter: bandBlur > 0.15 ? `blur(${bandBlur.toFixed(2)}px) ${SH_SVG}` : SH_SVG,
          }}
        >
          <defs>
            <clipPath id="vbBand">
              <rect x={BAND_X} y={yHi} width={BAND_W} height={Math.max(0, yLo - yHi)} />
            </clipPath>
            <clipPath id="vbNeg">
              <rect x={BAND_X} y={yZero} width={BAND_W} height={Math.max(0, yLo - yZero)} />
            </clipPath>
            <clipPath id="vbReveal">
              <rect x={BAND_X} y={0} width={BAND_W * traceReveal} height={1920} />
            </clipPath>
            <linearGradient id="vbSweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={T.amber} stopOpacity="0" />
              <stop offset="0.5" stopColor={T.amber} stopOpacity="0.85" />
              <stop offset="1" stopColor={T.amber} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* fill: indigo above 0%, coral below it */}
          <rect x={BAND_X} y={yHi} width={BAND_W} height={Math.max(0, yLo - yHi)} fill={T.indigo} opacity={0.17} />
          {negLive ? (
            <rect x={BAND_X} y={yZero} width={BAND_W} height={Math.max(0, yLo - yZero)} fill={T.coral} opacity={0.2} />
          ) : null}

          {/* the wander trace — one fixed shape, scaled by SD, so B4 is literally
              the same squiggle at twice the amplitude */}
          <g clipPath="url(#vbReveal)">
            <path d={tracePath(yAvg, sdNow * PX_PER_PT)} fill="none" stroke={T.indigo} strokeWidth={5} strokeOpacity={0.62} strokeLinejoin="round" strokeLinecap="round" />
            {negLive ? (
              <g clipPath="url(#vbNeg)">
                <path d={tracePath(yAvg, sdNow * PX_PER_PT)} fill="none" stroke={T.coral} strokeWidth={5} strokeOpacity={0.95} strokeLinejoin="round" strokeLinecap="round" />
              </g>
            ) : null}
          </g>

          {/* edge rules: one weight, 4px. The lower edge is $coral when negative. */}
          <rect x={BAND_X} y={yHi - 2} width={BAND_W} height={4} fill={T.indigo} />
          {/* colour off the CURRENT low bound (negLive), never the target sd: on a
              carry-in the band is still at 4%..16% and its lower edge must read
              indigo, or B4's first frame does not match B3's last one. */}
          <rect x={BAND_X} y={yLo - 2} width={BAND_W} height={4} fill={negLive ? T.coral : T.indigo} />

          {/* the ONE highlight: an $amber marker pass, delayed and VO-synced */}
          <g clipPath="url(#vbBand)">
            {washA > 0.002 ? (
              <rect
                x={BAND_X}
                y={yHi}
                width={Math.max(0, Math.min(BAND_W, sweepX + 130))}
                height={Math.max(0, yLo - yHi)}
                fill={T.amber}
                opacity={washA}
              />
            ) : null}
            {barA > 0 ? (
              <rect x={BAND_X + sweepX - 130} y={yHi} width={260} height={Math.max(0, yLo - yHi)} fill="url(#vbSweep)" />
            ) : null}
          </g>
        </svg>
      ) : null}

      {/* ---------- AVERAGE ANCHOR LINE (dashed) + its axis label ------------ */}
      {eAnchor.live ? (
        <>
          <svg
            width={1080}
            height={1920}
            viewBox="0 0 1080 1920"
            style={{position: 'absolute', inset: 0, filter: eAnchor.blur > 0.15 ? `blur(${eAnchor.blur.toFixed(2)}px)` : undefined}}
          >
            <line
              x1={BAND_X}
              y1={yAvg}
              x2={BAND_X + BAND_W * eAnchor.p}
              y2={yAvg}
              stroke={T.ink}
              strokeWidth={4}
              strokeDasharray="18 13"
              strokeLinecap="butt"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: yAvg - 21,
              width: GUTTER_R,
              textAlign: 'right',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 30,
              lineHeight: '42px',
              color: T.ink,
              opacity: eAnchor.p,
              transform: `translateX(${((1 - eAnchor.p) * -18).toFixed(2)}px)`,
            }}
          >
            {avg}%
          </div>
        </>
      ) : null}

      {/* ---------- ENDPOINT CHIPS ------------------------------------------- */}
      {carryIn && carryChipA > 0.001 ? (
        <>
          {/* they ride the band edges outward as it rips, then are gone */}
          <Chip y={yHi} value={`${carryHi}%`} colour={T.indigo} start={-1} opacity={carryChipA} />
          <Chip y={yLo} value={`${carryLo}%`} colour={carryLo < 0 ? T.coral : T.indigo} start={-1} opacity={carryChipA} />
        </>
      ) : null}
      <Chip y={yLo} value={`${loVal}%`} colour={loVal < 0 ? T.coral : T.indigo} start={cues.loChip} />
      <Chip y={yHi} value={`${hiVal}%`} colour={T.indigo} start={cues.hiChip} />

      {/* ---------- SOURCE LINE ---------------------------------------------- */}
      {eScaffold.live ? (
        <div
          style={{
            position: 'absolute',
            left: CARD_X,
            top: SOURCE_Y,
            width: CARD_W,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 28,
            lineHeight: '38px',
            letterSpacing: '0.01em',
            color: T.ink,
            opacity: eScaffold.p * 0.72,
            textShadow: SH_TEXT,
          }}
        >
          {sourceLine}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ===========================================================================
 * Beat wrappers. Cue frames are beat-relative and pinned to WhisperX
 * word-level timings (transcript/transcript.json), frame = round(t*30).
 * =========================================================================== */

const B3_SOURCE = 'Illustrative example only. Not a return forecast.';

export const B3Volatility: React.FC<Partial<VolatilityProps>> = (p) => (
  <VolatilityBand
    avg={10}
    sd={6}
    sdFrom={0}
    carryIn={false}
    averageLabel="10% Average Annual Return"
    termTitle="Standard Deviation"
    sourceLine={B3_SOURCE}
    cues={{
      scaffold: 4,          // 18.08s — the stage lands on the cut
      masthead: 52,         // 19.688 "average"
      avgCount: [60, 98],   // settles on 21.229 "10%"
      sdEnter: 116,         // 21.829 "standard"
      sdNumber: [116, 139], // settles on 22.589 "6%"
      anchor: 174,          // 23.750 "toh" (the pivot into the range)
      band: 221,            // 25.310 "returns"
      loChip: 268,          // 26.871 "4%"
      hiChip: 293,          // 27.731 "16%"
      sweep: 308,           // 28.231 "fluctuate"
    }}
    {...p}
  />
);

export const B4Volatility: React.FC<Partial<VolatilityProps>> = (p) => (
  <VolatilityBand
    avg={10}
    sd={12}
    sdFrom={6}
    carryIn
    averageLabel="10% Average Annual Return"
    termTitle="Standard Deviation"
    sourceLine={B3_SOURCE}
    cues={{
      scaffold: 0,
      masthead: 0,
      avgCount: [0, 0],
      sdEnter: 0,
      sdNumber: [136, 150], // 34.293 "12%" — the flip
      anchor: 0,
      band: 188,            // 36.034 "fluctuation" — the rip
      loChip: 291,          // 39.455 "2%"  (minus 2)
      hiChip: 306,          // 39.975 "22%"
      sweep: 220,           // 37.094 "zyada" (much more)
    }}
    {...p}
  />
);
