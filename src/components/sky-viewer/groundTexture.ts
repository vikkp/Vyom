import { CanvasTexture } from "three";

/**
 * Ground-disc texture: near-black everywhere except a soft warm glow band
 * near the outer rim (which is what sits right at the visual horizon line
 * from a near-origin camera). This replaces a flat single-color ground +
 * a separate hard-edged glow ring with one continuous soft gradient, so
 * the transition from "sky" to "ground silhouette" reads as an
 * atmospheric fade instead of a hard cut.
 */
export function makeGroundGlowTexture(groundColor: string, glowColor: string, size = 512): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  ctx.fillStyle = groundColor;
  ctx.fillRect(0, 0, size, size);

  const gradient = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r);
  gradient.addColorStop(0, groundColor);
  gradient.addColorStop(0.68, groundColor);
  gradient.addColorStop(0.86, glowColor);
  gradient.addColorStop(1, glowColor);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
