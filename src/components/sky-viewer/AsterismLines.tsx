import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Asterism, SkyCatalogStar } from "../../types/skyViewer";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { DOME_RADIUS } from "./constants";

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
    const result: Array<{
      id: string;
      points: [[number, number, number], [number, number, number]];
      secondary: boolean;
    }> = [];
    for (const asterism of asterisms) {
      const secondary = asterism.emphasis === "secondary";
      for (let i = 0; i < asterism.starIds.length - 1; i++) {
        const fromStar = starsById.get(asterism.starIds[i]);
        const toStar = starsById.get(asterism.starIds[i + 1]);
        if (!fromStar || !toStar) continue;
        const fromAltAz = raDecToAltAz(fromStar.ra, fromStar.dec, selectedCity.lat, selectedCity.lon, currentDate);
        const toAltAz = raDecToAltAz(toStar.ra, toStar.dec, selectedCity.lat, selectedCity.lon, currentDate);
        // No horizon filtering here either — a partially-set asterism should
        // draw its full shape and let the ground disc occlude the buried
        // part, not vanish a whole line segment the moment one endpoint
        // crosses an arbitrary altitude threshold.
        const from = altAzToVector3(fromAltAz.alt, fromAltAz.az, DOME_RADIUS);
        const to = altAzToVector3(toAltAz.alt, toAltAz.az, DOME_RADIUS);
        result.push({ id: `${asterism.id}-${i}`, points: [[from.x, from.y, from.z], [to.x, to.y, to.z]], secondary });
      }
    }
    return result;
  }, [asterisms, starsById, selectedCity, currentDate]);

  useFrame(({ clock }) => {
    // Brighter, more assertive breathing range than the original -- the
    // smaller nakshatra asterisms (Mrigashira, Krittika) are compact and
    // were getting lost against the dense background starfield at the old
    // 0.33-0.57 range. Secondary (context-only) shapes breathe at a much
    // quieter range so they read as background structure.
    const primaryBreathe = 0.62 + Math.sin(clock.elapsedTime * 0.4) * 0.15;
    const secondaryBreathe = 0.22 + Math.sin(clock.elapsedTime * 0.4) * 0.06;
    segments.forEach((seg, i) => {
      const mat = materialRefs.current[i];
      if (mat) mat.opacity = seg.secondary ? secondaryBreathe : primaryBreathe;
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
          color={seg.secondary ? "#c9d6ea" : "#f6dfa0"}
          lineWidth={seg.secondary ? 1 : 1.8}
          transparent
          opacity={seg.secondary ? 0.25 : 0.65}
        />
      ))}
    </group>
  );
}
