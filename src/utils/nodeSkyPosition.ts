import { Vector3, MathUtils } from "three";
import { STAR_CATALOG } from "../data/starCatalog";
import { raDecToAltAz, altAzToVector3 } from "./astronomy";
import { galacticToEquatorial } from "./galactic";
import { computeNavagrahaPositions } from "./planetaryPositions";
import { NAVAGRAHA } from "../data/navagraha";
import type { City } from "../types/skyViewer";

const NAVAGRAHA_BY_NODE_ID = new Map(NAVAGRAHA.map((g) => [g.nodeId, g]));

/**
 * Where a graph node currently sits in the sky, as a unit direction from
 * the observer — for search-to-orient ("look at this nakshatra") and any
 * future feature that needs "what direction is X in right now."
 *
 * A node's sky position isn't fixed data — a nakshatra/Rishi/etc. only has
 * a location once you also know *when* and *from where* you're looking
 * (that's the whole premise of this app), so this is computed live from
 * the current city + date rather than stored anywhere. Three sources are
 * tried in turn, since "where is this node" means something different
 * depending on what kind of object it is:
 *
 * 1. **Fixed stars** (STAR_CATALOG) — covers the 27 Nakshatras, the 7
 *    star-represented Saptarishi, and Dhruva Tārā. Looks up every star
 *    sharing this nodeId (a nakshatra asterism can be several stars, e.g.
 *    Rohini's five Hyades stars) and averages their directions — the same
 *    technique MythicFigureOverlays.tsx uses to place a figure at an
 *    asterism's centroid, reused here so "look at Rohini" points at the
 *    same spot the ox-cart figure actually sits.
 * 2. **Navagraha** (ADR0008) — these have no fixed RA/Dec (unlike every
 *    star above), so their direction is computed fresh from the current
 *    date via the same computeNavagrahaPositions() NavagrahaField.tsx
 *    already uses to render them, rather than duplicating a second
 *    position formula.
 * 3. **Akash Ganga** (ADR0008) — a special case, not a point object at
 *    all: "look at Akash Ganga" resolves to the galactic center (l=0,
 *    b=0), the same brightest/most-recognizable point AkashGanga.tsx
 *    anchors its own label to.
 *
 * Returns null for nodes with no sky anchor at all (pure story/mythology
 * content with no linked star, Graha, or special case) — there's nothing
 * to orient toward.
 */
export function getNodeSkyDirection(nodeId: string, city: City, date: Date): Vector3 | null {
  const stars = STAR_CATALOG.filter((s) => s.nodeId === nodeId);
  if (stars.length > 0) {
    const sum = new Vector3();
    for (const star of stars) {
      const { alt, az } = raDecToAltAz(star.ra, star.dec, city.lat, city.lon, date);
      sum.add(altAzToVector3(alt, az, 1));
    }
    return sum.divideScalar(stars.length).normalize();
  }

  const graha = NAVAGRAHA_BY_NODE_ID.get(nodeId);
  if (graha) {
    const { ra, dec } = computeNavagrahaPositions(date)[graha.id];
    const { alt, az } = raDecToAltAz(ra, dec, city.lat, city.lon, date);
    return altAzToVector3(alt, az, 1);
  }

  if (nodeId === "akash-ganga") {
    const { ra, dec } = galacticToEquatorial(0, 0);
    const { alt, az } = raDecToAltAz(ra, dec, city.lat, city.lon, date);
    return altAzToVector3(alt, az, 1);
  }

  return null;
}

/** Altitude in degrees (negative = below the horizon) implied by a unit
 * sky direction — cheap to derive from altAzToVector3's own geometry
 * (y = sin(alt) * radius) rather than re-deriving alt/az separately. */
export function altitudeOfDirection(direction: Vector3): number {
  return Math.asin(MathUtils.clamp(direction.y, -1, 1)) * (180 / Math.PI);
}
