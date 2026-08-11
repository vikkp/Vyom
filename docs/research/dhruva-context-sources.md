# Research notes: Dhruva context / Ursa Minor asterism (ADR0003, priority #5)

Date: 2026-08-11

## Scope decision

ADR0003 lists this as "Dhruva context — Polaris + surroundings," with no specific star list (unlike Mrigashira/Rohini/Krittika, which had clear reference asterisms to build out). Asked the project owner directly which interpretation was intended; confirmed: build the standard Ursa Minor ("Little Dipper") asterism around Polaris.

## Star identification

Polaris (Dhruva Tārā) was already the fixed anchor (`DHRUVA_STAR`). Added the other six stars of the standard naked-eye Little Dipper:

- **Yildun (δ UMi)** — RA 17h32m13.0s (17.5369h), Dec +86°35′11″ (+86.5865°), mag 4.35.
- **ε Ursae Minoris** — RA 16h45m58.2s (16.7662h), Dec +82°02′14″ (+82.0373°), mag 4.19.
- **ζ Ursae Minoris** — RA 15h44m03.5s (15.7343h), Dec +77°47′40″ (+77.7945°), mag 4.29.
- **η Ursae Minoris** — RA 16h17m30.3s (16.2917h), Dec +75°45′19″ (+75.7553°), mag 4.95.
- **Pherkad (γ UMi)** — RA 15h20m43.7s (15.3455h), Dec +71°50′02″ (+71.834°), mag 3.05.
- **Kochab (β UMi)** — RA 14h50m42.3s (14.8451h), Dec +74°09′20″ (+74.1555°), mag 2.08.

All coordinates/magnitudes cross-checked against Wikipedia. This is the standard, uncontested 7-star Little Dipper — no conflicting sources found, unlike some of the nakshatra asterisms.

Line path: handle (Polaris → Yildun → ε → ζ) then the bowl closed as a quadrilateral (ζ → η → Pherkad → Kochab → ζ), mirroring how Saptarishi's own bowl is closed back to Megrez.

## Data model note — different from the other three

Mrigashira/Rohini/Krittika all share their nakshatra's `nodeId` across every star in the shape, because those asterisms *are* that nakshatra's visual form. Ursa Minor isn't a nakshatra and has no existing graph node of its own — Polaris already correctly points at `dhruva-tara`, but the other six stars aren't additional facets of that specific node, they're the surrounding constellation. Rather than invent a new "Ursa Minor" graph node (out of scope — that's new mythological/graph content, not astronomy), these six stars ship with **no `nodeId`**, same treatment as `BRIGHT_STARS`: visible and named, not clickable/linked.

For the same reason, they use Western names only (`westernName`, no `indianName`) — there's no sourced traditional individual Sanskrit name for each of these six stars the way there is for the yogataras; fabricating one would violate the project's citation requirement.

## Mythological content — deferred

The "Young Dhruva" figure direction is left for a dedicated pass, same reasoning as the previous three asterisms. Note Dhruva already has story nodes in the graph (the penance narrative, family relations) from the original v1 dataset — any new content here should build on those rather than duplicate them.
