import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { MIN_FOV, MAX_FOV, FOV_DAMPING } from "./constants";

// Degrees of FOV per unit of wheel deltaY. Click-wheel mice tend to fire
// deltaY in ~100-unit steps, trackpads in much smaller continuous ones --
// this value gives a full sweep of the MIN_FOV..MAX_FOV range in roughly
// 10 mouse-wheel notches, fine control on a trackpad.
const WHEEL_SENSITIVITY = 0.05;

// Degrees of FOV per pixel of two-finger pinch-distance change.
const PINCH_SENSITIVITY = 0.15;

function clampFov(fov: number): number {
  return Math.min(MAX_FOV, Math.max(MIN_FOV, fov));
}

function pinchDistance(touches: TouchList): number {
  const a = touches[0];
  const b = touches[1];
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

/**
 * ADR0004: zoom is implemented by narrowing/widening the camera's field of
 * view rather than moving the camera, because OrbitControls' target is
 * fixed at the origin and every star/figure sits on a DOME_RADIUS shell
 * around it -- distance-based dolly zoom there has a hard floor and can
 * never produce a real close-up (see the ADR for the full reasoning).
 * Narrowing FOV is the same trick a camera lens, or any planetarium app,
 * uses to "zoom" without physically moving.
 *
 * Mouse wheel (desktop) and two-finger pinch (mobile) each nudge a target
 * FOV value; every frame the camera's actual fov eases toward that target
 * (FOV_DAMPING) instead of snapping, for the same smoothed feel
 * OrbitControls' own enableDamping gives rotation. This listens directly on
 * the canvas element rather than going through OrbitControls -- its
 * enableZoom stays false in SkyViewer.tsx, so there's nothing to conflict
 * with; this fully replaces OrbitControls' distance-based zoom rather than
 * layering on top of it. Mounts once inside <SkyViewer>, alongside
 * <OrbitControls makeDefault> and <CameraFocusController>.
 */
export function FovZoomController() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const targetFov = useRef(camera.fov);
  const activePinchDistance = useRef<number | null>(null);

  useEffect(() => {
    const el = gl.domElement;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetFov.current = clampFov(targetFov.current + e.deltaY * WHEEL_SENSITIVITY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) activePinchDistance.current = pinchDistance(e.touches);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || activePinchDistance.current === null) return;
      e.preventDefault();
      const distance = pinchDistance(e.touches);
      // Fingers moving apart (distance grows) should zoom in (FOV shrinks),
      // so the delta is inverted relative to the wheel case above.
      const delta = activePinchDistance.current - distance;
      targetFov.current = clampFov(targetFov.current + delta * PINCH_SENSITIVITY);
      activePinchDistance.current = distance;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) activePinchDistance.current = null;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [gl]);

  useFrame(() => {
    const diff = targetFov.current - camera.fov;
    if (Math.abs(diff) < 0.01) return;
    camera.fov += diff * FOV_DAMPING;
    camera.updateProjectionMatrix();
  });

  return null;
}
