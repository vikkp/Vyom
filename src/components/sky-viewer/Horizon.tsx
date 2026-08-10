import { Html } from "@react-three/drei";
import { altAzToVector3 } from "../../utils/astronomy";

const DIRECTIONS: Array<{ label: string; az: number }> = [
  { label: "N", az: 0 },
  { label: "E", az: 90 },
  { label: "S", az: 180 },
  { label: "W", az: 270 },
];

/**
 * A simple ground disc plus cardinal-direction labels, so the viewer has a
 * horizon reference while looking up at the dome — matching the "Walk the
 * Sky" framing of standing somewhere real and looking up.
 */
export function Horizon() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[95, 64]} />
        <meshBasicMaterial color="#050614" transparent opacity={0.85} depthWrite={false} />
      </mesh>
      {DIRECTIONS.map(({ label, az }) => {
        const pos = altAzToVector3(0, az, 92);
        return (
          <Html key={label} position={[pos.x, 0.2, pos.z]} center distanceFactor={40} style={{ pointerEvents: "none" }}>
            <div className="text-xs tracking-widest text-white/40">{label}</div>
          </Html>
        );
      })}
    </group>
  );
}
