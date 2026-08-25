import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { T, W, H } from "./tokens";
import {
  FontCss,
  Chrome,
  GridBG,
  HomeBG,
  Creator,
  BlackFeather,
  SourceLine,
  TextScrim,
  serif,
  sans,
} from "./base";

/* Data is character-for-character from transcript/asset-inventory.json (§2.3). */

/* ---------- Type 1 · Creator with text (p05 "Pehle kuch basic important notes") ---------- */
export const Type1: React.FC = () => (
  <AbsoluteFill>
    <FontCss />
    <HomeBG variant="center" />
    <Creator plate="assets/plate-center.png" />
    <BlackFeather />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 210, textAlign: "center" }}>
      <div style={{ ...sans(700), fontSize: 118, color: T.white, textShadow: "0 6px 30px rgba(0,0,0,0.45)" }}>
        Some Basic
      </div>
      <div style={{ ...serif(600), fontSize: 172, color: "#96A2F2", marginTop: 6, textShadow: "0 6px 34px rgba(0,0,0,0.4)" }}>
        Important Notes
      </div>
    </div>
    <Chrome />
  </AbsoluteFill>
);

/* ---------- Type 2 · Creator with motion graphics (p27 Invesco Concentration card, a09) ---------- */
export const Type2: React.FC = () => (
  <AbsoluteFill>
    <FontCss />
    <HomeBG variant="left" />
    <Creator plate="assets/plate-left.png" x={-640} />
    <div style={{ position: "absolute", left: 2000, top: 300, width: 1560 }}>
      <div style={{ ...serif(600), fontSize: 112, color: T.indigo, textAlign: "center", marginBottom: 60 }}>
        Invesco India Large &amp; Mid Cap Fund
      </div>
      <div
        style={{
          background: `linear-gradient(160deg, #6E82F2 0%, ${T.indigo} 55%, #4A5FD6 100%)`,
          borderRadius: 42,
          padding: "70px 90px",
          boxShadow: "0 30px 80px rgba(52,63,160,0.35)",
        }}
      >
        <div style={{ ...sans(600), fontSize: 84, color: T.white, marginBottom: 40 }}>Concentration</div>
        {[
          ["No. of Stocks", "40", true, false],
          ["Top 10 Stocks", "53.42%", false, true],
          ["Top 5 Stocks", "33.55%", false, true],
          ["Top 3 Sectors", "59.73%", false, true],
        ].map(([label, val, hi, info], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "34px 26px",
              borderTop: i ? "2px solid rgba(255,255,255,0.35)" : "none",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <span
                style={{
                  ...sans(700),
                  fontSize: 62,
                  color: hi ? T.ink : T.white,
                  background: hi ? T.mintHi : "transparent",
                  padding: hi ? "6px 22px" : undefined,
                  borderRadius: hi ? 14 : undefined,
                }}
              >
                {label}
              </span>
              {/* the source card prints an (i) info icon on these rows — reproduced per §2 */}
              {info ? (
                <span
                  style={{
                    ...sans(700),
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.45)",
                    color: "#3D4BB0",
                    fontSize: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  i
                </span>
              ) : null}
            </span>
            <span style={{ ...sans(600), fontSize: 62, color: T.white }}>{val}</span>
          </div>
        ))}
      </div>
      <SourceLine>Source: Value Research</SourceLine>
    </div>
    <Chrome />
  </AbsoluteFill>
);

/* ---------- Type 3 · Creator with text AND motion graphics (p01 hook: same start, different destinations) ---------- */
export const Type3: React.FC = () => (
  <AbsoluteFill>
    <FontCss />
    <HomeBG variant="center" />
    <Creator plate="assets/plate-center.png" />
    <BlackFeather strength={0.62} />
    {/* illustrations flank the creator, rising from the bottom (§5 hook grammar) */}
    <Img src={staticFile("assets/paths.png")} style={{ position: "absolute", left: 120, bottom: 140, width: 900 }} />
    <Img
      src={staticFile("assets/paths.png")}
      style={{ position: "absolute", right: 120, bottom: 140, width: 900, transform: "scaleX(-1)" }}
    />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 190, textAlign: "center" }}>
      <div style={{ ...sans(700), fontSize: 108, color: T.white, textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>
        Same Start,
      </div>
      <div style={{ ...serif(600), fontSize: 168, color: "#96A2F2", marginTop: 4, textShadow: "0 6px 34px rgba(0,0,0,0.45)" }}>
        Different Destinations?
      </div>
    </div>
    <Chrome />
  </AbsoluteFill>
);

/* ---------- Type 4 · Only text (p09 "Ab baat karte hai AUM ki" topic card) ---------- */
export const Type4: React.FC = () => (
  <AbsoluteFill>
    <FontCss />
    <GridBG>
      {/* rotating gold coins live in the corners (static pose in the still) */}
      <Img src={staticFile("assets/coin.png")} style={{ position: "absolute", left: 150, top: 210, width: 430, transform: "rotate(-14deg)" }} />
      <Img src={staticFile("assets/coin.png")} style={{ position: "absolute", right: 170, bottom: 190, width: 500, transform: "rotate(11deg)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: H / 2 - 240, textAlign: "center" }}>
        <div style={{ ...serif(600), fontSize: 300, color: T.indigo }}>AUM</div>
        <div style={{ ...sans(600), fontSize: 92, color: T.indigoDeep, marginTop: 24 }}>
          (Assets Under Management)
        </div>
      </div>
    </GridBG>
    <Chrome />
  </AbsoluteFill>
);

/* ---------- Type 5 · Only motion graphics (p06 the two funds, fig05 grammar) ---------- */
const FundCircle: React.FC<{ x: number; label: string[]; logo: string; logoWidth?: number }> = ({
  x,
  label,
  logo,
  logoWidth = 420,
}) => (
  <div style={{ position: "absolute", left: x, top: 520, width: 900, textAlign: "center" }}>
    <div
      style={{
        width: 620,
        height: 620,
        margin: "0 auto",
        borderRadius: "50%",
        background: "radial-gradient(circle at 38% 32%, #FFFFFF 0%, #F2F4FF 70%, #E4E8FB 100%)",
        border: `10px solid ${T.indigo}`,
        boxShadow: "0 26px 70px rgba(52,63,160,0.30)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img src={staticFile(logo)} style={{ width: logoWidth, height: "auto" }} />
    </div>
    {label.map((l, i) => (
      <div key={i} style={{ ...serif(600), fontSize: 74, color: T.indigo, lineHeight: 1.18, marginTop: i ? 0 : 48 }}>
        {l}
      </div>
    ))}
  </div>
);
export const Type5: React.FC = () => (
  <AbsoluteFill>
    <FontCss />
    <GridBG>
      <FundCircle x={520} label={["Invesco India", "Large & Mid Cap Fund"]} logo="assets/logo-invesco.png" logoWidth={440} />
      <FundCircle x={2420} label={["Motilal Oswal", "Large and Midcap Fund"]} logo="assets/logo-motilal.png" logoWidth={330} />
    </GridBG>
    <Chrome />
  </AbsoluteFill>
);

/* ---------- Type 6 · Only motion graphics and only text (icons closed in + category title, fig10 grammar) ---------- */
export const Type6: React.FC = () => (
  <AbsoluteFill>
    <FontCss />
    <GridBG>
      <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center" }}>
        <div style={{ ...serif(600), fontSize: 230, color: T.indigo }}>Large &amp; Mid Cap Funds</div>
      </div>
      {[
        { x: 1490, logo: "assets/logo-invesco.png", lw: 250 },
        { x: 1990, logo: "assets/logo-motilal.png", lw: 190 },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: 1080,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 32%, #FFFFFF 0%, #F2F4FF 70%, #E4E8FB 100%)",
            border: `8px solid ${T.indigo}`,
            boxShadow: "0 20px 55px rgba(52,63,160,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img src={staticFile(c.logo)} style={{ width: c.lw, height: "auto" }} />
        </div>
      ))}
    </GridBG>
    <Chrome />
  </AbsoluteFill>
);

/* ---------- Type 7 · B-roll, AI generated (black box + dust, fig23 grammar) ---------- */
const BRoll: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: 120,
        top: 120,
        width: W - 240,
        height: H - 240,
        objectFit: "cover",
      }}
    />
    <Img
      src={staticFile("assets/dust_halftone.png")}
      style={{ position: "absolute", left: 120, top: 120, width: W - 240, height: H - 240, opacity: 0.28, mixBlendMode: "screen" }}
    />
  </AbsoluteFill>
);
export const Type7: React.FC = () => (
  <AbsoluteFill>
    <FontCss />
    <BRoll src="assets/broll-ai.png" />
    <Chrome />
  </AbsoluteFill>
);

/* ---------- Type 8 · B-roll, real footage (same treatment; Envato pull pending licence) ---------- */
export const Type8: React.FC = () => (
  <AbsoluteFill>
    <FontCss />
    <BRoll src="assets/broll-real.png" />
    <Chrome />
  </AbsoluteFill>
);
