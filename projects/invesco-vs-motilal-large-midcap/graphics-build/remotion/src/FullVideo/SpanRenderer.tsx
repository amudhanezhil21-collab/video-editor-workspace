import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";

/** Keyed creator plate as a 1080p PNG sequence served over localhost (NOT bundled), scaled to 4K */
const PlateSeq: React.FC<{ dir: string; x?: number }> = ({ dir, x = 0 }) => {
  const f = useCurrentFrame(); // relative to the span Sequence
  const name = `f${String(f).padStart(5, "0")}.png`;
  return (
    <Img
      src={`${dir}/${name}`}
      pauseWhenLoading
      style={{ position: "absolute", left: x, top: 0, width: W, height: H }}
    />
  );
};
import { GridBG, HomeBG, BlackFeather, SourceLine, serif, sans } from "../base";
import { T, W, H } from "../tokens";
import { RiseIn, PopIn, WordByWord, Rotate, EASE } from "./anim";
import { DataPanelV2, TwinTables, DeckSlide, ChartBars, CalloutBoxes, PhotoGrid, clean, entranceFrom } from "./graphics";

/* ---------------- transition-in effects (dialect A) ---------------- */
const TransitionIn: React.FC<{ kind: string }> = ({ kind }) => {
  const f = useCurrentFrame();
  const k = kind.toLowerCase();
  if (k.includes("light leak")) {
    const o = interpolate(f, [0, 3, 10], [0.9, 0.55, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill
        style={{
          zIndex: 55,
          pointerEvents: "none",
          opacity: o,
          background:
            "linear-gradient(105deg, rgba(125,232,192,0.0) 20%, rgba(125,232,192,0.85) 45%, rgba(255,255,255,0.95) 55%, rgba(87,113,235,0.65) 70%, rgba(87,113,235,0) 90%)",
          mixBlendMode: "screen",
        }}
      />
    );
  }
  if (k.includes("brand") && k.includes("wipe")) {
    const t = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: EASE });
    if (t >= 1) return null;
    return (
      <AbsoluteFill style={{ zIndex: 56, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: W * 0.55,
            left: -W * 0.55 + t * (W * 1.6),
            background: "#7DE8C0",
            transform: "skewX(-8deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: W * 0.55,
            left: -W * 0.75 + t * (W * 1.6),
            background: T.indigo,
            transform: "skewX(-8deg)",
          }}
        />
      </AbsoluteFill>
    );
  }
  if (k.includes("whip") || k.includes("zoom") || k.includes("crash")) {
    const s = interpolate(f, [0, 8], [1.12, 1], { extrapolateRight: "clamp", easing: EASE });
    const b = interpolate(f, [0, 8], [14, 0], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill
        style={{
          zIndex: 54,
          pointerEvents: "none",
          backdropFilter: `blur(${b}px)`,
          transform: `scale(${s})`,
        }}
      />
    );
  }
  if (k.includes("dissolve")) {
    if (k.includes("slide") || k.includes("same")) return null; // same-family: content crossfades, no flash
    const o = interpolate(f, [0, 7], [0.55, 0], { extrapolateRight: "clamp" });
    return <AbsoluteFill style={{ zIndex: 54, background: "#F1EFEA", opacity: o, pointerEvents: "none" }} />;
  }
  return null; // hard cut / in-place / overlay — no overlay effect
};

/* ---------------- graphics dispatch (animatic tier; upgraded per-family in the gauntlet) ---------------- */
const TopicCard: React.FC<{ g: any }> = ({ g }) => {
  const f = useCurrentFrame();
  return (
    <GridBG>
      <Rotate rpm={7} style={{ position: "absolute", left: 150, top: 430, width: 420 }}>
        <Img src={staticFile("assets/coin.png")} style={{ width: 420 }} />
      </Rotate>
      <Rotate rpm={-6} style={{ position: "absolute", right: 190, bottom: 200, width: 480 }}>
        <Img src={staticFile("assets/coin.png")} style={{ width: 480 }} />
      </Rotate>
      <div style={{ position: "absolute", left: 0, right: 0, top: H / 2 - 220, textAlign: "center" }}>
        <div style={{ ...serif(600), fontSize: 250, color: T.indigo }}>
          <WordByWord text={g?.title ?? ""} from={2} perWord={3} />
        </div>
        {g?.sub ? (
          <RiseIn from={6}>
            <div style={{ ...sans(600), fontSize: 84, color: T.indigoDeep, marginTop: 20 }}>{g.sub}</div>
          </RiseIn>
        ) : null}
      </div>
    </GridBG>
  );
};

