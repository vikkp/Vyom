# ADR0004 – Camera Zoom Controls

Status: Accepted
Date: 2026-08-11
Deciders: Project owner + senior consultant

## Context

The sky viewer had no zoom at all — `OrbitControls` ships with `enableZoom={false}` and `minDistance === maxDistance === CAMERA_ORBIT_RADIUS`, so the only interaction is look-around (drag to change facing direction). The request was to add smooth zoom in/out on mouse wheel (desktop) and pinch (mobile), reusing `OrbitControls`' native zoom, with a literal spec of `minDistance: 15`, `maxDistance: 120`, `zoomSpeed: 0.8`.

Before implementing, the literal spec was checked against the scene's actual camera geometry (see ADR0002/ADR0003): the observer stands at a fixed world origin, `OrbitControls`' `target` is `[0, 0, 0]` and never moves, and every star, asterism figure, and Rishi sits on a shell at `DOME_RADIUS = 30` units from that origin. The camera itself currently orbits a **near-zero** radius (`CAMERA_ORBIT_RADIUS = 0.1`) around the origin — that's what makes dragging change facing direction rather than position.

Because `target` is fixed at the origin, camera-to-content distance is always `orbitDistance + DOME_RADIUS`, regardless of what `OrbitControls`' own distance is doing:

- **Today's default** (`orbitDistance ≈ 0.1`) already puts the camera about `30.1` units from the Rishis — near the closest that geometry allows.
- The requested `minDistance: 15` would force the camera to sit **at least** `15 + 30 = 45` units away — *further* from the Rishis than the current, zoom-less default. Zooming "in" to its own minimum would look more zoomed-out than today.
- There is no `orbitDistance` that gets the camera meaningfully closer to `DOME_RADIUS` than it already sits, because `orbitDistance` can't go negative. A fixed-origin-target dolly zoom has a hard floor at `DOME_RADIUS` no matter how `minDistance` is tuned.
- Separately, `maxDistance: 120` would push the camera outside `SkyGradient`'s atmosphere sphere (radius `DOME_RADIUS * 3 = 90`, rendered `BackSide` so it's only visible from inside) — zooming out that far would visually break the sky rather than showing "more sky."

In short: distance-based dolly zoom, with the camera model this app uses, cannot deliver the requested "close-up of the Rishis and mythic figures" — it can only ever make things look the same or further away. This was raised with the project owner before writing any code.

## Decision

Zoom is implemented as **FOV-based zoom**, not distance-based dolly zoom:

- The camera model is unchanged: `target` stays at the origin, `OrbitControls` still orbits the same near-zero `CAMERA_ORBIT_RADIUS`, and `enableZoom` stays `false` — `OrbitControls`' own distance-based zoom is not used at all, so it can't fight with this.
- Mouse wheel (desktop) and two-finger pinch (mobile/touch) instead adjust the camera's **field of view** (`camera.fov`), the same trick a real camera lens or a planetarium app uses to zoom without physically moving. Narrowing the FOV magnifies the same fixed-distance view; widening it shows more sky per pixel — both read as "zoom" to the user without ever violating the `DOME_RADIUS` floor above.
- FOV is clamped to **25° (zoomed in) – 75° (zoomed out)**. The app's current default FOV is 72°, i.e. today's "no zoom" view sits close to the wide end of the new range — zooming in from launch narrows toward 25°, which is where a genuine close-up on a Rishi or mythic figure's face reads clearly. These bounds are a starting point per the project owner's own framing ("or whatever feels good") and are expected to be tuned after hands-on testing.
- Zoom eases toward its target FOV every frame (damped interpolation) rather than snapping, matching the feel of `OrbitControls`' own `enableDamping` on rotation, which is unchanged.
- Rotate, pan (still disabled), damping, and the existing polar-angle limits (`minPolarAngle`/`maxPolarAngle`, full-sky rotation) are all untouched.
- True dolly zoom / "focus on object" (moving the camera itself toward a specific figure, with a dynamically tracked target instead of a fixed origin) is an explicitly deferred follow-up, not part of this decision.
- This ADR and its implementation are scoped strictly to in-sky zoom. The separate "Earth zoom-out" idea is explicitly out of scope here.

## Technical Approach

- New `FovZoomController` component (`src/components/sky-viewer/FovZoomController.tsx`), mounted inside `<SkyViewer>` alongside `<OrbitControls>` and `<CameraFocusController>` — same pattern as `CameraFocusController`: a store-free, per-frame interpolator using `useFrame`.
- Listens directly on the R3F canvas element (`gl.domElement`) for `wheel` and `touch*` events, rather than routing through `OrbitControls`, since its own zoom is fully disabled:
  - `wheel`: `deltaY` nudges a target FOV value (`preventDefault`ed so the page itself doesn't scroll).
  - `touchstart`/`touchmove`/`touchend` (two-finger): tracks the distance between the two touch points frame to frame; fingers moving apart narrows FOV (zoom in), moving together widens it (zoom out).
- Every frame, `camera.fov` eases toward the target value (`FOV_DAMPING`) and `camera.updateProjectionMatrix()` is called — the same "external component writes to the live camera, R3F's render loop just picks it up" pattern `CameraFocusController` already established for position.
- New constants in `constants.ts`: `MIN_FOV = 25`, `MAX_FOV = 75`, `FOV_DAMPING`, alongside the existing `DOME_RADIUS`/`CAMERA_ORBIT_RADIUS`.
- The originally-specified `minDistance: 15` / `maxDistance: 120` / `zoomSpeed: 0.8` values are **not used** — they belonged to the distance-based approach this ADR supersedes.

## Consequences

### Positive

- Delivers an actual close-up capability, which distance-based dolly zoom could not, without changing the fixed-origin camera model that the rest of the app (search-to-orient, `CameraFocusController`) already depends on.
- No risk of the camera crossing outside the atmosphere sphere or any other scene geometry — FOV zoom never moves the camera.
- Matches a familiar mental model (camera lens / planetarium zoom) rather than a spatial dolly, which suits a "standing at a fixed point looking at the sky" experience.

### Negative / Risks

- Not `OrbitControls`' built-in zoom mechanism, so it needed custom wheel/touch handling instead of a few config props — slightly more code to maintain than the originally-envisioned `minDistance`/`maxDistance`/`zoomSpeed` tuple.
- Mobile pinch is hand-rolled (raw two-touch distance tracking) rather than reusing any library gesture recognizer, since `OrbitControls`' pinch handling is wired to its own (now-unused) distance zoom.
- FOV range (25°–75°) and wheel/pinch sensitivity are first-pass values pending real hands-on feedback, not derived from a formal usability pass.

## Follow-up

1. Tune `MIN_FOV`/`MAX_FOV` and wheel/pinch sensitivity constants once the project owner has tested the feel on both desktop and mobile.
2. True dolly zoom / focus-on-object (dynamically re-targeting `OrbitControls.target` at a selected figure so the camera can physically approach it, rather than only narrowing FOV) remains a real candidate for a future ADR, explicitly deferred here.
3. Earth zoom-out (a separate, larger-scope feature) is out of scope for this ADR entirely.
