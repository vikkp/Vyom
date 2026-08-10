import type { Asterism } from "../types/skyViewer";

// Only the Saptarishi has a multi-star line pattern in v1; each Nakshatra
// maps to a single yogatara star (a point, not a shape), per the Brihat
// Samhita junction-star tradition.
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
];
