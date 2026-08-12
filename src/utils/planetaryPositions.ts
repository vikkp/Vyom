// Geocentric apparent positions of the Navagraha (ADR0005), computed with
// well-known low-precision formulas — the same "good enough for a
// real-time sky visualization, not planetarium-grade" standard
// astronomy.ts already holds for star Alt/Az. Three source families are
// used, one per body category (full citations in
// docs/research/navagraha-sources.md):
//
//  - Surya (Sun): Astronomical Almanac low-precision solar formula
//    (page C5), a direct closed-form geocentric ecliptic longitude.
//  - Chandra (Moon): Astronomical Almanac low-precision lunar formula
//    (page D46/D76), a short periodic-term series independently
//    validated to ~0.12 deg against the NASA JPL ephemeris.
//  - Mangala/Budha/Guru/Shukra/Shani (Mars/Mercury/Jupiter/Venus/
//    Saturn): JPL's published Keplerian elements and secular rates
//    (Standish & Williams 1992, valid 1800-2050 AD) — solve Kepler's
//    equation for each planet's heliocentric position, subtract
//    Earth's own (from the same table's Earth-Moon-barycenter row),
//    rotate ecliptic to equatorial.
//  - Rahu/Ketu: the Moon's *mean* ascending/descending node (Meeus'
//    linear-in-T formula for Ω), 180 degrees apart, both at ecliptic
//    latitude 0. See the research doc for the mean-vs-true node
//    tradeoff this makes explicitly.
//
// All three families converge on the same output shape — geocentric
// ecliptic longitude/latitude, rotated to equatorial RA/Dec by one
// shared mean-obliquity helper (rather than each source's own slightly
// different obliquity approximation; the difference is well below this
// app's precision floor). No ayanamsa/sidereal correction anywhere —
// consistent with ADR0002, this plots where things actually are.

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export interface EquatorialPosition {
  /** Hours [0, 24). */
  ra: number;
  /** Degrees [-90, 90]. */
  dec: number;
}

function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** Normalizes an angle in degrees to [0, 360). */
function norm360(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/** Normalizes an angle in degrees to [-180, 180). */
function norm180(deg: number): number {
  return ((deg + 180) % 360 + 360) % 360 - 180;
}

/**
 * Mean obliquity of the ecliptic (Meeus low-precision formula, degrees),
 * T = Julian centuries since J2000.0. Shared by every body below instead
 * of each source's own slightly different approximation — see the file
 * header comment.
 */
function meanObliquityDeg(T: number): number {
  return 23.439291 - 0.0130042 * T - 0.00000164 * T * T + 0.000000504 * T * T * T;
}

/**
 * Ecliptic (longitude, latitude, degrees) -> equatorial (RA hours, Dec
 * degrees), given the obliquity of the ecliptic in degrees. Standard
 * spherical-rotation formulas (Meeus, "Astronomical Algorithms" ch. 13).
 */
function eclipticToEquatorial(lonDeg: number, latDeg: number, oblDeg: number): EquatorialPosition {
  const lon = lonDeg * DEG;
  const lat = latDeg * DEG;
  const obl = oblDeg * DEG;

  const sinDec = Math.sin(lat) * Math.cos(obl) + Math.cos(lat) * Math.sin(obl) * Math.sin(lon);
  const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));

  const y = Math.sin(lon) * Math.cos(obl) - Math.tan(lat) * Math.sin(obl);
  const x = Math.cos(lon);
  let raDeg = Math.atan2(y, x) * RAD;
  if (raDeg < 0) raDeg += 360;

  return { ra: raDeg / 15, dec: dec * RAD };
}

// ---------------------------------------------------------------------
// Surya (Sun)
// ---------------------------------------------------------------------

function sunEcliptic(daysSinceJ2000: number): { lon: number; lat: number } {
  const L = norm360(280.46 + 0.9856474 * daysSinceJ2000);
  const g = norm360(357.528 + 0.9856003 * daysSinceJ2000) * DEG;
  const lon = L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  return { lon: norm360(lon), lat: 0 };
}

// ---------------------------------------------------------------------
// Chandra (Moon)
// ---------------------------------------------------------------------

