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
 * Ardra: the nakshatra's own symbol -- a single teardrop/gem, matching its
 * single-star (Betelgeuse) astronomical basis; see
 * docs/research/ardra-asterism-sources.md for why this stays a one-star
 * nakshatra with a correspondingly simple, single-form figure. Faceted cut
 * lines read as "jewel" rather than a plain drop of water, echoing the
 * "shining diamond" reading some sources give alongside "teardrop." A
 * faint inward swirl behind it gestures at Rudra's stormy nature without
 * needing a literal storm scene.
 */
export function makeArdraTeardropSilhouette(color: string, w = 220, h = 280): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;

  auraBackdrop(ctx, cx, h * 0.5, w * 0.65, color);

  // Faint storm-swirl behind the gem, Rudra's fierce/stormy nature.
  withGlowFill(ctx, color, w * 0.05, 0.18, () => {
    ctx.lineWidth = w * 0.015;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, h * 0.5, w * 0.42, Math.PI * 0.1, Math.PI * 1.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, h * 0.5, w * 0.52, Math.PI * 0.9, Math.PI * 2.1);
    ctx.stroke();
  });

  withGlowFill(ctx, color, w * 0.06, 0.7, () => {
    // Main teardrop body: rounded top, tapering to a point at the bottom.
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.2);
    ctx.quadraticCurveTo(cx + w * 0.26, h * 0.42, cx + w * 0.2, h * 0.66);
    ctx.quadraticCurveTo(cx + w * 0.12, h * 0.86, cx, h * 0.92);
    ctx.quadraticCurveTo(cx - w * 0.12, h * 0.86, cx - w * 0.2, h * 0.66);
    ctx.quadraticCurveTo(cx - w * 0.26, h * 0.42, cx, h * 0.2);
    ctx.closePath();
    ctx.fill();
  });

  // Facet lines, cut-gem detail, drawn as thin strokes over the fill.
  withGlowFill(ctx, color, w * 0.02, 0.9, () => {
    ctx.lineWidth = w * 0.008;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.2);
    ctx.lineTo(cx, h * 0.92);
    ctx.moveTo(cx - w * 0.18, h * 0.5);
    ctx.lineTo(cx + w * 0.18, h * 0.5);
    ctx.moveTo(cx - w * 0.12, h * 0.35);
    ctx.lineTo(cx + w * 0.05, h * 0.62);
    ctx.moveTo(cx + w * 0.12, h * 0.35);
    ctx.lineTo(cx - w * 0.05, h * 0.62);
    ctx.stroke();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Punarvasu: the nakshatra's own symbol -- a bow with a quiver of arrows,
 * matching the twin-star (Castor/Pollux) "two brothers" framing loosely
 * (bow + quiver as a paired set of tools) without depicting either twin
 * directly, since neither has a single sourced iconographic form here. See
 * docs/research/punarvasu-asterism-sources.md.
 */
export function makePunarvasuBowSilhouette(color: string, w = 300, h = 260): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const cy = h * 0.5;

  auraBackdrop(ctx, cx, cy, w * 0.6, color);

  withGlowFill(ctx, color, w * 0.03, 0.6, () => {
    // Bow: a tall arc plus taut string.
    ctx.lineWidth = w * 0.02;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx - w * 0.02, cy, h * 0.42, Math.PI * 0.62, Math.PI * 1.38);
    ctx.stroke();
    // String, straight line between the bow's two tips.
    ctx.lineWidth = w * 0.006;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.02 + Math.cos(Math.PI * 0.62) * h * 0.42, cy + Math.sin(Math.PI * 0.62) * h * 0.42);
    ctx.lineTo(cx - w * 0.02 + Math.cos(Math.PI * 1.38) * h * 0.42, cy + Math.sin(Math.PI * 1.38) * h * 0.42);
    ctx.stroke();

    // Arrow, nocked and drawn back against the string.
    ctx.lineWidth = w * 0.012;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.02, cy);
    ctx.lineTo(cx + w * 0.34, cy);
    ctx.stroke();
    // Arrowhead.
    ctx.beginPath();
    ctx.moveTo(cx + w * 0.34, cy);
    ctx.lineTo(cx + w * 0.27, cy - h * 0.03);
    ctx.lineTo(cx + w * 0.27, cy + h * 0.03);
    ctx.closePath();
    ctx.fill();
    // Fletching.
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.02, cy);
    ctx.lineTo(cx - w * 0.08, cy - h * 0.04);
    ctx.moveTo(cx - w * 0.02, cy);
    ctx.lineTo(cx - w * 0.08, cy + h * 0.04);
    ctx.stroke();
  });

  // Quiver, leaning behind the bow with a few extra arrow shafts peeking out.
  withGlowFill(ctx, color, w * 0.03, 0.5, () => {
    const qx = cx - w * 0.22;
    const qy = h * 0.74;
    ctx.beginPath();
    ctx.moveTo(qx - w * 0.05, qy);
    ctx.lineTo(qx + w * 0.05, qy);
    ctx.lineTo(qx + w * 0.035, qy - h * 0.28);
    ctx.lineTo(qx - w * 0.035, qy - h * 0.28);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = w * 0.008;
    ctx.strokeStyle = color;
    for (const dx of [-0.02, 0, 0.02]) {
      ctx.beginPath();
      ctx.moveTo(qx + w * dx, qy - h * 0.26);
      ctx.lineTo(qx + w * dx * 1.4, qy - h * 0.42);
      ctx.stroke();
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Pushya: a lotus in bloom with an arrow rising through its centre --
 * combining two of the nakshatra's cited symbols (lotus, arrow); the
 * cow's-udder reading is the most commonly cited primary symbol but
 * doesn't translate into a legible standalone silhouette the way the
 * lotus does, so it's left for real art to interpret later. See
 * docs/research/pushya-asterism-sources.md.
 */
export function makePushyaLotusSilhouette(color: string, w = 260, h = 280): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const petalBaseY = h * 0.68;

  auraBackdrop(ctx, cx, h * 0.55, w * 0.65, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // Lotus petals, a fan of five rounded petals opening upward.
    const petalCount = 5;
    for (let i = 0; i < petalCount; i++) {
      const t = i / (petalCount - 1);
      const angle = Math.PI * 0.5 + (t - 0.5) * Math.PI * 0.7;
      const len = h * (i === Math.floor(petalCount / 2) ? 0.42 : 0.36);
      const tipX = cx + Math.cos(angle) * len * 0.5;
      const tipY = petalBaseY - Math.sin(angle) * len;
      const perpX = Math.cos(angle + Math.PI / 2) * w * 0.05;
      ctx.beginPath();
      ctx.moveTo(cx, petalBaseY);
      ctx.quadraticCurveTo(cx + perpX, (petalBaseY + tipY) / 2, tipX, tipY);
      ctx.quadraticCurveTo(cx - perpX, (petalBaseY + tipY) / 2, cx, petalBaseY);
      ctx.closePath();
      ctx.fill();
    }
    // Base/stem.
    ctx.lineWidth = w * 0.02;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, petalBaseY);
    ctx.quadraticCurveTo(cx - w * 0.04, h * 0.84, cx, h * 0.94);
    ctx.stroke();
  });

  // Arrow rising through the bloom's centre, echoing the arrow symbol.
  withGlowFill(ctx, color, w * 0.03, 0.7, () => {
    ctx.lineWidth = w * 0.012;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.86);
    ctx.lineTo(cx, h * 0.16);
    ctx.stroke();
    // Arrowhead at the top, rising above the petals.
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.08);
    ctx.lineTo(cx - w * 0.04, h * 0.18);
    ctx.lineTo(cx + w * 0.04, h * 0.18);
    ctx.closePath();
    ctx.fill();
    // Fletching near the base.
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.86);
    ctx.lineTo(cx - w * 0.05, h * 0.8);
    ctx.moveTo(cx, h * 0.86);
    ctx.lineTo(cx + w * 0.05, h * 0.8);
    ctx.stroke();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Ashlesha: the nakshatra's own symbol -- a coiled serpent (Naga),
 * matching both the "hidden power/kundalini" reading and the real compact
 * ring shape its six stars form. See
 * docs/research/ashlesha-asterism-sources.md.
 */
