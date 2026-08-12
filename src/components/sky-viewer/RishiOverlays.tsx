import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { Vector3, type Mesh } from "three";
import type { SkyCatalogStar } from "../../types/skyViewer";
import { raDecToAltAz, altAzToVector3 } from "../../utils/astronomy";
import { useGraphStore } from "../../store/useGraphStore";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { makeGlowTexture } from "../sky/glowTexture";
import { useOptionalTexture } from "../sky/useOptionalTexture";
import { makeRishiSilhouetteTexture } from "./rishiSilhouette";
import { DOME_RADIUS, sizeForAspect } from "./constants";
import { declutterPositions } from "./figureDeclutter";

const RISHI_GLOW_COLOR = "#ffcf8a";

// Real character art is a 900x1338 portrait crop (~0.673 aspect); solved
// against the shared FIGURE_TARGET_AREA (see constants.ts) so the Rishis
// occupy the same visual footprint as the mythic figures instead of each
// figure set using its own raw-pixel-derived size.
const REAL_SIZE = sizeForAspect(900 / 1338);
const PLACEHOLDER_SIZE: [number, number] = [4.8, 6.2];
// The old fixed +1.12 vertical anchor offset was tuned for the old 7.43-
// unit-tall plane (visible content bottoms out ~65% down the image,
// unchanged since); scaled here to match the new plane height so the star
// still lands in the same *relative* spot on each rishi.
const ANCHOR_OFFSET = 1.12 * (REAL_SIZE[1] / 7.43);

interface RishiFigureProps {
  star: SkyCatalogStar;
  /** Already-decluttered anchor position (see RishiOverlays below) --
   * ANCHOR_OFFSET is applied here, on top of it. */
  position: Vector3;
}

