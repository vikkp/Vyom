# Research notes: sky viewer star catalog (ADR0002)

Date: 2026-08-11

Sources and methodology for `src/data/starCatalog.ts` — the real J2000 coordinates behind the location-based sky viewer.

## Nakshatra yogatara (junction stars)

Primary source: the Brihat Samhita (Varahamihira, 6th century CE), Appendix 3, "List of 28 yogatārās (chief stars) of the constellations", via [wisdomlib.org](https://www.wisdomlib.org/hinduism/book/brihat-samhita/d/doc228915.html). This gives the traditional star identification for each nakshatra directly from a primary Jyotisha text — satisfying the "primary-text citation" requirement raised in the earlier senior review (see `nakshatra-deities-sources.md`).

Modern proper names, Bayer designations, and J2000 RA/Dec/magnitude were then cross-checked against Wikipedia and TheSkyLive.com for each of the 27 stars (research delegated to a sub-agent; full table is in `src/data/starCatalog.ts`'s `NAKSHATRA_STARS`).

Judgment calls made during that research, worth flagging:

- **Ashwini** → β Arietis (Sheratan, mag 2.64), chosen over γ Arietis (Mesarthim, mag 3.88) as the single brighter/more commonly cited star. The Brihat Samhita just says "Arietis" without a clear letter in the extracted text.
- **Bharani** → 41 Arietis (mag 3.63), the star the IAU officially named "Bharani" in 2017. The Brihat Samhita table cites "35 Arietis," a fainter star; modern convention has shifted to 41 Arietis.
- **Ashlesha** → ε Hydrae (mag 3.38) — matches the IAU's own 2017 approved name "Ashlesha" for this star.
- **Shatabhisha** → λ Aquarii. Its Western name was only reassigned by the IAU in September 2025 (the older name "Hydor" moved to 2 Ceti) — worth knowing if cross-referencing older material.
- Betelgeuse (Ardra), Antares (Jyeshtha), and Dschubba (Anuradha) are variable stars; the magnitude used is a fixed representative value for rendering, not their true fluctuating brightness.

Abhijit (traditionally a 28th/intercalary nakshatra, associated with Vega) is excluded, consistent with ADR0001's "27 Nakshatras" scope.

## Saptarishi / Big Dipper stars

Unchanged from the original sky module — see `nakshatra-deities-sources.md` for that research (current-Manvantara vs. astronomical/mind-born-sons Saptarishi lists).

## Additional bright stars

~25 more naked-eye stars (Sirius, Canopus, Vega, Rigel, etc.) added purely for sky realism — no `nodeId`, no mythological claim attached. Sourced from Wikipedia's bright-star pages.

## Alt-Az conversion

`src/utils/astronomy.ts` implements the standard Duffett-Smith formulas (Local Sidereal Time → Hour Angle → Alt/Az). Verified numerically: Polaris's computed altitude tracks the observer's latitude (within ~1°, since Polaris isn't exactly at the celestial pole) and its azimuth stays near 0°/360° (due north) across different times of day and both hemispheres — the expected physical behaviour.

## Known v1 simplifications

- No atmospheric refraction, nutation, precession-of-date, or aberration correction — fine for a visualization, not for precision ephemeris work.
- `TimeControls`'s date/time picker is interpreted in the browser's local timezone, not the selected city's — a real per-city timezone lookup is a follow-up if this matters in practice.
- Geolocation uses whatever `navigator.geolocation` returns with no reverse-geocoded city name.
