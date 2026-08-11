import { CanvasTexture, RepeatWrapping } from "three";
import type { CitySkyline, LandmarkType } from "../../data/skylines";
import * as shapes from "./skylineShapes";

const TEXTURE_WIDTH = 2048;
const TEXTURE_HEIGHT = 320;
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
  const groundY = TEXTURE_HEIGHT - 4;

  ctx.fillStyle = SILHOUETTE_COLOR;

  // Generic low-rise filler across the full 360-degree band first, so
  // hero landmarks rise above a continuous city silhouette rather than
  // standing alone against empty sky.
  shapes.genericFillerRow(ctx, 0, TEXTURE_WIDTH, groundY, skyline.fillerSeed, 22);

  for (const landmark of skyline.landmarks) {
    const cx = (landmark.azimuth / 360) * TEXTURE_WIDTH;
    const scale = landmark.scale ?? 1;

    if (landmark.type === "ghatSteps") {
      const spanPx = ((landmark.spanDeg ?? 20) / 360) * TEXTURE_WIDTH;
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
