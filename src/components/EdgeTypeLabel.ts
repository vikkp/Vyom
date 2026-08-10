import type { EdgeType } from "../types/graph";

export const EDGE_TYPE_LABELS: Record<EdgeType, string> = {
  parent: "parent of",
  spouse: "spouse of",
  sibling: "sibling of",
  guru: "guru to",
  enemy: "rival of",
  boon: "granted a boon to",
  "form-of": "a form of",
  transformation: "transformed into",
  "astronomical-association": "associated with",
  "story-link": "linked in story to",
};

export function edgeVerb(type: EdgeType, direction: "out" | "in"): string {
  const forward = EDGE_TYPE_LABELS[type];
  if (direction === "out") return forward;
  // crude reverse phrasing for the incoming direction
  switch (type) {
    case "parent":
      return "child of";
    case "guru":
      return "disciple of";
    case "boon":
      return "received a boon from";
    case "transformation":
      return "was the origin form of";
    default:
      return forward;
  }
}
