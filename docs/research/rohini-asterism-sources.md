# Research notes: Rohini / Hyades asterism (ADR0003, priority #3)

Date: 2026-08-11

## Star identification

Rohini's yogatara (Aldebaran) was already in the catalog. ADR0003 calls for the full Hyades "V" rather than just the single junction star. Added the four other stars that make up the standard V asterism:

- **Aldebaran (α Tauri)** — existing yogatara, RA 4.599h, Dec +16.509°, mag 0.87. Important caveat, worth keeping in mind: Aldebaran is *not* a physical member of the Hyades cluster — at ~65 light-years it's much closer than the cluster (~153 ly) and only appears superimposed along the same line of sight. It's still universally included in the visual V asterism and is the traditional yogatara, so it stays as the anchor point.
- **Gamma Tauri ("Prima Hyadum")** — RA 4h19m47.6s (4.3299h), Dec +15°37′40″ (+15.6276°), mag 3.65. The vertex/nose of the V.
- **Delta¹ Tauri ("Secunda Hyadum")** — RA 4h22m56.1s (4.3823h), Dec +17°32′33″ (+17.5425°), mag 3.77.
- **Epsilon Tauri ("Ain")** — RA 4h28m37.0s (4.4769h), Dec +19°10′50″ (+19.1804°), mag 3.53. One open tip of the V (traditionally one of the Bull's eyes).
- **Theta² Tauri** — RA 4h28m39.7s (4.4777h), Dec +15°52′15″ (+15.8709°), mag ~3.4 (slightly variable).

All coordinates/magnitudes cross-checked against each star's Wikipedia page. Multiple sources (constellation-guide.com, star-facts.com, earthsky.org) independently agree on this same five-star grouping for the naked-eye V, which is good convergent evidence and matches the well-known amateur-astronomy "Face of Taurus" asterism.

Line path: the V opens toward Aldebaran and Epsilon Tauri (its two tips) and converges at Gamma Tauri. Encoded as one open path, Epsilon → Delta¹ → Gamma → Theta² → Aldebaran (not closed back to the start, unlike Saptarishi/Mrigashira — a V has two open ends, not a loop).

## Data model note

Same pattern as Mrigashira: Rohini is one nakshatra/deity graph node (symbol already recorded in graph.json as "Ox-cart / chariot"), so all five stars share `nodeId: "rohini"` rather than getting distinct nodes.

## Mythological content — deferred

Same reasoning as Mrigashira: the "Rohini / cow" figure direction from ADR0003, and the fuller Prajapati-deer / Rudra-hunter story that centres on Rohini as the pursued dawn-doe, is left for a dedicated research pass rather than added loosely here. Stars + lines first, per ADR0003's process rule.
