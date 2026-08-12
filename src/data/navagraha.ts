import type { NavagrahaId } from "../utils/planetaryPositions";

// ADR0005: the Navagraha, the nine classical "seizers" of Hindu
// astronomy. Unlike every star in starCatalog.ts, these don't have a
// fixed RA/Dec -- src/utils/planetaryPositions.ts computes each one's
// true geocentric position for the app's current date/time, and this
// table supplies everything else: the Indic label (primary, per the
// Indian-first naming convention already used for nakshatra stars), a
// traditional accent color used for both the point and its glow (so
// each Graha reads as visually distinct from a plain white/warm fixed
// star and from each other), and a size multiplier applied on top of a
// normal named star's size. See docs/research/navagraha-sources.md for
// the mythology behind each color/size choice.
export interface NavagrahaDef {
  id: NavagrahaId;
  /**
   * Links to a node in src/data/graph.json. Same id as `id` above for
   * seven of the nine -- Chandra and Guru are the exceptions: those two
   * already existed as nakshatra-presiding-deity nodes ("chandra" presides
   * over Mrigashira, "brihaspati" over Pushya, see graph.json) before this
   * ADR, so rather than creating a second, confusingly-duplicate "this is
   * also the Moon/Jupiter" node, this reuses those existing nodes
   * (upgraded to type "graha") and points at their existing ids.
   */
  nodeId: string;
  indianName: string;
  westernName: string;
  /** Traditional accent color for this Graha's point + glow. */
  color: string;
  /** Multiplier on top of a normal named star's rendered size. */
  sizeScale: number;
}

export const NAVAGRAHA: NavagrahaDef[] = [
  // Warm gold -- the solar deity, the brightest object in the sky.
  { id: "surya", nodeId: "surya", indianName: "Surya", westernName: "Sun", color: "#ffcf5c", sizeScale: 2.4 },
  // Cool silver-white -- Chandra, the Moon.
  { id: "chandra", nodeId: "chandra", indianName: "Chandra", westernName: "Moon", color: "#eaf2ff", sizeScale: 2.2 },
  // Red -- Mangala/Kuja, the martial planet; matches its real observed color.
  { id: "mangala", nodeId: "mangala", indianName: "Mangala", westernName: "Mars", color: "#ff5a3c", sizeScale: 1.4 },
  // Pale green -- Budha, associated with Vishnu's earthly avatars and mercury/quicksilver.
  { id: "budha", nodeId: "budha", indianName: "Budha", westernName: "Mercury", color: "#9fe6b0", sizeScale: 1.25 },
  // Warm amber -- Guru/Brihaspati, preceptor of the Devas, the "great
  // benefic." nodeId is "brihaspati", not "guru" -- see the nodeId doc
  // comment above.
  { id: "guru", nodeId: "brihaspati", indianName: "Guru", westernName: "Jupiter", color: "#ffb14d", sizeScale: 1.6 },
  // Bright warm white -- Shukra, associated with beauty and the brightest planet.
  { id: "shukra", nodeId: "shukra", indianName: "Shukra", westernName: "Venus", color: "#fff3c9", sizeScale: 1.8 },
  // Ashen/pale -- Shani, associated with discipline, iron, and a dark/heavy nature.
  { id: "shani", nodeId: "shani", indianName: "Shani", westernName: "Saturn", color: "#b7a888", sizeScale: 1.35 },
  // Smoky violet -- Rahu, the serpent's severed head; shadow/illusion.
  { id: "rahu", nodeId: "rahu", indianName: "Rahu", westernName: "Moon's north node", color: "#8a76b0", sizeScale: 1.3 },
  // Darker smoky violet -- Ketu, the serpent's severed tail; the same shadow family, dimmer/more inward.
  { id: "ketu", nodeId: "ketu", indianName: "Ketu", westernName: "Moon's south node", color: "#6b5a82", sizeScale: 1.3 },
];
