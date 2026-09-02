import React from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {FRAME, T} from '../tokens';
import {PeriwinkleGround, SparkleStar} from '../components/PeriwinkleGround';
import {loadFonts} from '../fonts';

/* ===========================================================================================
 * support.tsx — B10 / B11 / B13 / B14 for standard-deviation-equity-funds.
 *
 * Everything here is a pure function of useCurrentFrame(). No Math.random, no Date, no timers,
 * no <Sequence> remounts (a beat boundary is not a cut — see the Remotion remount lesson).
 *
 * Frame = round(seconds * 30). cutsheet.json's `frame.fps: 25` is stale for this job; BUILD-SPEC
 * and tokens.ts both say 30 and her supplied cut probes at exactly 30/1. Flagged, not silently
 * resolved.
 * =========================================================================================== */

const {w: W, h: H, fps: FPS} = FRAME;

/** Every element carries a drop shadow (brand.md golden rule). Two grounds, two strengths. */
const SHADOW_ON_FOOTAGE =
  '0 13px 32px rgba(0,0,0,0.44), 0 4px 9px rgba(0,0,0,0.32)';
const SHADOW_ON_GROUND =
  '0 13px 30px rgba(20,21,26,0.19), 0 3px 8px rgba(20,21,26,0.13)';

const SANS = 'InterTight, sans-serif';
const SERIF = 'IvyPresto, serif';

/** Strong ease-out settle — the house entrance curve. */
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: OUT,
  });
/** Linear 0..1 clamp, for things that must be exactly proportional (the B11 sync). */
const lin = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Motion blur on the entrance frames — those blurred frames are what make a card feel alive. */
const entryBlur = (p: number, px: number) => `blur(${((1 - p) * px).toFixed(2)}px)`;

/* -------------------------------------------------------------------------------------------
 * EDGE SCRIM — style.md "Edge scrims: long feather + drifting streaks" (creator directive
 * 2026-08-23), measured off youtu.be/2ndjrtVgrOY @0:42.
 *
 *   alpha ~0.94 at the frame edge, feathering to TRUE ZERO over ~48% of frame height (920px
 *   here) on a cosine S-curve — zero value AND zero derivative at the onset, which is what kills
 *   the findable edge. A linear ramp that terminates while still opaque is the failure.
 *
 *   Plus faint drifting light streaks: ~6 arcs, 5-13px thick, peak plate alpha ~29/255, hump at
 *   ~60% of band depth, drift 20px/s. Built as a 2160px-periodic plate panned on transform —
 *   a transform survives a seeked render (a CSS filter animation would not).
 *
 *   Dissolves IN and OUT (~0.5s each way). A scrim that snaps on, or simply stops when the beat
 *   ends, is the failure.
 * ----------------------------------------------------------------------------------------- */
const STREAKS = [
  // yFrac = position down the band; amp/period/phase give gently wavy near-horizontal arcs.
  {yFrac: 0.30, amp: 26, k: 2, phase: 0.0, thick: 6},
  {yFrac: 0.44, amp: 34, k: 1, phase: 1.9, thick: 9},
  {yFrac: 0.56, amp: 22, k: 3, phase: 3.4, thick: 5},
  {yFrac: 0.64, amp: 40, k: 1, phase: 0.7, thick: 13},
  {yFrac: 0.76, amp: 28, k: 2, phase: 2.6, thick: 11},
  {yFrac: 0.88, amp: 18, k: 3, phase: 4.4, thick: 7},
];
const TILE = 2160;
const STREAK_PEAK = 29 / 255; // measured plate alpha

