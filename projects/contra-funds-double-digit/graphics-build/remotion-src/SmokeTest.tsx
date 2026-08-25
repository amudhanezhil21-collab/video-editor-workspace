import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  delayRender,
  continueRender,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { loadFonts } from "./fonts";
import { brand, font, zone } from "./theme";
import { GlossySpheres, LightStreak } from "./three/Spheres";

/**
 * Smoke test. Proves, in one render:
 *  - WebGL/Three.js runs in the headless render browser
 *  - the procedural environment map makes metal read as chrome (not black)
 *  - local Inter Tight faces load
 *  - the measured safe zone lands where we think it does
 */
export const SmokeTest: React.FC<{ showPlate: boolean }> = ({ showPlate }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadFonts()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  if (!ready) return null;

  const rise = interpolate(frame, [0, 18], [40, 0], {
    extrapolateRight: "clamp",
  });
  const fade = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {showPlate ? (
        <AbsoluteFill>
          <OffthreadVideo src={staticFile("proxy.mp4")} muted />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill
        style={{ top: 0, height: zone.safeTop.y1, overflow: "hidden" }}
      >
        <ThreeCanvas
          width={width}
          height={zone.safeTop.y1}
          camera={{ fov: 42, position: [0, 0, 7] }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <GlossySpheres
            frame={frame}
            fps={fps}
            spheres={[
              { position: [0, 0, 0], radius: 1.5, roughness: 0.14, spin: 0.6 },
              { position: [2.7, -1.4, -2], radius: 0.8, roughness: 0.22, spin: -0.4 },
              { position: [-2.5, 1.3, -3], radius: 0.6, roughness: 0.3, spin: 0.3 },
            ]}
          />
          <LightStreak position={[-1.2, -0.35, 0.9]} length={5} thickness={0.05} />
          <LightStreak
            position={[-1.6, 0.15, 0.6]}
            length={3.4}
            thickness={0.03}
            opacity={0.7}
          />
        </ThreeCanvas>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          top: 300,
          alignItems: "center",
          opacity: fade,
          transform: `translateY(${rise}px)`,
        }}
      >
        <div
          style={{
            fontFamily: font.black,
            fontSize: 86,
            lineHeight: 0.95,
            color: brand.white,
            letterSpacing: -2,
            textAlign: "center",
          }}
        >
          SMOKE TEST
        </div>
        <div
          style={{
            fontFamily: font.semibold,
            fontSize: 32,
            color: brand.mint,
            marginTop: 12,
          }}
        >
          chrome · envmap · streaks
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ top: zone.safeTop.y1, height: 3 }}>
        <div style={{ width: "100%", height: 3, background: brand.amber }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
