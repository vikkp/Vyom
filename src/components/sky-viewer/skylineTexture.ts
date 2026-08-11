import { CanvasTexture, RepeatWrapping } from "three";
import type { CitySkyline, LandmarkType } from "../../data/skylines";
import * as shapes from "./skylineShapes";

// Logical drawing space -- all shape functions in skylineShapes.ts are
// authored in these coordinates (x maps to azimuth 0-360, y to building
// height). Kept unchanged so existing shape proportions aren't affected.
const LOGICAL_WIDTH = 2048;
const LOGICAL_HEIGHT = 320;
// Actual canvas is rendered at 2x supersampling -- the hard alphaTest cutout
// on this texture has no built-in antialiasing, so silhouette edges (and
// especially the shallow arcs/domes) were showing visible jagged/blocky
// steps up close. Drawing at 2x and letting the GPU's linear filtering
// downsample it gives much smoother edges without touching any shape math.
const SUPERSAMPLE = 2;
const TEXTURE_WIDTH = LOGICAL_WIDTH * SUPERSAMPLE;
const TEXTURE_HEIGHT = LOGICAL_HEIGHT * SUPERSAMPLE;
const SILHOUETTE_COLOR = "#05070f";

type SimpleShapeFn = (ctx: CanvasRenderingContext2D, cx: number, groundY: number, scale: number) => void;

const SIMPLE_SHAPES: Partial<Record<LandmarkType, SimpleShapeFn>> = {
  archMonument: shapes.archMonument,
  minaretTower: shapes.minaretTower,
  lotusDome: shapes.lotusDome,
  gatewayArchIndia: shapes.gatewayArchIndia,
  domedMemorial: shapes.domedMemorial,
  suspensionBridge: shapes.suspensionBridge,
  templeGopuram: shapes.templeGopuram,
  shikharaSpire: shapes.shikharaSpire,
  boatSilhouette: shapes.boatSilhouette,
  lighthouseTower: shapes.lighthouseTower,
  vidhanaSoudhaDome: shapes.vidhanaSoudhaDome,
  taperedSkyscraperSpire: shapes.taperedSkyscraperSpire,
  ladyLibertyStatue: shapes.ladyLibertyStatue,
  transAmericaPyramid: shapes.transAmericaPyramid,
  willisTowerStepped: shapes.willisTowerStepped,
  archBridge: shapes.archBridge,
  clockTower: shapes.clockTower,
  ferrisWheel: shapes.ferrisWheel,
  towerBridgeTwin: shapes.towerBridgeTwin,
  eiffelTower: shapes.eiffelTower,
  domedCathedralTwin: shapes.domedCathedralTwin,
  operaHouseShells: shapes.operaHouseShells,
  goldenCrownTower: shapes.goldenCrownTower,
  sailBuildingLotus: shapes.sailBuildingLotus,
  merlionStatue: shapes.merlionStatue,
  latticeTowerRed: shapes.latticeTowerRed,
  mountainSilhouette: shapes.mountainSilhouette,
  sailBuildingSingle: shapes.sailBuildingSingle,
  needleTower: shapes.needleTower,
};

/**
 * Renders a city's skyline composition (data/skylines.ts) to a wide
 * panoramic canvas: x maps linearly to azimuth 0-360, y maps to building
 * height (silhouettes rise from the bottom edge). This is mapped onto a
 * full 360-degree cylindrical band in CitySkyline.tsx, so the skyline
 * genuinely wraps around the horizon and stays put in world-space as the
 * camera pans, rather than being a fixed on-screen backdrop.
 */
export function makeSkylineTexture(skyline: CitySkyline): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SUPERSAMPLE, SUPERSAMPLE);
  const groundY = LOGICAL_HEIGHT - 4;

  ctx.fillStyle = SILHOUETTE_COLOR;

  // Generic low-rise filler across the full 360-degree band first, so
  // hero landmarks rise above a continuous city silhouette rather than
  // standing alone against empty sky.
  shapes.genericFillerRow(ctx, 0, LOGICAL_WIDTH, groundY, skyline.fillerSeed, 22);

  for (const landmark of skyline.landmarks) {
    const cx = (landmark.azimuth / 360) * LOGICAL_WIDTH;
    const scale = landmark.scale ?? 1;

    if (landmark.type === "ghatSteps") {
      const spanPx = ((landmark.spanDeg ?? 20) / 360) * LOGICAL_WIDTH;
      shapes.ghatSteps(ctx, cx - spanPx / 2, cx + spanPx / 2, groundY, scale);
      continue;
    }

    const fn = SIMPLE_SHAPES[landmark.type];
    if (fn) fn(ctx, cx, groundY, scale);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}
