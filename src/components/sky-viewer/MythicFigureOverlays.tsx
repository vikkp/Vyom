import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { Vector3, type Mesh } from "three";
import type { SkyCatalogStar } from "../../types/skyViewer";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { makeGlowTexture } from "../sky/glowTexture";
import { useOptionalTexture } from "../sky/useOptionalTexture";
import {
  makeDeerHunterSilhouette,
  makeOxCartSilhouette,
  makeKrittikaSilhouette,
  makeDhruvaSilhouette,
} from "./mythicFigureSilhouette";
import { DOME_RADIUS } from "./constants";

const FIGURE_GLOW_COLOR = "#ffcf8a";

interface MythicFigureDef {
  /** Graph node id -- clicking the figure selects this node, same as a star. */
  nodeId: string;
  /** Stars averaged together (in 3D) to place the figure near its asterism. */
  anchorStarIds: string[];
  makeTexture: (color: string) => ReturnType<typeof makeDeerHunterSilhouette>;
  /** World-unit plane size, matching each silhouette's canvas aspect. */
  size: [number, number];
  label: string;
}

// ADR0003 priority table's "Figure Direction" column, built as the same
// kind of procedural placeholder art the Rishis used before real portraits
// existed -- see docs/research/*-figure-sources.md for each figure's
// mythological basis and the ADR0003 clarification on Rohini's symbol
// (traditional ox-cart, not literally a cow).
const MYTHIC_FIGURES: MythicFigureDef[] = [
  {
    nodeId: "mrigashira",
    anchorStarIds: ["meissa", "phi1-orionis", "phi2-orionis"],
    makeTexture: makeDeerHunterSilhouette,
    size: [5.2, 3.7],
    label: "Mrigashira",
  },
  {
    nodeId: "rohini",
    anchorStarIds: ["epsilon-tauri", "delta1-tauri", "gamma-tauri", "theta2-tauri", "aldebaran"],
    makeTexture: makeOxCartSilhouette,
    size: [5.6, 3.36],
    label: "Rohini",
  },
  {
    nodeId: "krittika",
    anchorStarIds: ["merope", "electra", "taygeta", "maia", "alcyone", "atlas"],
    makeTexture: makeKrittikaSilhouette,
    size: [3.6, 4.08],
    label: "Krittika",
  },
  {
    nodeId: "dhruva-tara",
    anchorStarIds: ["polaris"],
    makeTexture: makeDhruvaSilhouette,
    size: [3.0, 3.75],
    label: "Dhruva",
  },
];

interface MythicFigureProps {
  def: MythicFigureDef;
  position: Vector3;
}

function MythicFigure({ def, position }: MythicFigureProps) {
  const glowRef = useRef<Mesh>(null);
  const figureRef = useRef<Mesh>(null);
  const select = useGraphStore((s) => s.select);
  const selectedId = useGraphStore((s) => s.selectedId);

  const isActive = selectedId === def.nodeId;
  const glowTexture = useMemo(() => makeGlowTexture(FIGURE_GLOW_COLOR), []);
  // Real character art, once dropped into public/mythic-figures/<nodeId>.png,
  // is picked up automatically and takes priority -- same mechanism as the
  // Rishi portraits in RishiOverlays.tsx.
  const figureTexture = useOptionalTexture(`/mythic-figures/${def.nodeId}.png`);
  const silhouetteTexture = useMemo(() => def.makeTexture(FIGURE_GLOW_COLOR), [def]);
  const displayTexture = figureTexture ?? silhouetteTexture;

  useFrame(({ clock }) => {
    const breathe = 0.1 + Math.sin(clock.elapsedTime * 0.55 + position.x) * 0.025;
    const glowMaterial = glowRef.current?.material as { opacity: number } | undefined;
    if (glowMaterial) glowMaterial.opacity = isActive ? 0.3 : breathe;
    const figureMaterial = figureRef.current?.material as { opacity: number } | undefined;
    if (figureMaterial) figureMaterial.opacity = isActive ? 0.5 : 0.3;
  });

  const [w, h] = def.size;

  return (
    <group
      position={[position.x, position.y, position.z]}
      onClick={(e) => {
        e.stopPropagation();
        select(def.nodeId);
      }}
      onPointerOver={(e) => (e.stopPropagation(), (document.body.style.cursor = "pointer"))}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <Billboard>
        <mesh ref={glowRef} position={[0, 0, -0.02]}>
          <planeGeometry args={[w * 1.3, h * 1.3]} />
          <meshBasicMaterial
            map={glowTexture}
            color={isActive ? "#ffe6b8" : FIGURE_GLOW_COLOR}
            transparent
            opacity={0.18}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={figureRef} position={[0, 0, -0.01]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={displayTexture} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
        </mesh>
        <Html position={[0, -h * 0.62, 0]} distanceFactor={40} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap text-xs tracking-wide text-amber-100/85">{def.label}</div>
        </Html>
      </Billboard>
    </group>
  );
}

interface MythicFigureOverlaysProps {
  stars: SkyCatalogStar[];
}

/**
 * The four mythic figures from ADR0003's asterism priority table (deer/
 * hunter, ox-cart, Krittika sisters, young Dhruva), each anchored near its
 * asterism by averaging the 3D positions of that asterism's member stars --
 * a simple, correct-enough approximation of a spherical centroid for
 * clusters this angularly small. Rendered on the same "overlays" layer as
 * the Rishis, at lower baseline opacity, so they read as quiet accents
 * around the smaller/newer asterisms rather than competing with the
 * Saptarishi as the sky's visual centrepiece.
 */
export function MythicFigureOverlays({ stars }: MythicFigureOverlaysProps) {
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);

  const starsById = useMemo(() => new Map(stars.map((s) => [s.id, s])), [stars]);

  const placed = useMemo(() => {
    return MYTHIC_FIGURES.map((def) => {
      const sum = new Vector3();
      let count = 0;
      for (const id of def.anchorStarIds) {
        const star = starsById.get(id);
        if (!star) continue;
        const { alt, az } = raDecToAltAz(star.ra, star.dec, selectedCity.lat, selectedCity.lon, currentDate);
        sum.add(altAzToVector3(alt, az, DOME_RADIUS - 1));
        count++;
      }
      if (count === 0) return null;
      // Re-normalise the averaged point back onto the sphere the figures
      // live on, rather than leaving it pulled slightly inward by the
      // average of several unit-radius vectors.
      const position = sum.divideScalar(count).normalize().multiplyScalar(DOME_RADIUS - 1);
      return { def, position };
    }).filter((v): v is { def: MythicFigureDef; position: Vector3 } => v !== null);
  }, [starsById, selectedCity, currentDate]);

  if (!visibleLayers.has("overlays")) return null;

  return (
    <group>
      {placed.map(({ def, position }) => (
        <MythicFigure key={def.nodeId} def={def} position={position} />
      ))}
    </group>
  );
}
