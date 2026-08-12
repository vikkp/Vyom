# Vyom

**Walk the Sky of the Ancients**

Vyom is a real, location-based night sky you can stand under and explore — except every star, planet, and patch of sky is also a doorway into Bharatiya (Vedic/Puranic) mythology. Pick your city, and the app renders the actual sky above you right now: the 27 Nakshatras in their true positions, the Navagraha (Sun, Moon, and five visible planets, plus the lunar nodes Rahu/Ketu) where they truly sit tonight, the Saptarishi and Dhruva Tārā, and the Akash Ganga arcing overhead — each one clickable, each one carrying a researched story about who it is in the tradition and why it belongs where the sky puts it.

Live at [vyomvihar.com](https://vyomvihar.com).

## What it does

- **A real sky, not a stylized one.** Choose a city (or use geolocation) and a date/time, and the dome above you is computed from actual astronomical positions for that place and moment — not a fixed illustration. Look up and you're looking at tonight's sky.
- **27 Nakshatras**, each with its own asterism line drawing, a chroma-keyed figure/deity illustration anchored to its stars, and a researched story in its detail panel — symbol, presiding deity, and mythological significance, all citation-backed.
- **The Navagraha** — the nine "planets" of Vedic astronomy (Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, Ketu) — plotted at their real, continuously-recomputed positions for the selected date, each with its own story.
- **Saptarishi and Dhruva Tārā**, the seven sages of the Great Bear and the fixed pole star they circle, with portrait art and stories, anchored to their real stars (Ursa Major).
- **Akash Ganga**, the Milky Way, rendered as a soft glowing band across the dome in its true galactic position, itself a clickable, story-bearing node.
- **Search and fly-to.** Type a name — Indic names rank first, with recognized aliases (e.g. "Jupiter" finds Guru) — and the camera smoothly turns to face it.
- **"I am a satellite" mode.** The sky always drifts gently on its own (an always-on ambient rotation); searching "satellite" (or "orbit", "drift") speeds that same drift up for a more pronounced sense of gliding through the stars, with a one-click way back to the calm default.
- **A relationship graph underneath all of it.** Every node — nakshatra, deity, sage, planet, character, story-event — is connected to others by typed edges (parent, spouse, guru, astronomical association, and more), so the mythology reads as a web, not a list.

## What it takes to build this

The hard part of Vyom was never really the 3D — it was getting a real sky right and putting real research under everything sitting in it. A few examples of what that meant in practice:

**Where things actually are.** Every star's position on screen comes from converting its catalog right ascension/declination into local altitude/azimuth for the observer's city and the exact moment selected, using local sidereal time and the standard spherical-trigonometry transform (`src/utils/astronomy.ts`, following Duffett-Smith's *Practical Astronomy*). That result then gets projected onto a dome around the viewer. It sounds like a formality, but it's the difference between "a picture of stars" and "the sky over Bengaluru at 9pm tonight."

**The Navagraha move.** Unlike stars, planets don't sit still in a catalog — their positions have to be computed fresh for whatever date is selected. Vyom uses three different formula families depending on the body: the Astronomical Almanac's low-precision closed-form solutions for the Sun and Moon, JPL's published Keplerian orbital elements (Standish & Williams, 1992) with Kepler's equation solved numerically for Mercury, Venus, Mars, Jupiter, and Saturn, and Meeus's mean-lunar-node formula for Rahu/Ketu. All three converge on the same geocentric ecliptic longitude/latitude, which is then rotated to equatorial coordinates through one shared obliquity calculation before being handed to the same Alt/Az pipeline the stars use.

**Where the Milky Way actually runs.** The Akash Ganga's position isn't guessed — it's derived by rotating true galactic coordinates into the equatorial frame using the standard Hipparcos rotation matrix (Liu, Zhu & Zhang, 2011), verified against known reference points (the galactic center and north galactic pole both resolve to their independently documented RA/Dec to well under a tenth of a degree) before it ever got drawn.

**A camera that behaves like standing still.** The viewer's camera orbits a near-zero radius around a fixed point — you're not moving through space, you're turning your head. Zoom is FOV-based rather than distance-based, since dolly zoom has nowhere to go when you're standing in the center of the dome. Search-to-fly-to and the always-on ambient drift both build on top of that same fixed-origin model, using spherical interpolation for the fly-to turn and three.js's own auto-rotation (deliberately tuned to a near-imperceptible pace) for the drift.

**Making the sky itself look right.** The Akash Ganga's glowing band is a procedurally generated canvas texture — multi-octave value noise for a dust-lane look, blurred with a wrap-safe Gaussian pass (the texture is tiled three times horizontally before blurring so the sphere's seam doesn't show a visible edge). Getting from "looks like a search-light beam" to "looks like a soft galactic glow" took several iterations, including a full rebuild from an open ring to a closed sphere and a fix for a UV-seam artifact that only showed up from certain camera angles.

**Research before code.** Every mythological and astronomical claim in the app — each Nakshatra's presiding deity and symbol, each Navagraha's mythology, the Akash Ganga's own significance — has a corresponding citation-backed research document under `docs/research/` (39 of them at the time of writing) written *before* the corresponding feature was implemented, not after. Every non-trivial design decision along the way — the data model, the camera model, adding the Navagraha, adding the Milky Way, the story-content format, search, satellite mode — has a matching Architecture Decision Record under `docs/adr/` (nine so far) explaining what was decided and why, including at least one case (satellite mode) that was revised in place after real usage turned up a better design.

## Data model

The content is a directed, labelled graph (`src/types/graph.ts`):

- **Nodes** — nakshatras, deities, sages, graha (planets), characters, celestial objects, and story-events. 84 nodes as of this writing: 27 nakshatras, 25 deities, 12 sages, 9 graha, 8 characters, 2 other celestial nodes, and 1 story-event.
- **Edges** — typed relationships between nodes (parent, spouse, guru, astronomical association, story-link, and more). 98 edges as of this writing.
- **Story field** — an optional narrative field on a node, rendered in the detail panel when present. Most nodes with a real sky position (all 27 nakshatras, all 9 Navagraha, the 7 Rishis, Dhruva Tārā, Akash Ganga) carry one.

`src/data/graph.json` is the live, hand-maintained source of truth — it has grown well beyond what any generator script produces. `scripts/build-graph-data.mjs` is the original bootstrap script that produced the very first version of the graph (Dhruva Tārā, the Trimurti, the Saptarishi, and the 27 Nakshatras with their deities); it predates the Navagraha, the Akash Ganga, and every story field added since, and running it again would overwrite all of that. It's kept for historical reference, not as a current workflow — edit `graph.json` directly.

## Stack

- Vite + React 19 + TypeScript
- React Three Fiber / drei (Three.js) for the 3D sky
- Zustand for state
- Tailwind CSS for UI
- Deployed on Cloudflare, auto-deploying from this repository at [vyomvihar.com](https://vyomvihar.com)

## Development

```
npm install
npm run dev       # local dev server
npm run build     # tsc -b && vite build
npm run preview   # serve the production build locally
```

## Project history

Vyom started as an abstract, Dhruva-centered graph view (`src/components/sky/*`, `src/scene/*` — still present in the codebase and still functional, just not mounted in `App.tsx`). ADR0002 replaced the default view with the real, location-based sky viewer (`src/components/sky-viewer/*`) that the app now runs, and everything since — asterism art, the Navagraha, the Akash Ganga, story content, search, and satellite mode — has built on top of that. The full decision trail lives in `docs/adr/ADR0001` through `ADR0009`.
