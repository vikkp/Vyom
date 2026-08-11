import { OrbitControls, Stars } from "@react-three/drei";
import { useGraphStore } from "../../store/useGraphStore";
import { STAR_CATALOG, SAPTARISHI_STARS } from "../../data/starCatalog";
import { ASTERISMS } from "../../data/asterisms";
import { Horizon } from "./Horizon";
import { StarField } from "./StarField";
import { AsterismLines } from "./AsterismLines";
import { RishiOverlays } from "./RishiOverlays";
import { GraphLines } from "./GraphLines";
import { SkyGradient } from "./SkyGradient";
import { DOME_RADIUS } from "./constants";

/**
 * The real-sky scene content (ADR0002): observer stands at the world
 * origin and looks around a dome of stars positioned by true Alt/Az for
 * the selected city and time. OrbitControls is used as a "look around
 * from a fixed point" panorama control — the camera orbits a near-zero
 * radius around the origin, which moves its facing direction without
 * meaningfully moving its position, since every star sits DOME_RADIUS
 * units out.
 */
export function SkyViewer() {
  const select = useGraphStore((s) => s.select);

  return (
    <>
      {/* Fallback flat colour behind the gradient dome, in case it fails to render. */}
      <color attach="background" args={["#02030a"]} />
      <ambientLight intensity={0.1} />

      <SkyGradient />
      {/* Dense background starfield (unnamed, unclickable field stars —
          distinct from the ~60 catalog stars in StarField, which carry
          the real Indian names/mythology). Three layers, not one, so
          magnitude genuinely varies across the field: a very dense faint
          layer for texture/richness, a mid layer of moderately bright
          points, and a sparse layer of a few standout bright ones —
          point sprites are cheap, so pushing the count further here
          costs little. */}
      <Stars radius={DOME_RADIUS + 20} depth={45} count={90000} factor={1.0} saturation={0} fade speed={0.1} />
      <Stars radius={DOME_RADIUS + 17} depth={38} count={12000} factor={2.4} saturation={0} fade speed={0.16} />
      <Stars radius={DOME_RADIUS + 14} depth={30} count={1200} factor={4.2} saturation={0} fade speed={0.2} />

      <group onPointerMissed={() => select(null)}>
        <StarField stars={STAR_CATALOG} />
        <AsterismLines asterisms={ASTERISMS} stars={STAR_CATALOG} />
        <RishiOverlays stars={SAPTARISHI_STARS} />
        <GraphLines stars={STAR_CATALOG} />
        <Horizon />
      </group>

      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
        minDistance={0.1}
        maxDistance={0.1}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI - 0.05}
      />
    </>
  );
}
