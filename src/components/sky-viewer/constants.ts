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
