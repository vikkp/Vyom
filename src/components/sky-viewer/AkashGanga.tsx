import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Vector3, type Mesh } from "three";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { galacticToEquatorial } from "../../utils/galactic";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { makeAkashGangaTexture, AKASH_GANGA_BAND_HALF_WIDTH_DEG } from "./akashGangaTexture";
import { DOME_RADIUS } from "./constants";

const DEG = Math.PI / 180;

// Longitude/latitude grid resolution -- a couple hundred vertices total,
// negligible next to the 200k+-point background starfield, rebuilt only
// on date/location change (never per frame).
const LON_SEGMENTS = 180;
const LAT_SEGMENTS = 10;

// Sits beyond the star/figure shell (DOME_RADIUS, and DOME_RADIUS-1 for
// Rishis/mythic figures) but inside the ground disc's outer edge
// (DOME_RADIUS+5, see Horizon.tsx) -- real depth-testing then naturally
// occludes the band behind every named object and lets the horizon disc
// occlude it below the horizon, exactly like every other layer. See
// ADR0006's "Depth layering" section.
const BAND_RADIUS = DOME_RADIUS + 3;

const LABEL_FACING_THRESHOLD = Math.cos(25 * DEG);

/**
 * Builds the closed-ring band geometry: every vertex is a galactic (l, b)
 * point converted to equatorial RA/Dec (galacticToEquatorial, no date
 * dependence) and then to a world position via the exact same
 * raDecToAltAz/altAzToVector3 pipeline every star already uses, so the
 * band is "correctly oriented with the celestial sphere" for the current
 * observer and turns with the sky exactly like real stars do.
 */
function buildBandGeometry(lat: number, lon: number, date: Date): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];

  for (let row = 0; row <= LAT_SEGMENTS; row++) {
    const v = row / LAT_SEGMENTS;
    const b = AKASH_GANGA_BAND_HALF_WIDTH_DEG - v * 2 * AKASH_GANGA_BAND_HALF_WIDTH_DEG;

    for (let col = 0; col < LON_SEGMENTS; col++) {
      const u = col / LON_SEGMENTS;
      const l = u * 360;
      const { ra, dec } = galacticToEquatorial(l, b);
      const { alt, az } = raDecToAltAz(ra, dec, lat, lon, date);
      const p = altAzToVector3(alt, az, BAND_RADIUS);
      positions.push(p.x, p.y, p.z);
      uvs.push(u, v);
    }
  }

  const indices: number[] = [];
  for (let row = 0; row < LAT_SEGMENTS; row++) {
    for (let col = 0; col < LON_SEGMENTS; col++) {
      const a = row * LON_SEGMENTS + col;
      const b2 = row * LON_SEGMENTS + ((col + 1) % LON_SEGMENTS);
      const c = (row + 1) * LON_SEGMENTS + col;
      const d = (row + 1) * LON_SEGMENTS + ((col + 1) % LON_SEGMENTS);
      indices.push(a, c, b2, b2, c, d);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

/**
 * ADR0006: Akash Ganga, the Milky Way. A soft, ethereal band following
 * the true galactic plane (src/utils/galactic.ts), rendered behind every
 * other layer (Rishis, mythic figures, stars, the Navagraha) so it reads
 * as atmospheric backdrop rather than competing content. Not clickable
 * in this version, per the project owner's spec.
 */
export function AkashGanga() {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);

  const geometry = useMemo(
    () => buildBandGeometry(selectedCity.lat, selectedCity.lon, currentDate),
    [selectedCity, currentDate],
  );
  const texture = useMemo(() => makeAkashGangaTexture(), []);

  // The label sits at the band's brightest, most recognisable point --
  // the galactic center (l=0, b=0) -- recomputed alongside the geometry
  // since it depends on the same date/location projection.
  const labelPosition = useMemo(() => {
    const { ra, dec } = galacticToEquatorial(0, 0);
    const { alt, az } = raDecToAltAz(ra, dec, selectedCity.lat, selectedCity.lon, currentDate);
    return altAzToVector3(alt, az, BAND_RADIUS);
  }, [selectedCity, currentDate]);

  const labelDirection = useMemo(() => labelPosition.clone().normalize(), [labelPosition]);

  const [facingLabel, setFacingLabel] = useState(false);
  const cameraForward = useRef(new Vector3());

  useFrame(() => {
    camera.getWorldDirection(cameraForward.current);
    const isFacing = cameraForward.current.dot(labelDirection) > LABEL_FACING_THRESHOLD;
    setFacingLabel((prev) => (prev === isFacing ? prev : isFacing));
  });

  if (!visibleLayers.has("stars")) return null;

  const showLabel = visibleLayers.has("names") || facingLabel;

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} renderOrder={-500}>
        <meshBasicMaterial
          map={texture}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
          opacity={0.55}
        />
      </mesh>
      {showLabel && (
        <Billboard position={[labelPosition.x, labelPosition.y, labelPosition.z]}>
          <Html distanceFactor={40} center style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap text-xs tracking-widest text-white/60">Akash Ganga</div>
          </Html>
        </Billboard>
      )}
    </group>
  );
}
