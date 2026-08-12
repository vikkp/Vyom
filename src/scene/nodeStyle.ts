import type { NodeType } from "../types/graph";

export const NODE_COLORS: Record<NodeType, string> = {
  celestial: "#fff4d6",
  nakshatra: "#7dd3fc",
  deity: "#fbbf24",
  sage: "#c084fc",
  character: "#fb7185",
  "story-event": "#4ade80",
  // ADR0005: distinct from "deity" (amber) so the Navagraha read as their
  // own category in DetailPanel's type label, even though several are
  // also worshipped as deities -- a warm gold/orange keyed to Surya, the
  // chief Graha.
  graha: "#f59e0b",
};

export const NODE_SIZES: Record<NodeType, number> = {
  celestial: 0.55,
  nakshatra: 0.28,
  deity: 0.24,
  sage: 0.24,
  character: 0.22,
  "story-event": 0.26,
  graha: 0.3,
};
