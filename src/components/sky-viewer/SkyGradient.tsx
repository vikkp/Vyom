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
uniform vec3 glowColor;
uniform float exponent;
void main() {
  float h = vDirection.y;
  vec3 base;
  if (h >= 0.0) {
    float t = pow(1.0 - h, exponent);
    base = mix(zenithColor, horizonColor, t);
  } else {
    float t = pow(clamp(-h * 2.2, 0.0, 1.0), 0.55);
    base = mix(horizonColor, groundColor, t);
  }
  // A concentrated glow band straddling the horizon line itself, on top
  // of the broad gradient above — a slow gradient alone reads as "faint"
  // no matter how bright its endpoint color is; a band that visibly
  // peaks right at h=0 is what actually looks like atmospheric/light-
  // pollution glow hugging the horizon.
  float band = exp(-pow(h / 0.14, 2.0));
  vec3 color = mix(base, glowColor, band * 0.85);
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * A large inverted sphere behind everything else, giving the dome a soft
 * atmospheric gradient — deep indigo/near-black at the zenith, a bright
 * warm-blue glow band hugging the horizon (like real sky glow / light
 * pollution), fading to solid ground below. This is what actually reads
 * as "a sky" rather than a flat black void with dots on it.
 */
export function SkyGradient() {
  const uniforms = useMemo(
    () => ({
      zenithColor: { value: new Color("#050a1c") },
      horizonColor: { value: new Color("#3f6bab") },
      groundColor: { value: new Color("#020208") },
      glowColor: { value: new Color("#7fa3dd") },
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
