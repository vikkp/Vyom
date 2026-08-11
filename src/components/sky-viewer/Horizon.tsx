import { useMemo } from "react";
import { Billboard, Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { altAzToVector3 } from "../../utils/astronomy";
import { makeGroundGlowTexture } from "./groundTexture";
import { makeCurvedGroundGeometry, makeCurvedRingGeometry } from "./curvedGround";
import { DOME_RADIUS, GROUND_CURVE_RADIUS } from "./constants";

// Same sagitta approximation used to build the curved ground geometry
// (see curvedGround.ts) — used here just to drop the compass labels down
// to rest visually on the now-curved rim instead of floating above it.
function curveDrop(distance: number): number {
  return (distance * distance) / (2 * GROUND_CURVE_RADIUS);
}

const DIRECTIONS: Array<{ label: string; az: number }> = [
  { label: "N", az: 0 },
  { label: "E", az: 90 },
  { label: "S", az: 180 },
  { label: "W", az: 270 },
];

/**
 * A dark ground silhouette with a soft warm atmospheric glow fading in
 * toward the horizon line (like distant city light / airglow), with
 * cardinal-direction labels — matching the "Walk the Sky" framing of
 * standing somewhere real and looking up.
 *
 * The ground disc writes depth (depthWrite: true) so it properly occludes
 * any star/line/overlay geometry that has dipped below the horizon,
 * instead of relying on an artificial per-object altitude cutoff
 * elsewhere — real z-buffer occlusion, like an actual horizon.
 *
 * Labels use drei's <Text> (real, depth-tested geometry) rather than
 * <Html>: Html doesn't get frustum-culled the same way, so a label
 * directly behind the camera (e.g. "S" when facing north) was projecting
 * to a garbled position near screen-centre instead of just disappearing.
 *
 * ADR0003: the ground disc and its glow ring are no longer flat — both
 * use makeCurvedGroundGeometry/makeCurvedRingGeometry, which radially
 * droop the mesh away from y=0 with distance (a stylized "standing on a
 * sphere" curve, magnitude set by the single GROUND_CURVE_RADIUS
 * constant). Compass labels are nudged down by the same curve amount at
 * their radius so they still read as sitting on the rim, not floating
 * above it.
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
  const labelDrop = useMemo(() => curveDrop(DOME_RADIUS + 2), []);

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

      {DIRECTIONS.map(({ label, az }) => {
        const pos = altAzToVector3(0, az, DOME_RADIUS + 2);
        return (
          <Billboard key={label} position={[pos.x, 0.4 - labelDrop, pos.z]}>
            <Text fontSize={1.1} color="#ffffff" fillOpacity={0.4} anchorX="center" anchorY="middle">
              {label}
            </Text>
          </Billboard>
        );
      })}
    </group>
  );
}
