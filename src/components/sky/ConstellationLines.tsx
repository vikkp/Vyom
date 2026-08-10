import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Star, ConstellationLine } from "../../types/celestial";
import { raDecToVectorRelative } from "../../utils/celestial";
import { useSkyStore } from "../../store/skyStore";

interface ConstellationLinesProps {
  stars: Star[];
  lines: ConstellationLine[];
  anchor: Star;
  radius?: number;
}

export function ConstellationLines({ stars, lines, anchor, radius = 16 }: ConstellationLinesProps) {
  const visibleLayers = useSkyStore((s) => s.visibleLayers);
  const materialRefs = useRef<Array<{ opacity: number }>>([]);

  const starsById = useMemo(() => new Map(stars.map((s) => [s.id, s])), [stars]);

  const segments = useMemo(() => {
    return lines
      .map((line) => {
        const from = starsById.get(line.from);
        const to = starsById.get(line.to);
        if (!from || !to) return null;
        const a = raDecToVectorRelative(from.ra, from.dec, anchor.ra, anchor.dec, radius);
        const b = raDecToVectorRelative(to.ra, to.dec, anchor.ra, anchor.dec, radius);
        return { id: line.id, points: [[a.x, a.y, a.z] as [number, number, number], [b.x, b.y, b.z] as [number, number, number]] };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);
  }, [lines, starsById, anchor, radius]);

  useFrame(({ clock }) => {
    const breathe = 0.4 + Math.sin(clock.elapsedTime * 0.4) * 0.12;
    materialRefs.current.forEach((mat) => {
      if (mat) mat.opacity = breathe;
    });
  });

  if (!visibleLayers.has("lines")) return null;

  return (
    <group>
      {segments.map((seg, i) => (
        <Line
          key={seg.id}
          ref={(el) => {
            const material = (el as unknown as { material?: { opacity: number } } | null)?.material;
            if (material) materialRefs.current[i] = material;
          }}
          points={seg.points}
          color="#f3d98b"
          lineWidth={1.2}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}
