import { Vector3 } from "three";

// Lightweight pure-JS astronomy for the location-based sky viewer
// (ADR0002). Formulas follow the standard treatment in Duffett-Smith,
// "Practical Astronomy with your Calculator or Computer" — good enough
// for a real-time sky visualization, not planetarium-grade (no
// refraction, nutation, or aberration correction). Can be swapped for
// `astronomy-engine` later if more precision is needed.

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Greenwich Mean Sidereal Time, in degrees [0, 360). */
export function greenwichMeanSiderealTime(date: Date): number {
  const jd = toJulianDate(date);
  const T = (jd - 2451545.0) / 36525;
  let gmst =
    280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmst %= 360;
  if (gmst < 0) gmst += 360;
  return gmst;
}

/** Local Sidereal Time, in degrees [0, 360). lonDeg is east-positive. */
export function localSiderealTime(date: Date, lonDeg: number): number {
  let lst = greenwichMeanSiderealTime(date) + lonDeg;
  lst %= 360;
  if (lst < 0) lst += 360;
  return lst;
}

export interface AltAz {
  /** Degrees above the horizon; negative is below. */
  alt: number;
  /** Degrees, measured from North (0), clockwise through East (90). */
  az: number;
}

/**
 * Converts equatorial coordinates (RA in hours, Dec in degrees) to local
 * horizontal coordinates (Alt/Az) for an observer at (latDeg, lonDeg) at
 * the given moment. lonDeg is east-positive (matching src/data/cities.ts).
 */
export function raDecToAltAz(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonDeg: number,
  date: Date,
): AltAz {
  const lst = localSiderealTime(date, lonDeg);
  const raDeg = raHours * 15;
  let hourAngleDeg = lst - raDeg;
  hourAngleDeg = ((hourAngleDeg + 540) % 360) - 180; // normalize to [-180, 180)

  const H = hourAngleDeg * DEG;
  const dec = decDeg * DEG;
  const lat = latDeg * DEG;

  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(H);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));

  const y = -Math.cos(dec) * Math.sin(H);
  const x = Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.sin(lat) * Math.cos(H);
  let az = Math.atan2(y, x) * RAD;
  if (az < 0) az += 360;

  return { alt: alt * RAD, az };
}

/**
 * Projects an Alt/Az pair onto a dome of the given radius, centred on the
 * observer at the world origin. North = +Z, East = +X, zenith = +Y.
 */
export function altAzToVector3(altDeg: number, azDeg: number, radius = 100): Vector3 {
  const alt = altDeg * DEG;
  const az = azDeg * DEG;
  const horizontalRadius = Math.cos(alt) * radius;
  return new Vector3(horizontalRadius * Math.sin(az), Math.sin(alt) * radius, horizontalRadius * Math.cos(az));
}
