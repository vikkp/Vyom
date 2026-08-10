import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import type { Mesh } from "three";
import type { Star } from "../../types/celestial";
import { raDecToVectorRelative } from "../../utils/celestial";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyStore } from "../../store/skyStore";
import { makeGlowTexture } from "./glowTexture";
import { useOptionalTexture } from "./useOptionalTexture";

// v1 falls back to an ethereal saffron/gold glow + name label wherever a
// real figure texture hasn't been dropped in yet. Add
// public/rishis/<rishiId>.png (transparent PNG, e.g. 1024x1024/2048x2048 —
// matches the seven prompts for Kratu, Pulaha, Pulastya, Atri, Angiras,
// Vashishtha, Marichi) and it's picked up automatically, no code changes.
const RISHI_GLOW_COLOR = "#ffcf8a";

interface RishiFigureProps {
  star: Star;
  position: [number, number, number];
}

function RishiFigure({ star, position }: RishiFigureProps) {
  const glowRef = useRef<Mesh>(null);
  const figureRef = useRef<Mesh>(null);
  const select = useGraphStore((s) => s.select);
  const selectedId = useGraphStore((s) => s.selectedId);
  const hoveredStarId = useSkyStore((s) => s.hoveredStarId);
  const hoverStar = useSkyStore((s) => s.hoverStar);

  const isActive = selectedId === star.rishiId || hoveredStarId === star.id;
  const glowTexture = useMemo(() => makeGlowTexture(RISHI_GLOW_COLOR), []);
  const figureTexture = useOptionalTexture(`/rishis/${star.rishiId}.png`);

  useFrame(({ clock }) => {
    const breathe = 0.72 + Math.sin(clock.elapsedTime * 0.8 + star.ra) * 0.08;
    const glowMaterial = glowRef.current?.material as { opacity: number } | undefined;
    if (glowMaterial) glowMaterial.opacity = figureTexture ? (isActive ? 0.55 : 0.32) : isActive ? 0.95 : breathe;
    const figureMaterial = figureRef.current?.material as { opacity: number } | undefined;
    if (figureMaterial) figureMaterial.opacity = isActive ? 0.95 : 0.8;
  });

  // Offset upward from the star so the figure reads as seated above it.
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
        {/* Golden aura — sits behind the figure (or stands alone as the placeholder). */}
        <mesh ref={glowRef} position={[0, 0, -0.01]}>
          <planeGeometry args={[figureTexture ? 2.4 : 1.6, figureTexture ? 2.8 : 2.2]} />
          <meshBasicMaterial
            map={glowTexture}
            color={isActive ? "#ffe6b8" : RISHI_GLOW_COLOR}
            transparent
            opacity={0.75}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {figureTexture && (
          <mesh ref={figureRef}>
            <planeGeometry args={[1.8, 1.8]} />
            <meshBasicMaterial map={figureTexture} transparent opacity={0.8} depthWrite={false} toneMapped={false} />
          </mesh>
        )}

        <Html position={[0, figureTexture ? -1.5 : -1.3, 0]} distanceFactor={20} center style={{ pointerEvents: "none" }}>
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
