// Galactic (l, b) -> equatorial (RA, Dec) conversion, for Akash Ganga
// (ADR0006). See docs/research/akash-ganga-sources.md for the full
// citation and verification against known reference points (the north
// galactic pole and the galactic center both resolve to their real,
// independently-documented RA/Dec to well under a tenth of a degree).

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export interface EquatorialPosition {
  /** Hours [0, 24). */
  ra: number;
  /** Degrees [-90, 90]. */
  dec: number;
}

/**
 * Standard Hipparcos equatorial(J2000)-to-galactic rotation matrix (Liu,
 * Zhu & Zhang 2011, "Reconsidering the Galactic coordinate system,"
 * arXiv:1010.3773, eq. 9, "N_Hip") -- the same coordinate definition used
 * by Astropy's built-in Galactic frame and most general-purpose
 * astronomy software. Applied as G = N_HIP * A, where A is the
 * equatorial unit Cartesian vector (cos(dec)cos(ra), cos(dec)sin(ra),
 * sin(dec)) and G the galactic one (cos(b)cos(l), cos(b)sin(l), sin(b)).
 * This app needs the inverse (galactic -> equatorial); since N_HIP is an
 * orthogonal rotation matrix, its inverse is its transpose.
 */
const N_HIP: [number, number, number][] = [
  [-0.0548755604, -0.8734370902, -0.4838350155],
  [+0.4941094279, -0.4448296300, +0.7469822445],
  [-0.8676661490, -0.1980763734, +0.4559837762],
];

/**
 * Converts galactic coordinates (degrees) to equatorial J2000 RA/Dec.
 * No date/time dependence -- the galactic plane's orientation relative
 * to the equatorial frame is fixed on any timescale this app cares
 * about, unlike the Navagraha's positions.
 */
export function galacticToEquatorial(lDeg: number, bDeg: number): EquatorialPosition {
  const l = lDeg * DEG;
  const b = bDeg * DEG;
  const gx = Math.cos(b) * Math.cos(l);
  const gy = Math.cos(b) * Math.sin(l);
  const gz = Math.sin(b);

  // A = N_HIP^T * G
  const x = N_HIP[0][0] * gx + N_HIP[1][0] * gy + N_HIP[2][0] * gz;
  const y = N_HIP[0][1] * gx + N_HIP[1][1] * gy + N_HIP[2][1] * gz;
  const z = N_HIP[0][2] * gx + N_HIP[1][2] * gy + N_HIP[2][2] * gz;

  const dec = Math.asin(Math.max(-1, Math.min(1, z)));
  let raDeg = Math.atan2(y, x) * RAD;
  if (raDeg < 0) raDeg += 360;

  return { ra: raDeg / 15, dec: dec * RAD };
}
