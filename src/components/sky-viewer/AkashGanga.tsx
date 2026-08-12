import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Matrix4,
  Quaternion,
  Vector3,
  type Mesh,
} from "three";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { galacticToEquatorial } from "../../utils/galactic";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { makeAkashGangaTexture } from "./akashGangaTexture";
import { DOME_RADIUS } from "./constants";

const DEG = Math.PI / 180;

// Full-sphere tessellation -- static (see buildSphereGeometry below), so
// there's no per-date/per-frame cost to affording a smooth grid here.
const LON_SEGMENTS = 96;
const LAT_SEGMENTS = 48;

// Sits beyond the star/figure shell (DOME_RADIUS, and DOME_RADIUS-1 for
// Rishis/mythic figures) but inside the ground disc's outer edge
// (DOME_RADIUS+5, see Horizon.tsx) -- real depth-testing then naturally
// occludes the band behind every named object and lets the horizon disc
// occlude it below the horizon, exactly like every other layer. See
// ADR0006's "Depth layering" section.
const BAND_RADIUS = DOME_RADIUS + 3;

const LABEL_FACING_THRESHOLD = Math.cos(25 * DEG);

/**
 * Builds a full sphere directly in **galactic Cartesian coordinates**
 * (u -> galactic longitude 0-360, v -> galactic latitude +90..-90) at
 * BAND_RADIUS -- a closed, watertight sphere, not an open strip. This is
 * the fix for a hard-edged "column" artifact an earlier open-ring version
 * of this mesh produced when viewed nearly edge-on: a ring with real
 * geometric width gets crossed *multiple times* by a grazing camera ray,
 * and with additive blending those overlapping layers stack into a
 * bright, sharp-edged streak. A closed sphere viewed from its centre (the
 * observer always stands at the origin here) is crossed by every ray
 * from that centre exactly once, regardless of viewing direction -- the
 * exact same property SkyGradient.tsx already relies on for its own
 * enclosing atmosphere sphere. Built once at module scope: this geometry
 * has no date/location dependence at all (unlike every other overlay in
 * this app) -- orientation is applied separately, as a single rigid
 * rotation (see useAkashGangaRotation below), not by recomputing vertex
 * positions.
 */
