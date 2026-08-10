// Real-sky data types for the Saptarishi star map.
// RA is in hours [0, 24), Dec is in degrees [-90, 90] (J2000, approximate —
// fine for a visualization, not for a planetarium-grade ephemeris).

export interface Star {
  id: string;
  /** Traditional Sanskrit rishi name, used as the display label. */
  name: string;
  ra: number;
  dec: number;
  /** Apparent magnitude — lower is brighter. */
  mag: number;
  /** id of the graph node (src/data/graph.json) this star represents. */
  rishiId: string;
  /** Optional colour override; defaults to a cool white/blue-white. */
  color?: string;
}

export interface ConstellationLine {
  id: string;
  /** Star id this segment starts from. */
  from: string;
  /** Star id this segment ends at. */
  to: string;
}
