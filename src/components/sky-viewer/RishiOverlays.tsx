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
  const figureTexture = useOptionalTexture(star.nodeId ? `/rishis/${star.nodeId}.png` : "");

  const position = useMemo(() => altAzToVector3(alt, az, DOME_RADIUS - 1), [alt, az]);

  useFrame(({ clock }) => {
    const breathe = 0.4 + Math.sin(clock.elapsedTime * 0.6 + star.ra) * 0.06;
    const glowMaterial = glowRef.current?.material as { opacity: number } | undefined;
    if (glowMaterial) glowMaterial.opacity = figureTexture ? (isActive ? 0.5 : 0.28) : isActive ? 0.75 : breathe;
    const figureMaterial = figureRef.current?.material as { opacity: number } | undefined;
    if (figureMaterial) figureMaterial.opacity = isActive ? 0.85 : 0.55;
  });

  // Large, semi-transparent, sitting over the whole star rather than a
  // tight badge next to it — closer to how SkyGuide overlays a
  // constellation figure across the stars it belongs to.
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
        <mesh ref={glowRef} position={[0, 0, -0.01]}>
          <planeGeometry args={[figureTexture ? 9 : 6.5, figureTexture ? 10.5 : 8.5]} />
          <meshBasicMaterial
            map={glowTexture}
            color={isActive ? "#ffe6b8" : RISHI_GLOW_COLOR}
            transparent
            opacity={0.4}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        {figureTexture && (
          <mesh ref={figureRef}>
            <planeGeometry args={[7, 7]} />
            <meshBasicMaterial map={figureTexture} transparent opacity={0.55} depthWrite={false} toneMapped={false} />
          </mesh>
        )}
        <Html position={[0, figureTexture ? -5.5 : -4.8, 0]} distanceFactor={40} center style={{ pointerEvents: "none" }}>
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

  const visible = useMemo(() => {
    return stars
      .map((star) => {
        const { alt, az } = raDecToAltAz(star.ra, star.dec, selectedCity.lat, selectedCity.lon, currentDate);
        return { star, alt, az };
      })
      .filter(({ alt }) => alt > -5);
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
