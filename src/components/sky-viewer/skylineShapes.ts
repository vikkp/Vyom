// ADR0003: hand-authored, simplified silhouette primitives for city
// skylines. These are deliberately flat/iconic "silhouette icon" style,
// not detailed renderings — there's no image-generation tool available
// in this environment, and at the scale these render on the horizon
// band, simplified recognizable shapes read better than fussy detail
// anyway. Each shape function draws in canvas pixel space, anchored at
// (cx, groundY) with groundY being the baseline the shape sits on and
// scale controlling its overall size.

type Ctx = CanvasRenderingContext2D;

function poly(ctx: Ctx, points: Array<[number, number]>) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function rect(ctx: Ctx, x: number, y: number, w: number, h: number) {
  ctx.fillRect(x, y, w, h);
}

// --- India ---------------------------------------------------------

export function archMonument(ctx: Ctx, cx: number, gY: number, s: number) {
  // India Gate / Arc de Triomphe style: two piers, flat arch opening, slab top.
  const w = 70 * s;
  const h = 100 * s;
  const pier = 16 * s;
  rect(ctx, cx - w / 2, gY - h, pier, h);
  rect(ctx, cx + w / 2 - pier, gY - h, pier, h);
  rect(ctx, cx - w / 2, gY - h, w, 14 * s);
  // arch opening curve (drawn as negative space would need compositing;
  // simplified here as a solid slab silhouette, which reads fine at
  // horizon-band scale).
}

export function minaretTower(ctx: Ctx, cx: number, gY: number, s: number) {
  // Qutub Minar: tapering fluted tower, balcony rings, small finial.
  const h = 150 * s;
  const baseW = 26 * s;
  const topW = 14 * s;
  poly(ctx, [
    [cx - baseW / 2, gY],
    [cx + baseW / 2, gY],
    [cx + topW / 2, gY - h],
    [cx - topW / 2, gY - h],
  ]);
  for (const t of [0.35, 0.68]) {
    const y = gY - h * t;
    const w = baseW - (baseW - topW) * t + 6 * s;
    rect(ctx, cx - w / 2, y, w, 4 * s);
  }
  poly(ctx, [
    [cx - 3 * s, gY - h],
    [cx + 3 * s, gY - h],
    [cx, gY - h - 10 * s],
  ]);
}

export function lotusDome(ctx: Ctx, cx: number, gY: number, s: number) {
  // Lotus Temple: cluster of upward petal triangles.
  const h = 55 * s;
  const spread = 60 * s;
  const petals = 5;
  for (let i = 0; i < petals; i++) {
    const t = i / (petals - 1) - 0.5;
    const px = cx + t * spread;
    const petalH = h * (1 - Math.abs(t) * 0.55);
    poly(ctx, [
      [px - 12 * s, gY],
      [px + 12 * s, gY],
      [px, gY - petalH],
    ]);
  }
}

export function gatewayArchIndia(ctx: Ctx, cx: number, gY: number, s: number) {
  // Gateway of India: onion-domed archway with corner turrets.
  const w = 60 * s;
  const h = 80 * s;
  rect(ctx, cx - w / 2, gY - h, w, h);
  rect(ctx, cx - w / 2 + 8 * s, gY - h + 10 * s, w - 16 * s, h - 10 * s);
  ctx.beginPath();
  ctx.arc(cx, gY - h, 10 * s, Math.PI, 0);
  ctx.fill();
  for (const dx of [-w / 2, w / 2]) {
    rect(ctx, cx + dx - 3 * s, gY - h - 12 * s, 6 * s, 14 * s);
    ctx.beginPath();
    ctx.arc(cx + dx, gY - h - 12 * s, 5 * s, Math.PI, 0);
    ctx.fill();
  }
}

export function domedMemorial(ctx: Ctx, cx: number, gY: number, s: number) {
  // Victoria Memorial: central dome on a drum + four corner turret domes.
  const w = 110 * s;
  const h = 55 * s;
  rect(ctx, cx - w / 2, gY - h, w, h);
  ctx.beginPath();
  ctx.arc(cx, gY - h, w * 0.22, Math.PI, 0);
  ctx.fill();
  rect(ctx, cx - w * 0.1, gY - h - w * 0.1, w * 0.2, w * 0.12);
  for (const dx of [-w * 0.42, w * 0.42]) {
    ctx.beginPath();
    ctx.arc(cx + dx, gY - h, w * 0.08, Math.PI, 0);
    ctx.fill();
    rect(ctx, cx + dx - w * 0.02, gY - h - 4 * s, w * 0.04, 6 * s);
  }
}

