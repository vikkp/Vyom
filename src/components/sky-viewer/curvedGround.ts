import { CircleGeometry, RingGeometry, type BufferGeometry } from "three";

/**
 * A flat CircleGeometry, radially drooped away from flat using the
 * standard curvature sagitta approximation (drop = distance^2 / (2 *
 * curveRadius)) — the same formula used to describe how far a real
 * horizon "falls away" over distance on a sphere. ADR0003: the ground
 * should feel like the surface of a (stylized, exaggerated) sphere
 * rather than a flat plane, tunable via a single curveRadius constant.
 *
 * Built by displacing the geometry's local Z before it's rotated flat
 * (Horizon.tsx rotates this by -90 deg about X, which maps local Z
 * straight onto world Y — see the rotation math in Horizon.tsx's
 * comments) — so drooping local Z here droops world Y (down) there,
 * with no change needed to the existing rotation/position setup.
 *
 * Vertex normals aren't recomputed: everything using this geometry is
 * rendered with MeshBasicMaterial, which ignores normals entirely (no
 * lighting calculation to get wrong).
 */
function droopZ<T extends BufferGeometry>(geometry: T, curveRadius: number): T {
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const distSq = x * x + y * y;
    const drop = distSq / (2 * curveRadius);
    position.setZ(i, -drop);
  }
  position.needsUpdate = true;
  return geometry;
}

export function makeCurvedGroundGeometry(radius: number, curveRadius: number, segments = 96): CircleGeometry {
  return droopZ(new CircleGeometry(radius, segments), curveRadius);
}

export function makeCurvedRingGeometry(
  innerRadius: number,
  outerRadius: number,
  curveRadius: number,
  segments = 96,
): RingGeometry {
  return droopZ(new RingGeometry(innerRadius, outerRadius, segments), curveRadius);
}
