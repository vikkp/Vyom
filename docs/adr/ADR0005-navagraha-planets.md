# ADR0005 – Adding the Navagraha (Planets)

Status: Accepted
Date: 2026-08-11
Deciders: Project owner + senior consultant

## Context

Vyom currently plots the fixed sky -- ~150 catalog stars grouped into
Saptarishi, the 27 Nakshatras, and Dhruva Tara, all of which sit at a
fixed RA/Dec regardless of when you look. The Navagraha ("nine seizers"
in Jyotisha/Hindu astronomy) are the classical wandering bodies --
Surya (Sun), Chandra (Moon), Mangala (Mars), Budha (Mercury), Guru/
Brihaspati (Jupiter), Shukra (Venus), Shani (Saturn), and the two lunar
nodes Rahu and Ketu. Unlike every object in the app so far, their sky
position genuinely changes with date/time, not just with the observer's
location -- adding them means introducing real orbital-mechanics
calculation for the first time, not just another RA/Dec lookup.

## Decision

Add the full traditional Navagraha as a new overlay layer:

- Surya, Chandra, Mangala, Budha, Guru (Brihaspati), Shukra, Shani,
  Rahu, Ketu -- all nine.
- **Earth is explicitly not included.** An observer standing on Earth
  does not see Earth in their sky; every other object in this app is
  something you could point a finger at from where you're standing, and
  the Navagraha should be no exception.
- Each Graha is positioned at its true geocentric apparent RA/Dec for
  the app's current date/time/location (the same "real astronomy is
  non-negotiable" principle every prior ADR has held to -- see
  docs/research/navagraha-sources.md for the specific formula used per
  body category).
- Each Graha's primary label is its Indic name (Surya, not "Sun";
  Brihaspati/Guru, not "Jupiter"), matching the Indian-first naming
  convention already established for nakshatra stars.
- Each Graha renders visually distinct from fixed stars: a larger point
  plus a subtler colored glow keyed to its traditional association,
  rather than reusing the plain white/warm star treatment.
- Each Graha is clickable and opens DetailPanel with its own
  mythological summary, the same interaction fixed stars already
  support.

## Technical Approach

### Astronomical calculation (new: src/utils/planetaryPositions.ts)

Every prior object in this app has a fixed RA/Dec (`starCatalog.ts`) fed
through the existing `raDecToAltAz`/`altAzToVector3` pipeline
(`src/utils/astronomy.ts`). The Navagraha need their RA/Dec *computed*
for the given moment first. Three different low-precision methods are
used, one per body category (full detail and sourcing in
docs/research/navagraha-sources.md):

- **Surya**: Astronomical Almanac's low-precision solar formula --
  direct closed-form geocentric ecliptic longitude, no iteration.
- **Chandra**: Astronomical Almanac's low-precision lunar formula -- a
  short periodic-term series (6 longitude terms, 4 latitude terms),
  independently validated to ~0.12° against the NASA JPL ephemeris. Same
  lineage (Duffett-Smith-style low-precision series) as the
  Alt/Az conversion this app already uses.
- **Mangala, Budha, Guru, Shukra, Shani**: JPL's published Keplerian
  elements and secular rates (Standish & Williams 1992, valid 1800-2050
  AD) -- solve Kepler's equation for each planet's heliocentric
  position, subtract Earth's own heliocentric position (from the same
  table's Earth-Moon-barycenter row), rotate ecliptic to equatorial.
- **Rahu / Ketu**: the Moon's mean ascending/descending node (Meeus'
  standard linear-in-T formula for Ω), 180° apart, both at ecliptic
  latitude 0. See the research doc for the mean-vs-true node tradeoff
  this decision makes explicitly.

All three methods converge on the same output shape -- geocentric
ecliptic longitude/latitude, rotated to equatorial RA/Dec by the mean
obliquity of the ecliptic (one shared helper, applied consistently
across all nine bodies rather than each source's own slightly different
obliquity approximation, since the difference is well below this app's
precision floor). No ayanamsa/sidereal correction anywhere -- consistent
with ADR0002, this plots where things actually are, not a symbolic
zodiac placement.

### Data + rendering (new: src/data/navagraha.ts, src/components/sky-viewer/NavagrahaField.tsx)

- A small static table (9 entries): id, Indic name, Sanskrit, a
  traditional accent color, and a size multiplier relative to a normal
  named star.
- `NavagrahaField` mirrors `StarField.tsx`'s structure (position via the
  computed RA/Dec fed through the same `raDecToAltAz`/`altAzToVector3`
  calls every star uses, click-to-select via `useGraphStore`, the same
  glow-billboard technique), recomputing each Graha's RA/Dec whenever
  the selected date changes (`useMemo` keyed on `currentDate`, same
  dependency pattern `StarField`/`RishiOverlays` already use for
  date-driven repositioning).
- Rendered as its own group in `SkyViewer.tsx`, gated by the existing
  `"stars"` visibility layer (a Graha is conceptually a bright point in
  the sky, same category as a star, so hiding stars reasonably hides
  planets too) rather than introducing a new toggle the user didn't ask
  for.

### Graph + DetailPanel

- Nine new nodes added to `src/data/graph.json` (id, name, sanskrit,
  symbol, summary per docs/research/navagraha-sources.md's mythology
  table), plus a new `"graha"` `NodeType`/`NodeGroup` and a
  `NODE_COLORS`/`NODE_SIZES` entry in `src/scene/nodeStyle.ts`, so
  DetailPanel (which resolves purely through `useGraphStore.getNode()`)
  works for the Navagraha exactly the way it already does for stars,
  nakshatras, and rishis -- no DetailPanel code changes needed.

### Performance

Nine extra position calculations per date change (not per frame) --
negligible next to the existing ~150-star catalog and the 200k+-point
background starfield. Each Graha renders as one more billboard group,
the same cost profile as a named catalog star.

## Consequences

### Positive

- First "living sky" content in the app -- objects that visibly move
  night to night, which is itself a demonstration of the app's core
  premise (a real, not merely decorative, sky).
- Establishes a clean seam (`planetaryPositions.ts`) for any future
  moving-body content (e.g. a specific historical transit) without
  touching the fixed-star pipeline at all.
- Every calculation method is a well-published, independently-verified
  low-precision formula, not a from-scratch derivation -- keeps the
  "not planetarium-grade, good enough for real-time visualization"
  standard this app has held since `astronomy.ts`.

### Negative / Risks

- Three different source formulas (Sun, Moon, Keplerian-planets) instead
  of one, because no single low-precision method covers a body this
  close (Moon) and a body this far (Saturn) equally well -- more surface
  area to maintain than the rest of the app's single-formula
  `raDecToAltAz`.
- Mean node (Rahu/Ketu) will drift from various panchang tools that
  default to true node, by up to ~1.5° at times -- flagged explicitly in
  the research doc rather than silently chosen, and cheap to swap later
  if it matters.
- JPL's Table 1 elements are only rated accurate 1800-2050 AD -- fine for
  any realistic use of this app's date picker, but a hard boundary if
  the date range is ever extended far outside that window.

## Follow-up

1. If a future request wants historically/astrologically precise
   node behavior (e.g. matching a specific panchang), swap the mean-node
   formula for a true-node series -- isolated to one function in
   `planetaryPositions.ts`.
2. Uranus/Neptune (not part of the traditional Navagraha, discovered
   telescopically) are explicitly out of scope for this ADR.
3. A future "current planetary positions" or "graha overview" summary
   panel is a natural follow-on now that this data exists, but isn't
   part of this decision.
