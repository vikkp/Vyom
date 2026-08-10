import { useSkyViewerStore } from "../../store/skyViewerStore";

// v1 simplification: the datetime-local input is interpreted in the
// browser's own local timezone, not the selected city's — good enough for
// "roughly when", not a substitute for a real per-city timezone lookup.
function toLocalInputValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function TimeControls() {
  const currentDate = useSkyViewerStore((s) => s.currentDate);
  const setCurrentDate = useSkyViewerStore((s) => s.setCurrentDate);

  return (
    <div className="pointer-events-auto absolute right-4 top-24 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-2 py-1.5 backdrop-blur-md">
      <input
        type="datetime-local"
        value={toLocalInputValue(currentDate)}
        onChange={(e) => {
          if (e.target.value) setCurrentDate(new Date(e.target.value));
        }}
        className="rounded bg-transparent px-1 py-0.5 text-xs text-white/80 [color-scheme:dark]"
      />
      <button
        onClick={() => setCurrentDate(new Date())}
        className="rounded px-2 py-1 text-xs tracking-wide text-amber-100/90 hover:bg-white/10"
      >
        Now
      </button>
    </div>
  );
}
