import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {T, REF13, TABLE_SWEEP} from '../tokens';

/**
 * The 11x2 table, built as ONE complete object.
 *
 * CLAUDE.md / style.md, "Data tables: land COMPLETE, then highlight", plus the creator's
 * directive 2026-08-23: *"when a comment is on an instruction script and the script has a
 * table, construct the table first itself, and then proceed with highlighting the elements.
 * Don't construct it part by part."*
 *
 * So the contract this component keeps:
 *   1. ROWS is taken verbatim from the document's STRUCTURED source (its table markup), never
 *      inferred from the prose. Declared structure = 11 rows x 2 columns and that is ground truth.
 *   2. `buildEnd` is when the table is whole. Every label, every value, every rule and the source
 *      line are on screen by then, and `buildEnd` lands BEFORE the VO reaches its first figure.
 *   3. Only after that does a single highlight walk the value column, one cell at a time.
 *      Never two lit at once.
 *
 * Geometry is measured off the creator's own reference frame (REF13 harvest), and every column
 * divides to a WHOLE PIXEL — fractional columns are what make rule weights wobble down a table.
 *   card 832 wide - 2x24 padding = 784 inner = 544 label + 240 value.  Both integers.
 */

/** Structured source: doc 1o98G1UC..., Tab 1 table. 11 rows x 2 cols, in the document's order. */
export const ROWS: [string, string][] = [
  ['Nippon India',     '9.59%'],
  ['SBI',              '9.59%'],
  ['Motilal Oswal',    '9.59%'],
  ['HDFC',             '9.59%'],
  ['ICICI Prudential', '9.59%'],
  ['Edelweiss',        '9.60%'],
  ['JioBlackRock',     '9.59%'],
  ['Groww',            '9.59%'],
  ['Bandhan',          '9.59%'],
  ['Kotak',            '9.58%'],
  ['DSP',              '9.59%'],
];

const PAD = 24;
const INNER = REF13.card.w - PAD * 2;   // 784
const LABEL_W = 544;                    // integer
const VALUE_W = INNER - LABEL_W;        // 240, integer -> every rule lands on a whole pixel
const RULE = 3;                         // ONE weight, ONE colour, everywhere
const HEADER_H = 48;
const ROW_H = 47;
const TITLE_TOP = 54;
const TITLE_SIZE = 26;
const CELL_SIZE = 32;

const X0 = REF13.card.x + PAD;              // 146
const TABLE_TOP = REF13.card.y + 114;       // 732
const SOURCE_BASELINE = REF13.card.y + REF13.card.h - 72;  // 1336

export const TABLE_GEOM = {X0, TABLE_TOP, HEADER_H, ROW_H, LABEL_W, VALUE_W, INNER,
  bodyTop: TABLE_TOP + HEADER_H,
  bodyBottom: TABLE_TOP + HEADER_H + ROW_H * ROWS.length,
  valueX: X0 + LABEL_W};

