import { Html } from "@react-three/drei";
import type { GraphNode } from "../types/graph";
import type { Position } from "./layout";
import { NODE_COLORS, NODE_SIZES } from "./nodeStyle";
import { useGraphStore } from "../store/useGraphStore";

interface NodeMeshProps {
  node: GraphNode;
  position: Position;
}

export function NodeMesh({ node, position }: NodeMeshProps) {
  const selectedId = useGraphStore((s) => s.selectedId);
  const hoveredId = useGraphStore((s) => s.hoveredId);
  const select = useGraphStore((s) => s.select);
  const hover = useGraphStore((s) => s.hover);

  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;
  const color = NODE_COLORS[node.type];
  const baseSize = NODE_SIZES[node.type];
  const size = isSelected ? baseSize * 1.5 : isHovered ? baseSize * 1.2 : baseSize;

  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          select(node.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(node.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.1 : isHovered ? 0.7 : 0.35}
          toneMapped={false}
        />
      </mesh>
      {(isSelected || isHovered) && (
        <Html distanceFactor={12} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-xs text-white shadow">
            {node.name}
          </div>
        </Html>
      )}
    </group>
  );
}
