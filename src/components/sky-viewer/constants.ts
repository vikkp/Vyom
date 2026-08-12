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

// ADR0004: zoom is FOV-based, not distance-based -- the fixed-origin
// camera target above means dolly zoom has a hard floor at DOME_RADIUS and
// can never produce a real close-up (see the ADR for the full math). Wheel
// (desktop) and pinch (mobile), handled by FovZoomController.tsx, instead
// narrow/widen camera.fov between these bounds. The app's launch FOV is 72
// (see App.tsx's <Canvas>), close to MAX_FOV -- today's "no zoom" view
// already sits near the wide end of this range. First-pass values pending
// hands-on tuning, per the ADR's Follow-up section.
export const MIN_FOV = 25;
export const MAX_FOV = 75;

// How quickly camera.fov eases toward its target value each frame (0-1,
// higher = snappier). Mirrors the role OrbitControls' own dampingFactor
// plays for rotation, so wheel/pinch zoom feels like the same "considered,
// smoothed" interaction rather than an instant jump.
export const FOV_DAMPING = 0.12;

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

// ADR0009 (revised): ambient auto-rotation is now a standard, always-on
// part of normal viewing -- not something gated entirely behind "I am a
// satellite" mode. "I am a satellite" now just speeds this same rotation
// up, rather than switching it on from a standstill. Both constants are
// in the units three.js's OrbitControls.autoRotateSpeed itself uses
// (SkyViewer.tsx passes one or the other straight through as the
// `autoRotateSpeed` prop). Confirmed from three-stdlib's OrbitControls
// source (getAutoRotationAngle/rotateLeft): drei's <OrbitControls> calls
// controls.update() with no delta argument every frame, so the angle
// added per call is a fixed `(2*PI/60/60) * autoRotateSpeed` radians --
// at a steady ~60fps that works out to `6 * autoRotateSpeed` degrees of
// drift per second.
//
// AMBIENT_AUTO_ROTATE_SPEED (0.02, ~0.12 deg/s, a full 360-degree sweep
// in about 50 minutes) is deliberately subtle -- present enough that the
// sky never feels perfectly frozen, but slow enough to stay out of the
// way of normal use (reading a story in DetailPanel, aiming a click at a
// specific star).
//
// SATELLITE_AUTO_ROTATE_SPEED (0.08, ~0.48 deg/s, a full sweep in a
// little over 12 minutes -- 4x the ambient rate) is the same "slow and
// contemplative" speed this mode originally launched with, now reframed
// as a *boost* over the ambient rate rather than the only speed that
// ever applies. Still well under the library's own default of 2.0
// (~12 deg/s, a brisk 30-second lap, which would read as spinning rather
// than drifting).
export const AMBIENT_AUTO_ROTATE_SPEED = 0.02;
export const SATELLITE_AUTO_ROTATE_SPEED = 0.08;

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
