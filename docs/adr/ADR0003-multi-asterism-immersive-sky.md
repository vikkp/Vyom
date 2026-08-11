# ADR0003 – Multi-Asterism Immersive Sky

Status: Accepted
Date: 2026-08-11
Deciders: Project owner + senior consultant

## Context

The location-based sky viewer (ADR0002) currently shows a realistic night sky with the Saptarishi. To create a truly immersive experience comparable to SkyGuide and classic planetariums, the sky must feel infinite, the horizon must feel curved (as if standing on a sphere), and each city should have its own recognisable skyline silhouette.

## Decision

We will evolve the sky into a fully immersive, multi-asterism experience with the following core characteristics:

1. **Infinite / Fully Rotatable Sky**
   The user can freely look in any direction — including straight up, straight down, and full 360° yaw. The sky has no hard boundaries.

2. **Curved Horizon (Spheroid Feel)**
   The horizon is rendered as a gentle curve, giving the sensation of standing on a large sphere rather than a flat plane.

3. **City-Specific Skyline Silhouettes**
   Each supported city has a distinctive dark silhouette on the horizon that reflects its iconic landmarks. Examples: Kolkata (Howrah Bridge, Victoria Memorial, Vidyasagar statue), New Delhi (India Gate, Qutub Minar, Lotus Temple outline), New York (Empire State Building, Chrysler Building, Statue of Liberty), Mumbai (Gateway of India, skyline), London (Big Ben, London Eye, Tower Bridge), etc.

4. **Multi-Asterism Content** (from previous discussion)
   Progressive addition of major Indian asterisms with accurate stars, lines, optional mythic figures, and graph links.

### Priority Order for Asterisms (v1)

| Priority | Asterism | Notes | Figure Direction |
|---|---|---|---|
| 1 | Saptarishi | Already implemented | 7 Rishis |
| 2 | Mrigashira (Orion area) | Strong shape recognition | Deer / hunter |
| 3 | Rohini | Aldebaran + Hyades | Rohini / cow |
| 4 | Krittika | Pleiades | Sisters / flame |
| 5 | Dhruva context | Polaris + surroundings | Young Dhruva |

### Process Rules

- Visual immersion (infinite sky, curved horizon, density, atmosphere) takes absolute priority.
- Skyline silhouettes are added per city only after the core sky mechanics are solid.
- Stars + lines before figure overlays.
- Never sacrifice overall beauty or performance for more content.

## Decisions & Clarifications (locked 2026-08-11)

Raised during review and resolved before implementation:

1. **Full rotation** — already satisfied by the current `OrbitControls` setup (`minPolarAngle`/`maxPolarAngle` at a tiny epsilon from the poles, unrestricted azimuth). Keep the epsilon rather than going to literal 0/π — OrbitControls gimbal-locks at the exact poles. This item is verification, not new work.

2. **Curved horizon** — implemented as real geometry (a sphere-cap ground), not a fisheye/barrel post-processing shader, to avoid adding a new rendering dependency and to keep the existing depth-write occlusion trick working unchanged. Curvature strength is a single tunable constant (`GROUND_CURVE_RADIUS`), set subtle rather than dramatic — this is a stylized exaggeration of real curvature (true Earth curvature is imperceptible at standing height), not a physical simulation. Known trade-off: because the curved ground dips below the true `alt = 0` plane away from dead-centre, stars at altitudes very close to zero may very slightly outrun the ground's occlusion near the edge of view. Accepted as an intentional consequence of choosing the curved-horizon aesthetic over strict flatness, and kept small by keeping the curvature subtle.

3. **Skylines** — hand-authored, simplified SVG silhouettes (flat icon-style outlines), since there is no image-generation capability available in this environment and simplified vector silhouettes suit the stylized aesthetic better than photo-based ones would anyway. Scope locked to Kolkata + New York first, per the Follow-up order below. All other cities in the catalog show the plain curved horizon (no skyline) until authored — no generic placeholder skyline.

4. **New asterisms** — full multi-star line-figures (Hyades member stars for Rohini, Pleiades member stars for Krittika, Orion head stars for Mrigashira, etc.), not the existing single yogatara junction-stars already in the nakshatra catalog. This is new star data plus new `Asterism` entries, following the same researched/cited process used for Saptarishi — a real research task, not a reuse of existing markers.

Visual immersion remains the top priority throughout implementation.

## Consequences

### Positive

- Creates a deeply immersive "standing under the real sky" feeling.
- Strong local identity through city skylines.
- Clear differentiation from generic star apps.

### Negative / Risks

- Curved horizon + full spherical navigation adds technical complexity.
- Skyline assets need to be created or sourced for each city.
- Performance must be watched on mobile.

## Implementation Notes

- Use a proper celestial sphere camera (no artificial limits on pitch/yaw beyond the pole epsilon).
- Horizon rendered as a curved band/ground-cap with soft falloff, curvature magnitude driven by one tunable constant.
- Skylines as SVG-based silhouettes that rotate with azimuth and stay locked to the horizon.

## Follow-up

1. First finish making the current Saptarishi view dense and beautiful. *(Done — see the sky-viewer density/atmosphere/rishi-sizing commits preceding this ADR.)*
2. Implement full spherical navigation + curved horizon.
3. Add skyline support starting with Kolkata and New York.
4. Only then begin the next asterism (Mrigashira).
