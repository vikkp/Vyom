import { useEffect, useState } from "react";
import { Texture, TextureLoader } from "three";

// Loads a texture if it exists, resolving to `null` (not throwing) if the
// file 404s — so RishiOverlay can fall back to the placeholder glow until
// real art is dropped into public/rishis/, with no code changes needed
// when it arrives.
const cache = new Map<string, Texture | null>();

export function useOptionalTexture(url: string): Texture | null {
  const [texture, setTexture] = useState<Texture | null>(cache.get(url) ?? null);

  useEffect(() => {
    if (cache.has(url)) {
      setTexture(cache.get(url) ?? null);
      return;
    }
    let cancelled = false;
    new TextureLoader().load(
      url,
      (loaded) => {
        if (cancelled) return;
        cache.set(url, loaded);
        setTexture(loaded);
      },
      undefined,
      () => {
        if (cancelled) return;
        cache.set(url, null);
        setTexture(null);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  return texture;
}
