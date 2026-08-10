# Rishi figure textures

Drop transparent PNGs here named after the graph node id (`rishiId` in `src/data/stars.ts`), and `RishiOverlay` picks them up automatically — no code changes needed:

```
public/rishis/kratu.png
public/rishis/pulaha.png
public/rishis/pulastya.png
public/rishis/atri.png
public/rishis/angiras.png
public/rishis/vashishtha.png
public/rishis/marichi.png
```

Until a file exists, that rishi falls back to the placeholder ethereal glow + label.

Recommended size: 1024×1024 or 2048×2048, transparent background.

## Generation prompts (2026-08-11)

Shared style prefix, used at the start of every prompt below:

```
Ethereal photorealistic portrait of an ancient Hindu rishi, seated in perfect padmasana meditation posture on a subtle glowing cosmic platform, long flowing white and silver hair and full beard, serene wise face with deep calm eyes, simple saffron and white cotton dhoti and upper cloth draped elegantly, soft golden rim light and gentle luminous aura surrounding the body, highly detailed skin texture and fabric folds, sacred and contemplative atmosphere, cinematic lighting, volumetric glow, transparent background, isolated figure, masterpiece, 8k
```

- **Kratu** (Dubhe): `[prefix], elderly rishi named Kratu, slightly stern but compassionate expression, holding a small wooden staff resting across his lap, subtle reddish-golden aura`
- **Pulaha** (Merak): `[prefix], elderly rishi named Pulaha, peaceful meditative expression, hands in dhyana mudra resting on knees, soft warm saffron aura`
- **Pulastya** (Phecda): `[prefix], elderly rishi named Pulastya, gentle wise smile, one hand raised in blessing mudra near the chest, luminous golden-white aura`
- **Atri** (Megrez): `[prefix], elderly rishi named Atri, deeply serene and radiant face, both hands in chin mudra, strong clear golden aura`
- **Angiras** (Alioth): `[prefix], elderly rishi named Angiras, dignified and focused expression, holding a small kamandalu (water pot) in one hand, soft amber-golden aura`
- **Vashishtha** (Mizar): `[prefix], elderly rishi named Vashishtha, noble and calm expression, long flowing hair, hands resting in lap in meditation, bright pure golden aura`
- **Marichi** (Alkaid): `[prefix], elderly rishi named Marichi, slightly more ethereal and luminous presence, eyes half-closed in deep samadhi, radiant white-gold aura`

Generate all seven with the same seed (if the tool supports it) for visual consistency. Good model choices: Flux, Midjourney v6/v7 (`--style raw`), Ideogram — anything strong at photorealistic people with a clean transparent background.

## Arundhati (Alcor)

Not yet added — Vashishtha's companion star Alcor and the Arundhati figure would need a new star entry in `stars.ts` (very close to Mizar) plus a graph node. Ask to add this whenever the prompt/art is ready.
