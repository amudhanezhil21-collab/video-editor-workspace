import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { serif, sans, SourceLine } from "../base";
import { T, W, H } from "../tokens";
import { RiseIn, WordByWord, EASE } from "./anim";
import { interpolate } from "remotion";

/* ---------- shared ---------- */
/** Strip markdown emphasis markers; the *word* becomes styled emphasis (MAJ-7). */
export const clean = (s: any): string =>
  String(s ?? "").replace(/\*([^*]+)\*/g, "$1").replace(/[≠]/g, "vs").replace(/recommondatory/gi, "recommendatory").trim();

/** Entrances suppressed for in-place/morph continuations (MAJ-5/MIN-3). */
export const entranceFrom = (transition: string, base: number) =>
  /in-place|morph|slot swap|overlay|resolve/i.test(transition || "") ? -999 : base;

const panelBg = `linear-gradient(160deg, #6E82F2 0%, ${T.indigo} 55%, #4A5FD6 100%)`;
const cardShadow = "0 30px 80px rgba(52,63,160,0.35)";

/* ---------- columned data panel (MAJ-4/MAJ-6/MIN-1: headers + auto-fit) ---------- */
export const DataPanelV2: React.FC<{ g: any; spanFrom: number; fullscreen?: boolean; transition?: string }> = ({
  g, spanFrom, fullscreen, transition,
}) => {
  const f = useCurrentFrame();
  const rows: any[] = g?.elements ?? [];
  const cols: string[] = (g?.columns ?? []).map(clean);
  const sched: any[] = g?.highlightSchedule ?? [];
  let activeWhat = "";
  for (const h of sched) if (f >= Math.round(h.t * 25) - spanFrom) activeWhat = String(h.what ?? "");
  // auto-fit: shrink with row count so the table + source stay in the safe zone (MAJ-6)
  const n = rows.length;
  const fs = n <= 5 ? 56 : n <= 8 ? 44 : 34;
  const pad = n <= 5 ? 30 : n <= 8 ? 20 : 12;
  const width = fullscreen ? Math.min(2760, 1400 + cols.length * 460) : 1560;
  const left = fullscreen ? (W - width) / 2 : 2000;
  const eBase = entranceFrom(transition ?? "", 4);
  const gridCols = cols.length > 1 ? `2.2fr ${"1.2fr ".repeat(cols.length - 1).trim()}` : "1.6fr 1fr";
  return (
    <div style={{ position: "absolute", left, top: fullscreen ? 300 : 280, width }}>
      {g?.title ? (
        <RiseIn from={eBase}>
          <div style={{ ...serif(600), fontSize: 100, color: T.indigo, textAlign: "center", marginBottom: 44, maxWidth: "92%", marginLeft: "4%" }}>
            {clean(g.title)}
          </div>
        </RiseIn>
      ) : null}
      <RiseIn from={eBase < 0 ? eBase : eBase + 2}>
        <div style={{ background: panelBg, borderRadius: 42, padding: `${pad + 26}px 70px`, boxShadow: cardShadow }}>
          {cols.length > 1 ? (
            <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 24, padding: `${pad}px 20px`, borderBottom: "3px solid rgba(255,255,255,0.5)" }}>
              {cols.map((c, i) => (
                <span key={i} style={{ ...sans(800), fontSize: Math.max(30, fs - 12), color: "#DDE4FF", textAlign: i ? "right" : "left" }}>
                  {c}
                </span>
              ))}
            </div>
          ) : null}
          {rows.map((r, i) => {
            const hot = activeWhat && (activeWhat.includes(r.label) || (r.values ?? []).some((v: string) => activeWhat.includes(String(v))));
            return (
              <RiseIn key={i} from={eBase < 0 ? eBase : eBase + 4 + i * 2} dist={30}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: gridCols,
                    gap: 24,
                    alignItems: "center",
                    padding: `${pad}px 20px`,
                    borderTop: i ? "2px solid rgba(255,255,255,0.32)" : "none",
                    background: hot ? "rgba(33,81,173,0.5)" : "transparent",
                    borderRadius: hot ? 14 : 0,
                  }}
                >
                  <span style={{ ...sans(700), fontSize: fs, color: hot ? T.ink : T.white, background: hot ? T.mintHi : "transparent", padding: hot ? "4px 16px" : undefined, borderRadius: 12, justifySelf: "start" }}>
                    {clean(r.label)}
                  </span>
                  {(r.values ?? []).map((v: string, k: number) => (
                    <span key={k} style={{ ...sans(600), fontSize: fs, color: T.white, textAlign: "right", overflowWrap: "break-word" }}>
                      {clean(v)}
                    </span>
                  ))}
                </div>
              </RiseIn>
            );
          })}
        </div>
      </RiseIn>
      {g?.starMarkers ? <div style={{ ...sans(600), fontSize: 34, color: T.indigoDeep, textAlign: "center", marginTop: 22 }}>{clean(g.starMarkers)}</div> : null}
      {g?.sourceLine ? <SourceLine>{clean(g.sourceLine)}</SourceLine> : null}
    </div>
  );
};

