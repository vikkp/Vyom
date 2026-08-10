import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { MathUtils, type Group } from "three";
import type { SkyCatalogStar } from "../../types/skyViewer";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { makeGlowTexture } from "../sky/glowTexture";

const DOME_RADIUS = 90;
const COOL_WHITE = "#cfe8ff";
// A few well-known warm-toned stars, per the visual-style spec ("mostly
// cool white/blue-white, a few warmer, e.g. Dubhe").
const WARM_STARS: Record<string, string> = {
  dubhe: "#ffd9a0",
  betelgeuse: "#ffb37a",
  antares: "#ff9e78",
  aldebaran: "#ffcf9e",
  arcturus: "#ffe2a8",
};

function magnitudeToSize(mag: number): number {
  return MathUtils.mapLinear(MathUtils.clamp(mag, -1.5, 5.5), -1.5, 5.5, 0.75, 0.12);
}

interface StarPointProps {
  star: SkyCatalogStar;
  alt: number;
  az: number;
}

function StarPoint({ star, alt, az }: StarPointProps) {
  const groupRef = useRef<Group>(null);
  const select = useGraphStore((s) => s.select);
  const selectedId = useGraphStore((s) => s.selectedId);
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);

  const position = useMemo(() => altAzToVector3(alt, az, DOME_RADIUS), [alt, az]);
  const isDhruva = star.id === "polaris";
  const color = WARM_STARS[star.id] ?? COOL_WHITE;
  const size = isDhruva ? 1.1 : magnitudeToSize(star.mag);
  const isActive = star.nodeId != null && selectedId === star.nodeId;
  const glowTexture = useMemo(() => makeGlowTexture(color), [color]);
  const showNames = visibleLayers.has("names");

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const pulse = isDhruva ? 1 : 0.92 + Math.sin(clock.elapsedTime * 0.5 + star.ra) * 0.08;
    groupRef.current.scale.setScalar((isActive ? 1.5 : 1) * pulse);
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      onClick={
        star.nodeId
          ? (e) => {
              e.stopPropagation();
              select(star.nodeId!);
            }
          : undefined
      }
      onPointerOver={
        star.nodeId
          ? (e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerOut={star.nodeId ? () => (document.body.style.cursor = "auto") : undefined}
    >
      <mesh>
        <sphereGeometry args={[size * 0.22, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Billboard>
        <mesh>
          <planeGeometry args={[size * 2.4, size * 2.4]} />
          <meshBasicMaterial map={glowTexture} transparent opacity={isDhruva ? 0.9 : 0.55} depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
      {(showNames || isActive) && (star.indianName || star.westernName) && (
        <Html distanceFactor={30} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-amber-100/90">
            {star.indianName ?? star.westernName}
          </div>
        </Html>
      )}
    </group>
  );
}

interface StarFieldProps {
  stars: SkyCatalogStar[];
}

export function StarField({ stars }: StarFieldProps) {
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);

  const visible = useMemo(() => {
    return stars
      .map((star) => {
        const { alt, az } = raDecToAltAz(star.ra, star.dec, selectedCity.lat, selectedCity.lon, currentDate);
        return { star, alt, az };
      })
      .filter(({ alt }) => alt > -5); // only render stars above (or near) the horizon
  }, [stars, selectedCity, currentDate]);

  if (!visibleLayers.has("stars")) return null;

  return (
    <group>
      {visible.map(({ star, alt, az }) => (
        <StarPoint key={star.id} star={star} alt={alt} az={az} />
      ))}
    </group>
  );
}
