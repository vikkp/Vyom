// Shared across every sky-viewer component so the dome radius (and any
// future tuning of it) can't drift out of sync between StarField,
// AsterismLines, RishiOverlays, GraphLines and Horizon.
// Kept deliberately small: this only sets the rendering distance of the
// dome, not any star's actual position — Alt/Az is a pure angle from the
// observer, so radius is just a scale knob for how big things look on
// screen. 90 (matched to the old glow/geometry sizes tuned for a
// 16-unit-radius dome) made every star a barely-visible speck; 30 brings
// them back to a comfortable, clearly visible size without touching any
// per-component size constant.
export const DOME_RADIUS = 30;

// OrbitControls in SkyViewer.tsx uses this as both minDistance and
// maxDistance — the camera orbits a fixed, near-zero radius around the
// origin so dragging changes facing direction, not position (see the
// comment on <OrbitControls> for why). CameraFocusController.tsx needs
// this same number to place the camera on that same tiny sphere when
// animating toward a search result, so it's a shared constant rather than
// a magic "0.1" repeated in two files that could drift out of sync.
export const CAMERA_ORBIT_RADIUS = 0.1;

// ADR0003: curvature radius of the stylized "ground planet" — the ground
// mesh droops away from flat using the standard curvature sagitta
// approximation (drop = distance^2 / (2 * radius)), so a LARGER value
// here means a GENTLER, more subtle curve, not a more dramatic one.
// At DOME_RADIUS+5 (the ground disc's outer edge, ~35 units out), a
// radius of 420 gives a drop of about 1.5 units — enough to read as "the
// horizon curves, I'm standing on a sphere" without looking like a tiny
// toy planet. Deliberately not physically accurate (real Earth curvature
// is imperceptible at standing height); this is an artistic exaggeration
// per ADR0003, kept subtle and tuned via this one constant.
export const GROUND_CURVE_RADIUS = 420;

// Visual polish pass: a shared target plane *area* (world units^2) for
// every figure overlay -- the 7 Rishis plus the 4 mythic figures
// (Mrigashira/Rohini/Krittika/Dhruva). Before this, each figure's plane
// size was set from its own source image's raw pixel dimensions with no
// normalisation, so portrait-oriented art (Rishis, Mrigashira, Dhruva)
// and landscape-oriented art (Rohini, Krittika) ended up wildly
// different sizes -- Dhruva's plane area was under half of Rishi's.
// sizeForAspect() below solves for width/height at this fixed area given
// each image's own aspect ratio, so every figure occupies the same
// visual footprint regardless of its orientation. The value itself is
// ~8% above the previous Rishi plane area (5.0*7.43=37.15), a "slightly
// bigger" bump applied to the whole set rather than to any one figure.
export const FIGURE_TARGET_AREA = 40;

/** Solve width/height for a fixed plane area at a given aspect (w/h). */
export function sizeForAspect(aspect: number, area: number = FIGURE_TARGET_AREA): [number, number] {
  return [Math.sqrt(area * aspect), Math.sqrt(area / aspect)];
}
