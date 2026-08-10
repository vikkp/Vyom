# ADR0002 – Location-Based Sky Viewer

Status: Accepted
Date: 2026-08-10
Deciders: Project owner + senior consultant

## Context

The original abstract Dhruva-centric graph view (ADR0001) correctly modelled relationships but created a misleading mental model for new users — it appeared as if all Nakshatras revolve around Dhruva.

The product vision is now a SkyGuide-style experience: show the real night sky for any chosen location, overlaid with Ancient Indian names, Saptarishi figures, Nakshatra asterisms, stories, and the existing relationship graph.

## Decision

We will build a location-aware celestial viewer as the primary experience of Vyom.

- User selects a city (or uses geolocation).
- The sky is rendered for that latitude/longitude + current (or selected) date/time.
- Stars appear in their real positions.
- Indian names, constellation lines, optional Rishi overlays, and graph connections are layered on top.
- Clicking any celestial object opens the existing DetailPanel with story + relationship graph.

The abstract graph view may remain as a secondary "Relationship Map" mode later, but it is no longer the default.

## Consequences

### Positive

- Matches user intent and SkyGuide expectations.
- Immediately useful and personal for both Indian and diaspora users.
- Still leverages the full relationship graph we already built.
- Keeps the React Three Fiber + Cloudflare stack.

### Negative / Trade-offs

- Requires astronomy coordinate transforms (RA/Dec → Alt-Az).
- Needs a curated bright-star + Nakshatra catalog.
- Slightly heavier client-side computation (still acceptable for modern devices).

## Technical Plan

### 1. Core Data Structures

```ts
// src/data/cities.ts
export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  group: "India" | "US" | "Europe" | "Australia" | "Asia";
}

// src/data/stars.ts
export interface Star {
  id: string;                    // unique, e.g. "hip54061" or "dubhe"
  hip?: number;                  // Hipparcos if available
  ra: number;                    // hours (0–24)
  dec: number;                   // degrees
  mag: number;                   // visual magnitude
  indianName?: string;           // e.g. "Dhruva", "Kratu", "Rohini"
  westernName?: string;
  nodeId?: string;               // link to graph.json node
  constellation?: string;        // "Saptarishi" | "Nakshatra" | etc.
}

// src/data/asterisms.ts
export interface Asterism {
  id: string;
  name: string;                  // "Saptarishi", "Ashwini", etc.
  starIds: string[];             // ordered for line drawing
  nodeId?: string;               // graph node
}
```

### 2. Astronomy Utilities (`src/utils/astronomy.ts`)

```ts
// Convert RA/Dec + observer lat/lon + UTC → local Altitude / Azimuth
export function raDecToAltAz(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonDeg: number,
  date: Date
): { alt: number; az: number }

// Helper to get current Local Sidereal Time, etc.
```

We will implement a lightweight pure-JS version first (no heavy external astronomy library required for v1). Can later swap in `astronomy-engine` if needed.

### 3. Component Structure

```
src/components/sky/
  SkyViewer.tsx          // main canvas + camera looking upward
  StarField.tsx          // points + labels
  AsterismLines.tsx
  RishiOverlays.tsx      // billboards with the PNGs we generated
  Horizon.tsx            // simple ground plane + atmospheric fade
  LocationMenu.tsx       // hanging / top menu of cities
  TimeControls.tsx       // optional date/time slider
```

### 4. State (Zustand)

```ts
interface SkyState {
  selectedCity: City | null;
  useGeolocation: boolean;
  currentDate: Date;
  visibleLayers: Set<"stars" | "lines" | "names" | "overlays" | "graph">;
  selectedObjectId: string | null;
}
```

### 5. Implementation Order (Vertical Slice)

1. City list + LocationMenu (hard-coded 12–15 cities).
2. Astronomy utils (RA/Dec → Alt-Az).
3. Minimal StarField with Saptarishi + Dhruva + 20–30 brightest stars, correctly positioned for the selected city.
4. Asterism lines for Saptarishi.
5. Indian name labels.
6. Click → existing DetailPanel (reuse graph data).
7. Add Rishi overlays.
8. Expand catalog to all 27 Nakshatra primary stars + more bright stars.
9. Geolocation + time controls.

### 6. Performance Notes

- Use InstancedMesh for stars.
- Only render stars above horizon (alt > –5°).
- Labels via CSS2DRenderer or drei `<Html>` / `<Billboard>` (cull distant ones).
- Keep the scene under 1500–2000 draw calls for mobile friendliness.
