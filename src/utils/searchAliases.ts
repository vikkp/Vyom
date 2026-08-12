import { STAR_CATALOG } from "../data/starCatalog";
import { NAVAGRAHA } from "../data/navagraha";

// ADR0008: alternate/Western names a user might search for instead of
// (or alongside) the Indic primary name -- "Jupiter" should still find
// Guru, "Milky Way" should still find Akash Ganga, "Big Dipper" should
// still find each of the seven Saptarishi. These are always ranked below
// a primary-name match in SearchPanel (see rankMatch there) -- this file
// only answers "what else does this node go by," not how heavily that
// should count.
const ALIASES = new Map<string, string[]>();

function addAlias(nodeId: string, alias: string): void {
  const list = ALIASES.get(nodeId);
  if (list) list.push(alias);
  else ALIASES.set(nodeId, [alias]);
}

// Every catalog star's Western name (Betelgeuse, Aldebaran, Dubhe, ...),
// keyed by the graph node it's linked to -- an asterism spanning several
// stars (e.g. Rohini's Hyades group) contributes each star's name.
for (const star of STAR_CATALOG) {
  if (star.nodeId && star.westernName) addAlias(star.nodeId, star.westernName);
}

// Each Graha's Western planet/node name (Jupiter, Mars, Moon's north node, ...).
for (const graha of NAVAGRAHA) {
  addAlias(graha.nodeId, graha.westernName);
}

// A few names with no single-star or single-body source to pull from.
for (const rishiId of ["marichi", "atri", "angiras", "pulaha", "pulastya", "kratu", "vashishtha"]) {
  addAlias(rishiId, "Big Dipper");
  addAlias(rishiId, "Ursa Major");
  addAlias(rishiId, "Saptarishi");
}
addAlias("dhruva-tara", "Pole Star");
addAlias("dhruva-tara", "North Star");
addAlias("akash-ganga", "Milky Way");
addAlias("akash-ganga", "Galaxy");

/** Every known alternate/Western name for a node, or an empty array if it has none. */
export function getSearchAliases(nodeId: string): string[] {
  return ALIASES.get(nodeId) ?? [];
}
