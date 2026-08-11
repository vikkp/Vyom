import { useMemo } from "react";
import { DoubleSide } from "three";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { getCitySkyline } from "../../data/skylines";
import { makeSkylineTexture } from "./skylineTexture";
import { DOME_RADIUS, GROUND_CURVE_RADIUS } from "./constants";

const BAND_RADIUS = DOME_RADIUS + 2;
const BAND_HEIGHT = 4;

function curveDrop(distance: number): number {
  return (distance * distance) / (2 * GROUND_CURVE_RADIUS);
}

/**
 * ADR0003: a per-city skyline silhouette, wrapped around the full
 * 360-degree horizon as a cylindrical band (not a flat backdrop), so it
 * genuinely stays locked to its real-world compass direction as the
 * camera pans, the same way the ground and stars do.
 *
 * Azimuth-to-geometry alignment isn't a guess: Three's CylinderGeometry
 * places a vertex at u (0-1 around the circumference) at
 * x = radius*sin(u*2*PI), z = radius*cos(u*2*PI) with the default
 * thetaStart=0 -- which is the exact same x = r*sin(az), z = r*cos(az)
 * formula altAzToVector3 uses for azimuth. So mapping texture U
 * directly to azimuth/360 (done in skylineTexture.ts) lines up with
 * true compass direction with no extra rotation offset needed.
 *
 * Vertically: CylinderGeometry's default UV has v=1 at the geometry's
 * top and v=0 at its bottom; combined with CanvasTexture's default
 * flipY, that samples the *top* of the source canvas at the band's
 * top. The skyline texture draws buildings anchored near the bottom of
 * the canvas with empty space above their peaks, so this lines up
 * correctly without a manual flip: silhouettes sit low on the band,
 * open sky above.
 *
 * Rendered as a hard alpha cutout (alphaTest, not blended transparency)
 * so it's a real opaque occluder for anything behind it — a skyline
 * should block stars low on the horizon behind buildings, the same way
 * the ground occludes stars below it.
 */
export function CitySkyline() {
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const skyline = useMemo(() => getCitySkyline(selectedCity.id), [selectedCity.id]);
  const texture = useMemo(() => (skyline ? makeSkylineTexture(skyline) : null), [skyline]);

  if (!texture) return null;

  const baseY = -curveDrop(BAND_RADIUS);

  return (
    <mesh position={[0, baseY + BAND_HEIGHT / 2, 0]}>
      <cylinderGeometry args={[BAND_RADIUS, BAND_RADIUS, BAND_HEIGHT, 96, 1, true]} />
      <meshBasicMaterial map={texture} alphaTest={0.5} side={DoubleSide} depthWrite toneMapped={false} />
    </mesh>
  );
}
