import { CanvasTexture, RepeatWrapping, ClampToEdgeWrapping } from "three";

const WIDTH = 1024;
const HEIGHT = 512;

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
  const base = 0.3;
  const core = 0.72 * Math.exp(-((angDist(lDeg, 0) / 20) ** 2));
  const carina = 0.34 * Math.exp(-((angDist(lDeg, 283) / 16) ** 2));
  const dip = 0.18 * Math.exp(-((angDist(lDeg, 180) / 28) ** 2));
  return Math.max(0, Math.min(1, base + core + carina - dip));
}

/**
 * Half-width, in galactic latitude degrees, of the visible glow --
 * brightness is forced to exactly 0 beyond this (see edgeWindow). This
 * texture covers the *entire* sphere (b from +90 to -90, see
 * AkashGanga.tsx), not just this band -- everywhere outside it is fully
 * transparent, which is what actually matters now: because the geometry
 * is a closed sphere rather than an open strip, there's no geometric
 * boundary left for a non-zero edge value to expose as a hard line (the
 * bug this constant was originally added to fix).
 */
const BAND_HALF_WIDTH_DEG = 16;

function edgeWindow(bDeg: number, halfWidthDeg: number): number {
  const t = Math.min(1, Math.abs(bDeg) / halfWidthDeg);
  return Math.max(0, 1 - t * t);
}

/**
 * Brightness across the band's width (galactic latitude): a narrow
 * bright core plus a broader, fainter halo -- two Gaussians rather than
 * one, so the edge reads as a soft feather -- windowed to reach exactly
 * 0 well before the poles.
 */
function latitudeBrightness(bDeg: number): number {
  const coreLayer = 0.74 * Math.exp(-((bDeg / 4.2) ** 2));
  const haloLayer = 0.42 * Math.exp(-((bDeg / 11) ** 2));
  const raw = Math.max(0, Math.min(1, coreLayer + haloLayer));
  return raw * edgeWindow(bDeg, BAND_HALF_WIDTH_DEG);
}

/** Tiny deterministic PRNG (mulberry32) so every noise field below is stable across renders. */
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

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * A small value-noise lattice: `cols` x `rows` random samples, bilinearly
 * (+ smoothstep-eased) interpolated in between. `u` wraps modulo 1 (so
 * the noise tiles seamlessly across the longitude seam, same requirement
 * the rest of this texture already has); `v` clamps to [0, 1] since
 * latitude isn't cyclic. This is the building block for the fbm/domain-
 * warp work below -- addressing the "smooth torch-beam" feedback, which
 * came down to the band having *no* structure at any frequency finer
 * than its two authored Gaussian curves. Real Milky Way photos are
 * dominated by unresolved starlight and dust clumping at many scales
 * simultaneously, which is what stacking several of these at different
 * `cols` achieves (see makeFbm).
 */
interface Lattice {
  data: Float32Array;
  cols: number;
  rows: number;
}

function makeLattice(seed: number, cols: number, rows: number): Lattice {
  const rand = mulberry32(seed);
  const data = new Float32Array(cols * (rows + 1));
  for (let i = 0; i < data.length; i++) data[i] = rand();
  return { data, cols, rows };
}

function sampleLattice(lattice: Lattice, u: number, v: number): number {
  const { data, cols, rows } = lattice;
  const uu = ((u % 1) + 1) % 1;
  const vv = Math.max(0, Math.min(1, v));
  const fx = uu * cols;
  const fy = vv * rows;
  const x0 = Math.floor(fx) % cols;
  const x1 = (x0 + 1) % cols;
  const y0 = Math.min(rows - 1, Math.max(0, Math.floor(fy)));
  const y1 = Math.min(rows, y0 + 1);
  const tx = smoothstep(fx - Math.floor(fx));
  const ty = smoothstep(fy - y0);

  const v00 = data[y0 * cols + x0];
  const v10 = data[y0 * cols + x1];
  const v01 = data[y1 * cols + x0];
  const v11 = data[y1 * cols + x1];
  const a = v00 + (v10 - v00) * tx;
  const b = v01 + (v11 - v01) * tx;
  return a + (b - a) * ty;
}

