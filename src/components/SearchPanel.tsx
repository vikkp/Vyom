import { useMemo } from "react";
import { useGraphStore } from "../store/useGraphStore";
import { useSkyViewerStore } from "../store/skyViewerStore";
import { getNodeSkyDirection, altitudeOfDirection } from "../utils/nodeSkyPosition";

export function SearchPanel() {
  const nodes = useGraphStore((s) => s.nodes);
  const searchQuery = useGraphStore((s) => s.searchQuery);
  const setSearchQuery = useGraphStore((s) => s.setSearchQuery);
  const select = useGraphStore((s) => s.select);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);
  const requestFocus = useSkyViewerStore((s) => s.requestFocus);

  // Sky position is computed live per result, from whatever city/date is
  // currently active -- the same node points in a different direction (or
  // may be below the horizon entirely) depending on where and when you're
  // looking from, so this can't be precomputed once and cached.
  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return nodes
      .filter((n) => n.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((n) => {
        const direction = getNodeSkyDirection(n.id, selectedCity, currentDate);
        const belowHorizon = direction ? altitudeOfDirection(direction) < 0 : false;
        return { node: n, direction, belowHorizon };
      });
  }, [nodes, searchQuery, selectedCity, currentDate]);

  return (
    <div className="pointer-events-auto absolute left-4 top-40 z-10 w-72 max-w-[85vw]">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search the sky…"
        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder-white/40 backdrop-blur-md outline-none focus:border-amber-200/40"
      />
      {results.length > 0 && (
        <ul className="mt-1 overflow-hidden rounded-lg border border-white/10 bg-black/70 backdrop-blur-md">
          {results.map(({ node: n, direction, belowHorizon }) => (
            <li key={n.id}>
              <button
                onClick={() => {
                  select(n.id);
                  // Only nodes with a linked star (nakshatras, Rishis,
                  // Dhruva, ...) have anywhere to turn toward -- pure
                  // story/mythology nodes with no sky anchor just select,
                  // same as before this feature existed.
                  if (direction) requestFocus({ x: direction.x, y: direction.y, z: direction.z });
                  setSearchQuery("");
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
              >
                <span>{n.name}</span>
                <span className="flex items-center gap-1.5 text-xs text-white/40">
                  {belowHorizon && <span className="text-amber-200/60">below horizon</span>}
                  {n.type.replace("-", " ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