function RishiFigure({ star, position }: RishiFigureProps) {
  const glowRef = useRef<Mesh>(null);
  const figureRef = useRef<Mesh>(null);
  const select = useGraphStore((s) => s.select);
  const selectedId = useGraphStore((s) => s.selectedId);

  const isActive = star.nodeId != null && selectedId === star.nodeId;
  const glowTexture = useMemo(() => makeGlowTexture(RISHI_GLOW_COLOR), []);
  // Real character art, once dropped into public/rishis/<nodeId>.png, is
  // picked up automatically here and takes priority. Until then,
  // silhouetteTexture is a procedural stand-in (head + robed body,
  // soft-blurred) so the overlay reads as "a vague painted figure" rather
  // than a flat glowing circle — still not the real requested artwork,
  // just a less ugly placeholder for it.
  const figureTexture = useOptionalTexture(star.nodeId ? `/rishis/${star.nodeId}.png` : "");
  const silhouetteTexture = useMemo(() => makeRishiSilhouetteTexture(RISHI_GLOW_COLOR), []);
  const displayTexture = figureTexture ?? silhouetteTexture;

  // Visual polish pass: figure opacity raised into the 0.65-0.75 range
  // (was 0.35 baseline) so the portraits read as present, elegant
  // constellation artwork rather than a faint ghost of themselves. The
  // glow aura underneath is a separate, deliberately subtler element and
  // is unchanged.
  useFrame(({ clock }) => {
    const breathe = 0.13 + Math.sin(clock.elapsedTime * 0.6 + star.ra) * 0.03;
    const glowMaterial = glowRef.current?.material as { opacity: number } | undefined;
    if (glowMaterial) glowMaterial.opacity = isActive ? 0.34 : breathe;
    const figureMaterial = figureRef.current?.material as { opacity: number } | undefined;
    if (figureMaterial) figureMaterial.opacity = isActive ? 0.85 : 0.7;
  });

  // Sized larger than the tight per-star gap on purpose: these are meant
  // to read as large, ghostly constellation artwork layered across the
  // sky (like SkyGuide's constellation figures) rather than small icons
  // sitting next to their star. Saptarishi's 7 stars sit close together by
  // real astronomy (that's the point -- it's a tight, recognisable
  // dipper), so their portraits go through the same declutter pass
  // (figureDeclutter.ts) as the nakshatra symbols in
  // MythicFigureOverlays.tsx -- see RishiOverlays below. That pass used to
  // be unnecessary here because the old 0.35 baseline opacity let
  // overlapping portraits blend softly; once opacity was later raised to
  // 0.65-0.75 to match the mythic figures, overlap started reading as
  // muddy stacked shapes instead, so decluttering here now matters the
  // same way it does for the nakshatra set.
  //
  // The vertical anchor is measured, not guessed, and recomputed here to
  // match the new size: after fading out each portrait's glowing base
  // platform, the remaining visible content bottoms out at ~65% of image
  // height on average (unchanged from the previous pass — same source
  // images). That's the seated figure's lap/base, so the star still
  // lands in the same *relative* spot on each rishi even though the
  // absolute offset number below is bigger to match the bigger plane —
  // this is what "don't change the positioning" means here: which star
  // each rishi anchors to, and where on their body that anchor sits, are
  // both unchanged from the last pass.
  return (
    <group
      position={[position.x, position.y + ANCHOR_OFFSET, position.z]}
      onClick={
        star.nodeId
          ? (e) => {
              e.stopPropagation();
              select(star.nodeId!);
            }
          : undefined
      }
      onPointerOver={star.nodeId ? (e) => (e.stopPropagation(), (document.body.style.cursor = "pointer")) : undefined}
      onPointerOut={star.nodeId ? () => (document.body.style.cursor = "auto") : undefined}
    >
      <Billboard>
        <mesh ref={glowRef} position={[0, 0, -0.02]}>
          <planeGeometry args={figureTexture ? [REAL_SIZE[0] * 1.3, REAL_SIZE[1] * 1.3] : [PLACEHOLDER_SIZE[0] * 1.3, PLACEHOLDER_SIZE[1] * 1.3]} />
          <meshBasicMaterial
            map={glowTexture}
            color={isActive ? "#ffe6b8" : RISHI_GLOW_COLOR}
            transparent
            opacity={0.2}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh ref={figureRef} position={[0, 0, -0.01]}>
          {/* Real character art is a 900x1338 portrait crop (~0.673
              aspect); sizeForAspect solves the plane at the shared target
              area so this matches the mythic figures' footprint instead of
              forcing the raw pixel proportions into an unrelated size. */}
          <planeGeometry args={figureTexture ? REAL_SIZE : PLACEHOLDER_SIZE} />
          <meshBasicMaterial map={displayTexture} transparent opacity={0.7} depthWrite={false} toneMapped={false} />
        </mesh>
        <Html position={[0, -4.0 * (REAL_SIZE[1] / 7.43), 0]} distanceFactor={40} center style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap text-xs tracking-wide text-amber-100/85">{star.indianName}</div>
        </Html>
      </Billboard>
    </group>
  );
}

interface RishiOverlaysProps {
  stars: SkyCatalogStar[];
}

export function RishiOverlays({ stars }: RishiOverlaysProps) {
  const visibleLayers = useSkyViewerStore((s) => s.visibleLayers);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const currentDate = useSkyViewerStore((s) => s.currentDate);

  // No altitude filtering — same reasoning as StarField/AsterismLines: let
  // the depth-writing ground disc in Horizon.tsx occlude figures whose
  // stars have set, instead of an arbitrary cutoff popping them in/out.
  const placed = useMemo(() => {
    return stars.map((star) => {
      const { alt, az } = raDecToAltAz(star.ra, star.dec, selectedCity.lat, selectedCity.lon, currentDate);
      return { item: star, position: altAzToVector3(alt, az, DOME_RADIUS - 1) };
    });
  }, [stars, selectedCity, currentDate]);

  // Same shared declutter pass MythicFigureOverlays.tsx uses -- pulls
  // apart any Rishi portraits whose real stars sit closer than
  // MIN_FIGURE_SEPARATION (Saptarishi's 7 stars, a real tight dipper
  // shape, land several pairs well inside that threshold). See the
  // comment above RishiFigure for why this now matters at the current
  // opacity level.
  const declutteredPlaced = useMemo(() => declutterPositions(placed), [placed]);

  if (!visibleLayers.has("overlays")) return null;

  return (
    <group>
      {declutteredPlaced.map(({ item: star, position }) => (
        <RishiFigure key={star.id} star={star} position={position} />
      ))}
    </group>
  );
}
