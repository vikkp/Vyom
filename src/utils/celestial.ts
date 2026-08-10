import { Vector3 } from "three";

/**
 * Converts equatorial coordinates (RA in hours, Dec in degrees) to a
 * Vector3 on a sphere of the given radius, centred on the world origin.
 */
export function raDecToVector(raHours: number, decDeg: number, radius = 100): Vector3 {
  const raRad = (raHours / 24) * Math.PI * 2;
  const decRad = (decDeg * Math.PI) / 180;

  const x = radius * Math.cos(decRad) * Math.cos(raRad);
  const y = radius * Math.sin(decRad);
  const z = radius * Math.cos(decRad) * Math.sin(raRad);

  return new Vector3(x, y, z);
}

/**
 * Converts equatorial coordinates to a position *relative to an anchor
 * star* (Dhruva Tārā, by default usage), preserving the true relative
 * angular geometry between stars while placing the anchor at the local
 * origin. This is what lets Dhruva Tārā sit at the scene's fixed centre
 * (ADR0001 decision 2) while the Saptarishi keep the real shape of the Big
 * Dipper relative to the pole star, rather than a stylised ring.
 */
export function raDecToVectorRelative(
  raHours: number,
  decDeg: number,
  anchorRaHours: number,
  anchorDecDeg: number,
  radius = 100,
): Vector3 {
  const point = raDecToVector(raHours, decDeg, radius);
  const anchor = raDecToVector(anchorRaHours, anchorDecDeg, radius);
  return point.sub(anchor);
}
