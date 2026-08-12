import { CanvasTexture, RepeatWrapping, ClampToEdgeWrapping } from "three";

const WIDTH = 512;
const HEIGHT = 160;

/** Shortest angular distance between two longitudes, handling 0/360 wrap. */
function angDist(lDeg: number, refDeg: number): number {
  return Math.abs((((lDeg - refDeg + 180) % 360) + 360) % 360 - 180);
}

/**
 * Brightness along the band's length (galactic longitude), per
 * docs/research/akash-ganga-sources.md's real-sky reference: a strong
 * peak at the galactic center (l=0, Sagittarius/Scorpius), a secondary
 * peak toward Carina (l=283), and a dip at the anticenter (l=180,
 * Auriga/Taurus). Stylized/authored-by-eye, not sourced from actual
 * photometry -- see the ADR's Consequences section.
 */
function longitudeBrightness(lDeg: number): number {
  const base = 0.32;
  const core = 0.68 * Math.exp(-((angDist(lDeg, 0) / 22) ** 2));
  const carina = 0.32 * Math.exp(-((angDist(lDeg, 283) / 18) ** 2));
  const dip = 0.16 * Math.exp(-((angDist(lDeg, 180) / 30) ** 2));
  return Math.max(0, Math.min(1, base + core + carina - dip));
}

/**
 * Brightness across the band's width (galactic latitude): a narrow
 * bright core plus a broader, fainter halo -- two Gaussians rather than
 * one, so the edge reads as a soft feather rather than a clean falloff.
 */
function latitudeBrightness(bDeg: number): number {
  const coreLayer = 0.72 * Math.exp(-((bDeg / 4.5) ** 2));
  const haloLayer = 0.45 * Math.exp(-((bDeg / 12) ** 2));
  return Math.max(0, Math.min(1, coreLayer + haloLayer));
}

/** Tiny deterministic PRNG (mulberry32) so the mottling is stable across renders. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Half-width of the rendered band, in galactic latitude degrees -- must match AkashGanga.tsx's BAND_HALF_WIDTH_DEG. */
export const AKASH_GANGA_BAND_HALF_WIDTH_DEG = 16;

/**
 * Procedurally generates the Akash Ganga band's cross-section texture:
 * u (0-1, wraps seamlessly) maps to galactic longitude 0-360; v (0-1)
 * maps to galactic latitude +BAND_HALF_WIDTH..-BAND_HALF_WIDTH. Cool
 * pale white-blue, matching StarField.tsx's existing "mostly cool white/
 * blue-white" star palette, with light mottling layered on top so it
 * reads as a textured starcloud rather than a flat gradient -- see
 * docs/adr/ADR0006-akash-ganga-milky-way.md.
 */
export function makeAkashGangaTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  const data = imageData.data;

  // Base cool white-blue, with a faint warm tint mixed in near the
  // galactic-center longitude for a touch of visual richness (matching
  // how the real core reads slightly duskier in photographs).
  const coolR = 205, coolG = 220, coolB = 255;
  const warmR = 230, warmG = 210, warmB = 180;

  for (let py = 0; py < HEIGHT; py++) {
    const v = py / (HEIGHT - 1);
    const b = AKASH_GANGA_BAND_HALF_WIDTH_DEG - v * 2 * AKASH_GANGA_BAND_HALF_WIDTH_DEG;
    const latB = latitudeBrightness(b);

    for (let px = 0; px < WIDTH; px++) {
      const u = px / WIDTH;
      const l = u * 360;
      const lonB = longitudeBrightness(l);
      const alpha = Math.max(0, Math.min(1, lonB * latB));

      // Blend cool <-> warm based on proximity to the galactic center,
      // independent of the alpha falloff -- a subtle tint, not a hard band.
      const warmth = Math.max(0, Math.min(1, Math.exp(-((angDist(l, 0) / 30) ** 2)) * 0.5));
      const r = coolR + (warmR - coolR) * warmth;
      const g = coolG + (warmG - coolG) * warmth;
      const bC = coolB + (warmB - coolB) * warmth;

      const idx = (py * WIDTH + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = bC;
      data[idx + 3] = Math.round(alpha * 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Light mottling: soft, low-opacity blobs scattered mostly within the
  // bright core region, for an organic "starcloud" texture rather than a
  // flat gradient -- deterministic seed so the look is stable.
  const rand = mulberry32(88172645);
  ctx.globalCompositeOperation = "overlay";
  for (let i = 0; i < 70; i++) {
    const u = rand();
    const l = u * 360;
    // Weight blob placement toward brighter longitude regions so the
    // mottling reads as part of the band, not scattered noise.
    if (rand() > longitudeBrightness(l) + 0.15) continue;
    const px = u * WIDTH;
    const py = HEIGHT / 2 + (rand() - 0.5) * HEIGHT * 0.75;
    const radius = 8 + rand() * 22;
    const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
    const tint = rand() > 0.5 ? "255,255,255" : "170,190,230";
    grad.addColorStop(0, `rgba(${tint},${0.12 + rand() * 0.1})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
    // Wrap the blob across the seam so it tiles seamlessly at u=0/u=1.
    if (px < radius) {
      ctx.beginPath();
      ctx.arc(px + WIDTH, py, radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (px > WIDTH - radius) {
      ctx.beginPath();
      ctx.arc(px - WIDTH, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = "source-over";

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
