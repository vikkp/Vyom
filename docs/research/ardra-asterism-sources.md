# Ardra: asterism research

## Decision (confirmed with project owner, 2026-08-11)

Ardra stays a **single-star** nakshatra — no new asterism entry, no new star
data. This is a deliberate exception in the "batch of 3" (Ardra, Punarvasu,
Pushya): Punarvasu and Pushya both have well-documented traditional
multi-star shapes (see their own research docs), but Ardra's classical
symbol is a single teardrop/gem, tied to exactly one yogatara. Multiple
independent sources describe it as a one-star nakshatra with no traditional
companion stars, and this project's convention (real astronomical positions
are non-negotiable — see the `vyom-dev-workflow` skill) rules out inventing
an unsourced grouping just for visual symmetry with the other two. This
question was raised with the project owner before building anything, and
the "keep it single-star" option was confirmed.

The star itself (Betelgeuse, `id: "betelgeuse"`, `nodeId: "ardra"`) already
exists in `starCatalog.ts` from the original nakshatra pass — nothing to add
there either. The only new content from this pass is a placeholder figure
(see `MythicFigureOverlays.tsx`), anchored to that existing single star.

## Sourcing

- **Symbol**: a teardrop, representing both sorrow/grief and the cleansing,
  renewing power of rain — "Ārdrā" itself means "moist" or "teardrop" in
  Sanskrit. Some sources render the same idea as a shining diamond/jewel or
  a single thunderbolt rather than literally a drop of water, but all agree
  it's a single point-like symbol, not a multi-star shape. ([FutureScope
  Astrology](https://futurescopeastrology.com/learn-astrology/nakshatras-in-astrology/ardra-arudra-aridra-nakshatra/),
  [GoSanskrit](https://gosanskrit.com/en/blog/Ardra))
- **Star**: Betelgeuse (α Orionis) is universally cited as Ardra's star —
  its reddish, variable glow is repeatedly tied to Rudra's fierce,
  stormy nature. ([Wikipedia: Ardra
  (nakshatra)](https://en.wikipedia.org/wiki/Ardra_\(nakshatra\)))
- **Single-star confirmation**: cross-referenced search specifically for any
  documented companion stars turned up none — sources explicitly describe
  Ardra as represented by one star, in contrast to nakshatras like Punarvasu
  (two) or Pushya (three) that do have documented multi-star groupings.
  (Astrobix, [Wikipedia: Ardra
  (nakshatra)](https://en.wikipedia.org/wiki/Ardra_\(nakshatra\)))
- **Ruling deity**: Rudra, the fierce storm-form of Shiva — the deity of
  transformation through destruction, matching the teardrop/storm symbolism.
  ([PocketPandit](https://blog.pocketpandit.com/ardra-nakshatra-2/))

One source (a blog aggregation) describes the nakshatra's ecliptic *span*
as running from Betelgeuse through the general area of Castor/Pollux/nearby
stars — this describes the 13°20' zodiacal arc the nakshatra covers, not a
specific multi-star asterism shape, and isn't treated as evidence of a
traditional Ardra asterism here.
