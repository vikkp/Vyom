import { OrbitControls, Stars } from "@react-three/drei";
import { useGraphStore } from "../store/useGraphStore";
import { NodeMesh } from "./NodeMesh";
import { EdgeLines } from "./EdgeLines";
import { CelestialSphere } from "../components/sky/CelestialSphere";

export function CelestialScene() {
  const nodes = useGraphStore((s) => s.nodes);
  const positions = useGraphStore((s) => s.positions);
  const select = useGraphStore((s) => s.select);

  return (
    <>
      {/* Deep indigo-to-black, cinematic and low-contrast — no harsh lights. */}
      <color attach="background" args={["#05061a"]} />
      <fog attach="fog" args={["#05061a", 30, 90]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={30} color="#fff4d6" distance={40} />
      <Stars radius={120} depth={60} count={4000} factor={2.5} saturation={0} fade speed={0.4} />

      <group onPointerMissed={() => select(null)}>
        {nodes.map((node) => {
          const position = positions[node.id];
          if (!position) return null;
          return <NodeMesh key={node.id} node={node} position={position} />;
        })}
        <EdgeLines />
        <CelestialSphere />
      </group>

      <OrbitControls
        enablePan
        minDistance={4}
        maxDistance={45}
        autoRotate
        autoRotateSpeed={0.15}
      />
    </>
  );
}
