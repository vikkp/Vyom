import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SkyViewer } from "./components/sky-viewer/SkyViewer";
import { Header } from "./components/Header";
import { DetailPanel } from "./components/DetailPanel";
import { SearchPanel } from "./components/SearchPanel";
import { LocationMenu } from "./components/sky-viewer/LocationMenu";
import { TimeControls } from "./components/sky-viewer/TimeControls";
import { SkyLayerToggles } from "./components/sky-viewer/SkyLayerToggles";

// ADR0002: the location-based sky viewer is now the default experience.
// The old abstract Dhruva-centric graph view (src/scene/CelestialScene.tsx
// + src/components/ui/LayerToggles.tsx, ADR0001) is left untouched and
// still works — it's just not mounted here. It's the natural candidate
// for a future "Relationship Map" secondary mode.
function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 0, -0.1], fov: 72 }}>
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

      <footer className="pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center text-[10px] tracking-widest text-white/30">
        DRAG TO LOOK AROUND · CLICK A STAR TO EXPLORE
      </footer>
    </div>
  );
}

export default App;