export function suspensionBridge(ctx: Ctx, cx: number, gY: number, s: number) {
  // Howrah-style cantilever/truss bridge: two tower piers + lattice deck.
  const span = 160 * s;
  const towerH = 60 * s;
  const deckY = gY - 20 * s;
  rect(ctx, cx - span / 2, deckY, span, 6 * s);
  for (const dx of [-span / 2 + 14 * s, span / 2 - 14 * s]) {
    rect(ctx, cx + dx - 5 * s, gY - towerH, 10 * s, towerH);
    rect(ctx, cx + dx - 16 * s, gY - towerH * 0.55, 32 * s, 4 * s);
  }
  ctx.lineWidth = 1.5 * s;
  ctx.strokeStyle = ctx.fillStyle as string;
  for (let x = -span / 2 + 20 * s; x < span / 2 - 20 * s; x += 14 * s) {
    ctx.beginPath();
    ctx.moveTo(cx + x, deckY);
    ctx.lineTo(cx + x + 10 * s, deckY - 16 * s);
    ctx.stroke();
  }
}

export function templeGopuram(ctx: Ctx, cx: number, gY: number, s: number) {
  // South Indian gopuram: tapering stepped pyramid tower.
  const h = 95 * s;
  const baseW = 46 * s;
  const tiers = 6;
  for (let i = 0; i < tiers; i++) {
    const t0 = i / tiers;
    const t1 = (i + 1) / tiers;
    const w0 = baseW * (1 - t0 * 0.82);
    const w1 = baseW * (1 - t1 * 0.82);
    poly(ctx, [
      [cx - w0 / 2, gY - h * t0],
      [cx + w0 / 2, gY - h * t0],
      [cx + w1 / 2, gY - h * t1],
      [cx - w1 / 2, gY - h * t1],
    ]);
  }
}

export function shikharaSpire(ctx: Ctx, cx: number, gY: number, s: number) {
  // North Indian temple spire: gently curved beehive tower.
  const h = 70 * s;
  const w = 30 * s;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, gY);
  ctx.quadraticCurveTo(cx - w * 0.32, gY - h * 0.55, cx, gY - h);
  ctx.quadraticCurveTo(cx + w * 0.32, gY - h * 0.55, cx + w / 2, gY);
  ctx.closePath();
  ctx.fill();
  rect(ctx, cx - 2 * s, gY - h - 6 * s, 4 * s, 8 * s);
}

export function ghatSteps(ctx: Ctx, x0: number, x1: number, gY: number, s: number) {
  // Varanasi riverbank ghats: stacked stepped terraces.
  const steps = 5;
  const h = 26 * s;
  for (let i = 0; i < steps; i++) {
    const y = gY - (i * h) / steps;
    rect(ctx, x0, y - h / steps, x1 - x0, h / steps + 1);
  }
}

export function boatSilhouette(ctx: Ctx, cx: number, gY: number, s: number) {
  const w = 26 * s;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, gY);
  ctx.quadraticCurveTo(cx, gY + 5 * s, cx + w / 2, gY);
  ctx.lineTo(cx + w / 2 - 4 * s, gY - 3 * s);
  ctx.lineTo(cx - w / 2 + 4 * s, gY - 3 * s);
  ctx.closePath();
  ctx.fill();
  rect(ctx, cx - 1 * s, gY - 14 * s, 2 * s, 12 * s);
}

export function lighthouseTower(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 70 * s;
  poly(ctx, [
    [cx - 12 * s, gY],
    [cx + 12 * s, gY],
    [cx + 7 * s, gY - h],
    [cx - 7 * s, gY - h],
  ]);
  rect(ctx, cx - 9 * s, gY - h - 10 * s, 18 * s, 10 * s);
  poly(ctx, [
    [cx - 9 * s, gY - h - 10 * s],
    [cx + 9 * s, gY - h - 10 * s],
    [cx, gY - h - 20 * s],
  ]);
}

