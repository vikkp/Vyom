# ADR0008 – Search + Camera Fly-to

Status: Accepted
Date: 2026-08-12
Deciders: Project owner + senior consultant

## Context

Search-to-orient already existed in outline: `SearchPanel.tsx` filtered
graph nodes by name, and `CameraFocusController.tsx` (built earlier,
alongside ADR0004's FOV work) already animated the camera to face a
requested direction. What was missing, brought into focus by the newer
features layered on since then (ADR0005's Navagraha, ADR0007's Akash
Ganga node):

- Search only matched a node's primary `name` field — no way to find
  something by a Western name (typing "Jupiter" would not find Guru,
  "Milky Way" would not find Akash Ganga, "Big Dipper" would not find
  any of the Saptarishi).
- Results had no ranking — plain filter-and-slice, so match quality
  (does the query match the start of the actual name, or just happen to
  appear inside an unrelated alias) didn't affect ordering.
- `getNodeSkyDirection` (the function that turns "which node" into
  "which direction to fly the camera") only ever checked `STAR_CATALOG`
  — which covers the 27 Nakshatras, the 7 star-represented Saptarishi,
  and Dhruva Tārā, but not the Navagraha (no fixed RA/Dec — computed
  fresh per date, see ADR0005) or Akash Ganga (not a point object at
  all — see ADR0006/ADR0007). Searching for "Surya" or "Akash Ganga"
  would select the node (opening its new ADR0007 story) but the camera
  simply wouldn't move.
- No keyboard support: only clicking a result worked, not Enter.

## Decision

- Extend `getNodeSkyDirection` (`src/utils/nodeSkyPosition.ts`) to
  resolve a direction for every searchable object type: fixed stars
  (unchanged), the Navagraha (new), and Akash Ganga (new, special-cased
  as the galactic center direction).
- Add alternate-name search (`src/utils/searchAliases.ts`, new): Western
  star/planet names plus a few hand-added aliases (Big Dipper/Ursa Major
  for the Saptarishi, Pole Star/North Star for Dhruva, Milky Way/Galaxy
  for Akash Ganga), always ranked below a primary-name match.
- Rank search results: name-prefix match, then name-substring match,
  then a Sanskrit-field match, then an alias match — in that order —
  rather than the previous unordered filter. This is the concrete
  mechanism behind "priority on Indian names": since every node's
  primary `name` field already *is* its Indic name (Ashwini, Surya,
  Atri, ...), any match against `name` outranks any match found only via
  a Western alias.
- Add keyboard support to the existing search input: Arrow Up/Down moves
  a highlighted result, Enter commits the currently highlighted one
  (defaulting to the top-ranked result), Escape clears the query — on
  top of the existing click-to-select behavior, not replacing it.
- Reuse `CameraFocusController.tsx`'s existing fly-to animation
  unchanged. It already satisfies every technical constraint in this
  request (fixed orbit target at the origin, only the camera's
  position/facing direction is animated; a spherical-linear interpolation
  between the current and target facing directions, eased in/out over
  900ms) — there was nothing here that needed re-architecting, only new
  callers (Navagraha/Akash Ganga searches) feeding it valid directions
  for the first time.

## Technical Approach

### Direction resolution (`src/utils/nodeSkyPosition.ts`)

`getNodeSkyDirection(nodeId, city, date)` now tries three sources in
order, returning the first that resolves:

1. **STAR_CATALOG** (unchanged) — averages the direction of every star
   sharing this `nodeId` (handles multi-star asterisms like Rohini's
   Hyades group).
2. **Navagraha** — looks up the matching `NavagrahaDef` by `nodeId` (a
   `Map` built once at module scope), then calls the *same*
   `computeNavagrahaPositions(date)` `NavagrahaField.tsx` already calls
   to render the Grahas, so search always points at exactly where the
   Graha is actually drawn — no second position formula to keep in sync.
3. **Akash Ganga** (`nodeId === "akash-ganga"`) — resolves to the
   galactic center (`galacticToEquatorial(0, 0)`), the same point
   `AkashGanga.tsx` anchors its own "Akash Ganga" label to.

Returns `null` for nodes with no sky anchor at all (pure mythology/story
nodes) — `SearchPanel` already handled that case (select without a fly-
to), unchanged.

### Alias data (`src/utils/searchAliases.ts`, new)

A `Map<nodeId, string[]>` built once at module scope from three sources:
every `STAR_CATALOG` entry's `westernName` (keyed by its `nodeId`), every
`NAVAGRAHA` entry's `westernName`, and a small hand-written list for
names with no single star/body to draw from (Big Dipper/Ursa
Major/Saptarishi for each Rishi, Pole Star/North Star for Dhruva Tārā,
Milky Way/Galaxy for Akash Ganga). `getSearchAliases(nodeId)` returns the
list (or `[]`).

### Ranking (`src/components/SearchPanel.tsx`)

```
rank 0: node.name starts with the query
rank 1: node.name contains the query
rank 2: node.sanskrit contains the query
rank 3: an alias contains the query (matchedAlias recorded for display)
```

Nodes are ranked over the *full* node list first (cheap — string
comparisons over ~85 nodes), sorted, and only *then* sliced to the top 8
and passed through `getNodeSkyDirection` — so a Navagraha's Kepler-
equation solve (or Akash Ganga's coordinate conversion) only runs for
results that actually get displayed, not for every candidate match
before ranking narrows the field. This keeps the per-keystroke cost
firmly sub-millisecond regardless of how many nodes technically match.

When a result's only match was via an alias, that alias is shown next to
its name (e.g. searching "Jupiter" shows "Guru *(Jupiter)*") — so a
result's presence in the list is never a mystery.

### Keyboard interaction

`highlightIndex` state resets to `0` whenever the query changes (a new
search always starts by highlighting its best-ranked result). Arrow
Up/Down move it within bounds; Enter commits `results[highlightIndex]`
through the same `commit()` helper the click handler already uses (no
duplicated select+focus+clear-query logic); Escape clears the query.
Hovering a result with the mouse also updates `highlightIndex`, so
keyboard and mouse interaction stay in sync rather than tracking two
separate "which one is active" states.

### Camera fly-to (unchanged, `CameraFocusController.tsx`)

Already: slerps between the camera's current and target unit-facing
directions (`slerpUnitVectors`), eased with `easeInOutQuad` over 900ms,
applied by writing `camera.position` (the orbit target stays pinned at
the origin per `SkyViewer.tsx`'s `OrbitControls`, so this only ever
rotates the facing direction, never moves the camera through space) and
calling `controls.update()` each frame so OrbitControls' own internal
state stays in sync. This already satisfied every constraint in the
request; no changes were needed.

## Consequences

### Positive

- Every one of the six object categories in the request (27 Nakshatras,
  9 Navagraha, individual Saptarishi, Dhruva, Akash Ganga) is now
  reachable by name *and* by a common alternate name, with a working
  camera fly-to for all of them.
- Ranking makes results predictable: a query that matches an actual name
  will never be pushed down the list by a coincidental alias match.
- No new animation code, no risk to the existing camera model — the
  fly-to path was already correct and untouched.

### Negative / Risks

- Alias coverage is only as complete as `STAR_CATALOG`/`NAVAGRAHA`'s
  `westernName` fields plus the small hand-written list — an unusual
  alternate spelling or a name not covered there simply won't match via
  alias (primary-name search is unaffected).
- Sanskrit-field matching (rank 2) is included for completeness but
  rarely fires in practice, since the field is stored in Devanagari and
  the search box only receives typed ASCII input.

## Follow-up

1. If a future pass wants fuzzy/typo-tolerant matching, that would layer
   on top of `rankMatch` without touching direction resolution or the
   fly-to animation.
