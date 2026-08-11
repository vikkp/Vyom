# Research notes: Dhruva figure ("Young Dhruva") — ADR0003 priority #5

Date: 2026-08-10

## Scope

ADR0003's priority table lists this figure direction as "Young Dhruva." The Ursa Minor context stars/lines shipped earlier (`docs/research/dhruva-context-sources.md`); this covers the deferred figure overlay itself.

## Mythology

Dhruva was the young son of King Uttanapada and Queen Suniti. Rejected from his father's lap by a rival queen (Suruchi), he was told by his mother to seek a seat on God's lap instead, since God is eternal where a father is not. At five years old, Dhruva undertook intense tapasya (penance) in the forest, guided partway by the sage Narada, until Vishnu appeared and granted his wish — Dhruva became the fixed pole star, said to sit eternally on Vishnu's lap. Primary sources: Vishnu Purana; Bhagavata Purana, Canto 4. [TempleParohit: The Story of Dhruva](https://www.templepurohit.com/the-story-of-dhruva/), [Devdutt Pattanaik: Dhruva or the North Star](https://devdutt.com/dhruva-or-the-north-star/)

## Design decision

A single seated child figure in meditation (cross-legged, hands folded in prayer) with a faint halo marking the boon he received — the moment of penance/reward rather than any earlier part of the story, since that's the moment tied to the star itself. Deliberately small/child-proportioned, distinct from the adult Rishi figures nearby.

## Implementation

`makeDhruvaSilhouette()` in `mythicFigureSilhouette.ts` — seated robed child figure, folded hands, small hair-knot, soft halo behind the head. Procedural Canvas2D placeholder; real art can replace it via `public/mythic-figures/dhruva-tara.png`.

Anchored directly at Polaris's position (not an averaged centroid, unlike the other three figures) — Dhruva *is* the pole star in the myth, so the figure sits where Polaris sits rather than pulled toward the surrounding Little Dipper stars. Clicking it selects the `dhruva-tara` graph node (existing — the same node Polaris itself already links to).

Note the graph already has story content for `dhruva-tara` from the v1 dataset (the penance narrative, family relations) — this figure overlay doesn't duplicate that, just gives it a visual anchor in the sky.