/* ---------- twin tables (CRIT-4/MAJ-3: two labeled panels side by side) ---------- */
export const TwinTables: React.FC<{ g: any; spanFrom: number; fullscreen?: boolean; transition?: string }> = ({
  g, spanFrom, fullscreen, transition,
}) => {
  const f = useCurrentFrame();
  const panels: any[] = (g?.elements ?? []).filter((e: any) => e && (e.rows || e.panel));
  const sched: any[] = g?.highlightSchedule ?? [];
  let activeWhat = "";
  for (const h of sched) if (f >= Math.round(h.t * 25) - spanFrom) activeWhat = String(h.what ?? "");
  const eBase = entranceFrom(transition ?? "", 4);
  const total = fullscreen ? 3200 : 1620;
  const left = fullscreen ? (W - total) / 2 : 1960;
  const pw = (total - 80) / Math.max(1, panels.length);
  return (
    <div style={{ position: "absolute", left, top: fullscreen ? 340 : 320, width: total }}>
      {g?.title ? (
        <RiseIn from={eBase}>
          <div style={{ ...serif(600), fontSize: 100, color: T.indigo, textAlign: "center", marginBottom: 44 }}>{clean(g.title)}</div>
        </RiseIn>
      ) : null}
      <div style={{ display: "flex", gap: 80 }}>
        {panels.map((p, pi) => (
          <RiseIn key={pi} from={eBase < 0 ? eBase : eBase + 2 + pi * 4} style={{ width: pw }}>
            <div style={{ ...serif(600), fontSize: 52, color: T.indigo, textAlign: "center", marginBottom: 24, minHeight: 130 }}>
              {clean(p.panel)}
            </div>
            <div style={{ background: panelBg, borderRadius: 36, padding: "44px 54px", boxShadow: cardShadow }}>
              {p.heading ? <div style={{ ...sans(600), fontSize: 56, color: T.white, marginBottom: 20 }}>{clean(p.heading)}</div> : null}
              {(p.rows ?? []).map((r: any, i: number) => {
                const hot = (r.highlight && f - spanFrom > 20) || (activeWhat && (r.values ?? []).some((v: string) => activeWhat.includes(String(v))));
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "22px 14px", borderTop: i ? "2px solid rgba(255,255,255,0.32)" : "none", background: hot ? "rgba(33,81,173,0.5)" : "transparent", borderRadius: hot ? 12 : 0 }}>
                    <span style={{ ...sans(700), fontSize: 42, color: hot ? T.ink : T.white, background: hot ? T.mintHi : "transparent", padding: hot ? "2px 12px" : undefined, borderRadius: 10 }}>
                      {clean(r.label)}
                    </span>
                    <span style={{ ...sans(600), fontSize: 42, color: T.white, textAlign: "right" }}>{(r.values ?? []).map(clean).join("  ")}</span>
                  </div>
                );
              })}
            </div>
            {p.sourceLine ? <SourceLine>{clean(p.sourceLine)}</SourceLine> : null}
          </RiseIn>
        ))}
      </div>
      {!panels.some((p) => p.sourceLine) && g?.sourceLine ? <SourceLine>{clean(g.sourceLine)}</SourceLine> : null}
    </div>
  );
};

