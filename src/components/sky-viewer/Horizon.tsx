import { useMemo } from "react";
import { Billboard, Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { altAzToVector3 } from "../../utils/astronomy";
import { makeGroundGlowTexture } from "./groundTexture";
import { DOME_RADIUS } from "./constants";

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
 */
export function Horizon() {
  const groundTexture = useMemo(() => makeGroundGlowTexture("#020208", "#22406f"), []);

  return (
    <group>
      {/* Ground silhouette with a built-in soft glow toward its rim (the
          part that sits right at the visual horizon), instead of a flat
          color plus a separate hard-edged ring. depthWrite is on so this
          genuinely occludes anything below the horizon. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[DOME_RADIUS + 5, 64]} />
        <meshBasicMaterial map={groundTexture} depthWrite />
      </mesh>

      {/* A little extra soft glow right at the boundary itself, additive
          so it blends rather than hard-edges against the sky. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[DOME_RADIUS - 8, DOME_RADIUS + 3, 64]} />
        <meshBasicMaterial color="#2a4d8a" transparent opacity={0.18} depthWrite={false} side={DoubleSide} />
      </mesh>

      {DIRECTIONS.map(({ label, az }) => {
        const pos = altAzToVector3(0, az, DOME_RADIUS + 2);
        return (
          <Billboard key={label} position={[pos.x, 0.4, pos.z]}>
            <Text fontSize={1.1} color="#ffffff" fillOpacity={0.4} anchorX="center" anchorY="middle">
              {label}
            </Text>
          </Billboard>
        );
      })}
    </group>
  );
}
