import { create } from "zustand";
import type { City } from "../types/skyViewer";
import { CITIES, DEFAULT_CITY_ID } from "../data/cities";

export type SkyViewerLayer = "stars" | "lines" | "names" | "overlays" | "graph";

// "graph" (relationship-graph edges drawn across the dome) and "names"
// (persistent labels on every named star) both read as cluttered/abstract
// rather than a clean night sky — per the 2026-08-11 visual-direction
// note, both are opt-in instead of on by default. Clicking a star still
// always shows its label regardless of the "names" toggle.
const DEFAULT_LAYERS: SkyViewerLayer[] = ["stars", "lines", "overlays"];

// Matches ADR0002's SkyState, with one deviation: object selection isn't
// duplicated here. Clicking a star calls useGraphStore.select() directly,
// the same selection state that already drives DetailPanel — one source
// of truth instead of two stores racing each other.
interface SkyViewerState {
  selectedCity: City;
  useGeolocation: boolean;
  currentDate: Date;
  visibleLayers: Set<SkyViewerLayer>;
  setCity: (city: City) => void;
  setUseGeolocation: (value: boolean) => void;
  setCurrentDate: (date: Date) => void;
  toggleLayer: (layer: SkyViewerLayer) => void;
}

const defaultCity = CITIES.find((c) => c.id === DEFAULT_CITY_ID) ?? CITIES[0];

export const useSkyViewerStore = create<SkyViewerState>((set, get) => ({
  selectedCity: defaultCity,
  useGeolocation: false,
  currentDate: new Date(),
  visibleLayers: new Set(DEFAULT_LAYERS),
  setCity: (city) => set({ selectedCity: city, useGeolocation: false }),
  setUseGeolocation: (value) => set({ useGeolocation: value }),
  setCurrentDate: (date) => set({ currentDate: date }),
  toggleLayer: (layer) => {
    const next = new Set(get().visibleLayers);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    set({ visibleLayers: next });
  },
}));
