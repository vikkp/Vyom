import { OrbitControls, Stars } from "@react-three/drei";
import { useGraphStore } from "../../store/useGraphStore";
import { STAR_CATALOG, SAPTARISHI_STARS } from "../../data/starCatalog";
import { ASTERISMS } from "../../data/asterisms";
import { Horizon } from "./Horizon";
import { StarField } from "./StarField";
import { NavagrahaField } from "./NavagrahaField";
import { AsterismLines } from "./AsterismLines";
import { RishiOverlays } from "./RishiOverlays";
import { MythicFigureOverlays } from "./MythicFigureOverlays";
import { GraphLines } from "./GraphLines";
import { SkyGradient } from "./SkyGradient";
import { CitySkyline } from "./CitySkyline";
import { DOME_RADIUS, CAMERA_ORBIT_RADIUS } from "./constants";
import { CameraFocusController } from "./CameraFocusController";
import { FovZoomController } from "./FovZoomController";

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
      {/* Final visual-polish lock-in pass (post-27-nakshatra): another
          density bump (~1.3x on the faint/mid layers, on top of the
          earlier ~1.55x pass) so the field reads richer still without
          crowding out the bright/named layer's contrast. Left the bright
          top layer's count untouched -- it's meant to stay a sparse,
          standout accent, not get denser along with the fill layers.
          Point sprites remain cheap at this count (verified: build and
          preview both stay fast, see commit). */}
      <Stars radius={DOME_RADIUS + 20} depth={45} count={182000} factor={1.0} saturation={0} fade speed={0.1} />
      <Stars radius={DOME_RADIUS + 17} depth={38} count={23000} factor={2.4} saturation={0} fade speed={0.16} />
      <Stars radius={DOME_RADIUS + 14} depth={30} count={2000} factor={4.2} saturation={0} fade speed={0.2} />

      <group onPointerMissed={() => select(null)}>
        <StarField stars={STAR_CATALOG} />
        {/* ADR0005: the Navagraha -- unlike every star above, these move
            night to night, so they're computed fresh (planetaryPositions.ts)
            rather than looked up from the fixed catalog. */}
        <NavagrahaField />
        <AsterismLines asterisms={ASTERISMS} stars={STAR_CATALOG} />
        <RishiOverlays stars={SAPTARISHI_STARS} />
        <MythicFigureOverlays stars={STAR_CATALOG} />
        <GraphLines stars={STAR_CATALOG} />
        <Horizon />
        <CitySkyline />
      </group>

      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        // ADR0004: zoom is handled by FovZoomController (narrowing/widening
        // camera.fov) instead of OrbitControls' own distance-based zoom --
        // enableZoom stays false and min/maxDistance stay pinned equal so
        // there's nothing for the two to fight over.
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
        minDistance={CAMERA_ORBIT_RADIUS}
        maxDistance={CAMERA_ORBIT_RADIUS}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI - 0.05}
      />
      <CameraFocusController />
      <FovZoomController />
    </>
  );
}
