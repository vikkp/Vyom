import { create } from "zustand";

export type SkyLayer = "stars" | "lines" | "overlays";

const ALL_LAYERS: SkyLayer[] = ["stars", "lines", "overlays"];

interface SkyState {
  visibleLayers: Set<SkyLayer>;
  hoveredStarId: string | null;
  toggleLayer: (layer: SkyLayer) => void;
  setLayers: (layers: SkyLayer[]) => void;
  hoverStar: (id: string | null) => void;
}

export const useSkyStore = create<SkyState>((set, get) => ({
  // "Stars + Lines + Rishi Overlays" is the default mythic experience.
  visibleLayers: new Set(ALL_LAYERS),
  hoveredStarId: null,
  toggleLayer: (layer) => {
    const next = new Set(get().visibleLayers);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    set({ visibleLayers: next });
  },
  setLayers: (layers) => set({ visibleLayers: new Set(layers) }),
  hoverStar: (id) => set({ hoveredStarId: id }),
}));
