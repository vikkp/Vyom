# Research notes: Mrigashira figure ("Deer / hunter") — ADR0003 priority #2

Date: 2026-08-10

## Scope

ADR0003's priority table lists Mrigashira's figure direction as "Deer / hunter." Stars and lines for Mrigashira shipped earlier; this covers the deferred figure overlay.

## Mythology

Mrigashira ("deer's head") sits on Orion's head, the star pattern itself named for the shape. The core myth: Prajapati (identified with the constellation) pursued his own daughter in the form of a stag chasing a doe. The gods, offended, called on Rudra (the hunter-god, identified with Sirius/Mrigavyadha, "the deer hunter") to intervene — Rudra shot an arrow that pierced the fleeing stag, and Orion's three-star belt is traditionally read as that arrow frozen mid-flight.

- Prajapati = Orion (the stag/hunted figure); Rudra = Sirius (the hunter); the belt = the arrow. [Grokipedia: Mrigashirsha](https://grokipedia.com/page/Mrigash%C4%ABrsha), [arya-akasha: Astra – The Star Weapon of Orion, Ardra, Rudra](https://aryaakasha.com/2021/11/07/astra-the-star-weapon-of-orion-ardra-rudra/)
- Deity/rulership: Soma (Moon), per the standard nakshatra deity list. [Hindustanastrology: Mrigashira Nakshatra](https://hindustanastrology.com/mrigashira-nakshatra-the-star-of-searching/)

## Design decision

Rather than a two-figure scene (stag + separate hunter), the overlay depicts the stag alone, mid-leap, with a single arrow shaft crossing it — keeping one figure per asterism, consistent with the other three, while still referencing Rudra's arrow (the belt) directly. The stag's head shape doubles as a visual echo of "Mrigashira" itself (deer's head).

## Implementation

`makeDeerHunterSilhouette()` in `mythicFigureSilhouette.ts` — procedural Canvas2D placeholder (leaping stag body + antlers + arrow), same category of stand-in as the original Rishi silhouette before real character PNGs existed. Real art can replace it via `public/mythic-figures/mrigashira.png`.

Anchored at the 3D-averaged position of the asterism's three stars (Meissa, Phi-1, Phi-2 Orionis), clicking it selects the `mrigashira` graph node (existing, unchanged).
