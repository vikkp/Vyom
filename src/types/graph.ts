// Graph data model — ADR0001 decision 3:
// "Model the content as a directed labelled graph."

export type NodeType =
  | "celestial" // Dhruva Tārā and other fixed celestial objects
  | "nakshatra" // the 27 Nakshatras
  | "deity" // Trimurti, Adityas, Nakshatra-presiding deities
  | "sage" // Saptarishi and other rishis/progenitors
  | "character" // Dhruva family and other story characters
  | "story-event" // major story events (e.g. Dhruva's Penance)
  | "graha"; // ADR0005: the Navagraha (Surya, Chandra, and the 7 others)

export type NodeGroup =
  | "center"
  | "trimurti"
  | "saptarishi"
  | "progenitor"
  | "aditya"
  | "nakshatra-deity"
  | "nakshatra"
  | "dhruva-family"
  | "story"
  | "navagraha" // ADR0005
  | "akash-ganga"; // ADR0007

export interface GraphNode {
  id: string;
  type: NodeType;
  group: NodeGroup;
  name: string;
  sanskrit?: string;
  symbol?: string;
  summary: string;
  /**
   * ADR0007: an optional longer-form narrative (80-140 words, several
   * short paragraphs joined by "\n\n") shown in DetailPanel in place of
   * `summary` when present. Optional rather than replacing `summary`
   * outright: only ~39 of this app's ~85 nodes have curated story
   * content so far (the 27 Nakshatras, 9 Navagraha, the 7 star-
   * represented Saptarishi, and Dhruva Tārā) -- every other node keeps
   * working exactly as before, falling back to its existing `summary`.
   */
  story?: string;
}

export type EdgeType =
  | "parent"
  | "spouse"
  | "sibling"
  | "guru"
  | "enemy"
  | "boon"
  | "form-of"
  | "transformation"
  | "astronomical-association"
  | "story-link";

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
