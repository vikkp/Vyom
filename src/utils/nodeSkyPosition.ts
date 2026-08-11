import { Vector3, MathUtils } from "three";
import { STAR_CATALOG } from "../data/starCatalog";
import { raDecToAltAz, altAzToVector3 } from "./astronomy";
import type { City } from "../types/skyViewer";

/**
 * Where a graph node currently sits in the sky, as a unit direction from
 * the observer — for search-to-orient ("look at this nakshatra") and any
 * future feature that needs "what direction is X in right now."
 *
 * A node's sky position isn't fixed data — a nakshatra/Rishi/etc. only has
 * a location once you also know *when* and *from where* you're looking
 * (that's the whole premise of this app), so this is computed live from
 * the current city + date rather than stored anywhere.
 *
 * Looks up every star in STAR_CATALOG sharing this nodeId (a nakshatra
 * asterism can be several stars, e.g. Rohini's five Hyades stars) and
 * averages their directions — the same technique MythicFigureOverlays.tsx
 * uses to place a figure at an asterism's centroid, reused here so "look
 * at Rohini" points at the same spot the ox-cart figure actually sits.
 * Returns null for nodes with no sky anchor at all (pure story/mythology
 * content with no linked star) — there's nothing to orient toward.
 */
export function getNodeSkyDirection(nodeId: string, city: City, date: Date): Vector3 | null {
  const stars = STAR_CATALOG.filter((s) => s.nodeId === nodeId);
  if (stars.length === 0) return null;

  const sum = new Vector3();
  for (const star of stars) {
    const { alt, az } = raDecToAltAz(star.ra, star.dec, city.lat, city.lon, date);
    sum.add(altAzToVector3(alt, az, 1));
  }
  return sum.divideScalar(stars.length).normalize();
}

/** Altitude in degrees (negative = below the horizon) implied by a unit
 * sky direction — cheap to derive from altAzToVector3's own geometry
 * (y = sin(alt) * radius) rather than re-deriving alt/az separately. */
export function altitudeOfDirection(direction: Vector3): number {
  return Math.asin(MathUtils.clamp(direction.y, -1, 1)) * (180 / Math.PI);
}
