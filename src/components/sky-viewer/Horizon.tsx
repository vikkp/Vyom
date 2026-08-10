import { Html } from "@react-three/drei";
import { DoubleSide } from "three";
import { altAzToVector3 } from "../../utils/astronomy";
import { DOME_RADIUS } from "./constants";

const DIRECTIONS: Array<{ label: string; az: number }> = [
  { label: "N", az: 0 },
  { label: "E", az: 90 },
  { label: "S", az: 180 },
  { label: "W", az: 270 },
];

/**
 * A solid black ground silhouette plus a faint warm glow ring right at the
 * horizon line (like distant city light / atmospheric haze), with
 * cardinal-direction labels — matching the "Walk the Sky" framing of
 * standing somewhere real and looking up.
 */
export function Horizon() {
  return (
    <group>
      {/* Solid ground silhouette */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[DOME_RADIUS + 5, 64]} />
        <meshBasicMaterial color="#020208" depthWrite={false} />
      </mesh>

      {/* Soft glow right at the horizon boundary */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <ringGeometry args={[DOME_RADIUS - 6, DOME_RADIUS + 5, 64]} />
        <meshBasicMaterial color="#1a2a4a" transparent opacity={0.35} depthWrite={false} side={DoubleSide} />
      </mesh>

      {DIRECTIONS.map(({ label, az }) => {
        const pos = altAzToVector3(0, az, DOME_RADIUS + 2);
        return (
          <Html key={label} position={[pos.x, 0.2, pos.z]} center distanceFactor={40} style={{ pointerEvents: "none" }}>
            <div className="text-xs tracking-widest text-white/40">{label}</div>
          </Html>
        );
      })}
    </group>
  );
}
