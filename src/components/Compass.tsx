import { useSkyViewerStore } from "../store/skyViewerStore";

interface Cardinal {
  label: string;
  angle: number;
  primary?: boolean;
}

// Angles measured clockwise from top (0=N), matching astronomy.ts's az
// convention (North=+Z/top, East=+X/right) so the widget agrees with
// every direction computation elsewhere in this app.
const CARDINALS: Cardinal[] = [
  { label: "N", angle: 0, primary: true },
  { label: "E", angle: 90 },
  { label: "S", angle: 180 },
  { label: "W", angle: 270 },
];

const TICK_ANGLES = [45, 135, 225, 315];

function pointOnCircle(radius: number, angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.sin(rad) * radius, y: -Math.cos(rad) * radius };
}

/**
 * A heading-up compass HUD, fixed to the top-right corner -- replaces the
 * old in-sky N/E/S/W billboard labels that used to sit on the horizon
 * (Horizon.tsx): at a distance and low opacity those read as faint,
 * artifact-like smudges rather than clean letters, and per the project
 * owner's explicit direction this is now a proper widget instead,
 * modeled on a car-nav "heading-up" compass (reference: Tesla's in-car
 * map compass) -- a fixed pointer at top marks "the direction the camera
 * currently faces," and the ring of cardinal letters rotates underneath
 * it, the same way a nav compass rotates around a car icon that stays
 * centred and pointed up.
 *
 * Styling matches this app's existing HUD chrome exactly (SkyLayerToggles'
 * dark glass pill: black/60 + backdrop-blur-md + white/10 border, amber-100
 * as the sole accent color) rather than introducing a new visual language.
 *
 * Heading comes from CompassHeadingTracker (mounted inside the R3F
 * <Canvas>, see SkyViewer.tsx) via the shared zustand store -- this
 * component itself is plain HTML, a sibling of Header/SkyLayerToggles in
 * App.tsx, with no direct camera access of its own.
 */
export function Compass() {
  const heading = useSkyViewerStore((s) => s.cameraHeadingDeg);

  return (
    <div className="pointer-events-none absolute right-4 top-4 z-10">
      <div className="relative h-20 w-20 rounded-full border border-white/10 bg-black/60 shadow-lg shadow-black/40 backdrop-blur-md">
        {/* Fixed pointer -- "the direction we're currently facing," never rotates. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderBottom: "6px solid #fde68a",
          }}
        />

        {/* The rotating ring: letters + tick marks turn opposite the camera's
            heading so whichever direction is currently faced reads at top,
            under the fixed pointer above. */}
        <div className="absolute inset-0" style={{ transform: `rotate(${-heading}deg)` }}>
          <svg viewBox="-40 -40 80 80" className="h-full w-full">
            {TICK_ANGLES.map((angle) => {
              const outer = pointOnCircle(34, angle);
              const inner = pointOnCircle(29, angle);
              return (
                <line
                  key={angle}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1.5}
                />
              );
            })}
            {CARDINALS.map(({ label, angle, primary }) => {
              const p = pointOnCircle(24, angle);
              return (
                <text
                  key={label}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={primary ? 13 : 11}
                  fontWeight={primary ? 700 : 400}
                  fill={primary ? "#fde68a" : "rgba(255,255,255,0.6)"}
                  // Counter-rotate each glyph by the same amount the ring is
                  // rotated by, about its own anchor point, so letters stay
                  // upright instead of tilting as the ring spins -- the
                  // same technique real nav-compass widgets use.
                  transform={`rotate(${heading}, ${p.x}, ${p.y})`}
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Centre dot -- the fixed observer, like the car icon on a nav compass. */}
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
      </div>
    </div>
  );
}
