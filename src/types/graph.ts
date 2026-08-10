// Graph data model — ADR0001 decision 3:
// "Model the content as a directed labelled graph."

export type NodeType =
  | "celestial" // Dhruva Tārā and other fixed celestial objects
  | "nakshatra" // the 27 Nakshatras
  | "deity" // Trimurti, Adityas, Nakshatra-presiding deities
  | "sage" // Saptarishi and other rishis/progenitors
  | "character" // Dhruva family and other story characters
  | "story-event"; // major story events (e.g. Dhruva's Penance)

export type NodeGroup =
  | "center"
  | "trimurti"
  | "saptarishi"
  | "progenitor"
  | "aditya"
  | "nakshatra-deity"
  | "nakshatra"
  | "dhruva-family"
  | "story";

export interface GraphNode {
  id: string;
  type: NodeType;
  group: NodeGroup;
  name: string;
  sanskrit?: string;
  symbol?: string;
  summary: string;
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
