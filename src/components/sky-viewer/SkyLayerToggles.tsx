import { useSkyViewerStore, type SkyViewerLayer } from "../../store/skyViewerStore";

const LAYER_LABELS: Record<SkyViewerLayer, string> = {
  stars: "Stars",
  lines: "Lines",
  names: "Names",
  overlays: "Rishi",
  graph: "Graph",
};

export function SkyLayerToggles() {
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const toggleLayer = useSkyViewerStore((s) => s.toggleLayer);

  return (
    <div className="pointer-events-auto absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md">
      {(Object.keys(LAYER_LABELS) as SkyViewerLayer[]).map((layer) => {
        const active = visibleLayers.has(layer);
        return (
          <button
            key={layer}
            onClick={() => toggleLayer(layer)}
            className={`rounded-full px-3 py-1.5 text-xs tracking-wide transition-colors ${
              active ? "bg-amber-100/90 text-black" : "text-white/50 hover:text-white/80"
            }`}
          >
            {LAYER_LABELS[layer]}
          </button>
        );
      })}
    </div>
  );
}