/* ---------- deck slide (CRIT-1/CRIT-2: columns + QGLP letters shapes) ---------- */
export const DeckSlide: React.FC<{ g: any; spanFrom: number; spanLen: number; transition?: string }> = ({
  g, spanFrom, spanLen, transition,
}) => {
  const f = useCurrentFrame();
  const el = (g?.elements ?? [])[0] ?? {};
  const eBase = entranceFrom(transition ?? "", 4);
  const cols: any[] = el.columns ?? [];
  const letters: any[] = el.letters ?? [];
  const items = cols.length ? cols : letters;
  // staggered reveal across the span keeps long slides alive (MAJ-9)
  const per = items.length ? Math.max(6, Math.floor((spanLen * 0.6) / items.length)) : 8;
  return (
    <div style={{ position: "absolute", left: (W - 3200) / 2, top: 300, width: 3200 }}>
      <RiseIn from={eBase}>
        <div style={{ ...serif(600), fontSize: 96, color: T.indigo, textAlign: "center", marginBottom: 50 }}>
          {clean(el.slideTitle ?? el.header ?? g?.title)}
        </div>
      </RiseIn>
      <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
        {cols.length
          ? cols.map((c, i) => (
              <RiseIn key={i} from={eBase < 0 ? eBase : eBase + 2 + i * per} style={{ width: (3200 - 40 * (cols.length - 1)) / cols.length }}>
                <div style={{ background: "rgba(255,255,255,0.85)", border: `5px solid ${T.indigo}`, borderRadius: 30, padding: "40px 36px", minHeight: 700, boxShadow: cardShadow }}>
                  <div style={{ ...sans(800), fontSize: 46, color: T.indigoDeep, marginBottom: 14 }}>{clean(c.name)}</div>
                  {c.allocation ? <div style={{ ...sans(700), fontSize: 36, color: T.indigo }}>{clean(c.allocation)}</div> : null}
                  {c.weight ? <div style={{ ...sans(600), fontSize: 32, color: "#3D8B6A", marginBottom: 16 }}>{clean(c.weight)}</div> : null}
                  {(c.bullets ?? []).slice(0, 5).map((b: string, k: number) => (
                    <div key={k} style={{ ...sans(500), fontSize: 28, color: T.ink, margin: "10px 0", lineHeight: 1.3 }}>
                      • {clean(b)}
                    </div>
                  ))}
                </div>
              </RiseIn>
            ))
          : letters.map((l, i) => (
              <RiseIn key={i} from={eBase < 0 ? eBase : eBase + 2 + i * per} style={{ width: (3200 - 40 * (letters.length - 1)) / Math.max(1, letters.length) }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ ...serif(600), fontSize: 200, color: T.indigoDeep }}>{clean(l.letter)}</div>
                  <div style={{ background: l.focus ? T.mintHi : "rgba(255,255,255,0.85)", border: `5px solid ${T.indigo}`, borderRadius: 26, padding: "30px 28px", ...sans(600), fontSize: 32, color: T.ink, minHeight: 260, lineHeight: 1.35 }}>
                    {clean(l.box)}
                  </div>
                </div>
              </RiseIn>
            ))}
      </div>
      {g?.sourceLine ? <SourceLine>{clean(g.sourceLine)}</SourceLine> : null}
    </div>
  );
};

/* ---------- grouped bar chart (CRIT-3) — values parsed from the audited descriptions; §2.4: verify against screenshot ---------- */
export const ChartBars: React.FC<{ g: any; spanFrom: number; transition?: string }> = ({ g, spanFrom, transition }) => {
  const f = useCurrentFrame();
  const el = (g?.elements ?? [])[0] ?? {};
  const legend: string[] = (el.legend ?? []).map(clean);
  const series = legend.length || 3;
  const bars: { year: string; vals: number[] }[] = [];
  for (const b of el.bars ?? []) {
    const m = String(b).match(/^(\d{4}):(.*)$/);
    if (!m) continue;
    const vals = [...m[2].matchAll(/(-?~?\s*-?\d+(?:\.\d+)?)\s*%/g)].map((x) => parseFloat(x[1].replace("~", "")));
    if (vals.length) bars.push({ year: m[1], vals: vals.slice(0, series) });
  }
  const maxV = Math.max(...bars.flatMap((b) => b.vals.map(Math.abs)), 10);
  const CH = 900, CW = 3000, x0 = (W - CW) / 2, y0 = 500;
  const groupW = CW / Math.max(1, bars.length);
  const colors = [T.indigo, "#8FA0F5", T.mintHi];
  const draw = interpolate(f, [entranceFrom(transition ?? "", 4) < 0 ? 0 : 6, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", ...serif(600), fontSize: 92, color: T.indigo }}>
        {clean(g?.title)}
      </div>
      <div style={{ position: "absolute", left: x0, top: y0 + CH / 2, width: CW, height: 2, background: "rgba(87,113,235,0.5)" }} />
      {bars.map((b, bi) =>
        b.vals.map((v, si) => {
          const h = (Math.abs(v) / maxV) * (CH / 2) * draw;
          const bw = Math.min(56, (groupW - 40) / series);
          const x = x0 + bi * groupW + 24 + si * (bw + 8);
          const y = v >= 0 ? y0 + CH / 2 - h : y0 + CH / 2;
          return <div key={`${bi}-${si}`} style={{ position: "absolute", left: x, top: y, width: bw, height: h, background: colors[si % colors.length], borderRadius: 6 }} />;
        })
      )}
      {bars.map((b, bi) => (
        <div key={bi} style={{ position: "absolute", left: x0 + bi * groupW, top: y0 + CH + 24, width: groupW, textAlign: "center", ...sans(600), fontSize: 30, color: T.indigoDeep }}>
          {b.year}
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: y0 + CH + 90, display: "flex", gap: 50, justifyContent: "center" }}>
        {legend.map((l, i) => (
          <span key={i} style={{ ...sans(600), fontSize: 34, color: T.ink, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 34, height: 34, background: colors[i % colors.length], borderRadius: 8, display: "inline-block" }} />
            {l}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: y0 + CH + 160, textAlign: "center", ...sans(500), fontSize: 28, color: "#8A8FA8" }}>
        Chart values approximate — verify against the source screenshot (§2.4)
      </div>
      {g?.sourceLine ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: y0 + CH + 210, textAlign: "center" }}>
          <SourceLine>{clean(g.sourceLine)}</SourceLine>
        </div>
      ) : null}
    </div>
  );
};

