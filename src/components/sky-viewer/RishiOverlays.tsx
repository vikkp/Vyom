import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { SkyCatalogStar } from "../../types/skyViewer";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { makeGlowTexture } from "../sky/glowTexture";
import { useOptionalTexture } from "../sky/useOptionalTexture";
import { makeRishiSilhouetteTexture } from "./rishiSilhouette";
import { DOME_RADIUS } from "./constants";

const RISHI_GLOW_COLOR = "#ffcf8a";

interface RishiFigureProps {
  star: SkyCatalogStar;
  alt: number;
  az: number;
}

function RishiFigure({ star, alt, az }: RishiFigureProps) {
  const glowRef = useRef<Mesh>(null);
  const figureRef = useRef<Mesh>(null);
  const select = useGraphStore((s) => s.select);
  const selectedId = useGraphStore((s) => s.selectedId);

  const isActive = star.nodeId != null && selectedId === star.nodeId;
  const glowTexture = useMemo(() => makeGlowTexture(RISHI_GLOW_COLOR), []);
  // Real character art, once dropped into public/rishis/<nodeId>.png, is
  // picked up automatically here and takes priority. Until then,
  // silhouetteTexture is a procedural stand-in (head + robed body,
  // soft-blurred) so the overlay reads as "a vague painted figure" rather
  // than a flat glowing circle — still not the real requested artwork,
  // just a less ugly placeholder for it.
  const figureTexture = useOptionalTexture(star.nodeId ? `/rishis/${star.nodeId}.png` : "");
  const silhouetteTexture = useMemo(() => makeRishiSilhouetteTexture(RISHI_GLOW_COLOR), []);
  const displayTexture = figureTexture ?? silhouetteTexture;

  const position = useMemo(() => altAzToVector3(alt, az, DOME_RADIUS - 1), [alt, az]);

  useFrame(({ clock }) => {
    const breathe = 0.22 + Math.sin(clock.elapsedTime * 0.6 + star.ra) * 0.05;
    const glowMaterial = glowRef.current?.material as { opacity: number } | undefined;
    if (glowMaterial) glowMaterial.opacity = isActive ? 0.45 : breathe;
    const figureMaterial = figureRef.current?.material as { opacity: number } | undefined;
    if (figureMaterial) figureMaterial.opacity = isActive ? 0.85 : 0.62;
  });

  // Large, semi-transparent, sitting over the whole star rather than a
  // tight badge next to it — closer to how SkyGuide overlays a
  // constellation figure across the stars it belongs to. The glow plane
  // is now a soft ambient backdrop behind the figure shape, not the whole
  // visual by itself.
  return (
    <group
      position={[position.x, position.y + 3.5, position.z]}
      onClick={
        star.nodeId
          ? (e) => {
              e.stopPropagation();
              select(star.nodeId!);
            }
          : undefined
      }
      onPointerOver={star.nodeId ? (e) => (e.stopPropagation(), (document.body.style.cursor = "pointer")) : undefined}
      onPointerOut={star.nodeId ? () => (document.body.style.cursor = "auto") : undefined}
    >
      <Billboard>
        <mesh ref={glowRef} position={[0, 0, -0.02]}>
          <planeGeometry args={[9, 10.5]} />
          <meshBasicMaterial
            map={glowTexture}
            color={isActive ? "#ffe6b8" : RISHI_GLOW_COLOR}
            transparent
            opacity={0.28}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={figureRef} position={[0, 0, -0.01]}>
          <planeGeometry args={figureTexture ? [7, 7] : [6, 7.8]} />
          <meshBasicMaterial map={displayTexture} transparent opacity={0.62} depthWrite={false} toneMapped={false} />
        </mesh>
        <Html position={[0, -5.5, 0]} distanceFactor={40} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap text-xs tracking-wide text-amber-100/85">{star.indianName}</div>
        </Html>
      </Billboard>
    </group>
  );
}

interface RishiOverlaysProps {
  stars: SkyCatalogStar[];
}

export function RishiOverlays({ stars }: RishiOverlaysProps) {
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);

  // No altitude filtering — same reasoning as StarField/AsterismLines: let
  // the depth-writing ground disc in Horizon.tsx occlude figures whose
  // stars have set, instead of an arbitrary cutoff popping them in/out.
  const visible = useMemo(() => {
    return stars.map((star) => {
      const { alt, az } = raDecToAltAz(star.ra, star.dec, selectedCity.lat, selectedCity.lon, currentDate);
      return { star, alt, az };
    });
  }, [stars, selectedCity, currentDate]);

  if (!visibleLayers.has("overlays")) return null;

  return (
    <group>
      {visible.map(({ star, alt, az }) => (
        <RishiFigure key={star.id} star={star} alt={alt} az={az} />
      ))}
    </group>
  );
}
