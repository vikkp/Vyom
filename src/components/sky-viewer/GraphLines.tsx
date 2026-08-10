import { useMemo } from "react";
import { Line } from "@react-three/drei";
import type { SkyCatalogStar } from "../../types/skyViewer";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyViewerStore } from "../../store/skyViewerStore";

const DOME_RADIUS = 90;

/**
 * The "graph" layer: draws the existing relationship-graph edges directly
 * in the real sky, but only between pairs of objects that are both
 * currently rendered as stars (i.e. both have a nodeId in the star
 * catalog and are above the horizon). Most of graph.json's 98 edges don't
 * qualify — deities and family members aren't real stars — so this stays
 * sparse by design rather than drawing lines to nothing.
 */
interface GraphLinesProps {
  stars: SkyCatalogStar[];
}

export function GraphLines({ stars }: GraphLinesProps) {
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);
  const edges = useGraphStore((s) => s.edges);
  const selectedId = useGraphStore((s) => s.selectedId);

  const positionsByNodeId = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const star of stars) {
      if (!star.nodeId) continue;
      const { alt, az } = raDecToAltAz(star.ra, star.dec, selectedCity.lat, selectedCity.lon, currentDate);
      if (alt < -5) continue;
      const v = altAzToVector3(alt, az, DOME_RADIUS);
      map.set(star.nodeId, [v.x, v.y, v.z]);
    }
    return map;
  }, [stars, selectedCity, currentDate]);

  const segments = useMemo(() => {
    return edges
      .map((edge) => {
        const from = positionsByNodeId.get(edge.source);
        const to = positionsByNodeId.get(edge.target);
        if (!from || !to) return null;
        return { edge, from, to };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);
  }, [edges, positionsByNodeId]);

  if (!visibleLayers.has("graph")) return null;

  return (
    <group>
      {segments.map(({ edge, from, to }) => {
        const isHighlighted = selectedId != null && (edge.source === selectedId || edge.target === selectedId);
        return (
          <Line
            key={edge.id}
            points={[from, to]}
            color={isHighlighted ? "#fef08a" : "#7dd3fc"}
            transparent
            opacity={isHighlighted ? 0.85 : 0.25}
            lineWidth={isHighlighted ? 1.4 : 0.7}
          />
        );
      })}
    </group>
  );
}
