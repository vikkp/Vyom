import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useGraphStore } from "../store/useGraphStore";
import type { Position } from "./layout";

// Same "thin, elegant, soft luminous gold, low opacity" constellation-line
// treatment used for the Saptarishi star lines (src/components/sky),
// applied across the whole graph so every relationship reads as a
// constellation line, not just the Big Dipper.
const BASE_COLOR = "#d9c48f";
const HIGHLIGHT_COLOR = "#fef08a";
const BASE_OPACITY = 0.45;
const HIGHLIGHT_OPACITY = 0.95;

export function EdgeLines() {
  const edges = useGraphStore((s) => s.edges);
  const positions = useGraphStore((s) => s.positions);
  const selectedId = useGraphStore((s) => s.selectedId);
  const materialRefs = useRef<Array<{ opacity: number } | undefined>>([]);

  const drawable = useMemo(
    () =>
      edges
        .map((edge) => {
          const from = positions[edge.source];
          const to = positions[edge.target];
          if (!from || !to) return null;
          return { edge, from: from as Position, to: to as Position };
        })
        .filter((d): d is NonNullable<typeof d> => d !== null),
    [edges, positions],
  );

  useFrame(({ clock }) => {
    const breathe = BASE_OPACITY + Math.sin(clock.elapsedTime * 0.35) * 0.08;
    drawable.forEach(({ edge }, i) => {
      const isHighlighted = selectedId != null && (edge.source === selectedId || edge.target === selectedId);
      const material = materialRefs.current[i];
      if (material) material.opacity = isHighlighted ? HIGHLIGHT_OPACITY : breathe;
    });
  });

  return (
    <group>
      {drawable.map(({ edge, from, to }, i) => {
        const isHighlighted = selectedId != null && (edge.source === selectedId || edge.target === selectedId);
        return (
          <Line
            key={edge.id}
            ref={(el) => {
              const material = (el as unknown as { material?: { opacity: number } } | null)?.material;
              if (material) materialRefs.current[i] = material;
            }}
            points={[from, to]}
            color={isHighlighted ? HIGHLIGHT_COLOR : BASE_COLOR}
            transparent
            opacity={isHighlighted ? HIGHLIGHT_OPACITY : BASE_OPACITY}
            lineWidth={isHighlighted ? 1.6 : 0.9}
          />
        );
      })}
    </group>
  );
}
