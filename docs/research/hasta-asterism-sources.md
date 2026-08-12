# Hasta: asterism research

## Decision

A closed five-star pentagon -- the existing yogatara Algorab (δ Corvi)
joined by Alpha (Alchiba), Beta (Kraz), Gamma (Gienah), and Epsilon
(Minkar) Corvi, the full naked-eye Corvus asterism. New
`HASTA_EXTRA_STARS` group, sharing `nodeId: "hasta"` with the existing
yogatara.

## Sourcing

- **Stars**: "The principal stars are five stars in the constellation
  Corvus (Alpha, Beta, Gamma, Delta, and Epsilon Corvi), traditionally
  pictured as the five fingers of an open hand" -- explicitly five named
  stars, matching the existing yogatara plus four companions.
- **Symbol**: an open hand -- "Savitr's hands are described as golden
  (hiranya-hasta) in the Rig Veda," the textual anchor for the hand
  imagery. ("Hasta Nakshatra, The Greek Myth, Chiron, the Hands")
- **Ruling deity**: Savitar, a solar deity (an aspect of Surya associated
  with the sun before sunrise and the power of stimulation/energizing).

## Coordinates used

| Star | RA (h) | Dec (°) | Mag | Source |
|---|---|---|---|---|
| Algorab / δ Corvi (existing yogatara) | 12.498 | -16.516 | 2.95 | unchanged from existing catalog entry |
| Alpha Corvi (Alchiba) | 12.1402 | -24.7289 | 4.03 | [Wikipedia: Alpha Corvi](https://en.wikipedia.org/wiki/Alpha_Corvi) |
| Beta Corvi (Kraz) | 12.5731 | -23.3968 | 2.65 | [Wikipedia: Beta Corvi](https://en.wikipedia.org/wiki/Beta_Corvi) |
| Gamma Corvi (Gienah) | 12.2634 | -17.5419 | 2.59 | [Wikipedia: Gamma Corvi](https://en.wikipedia.org/wiki/Gamma_Corvi) |
| Epsilon Corvi (Minkar) | 12.1687 | -22.6198 | 3.02 | [Wikipedia: Epsilon Corvi](https://en.wikipedia.org/wiki/Epsilon_Corvi) |

Computed the convex-hull ordering (by angle around the five points'
centroid) rather than guessing a traversal order, same approach used for
Dhanishta's quadrilateral: Delta -> Gamma -> Epsilon -> Alpha -> Beta ->
Delta (closed). This produces the real Corvus "sail" shape rather than a
self-intersecting star pattern.

## Placeholder figure

A simple open-hand silhouette (the sourced symbol), fingers spread,
matching the real compact five-star cluster.
