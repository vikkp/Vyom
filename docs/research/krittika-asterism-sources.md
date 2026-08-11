# Research notes: Krittika / Pleiades asterism (ADR0003, priority #4)

Date: 2026-08-11

## Star identification

Krittika's yogatara (Alcyone) was already in the catalog. ADR0003 calls for the full naked-eye Pleiades rather than just the single junction star. Added the five other stars commonly resolved by eye ("the Seven Sisters," though only 6-7 are typically visible without a telescope depending on conditions):

- **Alcyone (η Tauri)** — existing yogatara, RA 3.791h, Dec +24.105°, mag 2.87. Brightest of the cluster.
- **Electra (17 Tauri)** — RA 3h44m52.5s (3.7479h), Dec +24°06′48″ (+24.1133°), mag 3.70.
- **Taygeta (19 Tauri)** — RA 3h45m12.5s (3.7535h), Dec +24°28′02″ (+24.4673°), mag 4.29.
- **Maia (20 Tauri)** — RA 3h45m49.6s (3.7638h), Dec +24°22′04″ (+24.3678°), mag 3.87.
- **Merope (23 Tauri)** — RA 3h46m19.6s (3.7721h), Dec +23°56′54″ (+23.9484°), mag 4.17.
- **Atlas (27 Tauri)** — RA 3h50m44s (3.8456h), Dec +24°07′58″ (+24.1328°), mag 3.63.

Coordinates/magnitudes cross-checked against Wikipedia and TheSkyLive. Celaeno and Asterope (the fainter 2 of the traditional "seven sisters," mag ~5.4+) were left out — they're only reliably naked-eye under very dark skies and aren't needed for a recognizable cluster shape; Pleione (28 Tauri, mag 5.09) was also left out for the same reason, despite being one of the mythological "parents."

Line path: not a simple chain in RA order — the cluster is compact (~0.7° across) and the six stars don't fall on an obvious single line, so the path (Merope → Electra → Taygeta → Maia → Alcyone → Atlas) zigzags to trace the actual relative layout rather than an arbitrary straight connection.

## Data model note

Same pattern as Mrigashira/Rohini: Krittika is one nakshatra/deity graph node (symbol already recorded in graph.json as "Razor / flame," matching ADR0003's "Sisters / flame" figure direction), so all six stars share `nodeId: "krittika"`.

## Mythological content — deferred

Same reasoning as Mrigashira/Rohini: the "Sisters" figure direction and the Krittika mythology (the six/seven nurses of Skanda-Kartikeya, in most tellings) is left for a dedicated research pass. Stars + lines first, per ADR0003's process rule.
