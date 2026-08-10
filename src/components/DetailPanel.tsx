import { getNode, neighborsOf, useGraphStore } from "../store/useGraphStore";
import { NODE_COLORS } from "../scene/nodeStyle";
import { edgeVerb } from "./EdgeTypeLabel";

export function DetailPanel() {
  const selectedId = useGraphStore((s) => s.selectedId);
  const select = useGraphStore((s) => s.select);

  if (!selectedId) return null;
  const node = getNode(selectedId);
  if (!node) return null;

  const neighbors = neighborsOf(selectedId);

  return (
    <aside className="pointer-events-auto absolute right-4 top-24 z-10 w-80 max-w-[85vw] rounded-xl border border-white/10 bg-black/60 p-4 text-white backdrop-blur-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div
            className="text-[10px] uppercase tracking-widest"
            style={{ color: NODE_COLORS[node.type] }}
          >
            {node.type.replace("-", " ")}
          </div>
          <h2 className="text-lg font-medium">{node.name}</h2>
          {node.sanskrit && <div className="text-sm text-white/50">{node.sanskrit}</div>}
        </div>
        <button
          onClick={() => select(null)}
          className="rounded px-2 py-1 text-white/50 hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {node.symbol && (
        <div className="mt-2 text-xs text-white/60">
          Symbol: <span className="text-white/80">{node.symbol}</span>
        </div>
      )}

      <p className="mt-3 text-sm leading-relaxed text-white/80">{node.summary}</p>

      {neighbors.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="mb-2 text-[10px] uppercase tracking-widest text-white/40">
            Relationships ({neighbors.length})
          </div>
          <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {neighbors.map(({ edge, other, direction }) => (
              <li key={edge.id}>
                <button
                  onClick={() => select(other.id)}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm hover:bg-white/10"
                >
                  <span className="truncate">{other.name}</span>
                  <span className="ml-2 shrink-0 text-xs text-white/40">
                    {edgeVerb(edge.type, direction)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
