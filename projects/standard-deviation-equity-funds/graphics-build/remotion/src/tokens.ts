// Colours come from brand.md ONLY — never invent a hex here.
// (CLAUDE.md standing rule: "Colours come from brand.md tokens, never hardcoded hex")
export const T = {
  accent:      '#00D09C', // identity only — logos, wipe sheets, CTA. NEVER data ink.
  indigo:      '#5367FC', // the workhorse graphic colour
  amber:       '#FCB31C', // highlight sweeps + caption karaoke word
  coral:       '#F26B55', // negative values / warnings
  mint:        '#67F9C8',
  ink:         '#44475B', // all dark text
  muted:       '#B1B4B7',
  ruleStrong:  '#CCCFD1',
  rule:        '#ECEDEE',
  bg:          '#F9FAFA',
  white:       '#FFFFFF',
  paper:       '#F3F2F0', // paper-ground
  shadowHard:  '#53B091',
  outline:     '#14151A',
  captionChip: '#040304',
} as const;

// NOTE: the style file says the channel runs at 25fps. THIS creator's supplied cut is EXACTLY
// 30/1 fps (4311 frames / 143.7s, probed). Conforming her talking head 30->25 drops 1 frame in 6
// and judders the face, and the pipeline rule is that her cut is the master and is never re-timed.
// So this JOB runs at 30fps and the leak curve is resampled from its measured 13 frames @25fps.
// Flagged to the creator as a style deviation.
export const FRAME = {w: 1080, h: 1920, fps: 30} as const;
export const LEAK_SECONDS = 0.52;   // measured; 13f@25 -> 16f@30

// style.md safe zones
export const SAFE = {
  editorialTop: 200,
  editorialBottom: 1620,
  sourceLineY: 1460,
  complianceMaxY: 1820,
  bottomClear: 250,
} as const;

// MEASURED ON THIS SHOOT (standard-deviation-equity-funds), 36 frames sampled 2-142s.
// The style file's standing rule: "RE-MEASURE THE CROP EVERY SHOOT — it is not a constant."
// She reframed between videos: this cut is a WIDE seated framing, not the smallcap close-up.
//   head/hair silhouette envelope : x 159-933,  y 580-1381   (hair top median y594, p5 y580)
//   face (skin) envelope          : x 355-813,  y 600-1100   (median face width 268px)
// FACE_BOX below = silhouette + 20px margin. The smallcap job's x330-730/y380-1100 is WRONG here.
export const FACE_BOX = {x0: 139, y0: 560, x1: 953, y1: 1401} as const;

/** The two bands where a graphic can sit without touching her. */
export const FREE_BANDS = {
  aboveHead: {y0: 200, y1: 560},   // 360px tall
  belowBody: {y0: 1401, y1: 1670}, // 269px tall
} as const;

/** Table geometry that divides to WHOLE PIXELS (style.md: fractional columns make rules wobble).
 *  card 970 (side inset 55, the style minimum) - 2*24 padding = 922 inner.
 *  922 - 280 label = 642, and 642 / 3 value columns = 214 EXACTLY. */
export const TABLE_GEOM = {
  cardW: 970, sideInset: 55, pad: 24, labelW: 280, valueW: 214, ruleW: 3,
} as const;

// ---------------------------------------------------------------------------
// Grounds — MEASURED off the creator's own reference frames (harvest 2026-08-23),
// not invented. Four independent linked docs agree on the periwinkle ground; the
// TABLE doc (REF13) explicitly asks for "brand purple and brand green", which is
// brand.md's gradient-ground. Creator decision 2026-08-23: build to the references.
// ---------------------------------------------------------------------------

/** REF3 / REF6 / REF8 / REF11 / REF14 takeovers: periwinkle -> white. NO mint. */
export const PERIWINKLE = {
  base:        '#ECEEFE',   // flat field over most of the frame
  cornerTint:  T.indigo,    // TL + BR corners, $indigo at alpha 0.124
  cornerAlpha: 0.124,
  cornerFull:  356,         // px from the corner held at full strength
  cornerFade:  745,         // px from the corner where it reaches base
  glowAlpha:   0.89,        // white glow behind each star (TR + BL)
  glowPeakOut: 130,         // peak sits ~75-185px outside the star silhouette
  glowReach:   490,
  gridPitch:   97,          // measured 90px at 1000 wide -> 97px at 1080
  gridPhaseX:  2,
  gridPhaseY:  79,
  lineWidth:   2,
  lineAlpha:   0.008,       // present but almost invisible
  dotDia:      6.5,
  dotAlpha:    0.085,       // black; the DOTS carry the read, not the lines
} as const;

/** REF13 table frame: brand.md's gradient-ground. Periwinkle -> white -> mint. */
export const GRADIENT_GROUND = {
  periwinkle: '#9EA2C7',
  mid:        '#D3DEF4',
  mint:       '#8AF0CB',
  angle:      135,
  gridPitch:  73,           // measured 67px at 986 wide -> 73px at 1080
  gridFirstX: 57,
  gridAlpha:  0.075,        // BLACK at ~7.5%, not white (measured, supersedes style.md)
} as const;

/** REF13 measured geometry, at 1080x1920. */
export const REF13 = {
  mask:  {x: 363, y: 152, w: 328, h: 400, r: 57},   // 0.82:1, matches style.md's verified crop
  card:  {x: 122, y: 618, w: 832, h: 790, r: 39},
  // MEASURED on THIS footage 2026-08-23: she is framed as a tight close-up already, so the
  // 660x800@(210,340) crop recorded in style.md (a wider raw framing) over-zooms badly.
  // Skin bbox here is x253-747 / y347-1013; hair top ~y150. A 900x1098 crop (=0.82:1) from
  // (50,120) puts the face at 21%-81% of the mask height, matching the reference's read.
  faceCrop: {sx: 50, sy: 120, sw: 900, sh: 1098},
} as const;

/** Creator override 2026-08-23: the table's VO-synced sweep is MINT, matching her
 *  reference frame (#60CFAC), not $amber. This is a deliberate exception to
 *  brand.md's "accent is never number emphasis" — her call, recorded here. */
export const TABLE_SWEEP = '#60CFAC';

/** Sparkle stars — fitted by IoU against the reference silhouette (REF3/REF14). */
export const STARS = {
  topRight:   {cx: 0.918, cy: 0.046, tipR: 0.180, waist: 0.46, rot: 61.7},
  bottomLeft: {cx: 0.067, cy: 0.944, tipR: 0.221, waist: 0.50, rot: 18.3},
  blurSigma:  21,
} as const;