/** Generic animated data panel (rows highlight per schedule) — the workhorse for type 2/5 tables */
export const DataPanel: React.FC<{ g: any; spanFrom: number; fullscreen?: boolean }> = ({
  g,
  spanFrom,
  fullscreen,
}) => {
  const f = useCurrentFrame();
  const rows: any[] = g?.elements ?? [];
  const sched: any[] = g?.highlightSchedule ?? [];
  const fps = 25;
  const activeIdx = (() => {
    let idx = -1;
    for (let i = 0; i < sched.length; i++) {
      const rel = Math.round(sched[i].t * fps) - spanFrom;
      if (f >= rel) idx = i;
    }
    return idx;
  })();
  const activeWhat = activeIdx >= 0 ? String(sched[activeIdx].what ?? "") : "";
  const width = fullscreen ? 2400 : 1560;
  const left = fullscreen ? (W - width) / 2 : 2000;
  return (
    <div style={{ position: "absolute", left, top: fullscreen ? 360 : 300, width }}>
      {g?.title ? (
        <RiseIn from={0}>
          <div style={{ ...serif(600), fontSize: 108, color: T.indigo, textAlign: "center", marginBottom: 54 }}>
            {g.title}
          </div>
        </RiseIn>
      ) : null}
      <RiseIn from={4}>
        <div
          style={{
            background: `linear-gradient(160deg, #6E82F2 0%, ${T.indigo} 55%, #4A5FD6 100%)`,
            borderRadius: 42,
            padding: "60px 80px",
            boxShadow: "0 30px 80px rgba(52,63,160,0.35)",
          }}
        >
          {rows.map((r, i) => {
            const hot =
              activeWhat && (activeWhat.includes(r.label) || (r.values ?? []).some((v: string) => activeWhat.includes(v)));
            return (
              <RiseIn key={i} from={6 + i * 3} dist={40}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 30,
                    padding: "30px 24px",
                    borderTop: i ? "2px solid rgba(255,255,255,0.35)" : "none",
                    background: hot ? "rgba(33,81,173,0.55)" : "transparent",
                    borderRadius: hot ? 14 : 0,
                  }}
                >
                  <span
                    style={{
                      ...sans(700),
                      fontSize: 56,
                      color: hot ? T.ink : T.white,
                      background: hot ? T.mintHi : "transparent",
                      padding: hot ? "4px 18px" : undefined,
                      borderRadius: 12,
                    }}
                  >
                    {r.label}
                  </span>
                  <span style={{ ...sans(600), fontSize: 56, color: T.white, textAlign: "right" }}>
                    {(r.values ?? []).join("   ")}
                  </span>
                </div>
              </RiseIn>
            );
          })}
        </div>
      </RiseIn>
      {g?.starMarkers ? (
        <div style={{ ...sans(600), fontSize: 36, color: T.indigoDeep, textAlign: "center", marginTop: 26 }}>
          {g.starMarkers}
        </div>
      ) : null}
      {g?.sourceLine ? <SourceLine>{g.sourceLine}</SourceLine> : null}
    </div>
  );
};

/** Placeholder for layouts not yet upgraded — carries the real title + source so the animatic is honest */
const GenericGraphic: React.FC<{ g: any; fullscreen?: boolean }> = ({ g, fullscreen }) => {
  const has = (g?.elements ?? []).some((e: any) =>
    e && (e.heading || e.label || e.name || e.body || e.text || (e.values ?? []).length || (e.bullets ?? []).length));
  if (!has && !g?.title) return null;
  return (
  <div
    style={{
      position: "absolute",
      left: fullscreen ? W / 2 - 1100 : 2000,
      top: 420,
      width: fullscreen ? 2200 : 1500,
      textAlign: "center",
    }}
  >
    <RiseIn from={2}>
      <div style={{ ...serif(600), fontSize: 100, color: T.indigo }}>{g?.title ?? ""}</div>
    </RiseIn>
    <RiseIn from={7}>
      <div
        style={{
          marginTop: 44,
          background: "rgba(255,255,255,0.65)",
          border: `6px solid ${T.indigo}`,
          borderRadius: 36,
          padding: "50px 60px",
          ...sans(600),
          fontSize: 48,
          color: T.indigoDeep,
          textAlign: "left",
          whiteSpace: "pre-wrap",
        }}
      >
        {(g?.elements ?? [])
          .slice(0, 8)
          .map((e: any) => {
            const bits = [
              e.heading ?? e.label ?? e.name ?? "",
              Array.isArray(e.values) ? e.values.join("  ") : e.value ?? "",
              e.body ?? e.text ?? e.desc ?? "",
              Array.isArray(e.bullets) ? e.bullets.join("\n• ") : "",
              Array.isArray(e.columns) ? e.columns.map((c: any) => c.header ?? c).join(" | ") : "",
            ].filter(Boolean);
            return bits.join("\n");
          })
          .join("\n\n") || `[${g?.layout ?? "graphic"} — build pass pending]`}
      </div>
    </RiseIn>
    {g?.sourceLine ? <SourceLine>{clean(g.sourceLine)}</SourceLine> : null}
  </div>
  );
};

