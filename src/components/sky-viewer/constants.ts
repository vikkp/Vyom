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
