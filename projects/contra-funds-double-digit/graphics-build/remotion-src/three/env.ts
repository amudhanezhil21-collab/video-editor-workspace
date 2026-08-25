import * as THREE from "three";

/**
 * Procedural equirectangular environment map.
 *
 * Metals reflect their environment; with no envMap a metalness=1 surface renders
 * pure black. The reference's glossy spheres read as chrome because they have
 * something to reflect. We build that something here rather than downloading an
 * HDR — keeps the render self-contained and offline.
 *
 * The map is a dark studio: near-black ground, a bright key band high on one side,
 * a brand-green wash on the opposite side, and a soft indigo fill. That gives the
 * spheres a white specular ridge plus the green rim the reference is known for.
 */
export const makeStudioEnv = (opts?: {
  green?: string;
  indigo?: string;
  keyIntensity?: number;
}): THREE.Texture => {
  const green = opts?.green ?? "#00D09C";
  const indigo = opts?.indigo ?? "#5367FC";
  const key = opts?.keyIntensity ?? 1;

  const w = 1024;
  const h = 512;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  // base: vertical gradient, brighter overhead, black underfoot
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0.0, "#20242e");
  base.addColorStop(0.35, "#0d0f14");
  base.addColorStop(1.0, "#000000");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const blob = (
    cx: number,
    cy: number,
    r: number,
    color: string,
    alpha: number
  ) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  };

  // key light: a broad soft-box high-right -> the white specular ridge
  blob(w * 0.72, h * 0.18, w * 0.26, "#ffffff", 0.95 * key);
  // a tighter hot core inside it so the highlight has a defined edge
  blob(w * 0.72, h * 0.18, w * 0.09, "#ffffff", 1.0 * key);

  // brand green wash from the opposite side -> the signature rim
  blob(w * 0.2, h * 0.42, w * 0.3, green, 0.75);
  // indigo fill low-left for a cool bounce
  blob(w * 0.08, h * 0.72, w * 0.26, indigo, 0.4);
  // faint green kicker behind, wraps the silhouette
  blob(w * 0.95, h * 0.55, w * 0.2, green, 0.3);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
};
