import { useEffect, useMemo, useState } from "react";
import { Vector3 } from "three";
import { useGraphStore } from "../store/useGraphStore";
import { useSkyViewerStore } from "../store/skyViewerStore";
import { getNodeSkyDirection, altitudeOfDirection } from "../utils/nodeSkyPosition";
import { getSearchAliases } from "../utils/searchAliases";
import type { GraphNode } from "../types/graph";

const MAX_RESULTS = 8;

// ADR0008: match rank, lowest wins ties when sorting -- a node's primary
// (Indic) name always outranks any alternate/Western name it might also
// go by, per the "priority on Indian names" spec. sanskrit sits between
// the two: it's still the node's own traditional name, just not what
// most users will actually type given the ASCII search box, so it rarely
// changes the outcome in practice but is checked for completeness.
const RANK_NAME_PREFIX = 0;
const RANK_NAME_SUBSTRING = 1;
const RANK_SANSKRIT = 2;
const RANK_ALIAS = 3;

interface RankedMatch {
  node: GraphNode;
  rank: number;
  /** The alias text that matched, only set when rank === RANK_ALIAS -- shown as a hint so "why did this show up for 'Jupiter'" is never a mystery. */
  matchedAlias?: string;
}

function rankMatch(node: GraphNode, q: string): RankedMatch | null {
  const name = node.name.toLowerCase();
  if (name.startsWith(q)) return { node, rank: RANK_NAME_PREFIX };
  if (name.includes(q)) return { node, rank: RANK_NAME_SUBSTRING };
  if (node.sanskrit?.toLowerCase().includes(q)) return { node, rank: RANK_SANSKRIT };

  for (const alias of getSearchAliases(node.id)) {
    if (alias.toLowerCase().includes(q)) return { node, rank: RANK_ALIAS, matchedAlias: alias };
  }
  return null;
}

// ADR0009: "I am a satellite" isn't a graph node -- there's nothing to
// select or open a story for, it's an action that toggles the ambient
// camera drift. Matched against a short list of phrases someone might
// plausibly type (not just the exact literal string), so "sat", "orbit",
// or "drift" all find it too. Whenever it matches at all, it's pushed
// into the results list *before* any ranked node match -- per the spec,
// it must always appear at the very top, not merely win ties within the
// normal name/alias ranking.
const SATELLITE_TRIGGERS = ["i am a satellite", "satellite", "orbit", "drift", "fly"];

function matchesSatelliteTrigger(q: string): boolean {
  return SATELLITE_TRIGGERS.some((trigger) => trigger.includes(q));
}

type SearchResult =
  | { kind: "satellite" }
  | { kind: "node"; node: GraphNode; direction: Vector3 | null; belowHorizon: boolean; matchedAlias?: string };

export function SearchPanel() {
  const nodes = useGraphStore((s) => s.nodes);
  const searchQuery = useGraphStore((s) => s.searchQuery);
  const setSearchQuery = useGraphStore((s) => s.setSearchQuery);
  const select = useGraphStore((s) => s.select);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);
  const requestFocus = useSkyViewerStore((s) => s.requestFocus);
  const satelliteMode = useSkyViewerStore((s) => s.satelliteMode);
  const toggleSatelliteMode = useSkyViewerStore((s) => s.toggleSatelliteMode);

  const [highlightIndex, setHighlightIndex] = useState(0);

  // Ranked first (cheap string comparisons over all ~85 nodes), *then*
  // sliced, *then* each survivor gets a live sky-direction lookup -- so a
  // Navagraha's Kepler-equation solve or Akash Ganga's galactic-to-
  // equatorial conversion only ever runs for results actually shown, not
  // for every match before ranking narrows the field down. The satellite
  // pseudo-result (if it matches) takes one of the MAX_RESULTS slots off
  // the top, same total list length either way.
  const results = useMemo<SearchResult[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const items: SearchResult[] = [];
    if (matchesSatelliteTrigger(q)) items.push({ kind: "satellite" });

    const ranked: RankedMatch[] = [];
    for (const n of nodes) {
      const m = rankMatch(n, q);
      if (m) ranked.push(m);
    }
    ranked.sort((a, b) => a.rank - b.rank || a.node.name.length - b.node.name.length || a.node.name.localeCompare(b.node.name));

    for (const { node: n, matchedAlias } of ranked.slice(0, MAX_RESULTS - items.length)) {
      const direction = getNodeSkyDirection(n.id, selectedCity, currentDate);
      const belowHorizon = direction ? altitudeOfDirection(direction) < 0 : false;
      items.push({ kind: "node", node: n, direction, belowHorizon, matchedAlias });
    }
    return items;
  }, [nodes, searchQuery, selectedCity, currentDate]);

  // A fresh query should always start highlighting the top (best-ranked)
  // result, not wherever the cursor happened to be left from a previous
  // search.
  useEffect(() => {
    setHighlightIndex(0);
  }, [searchQuery]);

  function commit(item: SearchResult) {
    if (item.kind === "satellite") {
      toggleSatelliteMode();
      setSearchQuery("");
      return;
    }
    select(item.node.id);
    // Only nodes with a resolvable sky position (Nakshatras, Navagraha,
    // Rishis, Dhruva, Akash Ganga, ...) have anywhere to turn toward --
    // pure story/mythology nodes with no sky anchor just select, same as
    // before this feature existed.
    if (item.direction) requestFocus({ x: item.direction.x, y: item.direction.y, z: item.direction.z });
    setSearchQuery("");
  }

  return (
    <div className="pointer-events-auto absolute left-4 top-40 z-10 w-72 max-w-[85vw]">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (results.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const picked = results[highlightIndex];
            if (picked) commit(picked);
          } else if (e.key === "Escape") {
            setSearchQuery("");
          }
        }}
        placeholder="Search the sky…"
        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder-white/40 backdrop-blur-md outline-none focus:border-amber-200/40"
      />
      {results.length > 0 && (
        <ul className="mt-1 overflow-hidden rounded-lg border border-white/10 bg-black/70 backdrop-blur-md">
          {results.map((item, i) => {
            const highlighted = i === highlightIndex;
            if (item.kind === "satellite") {
              return (
                <li key="satellite-mode">
                  <button
                    onClick={() => commit(item)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={`flex w-full items-center justify-between border-b border-white/10 px-3 py-2 text-left text-sm ${
                      highlighted ? "bg-amber-100/15 text-amber-100" : "text-amber-100/80 hover:bg-amber-100/10"
                    }`}
                  >
                    <span>I am a satellite</span>
                    <span className="ml-2 shrink-0 text-xs text-white/40">
                      {satelliteMode ? "exit mode" : "enter mode"}
                    </span>
                  </button>
                </li>
              );
            }

            const { node: n, belowHorizon, matchedAlias } = item;
            return (
              <li key={n.id}>
                <button
                  onClick={() => commit(item)}
                  onMouseEnter={() => setHighlightIndex(i)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                    highlighted ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-baseline gap-1.5 truncate">
                    <span className="truncate">{n.name}</span>
                    {matchedAlias && <span className="shrink-0 text-xs text-white/40">({matchedAlias})</span>}
                  </span>
                  <span className="ml-2 flex shrink-0 items-center gap-1.5 text-xs text-white/40">
                    {belowHorizon && <span className="text-amber-200/60">below horizon</span>}
                    {n.type.replace("-", " ")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
