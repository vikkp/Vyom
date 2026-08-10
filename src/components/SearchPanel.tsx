import { useMemo } from "react";
import { useGraphStore } from "../store/useGraphStore";

export function SearchPanel() {
  const nodes = useGraphStore((s) => s.nodes);
  const searchQuery = useGraphStore((s) => s.searchQuery);
  const setSearchQuery = useGraphStore((s) => s.setSearchQuery);
  const select = useGraphStore((s) => s.select);

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return nodes.filter((n) => n.name.toLowerCase().includes(q)).slice(0, 8);
  }, [nodes, searchQuery]);

  return (
    <div className="pointer-events-auto absolute left-4 top-24 z-10 w-72 max-w-[85vw]">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search the sky…"
        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm text-white placeholder-white/40 backdrop-blur-md outline-none focus:border-amber-200/40"
      />
      {results.length > 0 && (
        <ul className="mt-1 overflow-hidden rounded-lg border border-white/10 bg-black/70 backdrop-blur-md">
          {results.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => {
                  select(n.id);
                  setSearchQuery("");
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
              >
                <span>{n.name}</span>
                <span className="text-xs text-white/40">{n.type.replace("-", " ")}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
