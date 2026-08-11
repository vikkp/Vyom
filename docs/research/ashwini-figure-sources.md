# Research notes: Ashwini figure ("Twin horsemen")

Date: 2026-08-11

## Scope

Stars/lines for Ashwini shipped earlier (`docs/research/ashwini-asterism-sources.md`). This covers the deferred figure overlay, confirmed with the project owner before building: two horse-headed/horse-riding twins, anchored at the Sheratan–Mesarthim midpoint.

## Mythology

The Ashwini Kumaras are twin Vedic gods, physicians to the other gods, and Ashwini's ruling deity. Two depictions coexist across sources:

- As humans with horses' heads: "They are represented as humans with the heads of horses... horse-like faces." [Medium: Horses in Indian and Hindu Mythology](https://medium.com/@sunisglowing/horses-in-indian-and-hindu-mythology-51da6b229c57)
- As youthful twin riders on a golden, three-wheeled chariot: "In the Rigveda, they appear as youthful divine twin horsemen, riding a chariot drawn by tireless horses... golden in colour and triangular in shape." [Hindu Temple Talk: Ashvins](https://hindutempletalk.org/2023/12/07/ashvins-divine-twin-gods/amp/)

## Design decision

Went with the twin-riders-on-horseback reading rather than horse-headed humanoids — it matches the "twin horsemen" framing directly and reads more clearly as a recognizable pair of figures at the small scale these render at, versus a more unusual horse-headed silhouette. Two mounted twin figures, mirrored/paired, riding side by side — echoing the asterism's own two-star, one-line simplicity.

## Implementation

`makeAshwiniKumarasSilhouette()` in `mythicFigureSilhouette.ts` — procedural Canvas2D placeholder (two mirrored mounted riders). Real art can replace it via `public/mythic-figures/ashwini.png`.

Anchored at the 3D-averaged position of Sheratan and Mesarthim. Clicking it selects the `ashwini` graph node (existing, unchanged).
