import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { StudioEnvironment } from "./three/Spheres";
import { brand } from "./theme";

/**
 * Six material treatments rendered side by side so the chrome look is chosen by
 * eye against the reference, not guessed. Labels are burned in as DOM text.
 */

export type Variant = {
  label: string;
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  envMapIntensity: number;
};

export const VARIANTS: Variant[] = [
  { label: "A dark metal", color: "#0a0c11", metalness: 1.0, roughness: 0.16, clearcoat: 1, envMapIntensity: 1.6 },
  { label: "B mid metal", color: "#6b7280", metalness: 1.0, roughness: 0.14, clearcoat: 1, envMapIntensity: 1.6 },
  { label: "C chrome", color: "#c9ced6", metalness: 1.0, roughness: 0.06, clearcoat: 1, envMapIntensity: 2.0 },
  { label: "D obsidian glass", color: "#0d1017", metalness: 0.15, roughness: 0.05, clearcoat: 1, envMapIntensity: 2.4 },
  { label: "E dark pearl", color: "#1b2029", metalness: 0.5, roughness: 0.12, clearcoat: 1, envMapIntensity: 2.2 },
  { label: "F satin dark", color: "#12161d", metalness: 0.8, roughness: 0.3, clearcoat: 1, envMapIntensity: 1.8 },
];

const Row: React.FC<{ t: number }> = ({ t }) => (
  <>
    <StudioEnvironment />
    <ambientLight intensity={0.12} />
    <directionalLight position={[5, 7, 6]} intensity={1.6} color="#ffffff" />
    <pointLight position={[-6, -1, -4]} intensity={16} color={brand.green} distance={26} decay={2} />
    <pointLight position={[4, -4, 3]} intensity={6} color={brand.indigo} distance={20} decay={2} />
    {VARIANTS.map((v, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      return (
        <mesh
          key={v.label}
          position={[(col - 1) * 3.1, row === 0 ? 1.7 : -1.7, 0]}
          rotation={[0, t * 0.3, 0]}
        >
          <sphereGeometry args={[1.25, 96, 96]} />
          <meshPhysicalMaterial
            color={v.color}
            metalness={v.metalness}
            roughness={v.roughness}
            clearcoat={v.clearcoat}
            clearcoatRoughness={0.05}
            envMapIntensity={v.envMapIntensity}
          />
        </mesh>
      );
    })}
  </>
);

export const MaterialTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #10141b 0%, #070a0e 55%, #000000 100%)",
      }}
    >
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, 0, 11] }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Row t={frame / fps} />
      </ThreeCanvas>
      {VARIANTS.map((v, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <div
            key={v.label}
            style={{
              position: "absolute",
              left: `${16 + col * 33.3}%`,
              top: row === 0 ? "16%" : "62%",
              color: "#fff",
              fontFamily: "monospace",
              fontSize: 22,
              textShadow: "0 2px 6px #000",
            }}
          >
            {v.label}
            <br />
            <span style={{ fontSize: 17, opacity: 0.8 }}>
              m{v.metalness} r{v.roughness} e{v.envMapIntensity}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
