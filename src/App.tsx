import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { CelestialScene } from "./scene/CelestialScene";
import { Header } from "./components/Header";
import { DetailPanel } from "./components/DetailPanel";
import { SearchPanel } from "./components/SearchPanel";

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 6, 20], fov: 50 }}>
        <Suspense fallback={null}>
          <CelestialScene />
        </Suspense>
      </Canvas>

      <Header />
      <SearchPanel />
      <DetailPanel />

      <footer className="pointer-events-none absolute inset-x-0 bottom-3 z-10 text-center text-[10px] tracking-widest text-white/30">
        DRAG TO ORBIT · CLICK A STAR TO EXPLORE
      </footer>
    </div>
  );
}

export default App;