export const DataTable: React.FC<{
  /** frame at which the table is fully built. Must precede the VO's first figure. */
  buildEnd: number;
  /** [startFrame, endFrame] of the sequential value-column highlight cascade. */
  highlight?: [number, number];
}> = ({buildEnd, highlight}) => {
  const f = useCurrentFrame();

  // ---- the build ---------------------------------------------------------
  // Card + skeleton slam in, then rows stagger 0.18s apart, ALL finished by buildEnd.
  const cardIn = interpolate(f, [0, 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const cardScale = interpolate(f, [0, 9], [1.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const rowStagger = 4.5;                       // ~0.18s at 25fps
  const rowStart = 10;
  const rowAlpha = (i: number) =>
    interpolate(f, [rowStart + i * rowStagger, rowStart + i * rowStagger + 5], [0, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const rowDx = (i: number) =>
    interpolate(f, [rowStart + i * rowStagger, rowStart + i * rowStagger + 5], [-14, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const tailAlpha = interpolate(f, [rowStart + ROWS.length * rowStagger, buildEnd], [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // ---- the highlight -----------------------------------------------------
  // One mint sweep per value cell, walking top->bottom, each with a HARD vertical leading
  // edge (a wipe, not a fade) and holding once it has landed. Never two mid-sweep at once:
  // each cell's wipe completes before the next begins.
  // Creator override 2026-08-23: MINT #60CFAC, matching her reference frame, not $amber.
  const sweepWidth = (i: number) => {
    if (!highlight) return 0;
    const [hs, he] = highlight;
    const per = (he - hs) / ROWS.length;
    const s = hs + i * per;
    return interpolate(f, [s, s + per * 0.82], [0, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  };

  const rules: React.ReactNode[] = [];
  for (let i = 0; i <= ROWS.length; i++) {
    const y = TABLE_GEOM.bodyTop + i * ROW_H;
    rules.push(<rect key={`r${i}`} x={X0} y={y - RULE / 2} width={INNER} height={RULE}
      fill={T.ruleStrong} opacity={i === 0 ? tailAlpha : rowAlpha(i - 1)} />);
  }

  return (
    <div style={{position: 'absolute', inset: 0, opacity: cardIn,
                 transform: `scale(${cardScale})`, transformOrigin: '50% 62%'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          {/* brand.md golden rule + creator directive 2026-08-23: shadows on everything.
              shadow-soft: soft black, down-right, blur scaling with the element. */}
          <filter id="cardShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="6" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.30" />
            <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* the card */}
        <rect x={REF13.card.x} y={REF13.card.y} width={REF13.card.w} height={REF13.card.h}
              rx={REF13.card.r} fill={T.white} filter="url(#cardShadow)" />

        {/* title — names the index ONCE so the rows carry only the AMC (creator decision) */}
        <text x={540} y={REF13.card.y + TITLE_TOP + TITLE_SIZE} textAnchor="middle"
              fontFamily="InterTight" fontWeight={700} fontSize={TITLE_SIZE}
              letterSpacing="0.02em" fill={T.ink} opacity={tailAlpha}>
          MID-CAP SHARE — NIFTY SMALLCAP 250 INDEX FUNDS
        </text>

        {/* header band — $indigo is the workhorse for table headers */}
        <g opacity={tailAlpha}>
          <rect x={X0} y={TABLE_TOP} width={INNER} height={HEADER_H} fill={T.indigo} />
          <text x={X0 + 18} y={TABLE_TOP + HEADER_H / 2 + 11} fontFamily="InterTight"
                fontWeight={700} fontSize={26} letterSpacing="0.06em" fill={T.white}>FUND HOUSE</text>
          <text x={X0 + INNER - 18} y={TABLE_TOP + HEADER_H / 2 + 11} textAnchor="end"
                fontFamily="InterTight" fontWeight={700} fontSize={26} letterSpacing="0.06em"
                fill={T.white}>MID-CAP %</text>
        </g>

        {/* rows: label + value. Every row present by buildEnd. */}
        {ROWS.map(([label, value], i) => {
          const yTop = TABLE_GEOM.bodyTop + i * ROW_H;
          const yText = yTop + ROW_H / 2 + CELL_SIZE * 0.35;
          const a = rowAlpha(i);
          const sw = sweepWidth(i);
          return (
            <g key={label}>
              {/* tinted band carries hierarchy — never a thicker rule */}
              {i % 2 === 1 ? <rect x={X0} y={yTop} width={INNER} height={ROW_H} fill={T.rule} opacity={a * 0.9} /> : null}
              {/* the mint sweep sits UNDER the digits so the value stays readable */}
              {sw > 0 ? (
                <rect x={TABLE_GEOM.valueX + 8} y={yText - CELL_SIZE * 0.80}
                      width={(VALUE_W - 26) * sw} height={CELL_SIZE * 1.02}
                      fill={TABLE_SWEEP} opacity={0.95} />
              ) : null}
              <text x={X0 + 18 + rowDx(i)} y={yText} fontFamily="InterTight" fontWeight={600}
                    fontSize={CELL_SIZE} fill={T.ink} opacity={a}>{label}</text>
              <text x={X0 + INNER - 18} y={yText} textAnchor="end" fontFamily="InterTight"
                    fontWeight={700} fontSize={CELL_SIZE} fill={T.ink} opacity={a}>{value}</text>
            </g>
          );
        })}

        {/* one weight, one colour, on whole pixels */}
        {rules}
        <rect x={TABLE_GEOM.valueX - RULE / 2} y={TABLE_TOP} width={RULE}
              height={HEADER_H + ROW_H * ROWS.length} fill={T.ruleStrong} opacity={tailAlpha} />

        {/* non-negotiable on a finance channel */}
        <text x={REF13.card.x + 55} y={SOURCE_BASELINE} fontFamily="InterTight" fontWeight={700}
              fontSize={26} fill={T.ink} opacity={tailAlpha}>Source: Groww</text>
      </svg>
    </div>
  );
};
