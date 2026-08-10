import { Line } from "@react-three/drei";
import { SAPTARISHI_STARS, DHRUVA, SKY_STARS } from "../../data/stars";
import { SAPTARISHI_LINES } from "../../data/constellations";
import { StarField } from "./StarField";
import { ConstellationLines } from "./ConstellationLines";
import { RishiOverlay } from "./RishiOverlay";

const SKY_RADIUS = 16;
const AXIS_LENGTH = 30;

/**
 * The real-sky layer: Dhruva Tārā anchored at the local origin (matching
 * the rest of the scene), the seven Saptarishi stars positioned with their
 * true relative geometry (the actual shape of the Big Dipper), the
 * asterism lines connecting them, and the Rishi overlay figures.
 */
export function CelestialSphere() {
  return (
    <group>
      <StarField stars={SKY_STARS} anchor={DHRUVA} radius={SKY_RADIUS} />
      <ConstellationLines stars={SAPTARISHI_STARS} lines={SAPTARISHI_LINES} anchor={DHRUVA} radius={SKY_RADIUS} />
      <RishiOverlay stars={SAPTARISHI_STARS} anchor={DHRUVA} radius={SKY_RADIUS} />

      {/* Faint "axis of the world" through Dhruva Tārā */}
      <Line
        points={[
          [0, -AXIS_LENGTH, 0],
          [0, AXIS_LENGTH, 0],
        ]}
        color="#fff4d6"
        transparent
        opacity={0.06}
        lineWidth={1}
      />
    </group>
  );
}
