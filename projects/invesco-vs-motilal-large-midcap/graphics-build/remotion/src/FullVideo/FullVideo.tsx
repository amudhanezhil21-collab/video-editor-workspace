import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { FIXED, SPANS } from "./timeline";
import { FontCss, Chrome } from "../base";
import { W, H } from "../tokens";
import { SpanRenderer } from "./SpanRenderer";

/* ---------- subscribe unit (§1 mandatory: bar + SUBSCRIBE + bell, cursor clicks both) ---------- */
const SubscribeUnit: React.FC = () => {
  const f = useCurrentFrame(); // relative to its Sequence
  const rise = interpolate(f, [0, 8], [120, 0], { extrapolateRight: "clamp" });
  const cursorX = interpolate(f, [10, 35, 60, 85], [W * 0.62, W * 0.545, W * 0.545, W * 0.585], {
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(f, [10, 35, 60, 85], [H * 0.86, H * 0.775, H * 0.775, H * 0.775], {
    extrapolateRight: "clamp",
  });
  const clicked = f > 40;
  const bellRung = f > 92;
  return (
    <AbsoluteFill style={{ zIndex: 60 }}>
      <div
        style={{
          position: "absolute",
          left: W / 2 - 700,
          top: H * 0.72,
          width: 1400,
          transform: `translateY(${rise}px)`,
          background: "#FFFFFF",
          borderRadius: 28,
          display: "flex",
          alignItems: "center",
          gap: 44,
          padding: "36px 54px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
          fontFamily: "'Inter Tight', sans-serif",
        }}
      >
        <Img src={staticFile("assets/groww-mark.png")} style={{ width: 92, height: 92 }} />
        <div style={{ fontWeight: 700, fontSize: 56, color: "#1C1D22", flex: 1 }}>
          Mutual Funds with Groww
        </div>
        <div
          style={{
            background: clicked ? "#E8E8E8" : "#FF333F",
            color: clicked ? "#666" : "#FFF",
            fontWeight: 800,
            fontSize: 46,
            padding: "22px 44px",
            borderRadius: 16,
          }}
        >
          {clicked ? "SUBSCRIBED" : "SUBSCRIBE"}
        </div>
        <div style={{ fontSize: 62, transform: bellRung ? "rotate(-18deg)" : "none" }}>🔔</div>
      </div>
      {/* cursor */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          width: 0,
          height: 0,
          borderLeft: "26px solid #FFF",
          borderRight: "10px solid transparent",
          borderBottom: "42px solid #FFF",
          transform: "rotate(-18deg)",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- served image-sequence player (no video decode, nothing to audio-probe) ---------- */
const MediaSeq: React.FC<{ dir: string; pad: number; ext: string }> = ({ dir, pad, ext }) => {
  const f = useCurrentFrame();
  return (
    <Img
      src={`${dir}/f${String(f).padStart(pad, "0")}.${ext}`}
      pauseWhenLoading
      style={{ width: W, height: H }}
    />
  );
};

/* ---------- closing crawl (supplied rolling disclaimer, bottom-to-top, archive speed) ---------- */
const Crawl: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const f = useCurrentFrame();
  // strip is 2480x7610; scaled to width 3200 -> height ~9820; crawl the full height
  const h = (7610 / 2480) * 3200;
  const y = interpolate(f, [0, durationInFrames], [H, -h], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#F4F4F2" }}>
      <Img
        src={staticFile("assets/disclaimer-rolling.png")}
        style={{ position: "absolute", left: (W - 3200) / 2, top: y, width: 3200 }}
      />
    </AbsoluteFill>
  );
};

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FontCss />
      {/* NOTE: no <Audio> here on purpose — the delivery track (VO + music + SFX)
          is built by graphics-build/mix_audio.py and muxed onto the render with ffmpeg.
          Keeping audio out of the comp also spares the renderer's audio probing. */}

      {/* 1. start disclaimer — supplied card, 3.0s exactly, silent */}
      <Sequence from={0} durationInFrames={FIXED.disclaimerFrames}>
        <Img src={staticFile("assets/disclaimer-start.png")} style={{ width: W, height: H }} />
      </Sequence>

      {/* 2. the 91 spans */}
      {SPANS.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames}>
          <SpanRenderer span={s} />
        </Sequence>
      ))}

      {/* chrome on every base-cut frame, topmost of the content layers */}
      <Sequence from={FIXED.baseOffset} durationInFrames={FIXED.baseLenFrames}>
        <Chrome />
      </Sequence>

      {/* subscribe units ride over the running frame */}
      {FIXED.subscribe.map((u, i) => (
        <Sequence key={i} from={u.from} durationInFrames={u.durationInFrames}>
          <SubscribeUnit />
        </Sequence>
      ))}

      {/* brand transition — supplied alpha asset as a served PNG sequence, intro→main only */}
      <Sequence
        from={FIXED.brandTransition.from}
        durationInFrames={FIXED.brandTransition.durationInFrames}
      >
        <MediaSeq dir="http://127.0.0.1:8877/media/transition" pad={3} ext="png" />
      </Sequence>

      {/* 3+4. supplied endscreen (20s: thank-you/slots + built-in compliance card) as served JPG seq */}
      <Sequence
        from={FIXED.endscreen.from}
        durationInFrames={FIXED.endscreen.durationInFrames + FIXED.legalStatic.durationInFrames}
      >
        <MediaSeq dir="http://127.0.0.1:8877/media/endscreen" pad={3} ext="jpg" />
      </Sequence>
      <Sequence from={FIXED.crawl.from} durationInFrames={FIXED.crawl.durationInFrames}>
        <Crawl durationInFrames={FIXED.crawl.durationInFrames} />
      </Sequence>
    </AbsoluteFill>
  );
};
