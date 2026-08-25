import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { T, W, H } from "./tokens";

/* ---------- fonts (files copied into public/fonts) ---------- */
export const FontCss: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Ivy Presto'; src: url('${staticFile("fonts/Ivy-Presto-Display-.otf")}'); font-weight: 400; }
    @font-face { font-family: 'Ivy Presto'; src: url('${staticFile("fonts/Ivy-Presto-Display-Semi-Bold.otf")}'); font-weight: 600; }
    @font-face { font-family: 'Inter Tight'; src: url('${staticFile("fonts/InterTight-Medium.ttf")}'); font-weight: 500; }
    @font-face { font-family: 'Inter Tight'; src: url('${staticFile("fonts/InterTight-SemiBold.ttf")}'); font-weight: 600; }
    @font-face { font-family: 'Inter Tight'; src: url('${staticFile("fonts/InterTight-Bold.ttf")}'); font-weight: 700; }
    @font-face { font-family: 'Inter Tight'; src: url('${staticFile("fonts/InterTight-ExtraBold.ttf")}'); font-weight: 800; }
  `}</style>
);
export const serif = (wt = 600) =>
  ({ fontFamily: "'Ivy Presto', serif", fontWeight: wt, fontStyle: "italic" }) as const;
export const sans = (wt = 600) =>
  ({ fontFamily: "'Inter Tight', sans-serif", fontWeight: wt }) as const;

/* ---------- chrome: badge TL (TEMP rebuild — real asset owed by creator), logo TR, watermark BR ---------- */
export const Chrome: React.FC = () => (
  <AbsoluteFill style={{ zIndex: 100, pointerEvents: "none" }}>
    {/* Intelligent Investors badge — top-left (supplied asset, used as given) */}
    <Img
      src={staticFile("assets/intelligent-investors-badge.png")}
      style={{
        position: "absolute",
        left: 140,
        top: 96,
        width: 420,
        filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.30))",
      }}
    />
    {/* Groww lock-up — top-right */}
    <div style={{ position: "absolute", right: 150, top: 110, display: "flex", alignItems: "center", gap: 30 }}>
      <Img src={staticFile("assets/groww-mark.png")} style={{ width: 118, height: 118 }} />
      <div style={{ ...sans(700), fontSize: 92, color: T.white, textShadow: "0 4px 16px rgba(0,0,0,0.35)" }}>
        Groww
      </div>
    </div>
    {/* watermark — bottom-right */}
    <Img
      src={staticFile("assets/groww-mark.png")}
      style={{ position: "absolute", right: 130, bottom: 110, width: 130, height: 130, opacity: 0.9 }}
    />
  </AbsoluteFill>
);

/* ---------- backgrounds ---------- */
/** Creator-less scenes: white→periwinkle gradient + faint grid + dot lattice + lilac depth spheres */
export const GridBG: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(155deg, ${T.gridLight} 0%, #E4E8F6 38%, #B9C2F2 72%, ${T.gridPeri} 100%)`,
    }}
  >
    {/* grid */}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.55) 2px, transparent 2px),
                          linear-gradient(90deg, rgba(255,255,255,0.55) 2px, transparent 2px)`,
        backgroundSize: "170px 170px",
        opacity: 0.5,
      }}
    />
    {/* dot lattice */}
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(rgba(87,113,235,0.28) 5px, transparent 5px)`,
        backgroundSize: "170px 170px",
        backgroundPosition: "85px 85px",
      }}
    />
    {/* lilac spheres for depth */}
    <div style={sphere(520, 180, -140, 0.75)} />
    <div style={sphere(360, W - 420, 260, 0.6)} />
    <div style={sphere(300, 320, H - 420, 0.55)} />
    <div style={sphere(430, W - 260, H - 520, 0.65)} />
    {children}
  </AbsoluteFill>
);
const sphere = (d: number, x: number, y: number, op: number): React.CSSProperties => ({
  position: "absolute",
  width: d,
  height: d,
  left: x,
  top: y,
  borderRadius: "50%",
  background: `radial-gradient(circle at 35% 30%, #FFFFFF 0%, ${T.lilac} 55%, #C9C6EF 100%)`,
  opacity: op,
  filter: "blur(2px)",
});

/** Creator scenes: generated home background; variant 'left' keeps right two-thirds clean */
export const HomeBG: React.FC<{ variant: "left" | "center" }> = ({ variant }) => (
  <AbsoluteFill>
    <Img
      src={staticFile(variant === "left" ? "assets/bg-home-left.png" : "assets/bg-home-center.png")}
      style={{ width: W, height: H, objectFit: "cover" }}
    />
  </AbsoluteFill>
);

/** Keyed creator plate (straight-alpha PNG from CorridorKey) */
export const Creator: React.FC<{ plate: string; x?: number; scale?: number }> = ({
  plate,
  x = 0,
  scale = 1,
}) => (
  <Img
    src={staticFile(plate)}
    style={{
      position: "absolute",
      left: x,
      top: 0,
      width: W * scale,
      height: H * scale,
    }}
  />
);

/** Subtle black gradient, feathered, over the creator & behind text (§3.4 layer order) */
export const BlackFeather: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(to top, rgba(0,0,0,${strength}) 0%, rgba(0,0,0,${strength * 0.5}) 14%, rgba(0,0,0,0) 38%)`,
    }}
  />
);

/** Source attribution line (§2.5 — mandatory beneath every reference visual) */
export const SourceLine: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({
  children,
  dark,
}) => (
  <div
    style={{
      ...sans(600),
      fontSize: 40,
      color: dark ? "#3F4796" : T.indigoDeep,
      textAlign: "center",
      marginTop: 34,
      opacity: 0.95,
    }}
  >
    {children}
  </div>
);

/** Blur gradient sitting behind on-screen text (§3.3) */
export const TextScrim: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: "absolute",
      background: "rgba(244,240,234,0.35)",
      filter: "blur(46px)",
      borderRadius: 60,
      ...style,
    }}
  />
);
