import type { GraphNode } from "../types/graph";

// Deterministic spatial layout for the celestial graph, per ADR0001 decision 2:
// Dhruva Tārā is the fixed centre; the 27 Nakshatras + Saptarishi form the
// primary navigable ring around it. Deities sit on a second, wider ring.
// The Dhruva family / story events sit in a separate "earthly" cluster.

export type Position = [number, number, number];

const RING_1_RADIUS = 7; // nakshatras + saptarishi (excluding star-represented ones, below)
const RING_2_RADIUS = 12; // deities (trimurti, adityas, nakshatra deities, progenitors)
const EARTH_CLUSTER_CENTER: Position = [0, -7, -16];
const EARTH_CLUSTER_RADIUS = 4;

// Rishis rendered as real stars in the sky layer (src/components/sky) get
// their position from actual RA/Dec instead of this abstract ring, so they
// aren't excluded here — they're excluded from it, to avoid appearing
// twice. Keep in sync with the rishiIds in src/data/stars.ts.
const STAR_REPRESENTED_IDS = new Set([
  "kratu",
  "pulaha",
  "pulastya",
  "atri",
  "angiras",
  "vashishtha",
  "marichi",
]);

export function computeLayout(nodes: GraphNode[]): Record<string, Position> {
  const positions: Record<string, Position> = {};

  const ring1 = nodes.filter(
    (n) => n.type === "nakshatra" || (n.group === "saptarishi" && !STAR_REPRESENTED_IDS.has(n.id)),
  );
  const ring2 = nodes.filter(
    (n) =>
      n.type === "deity" ||
      (n.type === "sage" && n.group !== "saptarishi" && !STAR_REPRESENTED_IDS.has(n.id)),
  );
  const earthCluster = nodes.filter((n) => n.type === "character" || n.type === "story-event");

  positions["dhruva-tara"] = [0, 0, 0];

  ring1.forEach((n, i) => {
    const angle = (i / ring1.length) * Math.PI * 2;
    positions[n.id] = [Math.cos(angle) * RING_1_RADIUS, 0, Math.sin(angle) * RING_1_RADIUS];
  });

  ring2.forEach((n, i) => {
    const angle = (i / ring2.length) * Math.PI * 2 + Math.PI / ring2.length;
    const y = Math.sin(i * 0.7) * 1.5; // gentle vertical undulation so the ring isn't flat
    positions[n.id] = [Math.cos(angle) * RING_2_RADIUS, y, Math.sin(angle) * RING_2_RADIUS];
  });

  earthCluster.forEach((n, i) => {
    const angle = (i / earthCluster.length) * Math.PI * 2;
    positions[n.id] = [
      EARTH_CLUSTER_CENTER[0] + Math.cos(angle) * EARTH_CLUSTER_RADIUS,
      EARTH_CLUSTER_CENTER[1] + Math.sin(i * 1.3) * 1.2,
      EARTH_CLUSTER_CENTER[2] + Math.sin(angle) * EARTH_CLUSTER_RADIUS,
    ];
  });

  return positions;
}