// Four octaves of the same lattice noise, different frequencies (coarse
// cloud structure down to fine stippled grain), all seeded independently
// so they don't visually correlate. Cheap to build once at module scope
// (a handful of small Float32Arrays), reused for every sample in the
// per-pixel loop below.
const CLOUD_OCTAVE_A = makeLattice(202, 20, 8);
const CLOUD_OCTAVE_B = makeLattice(303, 56, 14);
const CLOUD_OCTAVE_C = makeLattice(404, 130, 26);
const CLOUD_OCTAVE_D = makeLattice(606, 260, 40);
const EDGE_WARP_LATTICE = makeLattice(101, 10, 4);
const RIFT_WOBBLE_LATTICE = makeLattice(505, 8, 3);
const ROSE_TINT_LATTICE = makeLattice(707, 34, 10);

// All the latitude-direction lattices above are only ever meaningful
// within a modest band around the galactic equator (everywhere else
// ends up multiplied by ~0 latitude brightness anyway) -- this constant
// maps that real ±NOISE_LAT_SPAN° range onto each lattice's own [0, 1]
// v-axis so the authored row-counts above resolve at their intended
// spatial frequency rather than being stretched across the whole
// +90..-90 sphere the texture otherwise covers.
const NOISE_LAT_SPAN = 26;
function latToNoiseV(bDeg: number): number {
  return (bDeg + NOISE_LAT_SPAN) / (2 * NOISE_LAT_SPAN);
}

/**
 * Four-octave fractal cloud-density field: patchy, high-contrast, and
 * -- crucially -- multiplies (not just perturbs) the base alpha, so the
 * band's cross-section stops being a perfectly smooth Gaussian ridge and
 * instead reads as clumped starcloud, the way the real Milky Way's
 * unresolved starlight does. `1.9`/`1.3` push contrast up (recentered
 * around the field's ~0.5 mean, then a power curve) rather than leaving
 * the raw lattice sum's naturally low contrast in place.
 */
function cloudDensity(u: number, v: number): number {
  const fbm =
    sampleLattice(CLOUD_OCTAVE_A, u, v) * 0.45 +
    sampleLattice(CLOUD_OCTAVE_B, u, v) * 0.28 +
    sampleLattice(CLOUD_OCTAVE_C, u, v) * 0.17 +
    sampleLattice(CLOUD_OCTAVE_D, u, v) * 0.1;
  const contrasted = Math.max(0, Math.min(1, (fbm - 0.5) * 1.9 + 0.5));
  return 0.35 + Math.pow(contrasted, 1.3) * 1.3;
}

/**
 * Procedurally generates Akash Ganga's texture as a **full equirectangular
 * map of the whole sphere** -- u (0-1, wraps seamlessly) is galactic
 * longitude 0-360, v (0-1) is galactic latitude +90 (top) to -90
 * (bottom) -- almost entirely transparent, with the glow band only
 * occupying the strip near v=0.5 (b=0). Mapped onto a full enclosing
 * sphere (AkashGanga.tsx): a closed sphere viewed from its centre is
 * crossed by every ray exactly once no matter which way the camera
 * looks, which is what fixed this band's original hard-edged "column"
 * artifact (see ADR0006 and the follow-up fix commit for that
 * diagnosis).
 *
 * This version answers a second, separate round of feedback -- the fixed
 * band still read as a smooth, artificial "torch light" beam rather than
 * a real Milky Way, because its only structure was two authored Gaussian
 * curves (along-length and across-width) with light canvas-blob dressing
 * on top. Real Milky Way photographs are dominated by texture at many
 * scales simultaneously: mottled starclouds, a frayed/organic edge
 * rather than a mathematically perfect one, and -- most recognizably --
 * the dark dust lane (the Great Rift) splitting the bright core. This
 * rewrite adds all three, via a small multi-octave value-noise system
 * (see Lattice/sampleLattice/cloudDensity above):
 *
 * 1. **Edge warp** -- a low-frequency noise field perturbs the effective
 *    latitude fed into latitudeBrightness, so the band's boundary wanders
 *    instead of tracing a perfect curve.
 * 2. **Cloud density** -- a four-octave fbm field multiplies the base
 *    alpha across the whole band, breaking the smooth gradient into
 *    patchy starcloud clumps (plus a finer grain pass for stippled
 *    texture at the pixel scale).
 * 3. **Dust lane** -- a narrow, gently-wobbling darker streak near the
 *    band's centerline, implemented as a further alpha *reduction*
 *    (additive blending can only add light, so "darker" here means "adds
 *    less light than its brighter surroundings," which reads as a dark
 *    rift against the bright band the same way the real Great Rift does
 *    in photographs) with its own brownish colour cast, most visible
 *    through the bright core/disc.
 */
