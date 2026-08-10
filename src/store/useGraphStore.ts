import { create } from "zustand";
import graphJson from "../data/graph.json";
import type { GraphData, GraphEdge, GraphNode } from "../types/graph";
import { computeLayout, type Position } from "../scene/layout";

const graph = graphJson as GraphData;

const nodesById = new Map<string, GraphNode>(graph.nodes.map((n) => [n.id, n]));
const positions = computeLayout(graph.nodes);

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  positions: Record<string, Position>;
  selectedId: string | null;
  hoveredId: string | null;
  searchQuery: string;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: graph.nodes,
  edges: graph.edges,
  positions,
  selectedId: "dhruva-tara",
  hoveredId: null,
  searchQuery: "",
  select: (id) => set({ selectedId: id }),
  hover: (id) => set({ hoveredId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));

export function getNode(id: string): GraphNode | undefined {
  return nodesById.get(id);
}

export function neighborsOf(id: string): Array<{ edge: GraphEdge; other: GraphNode; direction: "out" | "in" }> {
  const result: Array<{ edge: GraphEdge; other: GraphNode; direction: "out" | "in" }> = [];
  for (const edge of graph.edges) {
    if (edge.source === id) {
      const other = nodesById.get(edge.target);
      if (other) result.push({ edge, other, direction: "out" });
    } else if (edge.target === id) {
      const other = nodesById.get(edge.source);
      if (other) result.push({ edge, other, direction: "in" });
    }
  }
  return result;
}