function moonEcliptic(daysSinceJ2000: number): { lon: number; lat: number } {
  const t = daysSinceJ2000 / 36525;
  const s = (deg: number) => Math.sin(norm360(deg) * DEG);

  const lon =
    norm360(218.32 + 481267.883 * t) +
    6.29 * s(134.9 + 477198.85 * t) -
    1.27 * s(259.2 - 413335.38 * t) +
    0.66 * s(235.7 + 890534.23 * t) +
    0.21 * s(269.9 + 954397.7 * t) -
    0.19 * s(357.5 + 35999.05 * t) -
    0.11 * s(186.6 - 966404.05 * t);

  const lat =
    5.13 * s(93.3 + 483202.03 * t) +
    0.28 * s(228.2 + 960400.87 * t) -
    0.28 * s(318.3 + 6003.18 * t) -
    0.17 * s(217.6 - 407332.2 * t);

  return { lon: norm360(lon), lat };
}

// ---------------------------------------------------------------------
// Mangala/Budha/Guru/Shukra/Shani via JPL Keplerian elements (Table 1,
// Standish & Williams 1992, valid 1800-2050 AD)
// ---------------------------------------------------------------------

interface KeplerianElements {
  /** Semi-major axis: [value at J2000, rate per century] (au). */
  a: [number, number];
  /** Eccentricity: [value at J2000, rate per century]. */
  e: [number, number];
  /** Inclination: [value at J2000, rate per century] (degrees). */
  i: [number, number];
  /** Mean longitude: [value at J2000, rate per century] (degrees). */
  l: [number, number];
  /** Longitude of perihelion: [value at J2000, rate per century] (degrees). */
  peri: [number, number];
  /** Longitude of ascending node: [value at J2000, rate per century] (degrees). */
  node: [number, number];
}

// prettier-ignore
const KEPLERIAN_ELEMENTS: Record<"mercury" | "venus" | "earth" | "mars" | "jupiter" | "saturn", KeplerianElements> = {
  mercury: { a: [0.38709927, 0.00000037], e: [0.20563593, 0.00001906], i: [7.00497902, -0.00594749], l: [252.2503235, 149472.67411175], peri: [77.45779628, 0.16047689], node: [48.33076593, -0.12534081] },
  venus:   { a: [0.72333566, 0.0000039],  e: [0.00677672, -0.00004107], i: [3.39467605, -0.0007889],  l: [181.9790995, 58517.81538729],  peri: [131.60246718, 0.00268329], node: [76.67984255, -0.27769418] },
  earth:   { a: [1.00000261, 0.00000562], e: [0.01671123, -0.00004392], i: [-0.00001531, -0.01294668], l: [100.46457166, 35999.37244981], peri: [102.93768193, 0.32327364], node: [0, 0] },
  mars:    { a: [1.52371034, 0.00001847], e: [0.0933941, 0.00007882],  i: [1.84969142, -0.00813131],  l: [-4.55343205, 19140.30268499],  peri: [-23.94362959, 0.44441088], node: [49.55953891, -0.29257343] },
  jupiter: { a: [5.202887, -0.00011607],  e: [0.04838624, -0.00013253], i: [1.30439695, -0.00183714], l: [34.39644051, 3034.74612775],   peri: [14.72847983, 0.21252668],  node: [100.47390909, 0.20469106] },
  saturn:  { a: [9.53667594, -0.0012506], e: [0.05386179, -0.00050991], i: [2.48599187, 0.00193609],  l: [49.95424423, 1222.49362201],   peri: [92.59887831, -0.41897216], node: [113.66242448, -0.28867794] },
};

interface Cartesian {
  x: number;
  y: number;
  z: number;
}

/** Solves Kepler's equation M = E - e*sin(E) for E, both in degrees. */
function solveKeplerEquation(meanAnomalyDeg: number, eccentricity: number): number {
  const M = norm180(meanAnomalyDeg);
  const eStar = eccentricity * RAD; // e* = 57.29578 * e, per JPL's formulation
  let E = M + eStar * Math.sin(M * DEG);
  for (let iter = 0; iter < 10; iter++) {
    const deltaM = M - (E - eStar * Math.sin(E * DEG));
    const deltaE = deltaM / (1 - eccentricity * Math.cos(E * DEG));
    E += deltaE;
    if (Math.abs(deltaE) < 1e-6) break;
  }
  return E;
}

