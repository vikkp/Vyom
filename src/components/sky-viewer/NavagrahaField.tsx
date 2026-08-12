import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import type { Group } from "three";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { computeNavagrahaPositions } from "../../utils/planetaryPositions";
import { NAVAGRAHA, type NavagrahaDef } from "../../data/navagraha";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { makeGlowTexture } from "../sky/glowTexture";
import { DOME_RADIUS } from "./constants";

// A normal named catalog star's glow plane is size*2.4 with size derived
// from magnitudeToSize (StarField.tsx) -- roughly 0.32-0.75 for named
// stars. BASE_POINT_SIZE * a Graha's own sizeScale lands comfortably
// above that whole range, so every Graha reads as visibly larger than
// any fixed star even before its glow is considered.
const BASE_POINT_SIZE = 0.85;

interface NavagrahaPointProps {
  def: NavagrahaDef;
  alt: number;
  az: number;
}

function NavagrahaPoint({ def, alt, az }: NavagrahaPointProps) {
  const groupRef = useRef<Group>(null);
  const select = useGraphStore((s) => s.select);
  const selectedId = useGraphStore((s) => s.selectedId);

  const position = useMemo(() => altAzToVector3(alt, az, DOME_RADIUS), [alt, az]);
  const isActive = selectedId === def.nodeId;
  const size = BASE_POINT_SIZE * def.sizeScale;
  const glowTexture = useMemo(() => makeGlowTexture(def.color), [def.color]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // A slower, gentler pulse than fixed stars (StarField's 0.5) -- these
    // are meant to read as steady, important bodies, not twinkling points.
    const pulse = 0.94 + Math.sin(clock.elapsedTime * 0.35 + def.id.length) * 0.06;
    groupRef.current.scale.setScalar((isActive ? 1.4 : 1) * pulse);
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      onClick={(e) => {
        e.stopPropagation();
        select(def.nodeId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {/* Solid core -- visually distinct from a fixed star's core by being
          larger and colored per the Graha's traditional association,
          rather than the near-uniform cool-white/warm-white palette
          StarField.tsx uses. */}
      <mesh>
        <sphereGeometry args={[size * 0.26, 16, 16]} />
        <meshBasicMaterial color={def.color} toneMapped={false} />
      </mesh>
      {/* Subtler glow halo underneath -- bigger and a touch stronger than a
          named star's (0.62 baseline in StarField.tsx), per the "subtle
          glow" spec, without overpowering the core point. */}
      <Billboard>
        <mesh>
          <planeGeometry args={[size * 3.2, size * 3.2]} />
          <meshBasicMaterial
            map={glowTexture}
            transparent
            opacity={isActive ? 0.85 : 0.68}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
      {/* Indic name is the primary, always-on label for the Navagraha
          (unlike fixed stars, which gate their label behind the "names"
          layer toggle) -- there are only nine of these, and being able
          to tell them apart at a glance is the point.
          Styled to match every other label in this app (nakshatra
          figures in MythicFigureOverlays.tsx, Rishi names in
          RishiOverlays.tsx: plain text, no background pill) rather than
          the boxed dark badge this used to be -- that badge read as
          visually inconsistent/cluttered next to the rest of the sky's
          label style. Each Graha keeps its own per-planet color (from
          def.color, matching its core/glow) so closely-clustered planets
          stay distinguishable without a background box; a drop-shadow
          keeps the text legible against a Graha's own bright glow halo,
          the one thing the other overlays don't need since they sit on
          plain dark sky. */}
      <Html distanceFactor={30} center style={{ pointerEvents: "none" }}>
        <div
          className="whitespace-nowrap text-xs font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
          style={{ color: def.color }}
        >
          {def.indianName}
        </div>
      </Html>
    </group>
  );
}

/**
 * ADR0005: the Navagraha -- Surya, Chandra, Mangala, Budha, Guru, Shukra,
 * Shani, Rahu, Ketu. Positioned by computeNavagrahaPositions() (real
 * geocentric RA/Dec for the current date, unlike every fixed star's
 * constant RA/Dec) fed through the same raDecToAltAz/altAzToVector3
 * pipeline every star already uses, so a Graha occludes behind the
 * horizon exactly like a star does. Gated by the existing "stars"
 * visibility layer -- a Graha is conceptually a bright point in the sky,
 * the same category as a star, so hiding stars reasonably hides planets
 * too rather than needing its own toggle.
 */
export function NavagrahaField() {
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);

  // Recomputed only when the date changes (not per frame) -- nine
  // Kepler-equation solves is negligible work, but there's no reason to
  // redo it on every render either.
  const positions = useMemo(() => computeNavagrahaPositions(currentDate), [currentDate]);

  const visible = useMemo(() => {
    return NAVAGRAHA.map((def) => {
      const { ra, dec } = positions[def.id];
      const { alt, az } = raDecToAltAz(ra, dec, selectedCity.lat, selectedCity.lon, currentDate);
      return { def, alt, az };
    });
  }, [positions, selectedCity, currentDate]);

  if (!visibleLayers.has("stars")) return null;

  return (
    <group>
      {visible.map(({ def, alt, az }) => (
        <NavagrahaPoint key={def.id} def={def} alt={alt} az={az} />
      ))}
    </group>
  );
}