export function makeAshleshaSerpentSilhouette(color: string, w = 280, h = 300): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const cy = h * 0.55;

  auraBackdrop(ctx, cx, cy, w * 0.62, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // Coiled body: a spiral traced with a tapering stroke, thick near the
    // head and thinning toward the tail's centre.
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    const turns = 2.3;
    const maxR = w * 0.34;
    const steps = 120;
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps;
      const t1 = (i + 1) / steps;
      const a0 = t0 * turns * Math.PI * 2;
      const a1 = t1 * turns * Math.PI * 2;
      const r0 = maxR * (1 - t0) + w * 0.02;
      const r1 = maxR * (1 - t1) + w * 0.02;
      ctx.lineWidth = w * (0.06 - 0.045 * t0);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0 * 0.85);
      ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1 * 0.85);
      ctx.stroke();
    }

    // Raised hood/head at the coil's outer end, cobra-like, facing outward.
    const headA = 0;
    const headR = maxR + w * 0.02;
    const hx = cx + Math.cos(headA) * headR;
    const hy = cy + Math.sin(headA) * headR * 0.85;
    ctx.beginPath();
    ctx.moveTo(hx - w * 0.03, hy - h * 0.1);
    ctx.quadraticCurveTo(hx + w * 0.09, hy - h * 0.14, hx + w * 0.1, hy - h * 0.02);
    ctx.quadraticCurveTo(hx + w * 0.1, hy + h * 0.08, hx + w * 0.02, hy + h * 0.06);
    ctx.quadraticCurveTo(hx - w * 0.04, hy + h * 0.02, hx - w * 0.03, hy - h * 0.1);
    ctx.closePath();
    ctx.fill();

    // Small triangular head at the hood's tip.
    ctx.beginPath();
    ctx.moveTo(hx + w * 0.1, hy - h * 0.02);
    ctx.lineTo(hx + w * 0.19, hy - h * 0.01);
    ctx.lineTo(hx + w * 0.1, hy + h * 0.04);
    ctx.closePath();
    ctx.fill();
  });

  // Twin eye glints on the hood.
  withGlowFill(ctx, color, w * 0.02, 0.9, () => {
    const headR = w * 0.34 + w * 0.02;
    const hx = cx + headR;
    const hy = cy;
    ctx.beginPath();
    ctx.arc(hx + w * 0.13, hy - h * 0.015, w * 0.012, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Swati: the nakshatra's own symbol -- a young plant shoot bent by the
 * wind (Vayu), matching its single-star (Arcturus) simplicity with a
 * correspondingly simple, single-form figure -- same treatment as Ardra's
 * teardrop. See docs/research/swati-asterism-sources.md.
 */
export function makeSwatiShootSilhouette(color: string, w = 200, h = 300): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const groundY = h * 0.92;

  auraBackdrop(ctx, cx, h * 0.55, w * 0.75, color);

  // Faint wind-streak lines, Vayu's presence, flowing past the shoot.
  withGlowFill(ctx, color, w * 0.03, 0.2, () => {
    ctx.lineWidth = w * 0.008;
    ctx.strokeStyle = color;
    for (const t of [0.28, 0.42, 0.58]) {
      ctx.beginPath();
      ctx.moveTo(w * 0.06, h * t);
      ctx.quadraticCurveTo(w * 0.4, h * (t - 0.04), w * 0.82, h * (t + 0.03));
      ctx.stroke();
    }
  });

  withGlowFill(ctx, color, w * 0.05, 0.65, () => {
    // Stem, curved as if bent by wind from the left.
    ctx.lineWidth = w * 0.035;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, groundY);
    ctx.quadraticCurveTo(cx + w * 0.14, h * 0.6, cx + w * 0.02, h * 0.34);
    ctx.quadraticCurveTo(cx - w * 0.08, h * 0.16, cx + w * 0.12, h * 0.06);
    ctx.stroke();

    // Two young leaves bending off the stem, same wind-swept direction.
    // Leaf 1 (lower).
    const l1x = cx + w * 0.07;
    const l1y = h * 0.56;
    ctx.beginPath();
    ctx.moveTo(l1x, l1y);
    ctx.quadraticCurveTo(l1x + w * 0.22, l1y - h * 0.02, l1x + w * 0.3, l1y - h * 0.12);
    ctx.quadraticCurveTo(l1x + w * 0.16, l1y - h * 0.07, l1x, l1y);
    ctx.closePath();
    ctx.fill();

    // Leaf 2 (upper, smaller).
    const l2x = cx - w * 0.02;
    const l2y = h * 0.24;
    ctx.beginPath();
    ctx.moveTo(l2x, l2y);
    ctx.quadraticCurveTo(l2x + w * 0.18, l2y - h * 0.02, l2x + w * 0.24, l2y - h * 0.1);
    ctx.quadraticCurveTo(l2x + w * 0.12, l2y - h * 0.05, l2x, l2y);
    ctx.closePath();
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Mula: the nakshatra's own symbol -- a tied bundle of roots, matching
 * both "the Root" meaning and the real curved tail-shape asterism it's
 * anchored to. See docs/research/mula-asterism-sources.md.
 */
export function makeMulaRootsSilhouette(color: string, w = 260, h = 320): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const tieY = h * 0.3;

  auraBackdrop(ctx, cx, h * 0.5, w * 0.65, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // A fan of tapering root strands, gathered at a tie point and
    // splaying downward and outward.
    const roots = [-0.32, -0.22, -0.1, 0.02, 0.14, 0.26, 0.36];
    for (const dx of roots) {
      const endX = cx + w * dx * 1.5;
      const endY = h * (0.82 + Math.abs(dx) * 0.25);
      const midX = cx + w * dx * 0.6;
      const midY = h * 0.56;
      ctx.lineWidth = w * (0.045 - Math.abs(dx) * 0.05);
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, tieY);
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();
      // Small root hairs branching off partway down.
      ctx.lineWidth = w * 0.012;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(midX + w * dx * 0.3, midY + h * 0.08);
      ctx.stroke();
    }

    // Tie/knot binding the roots together at the top.
    ctx.beginPath();
    ctx.ellipse(cx, tieY, w * 0.09, h * 0.035, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Shravana: the nakshatra's own symbol -- three footprints in a row
 * (Vishnu's Vamana strides across the three worlds), matching the real
 * three-star line it's anchored to. See
 * docs/research/shravana-asterism-sources.md.
 */
export function makeShravanaFootprintsSilhouette(color: string, w = 340, h = 220): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cy = h * 0.55;

  auraBackdrop(ctx, w / 2, cy, w * 0.6, color);

  function footprint(fx: number, fy: number, mirror: 1 | -1) {
    const s = mirror;
    // Heel + sole, a simple elongated rounded shape.
    ctx.beginPath();
    ctx.ellipse(fx, fy, w * 0.05, h * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Toes, five small dots fanning off the top.
    for (let i = 0; i < 5; i++) {
      const t = i / 4 - 0.5;
      ctx.beginPath();
      ctx.ellipse(fx + s * t * w * 0.06, fy - h * 0.17, w * 0.014, h * 0.022, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  withGlowFill(ctx, color, w * 0.04, 0.62, () => {
    footprint(w * 0.22, cy, 1);
    footprint(w * 0.5, cy - h * 0.06, -1);
    footprint(w * 0.78, cy, 1);
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Dhanishta: the nakshatra's own symbol -- a damaru (hourglass hand-drum),
 * matching the real rhombus/"Job's Coffin" shape its four stars trace.
 * See docs/research/dhanishta-asterism-sources.md.
 */
export function makeDhanishtaDamaruSilhouette(color: string, w = 260, h = 220): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const cy = h / 2;

  auraBackdrop(ctx, cx, cy, w * 0.62, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // Two drum heads (circular discs) joined by a pinched hourglass waist.
    const headR = h * 0.28;
    const leftCx = cx - w * 0.22;
    const rightCx = cx + w * 0.22;
    ctx.beginPath();
    ctx.arc(leftCx, cy, headR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightCx, cy, headR, 0, Math.PI * 2);
    ctx.fill();
    // Hourglass body connecting the two heads, pinched at the centre.
    ctx.beginPath();
    ctx.moveTo(leftCx, cy - headR * 0.7);
    ctx.quadraticCurveTo(cx, cy - h * 0.06, rightCx, cy - headR * 0.7);
    ctx.lineTo(rightCx, cy + headR * 0.7);
    ctx.quadraticCurveTo(cx, cy + h * 0.06, leftCx, cy + headR * 0.7);
    ctx.closePath();
    ctx.fill();

    // Lacing strands criss-crossing the waist, traditional damaru detail.
    ctx.lineWidth = w * 0.008;
    ctx.strokeStyle = color;
    for (const t of [-0.5, 0, 0.5]) {
      ctx.beginPath();
      ctx.moveTo(leftCx + w * 0.06, cy + t * headR * 0.9);
      ctx.lineTo(rightCx - w * 0.06, cy - t * headR * 0.9);
      ctx.stroke();
    }

    // Two striking cords with beads, hanging from the waist.
    ctx.lineWidth = w * 0.01;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx - w * 0.08, cy + h * 0.22, cx + w * 0.02, cy + h * 0.36);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + w * 0.02, cy + h * 0.38, w * 0.018, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Shatabhisha: the nakshatra's own symbol -- an empty circle, evoking
 * "a hundred stars/healers" and Varuna's vast cosmic waters, matching its
 * single-star simplicity with a correspondingly simple, single-form
 * figure. See docs/research/shatabhisha-asterism-sources.md.
 */
export function makeShatabhishaCircleSilhouette(color: string, w = 260, h = 260): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const cy = h / 2;
  const outerR = w * 0.38;

  auraBackdrop(ctx, cx, cy, w * 0.7, color);

  // The outer ring itself -- an "empty circle," deliberately hollow.
  withGlowFill(ctx, color, w * 0.05, 0.65, () => {
    ctx.lineWidth = w * 0.028;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.stroke();
  });

  // A scatter of ~100 small dots along and just inside/outside the ring,
  // "a hundred stars" -- deterministic placement (not Math.random) so the
  // texture is stable across re-renders.
  withGlowFill(ctx, color, w * 0.015, 0.8, () => {
    const dotCount = 100;
    for (let i = 0; i < dotCount; i++) {
      const a = (i / dotCount) * Math.PI * 2;
      // Pseudo-random-looking radial jitter from a deterministic
      // trig-based sequence, so dots feel scattered rather than perfectly
      // ringed without needing an RNG.
      const jitter = Math.sin(i * 12.9898) * 0.5 + 0.5;
      const r = outerR * (0.82 + jitter * 0.36);
      const dotR = w * (0.006 + 0.006 * (1 - jitter));
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Purva Bhadrapada: the nakshatra's own symbol -- the front two legs of a
 * funeral cot/bier, matching the real two-star line it's anchored to.
 * See docs/research/purva-bhadrapada-asterism-sources.md.
 */
export function makeBhadrapadaFrontLegsSilhouette(color: string, w = 300, h = 240): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cy = h * 0.32;

  auraBackdrop(ctx, w / 2, h * 0.5, w * 0.62, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // Cot frame's front cross-rail.
    ctx.lineWidth = w * 0.022;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(w * 0.22, cy);
    ctx.lineTo(w * 0.78, cy);
    ctx.stroke();
    // Two front legs, straight and tapered, ending in simple feet.
    for (const lx of [w * 0.26, w * 0.74]) {
      ctx.beginPath();
      ctx.moveTo(lx, cy);
      ctx.lineTo(lx, h * 0.86);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(lx, h * 0.88, w * 0.035, h * 0.02, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // A few woven cross-strands between the legs, cot-frame detail.
    ctx.lineWidth = w * 0.008;
    for (const t of [0.35, 0.55]) {
      ctx.beginPath();
      ctx.moveTo(w * 0.26, cy + h * t * 0.5);
      ctx.lineTo(w * 0.74, cy + h * t * 0.5 - h * 0.03);
      ctx.stroke();
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Uttara Bhadrapada: the nakshatra's own symbol -- the back two legs of
 * the same funeral cot, deliberately matching Purva Bhadrapada's
 * placeholder motif (front vs. back legs of one cot) so the two read as a
 * related pair, plus a faint serpent coil (Ahir Budhnya). See
 * docs/research/uttara-bhadrapada-asterism-sources.md.
 */
export function makeBhadrapadaBackLegsSilhouette(color: string, w = 300, h = 240): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cy = h * 0.32;

  auraBackdrop(ctx, w / 2, h * 0.5, w * 0.62, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // Cot frame's back cross-rail, slightly taller/further than the
    // front-legs figure to read as "the other end" of the same cot.
    ctx.lineWidth = w * 0.022;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, cy);
    ctx.lineTo(w * 0.8, cy);
    ctx.stroke();
    // Two back legs.
    for (const lx of [w * 0.24, w * 0.76]) {
      ctx.beginPath();
      ctx.moveTo(lx, cy);
      ctx.lineTo(lx, h * 0.82);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(lx, h * 0.84, w * 0.035, h * 0.02, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // A faint serpent coiling around the base, Ahir Budhnya, "serpent of
  // the deep waters" -- kept subtle so it doesn't compete with the
  // cot-legs' own clarity.
  withGlowFill(ctx, color, w * 0.03, 0.3, () => {
    ctx.lineWidth = w * 0.015;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(w * 0.15, h * 0.86);
    ctx.quadraticCurveTo(w * 0.35, h * 0.94, w * 0.5, h * 0.86);
    ctx.quadraticCurveTo(w * 0.65, h * 0.78, w * 0.85, h * 0.86);
    ctx.stroke();
    // Small serpent head at one end.
    ctx.beginPath();
    ctx.arc(w * 0.87, h * 0.86, w * 0.02, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Revati: the nakshatra's own symbol -- a swimming fish, matching the
 * real two-star line (yogatara to its documented near neighbour) as a
 * simple head-to-tail shape. See docs/research/revati-asterism-sources.md.
 */
export function makeRevatiFishSilhouette(color: string, w = 320, h = 200): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cy = h * 0.52;

  auraBackdrop(ctx, w / 2, cy, w * 0.55, color);

  withGlowFill(ctx, color, w * 0.04, 0.62, () => {
    // Body, a simple tapered fish silhouette swimming right.
    ctx.beginPath();
    ctx.moveTo(w * 0.2, cy);
    ctx.quadraticCurveTo(w * 0.35, cy - h * 0.22, w * 0.62, cy - h * 0.1);
    ctx.quadraticCurveTo(w * 0.74, cy - h * 0.04, w * 0.78, cy);
    ctx.quadraticCurveTo(w * 0.74, cy + h * 0.04, w * 0.62, cy + h * 0.1);
    ctx.quadraticCurveTo(w * 0.35, cy + h * 0.22, w * 0.2, cy);
    ctx.closePath();
    ctx.fill();

    // Tail fin, forked.
    ctx.beginPath();
    ctx.moveTo(w * 0.2, cy);
    ctx.lineTo(w * 0.04, cy - h * 0.14);
    ctx.lineTo(w * 0.12, cy);
    ctx.lineTo(w * 0.04, cy + h * 0.14);
    ctx.closePath();
    ctx.fill();

    // Dorsal fin.
    ctx.beginPath();
    ctx.moveTo(w * 0.42, cy - h * 0.14);
    ctx.quadraticCurveTo(w * 0.5, cy - h * 0.3, w * 0.58, cy - h * 0.14);
    ctx.closePath();
    ctx.fill();
  });

  // Eye.
  withGlowFill(ctx, color, w * 0.015, 0.9, () => {
    ctx.beginPath();
    ctx.arc(w * 0.68, cy - h * 0.02, w * 0.012, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Hasta: the nakshatra's own symbol -- an open hand, matching both the
 * "golden hands" (hiranya-hasta) Vedic imagery and the real five-star
 * Corvus cluster it's anchored to. See docs/research/hasta-asterism-sources.md.
 */
export function makeHastaHandSilhouette(color: string, w = 260, h = 300): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const palmY = h * 0.62;

  auraBackdrop(ctx, cx, h * 0.5, w * 0.68, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // Palm, a rounded rectangle.
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.2, palmY);
    ctx.quadraticCurveTo(cx - w * 0.24, h * 0.86, cx - w * 0.12, h * 0.92);
    ctx.quadraticCurveTo(cx, h * 0.96, cx + w * 0.12, h * 0.92);
    ctx.quadraticCurveTo(cx + w * 0.24, h * 0.86, cx + w * 0.2, palmY);
    ctx.closePath();
    ctx.fill();

    // Five fingers, splayed fan, tapering cylinders from the palm's top edge.
    const fingers: Array<[number, number, number]> = [
      [-0.34, 0.24, -0.12], // thumb, shorter, angled out
      [-0.16, 0.34, -0.03],
      [0, 0.38, 0],
      [0.16, 0.34, 0.03],
      [0.3, 0.27, 0.1],
    ];
    for (const [dx, len, tilt] of fingers) {
      const baseX = cx + w * dx * 0.62;
      const tipX = baseX + w * tilt;
      const tipY = palmY - h * len;
      ctx.beginPath();
      ctx.moveTo(baseX - w * 0.028, palmY);
      ctx.quadraticCurveTo(baseX - w * 0.03, palmY - h * len * 0.6, tipX - w * 0.018, tipY);
      ctx.quadraticCurveTo(tipX, tipY - h * 0.015, tipX + w * 0.018, tipY);
      ctx.quadraticCurveTo(baseX + w * 0.03, palmY - h * len * 0.6, baseX + w * 0.028, palmY);
      ctx.closePath();
      ctx.fill();
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Chitra: the nakshatra's own symbol -- a bright jewel/pearl suspended on
 * a cord, matching its single-star (Spica) simplicity with a
 * correspondingly simple, single-form figure -- same treatment as Ardra's
 * teardrop and Shatabhisha's ring. See
 * docs/research/chitra-asterism-sources.md.
 */
export function makeChitraJewelSilhouette(color: string, w = 220, h = 300): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const jewelCy = h * 0.58;
  const jewelR = w * 0.24;

  auraBackdrop(ctx, cx, jewelCy, w * 0.65, color);

  withGlowFill(ctx, color, w * 0.05, 0.6, () => {
    // Cord, from the top edge down to the jewel.
    ctx.lineWidth = w * 0.014;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.06);
    ctx.lineTo(cx, jewelCy - jewelR);
    ctx.stroke();

    // A faceted round jewel -- octagon outline, since a perfect circle
    // reads as flat while facet edges read as "cut gem."
    const facets = 8;
    ctx.beginPath();
    for (let i = 0; i < facets; i++) {
      const a = (i / facets) * Math.PI * 2 - Math.PI / 2;
      const px = cx + Math.cos(a) * jewelR;
      const py = jewelCy + Math.sin(a) * jewelR;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  });

  // Facet lines and a bright central glint.
  withGlowFill(ctx, color, w * 0.015, 0.9, () => {
    ctx.lineWidth = w * 0.006;
    ctx.strokeStyle = color;
    for (const a of [0.2, 0.9, 1.7]) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * jewelR * 0.15, jewelCy + Math.sin(a) * jewelR * 0.15);
      ctx.lineTo(cx + Math.cos(a) * jewelR * 0.92, jewelCy + Math.sin(a) * jewelR * 0.92);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx - jewelR * 0.25, jewelCy - jewelR * 0.25, w * 0.02, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Vishakha: the nakshatra's own symbol -- a decorated triumphal arch/
 * gateway, matching the real four-star quadrilateral it's anchored to.
 * See docs/research/vishakha-asterism-sources.md.
 */
export function makeVishakhaArchSilhouette(color: string, w = 320, h = 260): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const groundY = h * 0.88;

  auraBackdrop(ctx, w / 2, h * 0.5, w * 0.62, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // Two side pillars.
    for (const px of [w * 0.22, w * 0.78]) {
      ctx.beginPath();
      ctx.moveTo(px - w * 0.045, h * 0.2);
      ctx.lineTo(px + w * 0.045, h * 0.2);
      ctx.lineTo(px + w * 0.05, groundY);
      ctx.lineTo(px - w * 0.05, groundY);
      ctx.closePath();
      ctx.fill();
    }
    // Arch spanning the top, a simple rounded lintel.
    ctx.beginPath();
    ctx.moveTo(w * 0.17, h * 0.22);
    ctx.quadraticCurveTo(w * 0.5, h * 0.04, w * 0.83, h * 0.22);
    ctx.quadraticCurveTo(w * 0.5, h * 0.13, w * 0.17, h * 0.22);
    ctx.closePath();
    ctx.fill();
    // Leafy garland decoration along the arch, small scallops.
    for (let i = 0; i < 9; i++) {
      const t = i / 8;
      const ax = w * 0.17 + t * (w * 0.66);
      const ay = h * (0.22 - Math.sin(t * Math.PI) * 0.16);
      ctx.beginPath();
      ctx.arc(ax, ay - h * 0.02, w * 0.02, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Purva Ashadha: the nakshatra's own symbol -- a hand-held fan, matching
 * the real three-star line (the Archer's bow) it's anchored to. See
 * docs/research/purva-ashadha-asterism-sources.md.
 */
export function makePurvaAshadhaFanSilhouette(color: string, w = 280, h = 300): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;
  const pivotY = h * 0.86;

  auraBackdrop(ctx, cx, h * 0.5, w * 0.65, color);

  withGlowFill(ctx, color, w * 0.04, 0.6, () => {
    // Handle.
    ctx.lineWidth = w * 0.035;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, pivotY);
    ctx.lineTo(cx, h * 0.98);
    ctx.stroke();

    // Fan ribs, splaying upward from the pivot -- three main ribs (the
    // "three Kaus stars") plus connecting fan material between them.
    const ribs = [-0.62, -0.31, 0, 0.31, 0.62];
    ctx.beginPath();
    ctx.moveTo(cx, pivotY);
    for (const t of ribs) {
      const a = -Math.PI / 2 + t * (Math.PI * 0.42);
      const len = h * 0.72;
      ctx.lineTo(cx + Math.cos(a) * len, pivotY + Math.sin(a) * len);
    }
    ctx.closePath();
    ctx.fill();

    // Rib lines, a touch darker via thin strokes at each rib angle.
    ctx.lineWidth = w * 0.008;
    for (const t of ribs) {
      const a = -Math.PI / 2 + t * (Math.PI * 0.42);
      const len = h * 0.72;
      ctx.beginPath();
      ctx.moveTo(cx, pivotY);
      ctx.lineTo(cx + Math.cos(a) * len, pivotY + Math.sin(a) * len);
      ctx.stroke();
    }
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
