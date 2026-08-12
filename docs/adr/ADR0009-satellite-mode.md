# ADR0009 – "I Am A Satellite" Mode

Status: Accepted
Date: 2026-08-12
Deciders: Project owner + senior consultant

## Context

Every camera behavior in this app so far has been either fully manual
(drag to look around) or a discrete, one-shot animation triggered by an
action (ADR0008's search-to-fly, a ~900ms turn that then stops). The
project owner asked for a third mode: a continuous, ambient drift the
user can switch on and leave running — "the feeling of flying in a
satellite through the constellations" — while everything else (dragging,
clicking objects, DetailPanel, search) keeps working exactly as it does
today.

## Decision

- Reuse three.js `OrbitControls`' own built-in `autoRotate` /
  `autoRotateSpeed` feature (exposed directly by drei's `<OrbitControls>`,
  already the control this app uses) rather than writing a custom
  per-frame rotation controller. This was a close look at the library's
  actual source before deciding, not an assumption — see Technical
  Approach.
- Add `satelliteMode: boolean` to `skyViewerStore` (`setSatelliteMode`,
  `toggleSatelliteMode`); `SkyViewer.tsx` passes it straight through as
  `autoRotate={satelliteMode}`.
- "I am a satellite" is a pseudo search result, not a graph node — it has
  no story, nothing to select. It matches a short list of plausible
  trigger words (not just the literal exact phrase) and, whenever it
  matches at all, is always inserted at the very top of the results list,
  ahead of every ranked node match — a hard rule, not just a favorable
  rank within the existing ADR0008 ranking.