export function vidhanaSoudhaDome(ctx: Ctx, cx: number, gY: number, s: number) {
  const w = 130 * s;
  const h = 40 * s;
  rect(ctx, cx - w / 2, gY - h, w, h);
  for (let x = -w / 2 + 6 * s; x < w / 2 - 3 * s; x += 10 * s) {
    rect(ctx, cx + x, gY - h - 6 * s, 5 * s, h + 6 * s);
  }
  ctx.beginPath();
  ctx.arc(cx, gY - h - 6 * s, w * 0.14, Math.PI, 0);
  ctx.fill();
}

// --- Americas --------------------------------------------------------

export function taperedSkyscraperSpire(ctx: Ctx, cx: number, gY: number, s: number) {
  // Empire State / Chrysler style art-deco setback tower with spire.
  const h = 150 * s;
  let w = 44 * s;
  let y = gY;
  const tiers = 5;
  for (let i = 0; i < tiers; i++) {
    const th = (h * 0.75) / tiers;
    rect(ctx, cx - w / 2, y - th, w, th);
    y -= th;
    w *= 0.78;
  }
  poly(ctx, [
    [cx - 3 * s, y],
    [cx + 3 * s, y],
    [cx, y - h * 0.22],
  ]);
}

export function ladyLibertyStatue(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 60 * s;
  rect(ctx, cx - 10 * s, gY - h * 0.2, 20 * s, h * 0.2);
  poly(ctx, [
    [cx - 8 * s, gY - h * 0.2],
    [cx + 8 * s, gY - h * 0.2],
    [cx + 6 * s, gY - h * 0.75],
    [cx - 6 * s, gY - h * 0.75],
  ]);
  ctx.beginPath();
  ctx.arc(cx, gY - h * 0.8, 5 * s, 0, Math.PI * 2);
  ctx.fill();
  rect(ctx, cx + 5 * s, gY - h * 0.95, 3 * s, h * 0.3);
  poly(ctx, [
    [cx + 3 * s, gY - h * 0.95],
    [cx + 10 * s, gY - h * 0.95],
    [cx + 6.5 * s, gY - h],
  ]);
}

export function transAmericaPyramid(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 130 * s;
  poly(ctx, [
    [cx - 30 * s, gY],
    [cx + 30 * s, gY],
    [cx + 3 * s, gY - h],
    [cx - 3 * s, gY - h],
  ]);
}

export function willisTowerStepped(ctx: Ctx, cx: number, gY: number, s: number) {
  const segs: Array<[number, number]> = [
    [50 * s, 70 * s],
    [36 * s, 30 * s],
    [24 * s, 25 * s],
    [16 * s, 20 * s],
  ];
  let y = gY;
  for (const [w, h] of segs) {
    rect(ctx, cx - w / 2, y - h, w, h);
    y -= h;
  }
  rect(ctx, cx - 1 * s, y - 14 * s, 2 * s, 14 * s);
  rect(ctx, cx + 6 * s, y - 10 * s, 2 * s, 10 * s);
}

export function archBridge(ctx: Ctx, cx: number, gY: number, s: number) {
  // Sydney Harbour Bridge / Golden Gate steel-arch style.
  const span = 170 * s;
  const archH = 50 * s;
  const deckY = gY - 14 * s;
  ctx.beginPath();
  ctx.moveTo(cx - span / 2, deckY);
  ctx.quadraticCurveTo(cx, deckY - archH, cx + span / 2, deckY);
  ctx.lineTo(cx + span / 2, deckY + 6 * s);
  ctx.quadraticCurveTo(cx, deckY - archH + 6 * s, cx - span / 2, deckY + 6 * s);
  ctx.closePath();
  ctx.fill();
  rect(ctx, cx - span / 2, deckY + 6 * s, span, 5 * s);
}

// --- Europe ------------------------------------------------------------

export function clockTower(ctx: Ctx, cx: number, gY: number, s: number) {
  // Big Ben style.
  const h = 120 * s;
  const w = 22 * s;
  rect(ctx, cx - w / 2, gY - h, w, h);
  ctx.beginPath();
  ctx.arc(cx, gY - h * 0.78, w * 0.32, 0, Math.PI * 2);
  ctx.fill();
  poly(ctx, [
    [cx - w / 2 - 2 * s, gY - h],
    [cx + w / 2 + 2 * s, gY - h],
    [cx, gY - h - 22 * s],
  ]);
}

