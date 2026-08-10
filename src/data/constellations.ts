import type { ConstellationLine } from "../types/celestial";

// Classic Big Dipper asterism: bowl (Dubhe-Merak-Phecda-Megrez) + handle
// (Megrez-Alioth-Mizar-Alkaid).
export const SAPTARISHI_LINES: ConstellationLine[] = [
  { id: "l1", from: "dubhe", to: "merak" },
  { id: "l2", from: "merak", to: "phecda" },
  { id: "l3", from: "phecda", to: "megrez" },
  { id: "l4", from: "megrez", to: "dubhe" },
  { id: "l5", from: "megrez", to: "alioth" },
  { id: "l6", from: "alioth", to: "mizar" },
  { id: "l7", from: "mizar", to: "alkaid" },
];
