import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SkyViewer } from "./components/sky-viewer/SkyViewer";
import { Header } from "./components/Header";
import { DetailPanel } from "./components/DetailPanel";
import { SearchPanel } from "./components/SearchPanel";
import { LocationMenu } from "./components/sky-viewer/LocationMenu";
import { TimeControls } from "./components/sky-viewer/TimeControls";
import { SkyLayerToggles } from "./components/sky-viewer/SkyLayerToggles";
import { Compass } from "./components/Compass";
import { SatelliteModeBanner } from "./components/SatelliteModeBanner";

// ADR0002: the location-based sky viewer is now the default experience.
// The old abstract Dhruva-centric graph view (src/scene/CelestialScene.tsx
// + src/components/ui/LayerToggles.tsx, ADR0001) is left untouched and
// still works — it's just not mounted here. It's the natural candidate
// for a future "Relationship Map" secondary mode.
function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/*
        Camera sits ~40deg above the horizon, facing north, on load —
        looking flat at the horizon (elevation 0) put the horizon line at
        screen-centre and wasted half the view on empty ground, which read
        as "emptier" rather than immersive. Position is derived from
        altAzToVector3(40, 0, radius), negated (camera position, not
        target position) and scaled to the same tiny orbit radius
        OrbitControls uses in SkyViewer.
      */}
      <Canvas camera={{ position: [0, -0.064, -0.077], fov: 72 }}>
        <Suspense fallback={null}>
          <SkyViewer />
        </Suspense>
      </Canvas>

      <Header />
      <LocationMenu />
      <TimeControls />
      <SearchPanel />
      <DetailPanel />
      <SkyLayerToggles />
      <Compass />
      <SatelliteModeBanner />

      <footer className="pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center text-[10px] tracking-widest text-white/30">
        DRAG TO LOOK AROUND · CLICK A STAR TO EXPLORE
      </footer>
    </div>
  );
}

export default App;
