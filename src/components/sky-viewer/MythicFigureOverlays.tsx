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
  makeAshwiniKumarasSilhouette,
  makeMaghaThroneSilhouette,
  makeJyeshthaTalismanSilhouette,
  makeArdraTeardropSilhouette,
  makePunarvasuBowSilhouette,
  makePushyaLotusSilhouette,
} from "./mythicFigureSilhouette";
import { DOME_RADIUS, sizeForAspect } from "./constants";

// Real image pixel dimensions (measured from the delivered PNGs), used only
// to derive an aspect ratio -- sizeForAspect solves the actual world-unit
// plane size at the shared FIGURE_TARGET_AREA (see constants.ts), so every
// figure occupies the same visual footprint despite portrait vs. landscape
// source art.
const PORTRAIT_ASPECT = 784 / 1168; // Mrigashira, Dhruva
const LANDSCAPE_ASPECT = 1168 / 784; // Rohini, Krittika

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
  /**
   * Where in the real image (0 = top edge, 0.5 = vertical centre, 1 = bottom
   * edge) the anchor star should land, for compositions where the subject
   * isn't centred in its frame. Measured from the actual art, not guessed --
   * same approach as the Rishi anchor offsets. Defaults to 0.5 (plane
   * centred on the star) when omitted, which is correct for the other three
   * figures' more centred compositions.
   */
  realAnchorFrac?: number;
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
    realSize: sizeForAspect(PORTRAIT_ASPECT),
    // The delivered art is a diagonal leaping pose with the head/antlers
    // (the "deer's head" the asterism is named for) high in the frame --
    // measured at ~26% down from the top (row ~300 of 1168px), not centre.
    // Anchoring on the plane's geometric centre left the head floating well
    // above Meissa instead of resting on it.
    realAnchorFrac: 0.26,
    label: "Mrigashira",
  },
  {
    nodeId: "rohini",
    anchorStarIds: ["epsilon-tauri", "delta1-tauri", "gamma-tauri", "theta2-tauri", "aldebaran"],
    makeTexture: makeOxCartSilhouette,
    placeholderSize: [5.6, 3.36],
    realSize: sizeForAspect(LANDSCAPE_ASPECT),
    label: "Rohini",
  },
  {
    nodeId: "krittika",
    anchorStarIds: ["merope", "electra", "taygeta", "maia", "alcyone", "atlas"],
    makeTexture: makeKrittikaSilhouette,
    placeholderSize: [3.6, 4.08],
    realSize: sizeForAspect(LANDSCAPE_ASPECT),
    label: "Krittika",
  },
  {
    nodeId: "dhruva-tara",
    anchorStarIds: ["polaris"],
    makeTexture: makeDhruvaSilhouette,
    placeholderSize: [3.0, 3.75],
    realSize: sizeForAspect(PORTRAIT_ASPECT),
    label: "Dhruva",
  },
  // Second batch: Ashwini, Magha, Jyeshtha. Same "stars + lines first"
  // rule applied earlier -- these three shipped as data before their
  // figures. Real art has since landed for all three (see
  // docs/research/*-figure-sources.md); realSize below is measured from
  // the actual delivered pixel dimensions, same as the first batch.
  {
    nodeId: "ashwini",
    anchorStarIds: ["sheratan", "mesarthim"],
    makeTexture: makeAshwiniKumarasSilhouette,
    placeholderSize: [5.2, 3.6],
    realSize: sizeForAspect(1712 / 1152),
    label: "Ashwini",
  },
  {
    nodeId: "magha",
    anchorStarIds: ["rho-leonis", "31-leonis", "omicron-leonis", "regulus", "eta-leonis", "algieba"],
    makeTexture: makeMaghaThroneSilhouette,
    placeholderSize: [3.6, 4.7],
    realSize: sizeForAspect(784 / 1168),
    label: "Magha",
  },
  {
    nodeId: "jyeshtha",
    anchorStarIds: ["sigma-scorpii", "antares", "tau-scorpii"],
    makeTexture: makeJyeshthaTalismanSilhouette,
    placeholderSize: [2.9, 3.9],
    realSize: sizeForAspect(PORTRAIT_ASPECT),
    label: "Jyeshtha",
  },
  // Third batch: Ardra, Punarvasu, Pushya -- placeholders only, real art
  // pending (per the project owner, generated after this batch ships). No
  // real PNGs exist yet, so realSize below is a guess from each
  // silhouette's own canvas aspect, same as the earlier batches' initial
  // placeholder-only state -- update to measured pixel dimensions once
  // real art lands, same as Ashwini/Magha/Jyeshtha did.
  {
    nodeId: "ardra",
    anchorStarIds: ["betelgeuse"],
    makeTexture: makeArdraTeardropSilhouette,
    placeholderSize: [3.1, 4.0],
    realSize: sizeForAspect(220 / 280),
    label: "Ardra",
  },
  {
    nodeId: "punarvasu",
    anchorStarIds: ["pollux", "castor"],
    makeTexture: makePunarvasuBowSilhouette,
    placeholderSize: [4.3, 3.7],
    realSize: sizeForAspect(300 / 260),
    label: "Punarvasu",
  },
  {
    nodeId: "pushya",
    anchorStarIds: ["asellus-australis", "asellus-borealis", "theta-cancri"],
    makeTexture: makePushyaLotusSilhouette,
    placeholderSize: [3.7, 4.0],
    realSize: sizeForAspect(260 / 280),
    label: "Pushya",
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

  // Visual polish pass: figure opacity raised into the 0.65-0.75 range
  // (was 0.35 baseline) to match the Rishi treatment -- both figure sets
  // should read as present, elegant constellation artwork rather than a
  // faint ghost. The glow aura underneath stays at its previous, more
  // subtle level.
  useFrame(({ clock }) => {
    const breathe = 0.13 + Math.sin(clock.elapsedTime * 0.55 + position.x) * 0.03;
    const glowMaterial = glowRef.current?.material as { opacity: number } | undefined;
    if (glowMaterial) glowMaterial.opacity = isActive ? 0.34 : breathe;
    const figureMaterial = figureRef.current?.material as { opacity: number } | undefined;
    if (figureMaterial) figureMaterial.opacity = isActive ? 0.85 : 0.7;
  });

  const [w, h] = figureTexture ? def.realSize : def.placeholderSize;
  // When a real image supplies a non-centred realAnchorFrac, shift the
  // whole billboard content vertically so that point in the image (not the
  // plane's geometric centre) lands on the anchor star. See realAnchorFrac's
  // doc comment above.
  const anchorFrac = figureTexture ? (def.realAnchorFrac ?? 0.5) : 0.5;
  const contentOffsetY = h * (anchorFrac - 0.5);

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
        <mesh ref={glowRef} position={[0, contentOffsetY, -0.02]}>
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
        <mesh ref={figureRef} position={[0, contentOffsetY, -0.01]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={displayTexture} transparent opacity={0.7} depthWrite={false} toneMapped={false} />
        </mesh>
        <Html position={[0, contentOffsetY - h * 0.62, 0]} distanceFactor={40} center style={{ pointerEvents: "none" }}>
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
