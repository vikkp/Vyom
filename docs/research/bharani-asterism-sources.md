# Bharani: asterism research

## Decision

A closed three-star triangle -- the existing yogatara 41 Arietis joined by
35 Arietis and 39 Arietis. New `BHARANI_EXTRA_STARS` group, sharing
`nodeId: "bharani"` with the existing yogatara.

## Sourcing

- **Stars**: "Bharani is marked by three stars, 35 Arietis, 39 Arietis,
  and 41 Arietis... These stars form a triangle that ancient observers
  likened to the opening of the womb or a clay pot" -- explicitly three
  named stars, matching the existing yogatara plus two companions, with
  the triangle shape directly cited alongside the symbol.
  ([Kalmanas](https://www.kalmanas.com/nakshatra/bharani))
- **Symbol**: the yoni (female reproductive organ/womb) -- standing for
  birth and creation, matching the cited triangular "opening of the womb"
  shape.
- **Ruling deity**: Yama, god of death, justice, and dharma -- governing
  the soul's transition and the law of karma, a fitting counterpart to the
  birth symbolism (Bharani sits between Ashwini's healing/birth and
  Krittika's purifying fire).

## Coordinates used

| Star | RA (h) | Dec (°) | Mag | Source |
|---|---|---|---|---|
| 41 Arietis (existing yogatara) | 2.833 | 27.261 | 3.63 | unchanged from existing catalog entry |
| 35 Arietis | 2.7242 | 27.7071 | 4.64 | [Wikipedia: 35 Arietis](https://en.wikipedia.org/wiki/35_Arietis) |
| 39 Arietis | 2.7985 | 29.2471 | 4.51 | [Wikipedia: 39 Arietis](https://en.wikipedia.org/wiki/39_Arietis) |

Three points always form a valid, non-self-intersecting triangle
regardless of traversal order, so no convex-hull check was needed here
(unlike the 4+ star groupings in earlier batches). Traversal path
(closed): 39 Arietis -> 35 Arietis -> 41 Arietis -> 39 Arietis.

## Placeholder figure

A simple stylised clay pot/vessel outline (the secondary reading cited
alongside the yoni symbol), matching the real triangular three-star
shape without requiring literal anatomical imagery.
