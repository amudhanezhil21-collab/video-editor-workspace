import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';

/**
 * Light-leak transition — reproduced from the creator's own reference reel
 * (youtube.com/shorts/Y0xUnfMt-yY), profiled frame by frame.
 *
 * 13 frames @25fps = 0.52s. Warm-orange wash with a soft vertical column sweep,
 * exactly ONE frame of pure white blowout at index 7, then a MORE saturated
 * orange flood on the way out. Rendered on black so it composites with a
 * screen blend (screen over black is a no-op, which is how real leaks behave).
 *
 * The arrays below are the MEASURED added-light values from the reference,
 * not invented curves.
 */

// added-light luminance per frame (measured)
// Index 5 was measured at 22.0 in the reference reel — a genuine gap between two streaks. Copying
// that number faithfully produced a one-frame DROPOUT here, because the reference's low-mean frame
// still carried visible streak structure while this shader's does not. Reviewers read it as a
// missing frame on all four leaks. Raised to 96 so the curve stays continuous through the gap; the
// dip is still present, it just no longer falls to nothing.
const L_ADD = [44.8, 45.0, 53.2, 41.7, 107.6, 96.0, 185.8, 218.5, 185.5, 163.5, 141.0, 92.2, 24.1];
// added-light R/G ratio per frame (colour temperature; 1.0 = white, >1 = warm)
const RG = [2.81, 2.80, 2.69, 2.60, 1.38, 1.60, 1.04, 0.96, 1.05, 1.35, 1.65, 2.15, 2.40];
// added-light B/G ratio per frame
const BG = [1.02, 1.02, 0.96, 0.98, 0.63, 1.01, 0.94, 1.03, 0.98, 0.70, 0.62, 0.75, 1.06];


// Per-frame calibration: the shader's spatial pattern has a different mean at each
// frame, so a first render was measured and this factor pins each frame's mean added
// luminance to the value measured off the reference reel.
const CAL = [3.86, 2.98, 1.95, 1.29, 1.01, 1.02, 1.09, 1.03, 1.05, 1.30, 1.61, 1.71, 1.76];

export const LEAK_FRAMES = L_ADD.length;

const vert = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

const frag = `
precision highp float;
varying vec2 vUv;
uniform float uT;        // 0..1 through the leak
uniform float uAmp;      // target added luminance (0..1)
uniform vec3  uTint;     // colour balance of the added light
uniform float uSeed;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

// soft-edged vertical column, feathered to true zero
float column(vec2 uv, float cx, float w, float skew){
  float x = uv.x + (uv.y - 0.5) * skew;
  float d = abs(x - cx) / w;
  return exp(-d * d * 2.2);
}

void main(){
  vec2 uv = vUv;

  // three overlapping streaks travelling at different speeds — this is what makes
  // the reference read as a real leak rather than a flat flash
  float a = column(uv, -0.25 + uT * 1.70, 0.30, -0.35);
  float b = column(uv, -0.55 + uT * 2.15, 0.19, 0.22);
  float c = column(uv,  1.35 - uT * 1.85, 0.24, 0.10);

  // broad wash that swells with the envelope
  float wash = 0.42 + 0.58 * smoothstep(0.0, 1.0, uT);

  float leak = a * 0.85 + b * 0.65 + c * 0.55;
  leak = leak * 0.72 + wash * 0.38;

  // bloom toward the edges, as in the reference (leak enters from the frame edge)
  float edge = 1.0 - smoothstep(0.0, 0.85, distance(uv, vec2(0.5)));
  leak *= mix(0.78, 1.16, edge);

  // film grain, deterministic per frame (never Math.random - the renderer seeks)
  float g = hash(floor(uv * vec2(540.0, 960.0)) + uSeed) - 0.5;
  leak += g * 0.035;

  leak = clamp(leak, 0.0, 1.6);

  // normalise so the frame's mean added luminance matches the measured value
  vec3 col = uTint * leak * uAmp;
  gl_FragColor = vec4(col, 1.0);
}
`;

const Plane: React.FC<{idx: number}> = ({idx}) => {
  const i = Math.max(0, Math.min(LEAK_FRAMES - 1, idx));
  const t = LEAK_FRAMES > 1 ? i / (LEAK_FRAMES - 1) : 0;

  const uniforms = useMemo(() => {
    const rg = RG[i], bg = BG[i];
    // build a tint whose luminance is 1.0 so uAmp controls the level exactly
    const g = 1.0;
    const r = rg * g, b = bg * g;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return {
      uT: {value: t},
      uAmp: {value: (L_ADD[i] / 255) * 1.55 * CAL[i]},
      uTint: {value: new THREE.Vector3(r / lum, g / lum, b / lum)},
      uSeed: {value: i * 17.13},
    };
  }, [i, t]);

  return (
    <mesh>
      <planeGeometry args={[1080, 1920]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
};

export const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ThreeCanvas width={1080} height={1920} orthographic camera={{position: [0, 0, 1], zoom: 1}} gl={{antialias: false}}>
        <Plane idx={frame} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
