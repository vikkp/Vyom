# Research notes: Jyeshtha figure ("Earring / umbrella talisman")

Date: 2026-08-11

## Scope

Stars/lines for Jyeshtha shipped earlier (`docs/research/jyeshtha-asterism-sources.md`). This covers the deferred figure overlay, confirmed with the project owner before building: the earring/umbrella talisman symbol, not the ruling deity Indra.

## Mythology

Jyeshtha ("the eldest") is ruled by Indra, but its nakshatra symbol is a specific talisman:

- "Three stars in a row, which were seen by ancients as forming a shape similar to an earring (or in some cases, the top of an umbrella)." [Grokipedia: Jyeshtha (nakshatra)](https://grokipedia.com/page/Jyeshtha_(nakshatra))

## Design decision

Chose the earring/umbrella symbol over depicting Indra directly. Indra carries substantial iconography of his own (vajra/thunderbolt, the elephant Airavata, a full royal-deity figure) that would be a much bigger scope than the other two figures in this batch and would need its own dedicated research pass rather than a quick companion piece. The talisman also maps directly onto the "three stars in a row" shape the asterism already draws, which a full deity figure wouldn't.

## Implementation

`makeJyeshthaTalismanSilhouette()` in `mythicFigureSilhouette.ts` — a jewelled pendant/earring silhouette with a domed umbrella-like crown, echoing both readings the sources give for the shape. Procedural Canvas2D placeholder; real art can replace it via `public/mythic-figures/jyeshtha.png`.

Anchored at the 3D-averaged position of Sigma Scorpii, Antares, and Tau Scorpii. Clicking it selects the `jyeshtha` graph node (existing, unchanged).
