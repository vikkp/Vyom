import { useMemo } from "react";
import { BackSide, Color } from "three";
import { DOME_RADIUS } from "./constants";

const VERTEX_SHADER = `
varying vec3 vDirection;
void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
varying vec3 vDirection;
uniform vec3 zenithColor;
uniform vec3 horizonColor;
uniform vec3 groundColor;
uniform float exponent;
void main() {
  float h = vDirection.y;
  vec3 color;
  if (h >= 0.0) {
    float t = pow(1.0 - h, exponent);
    color = mix(zenithColor, horizonColor, t);
  } else {
    float t = pow(clamp(-h * 2.2, 0.0, 1.0), 0.55);
    color = mix(horizonColor, groundColor, t);
  }
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * A large inverted sphere behind everything else, giving the dome a soft
 * atmospheric gradient — deep indigo/near-black at the zenith, a faint
 * warm-blue glow near the horizon (like real sky glow / light pollution),
 * fading to solid ground below. This is what actually reads as "a sky"
 * rather than a flat black void with dots on it.
 */
export function SkyGradient() {
  const uniforms = useMemo(
    () => ({
      zenithColor: { value: new Color("#050a1c") },
      horizonColor: { value: new Color("#4a74b8") },
      groundColor: { value: new Color("#020208") },
      exponent: { value: 1.2 },
    }),
    [],
  );

  return (
    <mesh renderOrder={-1000}>
      <sphereGeometry args={[DOME_RADIUS * 3, 32, 32]} />
      <shaderMaterial
        side={BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
      />
    </mesh>
  );
}
