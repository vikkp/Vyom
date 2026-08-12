import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useSkyViewerStore } from "../../store/skyViewerStore";

const RAD_TO_DEG = 180 / Math.PI;

// Below this, a heading change isn't visually meaningful (sub-pixel
// rotation of the compass ring) -- skip the store write so dragging the
// sky doesn't push a new value to every subscriber on every single frame.
const HEADING_EPSILON_DEG = 0.05;

/** Shortest signed angular difference a-b, in degrees, handling the 0/360 wrap. */
function angleDiff(a: number, b: number): number {
  return (((a - b + 540) % 360) + 360) % 360 - 180;
}

/**
 * Bridges the camera's current facing direction into compass-heading
 * state the top-right Compass HUD (Compass.tsx) can read. Compass.tsx is
 * plain HTML living outside the R3F <Canvas> (a sibling of Header,
 * SkyLayerToggles in App.tsx), so it has no direct access to
 * useThree/useFrame -- this component is the bridge, mounted inside
 * <SkyViewer> alongside CameraFocusController and FovZoomController,
 * writing into the shared zustand store instead of rendering anything
 * itself.
 *
 * Heading uses the exact same convention as astronomy.ts's Alt/Az (North
 * = +Z, East = +X, az = atan2(x, z)) so it lines up with every other
 * direction-based computation in this app (the old horizon compass
 * labels, city search-to-orient, etc.) rather than introducing a second,
 * inconsistent bearing convention.
 */
export function CompassHeadingTracker() {
  const camera = useThree((s) => s.camera);
  const setCameraHeadingDeg = useSkyViewerStore((s) => s.setCameraHeadingDeg);
  const forward = useRef(new Vector3());
  const lastHeading = useRef(0);

  useFrame(() => {
    camera.getWorldDirection(forward.current);
    let heading = Math.atan2(forward.current.x, forward.current.z) * RAD_TO_DEG;
    if (heading < 0) heading += 360;

    if (Math.abs(angleDiff(heading, lastHeading.current)) > HEADING_EPSILON_DEG) {
      lastHeading.current = heading;
      setCameraHeadingDeg(heading);
    }
  });

  return null;
}
