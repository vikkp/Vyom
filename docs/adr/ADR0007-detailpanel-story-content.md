# ADR0007 – Richer DetailPanel Stories

Status: Accepted
Date: 2026-08-12
Deciders: Project owner + senior consultant

## Context

DetailPanel (`src/components/DetailPanel.tsx`) has shown the same shape
since ADR0001: a title, an optional Sanskrit name, an optional symbol
line, one short `summary` sentence (for the 27 Nakshatras, often under 15
words), and a relationships list built from the graph's edges. That's
enough to identify an object, but not enough to actually read something
about it — clicking a Nakshatra or a Graha today tells you almost nothing
beyond its name.

The project owner supplied a full set of short, curated stories — one per
Nakshatra, one per Graha, one collective story for the Saptarishi, one
for Dhruva, and one for Akash Ganga — with an explicit brief: 80-140
words, clear/respectful/slightly evocative tone, grounded in traditional
sources, no modern reinterpretation or moralizing, and to be used
**exactly as provided, without rewriting, shortening, or modernizing**.

## Decision

- Add an optional `story` field to `GraphNode` (`src/types/graph.ts`).
  Optional, not a replacement for `summary`: only ~44 of this app's ~85
  nodes have curated story content today, and every other node needs to
  keep working exactly as before.
- DetailPanel renders `node.story` in place of `node.summary` whenever a
  story is present, falling back to `summary` otherwise. The existing
  relationships section is untouched, structurally and visually.
- Story content is used verbatim, byte-for-byte as supplied — no
  copyediting, trimming, or paraphrasing, even where a given entry runs
  shorter than the 80-word target (several Navagraha entries are 30-40
  words; see the Consequences section).
- Akash Ganga gains a real graph node for the first time (ADR0006 had
  explicitly deferred this) so it can carry a story and appear in
  DetailPanel like every other object — with a deliberately narrow click
  affordance rather than making the whole Milky Way mesh clickable (see
  Technical Approach).
- The single collective Saptarishi story is applied identically to each
  of the seven individually-clickable Rishi figures in the sky, since no
  per-sage story text was provided and there is no separate "click the
  whole asterism as one object" affordance to attach it to instead.

## Technical Approach

### Data model

```ts
export interface GraphNode {
  id: string;
  type: NodeType;
  group: NodeGroup;
  name: string;
  sanskrit?: string;
  symbol?: string;
  summary: string;
  story?: string; // ADR0007
}
```

