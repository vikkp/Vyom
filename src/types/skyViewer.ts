// Data model for the location-based sky viewer (ADR0002). Deliberately
// separate from src/types/celestial.ts (the Dhruva-anchored abstract sky
// module used by the legacy graph view) so that view can keep working
// unchanged as a future secondary "Relationship Map" mode.

export interface City {
  id: string;
  name: string;
  country: string;
  /** Degrees, north-positive. */
  lat: number;
  /** Degrees, east-positive. */
  lon: number;
  group: "India" | "US" | "Europe" | "Australia" | "Asia";
}

export interface SkyCatalogStar {
  /** Unique, e.g. "hip54061" or "dubhe". */
  id: string;
  hip?: number;
  /** Hours [0, 24). */
  ra: number;
  /** Degrees [-90, 90]. */
  dec: number;
  /** Visual magnitude — lower is brighter. */
  mag: number;
  indianName?: string;
  westernName?: string;
  /** Links to a node in src/data/graph.json. */
  nodeId?: string;
  constellation?: "Saptarishi" | "Nakshatra" | string;
}

export interface Asterism {
  id: string;
  name: string;
  /** Ordered star ids, for line drawing between consecutive pairs. */
  starIds: string[];
  nodeId?: string;
}
