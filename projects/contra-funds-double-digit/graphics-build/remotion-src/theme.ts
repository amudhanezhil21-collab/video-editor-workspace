/**
 * Design tokens. Colours come from the repo's brand.md — never invent hex here.
 * The dark ground is our house look, anchored on the reference's 3D product card.
 */

export const FPS = 25;
export const W = 1080;
export const H = 1920;
export const DURATION_FRAMES = Math.round(117.44 * FPS); // 2936

/** Groww brand tokens (brand.md). */
export const brand = {
  green: "#00D09C",
  indigo: "#5367FC",
  mint: "#67F9C8",
  amber: "#FCB31C",
  coral: "#F26B55",
  ink: "#44475B",
  grey: "#B1B4B7",
  greyLight: "#CCCFD1",
  paper: "#ECEDEE",
  paperLight: "#F9FAFA",
  white: "#FFFFFF",
} as const;

/**
 * Frame occupancy, measured from a 59-frame temporal median of the source.
 * See transcript/source-facts.md. These are hard constraints, not suggestions.
 */
export const zone = {
  /** y 0-480 is dead-still (1.6-6% motion) and dark. Primary graphics real estate. */
  safeTop: { y0: 0, y1: 480 },
  /** y 480-600: transition band, 14.7% motion. Use with care. */
  caution: { y0: 480, y1: 600 },
  /** Below 600 is hers. y1680-1800 is 94% motion (hands) — never place static content. */
  subject: { y0: 600, y1: 1920 },
  /** YouTube Shorts UI keep-out. */
  shortsUI: { bottom: 320, right: 150 },
  /** Existing wall furniture we must not fight. */
  wallLogo: { x0: 160, y0: 260, x1: 640, y1: 720 },
  wallWordmark: { y0: 800, y1: 1040 },
  neonEdge: { x0: 0, y0: 40, x1: 100, y1: 360 },
} as const;

/** 8px spacing scale. */
export const sp = (n: number) => n * 8;

export const font = {
  black: "InterTightBlack",
  extrabold: "InterTightExtraBold",
  bold: "InterTightBold",
  semibold: "InterTightSemiBold",
  medium: "InterTightMedium",
  regular: "InterTightRegular",
} as const;
