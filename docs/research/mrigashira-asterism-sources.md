# Research notes: Mrigashira asterism (ADR0003, priority #2)

Date: 2026-08-11

## Star identification

Mrigashira's yogatara (Meissa / Lambda Orionis) was already in the catalog from the original Brihat Samhita nakshatra research (see `star-catalog-sources.md`). ADR0003 calls for a real multi-star asterism, not just the single junction star, so this adds the other two stars that traditionally complete the "deer head" (mriga-shira) triangle:

- **Meissa (λ Orionis)** — existing yogatara, RA 5.586h, Dec +9.934°, mag 3.33.
- **Phi¹ Orionis** — RA 5h34m49.24s (5.5804h), Dec +09°29′22.5″ (+9.4896°), mag 4.42.
- **Phi² Orionis** — RA 5h36m54.39s (5.6151h), Dec +09°17′26.4″ (+9.2907°), mag 4.08.

Coordinates and magnitudes for Phi¹/Phi² cross-checked against their Wikipedia pages. Multiple independent sources (PocketPandit, Grokipedia, jothishi.com) agree these three stars form the deer-head asterism at the top of Orion, matching the existing yogatara identification — good convergent evidence.

One source (a personal astrology blog, pvgspace.blogspot.com) proposed a different set — Bellatrix + Pi²/Pi³/Pi⁴ Orionis — for the same nakshatra. Given it's a single lower-confidence source contradicting several others and the already-established Brihat-Samhita-sourced Meissa yogatara, it wasn't used. Flagging in case it resurfaces elsewhere.

## Mythological context (not yet added to the graph)

Sirius is traditionally called **Mrigavyādha** ("deer hunter") or **Lubdhaka**, identified with Rudra, who shoots an arrow — the three stars of Orion's belt (mapped to Ardra's region) — at Prajapati, who had taken the form of a deer/stag. This is the likely origin of "deer head" naming for Mrigashira (the head of that same deer-form Prajapati/Orion figure).

Important nuance: most versions of this myth centre on **Rohini** (the pursued dawn/doe, Aldebaran) and **Ardra** (the arrow, Orion's belt), not Mrigashira directly — Mrigashira's role is specifically "the deer's head," a visual/anatomical detail of the same larger scene rather than its own independent narrative. Given the scope risk of conflating distinct traditions (the same mistake flagged in the original senior review over Vishakha), this asterism's stars/lines are being added now; the Prajapati-Rudra-Sirius mythological content is deliberately left for a later pass once it can be researched and cross-checked with the same rigor as the rest of the graph, consistent with ADR0003's "stars + lines before figure overlays" rule.

## Data model note

Unlike Saptarishi (seven stars, seven distinct sage nodes), Mrigashira is one nakshatra/deity graph node. All three stars share `nodeId: "mrigashira"` rather than each getting a separate node — they're one figure's shape, not distinct characters.