export const EdgeScrim: React.FC<{
  edge: 'top' | 'bottom';
  band?: number;
  peak?: number;
  totalFrames: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({edge, band = 920, peak = 0.94, totalFrames, fadeIn = 15, fadeOut = 15}) => {
  const f = useCurrentFrame();

  // dissolve in AND out; reaches exactly 0 on the first and the last frame of the beat.
  const dissolve = Math.min(
    lin(f, 0, fadeIn),
    interpolate(f, [totalFrames - 1 - fadeOut, totalFrames - 1], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // cosine falloff, 48 stops: u = 0 at the inner (feather) edge -> 1 at the frame edge.
  const stops: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const u = i / 48;
    const a = peak * (0.5 - 0.5 * Math.cos(Math.PI * u));
    stops.push(`rgba(0,0,0,${a.toFixed(5)}) ${(u * 100).toFixed(3)}%`);
  }
  const grad = `linear-gradient(to ${edge === 'bottom' ? 'bottom' : 'top'}, ${stops.join(', ')})`;

  // 20px/s horizontal drift, wrapping on the 2160px tile period.
  const drift = -(((f / FPS) * 20) % TILE);

  const arcs: React.ReactNode[] = [];
  for (let rep = 0; rep < 3; rep++) {
    STREAKS.forEach((s, i) => {
      const yc = s.yFrac * band;
      // envelope: hump at 60% of band depth, gone by the inner edge
      const env = Math.exp(-Math.pow((s.yFrac - 0.6) / 0.30, 2));
      let d = '';
      for (let x = 0; x <= TILE; x += 40) {
        const y = yc + s.amp * Math.sin((2 * Math.PI * s.k * x) / TILE + s.phase);
        d += `${x === 0 ? 'M' : 'L'} ${rep * TILE + x} ${y.toFixed(2)} `;
      }
      arcs.push(
        <path
          key={`${rep}-${i}`}
          d={d}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={s.thick}
          strokeLinecap="round"
          opacity={(STREAK_PEAK * env).toFixed(4)}
        />
      );
    });
  }

  return (
    <AbsoluteFill style={{opacity: dissolve, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: W,
          height: band,
          [edge]: 0,
          background: grad,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: W,
          height: band,
          [edge]: 0,
          overflow: 'hidden',
          // fade the streak plate out toward the inner edge so it never draws its own line
          WebkitMaskImage: `linear-gradient(to ${edge === 'bottom' ? 'bottom' : 'top'}, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 34%, rgba(0,0,0,1) 100%)`,
        }}
      >
        <svg
          width={TILE * 3}
          height={band}
          viewBox={`0 0 ${TILE * 3} ${band}`}
          style={{
            position: 'absolute',
            left: -TILE,
            top: 0,
            transform: `translateX(${drift.toFixed(3)}px)`,
          }}
        >
          <g filter="url(#streakSoft)">{arcs}</g>
          <defs>
            <filter id="streakSoft" x="-5%" y="-30%" width="110%" height="160%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ===========================================================================================
 * B10 — QUESTION-MARK WIDGET  (window 97.00-102.60s -> 168 frames)   SHE IS ON SCREEN.
 *
 * Creator, verbatim: "A question mark widget at the bottom frame with gradient behind."
 *
 * Hard geometry (measured on THIS shoot, 36 frames): FACE_BOX x139-953 / y560-1401.
 * The only band that is actually free below her body is y1401-1670, so "bottom frame" is that
 * band and nothing here may leave it.
 *
 * Copy is an authored LABEL, not her narration: "Avoid high-SD funds?" (3 words + the question
 * mark). Her sentence is 18 Hinglish words; typesetting it would be the exact failure the style
 * file records. B11 then answers this label with HIGH SD != BAD FUND.
 *
 * Deliver TRANSPARENT: --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le
 * =========================================================================================== */

const B10 = {
  tile: {y: 1465, s: 140, r: 36}, // ? tile; centred in the free band y1401-1670
  gap: 30,
  labelSize: 52,
  bandTop: 1401,
  bandBottom: 1670,
  tileIn: 14,
  labelIn: 30,
  hi: 127, // VO "चाहिए?" @101.241s -> local frame 127
  exit: 150,
};

export const B10QuestionWidget: React.FC<{
  totalFrames?: number;
  highlightFrame?: number;
}> = ({totalFrames = 168, highlightFrame = B10.hi}) => {
  loadFonts();
  const f = useCurrentFrame();

  const pTile = ease(f, B10.tileIn, B10.tileIn + 14);
  const pLabel = ease(f, B10.labelIn, B10.labelIn + 14);
  const pHi = ease(f, highlightFrame, highlightFrame + 12);

  // designed exit: the lockup settles down and out as the scrim dissolves. Ends above y1670.
  const pOut = ease(f, B10.exit, B10.exit + 15);
  const outY = pOut * 26;
  const outOp = 1 - pOut;

  return (
    <AbsoluteFill>
      <EdgeScrim
        edge="bottom"
        band={920}
        peak={0.94}
        totalFrames={totalFrames}
        fadeIn={15}
        fadeOut={15}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: B10.tile.y,
          width: W,
          height: B10.tile.s,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: B10.gap,
          transform: `translateY(${outY.toFixed(2)}px)`,
          opacity: outOp,
        }}
      >
        {/* the widget itself: a heavy ? stamp on an $indigo tile */}
        <div
          style={{
            width: B10.tile.s,
            height: B10.tile.s,
            borderRadius: B10.tile.r,
            background: T.indigo,
            boxShadow: SHADOW_ON_FOOTAGE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${(0.68 + 0.32 * pTile).toFixed(4)}) translateY(${((1 - pTile) * 34).toFixed(2)}px)`,
            opacity: pTile,
            filter: entryBlur(pTile, 11),
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 98,
              lineHeight: '98px',
              color: T.white,
              letterSpacing: '-0.02em',
              transform: 'translateY(-3px)',
            }}
          >
            ?
          </span>
        </div>

        {/* authored label + its one delayed, VO-synced highlight */}
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <div
            style={{
              clipPath: `inset(0 ${((1 - pLabel) * 100).toFixed(3)}% 0 0)`,
              filter: entryBlur(pLabel, 7),
            }}
          >
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: B10.labelSize,
                lineHeight: `${Math.round(B10.labelSize * 1.12)}px`,
                color: T.white,
                whiteSpace: 'nowrap',
                letterSpacing: '-0.015em',
                textShadow: '0 5px 16px rgba(0,0,0,0.62), 0 2px 4px rgba(0,0,0,0.45)',
                display: 'block',
              }}
            >
              Avoid high-SD funds?
            </span>
          </div>
          <div
            style={{
              marginTop: 13,
              height: 7,
              borderRadius: 4,
              width: `${(pHi * 100).toFixed(2)}%`,
              alignSelf: 'stretch',
              background: T.amber,
              boxShadow: '0 3px 9px rgba(0,0,0,0.42)',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ===========================================================================================
 * B11 — SYNCHRONIZED SLIDE + "RISK TOLERANCE"  (window 102.64-111.83s -> 276 frames)
 *
 * Creator spec doc 15KN64, verbatim:
 *   "As the creator frame video scales and slides down to the bottom half of the frame, the top
 *    graphic background should slide down ... at the exact same time. They need to move together
 *    in perfect sync so there is no gap."
 *   "Ensure the bottom edge of the top graphic background uses a feathered mask ... so it blends
 *    smoothly into my video clip."
 *   "Once both layers have locked into their half-screen positions, animate the text
 *    'Risk Tolerance' popping up over the top background section."
 *
 * NO-GAP IS STRUCTURAL, NOT TUNED. The footage window's TOP EDGE and the panel's OPAQUE BOTTOM
 * are the SAME NUMBER at every frame:
 *
 *      panelOpaqueBottom(w) = -FEATHER + PANEL_H * w        (starts fully off-screen)
 *      windowTop(w)         = max(0, panelOpaqueBottom(w))
 *
 * so no strip of background can ever appear between them, at any easing, at any frame. The
 * footage inside the window is placed with contentTop = 114.4*Wn and scale k = 1 + 0.06*Wn where
 * Wn = windowTop/PANEL_OPAQUE, and 114.4 < PANEL_OPAQUE, so the video's own top edge is always
 * above the window's top edge too — it can never uncover the window either.
 *
 * The panel's feather sits BELOW its opaque bottom, i.e. over her footage: that is the blend.
 *
 * Deliver OPAQUE (it carries her footage): --codec=prores --prores-profile=hq
 * =========================================================================================== */

const B11 = {
  PANEL_OPAQUE: 594, // fully-cream depth. Reference fade runs frame-y 592 -> 738.
  FEATHER: 152, // feather midpoint = 594 + 76 = 670 = the measured seam
  slideStart: 2,
  slideFrames: 22,
  // her locked placement: source hair-top y594 lands at frame y744, source scaled 1.06
  contentTopLock: 114.4,
  kLock: 1.06,
  text1: 36, // "Risk"       — pops AFTER the layers lock (her ordering, explicit)
  text2: 62, // "Tolerance"
  hi: 186, // VO "risk tolerance" @108.828-109.309s -> local frames 186-191
  box1: {x: 199, y: 300, h: 176},
  box2: {x: 259, y: 480, h: 176},
  fontSize: 104,
  rot: -1.2, // measured off her reference: box top edges rise ~1.2deg to the right
};
const B11_PANEL_H = B11.PANEL_OPAQUE + B11.FEATHER;

/** The top graphic panel: warm paper ground, fine woven grid, coral line graph, rupee marks.
 *  Colours are brand tokens: her reference samples a warmer cream (~235,230,219) and a salmon
 *  line; the nearest tokens are $paper (#F3F2F0), $coral and $amber, which is what is used. */
const B11Panel: React.FC = () => {
  // Mountain-peak line graph. It passes BEHIND the text boxes, exactly as her reference does
  // (the coral peak runs under the "Small Cap" box and re-emerges above it) — a background
  // element reading through, not a floating prop straddling a card edge.
  // y values are compressed into 236..528 so no panel artwork enters the top-200 chrome zone.
  const pts: [number, number][] = [
    [-60, 528], [60, 395], [140, 467], [232, 328], [318, 419],
    [402, 236], [470, 278], [536, 452], [604, 370], [676, 253],
    [742, 342], [830, 298], [906, 425], [980, 356], [1064, 452], [1140, 395],
  ];
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: B11_PANEL_H}}>
      {/* ground + the fine woven grid ("a subtle grid" — measured ~3px pitch in her reference) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: T.paper,
          backgroundImage: `repeating-linear-gradient(0deg, rgba(20,21,26,0.030) 0 1px, rgba(0,0,0,0) 1px 4px), repeating-linear-gradient(90deg, rgba(20,21,26,0.030) 0 1px, rgba(0,0,0,0) 1px 4px)`,
        }}
      />
      <svg
        width={W}
        height={B11_PANEL_H}
        viewBox={`0 0 ${W} ${B11_PANEL_H}`}
        style={{position: 'absolute', inset: 0}}
      >
        <defs>
          <filter id="b11RupeeSoft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="b11LineSoft" x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
        {/* coral line graph */}
        <path
          d={d}
          fill="none"
          stroke={T.coral}
          strokeWidth={8}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.38}
          filter="url(#b11LineSoft)"
        />
        {/* rupee marks — soft amber brush strokes, kept FULLY clear of both text boxes */}
        <g filter="url(#b11RupeeSoft)" fill={T.amber}>
          <text
            x={78}
            y={352}
            fontFamily={SANS}
            fontWeight={800}
            fontSize={196}
            textAnchor="middle"
            opacity={0.62}
            transform="rotate(-16 78 352)"
          >
            ₹
          </text>
          <text
            x={1010}
            y={520}
            fontFamily={SANS}
            fontWeight={800}
            fontSize={158}
            textAnchor="middle"
            opacity={0.55}
            transform="rotate(13 1010 520)"
          >
            ₹
          </text>
        </g>
      </svg>
    </div>
  );
};

/** cosine feather from opaque..bottom, expressed as a CSS mask on the whole panel. */
function featherMask(opaque: number, total: number) {
  const stops: string[] = [`rgba(0,0,0,1) 0px`, `rgba(0,0,0,1) ${opaque}px`];
  const n = 24;
  for (let i = 1; i <= n; i++) {
    const u = i / n;
    const a = 0.5 + 0.5 * Math.cos(Math.PI * u); // 1 -> 0, zero derivative at both ends
    stops.push(`rgba(0,0,0,${a.toFixed(4)}) ${(opaque + u * (total - opaque)).toFixed(1)}px`);
  }
  return `linear-gradient(to bottom, ${stops.join(', ')})`;
}

export const B11RiskTolerance: React.FC<{
  totalFrames?: number;
  slideStart?: number;
  slideFrames?: number;
  textFrames?: [number, number];
  highlightFrame?: number;
  plate?: string;
}> = ({
  totalFrames = 276,
  slideStart = B11.slideStart,
  slideFrames = B11.slideFrames,
  textFrames = [B11.text1, B11.text2],
  highlightFrame = B11.hi,
  plate = 'b11-plate.mp4',
}) => {
  loadFonts();
  const f = useCurrentFrame();

  // ONE curve drives BOTH layers. There is no second curve to fall out of sync with.
  const w = ease(f, slideStart, slideStart + slideFrames);

  const panelOpaqueBottom = -B11.FEATHER + B11_PANEL_H * w;
  const panelTop = panelOpaqueBottom - B11.PANEL_OPAQUE;
  const windowTop = Math.max(0, panelOpaqueBottom);
  const Wn = windowTop / B11.PANEL_OPAQUE; // 0..1
  const k = 1 + (B11.kLock - 1) * Wn;
  const contentTop = B11.contentTopLock * Wn;

  const p1 = ease(f, textFrames[0], textFrames[0] + 14);
  const p2 = ease(f, textFrames[1], textFrames[1] + 14);
  const pHi = ease(f, highlightFrame, highlightFrame + 12);

  const box = (
    txt: string,
    g: {x: number; y: number; h: number},
    p: number
  ): React.ReactNode => (
    <div
      style={{
        position: 'absolute',
        left: g.x,
        top: g.y,
        height: g.h,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0 34px',
        background: T.indigo,
        boxShadow: SHADOW_ON_GROUND,
        transformOrigin: '0% 100%',
        transform: `rotate(${B11.rot}deg) scale(${(0.9 + 0.1 * p).toFixed(4)}) translateY(${((1 - p) * 26).toFixed(2)}px)`,
        opacity: p,
        filter: entryBlur(p, 9),
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: B11.fontSize,
          lineHeight: `${B11.fontSize}px`,
          letterSpacing: '-0.025em',
          color: T.white,
        }}
      >
        {txt}
      </span>
    </div>
  );

  return (
    <AbsoluteFill style={{background: T.paper}}>
      {/* ---- LAYER 1: her footage, in a window whose top edge IS the panel's opaque bottom ---- */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: windowTop,
          width: W,
          height: H - windowTop,
          overflow: 'hidden',
        }}
      >
        <OffthreadVideo
          src={staticFile(plate)}
          muted
          style={{
            position: 'absolute',
            left: -((W * k - W) / 2),
            top: contentTop - windowTop,
            width: W * k,
            height: H * k,
          }}
        />
      </div>

      {/* ---- LAYER 2: the top graphic panel, sliding on the SAME curve ---- */}
      <div style={{position: 'absolute', left: 0, top: panelTop, width: W, height: B11_PANEL_H}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            WebkitMaskImage: featherMask(B11.PANEL_OPAQUE, B11_PANEL_H),
            maskImage: featherMask(B11.PANEL_OPAQUE, B11_PANEL_H) as unknown as string,
          }}
        >
          <B11Panel />
        </div>
      </div>

      {/* ---- LAYER 3: the text, only AFTER both layers have locked ---- */}
      {box('Risk', B11.box1, p1)}
      {box('Tolerance', B11.box2, p2)}

      {/* one delayed, VO-synced highlight: amber rule wiping L->R under the lockup */}
      <div
        style={{
          position: 'absolute',
          left: B11.box2.x,
          top: B11.box2.y + B11.box2.h + 26,
          height: 10,
          width: 530 * pHi,
          maxWidth: 530,
          borderRadius: 5,
          background: T.amber,
          boxShadow: '0 4px 10px rgba(20,21,26,0.22)',
          transformOrigin: '0% 50%',
          transform: `rotate(${B11.rot}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ===========================================================================================
 * B13 — ALPHA / SHARPE RATIO / SORTINO RATIO  (window 116.93-125.74s -> 264 frames)
 *
 * Creator, verbatim: "Texts of Alpha, Sharpe Ratio and Sortino Ratio all line by line".
 *
 * SHE IS ON SCREEN AND HELD AT 1.12 ZOOM (the B12 rapid zoom never snaps back mid-take; the next
 * cover is B14 at 126.04). So the face box for THIS beat is the measured box scaled 1.12 about
 * (540,960): x91-1003 / y512-1454 — NOT tokens.ts FACE_BOX. The only band that holds three lines
 * is y200-512, and everything below lives inside her. All three rows sit in that band.
 *
 * Copy is authored, not pasted: term + a 3-5 word descriptor. This is the exact beat the style
 * file records as a past failure ("the Sharpe-ratio explainer had the script's Hinglish sentence
 * typeset across the frame while she spoke it").
 *
 * Deliver TRANSPARENT: --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le
 * =========================================================================================== */

const B13_ROWS: {term: string; desc: string}[] = [
  {term: 'Alpha', desc: 'Return vs benchmark'},
  {term: 'Sharpe Ratio', desc: 'Return per unit of risk'},
  {term: 'Sortino Ratio', desc: 'Downside risk only'},
];
const B13 = {
  x: 55,
  cardW: 970,
  cardH: 76,
  gap: 12,
  top: 230, // 230 / 318 / 406 -> bottom 482. Band is 200-512 -> 30px clear each end.
  r: 22,
  // VO: "alpha," @117.094 -> f5 ; "sharp" @117.475 -> f16 (held to f17 for the 0.4s stagger) ;
  //     "sortino" @118.595 -> f50
  lineFrames: [5, 17, 50] as [number, number, number],
  hi: 184, // "risk adjusted" @123.058 -> local f184
};

export const B13Ratios: React.FC<{
  totalFrames?: number;
  lineFrames?: [number, number, number];
  highlightFrame?: number;
}> = ({totalFrames = 264, lineFrames = B13.lineFrames, highlightFrame = B13.hi}) => {
  loadFonts();
  const f = useCurrentFrame();

  return (
    <AbsoluteFill>
      {/* style.md: every motion graphic gets a subtle scrim so it pops off the footage. Same
          edge-scrim grammar as B10, mirrored to the top and much quieter. */}
      <EdgeScrim
        edge="top"
        band={720}
        peak={0.45}
        totalFrames={totalFrames}
        fadeIn={15}
        fadeOut={15}
      />

      {B13_ROWS.map((row, i) => {
        const start = lineFrames[i];
        const p = ease(f, start, start + 12);
        const y = B13.top + i * (B13.cardH + B13.gap);
        // ONE highlight gesture: a single amber marker travelling down behind the three terms.
        const hStart = highlightFrame + i * 5;
        const pH = ease(f, hStart, hStart + 9);
        return (
          <div
            key={row.term}
            style={{
              position: 'absolute',
              left: B13.x,
              top: y,
              width: B13.cardW,
              height: B13.cardH,
              borderRadius: B13.r,
              background: T.white,
              boxShadow: SHADOW_ON_FOOTAGE,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              opacity: p,
              transform: `translateX(${((1 - p) * -46).toFixed(2)}px)`,
              filter: entryBlur(p, 9),
              overflow: 'hidden',
            }}
          >
            {/* index tile — fully inside the card, 26px from its edge */}
            <div
              style={{
                marginLeft: 26,
                width: 40,
                height: 40,
                borderRadius: 12,
                background: T.indigo,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(20,21,26,0.22)',
                flex: '0 0 auto',
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 22,
                  lineHeight: '22px',
                  color: T.white,
                }}
              >
                {`0${i + 1}`}
              </span>
            </div>

            {/* term, with the amber marker sitting behind it */}
            <div style={{position: 'relative', marginLeft: 22, flex: '0 0 auto'}}>
              <div
                style={{
                  position: 'absolute',
                  left: -10,
                  right: -10,
                  top: -6,
                  bottom: -6,
                  background: T.amber,
                  borderRadius: 7,
                  transformOrigin: '0% 50%',
                  transform: `scaleX(${pH.toFixed(4)})`,
                }}
              />
              <span
                style={{
                  position: 'relative',
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 42,
                  lineHeight: '46px',
                  letterSpacing: '-0.02em',
                  color: T.ink,
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {row.term}
              </span>
            </div>

            <span
              style={{
                marginLeft: 'auto',
                marginRight: 30,
                fontFamily: SANS,
                fontWeight: 600,
                fontSize: 26,
                lineHeight: '30px',
                color: T.indigo,
                whiteSpace: 'nowrap',
              }}
            >
              {row.desc}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ===========================================================================================
 * B14 — SHARPE vs SORTINO  (window 126.04-134.24s -> 246 frames). FULL-FRAME TAKEOVER.
 *
 * Creator: "full screen Motion graphics" + background doc 1uWwRj, which is the $periwinkle-ground
 * already in ../tokens. Her reference frame's display type is large Ivy Presto ITALIC in $indigo,
 * centred, two lines — matched here.
 *
 * The VISUAL carries the meaning: the same nine-period return series in both cards. Sharpe counts
 * every deviation ($indigo, all bars). Sortino counts only the ones below average ($coral down
 * bars, up bars knocked back to $rule-strong). No sentence is written about it.
 *
 * The bars are illustrative, not sourced, so they carry an "Illustrative" note and NOT the
 * "Source: Value Research" line — attributing invented bars to Value Research would be false.
 *
 * Deliver OPAQUE: --codec=prores --prores-profile=hq
 * =========================================================================================== */

const B14_SERIES = [58, -34, 92, -70, 44, -110, 76, -52, 30]; // fixed, deterministic
const B14 = {
  titleTop: 430,
  titleSize: 96,
  cardY: 750,
  cardH: 580,
  cardW: 440,
  gapX: 90,
  r: 32,
  baseline: 1040,
  barW: 26,
  barGap: 16,
  titleIn: 4,
  leftIn: 24,
  rightIn: 52,
  hi: 178, // VO "sortino" @131.963 -> local f178
};

const B14Card: React.FC<{
  x: number;
  term: string;
  caption: string;
  mode: 'total' | 'downside';
  p: number;
  fromLeft: boolean;
  markerP: number;
}> = ({x, term, caption, mode, p, fromLeft, markerP}) => {
  const inner = B14.cardW;
  const chartW = B14_SERIES.length * B14.barW + (B14_SERIES.length - 1) * B14.barGap;
  const x0 = (inner - chartW) / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: B14.cardY,
        width: B14.cardW,
        height: B14.cardH,
        borderRadius: B14.r,
        background: T.white,
        boxShadow: SHADOW_ON_GROUND,
        opacity: p,
        transform: `translateX(${((1 - p) * (fromLeft ? -70 : 70)).toFixed(2)}px) scale(${(0.94 + 0.06 * p).toFixed(4)})`,
        filter: entryBlur(p, 10),
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: '52px',
          letterSpacing: '-0.02em',
          color: T.ink,
        }}
      >
        {term}
      </div>

      <svg
        width={inner}
        height={B14.cardH}
        viewBox={`0 0 ${inner} ${B14.cardH}`}
        style={{position: 'absolute', left: 0, top: 0}}
      >
        {/* average line — the thing "above" and "below" are measured from */}
        <line
          x1={x0 - 18}
          x2={x0 + chartW + 18}
          y1={B14.baseline - B14.cardY}
          y2={B14.baseline - B14.cardY}
          stroke={T.ruleStrong}
          strokeWidth={3}
          strokeDasharray="10 8"
        />
        {B14_SERIES.map((v, i) => {
          const bx = x0 + i * (B14.barW + B14.barGap);
          const by = B14.baseline - B14.cardY - (v > 0 ? v : 0);
          const bh = Math.abs(v);
          const fill =
            mode === 'total' ? T.indigo : v > 0 ? T.ruleStrong : T.coral;
          return (
            <rect
              key={i}
              x={bx}
              y={by}
              width={B14.barW}
              height={bh}
              rx={6}
              fill={fill}
            />
          );
        })}
      </svg>

      {/* caption + the one delayed VO-synced highlight (amber marker behind it) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 450,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div
            style={{
              position: 'absolute',
              left: -12,
              right: -12,
              top: -6,
              bottom: -4,
              borderRadius: 7,
              background: T.amber,
              transformOrigin: '0% 50%',
              transform: `scaleX(${markerP.toFixed(4)})`,
            }}
          />
          <span
            style={{
              position: 'relative',
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 30,
              lineHeight: '36px',
              color: T.ink,
              whiteSpace: 'nowrap',
            }}
          >
            {caption}
          </span>
        </div>
      </div>
    </div>
  );
};

export const B14SharpeSortino: React.FC<{
  totalFrames?: number;
  highlightFrame?: number;
}> = ({totalFrames = 246, highlightFrame = B14.hi}) => {
  loadFonts();
  const f = useCurrentFrame();

  const pT = ease(f, B14.titleIn, B14.titleIn + 14);
  const pL = ease(f, B14.leftIn, B14.leftIn + 16);
  const pR = ease(f, B14.rightIn, B14.rightIn + 16);
  const pH = ease(f, highlightFrame, highlightFrame + 10);

  const leftX = B14.cardW + B14.gapX <= W ? 55 : 55;
  const rightX = leftX + B14.cardW + B14.gapX;

  return (
    <AbsoluteFill>
      <PeriwinkleGround />
      <SparkleStar which="topRight" />
      <SparkleStar which="bottomLeft" />

      {/* Ivy Presto italic, $indigo, centred, two lines — her reference's display voice.
          NOTE: assets/fonts/ ships no Ivy Presto ITALIC face, so this is Chromium's synthetic
          oblique of Ivy Presto Display Semi-Bold. Flagged: the true italic OTF is missing. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: B14.titleTop,
          width: W,
          textAlign: 'center',
          opacity: pT,
          transform: `translateY(${((1 - pT) * 30).toFixed(2)}px)`,
          filter: entryBlur(pT, 8),
        }}
      >
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: B14.titleSize,
            lineHeight: `${Math.round(B14.titleSize * 1.06)}px`,
            color: T.indigo,
            textShadow: '0 8px 20px rgba(83,103,252,0.16)',
          }}
        >
          Total risk
          <br />
          vs downside
        </div>
      </div>

      <B14Card
        x={leftX}
        term="Sharpe Ratio"
        caption="Every swing counts"
        mode="total"
        p={pL}
        fromLeft
        markerP={0}
      />
      <B14Card
        x={rightX}
        term="Sortino Ratio"
        caption="Only the drops count"
        mode="downside"
        p={pR}
        fromLeft={false}
        markerP={pH}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: B14.cardY + B14.cardH + 32,
          width: W,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 22,
          lineHeight: '28px',
          color: T.ink,
          opacity: Math.min(pL, pR),
        }}
      >
        Dashed line = average return
        <br />
        Illustrative
      </div>
    </AbsoluteFill>
  );
};

/* Re-exported so a verification harness can measure the ground independently. */
export const _B14Ground: React.FC = () => (
  <AbsoluteFill>
    <PeriwinkleGround />
    <SparkleStar which="topRight" />
    <SparkleStar which="bottomLeft" />
  </AbsoluteFill>
);
