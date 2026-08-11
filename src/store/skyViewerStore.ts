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
/**
 * A request to smoothly turn the camera to face a direction in the sky —
 * set by search (see SearchPanel.tsx) and consumed by
 * CameraFocusController.tsx inside the Canvas. Plain {x,y,z} rather than a
 * three.js Vector3 so this store doesn't need to import three.js; the
 * consumer reconstructs one. `token` increments on every request so
 * re-selecting the same result still re-triggers the animation (a raw
 * direction object could compare unequal or equal by accident depending
 * on how it was constructed — the token is the one thing guaranteed to
 * change every time).
 */
export interface FocusRequest {
  direction: { x: number; y: number; z: number };
  token: number;
}

interface SkyViewerState {
  selectedCity: City;
  useGeolocation: boolean;
  currentDate: Date;
  visibleLayers: Set<SkyViewerLayer>;
  focusRequest: FocusRequest | null;
  setCity: (city: City) => void;
  setUseGeolocation: (value: boolean) => void;
  setCurrentDate: (date: Date) => void;
  toggleLayer: (layer: SkyViewerLayer) => void;
  requestFocus: (direction: { x: number; y: number; z: number }) => void;
}

const defaultCity = CITIES.find((c) => c.id === DEFAULT_CITY_ID) ?? CITIES[0];

export const useSkyViewerStore = create<SkyViewerState>((set, get) => ({
  selectedCity: defaultCity,
  useGeolocation: false,
  currentDate: new Date(),
  visibleLayers: new Set(DEFAULT_LAYERS),
  focusRequest: null,
  setCity: (city) => set({ selectedCity: city, useGeolocation: false }),
  setUseGeolocation: (value) => set({ useGeolocation: value }),
  setCurrentDate: (date) => set({ currentDate: date }),
  toggleLayer: (layer) => {
    const next = new Set(get().visibleLayers);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    set({ visibleLayers: next });
  },
  requestFocus: (direction) => set((s) => ({ focusRequest: { direction, token: s.focusRequest ? s.focusRequest.token + 1 : 1 } })),
}));
