# Research notes: Ashwini asterism

Date: 2026-08-11

## Scope

Next asterism batch after ADR0003's original priority table (Saptarishi, Mrigashira, Rohini, Krittika, Dhruva context) — user requested Ashwini, Magha, and Jyeshtha as proper multi-star asterisms. Stars + lines only, per the same "stars and lines before figure overlays" process rule used throughout.

## Star identification

Ashwini's existing yogatara in the catalog is Sheratan (β Arietis). The nakshatra's traditional symbol is explicitly a two-star pair:

- "Ashwini... corresponding to the head of Aries, including the stars β and γ Arietis." [pvgspace: Ashwini Nakshatra](https://pvgspace.blogspot.com/2020/03/ashwini-nakshatra-and-arietis-000-1330.html) 
- "The symbol of this Nakshatra is Head of a Horse including the stars β and γ Arietis." [Drikpanchang: Ashvini Nakshatra](https://www.drikpanchang.com/tutorials/nakshatra/ashvini-nakshatra.html)

Some secondary sources instead cite α and β Arietis (Hamal + Sheratan); the β+γ pairing above is the more specific, consistently-cited identification and is what this build uses. Coincidentally fitting: the nakshatra is literally a *pair* of stars, matching the twin Ashwini Kumaras (the physician-gods who are its ruling deity and the "twin horsemen" of the brief) — worth noting as a nice correspondence, not claimed as the origin of the myth.

Added:
- **Mesarthim (γ Arietis)** — RA 01h53m31.813s (1.8922h), Dec +19°17′37.88″ (19.2939°), mag 3.86 (combined). [Wikipedia: Gamma Arietis](https://en.wikipedia.org/wiki/Gamma_Arietis)

Shares `nodeId: "ashwini"` with Sheratan, same pattern as the previous asterism batch (Mrigashira/Rohini/Krittika): this is Ashwini's own visual shape, not separate graph content.

## Shape

A single line segment, Sheratan–Mesarthim — the simplest possible asterism, matching a nakshatra whose classical symbol is just "two stars, the horse's head."

## Deferred

Mythic figure (the twin horsemen / Ashwini Kumaras) explicitly deferred per this batch's process rule — stars and lines only.
