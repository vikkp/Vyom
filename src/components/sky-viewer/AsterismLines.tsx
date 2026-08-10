import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Asterism, SkyCatalogStar } from "../../types/skyViewer";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { useSkyViewerStore } from "../../store/skyViewerStore";

const DOME_RADIUS = 90;

interface AsterismLinesProps {
  asterisms: Asterism[];
  stars: SkyCatalogStar[];
}

export function AsterismLines({ asterisms, stars }: AsterismLinesProps) {
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);
  const materialRefs = useRef<Array<{ opacity: number } | undefined>>([]);

  const starsById = useMemo(() => new Map(stars.map((s) => [s.id, s])), [stars]);

  const segments = useMemo(() => {
    const result: Array<{ id: string; points: [[number, number, number], [number, number, number]] }> = [];
    for (const asterism of asterisms) {
      for (let i = 0; i < asterism.starIds.length - 1; i++) {
        const fromStar = starsById.get(asterism.starIds[i]);
        const toStar = starsById.get(asterism.starIds[i + 1]);
        if (!fromStar || !toStar) continue;
        const fromAltAz = raDecToAltAz(fromStar.ra, fromStar.dec, selectedCity.lat, selectedCity.lon, currentDate);
        const toAltAz = raDecToAltAz(toStar.ra, toStar.dec, selectedCity.lat, selectedCity.lon, currentDate);
        if (fromAltAz.alt < -5 || toAltAz.alt < -5) continue;
        const from = altAzToVector3(fromAltAz.alt, fromAltAz.az, DOME_RADIUS);
        const to = altAzToVector3(toAltAz.alt, toAltAz.az, DOME_RADIUS);
        result.push({ id: `${asterism.id}-${i}`, points: [[from.x, from.y, from.z], [to.x, to.y, to.z]] });
      }
    }
    return result;
  }, [asterisms, starsById, selectedCity, currentDate]);

  useFrame(({ clock }) => {
    const breathe = 0.45 + Math.sin(clock.elapsedTime * 0.4) * 0.12;
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
