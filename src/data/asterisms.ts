import type { Asterism } from "../types/skyViewer";

// Saptarishi and Mrigashira are the two multi-star line patterns so far
// (ADR0003 priority #2). Every other Nakshatra still maps to a single
// yogatara star (a point, not a shape), per the Brihat Samhita
// junction-star tradition — those get built out into full asterisms one
// at a time, per ADR0003's own sequencing (Rohini/Hyades and
// Krittika/Pleiades next).
export const ASTERISMS: Asterism[] = [
  {
    id: "saptarishi",
    name: "Saptarishi",
    // A single traversal path (consecutive pairs become line segments) that
    // covers the handle (Alkaid-Mizar-Alioth-Megrez) then closes the bowl
    // quadrilateral (Megrez-Dubhe-Merak-Phecda-Megrez).
    starIds: ["alkaid", "mizar", "alioth", "megrez", "dubhe", "merak", "phecda", "megrez"],
    nodeId: undefined,
  },
  {
    id: "mrigashira",
    name: "Mrigashira",
    // The "deer head" triangle: Meissa (Lambda Orionis, the Brihat
    // Samhita yogatara) plus Phi-1 and Phi-2 Orionis, closed back to
    // Meissa. See docs/research/mrigashira-asterism-sources.md.
    starIds: ["meissa", "phi1-orionis", "phi2-orionis", "meissa"],
    nodeId: "mrigashira",
  },
  {
    id: "rohini",
    name: "Rohini",
    // The Hyades "V": open (not closed back to start), converging at
    // Gamma Tauri (the vertex/nose) with Epsilon Tauri and Aldebaran as
    // the two open tips. See docs/research/rohini-asterism-sources.md.
    starIds: ["epsilon-tauri", "delta1-tauri", "gamma-tauri", "theta2-tauri", "aldebaran"],
    nodeId: "rohini",
  },
  {
    id: "krittika",
    name: "Krittika",
    // The naked-eye Pleiades cluster shape, zigzagging through the six
    // brightest stars rather than a straight line — see
    // docs/research/krittika-asterism-sources.md.
    starIds: ["merope", "electra", "taygeta", "maia", "alcyone", "atlas"],
    nodeId: "krittika",
  },
  {
    id: "ursa-minor",
    name: "Ursa Minor (Dhruva context)",
    // The Little Dipper: handle from Polaris out to the bowl, then the
    // bowl itself closed back to zeta. See
    // docs/research/dhruva-context-sources.md. No nodeId — see the
    // comment above URSA_MINOR_CONTEXT_STARS in starCatalog.ts for why.
    starIds: ["polaris", "yildun", "epsilon-umi", "zeta-umi", "eta-umi", "pherkad", "kochab", "zeta-umi"],
    nodeId: undefined,
    // Orientation scaffolding around Dhruva Tara, not a storied shape in its
    // own right -- kept visually quiet so it doesn't compete with Saptarishi
    // right next to it near the pole.
    emphasis: "secondary",
  },
];