export function makeAkashGangaTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(WIDTH, HEIGHT);
  const data = imageData.data;

  // Base cool white-blue, with a warm tint mixed in near the galactic
  // center longitude, plus a faint rose tint scattered through patchy
  // regions (stand-in for H II emission-nebula colour visible in real
  // photos) and a brownish cast inside the dust lane itself.
  const coolR = 200,
    coolG = 216,
    coolB = 255;
  const warmR = 240,
    warmG = 200,
    warmB = 160;

  for (let py = 0; py < HEIGHT; py++) {
    const v = py / (HEIGHT - 1);
    const b = 90 - v * 180;
    const noiseV = latToNoiseV(b);

    for (let px = 0; px < WIDTH; px++) {
      const u = px / WIDTH;
      const l = u * 360;

      const edgeWarpDeg = (sampleLattice(EDGE_WARP_LATTICE, u, noiseV) - 0.5) * 7;
      const bEff = b + edgeWarpDeg;
      const noiseVEff = latToNoiseV(bEff);

      const lonB = longitudeBrightness(l);
      const latB = latitudeBrightness(bEff);
      let alpha = lonB * latB;

      // Patchy cloud-density mottling.
      alpha *= cloudDensity(u, noiseVEff);

      // Fine stippled grain on top, sampled from the highest-frequency
      // octave at an offset phase so it doesn't just repeat cloudDensity's
      // own fine layer.
      const grain = sampleLattice(CLOUD_OCTAVE_D, u * 1.7 + 0.13, noiseVEff * 1.3 + 0.07);
      alpha *= 0.82 + grain * 0.36;

      // Dust lane: distance from a wobbling centerline, strongest through
      // the bright core/disc, tapered with a squared falloff for a soft
      // but still legible rift.
      const riftCenter = (sampleLattice(RIFT_WOBBLE_LATTICE, u, noiseVEff) - 0.5) * 6;
      const riftDist = Math.abs(bEff - riftCenter);
      const riftRaw = Math.max(0, 1 - (riftDist / 2.3) ** 2);
      const riftStrength = Math.pow(riftRaw, 1.6) * Math.max(0, Math.min(1, lonB * 1.4));
      alpha *= 1 - riftStrength * 0.72;

      alpha = Math.max(0, Math.min(1, alpha));

      const warmth = Math.max(0, Math.min(1, Math.exp(-((angDist(l, 0) / 28) ** 2)) * 0.6));
      let r = coolR + (warmR - coolR) * warmth;
      let g = coolG + (warmG - coolG) * warmth;
      let bC = coolB + (warmB - coolB) * warmth;

      const rose = sampleLattice(ROSE_TINT_LATTICE, u * 0.8 + 0.31, noiseVEff * 0.9);
      const roseMask = Math.max(0, Math.min(1, (rose - 0.58) * 3)) * (latB > 0.04 ? 1 : 0);
      r += roseMask * 22;
      g -= roseMask * 12;
      bC -= roseMask * 8;

      r -= riftStrength * 20;
      g -= riftStrength * 28;
      bC -= riftStrength * 38;

      const idx = (py * WIDTH + px) * 4;
      data[idx] = Math.max(0, Math.min(255, r));
      data[idx + 1] = Math.max(0, Math.min(255, g));
      data[idx + 2] = Math.max(0, Math.min(255, bC));
      data[idx + 3] = Math.round(alpha * 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
