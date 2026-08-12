# Dhanishta: asterism research

## Decision

A closed four-star quadrilateral -- the existing yogatara Beta Delphini
(Rotanev) joined by Alpha (Sualocin), Gamma, and Delta Delphini, the
compact rhombus/kite shape popularly called "Job's Coffin." New
`DHANISHTA_EXTRA_STARS` group, sharing `nodeId: "dhanishta"` with the
existing yogatara.

## Sourcing

- **Stars**: "Dhanishta consists of a small group of four stars in the
  constellation known as Delphinus (the Dolphin). These stars are known
  as Alpha-Delphini, Beta-Delphini, Delta-Delphini and Gamma-Delphini" --
  a well-documented, compact naked-eye asterism.
- **Symbol**: "these four stars are arranged in a rhombus shape, which the
  ancients saw as signifying a drum" -- the Damaru (Shiva's hand drum),
  whose hourglass shape represents paired opposites (good/evil,
  masculine/feminine) coming together.
  ([MyZodiaq](https://www.myzodiaq.in/en/online-library/27-nakshatras/dhanishta-nakshatra/dhanishta-nakshatra-symbol))
- **Ruling deities**: the eight Vasus, elemental deities of earthly
  abundance (water, the pole star, the moon, earth, wind, fire, dawn,
  luminosity) -- fitting Dhanishta's meaning, "one who is rich with good
  fortune." ([MyZodiaq](https://www.myzodiaq.in/en/online-library/27-nakshatras/dhanishta-nakshatra/dhanishta-nakshatra-symbol))

## Coordinates used

| Star | RA (h) | Dec (°) | Mag | Source |
|---|---|---|---|---|
| Beta Delphini / Rotanev (existing yogatara) | 20.626 | 14.595 | 3.63 | unchanged from existing catalog entry |
| Alpha Delphini (Sualocin) | 20.6606 | 15.9121 | 3.77 | [TheSkyLive: Sualocin](https://theskylive.com/sky/stars/sualocin-alpha-delphini-star) |
| Gamma Delphini | 20.7776 | 16.1243 | 4.36 | [Wikipedia: Gamma Delphini](https://en.wikipedia.org/wiki/Gamma_Delphini) (brighter γ² component, the one visible to the naked eye as "Gamma Delphini") |
| Delta Delphini | 20.7243 | 15.0746 | 4.43 | [Wikipedia: Delta Delphini](https://en.wikipedia.org/wiki/Delta_Delphini) |

Computed the convex hull ordering of the four points (by angle around
their centroid) to get a non-self-intersecting quadrilateral rather than
guessing: Beta sits at the shape's southern point, Delta to its
east-and-slightly-north, Gamma at the northeastern corner, Alpha at the
northwestern corner. Traversal path (closed): Beta Delphini -> Delta
Delphini -> Gamma Delphini -> Alpha Delphini -> Beta Delphini.

## Placeholder figure

A damaru (hourglass hand-drum), the sourced symbol, echoing the real
rhombus shape the four stars trace.
