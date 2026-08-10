import { useState } from "react";
import { CITIES } from "../../data/cities";
import { useSkyViewerStore } from "../../store/skyViewerStore";
import type { City } from "../../types/skyViewer";

const GROUPS: City["group"][] = ["India", "US", "Europe", "Australia", "Asia"];

export function LocationMenu() {
  const [open, setOpen] = useState(false);
  const selectedCity = useSkyViewerStore((s) => s.selectedCity);
  const useGeolocation = useSkyViewerStore((s) => s.useGeolocation);
  const setCity = useSkyViewerStore((s) => s.setCity);
  const setUseGeolocation = useSkyViewerStore((s) => s.setUseGeolocation);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUseGeolocation(true);
        setCity({
          id: "geolocated",
          name: "Your location",
          country: "",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          group: "Asia",
        });
      },
      () => {
        // Permission denied or unavailable — silently keep the current city.
      },
    );
  };

  return (
    <div className="pointer-events-auto absolute left-4 top-24 z-10 w-64">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-left text-sm text-white backdrop-blur-md"
      >
        <span className="text-white/40">Sky over </span>
        {useGeolocation ? "your location" : selectedCity.name}
      </button>
      {open && (
        <div className="mt-1 max-h-80 overflow-y-auto rounded-lg border border-white/10 bg-black/80 backdrop-blur-md">
          <button
            onClick={() => {
              handleGeolocate();
              setOpen(false);
            }}
            className="block w-full px-3 py-2 text-left text-sm text-amber-100/90 hover:bg-white/10"
          >
            Use my location
          </button>
          {GROUPS.map((group) => (
            <div key={group}>
              <div className="px-3 pt-2 text-[10px] uppercase tracking-widest text-white/30">{group}</div>
              {CITIES.filter((c) => c.group === group).map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    setCity(city);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-white/10 ${
                    !useGeolocation && city.id === selectedCity.id ? "text-amber-100" : "text-white/70"
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