/* ---------- callout boxes (MAJ-2: designed boxes with name + value) ---------- */
export const CalloutBoxes: React.FC<{ g: any; transition?: string }> = ({ g, transition }) => {
  const eBase = entranceFrom(transition ?? "", 4);
  const items: any[] = (g?.elements ?? []).filter((e: any) => e.name || e.value || e.label);
  return (
    <div style={{ position: "absolute", left: 2000, top: 340, width: 1560 }}>
      {g?.title ? (
        <RiseIn from={eBase}>
          <div style={{ ...serif(600), fontSize: 104, color: T.indigo, textAlign: "center", marginBottom: 56 }}>{clean(g.title)}</div>
        </RiseIn>
      ) : null}
      {items.map((c, i) => (
        <RiseIn key={i} from={eBase < 0 ? eBase : eBase + 4 + i * 6}>
          <div style={{ margin: "0 0 44px", borderRadius: 34, padding: "44px 52px", background: "linear-gradient(150deg, rgba(255,255,255,0.92), rgba(230,234,255,0.9))", border: `5px solid ${T.indigo}`, boxShadow: cardShadow }}>
            <div style={{ ...serif(600), fontSize: 54, color: T.indigo, marginBottom: 14 }}>{clean(c.name ?? c.label)}</div>
            <div style={{ ...sans(700), fontSize: 66, color: T.indigoDeep }}>{clean(c.value ?? (c.values ?? []).join("  "))}</div>
          </div>
        </RiseIn>
      ))}
      {g?.sourceLine ? <SourceLine>{clean(g.sourceLine)}</SourceLine> : null}
    </div>
  );
};

/* ---------- photo grid (MIN-9: manager cards with initials avatars) ---------- */
export const PhotoGrid: React.FC<{ g: any; transition?: string }> = ({ g, transition }) => {
  const eBase = entranceFrom(transition ?? "", 4);
  const cards: any[] = (g?.elements ?? []).filter((e: any) => e.name);
  return (
    <div style={{ position: "absolute", left: 1980, top: 380, width: 1600 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 36, justifyContent: "center" }}>
        {cards.map((c, i) => (
          <RiseIn key={i} from={eBase < 0 ? eBase : eBase + 3 + i * 4} style={{ width: 480 }}>
            <div style={{ background: "rgba(255,255,255,0.92)", border: `4px solid ${T.indigo}`, borderRadius: 28, padding: "34px 26px", textAlign: "center", boxShadow: cardShadow }}>
              <div style={{ width: 150, height: 150, borderRadius: "50%", margin: "0 auto 18px", background: panelBg, display: "flex", alignItems: "center", justifyContent: "center", ...sans(800), fontSize: 60, color: T.white, border: "5px solid #F4C64F" }}>
                {clean(c.name).split(/\s+/).map((w: string) => w[0]).slice(0, 2).join("")}
              </div>
              <div style={{ ...sans(700), fontSize: 40, color: T.indigoDeep }}>{clean(c.name)}</div>
              <div style={{ ...sans(500), fontSize: 30, color: T.ink, marginTop: 6 }}>{clean(c.role)}</div>
            </div>
          </RiseIn>
        ))}
      </div>
      {g?.sourceLine ? <SourceLine>{clean(g.sourceLine)}</SourceLine> : null}
    </div>
  );
};
