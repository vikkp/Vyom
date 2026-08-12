import { useMemo } from "react";
import { DoubleSide } from "three";
import { makeGroundGlowTexture } from "./groundTexture";
import { makeCurvedGroundGeometry, makeCurvedRingGeometry } from "./curvedGround";
import { DOME_RADIUS, GROUND_CURVE_RADIUS } from "./constants";

/**
 * A dark ground silhouette with a soft warm atmospheric glow fading in
 * toward the horizon line (like distant city light / airglow) — matching
 * the "Walk the Sky" framing of standing somewhere real and looking up.
 *
 * The ground disc writes depth (depthWrite: true) so it properly occludes
 * any star/line/overlay geometry that has dipped below the horizon,
 * instead of relying on an artificial per-object altitude cutoff
 * elsewhere — real z-buffer occlusion, like an actual horizon.
 *
 * Cardinal-direction labels used to live here as in-sky billboard text at
 * the horizon, but at a distance and low opacity they read as faint,
 * artifact-like smudges rather than clean letters (flagged directly by
 * the project owner). They've been replaced by a proper top-right
 * Compass HUD widget (see Compass.tsx + CompassHeadingTracker.tsx) —
 * a fixed-position, always-legible heading indicator instead of
 * something floating in the 3D scene.
 *
 * ADR0003: the ground disc and its glow ring are no longer flat — both
 * use makeCurvedGroundGeometry/makeCurvedRingGeometry, which radially
 * droop the mesh away from y=0 with distance (a stylized "standing on a
 * sphere" curve, magnitude set by the single GROUND_CURVE_RADIUS
 * constant).
 */
export function Horizon() {
  const groundTexture = useMemo(() => makeGroundGlowTexture("#020208", "#86a8dd"), []);
  const groundGeometry = useMemo(
    () => makeCurvedGroundGeometry(DOME_RADIUS + 5, GROUND_CURVE_RADIUS),
    [],
  );
  const ringGeometry = useMemo(
    () => makeCurvedRingGeometry(DOME_RADIUS - 9, DOME_RADIUS + 3, GROUND_CURVE_RADIUS),
    [],
  );

  return (
    <group>
      {/* Ground silhouette with a built-in soft glow toward its rim (the
          part that sits right at the visual horizon), instead of a flat
          color plus a separate hard-edged ring. depthWrite is on so this
          genuinely occludes anything below the horizon. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} geometry={groundGeometry}>
        <meshBasicMaterial map={groundTexture} depthWrite />
      </mesh>

      {/* A little extra soft glow right at the boundary itself, matched
          to SkyGradient's horizon glow band so the ground-side and
          sky-side glow read as one continuous ring, not two different
          effects meeting at a seam. */}
      {/* Visual polish pass: stronger horizon glow (was 0.4 opacity,
          #7fa3dd) to match SkyGradient's strengthened glow band so the
          two read as one continuous, more pronounced ring. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} geometry={ringGeometry}>
        <meshBasicMaterial color="#86a8dd" transparent opacity={0.55} depthWrite={false} side={DoubleSide} />
      </mesh>

    </group>
  );
}