/** Heliocentric ecliptic (J2000) Cartesian position, in au, for one body's Keplerian elements at T. */
function keplerianHeliocentricPosition(elements: KeplerianElements, T: number): Cartesian {
  const a = elements.a[0] + elements.a[1] * T;
  const e = elements.e[0] + elements.e[1] * T;
  const i = elements.i[0] + elements.i[1] * T;
  const L = elements.l[0] + elements.l[1] * T;
  const peri = elements.peri[0] + elements.peri[1] * T;
  const node = elements.node[0] + elements.node[1] * T;

  const omega = peri - node; // argument of perihelion
  const M = L - peri; // mean anomaly

  const E = solveKeplerEquation(M, e);

  // Position in the orbital plane (x' toward perihelion).
  const xOrbit = a * (Math.cos(E * DEG) - e);
  const yOrbit = a * Math.sqrt(1 - e * e) * Math.sin(E * DEG);

  const cosOmega = Math.cos(omega * DEG);
  const sinOmega = Math.sin(omega * DEG);
  const cosNode = Math.cos(node * DEG);
  const sinNode = Math.sin(node * DEG);
  const cosI = Math.cos(i * DEG);
  const sinI = Math.sin(i * DEG);

  const x = (cosOmega * cosNode - sinOmega * sinNode * cosI) * xOrbit + (-sinOmega * cosNode - cosOmega * sinNode * cosI) * yOrbit;
  const y = (cosOmega * sinNode + sinOmega * cosNode * cosI) * xOrbit + (-sinOmega * sinNode + cosOmega * cosNode * cosI) * yOrbit;
  const z = sinOmega * sinI * xOrbit + cosOmega * sinI * yOrbit;

  return { x, y, z };
}

function rotateEclipticToEquatorial(p: Cartesian, oblDeg: number): Cartesian {
  const obl = oblDeg * DEG;
  const cosObl = Math.cos(obl);
  const sinObl = Math.sin(obl);
  return {
    x: p.x,
    y: cosObl * p.y - sinObl * p.z,
    z: sinObl * p.y + cosObl * p.z,
  };
}

function cartesianToEquatorial(p: Cartesian): EquatorialPosition {
  const r = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
  let raDeg = Math.atan2(p.y, p.x) * RAD;
  if (raDeg < 0) raDeg += 360;
  const dec = Math.asin(Math.max(-1, Math.min(1, p.z / r))) * RAD;
  return { ra: raDeg / 15, dec };
}

// ---------------------------------------------------------------------
// Rahu / Ketu (mean lunar node)
// ---------------------------------------------------------------------

/** Mean longitude of the Moon's ascending node (Meeus, degrees), T = Julian centuries since J2000.0. */
function meanLunarNodeDeg(T: number): number {
  return norm360(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000);
}

// ---------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------

export type NavagrahaId = "surya" | "chandra" | "mangala" | "budha" | "guru" | "shukra" | "shani" | "rahu" | "ketu";

/**
 * Computes all nine Navagraha positions for one moment at once (rather
 * than nine independent calls) so the Kepler-element bodies can share a
 * single Earth heliocentric-position computation — see
 * NavagrahaField.tsx, which calls this once per date change.
 */
export function computeNavagrahaPositions(date: Date): Record<NavagrahaId, EquatorialPosition> {
  const jd = toJulianDate(date);
  const daysSinceJ2000 = jd - 2451545.0;
  const T = daysSinceJ2000 / 36525;
  const obliquity = meanObliquityDeg(T);

  const sun = sunEcliptic(daysSinceJ2000);
  const moon = moonEcliptic(daysSinceJ2000);

  const earthHelio = rotateEclipticToEquatorial(keplerianHeliocentricPosition(KEPLERIAN_ELEMENTS.earth, T), obliquity);

  function planetGeocentric(id: "mercury" | "venus" | "mars" | "jupiter" | "saturn"): EquatorialPosition {
    const helio = rotateEclipticToEquatorial(keplerianHeliocentricPosition(KEPLERIAN_ELEMENTS[id], T), obliquity);
    return cartesianToEquatorial({
      x: helio.x - earthHelio.x,
      y: helio.y - earthHelio.y,
      z: helio.z - earthHelio.z,
    });
  }

  const rahuLon = meanLunarNodeDeg(T);
  const ketuLon = norm360(rahuLon + 180);

  return {
    surya: eclipticToEquatorial(sun.lon, sun.lat, obliquity),
    chandra: eclipticToEquatorial(moon.lon, moon.lat, obliquity),
    mangala: planetGeocentric("mars"),
    budha: planetGeocentric("mercury"),
    guru: planetGeocentric("jupiter"),
    shukra: planetGeocentric("venus"),
    shani: planetGeocentric("saturn"),
    rahu: eclipticToEquatorial(rahuLon, 0, obliquity),
    ketu: eclipticToEquatorial(ketuLon, 0, obliquity),
  };
}
