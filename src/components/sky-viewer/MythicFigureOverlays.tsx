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
  /** World-unit plane size for the procedural placeholder (its own aspect). */
  placeholderSize: [number, number];
  /**
   * World-unit plane size for the real PNG at public/mythic-figures/<nodeId>.png,
   * matched to that image's actual aspect ratio so it doesn't stretch --
   * measured from the delivered art (mrigashira/dhruva-tara are 784x1168
   * portraits, rohini/krittika are 1168x784 landscapes).
   */
  realSize: [number, number];
  label: string;
}

// ADR0003 priority table's "Figure Direction" column. Each figure now has
// real character art (public/mythic-figures/<nodeId>.png, chroma-keyed from
// a green-screen source the same way the Rishi PNGs were dropped in); the
// procedural makeTexture() drawings remain as the fallback if that file is
// ever missing. See docs/research/*-figure-sources.md for each figure's
// mythological basis and the ADR0003 clarification on Rohini's symbol
// (traditional ox-cart, not literally a cow).
const MYTHIC_FIGURES: MythicFigureDef[] = [
  {
    nodeId: "mrigashira",
    anchorStarIds: ["meissa", "phi1-orionis", "phi2-orionis"],
    makeTexture: makeDeerHunterSilhouette,
    placeholderSize: [5.2, 3.7],
    realSize: [4.6, 6.85],
    label: "Mrigashira",
  },
  {
    nodeId: "rohini",
    anchorStarIds: ["epsilon-tauri", "delta1-tauri", "gamma-tauri", "theta2-tauri", "aldebaran"],
    makeTexture: makeOxCartSilhouette,
    placeholderSize: [5.6, 3.36],
    realSize: [6.2, 4.16],
    label: "Rohini",
  },
  {
    nodeId: "krittika",
    anchorStarIds: ["merope", "electra", "taygeta", "maia", "alcyone", "atlas"],
    makeTexture: makeKrittikaSilhouette,
    placeholderSize: [3.6, 4.08],
    realSize: [6.2, 4.16],
    label: "Krittika",
  },
  {
    nodeId: "dhruva-tara",
    anchorStarIds: ["polaris"],
    makeTexture: makeDhruvaSilhouette,
    placeholderSize: [3.0, 3.75],
    realSize: [3.4, 5.07],
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

  // Baseline opacity matches the Rishi portraits (0.35/0.52) now that real
  // character art exists here too -- the earlier, dimmer "quiet accent"
  // treatment was calibrated for the crude procedural placeholder, not for
  // finished artwork.
  useFrame(({ clock }) => {
    const breathe = 0.13 + Math.sin(clock.elapsedTime * 0.55 + position.x) * 0.03;
    const glowMaterial = glowRef.current?.material as { opacity: number } | undefined;
    if (glowMaterial) glowMaterial.opacity = isActive ? 0.34 : breathe;
    const figureMaterial = figureRef.current?.material as { opacity: number } | undefined;
    if (figureMaterial) figureMaterial.opacity = isActive ? 0.52 : 0.35;
  });

  const [w, h] = figureTexture ? def.realSize : def.placeholderSize;

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
            opacity={0.2}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={figureRef} position={[0, 0, -0.01]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={displayTexture} transparent opacity={0.35} depthWrite={false} toneMapped={false} />
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
 * the Rishis, with matching opacity now that both have real character art --
 * see the plane-size comment above for why placeholder and real art use
 * different sizes.
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