export function ferrisWheel(ctx: Ctx, cx: number, gY: number, s: number) {
  const r = 45 * s;
  ctx.lineWidth = 3 * s;
  ctx.strokeStyle = ctx.fillStyle as string;
  ctx.beginPath();
  ctx.arc(cx, gY - r, r, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, gY - r);
    ctx.lineTo(cx + Math.cos(a) * r, gY - r + Math.sin(a) * r);
    ctx.stroke();
  }
  poly(ctx, [
    [cx - 8 * s, gY],
    [cx + 8 * s, gY],
    [cx + 2 * s, gY - r],
    [cx - 2 * s, gY - r],
  ]);
}

export function towerBridgeTwin(ctx: Ctx, cx: number, gY: number, s: number) {
  const towerH = 75 * s;
  const gap = 46 * s;
  for (const dx of [-gap / 2, gap / 2]) {
    rect(ctx, cx + dx - 10 * s, gY - towerH, 20 * s, towerH);
    poly(ctx, [
      [cx + dx - 12 * s, gY - towerH],
      [cx + dx + 12 * s, gY - towerH],
      [cx + dx, gY - towerH - 12 * s],
    ]);
  }
  rect(ctx, cx - gap / 2, gY - towerH * 0.55, gap, 6 * s);
  rect(ctx, cx - gap / 2 - 12 * s, gY - 8 * s, gap + 24 * s, 8 * s);
}

export function eiffelTower(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 140 * s;
  const baseW = 60 * s;
  ctx.beginPath();
  ctx.moveTo(cx - baseW / 2, gY);
  ctx.lineTo(cx - baseW * 0.18, gY - h * 0.45);
  ctx.lineTo(cx - baseW * 0.06, gY - h * 0.85);
  ctx.lineTo(cx, gY - h);
  ctx.lineTo(cx + baseW * 0.06, gY - h * 0.85);
  ctx.lineTo(cx + baseW * 0.18, gY - h * 0.45);
  ctx.lineTo(cx + baseW / 2, gY);
  ctx.lineTo(cx + baseW * 0.3, gY);
  ctx.lineTo(cx, gY - h * 0.3);
  ctx.lineTo(cx - baseW * 0.3, gY);
  ctx.closePath();
  ctx.fill();
}

