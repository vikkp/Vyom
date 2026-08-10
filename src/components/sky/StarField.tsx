import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import type { Group } from "three";
import { MathUtils } from "three";
import type { Star } from "../../types/celestial";
import { raDecToVectorRelative } from "../../utils/celestial";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyStore } from "../../store/skyStore";
import { makeGlowTexture } from "./glowTexture";

const COOL_WHITE = "#cfe8ff";

function magnitudeToSize(mag: number): number {
  // Lower magnitude = brighter = bigger, roughly matching perceived size.
  return MathUtils.mapLinear(MathUtils.clamp(mag, 1.5, 3.5), 1.5, 3.5, 0.55, 0.22);
}

interface StarPointProps {
  star: Star;
  position: [number, number, number];
}

function StarPoint({ star, position }: StarPointProps) {
  const groupRef = useRef<Group>(null);
  const select = useGraphStore((s) => s.select);
  const selectedId = useGraphStore((s) => s.selectedId);
  const hoveredStarId = useSkyStore((s) => s.hoveredStarId);
  const hoverStar = useSkyStore((s) => s.hoverStar);

  const isDhruva = star.id === "dhruva";
  const color = star.color ?? COOL_WHITE;
  const size = isDhruva ? 0.75 : magnitudeToSize(star.mag);
  const isActive = selectedId === star.rishiId || hoveredStarId === star.id;

  const glowTexture = useMemo(() => makeGlowTexture(color), [color]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Steady glow for Dhruva; a very slow, gentle breathing pulse for the rest.
    const pulse = isDhruva ? 1 : 0.9 + Math.sin(clock.elapsedTime * 0.6 + star.ra) * 0.1;
    groupRef.current.scale.setScalar((isActive ? 1.4 : 1) * pulse);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        select(star.rishiId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        hoverStar(star.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hoverStar(null);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Bright core */}
      <mesh>
        <sphereGeometry args={[size * 0.28, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* Soft glow halo */}
      <Billboard>
        <mesh>
          <planeGeometry args={[size * 2.6, size * 2.6]} />
          <meshBasicMaterial
            map={glowTexture}
            transparent
            opacity={isDhruva ? 0.9 : 0.6}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
      {isActive && (
        <Html distanceFactor={20} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-xs text-white shadow">
            {star.name}
          </div>
        </Html>
      )}
    </group>
  );
}

interface StarFieldProps {
  stars: Star[];
  anchor: Star;
  radius?: number;
}

export function StarField({ stars, anchor, radius = 16 }: StarFieldProps) {
  const visibleLayers = useSkyStore((s) => s.visibleLayers);
  if (!visibleLayers.has("stars")) return null;

  return (
    <group>
      {stars.map((star) => {
        const position = raDecToVectorRelative(star.ra, star.dec, anchor.ra, anchor.dec, radius);
        return <StarPoint key={star.id} star={star} position={[position.x, position.y, position.z]} />;
      })}
    </group>
  );
}
