import React from 'react';
import {
  AbsoluteFill,
  Composition,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {FRAME, GRADIENT_GROUND as G, REF13, T} from '../tokens';
import {loadFonts} from '../fonts';

/* ===========================================================================
 * B7 / B8 — the two fund tables (standard-deviation-equity-funds)
 *
 * Layout comes from the creator's own linked spec for this frame:
 *   "creator is in square mask, the mask should have drop shadow ... maintain
 *    similar background as shown in the reference (a gradient of both brand
 *    purple and brand green, a subtle grid with a very low opacity). Here there
 *    is a bar graph animation in a white square rounded corner square box,
 *    instead of bar graph animation, I need this ... table animation."
 *
 * So: GRADIENT_GROUND (not PERIWINKLE) + REF13.mask (her, top-centre, shadowed)
 * + REF13.card (white, rounded, carrying the table).
 *
 * The table itself follows style.md "Data tables: land COMPLETE, then highlight":
 * the whole table — header band, every category band, every fund row, every
 * value, every rule and the source line — is finished by frame 28 (0.933s). The
 * hold then carries style.md's held-table exception ("sequential VO-synced cell
 * highlights, one instrument at a time"): a slow walk down the five category
 * bands, each band's tint deepening briefly (0.11 -> 0.22 of the SAME indigo),
 * one group at a time, never two at once, geometry untouched. The mask keeps
 * playing (it is her face); the tint walk is the only thing moving on the card.
 *
 * Data is transcribed VERBATIM from assets/fund-data.json, in the document's own
 * row order, including the four recorded data flags (HSBC Small Cap's SD equal to
 * its benchmark; the lower-SD Flexi Cap rows carrying the Mid Cap benchmark and
 * category figures). Those are the creator's to fix — nothing here corrects,
 * drops or reorders a row.
 * ========================================================================= */

/* ---------------------------------------------------------------------------
 * DATA — verbatim from assets/fund-data.json, grouped by the five categories
 * the source screenshots are actually built from. Group order = source order,
 * which differs between the two sets (lower-SD runs Small/Large/Mid/Flexi/Multi).
 * ------------------------------------------------------------------------- */

export type FundGroup = {
  /** category label, e.g. "Small Cap" */
  cat: string;
  /** benchmark std deviation shared by every fund in this category */
  benchmark: number;
  /** category-average std deviation shared by every fund in this category */
  category: number;
  /** the funds, in source order: [fund name, its own std deviation] */
  funds: [string, number][];
};

export const HIGHER_GROUPS: FundGroup[] = [
  {cat: 'Small Cap', benchmark: 21.75, category: 20.28, funds: [
    ['HSBC Small Cap', 21.75],            // flag F1: equals its benchmark. Rendered as supplied.
    ['Bank of India Small Cap', 21.79],
  ]},
  {cat: 'Mid Cap', benchmark: 17.88, category: 17.76, funds: [
    ['Motilal Oswal Mid Cap Fund', 20.48],
    ['JM Mid Cap Fund', 18.97],
  ]},
  {cat: 'Large Cap', benchmark: 14.36, category: 15.16, funds: [
    ['Invesco India Large Cap', 15.62],
    ['JM Large Cap Fund', 15.23],
  ]},
  {cat: 'Flexi Cap', benchmark: 15.22, category: 15.27, funds: [
    ['JM Flexicap Fund', 17.08],
    ['Bank of India Flexi Cap Fund', 18.83],
  ]},
  {cat: 'Multi Cap', benchmark: 16.41, category: 16.25, funds: [
    ['Kotak Multicap Fund', 17.44],
    ['Invesco India Multicap Fund', 17.28],
  ]},
];

export const LOWER_GROUPS: FundGroup[] = [
  {cat: 'Small Cap', benchmark: 21.75, category: 20.28, funds: [
    ['Axis Small Cap', 16.79],
    ['SBI Small Cap', 17.15],
  ]},
  {cat: 'Large Cap', benchmark: 14.36, category: 15.16, funds: [
    ['Sundaram Large Cap Fund', 12.71],
    ['ICICI Prudential Large Cap Fund', 13.26],
  ]},
  {cat: 'Mid Cap', benchmark: 17.88, category: 17.76, funds: [
    ['HDFC Mid Cap Fund', 15.35],
    ['Baroda BNP Paribas Mid Cap Fund', 15.45],
  ]},
  // flag F2: these two carry the MID CAP benchmark/category (17.88 / 17.76) in the
  // source, where the higher-SD Flexi Cap block uses 15.22 / 15.27. Rendered as supplied.
  {cat: 'Flexi Cap', benchmark: 17.88, category: 17.76, funds: [
    ['Parag Parikh Flexi Cap Fund', 9.88],
    ['HDFC Flexi Cap Fund', 12.91],
  ]},
  {cat: 'Multi Cap', benchmark: 16.41, category: 16.25, funds: [
    ['SBI Multicap Fund', 14.06],
    ['Nippon India Multicap Fund', 15.32],
  ]},
];

/* ---------------------------------------------------------------------------
 * GEOMETRY — every rule lands on a WHOLE pixel.
 *
 * The card is REF13.card, 832 wide (NOT the 970 in TABLE_GEOM — superseded for
 * this beat by the creator's reference frame). Re-derived from 832:
 *
 *   832 card - 2*24 padding      = 784 inner
 *   784 = 530 FUND NAME + 3 rule + 251 STD DEVIATION      <- all integers
 *
 * The naive 10-row x 4-col transcription of the five source screenshots would
 * repeat BENCHMARK and CATEGORY five times each (20 redundant cells) and squeeze
 * the fund name to ~280px, where "Baroda BNP Paribas Mid Cap Fund" cannot fit.
 * Grouping by category instead states each shared pair ONCE, in a tinted band,
 * and buys the fund name 530px.
 *
 * Rules are drawn as 3px-tall/wide rects whose top-left sits ON an integer, never
 * centred on one (`y - RULE/2` is what puts a rule on a half-pixel and makes the
 * weight wobble down the table).
 * ------------------------------------------------------------------------- */

const CARD = REF13.card;                     // {x:122, y:618, w:832, h:790, r:39}
const MASK = REF13.mask;                     // {x:363, y:152, w:328, h:400, r:57}

const PAD = 24;
const IX0 = CARD.x + PAD;                    // 146
const INNER = CARD.w - PAD * 2;              // 784
const IX1 = IX0 + INNER;                     // 930
const NAME_W = 530;
const RULE = 3;
const SD_W = INNER - NAME_W - RULE;          // 251
const VRULE_X = IX0 + NAME_W;                // 676  -> occupies 676,677,678
const SD_X0 = VRULE_X + RULE;                // 679
const CELL_PAD = 16;
const SD_RIGHT = IX1 - CELL_PAD;             // 914

const TITLE_BASE = CARD.y + 52;              // 670
const TABLE_TOP = CARD.y + 80;               // 698
const HEADER_H = 40;                         // 698 -> 738
const BODY_TOP = TABLE_TOP + HEADER_H + RULE; // 741 (after the rule under the header)

const BAND_H = 36;
const ROW_H = 38;
const GROUP_H = BAND_H + RULE + ROW_H + RULE + ROW_H + RULE;  // 121
const N_GROUPS = 5;
const TABLE_BOTTOM = BODY_TOP + GROUP_H * N_GROUPS;           // 1346 (= bottom rule's lower edge)
const SOURCE_BASE = TABLE_BOTTOM + 34;                        // 1380  (card ends 1408)

// Shared benchmark / category figures inside a band. Fixed x positions so the two
// numbers line up down all five bands, and so nothing is sliced by the column rule:
// the benchmark pair ends 16px LEFT of the rule, the category pair starts 21px right of it.
const BM_LABEL_X = 470;
const BM_VALUE_RIGHT = 660;   // < VRULE_X (676)
const CAT_LABEL_X = 700;      // > SD_X0 (679)
const CAT_VALUE_RIGHT = SD_RIGHT; // 914 — same right edge as the fund SD column

// --- the build ------------------------------------------------------------
const CARD_IN_END = 9;
const GROUP_START = 5;
const GROUP_STAGGER = 4.5;    // 0.15s at 30fps
const GROUP_SETTLE = 5;
const HEAD_START = 3;         // title + header band + top rule land WITH the empty card
const HEAD_END = 10;
const TAIL_START = 20;        // source line last (style.md: "footnote last")
/** Frame at which the table is COMPLETE. 28 frames = 0.933s. */
export const BUILD_END = 28;

// --- the held-table walk ---------------------------------------------------
const WALK_EASE = 9;          // 0.3s at 30fps — each tint step eases in/out, no bounce

const fmt = (n: number) => n.toFixed(2);

/* ---------------------------------------------------------------------------
 * GROUND — GRADIENT_GROUND from ../tokens: brand purple -> white -> brand green
 * at 135deg, plus the measured 73px grid (BLACK at 7.5%, not white), plus the
 * soft white spotlight brand.md specifies behind the hero. The spotlight uses a
 * cosine falloff so it reaches TRUE zero with no visible edge.
 * ------------------------------------------------------------------------- */
export const GradientGround: React.FC = () => {
  const {w, h} = FRAME;

  const vlines: React.ReactNode[] = [];
  for (let x = G.gridFirstX; x < w; x += G.gridPitch) {
    vlines.push(<rect key={`v${x}`} x={x} y={0} width={2} height={h} fill="#000000" opacity={G.gridAlpha} />);
  }
  const hlines: React.ReactNode[] = [];
  for (let y = G.gridFirstX; y < h; y += G.gridPitch) {
    hlines.push(<rect key={`h${y}`} x={0} y={y} width={w} height={2} fill="#000000" opacity={G.gridAlpha} />);
  }

  // cosine falloff, 12 stops, exact zero at the rim
  const spotPeak = 0.3;
  const stops = Array.from({length: 13}, (_, i) => {
    const t = i / 12;
    return (
      <stop key={i} offset={String(t)} stopColor="#FFFFFF"
            stopOpacity={spotPeak * 0.5 * (1 + Math.cos(Math.PI * t))} />
    );
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${G.angle}deg, ${G.periwinkle} 0%, ${G.mid} 52%, ${G.mint} 100%)`,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="tblSpot" cx={MASK.x + MASK.w / 2} cy={MASK.y + MASK.h / 2} r={640}
                          gradientUnits="userSpaceOnUse">
            {stops}
          </radialGradient>
        </defs>
        <rect width={w} height={h} fill="url(#tblSpot)" />
        {vlines}
        {hlines}
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------------------
 * MASK — the creator, rounded square, top-centre, with shadow-soft.
 * Content is pre-cropped per beat to public/mask/<id>-mask.mp4 at 656x800 (2x the
 * mask) from raw/standard-deviation.mp4 with crop 683x833 @ (242,538) — the crop
 * MEASURED on this shoot (hair top y580, face skin x355-813 / y600-1100), not the
 * REF13.faceCrop value, which is from a different shoot and over-zooms.
 * The mask does NOT animate: her lips have to keep matching the audio, and B7->B8
 * is an in-place content swap in which only the card changes.
 * ------------------------------------------------------------------------- */
const CreatorMask: React.FC<{clip: string}> = ({clip}) => (
  <div
    style={{
      position: 'absolute',
      left: MASK.x,
      top: MASK.y,
      width: MASK.w,
      height: MASK.h,
      borderRadius: MASK.r,
      overflow: 'hidden',
      // shadow-soft: soft black, down-right, blur scaling with the element
      boxShadow: '0 14px 34px rgba(0,0,0,0.30), 0 4px 10px rgba(0,0,0,0.20)',
      backgroundColor: T.ink,
    }}
  >
    <OffthreadVideo
      src={staticFile(clip)}
      muted
      style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
    />
  </div>
);

/* ---------------------------------------------------------------------------
 * THE TABLE
 * ------------------------------------------------------------------------- */
const TableCard: React.FC<{
  title: string;
  groups: FundGroup[];
  walk: [number, number] | null;
}> = ({title, groups, walk}) => {
  const f = useCurrentFrame();

  const cardIn = interpolate(f, [0, CARD_IN_END - 2], [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const cardScale = interpolate(f, [0, CARD_IN_END], [1.045, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const cardDy = interpolate(f, [0, CARD_IN_END], [22, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  const gA = (g: number) =>
    interpolate(f, [GROUP_START + g * GROUP_STAGGER, GROUP_START + g * GROUP_STAGGER + GROUP_SETTLE],
      [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const gDx = (g: number) =>
    interpolate(f, [GROUP_START + g * GROUP_STAGGER, GROUP_START + g * GROUP_STAGGER + GROUP_SETTLE],
      [-14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  const head = interpolate(f, [HEAD_START, HEAD_END], [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tail = interpolate(f, [TAIL_START, BUILD_END], [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // The held-table highlight pass (style.md's named exception to one-highlight-
  // per-graphic): a slow tinted-band walk down the five category groups, in table
  // order. Each band's tint deepens 0.11 -> 0.22 (the SAME $indigo, ~2x alpha)
  // and settles back before the next band starts — one group at a time, never
  // two at once, eased WALK_EASE frames each way, no bounce. The neat contiguity
  // matters for verification: group g's release completes on frame e-1 and group
  // g+1's rise starts on frame e, so a consecutive-frame diff never shows two
  // bands changing together. Neither table speaks a per-figure VO cue, so the
  // walk paces the groups evenly across the hold instead of pinning to words.
  const bandEmph = (g: number) => {
    if (!walk) return 0;
    const [ws, we] = walk;
    const per = (we - ws) / N_GROUPS;
    const s = ws + g * per;
    const e = s + per;
    const up = interpolate(f, [s, s + WALK_EASE], [0, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
    const down = interpolate(f, [e - WALK_EASE - 1, e - 1], [1, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
    return Math.min(up, down);
  };

  return (
    <div style={{position: 'absolute', inset: 0, opacity: cardIn,
                 transform: `translateY(${cardDy}px) scale(${cardScale})`,
                 transformOrigin: `${CARD.x + CARD.w / 2}px ${CARD.y + CARD.h / 2}px`}}>
      <svg width={FRAME.w} height={FRAME.h} viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}
           style={{position: 'absolute', inset: 0}}>
        <defs>
          {/* shadow-soft, matched to the mask's */}
          <filter id="tblCardShadow" x="-20%" y="-20%" width="150%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="15" floodColor="#000000" floodOpacity="0.26" />
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.18" />
          </filter>
        </defs>

        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={CARD.r}
              fill={T.white} filter="url(#tblCardShadow)" />

        {/* card title — a LABEL for the frame, not the narration */}
        <text x={IX0} y={TITLE_BASE} fontFamily="InterTight" fontWeight={800} fontSize={28}
              letterSpacing="0.012em" fill={T.ink} opacity={head}>{title}</text>

        {/* header band — $indigo is brand.md's workhorse for table headers */}
        <g opacity={head}>
          <rect x={IX0} y={TABLE_TOP} width={INNER} height={HEADER_H} fill={T.indigo} />
          <text x={IX0 + CELL_PAD} y={TABLE_TOP + HEADER_H / 2 + 19 * 0.36} fontFamily="InterTight"
                fontWeight={700} fontSize={19} letterSpacing="0.07em" fill={T.white}>FUND NAME</text>
          <text x={SD_RIGHT} y={TABLE_TOP + HEADER_H / 2 + 19 * 0.36} textAnchor="end"
                fontFamily="InterTight" fontWeight={700} fontSize={19} letterSpacing="0.07em"
                fill={T.white}>STD DEVIATION (%)</text>
        </g>

        {/* rule under the header */}
        <rect x={IX0} y={TABLE_TOP + HEADER_H} width={INNER} height={RULE} fill={T.ruleStrong} opacity={head} />

        {groups.map((grp, g) => {
          const gT = BODY_TOP + g * GROUP_H;
          const a = gA(g);
          const dx = gDx(g);
          const bandBase = gT + BAND_H / 2 + 21 * 0.36;
          return (
            <g key={grp.cat} transform={`translate(${dx} 0)`} opacity={a}>
              {/* tinted band — hierarchy comes from the tint, NEVER a heavier rule.
                  The walk deepens THIS rect's alpha only; nothing else moves. */}
              <rect x={IX0} y={gT} width={INNER} height={BAND_H} fill={T.indigo}
                    opacity={0.11 + 0.11 * bandEmph(g)} />
              <text x={IX0 + CELL_PAD} y={bandBase} fontFamily="InterTight" fontWeight={800}
                    fontSize={21} letterSpacing="0.07em" fill={T.ink}>{grp.cat.toUpperCase()}</text>
              <text x={BM_LABEL_X} y={bandBase} fontFamily="InterTight" fontWeight={600} fontSize={16}
                    letterSpacing="0.05em" fill={T.muted}>Benchmark</text>
              <text x={BM_VALUE_RIGHT} y={bandBase} textAnchor="end" fontFamily="InterTight"
                    fontWeight={700} fontSize={21} fill={T.ink}>{fmt(grp.benchmark)}</text>
              <text x={CAT_LABEL_X} y={bandBase} fontFamily="InterTight" fontWeight={600} fontSize={16}
                    letterSpacing="0.05em" fill={T.muted}>Category</text>
              <text x={CAT_VALUE_RIGHT} y={bandBase} textAnchor="end" fontFamily="InterTight"
                    fontWeight={700} fontSize={21} fill={T.ink}>{fmt(grp.category)}</text>

              {/* rule below the band */}
              <rect x={IX0} y={gT + BAND_H} width={INNER} height={RULE} fill={T.ruleStrong} />

              {grp.funds.map(([name, sd], r) => {
                const rowTop = gT + BAND_H + RULE + r * (ROW_H + RULE);
                const base = rowTop + ROW_H / 2 + 25 * 0.36;
                return (
                  <g key={name}>
                    <text x={IX0 + CELL_PAD} y={base} fontFamily="InterTight" fontWeight={600}
                          fontSize={25} fill={T.ink}>{name}</text>
                    <text x={SD_RIGHT} y={base} textAnchor="end" fontFamily="InterTight"
                          fontWeight={700} fontSize={26} fill={T.ink}>{fmt(sd)}</text>
                    {/* row rule (the last one in the last group is the table's bottom rule) */}
                    <rect x={IX0} y={rowTop + ROW_H} width={INNER} height={RULE} fill={T.ruleStrong} />
                  </g>
                );
              })}

              {/* column rule — same 3px, same $ruleStrong. It runs the two fund rows and
                  stops at the tinted band, which is a full-bleed section strip. */}
              <rect x={VRULE_X} y={gT + BAND_H} width={RULE} height={GROUP_H - BAND_H}
                    fill={T.ruleStrong} />
            </g>
          );
        })}

        {/* source line — non-negotiable on a finance channel.
            F3: the lower-SD source block carries no date in the original; both tables are
            normalised to August 25, 2026. Flagged, not silently invented. */}
        <g opacity={tail}>
          <text x={IX0} y={SOURCE_BASE} fontFamily="InterTight" fontWeight={700} fontSize={26}
                fill={T.ink}>Source: Value Research</text>
          <text x={IX0 + 300} y={SOURCE_BASE} fontFamily="InterTight" fontWeight={500} fontSize={23}
                fill={T.muted}>Direct Growth · August 25, 2026</text>
        </g>
      </svg>
    </div>
  );
};

/* ---------------------------------------------------------------------------
 * THE TWO COMPOSITIONS
 * ------------------------------------------------------------------------- */
export type TableProps = {
  /** window of the held-table band walk, [startFrame, endFrame] relative to the
   *  beat: five equal steps, one category band at a time, in table order.
   *  null = no walk (the card holds dead static after BUILD_END). */
  walkFrames?: [number, number] | null;
};

export const B7Table: React.FC<TableProps> = ({walkFrames = B7_WALK}) => {
  loadFonts();
  return (
    <AbsoluteFill style={{backgroundColor: G.mid}}>
      <GradientGround />
      <CreatorMask clip="mask/b7-mask.mp4" />
      <TableCard title="HIGHER THAN BENCHMARK & CATEGORY" groups={HIGHER_GROUPS}
                 walk={walkFrames} />
    </AbsoluteFill>
  );
};

export const B8Table: React.FC<TableProps> = ({walkFrames = B8_WALK}) => {
  loadFonts();
  return (
    <AbsoluteFill style={{backgroundColor: G.mid}}>
      <GradientGround />
      <CreatorMask clip="mask/b8-mask.mp4" />
      <TableCard title="LOWER THAN BENCHMARK & CATEGORY" groups={LOWER_GROUPS}
                 walk={walkFrames} />
    </AbsoluteFill>
  );
};

/* Beat windows from transcript/cutsheet.json. Frame = round(seconds * 30). */
export const B7_WINDOW = {start: 56.57, end: 62.29} as const;   // 1697 -> 1869, 172 frames
export const B8_WINDOW = {start: 62.31, end: 68.5} as const;    // 1869 -> 2055, 186 frames
const F = (s: number) => Math.round(s * FRAME.fps);

/* Walk pacing: the build settles at f28, the walk starts at f35, and the last
 * band has fully released 15 frames before the comp's final frame. Five equal
 * steps in between (composition review 2026-09-02: "21 numbers, 11.9s, no eye
 * guidance" — the hold now guides, the entrance still lands complete). */
export const B7_WALK: [number, number] = [35, F(B7_WINDOW.end) - F(B7_WINDOW.start) - 15]; // [35, 157]
export const B8_WALK: [number, number] = [35, F(B8_WINDOW.end) - F(B8_WINDOW.start) - 15]; // [35, 171]

/** Drop <TableCompositions /> into RemotionRoot — Root.tsx is not touched by this file. */
export const TableCompositions: React.FC = () => (
  <>
    <Composition
      id="b7-table-higher"
      component={B7Table}
      durationInFrames={F(B7_WINDOW.end) - F(B7_WINDOW.start)}
      fps={FRAME.fps}
      width={FRAME.w}
      height={FRAME.h}
      defaultProps={{walkFrames: B7_WALK} as TableProps}
    />
    <Composition
      id="b8-table-lower"
      component={B8Table}
      durationInFrames={F(B8_WINDOW.end) - F(B8_WINDOW.start)}
      fps={FRAME.fps}
      width={FRAME.w}
      height={FRAME.h}
      defaultProps={{walkFrames: B8_WALK} as TableProps}
    />
  </>
);