export function domedCathedralTwin(ctx: Ctx, cx: number, gY: number, s: number) {
  const towerH = 80 * s;
  const gap = 30 * s;
  rect(ctx, cx - gap / 2 - 14 * s, gY - towerH * 0.55, gap + 28 * s, towerH * 0.55);
  for (const dx of [-gap / 2 - 7 * s, gap / 2 + 7 * s]) {
    rect(ctx, cx + dx - 10 * s, gY - towerH, 20 * s, towerH);
  }
  ctx.beginPath();
  ctx.arc(cx, gY - towerH * 0.55 - 8 * s, 8 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function operaHouseShells(ctx: Ctx, cx: number, gY: number, s: number) {
  const shells = [0.55, 0.75, 1.0, 0.7];
  let x = cx - 55 * s;
  for (const h of shells) {
    ctx.beginPath();
    ctx.moveTo(x, gY);
    ctx.quadraticCurveTo(x + 16 * s, gY - 45 * s * h, x + 30 * s, gY - 8 * s);
    ctx.quadraticCurveTo(x + 18 * s, gY - 4 * s, x, gY);
    ctx.closePath();
    ctx.fill();
    x += 24 * s;
  }
}

export function goldenCrownTower(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 130 * s;
  rect(ctx, cx - 22 * s, gY - h, 44 * s, h * 0.92);
  poly(ctx, [
    [cx - 22 * s, gY - h * 0.92],
    [cx + 22 * s, gY - h * 0.92],
    [cx + 10 * s, gY - h],
    [cx - 10 * s, gY - h],
  ]);
}

// --- Asia --------------------------------------------------------------

export function sailBuildingLotus(ctx: Ctx, cx: number, gY: number, s: number) {
  // Marina Bay Sands: three curved towers + horizontal deck on top.
  const h = 95 * s;
  for (const dx of [-38 * s, 0, 38 * s]) {
    poly(ctx, [
      [cx + dx - 12 * s, gY],
      [cx + dx + 12 * s, gY],
      [cx + dx + 7 * s, gY - h],
      [cx + dx - 7 * s, gY - h],
    ]);
  }
  rect(ctx, cx - 55 * s, gY - h - 8 * s, 110 * s, 10 * s);
}

export function merlionStatue(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 40 * s;
  poly(ctx, [
    [cx - 14 * s, gY],
    [cx - 4 * s, gY - h * 0.3],
    [cx - 2 * s, gY - h],
    [cx + 6 * s, gY - h * 0.85],
    [cx + 10 * s, gY - h * 0.55],
    [cx + 16 * s, gY - h * 0.5],
    [cx + 8 * s, gY - h * 0.35],
    [cx + 12 * s, gY],
  ]);
}

export function latticeTowerRed(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 120 * s;
  const baseW = 40 * s;
  poly(ctx, [
    [cx - baseW / 2, gY],
    [cx - baseW * 0.1, gY - h * 0.9],
    [cx, gY - h],
    [cx + baseW * 0.1, gY - h * 0.9],
    [cx + baseW / 2, gY],
    [cx + baseW * 0.3, gY],
    [cx, gY - h * 0.55],
    [cx - baseW * 0.3, gY],
  ]);
}

export function mountainSilhouette(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 60 * s;
  const w = 160 * s;
  poly(ctx, [
    [cx - w / 2, gY],
    [cx - w * 0.08, gY - h],
    [cx, gY - h * 0.9],
    [cx + w * 0.08, gY - h],
    [cx + w / 2, gY],
  ]);
}

export function sailBuildingSingle(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 130 * s;
  ctx.beginPath();
  ctx.moveTo(cx - 20 * s, gY);
  ctx.quadraticCurveTo(cx - 30 * s, gY - h * 0.5, cx - 4 * s, gY - h);
  ctx.lineTo(cx + 4 * s, gY - h * 0.98);
  ctx.quadraticCurveTo(cx + 2 * s, gY - h * 0.5, cx + 16 * s, gY);
  ctx.closePath();
  ctx.fill();
}

export function needleTower(ctx: Ctx, cx: number, gY: number, s: number) {
  const h = 190 * s;
  let w = 34 * s;
  let y = gY;
  for (let i = 0; i < 6; i++) {
    const th = h / 7;
    rect(ctx, cx - w / 2, y - th, w, th);
    y -= th;
    w *= 0.72;
  }
  rect(ctx, cx - 1.5 * s, y - h * 0.14, 3 * s, h * 0.14);
}

// --- generic filler ------------------------------------------------------

/** A seeded PRNG so the filler skyline is deterministic per city (no
 * flicker between renders) without needing a shared random module. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A plain rect-per-building comb reads as flat/blocky at a glance. Giving a
// minority of buildings a varied roofline (stepped-back tier, gable peak, or
// a thin antenna) breaks up that "bar chart" silhouette into something that
// reads more like an actual low-rise skyline, without adding enough detail
// to compete with the hero landmarks.
export function genericFillerRow(ctx: Ctx, x0: number, x1: number, gY: number, seed: number, maxH = 34) {
  const rand = mulberry32(seed);
  let x = x0;
  while (x < x1) {
    const w = 10 + rand() * 16;
    const h = (6 + rand() * maxH) * (0.55 + rand() * 0.55);
    const roofRoll = rand();
    rect(ctx, x, gY - h, w, h);
    if (roofRoll > 0.85) {
      // Stepped-back tier.
      const tierW = w * (0.45 + rand() * 0.2);
      const tierH = h * (0.25 + rand() * 0.2);
      rect(ctx, x + (w - tierW) / 2, gY - h - tierH, tierW, tierH);
    } else if (roofRoll > 0.7) {
      // Gable/peaked roof.
      poly(ctx, [
        [x, gY - h],
        [x + w, gY - h],
        [x + w / 2, gY - h - h * 0.22],
      ]);
    } else if (roofRoll > 0.62) {
      // Thin antenna spike.
      rect(ctx, x + w / 2 - 1, gY - h - h * 0.4, 1.5, h * 0.4);
    }
    x += w + 2 + rand() * 4;
  }
}
