// ADR0003: per-city skyline compositions. Each city gets 1-3 hand-picked
// "hero" landmarks clustered within a viewing arc (like a real skyline
// seen from one vantage point), plus a generic low-rise filler across
// the rest of the 360-degree horizon band for continuity. Azimuth is
// degrees, 0 = north, matching the rest of the app's convention.

export type LandmarkType =
  | "archMonument"
  | "minaretTower"
  | "lotusDome"
  | "gatewayArchIndia"
  | "domedMemorial"
  | "suspensionBridge"
  | "templeGopuram"
  | "shikharaSpire"
  | "ghatSteps"
  | "boatSilhouette"
  | "lighthouseTower"
  | "vidhanaSoudhaDome"
  | "taperedSkyscraperSpire"
  | "ladyLibertyStatue"
  | "transAmericaPyramid"
  | "willisTowerStepped"
  | "archBridge"
  | "clockTower"
  | "ferrisWheel"
  | "towerBridgeTwin"
  | "eiffelTower"
  | "domedCathedralTwin"
  | "operaHouseShells"
  | "goldenCrownTower"
  | "sailBuildingLotus"
  | "merlionStatue"
  | "latticeTowerRed"
  | "mountainSilhouette"
  | "sailBuildingSingle"
  | "needleTower";

export interface SkylineLandmark {
  type: LandmarkType;
  /** Degrees, 0 = north, matching the app's azimuth convention. */
  azimuth: number;
  /** Relative size multiplier, default 1. */
  scale?: number;
  /** For ghatSteps only: angular width of the terraced span, degrees. */
  spanDeg?: number;
  /** Landmark label, shown for the nearest one when a skyline is present. */
  label: string;
}

export interface CitySkyline {
  cityId: string;
  /** Deterministic seed for the generic filler buildings. */
  fillerSeed: number;
  landmarks: SkylineLandmark[];
}

export const CITY_SKYLINES: CitySkyline[] = [
  {
    cityId: "delhi",
    fillerSeed: 1,
    landmarks: [
      { type: "archMonument", azimuth: 168, label: "India Gate" },
      { type: "minaretTower", azimuth: 138, scale: 1.1, label: "Qutub Minar" },
      { type: "lotusDome", azimuth: 202, label: "Lotus Temple" },
    ],
  },
  {
    cityId: "mumbai",
    fillerSeed: 2,
    landmarks: [
      { type: "gatewayArchIndia", azimuth: 178, label: "Gateway of India" },
      { type: "taperedSkyscraperSpire", azimuth: 150, scale: 0.7, label: "Mumbai skyline" },
      { type: "taperedSkyscraperSpire", azimuth: 205, scale: 0.6, label: "Mumbai skyline" },
    ],
  },
  {
    cityId: "bengaluru",
    fillerSeed: 3,
    landmarks: [{ type: "vidhanaSoudhaDome", azimuth: 178, label: "Vidhana Soudha" }],
  },
  {
    cityId: "chennai",
    fillerSeed: 4,
    landmarks: [
      { type: "templeGopuram", azimuth: 168, label: "Kapaleeshwarar Temple" },
      { type: "lighthouseTower", azimuth: 200, label: "Chennai Lighthouse" },
    ],
  },
  {
    cityId: "kolkata",
    fillerSeed: 5,
    landmarks: [
      { type: "suspensionBridge", azimuth: 148, scale: 1.05, label: "Howrah Bridge" },
      { type: "domedMemorial", azimuth: 195, label: "Victoria Memorial" },
    ],
  },
  {
    cityId: "varanasi",
    fillerSeed: 6,
    landmarks: [
      { type: "ghatSteps", azimuth: 180, spanDeg: 26, label: "Ghats" },
      { type: "shikharaSpire", azimuth: 163, label: "Kashi Vishwanath" },
      { type: "shikharaSpire", azimuth: 197, scale: 0.85, label: "Riverside temple" },
      { type: "boatSilhouette", azimuth: 172, scale: 0.9, label: "Boats" },
      { type: "boatSilhouette", azimuth: 188, scale: 0.7, label: "Boats" },
    ],
  },
  {
    cityId: "new-york",
    fillerSeed: 7,
    landmarks: [
      { type: "taperedSkyscraperSpire", azimuth: 158, scale: 1.1, label: "Empire State Building" },
      { type: "taperedSkyscraperSpire", azimuth: 188, scale: 0.85, label: "Chrysler Building" },
      { type: "ladyLibertyStatue", azimuth: 132, label: "Statue of Liberty" },
    ],
  },
  {
    cityId: "san-francisco",
    fillerSeed: 8,
    landmarks: [
      { type: "archBridge", azimuth: 148, scale: 1.1, label: "Golden Gate Bridge" },
      { type: "transAmericaPyramid", azimuth: 195, label: "Transamerica Pyramid" },
    ],
  },
  {
    cityId: "chicago",
    fillerSeed: 9,
    landmarks: [{ type: "willisTowerStepped", azimuth: 178, scale: 1.1, label: "Willis Tower" }],
  },
  {
    cityId: "london",
    fillerSeed: 10,
    landmarks: [
      { type: "clockTower", azimuth: 148, label: "Big Ben" },
      { type: "ferrisWheel", azimuth: 182, scale: 0.9, label: "London Eye" },
      { type: "towerBridgeTwin", azimuth: 215, label: "Tower Bridge" },
    ],
  },
  {
    cityId: "paris",
    fillerSeed: 11,
    landmarks: [
      { type: "eiffelTower", azimuth: 172, scale: 1.05, label: "Eiffel Tower" },
      { type: "domedCathedralTwin", azimuth: 200, label: "Notre-Dame" },
      { type: "archMonument", azimuth: 145, scale: 0.7, label: "Arc de Triomphe" },
    ],
  },
  {
    cityId: "sydney",
    fillerSeed: 12,
    landmarks: [
      { type: "operaHouseShells", azimuth: 168, label: "Sydney Opera House" },
      { type: "archBridge", azimuth: 200, scale: 0.95, label: "Harbour Bridge" },
    ],
  },
  {
    cityId: "melbourne",
    fillerSeed: 13,
    landmarks: [{ type: "goldenCrownTower", azimuth: 178, label: "Eureka Tower" }],
  },
  {
    cityId: "singapore",
    fillerSeed: 14,
    landmarks: [
      { type: "sailBuildingLotus", azimuth: 175, label: "Marina Bay Sands" },
      { type: "merlionStatue", azimuth: 208, scale: 0.9, label: "Merlion" },
      { type: "ferrisWheel", azimuth: 142, scale: 0.85, label: "Singapore Flyer" },
    ],
  },
  {
    cityId: "tokyo",
    fillerSeed: 15,
    landmarks: [
      { type: "latticeTowerRed", azimuth: 175, label: "Tokyo Tower" },
      { type: "mountainSilhouette", azimuth: 208, scale: 1.2, label: "Mount Fuji" },
    ],
  },
  {
    cityId: "dubai",
    fillerSeed: 16,
    landmarks: [
      { type: "needleTower", azimuth: 175, label: "Burj Khalifa" },
      { type: "sailBuildingSingle", azimuth: 202, label: "Burj Al Arab" },
    ],
  },
];

export function getCitySkyline(cityId: string): CitySkyline | undefined {
  return CITY_SKYLINES.find((s) => s.cityId === cityId);
}
