# Research notes: Krittika figure ("Sisters / flame") — ADR0003 priority #4

Date: 2026-08-10

## Scope

ADR0003's priority table lists Krittika's figure direction as "Sisters / flame." Stars and lines shipped earlier; this covers the deferred figure overlay.

## Mythology

Krittika = the Pleiades. Two threads combine in the tradition:

- **The six mothers of Kartikeya.** The six Krittika sisters nursed the infant war-god Kartikeya, who grew six faces (becoming Shanmukha, "the six-faced one") so he could drink from all six simultaneously. [Vedaz: Krittika Nakshatra](https://www.vedaz.io/blogs/krittika-nakshatra), [Astrologyayurveda: Krittika Nakshatra](https://astrologyayurveda.com/blog/krittika-nakshatra/)
- **Agni and the razor/flame symbol.** Krittika's name means "the Cutter"; its symbol is a blade/razor, and its ruling deity is Agni, god of fire. [Rudraksha-Ratna: Krittika Nakshatra](https://www.rudraksha-ratna.com/articles/krittika-nakshatra), [Drikpanchang: Krittika Nakshatra](https://www.drikpanchang.com/tutorials/nakshatra/krittika-nakshatra.html)

## Design decision

Combined both threads into one composition rather than picking just one: a central rising flame (Agni/the razor's fire) surrounded by six small robed figures (the sisters, gathered around the flame they tend and the child they raised) — matching the ADR's own "Sisters / flame" framing directly, and echoing the six-star cluster shape already drawn by the asterism lines.

## Implementation

`makeKrittikaSilhouette()` in `mythicFigureSilhouette.ts` — layered flame shape (outer + inner core) with six small figures ringed around its base. Procedural Canvas2D placeholder; real art can replace it via `public/mythic-figures/krittika.png`.

Anchored at the 3D-averaged position of the six Pleiades member stars already used for Krittika's asterism lines. Clicking it selects the `krittika` graph node (existing, unchanged).
