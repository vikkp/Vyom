import type { NodeType } from "../types/graph";

export const NODE_COLORS: Record<NodeType, string> = {
  celestial: "#fff4d6",
  nakshatra: "#7dd3fc",
  deity: "#fbbf24",
  sage: "#c084fc",
  character: "#fb7185",
  "story-event": "#4ade80",
};

export const NODE_SIZES: Record<NodeType, number> = {
  celestial: 0.55,
  nakshatra: 0.28,
  deity: 0.24,
  sage: 0.24,
  character: 0.22,
  "story-event": 0.26,
};
