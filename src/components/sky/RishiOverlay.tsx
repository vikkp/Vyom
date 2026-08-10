import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { Star } from "../../types/celestial";
import { raDecToVectorRelative } from "../../utils/celestial";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyStore } from "../../store/skyStore";
import { makeGlowTexture } from "./glowTexture";

// Placeholder tier for v1: an ethereal saffron/gold glow + name label,
// anchored just above each star. This stands in for the full photorealistic
// seated-rishi figure art described in the visual spec — that needs actual
// generated character textures, which aren't available in this environment.
// Swap `RISHI_GLOW_COLOR`/this component for an <Image>/texture-mapped
// plane once real art exists; the position/selection wiring won't need to
// change.
const RISHI_GLOW_COLOR = "#ffcf8a";

interface RishiFigureProps {
  star: Star;
  position: [number, number, number];
}

function RishiFigure({ star, position }: RishiFigureProps) {
  const meshRef = useRef<Mesh>(null);
  const select = useGraphStore((s) => s.select);
  const selectedId = useGraphStore((s) => s.selectedId);
  const hoveredStarId = useSkyStore((s) => s.hoveredStarId);
  const hoverStar = useSkyStore((s) => s.hoverStar);

  const isActive = selectedId === star.rishiId || hoveredStarId === star.id;
  const glowTexture = useMemo(() => makeGlowTexture(RISHI_GLOW_COLOR), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as { opacity: number };
    const breathe = 0.72 + Math.sin(clock.elapsedTime * 0.8 + star.ra) * 0.08;
    material.opacity = isActive ? 0.95 : breathe;
  });

  // Offset upward from the star so the "figure" reads as seated above it.
  const figurePosition: [number, number, number] = [position[0], position[1] + 0.9, position[2]];

  return (
    <group
      position={figurePosition}
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
      <Billboard>
        <mesh ref={meshRef}>
          <planeGeometry args={[1.6, 2.2]} />
          <meshBasicMaterial
            map={glowTexture}
            color={isActive ? "#ffe6b8" : RISHI_GLOW_COLOR}
            transparent
            opacity={0.75}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <Html position={[0, -1.3, 0]} distanceFactor={20} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap text-[11px] tracking-wide text-amber-100/80">{star.name}</div>
        </Html>
      </Billboard>
    </group>
  );
}

interface RishiOverlayProps {
  stars: Star[];
  anchor: Star;
  radius?: number;
}

export function RishiOverlay({ stars, anchor, radius = 16 }: RishiOverlayProps) {
  const visibleLayers = useSkyStore((s) => s.visibleLayers);
  if (!visibleLayers.has("overlays")) return null;

  return (
    <group>
      {stars
        .filter((s) => s.id !== anchor.id)
        .map((star) => {
          const position = raDecToVectorRelative(star.ra, star.dec, anchor.ra, anchor.dec, radius);
          return <RishiFigure key={star.id} star={star} position={[position.x, position.y, position.z]} />;
        })}
    </group>
  );
}
