import React, { useMemo, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeStudioEnv } from "./env";
import { brand } from "../theme";

/**
 * The house 3D motif: dark glossy spheres with a white specular ridge and a
 * brand-green rim, sitting in depth. Translated from the reference's product card.
 *
 * The environment map is what makes the metal read as chrome — without it a
 * metalness=1 surface renders black. See ./env.ts.
 */

export const StudioEnvironment: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => {
  const { scene } = useThree();
  const env = useMemo(
    () => makeStudioEnv({ keyIntensity: intensity }),
    [intensity]
  );
  useEffect(() => {
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [scene, env]);
  return null;
};

export type SphereSpec = {
  position: [number, number, number];
  radius: number;
  roughness?: number;
  /** 0 = static, otherwise radians/sec */
  spin?: number;
};

export const GlossySpheres: React.FC<{
  frame: number;
  fps: number;
  spheres: SphereSpec[];
  envIntensity?: number;
}> = ({ frame, fps, spheres, envIntensity = 1.6 }) => {
  const t = frame / fps;
  return (
    <>
      <StudioEnvironment />
      {/* Ambient stays low — the environment does the lifting */}
      <ambientLight intensity={0.12} />
      {/* Hard key for a crisp contact highlight */}
      <directionalLight position={[5, 7, 6]} intensity={1.6} color="#ffffff" />
      {/* Green rim from behind-left: the reference's signature streak colour */}
      <pointLight
        position={[-6, -1, -4]}
        intensity={16}
        color={brand.green}
        distance={26}
        decay={2}
      />
      <pointLight
        position={[4, -4, 3]}
        intensity={6}
        color={brand.indigo}
        distance={20}
        decay={2}
      />

      {spheres.map((s, i) => (
        <mesh
          key={i}
          position={s.position}
          rotation={[0, t * (s.spin ?? 0.35), 0]}
        >
          <sphereGeometry args={[s.radius, 96, 96]} />
          <meshPhysicalMaterial
            color="#0a0c11"
            metalness={1}
            roughness={s.roughness ?? 0.16}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={envIntensity}
          />
        </mesh>
      ))}
    </>
  );
};

/** Emissive light streak — the green speed-line motif from the reference card. */
export const LightStreak: React.FC<{
  position: [number, number, number];
  length: number;
  thickness?: number;
  color?: string;
  opacity?: number;
}> = ({
  position,
  length,
  thickness = 0.06,
  color = brand.green,
  opacity = 1,
}) => (
  <mesh position={position}>
    <boxGeometry args={[length, thickness, thickness]} />
    <meshBasicMaterial
      color={color}
      toneMapped={false}
      transparent
      opacity={opacity}
      blending={THREE.AdditiveBlending}
    />
  </mesh>
);
