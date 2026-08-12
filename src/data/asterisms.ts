import type { Asterism } from "../types/skyViewer";

// Saptarishi and Mrigashira are the two multi-star line patterns so far
// (ADR0003 priority #2). Every other Nakshatra still maps to a single
// yogatara star (a point, not a shape), per the Brihat Samhita
// junction-star tradition — those get built out into full asterisms one
// at a time, per ADR0003's own sequencing (Rohini/Hyades and
// Krittika/Pleiades next).
export const ASTERISMS: Asterism[] = [
  {
    id: "saptarishi",
    name: "Saptarishi",
    // A single traversal path (consecutive pairs become line segments) that
    // covers the handle (Alkaid-Mizar-Alioth-Megrez) then closes the bowl
    // quadrilateral (Megrez-Dubhe-Merak-Phecda-Megrez).
    starIds: ["alkaid", "mizar", "alioth", "megrez", "dubhe", "merak", "phecda", "megrez"],
    nodeId: undefined,
  },
  {
    id: "mrigashira",
    name: "Mrigashira",
    // The "deer head" triangle: Meissa (Lambda Orionis, the Brihat
    // Samhita yogatara) plus Phi-1 and Phi-2 Orionis, closed back to
    // Meissa. See docs/research/mrigashira-asterism-sources.md.
    starIds: ["meissa", "phi1-orionis", "phi2-orionis", "meissa"],
    nodeId: "mrigashira",
  },
  {
    id: "rohini",
    name: "Rohini",
    // The Hyades "V": open (not closed back to start), converging at
    // Gamma Tauri (the vertex/nose) with Epsilon Tauri and Aldebaran as
    // the two open tips. See docs/research/rohini-asterism-sources.md.
    starIds: ["epsilon-tauri", "delta1-tauri", "gamma-tauri", "theta2-tauri", "aldebaran"],
    nodeId: "rohini",
  },
  {
    id: "krittika",
    name: "Krittika",
    // The naked-eye Pleiades cluster shape, zigzagging through the six
    // brightest stars rather than a straight line — see
    // docs/research/krittika-asterism-sources.md.
    starIds: ["merope", "electra", "taygeta", "maia", "alcyone", "atlas"],
    nodeId: "krittika",
  },
  {
    id: "ursa-minor",
    name: "Ursa Minor (Dhruva context)",
    // The Little Dipper: handle from Polaris out to the bowl, then the
    // bowl itself closed back to zeta. See
    // docs/research/dhruva-context-sources.md. No nodeId — see the
    // comment above URSA_MINOR_CONTEXT_STARS in starCatalog.ts for why.
    starIds: ["polaris", "yildun", "epsilon-umi", "zeta-umi", "eta-umi", "pherkad", "kochab", "zeta-umi"],
    nodeId: undefined,
    // Orientation scaffolding around Dhruva Tara, not a storied shape in its
    // own right -- kept visually quiet so it doesn't compete with Saptarishi
    // right next to it near the pole.
    emphasis: "secondary",
  },
  {
    id: "ashwini",
    name: "Ashwini",
    // The simplest possible asterism: a single line between the
    // nakshatra's two classical stars, Sheratan and Mesarthim. See
    // docs/research/ashwini-asterism-sources.md.
    starIds: ["sheratan", "mesarthim"],
    nodeId: "ashwini",
  },
  {
    id: "magha",
    name: "Magha",
    // Base (Rho-31 Leonis-Omicron) rising into a tall back through
    // Regulus-Eta-Algieba -- not the Western "Sickle of Leo" (different
    // stars), a distinct Hindu-tradition asterism. See
    // docs/research/magha-asterism-sources.md.
    starIds: ["rho-leonis", "31-leonis", "omicron-leonis", "regulus", "eta-leonis", "algieba"],
    nodeId: "magha",
  },
  {
    id: "jyeshtha",
    name: "Jyeshtha",
    // "Three stars in a row" (the earring/umbrella shape), an open line
    // Sigma-Antares-Tau -- the real positions already fall in a near-
    // straight diagonal, no artistic reordering needed. See
    // docs/research/jyeshtha-asterism-sources.md.
    starIds: ["sigma-scorpii", "antares", "tau-scorpii"],
    nodeId: "jyeshtha",
  },
  // Third batch: Ardra, Punarvasu, Pushya. Ardra is deliberately absent
  // here -- confirmed with the project owner that it stays a single-star
  // nakshatra (no traditional companion stars to draw a line between),
  // see docs/research/ardra-asterism-sources.md.
  {
    id: "punarvasu",
    name: "Punarvasu",
    // The simplest possible shape again: a single line between the twin
    // stars, Pollux (yogatara) and Castor. See
    // docs/research/punarvasu-asterism-sources.md.
    starIds: ["pollux", "castor"],
    nodeId: "punarvasu",
  },
  {
    id: "pushya",
    name: "Pushya",
    // Closed triangle (same treatment as Mrigashira's "deer head"):
    // Theta Cancri and Asellus Australis sit at nearly the same
    // declination with Asellus Borealis well north of both, so the real
    // positions naturally form an arrowhead/triangle rather than a
    // straight line. See docs/research/pushya-asterism-sources.md.
    starIds: ["theta-cancri", "asellus-borealis", "asellus-australis", "theta-cancri"],
    nodeId: "pushya",
  },
  // Fourth batch: Ashlesha, Swati. Swati is deliberately absent here --
  // same reasoning as Ardra, no traditional companion stars to draw a
  // line between. See docs/research/swati-asterism-sources.md.
  {
    id: "ashlesha",
    name: "Ashlesha",
    // Closed six-star loop, the real "ring" shape Hydra's head forms --
    // ordering chosen to avoid any segment passing close to an
    // unconnected star (an earlier candidate ordering had the closing
    // segment nearly overlap Rho Hydrae). See
    // docs/research/ashlesha-asterism-sources.md.
    starIds: ["delta-hydrae", "sigma-hydrae", "eta-hydrae", "epsilon-hydrae", "zeta-hydrae", "rho-hydrae", "delta-hydrae"],
    nodeId: "ashlesha",
  },
  // Fifth batch: Mula, Shravana, Dhanishta.
  {
    id: "mula",
    name: "Mula",
    // The real "fish-hook" curve of Scorpius' tail: sweeps south from
    // Epsilon through the tail's lowest point (Eta), then curves back
    // north to the stinger tip (Lesath/Shaula). Open path, not closed --
    // a tail has two ends. See docs/research/mula-asterism-sources.md.
    starIds: ["epsilon-scorpii", "mu1-scorpii", "zeta2-scorpii", "eta-scorpii", "theta-scorpii", "iota1-scorpii", "kappa-scorpii", "upsilon-scorpii", "shaula"],
    nodeId: "mula",
  },
  {
    id: "shravana",
    name: "Shravana",
    // Three stars in a near-straight line, Tarazed north of Altair and
    // Alshain south of it -- matching the "three footprints" symbol
    // directly. See docs/research/shravana-asterism-sources.md.
    starIds: ["gamma-aquilae", "altair", "beta-aquilae"],
    nodeId: "shravana",
  },
  {
    id: "dhanishta",
    name: "Dhanishta",
    // Closed quadrilateral ("Job's Coffin"), ordering derived from the
    // convex hull of the four real positions (by angle around their
    // centroid) so the drawn rhombus doesn't self-intersect. See
    // docs/research/dhanishta-asterism-sources.md.
    starIds: ["rotanev", "delta-delphini", "gamma-delphini", "alpha-delphini", "rotanev"],
    nodeId: "dhanishta",
  },
  // Sixth (final) batch: Shatabhisha, Purva Bhadrapada, Uttara
  // Bhadrapada, Revati -- completes all 27 nakshatras. Shatabhisha is
  // deliberately absent here, same reasoning as Ardra/Swati, no
  // traditional companion star to draw a line to. See
  // docs/research/shatabhisha-asterism-sources.md.
  {
    id: "purva-bhadrapada",
    name: "Purva Bhadrapada",
    // Simple two-star line, the western pair of corners of the Great
    // Square of Pegasus. See
    // docs/research/purva-bhadrapada-asterism-sources.md.
    starIds: ["markab", "scheat"],
    nodeId: "purva-bhadrapada",
  },
  {
    id: "uttara-bhadrapada",
    name: "Uttara Bhadrapada",
    // Simple two-star line, the eastern pair of corners of the same
    // Great Square. See docs/research/uttara-bhadrapada-asterism-sources.md.
    starIds: ["algenib", "alpheratz"],
    nodeId: "uttara-bhadrapada",
  },
  {
    id: "revati",
    name: "Revati",
    // Simple two-star line to Zeta Piscium's documented near neighbour.
    // See docs/research/revati-asterism-sources.md.
    starIds: ["zeta-piscium", "mu-piscium"],
    nodeId: "revati",
  },
  // Seventh batch: Hasta, Chitra, Vishakha, Purva Ashadha. Chitra is
  // deliberately absent here, same reasoning as Ardra/Swati/Shatabhisha,
  // no traditional companion star to draw a line to. See
  // docs/research/chitra-asterism-sources.md.
  {
    id: "hasta",
    name: "Hasta",
    // Closed five-star pentagon, the real Corvus "sail" shape --
    // convex-hull ordering (by angle around the centroid), same approach
    // used for Dhanishta's quadrilateral. See
    // docs/research/hasta-asterism-sources.md.
    starIds: ["algorab", "gamma-corvi", "epsilon-corvi", "alpha-corvi", "beta-corvi", "algorab"],
    nodeId: "hasta",
  },
  {
    id: "vishakha",
    name: "Vishakha",
    // Closed four-star quadrilateral, following the traditional pada
    // sequence (Alpha-Beta-Gamma-Iota) -- checked against the real
    // positions for self-intersection and found clean. See
    // docs/research/vishakha-asterism-sources.md.
    starIds: ["zubenelgenubi", "beta-librae", "gamma-librae", "iota-librae", "zubenelgenubi"],
    nodeId: "vishakha",
  },
  {
    id: "purva-ashadha",
    name: "Purva Ashadha",
    // Open three-star line, north to south along the real "Kaus" bow
    // shape. See docs/research/purva-ashadha-asterism-sources.md.
    starIds: ["lambda-sagittarii", "kaus-media", "epsilon-sagittarii"],
    nodeId: "purva-ashadha",
  },
];