// Reported as a sharp, hard-edged diagonal streak cutting through the
// band (Sydney sky screenshot) -- this was a UV-seam bug in this
// function, not a texture issue. The original version reused column 0's
// vertex (u=0) for the wraparound edge at col=LON_SEGMENTS via `%
// LON_SEGMENTS`, so the seam triangles spanned UV u=(LON_SEGMENTS-1)/LON_SEGMENTS
// (~0.99) to u=0 directly. GPU UV interpolation is linear/unaware of the
// texture's wraparound, so across that one thin geometric sliver it swept
// through nearly the *entire* 0..1 texture width instead of wrapping --
// invisible while the texture was low-contrast/heavily blurred, but a
// sharp bright/dark streak once the softening-regression fix (1059427)
// restored more contrast. Fixed by giving the sphere a genuine extra
// column of vertices at u=1.0 (geometrically identical position to u=0,
// since l=360deg=0deg) instead of reusing the u=0 vertex -- every seam
// triangle now interpolates a normal, narrow UV range like every other
// triangle on the sphere.
function buildSphereGeometry(): BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const lonSteps = LON_SEGMENTS + 1;

  for (let row = 0; row <= LAT_SEGMENTS; row++) {
    const v = row / LAT_SEGMENTS;
    const bDeg = 90 - v * 180;
    const b = bDeg * DEG;

    for (let col = 0; col <= LON_SEGMENTS; col++) {
      const u = col / LON_SEGMENTS;
      const l = u * 360 * DEG;
      const x = Math.cos(b) * Math.cos(l) * BAND_RADIUS;
      const y = Math.cos(b) * Math.sin(l) * BAND_RADIUS;
      const z = Math.sin(b) * BAND_RADIUS;
      // Galactic Cartesian (x=toward l=0/b=0, y=toward l=90/b=0,
      // z=toward the north galactic pole) is remapped to this app's
      // Y-up world axes at rotation-application time, not here -- this
      // function only lays the sphere out in its own local frame.
      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  const indices: number[] = [];
  for (let row = 0; row < LAT_SEGMENTS; row++) {
    for (let col = 0; col < LON_SEGMENTS; col++) {
      const a = row * lonSteps + col;
      const b2 = row * lonSteps + col + 1;
      const c = (row + 1) * lonSteps + col;
      const d = (row + 1) * lonSteps + col + 1;
      indices.push(a, c, b2, b2, c, d);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

// Built once, ever -- see buildSphereGeometry's doc comment.
const SPHERE_GEOMETRY = buildSphereGeometry();

/**
 * Computes the single rigid rotation that takes the sphere from
 * buildSphereGeometry's local galactic frame into this app's world/dome
 * frame for the current observer (date/time/location) -- three
 * orthonormal galactic axis directions (the galactic centre, l=90/b=0,
 * and the north galactic pole), each converted to a world unit vector
 * through the exact same galacticToEquatorial -> raDecToAltAz ->
 * altAzToVector3 pipeline every individual star/point in this app
 * already uses. Because that whole chain is a composition of rotations,
 * the three results are guaranteed to stay orthonormal, so they can be
 * used directly as a rotation matrix's basis columns (Matrix4.makeBasis)
 * -- cheap (3 conversions, not one per vertex) and exact, not an
 * approximation.
 */
function computeGalacticToWorldRotation(lat: number, lon: number, date: Date): Quaternion {
  function axisDirection(lDeg: number, bDeg: number): Vector3 {
    const { ra, dec } = galacticToEquatorial(lDeg, bDeg);
    const { alt, az } = raDecToAltAz(ra, dec, lat, lon, date);
    return altAzToVector3(alt, az, 1);
  }

  const xAxis = axisDirection(0, 0); // galactic centre
  const yAxis = axisDirection(90, 0);
  const zAxis = axisDirection(0, 90); // north galactic pole

  const matrix = new Matrix4().makeBasis(xAxis, yAxis, zAxis);
  return new Quaternion().setFromRotationMatrix(matrix);
}

/**
 * ADR0006: Akash Ganga, the Milky Way. A soft, ethereal band following
 * the true galactic plane, rendered as a full enclosing sphere (see
 * buildSphereGeometry) behind every other layer (Rishis, mythic figures,
 * stars, the Navagraha) so it reads as atmospheric backdrop rather than
 * competing content. Not clickable in this version, per the project
 * owner's spec.
 */
export function AkashGanga() {
  const meshRef = useRef<Mesh>(null);
  const { camera } = useThree();
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);

  const texture = useMemo(() => makeAkashGangaTexture(), []);

  const rotation = useMemo(
    () => computeGalacticToWorldRotation(selectedCity.lat, selectedCity.lon, currentDate),
    [selectedCity, currentDate],
  );

  useEffect(() => {
    meshRef.current?.quaternion.copy(rotation);
  }, [rotation]);

  // The label sits at the band's brightest, most recognisable point --
  // the galactic center (l=0, b=0) -- recomputed alongside the rotation
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
      <mesh ref={meshRef} geometry={SPHERE_GEOMETRY} renderOrder={-500}>
        <meshBasicMaterial
          map={texture}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
          // Softening pass: nudged down from 0.55 -- the texture itself
          // (akashGangaTexture.ts) now spreads its brightness over a wider,
          // blurred area than before, so keeping the same peak opacity on
          // top of that would have made the band read as more present
          // overall even though each individual pixel is softer. Lowering
          // this keeps the band from competing with nearby Nakshatra
          // figures and the Navagraha for visual attention.
          opacity={0.46}
          // Viewed from inside a closed sphere -- DoubleSide guarantees
          // the surface is visible regardless of the manually-built
          // geometry's winding direction (same reasoning as before, now
          // applied to a full sphere instead of an open ring).
          side={DoubleSide}
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
