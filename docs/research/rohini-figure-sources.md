# Research notes: Rohini figure ("Ox-cart") — ADR0003 priority #3

Date: 2026-08-10

## Scope

ADR0003's priority table lists Rohini's figure direction as "Rohini / cow." Stars and lines shipped earlier; this covers the deferred figure overlay.

## Correction from the ADR's shorthand

Checked against the actual nakshatra symbol tradition rather than building "a cow" literally. Rohini's well-attested traditional symbol is an **ox-cart / chariot** — specifically Brahma's cart drawn by two oxen — not a cow on its own:

- "Rohini Nakshatra is symbolized by a cart or a chariot... the main symbol is the Ox Cart Pulled by Two Oxen, or the chariot of Brahmā drawn by oxen." [Rudraksha-Ratna: Rohini Nakshatra](https://www.rudraksha-ratna.com/articles/rohini-nakshatra)
- Ruling deity: Brahma, associated with fertility and growth. [MikesSleepingDog: Rohini Nakshatra](https://mikessleepingdog.com/2021/05/23/rohini-nakshatra/)

Raised this discrepancy with the project owner before building (ADR wrote "cow" as loose shorthand) — confirmed to build the sourced ox-cart symbol instead.

The Chandra/Daksha story (Chandra favouring Rohini among Daksha's 27 daughters, leading to the Moon's waxing/waning curse) is Rohini's best-known narrative but doesn't map to a single static visual symbol the way the cart does, so the figure follows the symbol rather than the narrative.

## Implementation

`makeOxCartSilhouette()` in `mythicFigureSilhouette.ts` — a domed cart body, large spoked wheel, yoke pole, and two ox figures with horns, walking as a team. Procedural Canvas2D placeholder; real art can replace it via `public/mythic-figures/rohini.png`.

Anchored at the 3D-averaged position of the Hyades member stars already used for Rohini's asterism lines. Clicking it selects the `rohini` graph node (existing, unchanged).
