import { Vector3 } from "three";
import { DOME_RADIUS } from "./constants";

// Minimum world-unit distance kept between any two figures' anchor points
// after decluttering (see declutterPositions below) -- matched to a
// real-art plane's half-diagonal at FIGURE_TARGET_AREA (a portrait plane
// there is ~5.2 x 7.7, half-diagonal ~4.6), with a little headroom so two
// adjacent figures end up legibly apart rather than just barely not
// touching. Both the mythic-figure set (MythicFigureOverlays.tsx) and the
// Rishi portraits (RishiOverlays.tsx) use this same constant/algorithm --
// they share the same target plane area (FIGURE_TARGET_AREA), so the same
// threshold is correct for both.
export const MIN_FIGURE_SEPARATION = 6;

/**
 * Betelgeuse (Ardra) and Meissa (Mrigashira) are genuinely only ~5.5
 * degrees apart in the real sky -- close enough that at DOME_RADIUS their
 * centroid points land under 3 world units apart, well inside either
 * figure's own plane. Real star/centroid positions are never adjusted
 * (see the vyom-dev-workflow skill's "real astronomy is non-negotiable"
 * rule) -- but the illustrative art hovering near an asterism was never
 * meant to sit at the literal centroid pixel-for-pixel either (compare
 * realAnchorFrac, which already shifts art within its own plane for
 * off-centre compositions). This applies the same idea between figures:
 * a few relaxation passes push any pair of figures closer than
 * MIN_FIGURE_SEPARATION apart symmetrically along the line connecting
 * them, then re-normalises each back onto the DOME_RADIUS-1 sphere. Cheap
 * at this figure count (O(n^2) over a few dozen items, a few iterations)
 * and generalises to any future nakshatra pair or Rishi pair that ends up
 * this close.
 *
 * Extracted to a shared module (previously lived only in
 * MythicFigureOverlays.tsx) so RishiOverlays.tsx can reuse the exact same
 * logic on the 7 Saptarishi portraits: a pairwise angular-separation check
 * across all 35 figures (28 nakshatra symbols + 7 Rishis) found the
 * Saptarishi cluster sitting 2.2-5.3 units apart, undeclu­ttered, because
 * only the mythic-figure set ever ran this pass. That overlap used to be
 * an intentional tradeoff (low 0.35 opacity let overlapping portraits
 * blend softly instead of stacking into solid shapes) but the later
 * visual-polish pass raised baseline opacity to 0.7 for both figure sets,
 * which quietly invalidated that reasoning -- at 0.7 opacity, overlapping
 * portraits read as muddy stacked shapes, not a soft blend. Running the
 * same declutter pass on the Rishis (whose real-art plane already solves
 * to the same ~5.2x7.7 target size this threshold was tuned for) restores
 * legibility without touching star positions or opacity.
 */
export function declutterPositions<T>(
  placed: { item: T; position: Vector3 }[],
): { item: T; position: Vector3 }[] {
  const positions = placed.map((p) => p.position.clone());
  const iterations = 4;
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i];
        const b = positions[j];
        const dist = a.distanceTo(b);
        if (dist > 1e-4 && dist < MIN_FIGURE_SEPARATION) {
          const push = (MIN_FIGURE_SEPARATION - dist) / 2;
          const dir = a.clone().sub(b).normalize();
          a.addScaledVector(dir, push);
          b.addScaledVector(dir, -push);
        }
      }
    }
  }
  return placed.map((p, i) => ({
    item: p.item,
    position: positions[i].normalize().multiplyScalar(DOME_RADIUS - 1),
  }));
}
