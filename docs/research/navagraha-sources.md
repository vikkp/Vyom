# Navagraha: astronomy + mythology research

## Scope

The nine traditional Grahas: Surya (Sun), Chandra (Moon), Mangala (Mars),
Budha (Mercury), Guru/Brihaspati (Jupiter), Shukra (Venus), Shani
(Saturn), Rahu (north lunar node), Ketu (south lunar node). Earth is
excluded per the project owner's explicit decision (an observer standing
on Earth doesn't see Earth in the sky) -- see ADR0005.

## Astronomical approach

Consistent with this app's existing standard (`src/utils/astronomy.ts`:
"good enough for a real-time sky visualization, not planetarium-grade"),
every Graha's position is computed with a well-known **low-precision**
formula rather than a full perturbation theory (VSOP87/ELP2000/DE44x).
Each body category uses the specific published low-precision method best
suited to it, all normalized to true geocentric equatorial RA/Dec (the
same coordinate space every fixed star in `starCatalog.ts` already uses)
and then projected onto the dome exactly like a star via the existing
`raDecToAltAz`/`altAzToVector3` pipeline. No ayanamsa/sidereal-zodiac
correction is applied anywhere -- this app plots where things *actually
are* in the real sky (ADR0002's founding principle), not a symbolic
nirayana longitude used for chart-casting.

### Sun (Surya)

Astronomical Almanac low-precision solar formula (page C5, as
reproduced by Celestial Programming / astrogreg.com): geocentric
ecliptic longitude from a two-term equation-of-center correction to the
Sun's mean longitude, ecliptic latitude fixed at 0, then rotated to
equatorial by the mean obliquity of the ecliptic. Source states an
accuracy of about 1° over 1950-2050 (a conservative published bound;
Meeus-family formulas of this same shape are typically much better in
practice) -- comfortably inside this app's existing precision tier.

### Moon (Chandra)

Astronomical Almanac low-precision lunar formula (page D46/D76, a
6-term longitude series and 4-term latitude series in the Moon's mean
anomaly, elongation, and argument of latitude), as reproduced and
independently validated by Keith Burnett (stargazing.net) against the
NASA JPL Twelve-Year Planetary Ephemeris: **~0.015 hours RA / ~0.12° Dec
typical error**, valid to about a quarter-degree on the sky over 1900-2100.
This is the same family of low-precision periodic-term series
popularized by Peter Duffett-Smith's "Practical Astronomy with your
Calculator or Computer" -- the book `astronomy.ts` already cites as this
app's baseline reference, so the Moon's method stays consistent with the
rest of the app's astronomy lineage rather than introducing an unrelated
source.

### Mercury, Venus, Mars, Jupiter, Saturn

JPL Solar System Dynamics' published Keplerian elements and rates
(Standish & Williams, 1992; "Approximate Positions of the Planets" as
currently hosted at ssd.jpl.nasa.gov/planets/approx_pos.html), Table 1,
valid 1800 AD - 2050 AD (chosen over the wider 3000 BC - 3000 AD Table 2,
which needs extra correction terms for Jupiter through Saturn, since this
app's date picker has no legitimate use for millennia-scale dates). Each
planet's heliocentric position is found by solving Kepler's equation for
its six J2000 elements (semi-major axis, eccentricity, inclination, mean
longitude, longitude of perihelion, longitude of ascending node) plus
linear secular rates; the geocentric position is then the vector
difference against Earth's own heliocentric position (computed the same
way, from the table's Earth-Moon-barycenter row), rotated from the J2000
ecliptic frame to equatorial by the mean obliquity. Nominal accuracy over
this date range is a few tens of arcseconds in longitude for the inner
planets, a few hundred for Jupiter/Saturn (per JPL's own published error
table) -- far more than sufficient for a naked-eye sky view.

### Rahu / Ketu

Modeled as the Moon's **mean** ascending/descending node, using Jean
Meeus' standard formula for the mean longitude of the node:
`Ω = 125.04452 − 1934.136261T + 0.0020708T² + T³/450000` (T = Julian
centuries since J2000.0). Rahu is the ascending (north) node, Ω itself;
Ketu is the descending (south) node, always exactly Ω + 180° -- both
sit on the ecliptic (latitude 0 by definition), converted to equatorial
RA/Dec the same way as every other body here.

**Judgment call, flagged rather than silently decided**: Vedic astrology
uses both a **mean** node (smooth, monotonic, the formula above) and a
**true** node (the Moon's instantaneous actual crossing point, which
includes periodic oscillation terms with ~1.5° amplitude and can
occasionally sit still or even move backward-then-forward within a
single lunar month). This app uses the **mean** node: it matches the
"low-precision, well-documented formula" tier used for every other body
here, doesn't require importing the Moon's own higher-order periodic
terms just to extract a derived quantity, and is the more common default
in general-purpose astronomical software (though several dedicated Vedic
astrology / panchang tools default to true node instead). See ADR0005's
Consequences section -- switching to true node later is a self-contained
change to one function, not a rework of anything downstream.

## Mythology (names, symbols, associations)

Standard Puranic/Jyotisha tradition, consistent across the major
reference works on Hindu astronomy/astrology (e.g. the Surya Siddhanta's
graha framework, and standard secondary treatments like Wikipedia's
"Navagraha" and "Rahu"/"Ketu" articles):

| Graha | Sanskrit | Body | Symbol | Mythological note |
|---|---|---|---|---|
| Surya | सूर्य | Sun | Chariot drawn by seven horses | The solar deity; soul, vitality, father |
| Chandra | चन्द्र | Moon | Crescent moon | Also called Soma; mind, emotion, mother |
| Mangala | मंगल | Mars | Spear/mace, rides a ram | Also called Kuja/Angaraka; son of the Earth goddess; courage, conflict |
| Budha | बुध | Mercury | Sword and shield, rides a lion | Son of Chandra and Tara; intellect, communication |
| Guru (Brihaspati) | गुरु / बृहस्पति | Jupiter | Staff and manuscript, rides an elephant | Preceptor of the Devas; wisdom, teaching, fortune |
| Shukra | शुक्र | Venus | Rides a white horse/chariot | Preceptor of the Asuras; beauty, love, wealth |
| Shani | शनि | Saturn | Rides a crow, holds a bow | Son of Surya and Chhaya; discipline, karma, delay |
| Rahu | राहु | Moon's ascending node | Serpent's severed head | Half of the demon Svarbhanu, decapitated by Vishnu's Mohini after stealing amrita; obsession, illusion |
| Ketu | केतु | Moon's descending node | Serpent's severed tail | The same demon's other half; detachment, moksha |

## Visual treatment

Per the project owner's explicit spec: each Graha is visually distinct
from fixed stars (slightly larger point + a subtler colored glow keyed
to a traditional association -- e.g. Surya warm gold, Chandra cool
silver, Mangala red, Shani pale/ashen), uses its Indic name as the
primary label (matching the Indian-first labelling convention already
established for nakshatra stars), and is clickable to open DetailPanel
via the existing `useGraphStore.select()` mechanism -- the same pattern
`StarField.tsx` already uses for named stars.
