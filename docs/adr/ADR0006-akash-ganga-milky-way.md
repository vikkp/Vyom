# ADR0006 – Adding Akash Ganga (the Milky Way)

Status: Accepted
Date: 2026-08-12
Deciders: Project owner + senior consultant

## Context

Vyom plots ~150 catalog stars, 27 nakshatra asterisms, Saptarishi, and
the Navagraha (ADR0005) -- all discrete point/figure objects. The Milky
Way is different in kind: not a point or a small group of points but a
diffuse band of unresolved starlight tracing the galactic plane all the
way around the sky. Rendering it correctly requires knowing where the
galactic plane actually falls in RA/Dec (a coordinate system this app
has never needed before), and rendering it *well* requires a different
technique than "a star point" or "a line between stars" -- it needs to
read as a soft glow, not a hard-edged shape.

## Decision

Add a Milky Way band under its traditional Indic name, **Akash Ganga**
(आकाश गंगा -- "sky Ganga," the celestial river of the Bhagiratha story):

- The band follows the true galactic plane, computed from real galactic
  coordinates and rotated into the same RA/Dec space every other object
  in this app uses -- not a hand-placed decorative arc. Real astronomy
  stays non-negotiable (ADR0002) even for something this diffuse.
- Visual style is soft and ethereal: a wide, softly-feathered glow with
  brightness that varies along its length (denser toward the galactic
  center, fainter toward the anticenter, a secondary bright patch toward
  Carina) rather than a flat, uniform ribbon -- see
  docs/research/akash-ganga-sources.md for the real-sky reference this
  is modeled on.
- It sits behind every existing layer in depth (Rishis, mythic figures,
  stars, the Navagraha) so it reads as atmospheric backdrop, never
  competing with or obscuring named content -- directly answering the
  "enhance without overpowering" requirement.
- The label "Akash Ganga" appears at the band's brightest, most
  recognizable point (the galactic center, near Sagittarius/Scorpius)
  when the existing "names" layer is on, *or* when the camera is
  currently facing roughly toward that point -- so a curious user
  looking at the bright haze without the names layer enabled still gets
  told what they're looking at, without permanently cluttering the sky
  with a label anyone can see from any direction.
- Not clickable in this version -- explicitly deferred, per the
  project owner's spec.

## Technical Approach

### Galactic coordinates (new: src/utils/galactic.ts)

`galacticToEquatorial(l, b)` applies the standard Hipparcos equatorial-
to-galactic rotation matrix (Liu, Zhu & Zhang 2011, transposed since
it's an orthogonal rotation) to convert galactic longitude/latitude to
RA/Dec. Verified against known reference points before any rendering
code was written -- see docs/research/akash-ganga-sources.md and task
history: the north galactic pole and galactic center both resolve to
their real, independently-documented RA/Dec to well under a tenth of a
degree. Unlike the Navagraha, this transform has no date dependence --
the galactic plane's orientation relative to the equatorial frame is
effectively fixed on any timescale this app cares about, so the band's
underlying RA/Dec grid is computed once, not per frame or per date.

### Band geometry + texture (new: src/components/sky-viewer/akashGangaTexture.ts, AkashGanga.tsx)

- A **procedural canvas texture** (same technique already used for
  `groundTexture.ts`/`skylineTexture.ts`) bakes in the "soft, ethereal"
  look: a longitude-dependent brightness curve (bright at the galactic
  center and Carina, dim at the anticenter) times a two-layer Gaussian
  falloff across latitude (a narrow bright core plus a broader, fainter
  halo), plus light mottling so it reads as a textured starcloud rather
  than a flat gradient. Colour is a cool, pale white-blue, consistent
  with this app's existing "mostly cool white/blue-white" star palette
  (`StarField.tsx`'s `COOL_WHITE`).
- **Geometry**: a closed ring mesh spanning the full 360° of galactic
  longitude and a fixed latitude band (±16°, wide enough to read as the
  real Milky Way's visible glow without engulfing half the sky), built
  as a longitude x latitude grid where every vertex is converted
  galactic -> equatorial -> Alt/Az -> world position through the exact
  same `raDecToAltAz`/`altAzToVector3` calls every star already uses.
  Recomputed only when the observer's city or date/time changes
  (`useMemo`, same dependency pattern as `StarField`/`AsterismLines`),
  never per frame.
- **Material**: `MeshBasicMaterial` with the procedural texture,
  `transparent: true`, `depthWrite: false`, additive blending (a gentle
  wash of light added to the dark sky behind it, rather than a flat
  painted shape) -- kept deliberately low-intensity (peak alpha and
  colour strength both conservative) so it reads as atmosphere, not
  content.
- **Depth layering**: rendered at a radius between the star/figure shell
  and the ground disc's outer edge (inside `DOME_RADIUS`, comfortably
  under the horizon disc and far under `SkyGradient`'s much larger
  atmosphere sphere) so real depth-testing naturally occludes it behind
  the Rishis, mythic figures, the Navagraha, and every star, and lets
  the horizon disc occlude it below the horizon exactly like every other
  layer -- no manual altitude cutoff, consistent with this app's
  established occlusion approach.

### Label

A single `<Billboard>` + `<Html>` label anchored at the galactic
center's projected position (the band's real brightest, most
recognizable point). Visible when `visibleLayers.has("names")` (the
same toggle fixed-star names already use) **or** when the angle between
the camera's current facing direction and the label's direction is
under a threshold (~25°) -- computed per-frame with a single dot
product, negligible cost. One label, not several scattered along the
band, keeps this from reading as cluttered.

### Performance

One mesh, rebuilt only on date/location change (not per frame): a
longitude x latitude grid at a modest resolution (on the order of a
couple hundred vertices) is negligible next to the existing 200k+-point
background starfield. The per-frame cost is one dot product for the
label visibility check.

## Consequences

### Positive

- First diffuse/atmospheric content in the app, alongside the existing
  point-and-line vocabulary -- makes the sky read as fuller and more
  photographic without adding any new interactive complexity.
- Establishes a reusable galactic-coordinate utility
  (`src/utils/galactic.ts`) for any future galactic-plane content (e.g.
  specific deep-sky objects along the band) without re-deriving the
  transform.
- Procedural texture approach matches this project's existing pattern
  for atmospheric/ground content (`groundTexture.ts`, `skylineTexture.ts`)
  rather than depending on an external image asset.

### Negative / Risks

- The brightness profile along the band (bright at center/Carina, dim at
  anticenter) is a stylized approximation authored by eye against
  reference photographs, not sourced from actual sky-survey photometry
  -- consistent with this app's existing "not planetarium-grade"
  standard elsewhere, but worth stating plainly rather than implying
  scientific photometric accuracy.
- A fixed ±16° latitude band and fixed brightness curve won't capture
  real local variation (e.g. the Great Rift's dark dust lane through
  Cygnus/Aquila) -- explicitly out of scope for this first version.

## Follow-up

1. If a future pass wants more visual fidelity, the dark dust-lane
   detail (the "Great Rift") is a natural next layer -- a second,
   darker/desaturating texture pass along the same band geometry.
2. Clickability (e.g. opening a DetailPanel entry about Akash Ganga
   itself) is explicitly deferred per the project owner's spec for this
   version.
