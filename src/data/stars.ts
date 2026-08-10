import type { Star } from "../types/celestial";

// Real J2000 coordinates for Polaris and the seven stars of Ursa Major /
// the Big Dipper. rishiId points at nodes in src/data/graph.json.
//
// NOTE on the rishi names: the traditional star-to-rishi identification for
// the Big Dipper uses Brahma's mind-born sons (Kratu, Pulaha, Pulastya,
// Atri, Angiras, Vashishtha, Marichi) — NOT the "current Manvantara"
// Saptarishi list used for the graph's `saptarishi` node group (Atri,
// Bharadvaja, Gautama, Jamadagni, Kashyapa, Vashishtha, Vishvamitra).
// Atri and Vashishtha appear in both lists; the rest are separate graph
// nodes (group: "progenitor"). See
// docs/research/nakshatra-deities-sources.md for the full explanation.
export const SAPTARISHI_STARS: Star[] = [
  { id: "dubhe", name: "Kratu", ra: 11.062, dec: 61.751, mag: 1.79, rishiId: "kratu", color: "#ffd9a0" },
  { id: "merak", name: "Pulaha", ra: 11.03, dec: 56.382, mag: 2.37, rishiId: "pulaha" },
  { id: "phecda", name: "Pulastya", ra: 11.897, dec: 53.695, mag: 2.44, rishiId: "pulastya" },
  { id: "megrez", name: "Atri", ra: 12.257, dec: 57.033, mag: 3.31, rishiId: "atri" },
  { id: "alioth", name: "Angiras", ra: 12.9, dec: 55.96, mag: 1.77, rishiId: "angiras" },
  { id: "mizar", name: "Vashishtha", ra: 13.399, dec: 54.925, mag: 2.23, rishiId: "vashishtha" },
  { id: "alkaid", name: "Marichi", ra: 13.792, dec: 49.313, mag: 1.86, rishiId: "marichi" },
  // Alcor (Arundhati, Vashishtha's wife) can be added alongside Mizar later.
];

export const DHRUVA: Star = {
  id: "dhruva",
  name: "Dhruva Tārā",
  ra: 2.53,
  dec: 89.264,
  mag: 1.97,
  rishiId: "dhruva-tara",
  color: "#fff4d6",
};

export const SKY_STARS: Star[] = [...SAPTARISHI_STARS, DHRUVA];