`story` text uses `"\n\n"` to separate the 2-3 short paragraphs each
entry is written in (rulership/symbol, thematic description, "Interesting
fact:"); DetailPanel renders that with `whitespace-pre-line` rather than
splitting into separate `<p>` elements, so the paragraph breaks already
baked into the content just work.

### Content population

44 nodes received `story` text: 27 Nakshatras, 9 Navagraha, 7
star-represented Saptarishi (see below), and Dhruva Tārā. Applied via a
one-off Node script (not 44 manual edits) that maps each id to its exact
supplied text and writes `graph.json` back out — far less error-prone
than hand-editing a single large JSON file that many times, while still
keeping every string authored directly from the brief, not generated.

**Word counts, as supplied:** every entry is at or under the 140-word
ceiling; roughly two-thirds run shorter than the 80-word floor (Navagraha
entries especially — several are 27-41 words, since most were written as
two short paragraphs rather than three). Per the explicit "use them as
provided, do not rewrite or shorten" instruction, none of this was
padded or edited to hit the target range — flagged here rather than
silently deviating from the stated 80-140 word spec.

### Saptarishi: matching story to the actual visible figures

The seven Rishi portraits actually rendered and individually clickable
in the sky (`RishiOverlays.tsx`, driven by `SAPTARISHI_STARS` in
`starCatalog.ts`) are `marichi, atri, angiras, pulaha, pulastya, kratu,
vashishtha` — the classical Big Dipper list, matching the names in the
supplied "Saptarishi (collectively)" story exactly.

This does **not** match `graph.json`'s pre-existing `group: "saptarishi"`
tag, which (a leftover from ADR0001's original Dhruva-centric graph,
predating the sky-viewer's real Rishi figures) is actually applied to a
different seven sages: `atri, bharadvaja, gautama, jamadagni, kashyapa,
vashishtha, vishvamitra`. Only `atri` and `vashishtha` overlap between the
two lists. Story assignment was done against the real, visually-clickable
ids (also used by `layout.ts`'s `STAR_REPRESENTED_IDS`), not the stale
group label — this ADR does not attempt to reconcile that naming
mismatch, which predates this change and is noted under Follow-up.

### Dhruva: the star, not the boy

`graph.json` has two separate Dhruva-related nodes: `dhruva-tara` (`type:
"celestial"`, the actual Pole Star object rendered and clickable in the
sky) and `dhruva` (`type: "character"`, the boy in the Dhruva-family
story cluster, with his own distinct existing `summary`). The supplied
story text ("Dhruva is the pole star, the fixed point around which the
heavens appear to turn... granted the position of the immovable star by
Vishnu") is unambiguously about the star, so it was attached to
`dhruva-tara` — the `dhruva` character node's existing content is
untouched.

### Akash Ganga: new node, narrow click target

ADR0006 explicitly deferred Akash Ganga's clickability. Adding a story
for it means adding both a graph node and *some* way to open it. The
enclosing sphere mesh (`AkashGanga.tsx`'s `buildSphereGeometry`, radius
`DOME_RADIUS + 3`) spans the entire visible dome — larger than every
star/figure shell in the app — so giving *that mesh* an `onClick` would
mean R3F's raycaster registers a hit on it for nearly every click
anywhere in the sky, including clicks meant to hit empty sky and
deselect (`SkyViewer.tsx`'s `onPointerMissed` only fires when a click
hits *no* interactive object at all across the whole scene). That would
have quietly broken the existing "click empty sky to deselect" behavior
almost everywhere.

Instead, the click affordance lives on the existing "Akash Ganga" text
label — which is a `drei <Html>` element, i.e. a real DOM node positioned
via CSS transform, entirely outside the WebGL scene's raycasting system.
Giving *that* a normal `onClick` (flipping its `pointerEvents` from
`"none"` to `"auto"`) is a small, deliberate, discoverable target with
none of the whole-sphere risk — exactly where a curious user would
already look to click. It inherits the label's existing visibility rules
(shown when the "names" layer is on, or when the camera is currently
facing that direction) unchanged.

### DetailPanel rendering

- `<p>{node.story ?? node.summary}</p>` with `whitespace-pre-line` added,
  replacing the old plain `<p>{node.summary}</p>`.
- The `<aside>` gained `max-h-[75vh] overflow-y-auto` (previously
  unbounded height, only the relationships `<ul>` scrolled on its own) —
  the longest stories run to several short paragraphs, and without an
  outer bound the panel could otherwise run off the bottom of the
  viewport on shorter screens.
- The relationships section itself (structure, styling, click-to-navigate
  behavior) is byte-for-byte unchanged.

## Consequences

### Positive

- Every Nakshatra, Graha, star-represented Rishi, Dhruva Tārā, and now
  Akash Ganga has an actual short narrative instead of a single clause —
  the app's core promise ("walk the sky, learn its stories") is now
  backed by real content for its most important objects.
- `story` is purely additive to the data model — nothing about how the
  other ~40 nodes render changed.
- The Akash Ganga click affordance was added without touching the
  `AkashGanga.tsx` mesh's raycasting behavior at all, so there's no risk
  to the existing empty-sky-deselect interaction anywhere else in the
  scene.

### Negative / Risks

- Word counts are inconsistent with the stated 80-140 word target for
  many entries (see Technical Approach) — an intentional tradeoff
  (verbatim content over spec-perfect length), not an oversight.
- The pre-existing `group: "saptarishi"` mismatch in `graph.json` (see
  above) is now slightly more visible, since story content had to route
  around it — it's still not fixed here.
- The five `"saptarishi"`-group sages that aren't part of the visible
  Big Dipper figures (`bharadvaja, gautama, jamadagni, kashyapa,
  vishvamitra`) did not receive story content, since none was supplied
  for them — they remain reachable only via the relationship graph, with
  their old short `summary` text.

## Follow-up

1. Reconciling `graph.json`'s `"saptarishi"` group label with the actual
   seven star-represented Rishis (or renaming/splitting the group) is a
   reasonable future cleanup, not attempted here.
2. If story content is ever wanted for `bharadvaja, gautama, jamadagni,
   kashyapa, vishvamitra`, or for the `dhruva` character node
   specifically (as opposed to `dhruva-tara`), it would follow the same
   pattern established here.
