import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import { CAMERA_ORBIT_RADIUS } from "./constants";

const ANIMATION_DURATION_MS = 900;

function slerpUnitVectors(a: Vector3, b: Vector3, angle: number, t: number): Vector3 {
  if (angle < 1e-6) return a.clone();
  const sinAngle = Math.sin(angle);
  const wa = Math.sin((1 - t) * angle) / sinAngle;
  const wb = Math.sin(t * angle) / sinAngle;
  return a.clone().multiplyScalar(wa).add(b.clone().multiplyScalar(wb));
}

// Ease in/out rather than a linear pan -- reads as a deliberate, considered
// turn (like someone actually looking for something) instead of a
// mechanical snap.
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Consumes `focusRequest` from skyViewerStore (set by SearchPanel when the
 * user picks a search result with a resolvable sky position) and smoothly
 * turns the camera to face that direction -- a planetarium "locate"
 * button.
 *
 * OrbitControls owns the camera's position/orientation each frame, but its
 * own update() call re-derives its internal spherical state FROM the
 * camera's current position every single time rather than only trusting
 * accumulated drag deltas -- that's what lets an external component "fly"
 * an orbit camera by just writing to camera.position and letting the next
 * update() pick it up, with no special handshake needed. This mounts once
 * inside <SkyViewer>, alongside <OrbitControls makeDefault>.
 */
export function CameraFocusController() {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as { update?: () => void } | null;
  const focusRequest = useSkyViewerStore((s) => s.focusRequest);
  const handledToken = useRef<number | null>(null);
  const animationRef = useRef<{ from: Vector3; to: Vector3; angle: number; startTime: number } | null>(null);

  useEffect(() => {
    if (!focusRequest || focusRequest.token === handledToken.current) return;
    handledToken.current = focusRequest.token;

    const from = camera.position.clone().normalize();
    // Camera position is the *opposite* direction from what it's looking
    // at -- the orbit target sits fixed at the origin (see the note on
    // <OrbitControls> in SkyViewer.tsx), so facing a sky direction means
    // sitting on the far side of the tiny orbit sphere from it.
    const to = new Vector3(focusRequest.direction.x, focusRequest.direction.y, focusRequest.direction.z)
      .normalize()
      .multiplyScalar(-1);
    const angle = from.angleTo(to);
    animationRef.current = { from, to, angle, startTime: performance.now() };
  }, [focusRequest, camera]);

  useFrame(() => {
    const anim = animationRef.current;
    if (!anim) return;

    const t = Math.min(1, (performance.now() - anim.startTime) / ANIMATION_DURATION_MS);
    const direction = slerpUnitVectors(anim.from, anim.to, anim.angle, easeInOutQuad(t));
    camera.position.copy(direction.multiplyScalar(CAMERA_ORBIT_RADIUS));
    controls?.update?.();

    if (t >= 1) animationRef.current = null;
  });

  return null;
}
