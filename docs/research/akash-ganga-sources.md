# Akash Ganga (Milky Way): research

## Naming / mythology

"Akash Ganga" (आकाश गंगा, literally "sky Ganga") is the standard Hindi/
Sanskrit-derived name for the Milky Way across Indian languages and
popular usage -- the band of light is traditionally pictured as the
celestial Ganges river flowing across the sky, the same river Bhagiratha
famously brought down to earth in the Puranic story. This is the
Indic-first name this app already uses that convention for (nakshatra
stars, the Navagraha) -- no separate Western label is shown by default,
consistent with `StarField.tsx`'s existing Indian-first labelling
approach.

## Astronomical approach: galactic coordinate transform

The Milky Way's band is the galactic plane (galactic latitude b ≈ 0°),
projected onto the sky. Every other object in this app has a native
RA/Dec; the galactic plane's natural coordinates are galactic longitude/
latitude (l, b), so a coordinate transform is needed before it can be
fed through the existing `raDecToAltAz`/`altAzToVector3` pipeline.

**Matrix used**: the standard Hipparcos equatorial(J2000)-to-galactic
rotation matrix, as documented in Liu, Zhu & Zhang (2011), "Reconsidering
the Galactic coordinate system" (arXiv:1010.3773), equation 9, labelled
`N_Hip` -- the same coordinate definition used by essentially every
general-purpose astronomy library (e.g. Astropy's built-in `Galactic`
frame). Converting galactic -> equatorial (the direction this app
needs) uses the matrix transpose, since it's an orthogonal rotation
matrix (transpose = inverse).

```
N_Hip =
[ -0.0548755604  -0.8734370902  -0.4838350155 ]
[ +0.4941094279  -0.4448296300  +0.7469822445 ]
[ -0.8676661490  -0.1980763734  +0.4559837762 ]
```

Applied as: convert (l, b) to a galactic unit Cartesian vector, multiply
by `N_Hip^T` to get an equatorial unit Cartesian vector, then recover
RA/Dec from that vector the same way `planetaryPositions.ts` already
does for the Keplerian planets.

**Verification** (standalone Python port of the exact formula, before
writing any TypeScript): the north galactic pole (l=0, b=90) resolves to
RA 12h51m26s / Dec +27°07'41", matching the source paper's own quoted
value to under a thousandth of a degree; the galactic center (l=0, b=0)
resolves to RA 17h45m37s / Dec -28°56', matching the real position of
Sagittarius A* to under a tenth of a degree; spot checks at galactic
longitudes 90° (Cygnus region), 180° (the anticenter, toward Auriga/
Taurus) and 283° (Carina) all land in the physically correct, real part
of the sky where the Milky Way is actually brightest or dimmest.

No time-dependence: unlike the Navagraha, the galactic plane's
orientation relative to the fixed stars doesn't meaningfully change on
any timescale this app cares about, so the band's RA/Dec positions are
computed once (module-level, not per date) and only re-projected through
the existing Alt/Az pipeline when the observer's date/time/location
changes -- exactly like a fixed star.

## Visual reference (real-sky appearance, used to shape the procedural texture)

The Milky Way is not uniformly bright along its length: it's brightest
toward the galactic center (Sagittarius/Scorpius, l≈0°), has a second,
smaller bright concentration toward Carina/Crux (l≈283°, the richest
part of the southern Milky Way), and is faintest at the galactic
anticenter (l≈180°, toward Auriga/Taurus/Gemini). It also isn't a sharp-
edged ribbon -- real photographs show a soft, wide, mottled glow, denser
and narrower near the core and broader/fainter toward the edges. The
procedural texture (`akashGangaTexture.ts`) encodes this with a
longitude-dependent brightness curve (peaks at l=0 and l=283, a dip at
l=180) and a two-layer Gaussian falloff across latitude (a narrow bright
core plus a broader, fainter halo) rather than a flat, uniform band.
