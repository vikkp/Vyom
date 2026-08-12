import { useSkyViewerStore } from "../store/skyViewerStore";

/**
 * ADR0009: a small, clean control shown only while "I am a satellite"
 * mode is active -- an explicit, always-visible way to turn it back off
 * without having to remember to re-open search and re-type the trigger
 * phrase. Positioned top-center (a spot nothing else in this app's HUD
 * occupies: Header sits at top-0, LocationMenu/TimeControls/DetailPanel
 * sit at the left-4/right-4 edges at top-24, SearchPanel sits at
 * left-4 top-40) so it reads as its own deliberate "mode banner" rather
 * than crowding into an existing control cluster.
 */
export function SatelliteModeBanner() {
  const satelliteMode = useSkyViewerStore((s) => s.satelliteMode);
  const setSatelliteMode = useSkyViewerStore((s) => s.setSatelliteMode);

  if (!satelliteMode) return null;

  return (
    <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2">
      <button
        onClick={() => setSatelliteMode(false)}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-amber-200/30 bg-black/60 px-4 py-1.5 text-xs tracking-wide text-amber-100/90 backdrop-blur-md transition-colors hover:bg-amber-100/10"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-200/80" />
        I am a satellite — Exit Satellite Mode
      </button>
    </div>
  );
}
