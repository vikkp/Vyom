import { Line } from "@react-three/drei";
import { useGraphStore } from "../store/useGraphStore";
import type { Position } from "./layout";

export function EdgeLines() {
  const edges = useGraphStore((s) => s.edges);
  const positions = useGraphStore((s) => s.positions);
  const selectedId = useGraphStore((s) => s.selectedId);

  return (
    <group>
      {edges.map((edge) => {
        const from = positions[edge.source];
        const to = positions[edge.target];
        if (!from || !to) return null;
        const isHighlighted = selectedId != null && (edge.source === selectedId || edge.target === selectedId);
        return (
          <Line
            key={edge.id}
            points={[from as Position, to as Position]}
            color={isHighlighted ? "#fef08a" : "#3b3550"}
            transparent
            opacity={isHighlighted ? 0.9 : 0.18}
            lineWidth={isHighlighted ? 1.5 : 0.6}
          />
        );
      })}
    </group>
  );
}
