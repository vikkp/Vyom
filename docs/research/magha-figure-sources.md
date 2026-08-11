# Research notes: Magha figure ("Royal throne")

Date: 2026-08-11

## Scope

Stars/lines for Magha shipped earlier (`docs/research/magha-asterism-sources.md`). This covers the deferred figure overlay, confirmed with the project owner before building: an empty ornate throne, no seated figure.

## Mythology

Magha's ruling deities are the Pitrs (the ancestors/departed forebears collectively, not a single named god), and its symbol is a royal throne or palanquin:

- "The symbol of Magha Nakshatra is a royal throne or a palanquin which represents power, authority, and respect... inherited authority, the seat of power that is occupied not through conquest alone but through lineage." [Outlook India: Magha Nakshatra — The Celestial Throne of Leadership and Legacy](https://www.outlookindia.com/astrology/astro-picks/magha-nakshatra-the-celestial-throne-of-leadership-and-legacy), corroborated at [Rudraksha-Ratna: Magha Nakshatra](https://www.rudraksha-ratna.com/articles/magha-nakshatra)

## Design decision

Depicted the throne alone, empty — matching Rohini's precedent (the nakshatra's *symbol*, not a character) rather than Krittika's (a story scene with figures). This fits Magha specifically: the deity is the Pitrs collectively, an ancestral presence rather than one nameable god, so an occupied throne would need inventing a specific seated figure with no single sourced identity. An empty throne — "the seat of power held by lineage" — is a more accurate rendering of what the symbol actually represents than any one figure would be.

## Implementation

`makeMaghaThroneSilhouette()` in `mythicFigureSilhouette.ts` — an ornate, domed/canopied throne silhouette, echoing the "base rising into a tall back" shape the asterism's own line path already traces. Procedural Canvas2D placeholder; real art can replace it via `public/mythic-figures/magha.png`.

Anchored at the 3D-averaged position of all six Magha stars (Regulus, Algieba, Eta/Omicron/31/Rho Leonis). Clicking it selects the `magha` graph node (existing, unchanged).
