import { CanvasTexture } from "three";

// Procedural placeholder art for the mythic figures tied to the nakshatra
// asterisms (Mrigashira, Rohini, Krittika, Dhruva, and the second batch --
// Ashwini, Magha, Jyeshtha) -- same role as rishiSilhouette.ts played for
// the Saptarishi before real character PNGs existed: a soft, hand-drawn-
// feeling stand-in, not a flat glowing icon. Real art can be dropped into
// public/mythic-figures/<nodeId>.png and will be picked up automatically
// (see useOptionalTexture in MythicFigureOverlays.tsx), the same mechanism
// used for the Rishis.

function withGlowFill(ctx: CanvasRenderingContext2D, color: string, blur: number, alpha: number, draw: () => void) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  draw();
  ctx.restore();
}

function auraBackdrop(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  aura.addColorStop(0, color);
  aura.addColorStop(0.5, color);
  aura.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, cx * 2, cy * 2);
}

/**
 * Mrigashira: Prajapati as a leaping stag, with Rudra's arrow (the three
 * stars of Orion's belt, per the myth) drawn passing through the scene --
 * see docs/research/mrigashira-figure-sources.md.
 */
export function makeDeerHunterSilhouette(color: string, w = 360, h = 256): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const cy = h * 0.56;

  auraBackdrop(ctx, cx, cy, w * 0.55, color);

  withGlowFill(ctx, color, w * 0.05, 0.55, () => {
    // Leaping stag body, arched back, legs mid-stride.
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.62); // chest
    ctx.quadraticCurveTo(w * 0.32, h * 0.32, w * 0.55, h * 0.34); // back arch
    ctx.quadraticCurveTo(w * 0.68, h * 0.36, w * 0.74, h * 0.5); // haunch
    ctx.quadraticCurveTo(w * 0.7, h * 0.6, w * 0.6, h * 0.58); // rump curve
    ctx.lineTo(w * 0.58, h * 0.78); // rear leg down
    ctx.lineTo(w * 0.52, h * 0.78);
    ctx.lineTo(w * 0.54, h * 0.58);
    ctx.quadraticCurveTo(w * 0.4, h * 0.56, w * 0.32, h * 0.6); // belly
    ctx.lineTo(w * 0.3, h * 0.82); // front leg down
    ctx.lineTo(w * 0.24, h * 0.82);
    ctx.lineTo(w * 0.28, h * 0.6);
    ctx.closePath();
    ctx.fill();

    // Head + neck, alert, deer's-head silhouette (this asterism's namesake).
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.62);
    ctx.quadraticCurveTo(w * 0.1, h * 0.5, w * 0.08, h * 0.36);
    ctx.quadraticCurveTo(w * 0.075, h * 0.28, w * 0.13, h * 0.24);
    ctx.quadraticCurveTo(w * 0.16, h * 0.3, w * 0.15, h * 0.36);
    ctx.quadraticCurveTo(w * 0.2, h * 0.44, w * 0.27, h * 0.5);
    ctx.closePath();
    ctx.fill();

    // Antlers.
    ctx.lineWidth = w * 0.008;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(w * 0.12, h * 0.25);
    ctx.lineTo(w * 0.1, h * 0.12);
    ctx.moveTo(w * 0.1, h * 0.17);
    ctx.lineTo(w * 0.05, h * 0.13);
    ctx.moveTo(w * 0.14, h * 0.23);
    ctx.lineTo(w * 0.15, h * 0.1);
    ctx.stroke();
  });

  // Rudra's arrow: a single bright shaft crossing the scene, echoing
  // Orion's belt piercing the stag -- kept as a distinct, thinner stroke
  // so it doesn't merge into the deer's own silhouette.
  withGlowFill(ctx, color, w * 0.04, 0.75, () => {
    ctx.strokeStyle = color;
    ctx.lineWidth = w * 0.012;
    ctx.beginPath();
    ctx.moveTo(w * 0.82, h * 0.18);
    ctx.lineTo(w * 0.4, h * 0.62);
    ctx.stroke();
    // Arrowhead.
    ctx.beginPath();
    ctx.moveTo(w * 0.4, h * 0.62);
    ctx.lineTo(w * 0.46, h * 0.58);
    ctx.lineTo(w * 0.45, h * 0.66);
    ctx.closePath();
    ctx.fill();
    // Fletching.
    ctx.beginPath();
    ctx.moveTo(w * 0.82, h * 0.18);
    ctx.lineTo(w * 0.88, h * 0.14);
    ctx.moveTo(w * 0.82, h * 0.18);
    ctx.lineTo(w * 0.87, h * 0.22);
    ctx.stroke();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Rohini: the traditional nakshatra symbol -- an ox-cart (Brahma's chariot,
 * drawn by two oxen) -- see docs/research/rohini-figure-sources.md.
 */
export function makeOxCartSilhouette(color: string, w = 400, h = 240): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const cy = h * 0.58;

  auraBackdrop(ctx, cx, cy, w * 0.55, color);

  withGlowFill(ctx, color, w * 0.04, 0.55, () => {
    // Cart body + canopy.
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.42);
    ctx.lineTo(w * 0.82, h * 0.42);
    ctx.lineTo(w * 0.78, h * 0.62);
    ctx.lineTo(w * 0.54, h * 0.62);
    ctx.closePath();
    ctx.fill();
    // Domed canopy arc over the cart.
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.42);
    ctx.quadraticCurveTo(w * 0.66, h * 0.22, w * 0.82, h * 0.42);
    ctx.quadraticCurveTo(w * 0.66, h * 0.3, w * 0.5, h * 0.42);
    ctx.closePath();
    ctx.fill();

    // Wheel (large, spoked, at the cart's midpoint).
    const wheelCx = w * 0.68;
    const wheelCy = h * 0.72;
    const wheelR = h * 0.14;
    ctx.lineWidth = w * 0.01;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(wheelCx, wheelCy, wheelR, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(wheelCx, wheelCy);
      ctx.lineTo(wheelCx + Math.cos(a) * wheelR, wheelCy + Math.sin(a) * wheelR);
      ctx.stroke();
    }

    // Yoke pole running forward to the two oxen.
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.55);
    ctx.lineTo(w * 0.14, h * 0.55);
    ctx.lineWidth = w * 0.012;
    ctx.stroke();
  });

  // Two oxen, simple rounded bodies + horned heads, walking left.
  const oxen: Array<[number, number]> = [
    [w * 0.14, h * 0.6],
    [w * 0.28, h * 0.6],
  ];
  withGlowFill(ctx, color, w * 0.03, 0.55, () => {
    for (const [ox, oy] of oxen) {
      ctx.beginPath();
      ctx.ellipse(ox, oy, w * 0.07, h * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head.
      ctx.beginPath();
      ctx.ellipse(ox - w * 0.08, oy - h * 0.03, w * 0.035, h * 0.05, 0, 0, Math.PI * 2);
      ctx.fill();
      // Legs.
      ctx.fillRect(ox - w * 0.03, oy + h * 0.06, w * 0.012, h * 0.14);
      ctx.fillRect(ox + w * 0.03, oy + h * 0.06, w * 0.012, h * 0.14);
      // Horns.
      ctx.lineWidth = w * 0.006;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(ox - w * 0.1, oy - h * 0.07);
      ctx.lineTo(ox - w * 0.13, oy - h * 0.1);
      ctx.moveTo(ox - w * 0.06, oy - h * 0.07);
      ctx.lineTo(ox - w * 0.04, oy - h * 0.1);
      ctx.stroke();
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Krittika: the six sisters (Pleiades) as Kartikeya's foster mothers,
 * gathered in a ring around a central flame -- combining the nakshatra's
 * "razor/blade" symbol (Agni's purifying fire) with the six-mothers story.
 * See docs/research/krittika-figure-sources.md.
 */
export function makeKrittikaSilhouette(color: string, w = 300, h = 340): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const cy = h * 0.5;

  auraBackdrop(ctx, cx, cy, w * 0.6, color);

  // Central rising flame.
  withGlowFill(ctx, color, w * 0.07, 0.65, () => {
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.22);
    ctx.quadraticCurveTo(cx + w * 0.14, h * 0.4, cx + w * 0.07, h * 0.58);
    ctx.quadraticCurveTo(cx + w * 0.03, h * 0.66, cx, h * 0.7);
    ctx.quadraticCurveTo(cx - w * 0.03, h * 0.66, cx - w * 0.07, h * 0.58);
    ctx.quadraticCurveTo(cx - w * 0.14, h * 0.4, cx, h * 0.22);
    ctx.closePath();
    ctx.fill();
    // Inner flame core.
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.36);
    ctx.quadraticCurveTo(cx + w * 0.05, h * 0.48, cx, h * 0.62);
    ctx.quadraticCurveTo(cx - w * 0.05, h * 0.48, cx, h * 0.36);
    ctx.closePath();
    ctx.fill();
  });

  // Six small feminine forms (the Krittika sisters) in a ring around the
  // flame, each a simple bell-shaped robed silhouette + head, facing
  // inward toward the fire they tend.
  withGlowFill(ctx, color, w * 0.03, 0.45, () => {
    const ringR = w * 0.36;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const fx = cx + Math.cos(a) * ringR;
      const fy = h * 0.7 + Math.sin(a) * ringR * 0.55;
      const s = w * 0.055;
      // Robed body.
      ctx.beginPath();
      ctx.moveTo(fx - s * 0.4, fy);
      ctx.quadraticCurveTo(fx - s * 0.8, fy + s * 1.6, fx - s * 0.6, fy + s * 2);
      ctx.quadraticCurveTo(fx, fy + s * 2.3, fx + s * 0.6, fy + s * 2);
      ctx.quadraticCurveTo(fx + s * 0.8, fy + s * 1.6, fx + s * 0.4, fy);
      ctx.closePath();
      ctx.fill();
      // Head.
      ctx.beginPath();
      ctx.arc(fx, fy - s * 0.3, s * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Ashwini: the twin Ashwini Kumaras as mounted twin horsemen, matching the
 * "twin horsemen" framing directly -- see
 * docs/research/ashwini-figure-sources.md. Mirrored left/right, echoing
 * the asterism's own two-star simplicity.
 */
export function makeAshwiniKumarasSilhouette(color: string, w = 380, h = 260): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const groundY = h * 0.86;

  auraBackdrop(ctx, w / 2, h * 0.55, w * 0.6, color);

  function rider(cx: number, mirror: 1 | -1) {
    const s = mirror;
    withGlowFill(ctx, color, w * 0.03, 0.55, () => {
      // Horse body, galloping stride.
      ctx.beginPath();
      ctx.ellipse(cx, groundY - h * 0.16, w * 0.16, h * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
      // Neck + head, lowered forward in a gallop.
      ctx.beginPath();
      ctx.moveTo(cx + s * w * 0.13, groundY - h * 0.22);
      ctx.quadraticCurveTo(cx + s * w * 0.24, groundY - h * 0.3, cx + s * w * 0.27, groundY - h * 0.2);
      ctx.quadraticCurveTo(cx + s * w * 0.22, groundY - h * 0.16, cx + s * w * 0.13, groundY - h * 0.14);
      ctx.closePath();
      ctx.fill();
      // Legs, mid-stride.
      for (const [dx, dy] of [[-0.1, 0.08], [-0.03, 0.1], [0.06, 0.09], [0.12, 0.07]] as const) {
        ctx.beginPath();
        ctx.ellipse(cx + s * w * dx, groundY - h * 0.16 + h * dy, w * 0.012, h * 0.09, 0.3 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      // Tail.
      ctx.beginPath();
      ctx.moveTo(cx - s * w * 0.15, groundY - h * 0.2);
      ctx.quadraticCurveTo(cx - s * w * 0.24, groundY - h * 0.1, cx - s * w * 0.2, groundY);
      ctx.lineTo(cx - s * w * 0.14, groundY - h * 0.06);
      ctx.closePath();
      ctx.fill();
      // Rider torso + head, seated on the horse's back.
      ctx.beginPath();
      ctx.ellipse(cx + s * w * 0.02, groundY - h * 0.32, w * 0.045, h * 0.09, -0.15 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + s * w * 0.05, groundY - h * 0.42, w * 0.028, 0, Math.PI * 2);
      ctx.fill();
      // Raised arm, as if guiding the horse or bearing a small torch.
      ctx.lineWidth = w * 0.01;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx + s * w * 0.04, groundY - h * 0.36);
      ctx.lineTo(cx + s * w * 0.1, groundY - h * 0.44);
      ctx.stroke();
    });
  }

  rider(w * 0.32, 1);
  rider(w * 0.68, -1);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Magha: the nakshatra's own symbol -- an empty royal throne, not a seated
 * figure (the deity is the Pitrs collectively, with no single sourced
 * identity to depict). See docs/research/magha-figure-sources.md.
 */
export function makeMaghaThroneSilhouette(color: string, w = 260, h = 340): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const groundY = h * 0.88;

  auraBackdrop(ctx, cx, h * 0.55, w * 0.7, color);

  withGlowFill(ctx, color, w * 0.04, 0.55, () => {
    // Base/seat block.
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.32, groundY);
    ctx.lineTo(cx + w * 0.32, groundY);
    ctx.lineTo(cx + w * 0.26, groundY - h * 0.14);
    ctx.lineTo(cx - w * 0.26, groundY - h * 0.14);
    ctx.closePath();
    ctx.fill();
    // Legs.
    ctx.fillRect(cx - w * 0.28, groundY, w * 0.05, h * 0.08);
    ctx.fillRect(cx + w * 0.23, groundY, w * 0.05, h * 0.08);
    // Tall back/backrest, narrowing upward.
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.24, groundY - h * 0.14);
    ctx.lineTo(cx - w * 0.16, groundY - h * 0.58);
    ctx.lineTo(cx + w * 0.16, groundY - h * 0.58);
    ctx.lineTo(cx + w * 0.24, groundY - h * 0.14);
    ctx.closePath();
    ctx.fill();
    // Armrests, curled scroll-like ends.
    for (const s of [-1, 1] as const) {
      ctx.beginPath();
      ctx.moveTo(cx + s * w * 0.26, groundY - h * 0.14);
      ctx.quadraticCurveTo(cx + s * w * 0.34, groundY - h * 0.2, cx + s * w * 0.3, groundY - h * 0.28);
      ctx.quadraticCurveTo(cx + s * w * 0.27, groundY - h * 0.24, cx + s * w * 0.24, groundY - h * 0.24);
      ctx.closePath();
      ctx.fill();
    }
    // Domed canopy crowning the back, echoing a royal palanquin.
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.2, groundY - h * 0.58);
    ctx.quadraticCurveTo(cx, groundY - h * 0.82, cx + w * 0.2, groundY - h * 0.58);
    ctx.closePath();
    ctx.fill();
    // Finial.
    ctx.beginPath();
    ctx.arc(cx, groundY - h * 0.82, w * 0.025, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Jyeshtha: the nakshatra's own symbol -- an earring / umbrella-topped
 * pendant talisman, matching the "three stars in a row" shape and the
 * dual reading the sources give it. Chosen over depicting Indra directly
 * (much larger iconographic scope). See
 * docs/research/jyeshtha-figure-sources.md.
 */
export function makeJyeshthaTalismanSilhouette(color: string, w = 220, h = 300): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;

  auraBackdrop(ctx, cx, h * 0.45, w * 0.75, color);

  withGlowFill(ctx, color, w * 0.04, 0.55, () => {
    // Suspension loop at the top.
    ctx.lineWidth = w * 0.025;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, h * 0.14, w * 0.06, Math.PI * 0.15, Math.PI * 0.85, true);
    ctx.stroke();

    // Domed umbrella-like crown.
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.22, h * 0.32);
    ctx.quadraticCurveTo(cx, h * 0.16, cx + w * 0.22, h * 0.32);
    ctx.quadraticCurveTo(cx, h * 0.24, cx - w * 0.22, h * 0.32);
    ctx.closePath();
    ctx.fill();
    // Small finial spike on top of the dome.
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.015, h * 0.16);
    ctx.lineTo(cx + w * 0.015, h * 0.16);
    ctx.lineTo(cx, h * 0.1);
    ctx.closePath();
    ctx.fill();

    // Chain of three linking gems, echoing the three stars.
    for (const t of [0.4, 0.5, 0.6]) {
      ctx.beginPath();
      ctx.arc(cx, h * t, w * 0.025, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hanging teardrop gem (the earring's main pendant).
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.66);
    ctx.quadraticCurveTo(cx + w * 0.16, h * 0.78, cx, h * 0.96);
    ctx.quadraticCurveTo(cx - w * 0.16, h * 0.78, cx, h * 0.66);
    ctx.closePath();
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Dhruva: the young boy in penance, seated in meditation with hands
 * folded, a faint halo marking the boon that fixed him as the pole star --
 * see docs/research/dhruva-figure-sources.md.
 */
export function makeDhruvaSilhouette(color: string, w = 240, h = 300): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;

  auraBackdrop(ctx, cx, h * 0.5, w * 0.65, color);

  // Halo, behind the head, marking divine favour.
  withGlowFill(ctx, color, w * 0.08, 0.3, () => {
    ctx.beginPath();
    ctx.arc(cx, h * 0.3, w * 0.24, 0, Math.PI * 2);
    ctx.fill();
  });

  withGlowFill(ctx, color, w * 0.05, 0.6, () => {
    // Seated cross-legged body, small (a child), hands folded at the
    // chest in prayer.
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.42);
    ctx.quadraticCurveTo(cx - w * 0.28, h * 0.5, cx - w * 0.34, h * 0.72);
    ctx.quadraticCurveTo(cx - w * 0.3, h * 0.82, cx - w * 0.14, h * 0.8);
    ctx.quadraticCurveTo(cx, h * 0.86, cx + w * 0.14, h * 0.8);
    ctx.quadraticCurveTo(cx + w * 0.3, h * 0.82, cx + w * 0.34, h * 0.72);
    ctx.quadraticCurveTo(cx + w * 0.28, h * 0.5, cx, h * 0.42);
    ctx.closePath();
    ctx.fill();

    // Folded hands, small raised bump at chest centre.
    ctx.beginPath();
    ctx.ellipse(cx, h * 0.56, w * 0.06, h * 0.035, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head.
    ctx.beginPath();
    ctx.arc(cx, h * 0.3, w * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Small crown-knot of hair (young ascetic).
    ctx.beginPath();
    ctx.arc(cx, h * 0.17, w * 0.04, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
