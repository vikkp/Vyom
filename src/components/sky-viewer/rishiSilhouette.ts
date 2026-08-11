import { CanvasTexture } from "three";

/**
 * Procedural placeholder for a seated-rishi silhouette (head + draped
 * robe/body shape, soft-blurred edges) — used until real character art
 * exists in public/rishis/. This is deliberately NOT trying to be
 * photorealistic; it's meant to read as "a vague painted figure" instead
 * of "a plain glowing circle", which is the most a canvas gradient can
 * reasonably approximate without actual generated artwork.
 */
export function makeRishiSilhouetteTexture(color: string, size = 256): CanvasTexture {
  const w = size;
  const h = Math.round(size * 1.3);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;

  // Soft outer aura.
  const aura = ctx.createRadialGradient(cx, h * 0.55, 0, cx, h * 0.55, w * 0.65);
  aura.addColorStop(0, color);
  aura.addColorStop(0.5, color);
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, w, h);

  // A vaguely seated, robed figure: head + a bell-shaped body, blurred.
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.12;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.55;

  const bodyTop = h * 0.42;
  const bodyBottom = h * 0.92;
  const topW = w * 0.22;
  const bottomW = w * 0.42;

  ctx.beginPath();
  ctx.moveTo(cx - topW, bodyTop);
  ctx.quadraticCurveTo(cx - bottomW * 1.1, bodyBottom * 0.75, cx - bottomW, bodyBottom);
  ctx.quadraticCurveTo(cx, bodyBottom * 1.04, cx + bottomW, bodyBottom);
  ctx.quadraticCurveTo(cx + bottomW * 1.1, bodyBottom * 0.75, cx + topW, bodyTop);
  ctx.quadraticCurveTo(cx, bodyTop * 0.94, cx - topW, bodyTop);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, h * 0.28, w * 0.13, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