- Selecting it toggles the mode (on again turns it off, matching the
  spec's "selecting it again turns the mode off").
- A small "Exit Satellite Mode" pill (`SatelliteModeBanner.tsx`) is shown
  top-center only while the mode is active, as a second, always-visible
  way to turn it off.
- Speed is deliberately very slow — see Technical Approach for the
  derivation — aiming for "calm, weightless, elegant" over anything that
  reads as spinning.

## Technical Approach

### Why `autoRotate` instead of a custom controller

This app already has three examples of hand-rolled per-frame camera
controllers (`CameraFocusController`'s slerp+ease tween,
`FovZoomController`'s damped FOV, `CompassHeadingTracker`'s heading
read-out) — writing a fourth for continuous drift was the obvious first
instinct. Before doing that, the actual `three-stdlib` `OrbitControls`
source (`node_modules/three-stdlib/controls/OrbitControls.js`, the
implementation drei's `<OrbitControls>` wraps) was read directly:

```js
if (scope.autoRotate && state === STATE.NONE) {
  rotateLeft(getAutoRotationAngle());
}
```

`autoRotate` is applied inside the *same* `update()` call this app
already invokes every frame (drei's `<OrbitControls>` runs
`controls.update()` in its own `useFrame`), and — critically — it's
gated on `state === STATE.NONE`, meaning it's automatically skipped for
any frame where the user is actively dragging. That's the entire "user
should still be able to look around... while the drift continues"
requirement, satisfied by the library for free: a drag interrupts the
drift immediately (the user's own rotation takes over, exactly as it
does today with `autoRotate` off), and the slow drift resumes on release
with no hand-off logic, no state machine, and no risk of the two systems
fighting over `camera.position` on the same frame. Writing a custom
controller would have meant reimplementing this exact interruption
behavior by hand, with more surface area for exactly the kind of
jitter/nausea risk the spec explicitly warns against.

Clicking objects, `DetailPanel`, and search are entirely unaffected —
none of them read or depend on camera rotation state, so "DetailPanel
must continue to work normally" required no changes at all.

### Speed

`getAutoRotationAngle()` (same file):

```js
function getAutoRotationAngle() {
  return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
}
```

Confirmed drei's `<OrbitControls>` calls `controls.update()` with no
delta-time argument (`useFrame(() => { if (controls.enabled)
controls.update(); }, -1)`), so this fixed-angle-per-call branch is the
one that actually runs — at a steady ~60fps that's `(2π/60/60) ×
autoRotateSpeed` radians per call × 60 calls/sec = `6 × autoRotateSpeed`
degrees per second. The library's own default (`autoRotateSpeed = 2.0`)
works out to ~12°/s — a full lap in 30 seconds, which reads as spinning,
not drifting. `SATELLITE_AUTO_ROTATE_SPEED = 0.08` (`constants.ts`)
targets ~0.48°/s — a full 360° sweep takes a little over 12 minutes.
Over a typical minute or two of viewing that's a gentle few-degree shift,
enough to feel alive without ever feeling fast.

### Direction

`rotateLeft(angle)` with a positive angle (the default, non-reversed
path) does `sphericalDelta.theta -= angle`, i.e. the camera's own facing
direction turns left. For this app's "stand at the origin and look
around" camera model (not an orbit-around-an-external-object model),
turning your own view left is what makes the world drift right-to-left
relative to you... concretely: content that was centered shifts toward
the right edge of the frame as you turn left, so new content
continuously enters from the left — matching "stars and constellations
move gently from left to right across the view." This was reasoned
through from the library's source rather than assumed, but **has not
been visually confirmed in a live browser** (this implementation
environment has no headless renderer). If the drift reads backward once
tested live, the fix is a one-line sign flip:
`SATELLITE_AUTO_ROTATE_SPEED` negative instead of positive — flagged
here explicitly rather than asserted as certain.

### Search integration (`SearchPanel.tsx`)

`SearchResult` became a small discriminated union
(`{ kind: "satellite" } | { kind: "node", ... }`) instead of assuming
every result is a `GraphNode`. `matchesSatelliteTrigger(q)` checks
`q` against a short list (`"i am a satellite"`, `"satellite"`,
`"orbit"`, `"drift"`, `"fly"`) — matching on a real word, not requiring
the literal full sentence, so typing "sat" or "orbit" finds it too. When
it matches, it's `unshift`-equivalent (pushed first, before the ranked
node loop even runs) — an unconditional top position, not merely a
favorable score within ADR0008's rank system, per "must always appear at
the very top." Selecting it calls `toggleSatelliteMode()` directly; it
never calls `select()` or `requestFocus()`, since there's no graph node
or sky position behind it — this is an action, not an explorable object.

### Exit control (`SatelliteModeBanner.tsx`, new)

A small pill, top-center (`left-1/2 top-24 -translate-x-1/2`), rendered
only while `satelliteMode` is true, styled with the same dark-glass +
amber-accent language as every other HUD element in this app
(`Compass.tsx`, `SkyLayerToggles.tsx`). Top-center was chosen
specifically because it's the one screen region nothing else currently
occupies — `Header` sits at `top-0` center,
`LocationMenu`/`TimeControls`/`DetailPanel` sit at the left/right edges
at `top-24`, `SearchPanel` sits at `left-4 top-40` — so this reads as its
own deliberate "mode banner" rather than crowding an existing cluster.

## Consequences

### Positive

- The entire ambient-drift behavior — including the tricky "don't fight
  the user's own drag" requirement — comes from a single, well-tested
  library feature already in use, not new per-frame logic.
- No other system (click/select/DetailPanel/search/zoom) needed to
  change at all; satellite mode is purely a camera-rotation toggle
  layered underneath everything else.
- The exit affordance is available two ways (re-selecting the search
  entry, or the persistent banner button) without duplicating the
  toggle logic — both call into the same store action.

### Negative / Risks

- The left-to-right drift direction is reasoned from source, not
  visually confirmed (see Technical Approach) — needs a live check, with
  a documented one-line fix if it's backward.
- `autoRotate` briefly composes with an in-flight ADR0008 fly-to
  animation if a user searches for an object while satellite mode is
  active (both write to the camera within the same ~900ms window) — an
  accepted minor edge case, not specifically suppressed, since both
  motions are already small and smooth and the interaction is brief.

## Follow-up

1. Confirm the drift direction live and flip
   `SATELLITE_AUTO_ROTATE_SPEED`'s sign if needed.
2. If a future pass wants satellite mode to auto-disable itself when the
   user searches for and flies to a specific object, that would be a
   one-line addition to `SearchPanel.tsx`'s `commit()` for the `"node"`
   branch — not implemented here since it wasn't requested and the
   current behavior (both can run briefly together) is harmless.