const CreatorText: React.FC<{ g: any }> = ({ g }) => {
  const lines: any[] = (g?.lines ?? []).filter((l: any) => clean(l.text));
  if (!lines.length) return null;
  const tall = lines.length > 2; // stacks go beside the creator, never over her face
  const wrap: React.CSSProperties = tall
    ? { position: "absolute", left: 120, top: 380, width: 1240, textAlign: "left" }
    : { position: "absolute", left: 0, right: 0, bottom: 200, textAlign: "center" };
  return (
    <div style={wrap}>
      {lines.map((l: any, i: number) => (
        <div
          key={i}
          style={
            l.style === "serif-purple"
              ? { ...serif(600), fontSize: tall ? 96 : 165, color: "#96A2F2", textShadow: "0 6px 34px rgba(0,0,0,0.45)", lineHeight: 1.25 }
              : { ...sans(700), fontSize: tall ? 72 : 112, color: T.white, textShadow: "0 6px 30px rgba(0,0,0,0.45)", lineHeight: 1.3 }
          }
        >
          <WordByWord text={clean(l.text)} from={3 + i * 4} />
        </div>
      ))}
    </div>
  );
};

const BrollSeq: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Img
      src={`http://127.0.0.1:8877/media/broll-real/f${String(Math.min(f, 137)).padStart(3, "0")}.jpg`}
      pauseWhenLoading
      style={{ position: "absolute", left: 120, top: 120, width: W - 240, height: H - 240, objectFit: "cover" }}
    />
  );
};

const BRollSpan: React.FC<{ span: any }> = ({ span }) => {
  const real = span.type === 8;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {real ? (
        <BrollSeq />
      ) : (
        <Img
          src={staticFile("assets/broll-ai.png")}
          style={{ position: "absolute", left: 120, top: 120, width: W - 240, height: H - 240, objectFit: "cover" }}
        />
      )}
      <Img
        src={staticFile("assets/dust_halftone.png")}
        style={{ position: "absolute", left: 120, top: 120, width: W - 240, height: H - 240, opacity: 0.3, mixBlendMode: "screen" }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- the span dispatcher ---------------- */
export const SpanRenderer: React.FC<{ span: any }> = ({ span }) => {
  const g = span.graphics;
  const t = span.type;
  const layout = g?.layout ?? "";
  const plateVideo = span.plate ? (
    <PlateSeq dir={span.plate} x={t === 2 ? -640 : 0} />
  ) : null;

  return (
    <AbsoluteFill>
      {t === 1 || t === 3 ? (
        <>
          <HomeBG variant="center" />
          {plateVideo}
          <BlackFeather strength={t === 3 ? 0.62 : 0.55} />
          <CreatorText g={g} />
        </>
      ) : t === 2 ? (
        <>
          <HomeBG variant="left" />
          {plateVideo}
          {layout === "callout-boxes" ? (
            <CalloutBoxes g={g} transition={span.transition} />
          ) : layout === "twin-tables" ? (
            <TwinTables g={g} spanFrom={span.from} transition={span.transition} />
          ) : layout === "photo-grid" ? (
            <PhotoGrid g={g} transition={span.transition} />
          ) : layout === "data-panel" || layout === "verdict-table" ? (
            <DataPanelV2 g={g} spanFrom={span.from} transition={span.transition} />
          ) : (
            <GenericGraphic g={g} />
          )}
        </>
      ) : t === 4 ? (
        <TopicCard g={g} />
      ) : t === 5 || t === 6 ? (
        <GridBG>
          {layout === "twin-tables" ? (
            <TwinTables g={g} spanFrom={span.from} fullscreen transition={span.transition} />
          ) : layout === "deck-slide" ? (
            <DeckSlide g={g} spanFrom={span.from} spanLen={span.durationInFrames} transition={span.transition} />
          ) : layout === "chart-bars" ? (
            <ChartBars g={g} spanFrom={span.from} transition={span.transition} />
          ) : layout === "photo-grid" ? (
            <PhotoGrid g={g} transition={span.transition} />
          ) : layout === "data-panel" || layout === "verdict-table" ? (
            <DataPanelV2 g={g} spanFrom={span.from} fullscreen transition={span.transition} />
          ) : (
            <GenericGraphic g={g} fullscreen />
          )}
        </GridBG>
      ) : (
        <BRollSpan span={span} />
      )}
      <TransitionIn kind={span.transition} />
    </AbsoluteFill>
  );
};
