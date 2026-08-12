import type { SkyCatalogStar } from "../types/skyViewer";

// Real J2000 coordinates, researched and cross-checked against Wikipedia /
// TheSkyLive (see docs/research/ for the full source notes). Three groups:
//
// 1. Dhruva Tārā (Polaris) — the fixed anchor.
// 2. The Saptarishi / Big Dipper (Ursa Major) — nodeId points at the
//    "mind-born sons" progenitor nodes in graph.json (see
//    docs/research/nakshatra-deities-sources.md for why that's a
//    different list from the "current Manvantara" saptarishi group).
// 3. The 27 Nakshatra yogatara (junction) stars, per the Brihat Samhita
//    (Varahamihira, 6th c.) — nodeId points directly at the matching
//    nakshatra node in graph.json.
// 4. ~25 additional bright naked-eye stars for sky realism, no nodeId.
// 5. MRIGASHIRA_EXTRA_STARS (ADR0003): Phi-1/Phi-2 Orionis, added
//    alongside the existing Meissa yogatara to complete Mrigashira as a
//    real 3-star "deer head" asterism rather than a single point — see
//    docs/research/mrigashira-asterism-sources.md.

export const DHRUVA_STAR: SkyCatalogStar = {
  id: "polaris",
  ra: 2.53,
  dec: 89.264,
  mag: 1.97,
  indianName: "Dhruva Tārā",
  westernName: "Polaris",
  nodeId: "dhruva-tara",
};

export const SAPTARISHI_STARS: SkyCatalogStar[] = [
  { id: "dubhe", ra: 11.062, dec: 61.751, mag: 1.79, indianName: "Kratu", westernName: "Dubhe", nodeId: "kratu", constellation: "Saptarishi" },
  { id: "merak", ra: 11.03, dec: 56.382, mag: 2.37, indianName: "Pulaha", westernName: "Merak", nodeId: "pulaha", constellation: "Saptarishi" },
  { id: "phecda", ra: 11.897, dec: 53.695, mag: 2.44, indianName: "Pulastya", westernName: "Phecda", nodeId: "pulastya", constellation: "Saptarishi" },
  { id: "megrez", ra: 12.257, dec: 57.033, mag: 3.31, indianName: "Atri", westernName: "Megrez", nodeId: "atri", constellation: "Saptarishi" },
  { id: "alioth", ra: 12.9, dec: 55.96, mag: 1.77, indianName: "Angiras", westernName: "Alioth", nodeId: "angiras", constellation: "Saptarishi" },
  { id: "mizar", ra: 13.399, dec: 54.925, mag: 2.23, indianName: "Vashishtha", westernName: "Mizar", nodeId: "vashishtha", constellation: "Saptarishi" },
  { id: "alkaid", ra: 13.792, dec: 49.313, mag: 1.86, indianName: "Marichi", westernName: "Alkaid", nodeId: "marichi", constellation: "Saptarishi" },
];

export const NAKSHATRA_STARS: SkyCatalogStar[] = [
  { id: "sheratan", ra: 1.911, dec: 20.808, mag: 2.64, indianName: "Ashwini", westernName: "Sheratan", nodeId: "ashwini", constellation: "Nakshatra" },
  { id: "41-arietis", ra: 2.833, dec: 27.261, mag: 3.63, indianName: "Bharani", westernName: "41 Arietis (Bharani)", nodeId: "bharani", constellation: "Nakshatra" },
  { id: "alcyone", ra: 3.791, dec: 24.105, mag: 2.87, indianName: "Krittika", westernName: "Alcyone", nodeId: "krittika", constellation: "Nakshatra" },
  { id: "aldebaran", ra: 4.599, dec: 16.509, mag: 0.87, indianName: "Rohini", westernName: "Aldebaran", nodeId: "rohini", constellation: "Nakshatra" },
  { id: "meissa", ra: 5.586, dec: 9.934, mag: 3.33, indianName: "Mrigashira", westernName: "Meissa", nodeId: "mrigashira", constellation: "Nakshatra" },
  { id: "betelgeuse", ra: 5.919, dec: 7.407, mag: 0.5, indianName: "Ardra", westernName: "Betelgeuse", nodeId: "ardra", constellation: "Nakshatra" },
  { id: "pollux", ra: 7.755, dec: 28.026, mag: 1.14, indianName: "Punarvasu", westernName: "Pollux", nodeId: "punarvasu", constellation: "Nakshatra" },
  { id: "asellus-australis", ra: 8.745, dec: 18.154, mag: 3.94, indianName: "Pushya", westernName: "Asellus Australis", nodeId: "pushya", constellation: "Nakshatra" },
  { id: "epsilon-hydrae", ra: 8.779, dec: 6.419, mag: 3.38, indianName: "Ashlesha", westernName: "Ashlesha (ε Hydrae)", nodeId: "ashlesha", constellation: "Nakshatra" },
  { id: "regulus", ra: 10.14, dec: 11.967, mag: 1.36, indianName: "Magha", westernName: "Regulus", nodeId: "magha", constellation: "Nakshatra" },
  { id: "zosma", ra: 11.235, dec: 20.523, mag: 2.56, indianName: "Purva Phalguni", westernName: "Zosma", nodeId: "purva-phalguni", constellation: "Nakshatra" },
  { id: "denebola", ra: 11.818, dec: 14.572, mag: 2.14, indianName: "Uttara Phalguni", westernName: "Denebola", nodeId: "uttara-phalguni", constellation: "Nakshatra" },
  { id: "algorab", ra: 12.498, dec: -16.516, mag: 2.95, indianName: "Hasta", westernName: "Algorab", nodeId: "hasta", constellation: "Nakshatra" },
  { id: "spica", ra: 13.42, dec: -11.161, mag: 1.04, indianName: "Chitra", westernName: "Spica", nodeId: "chitra", constellation: "Nakshatra" },
  { id: "arcturus", ra: 14.261, dec: 19.182, mag: -0.05, indianName: "Swati", westernName: "Arcturus", nodeId: "swati", constellation: "Nakshatra" },
  { id: "zubenelgenubi", ra: 14.848, dec: -16.042, mag: 2.75, indianName: "Vishakha", westernName: "Zubenelgenubi", nodeId: "vishakha", constellation: "Nakshatra" },
  { id: "dschubba", ra: 16.006, dec: -22.622, mag: 2.32, indianName: "Anuradha", westernName: "Dschubba", nodeId: "anuradha", constellation: "Nakshatra" },
  { id: "antares", ra: 16.49, dec: -26.432, mag: 1.06, indianName: "Jyeshtha", westernName: "Antares", nodeId: "jyeshtha", constellation: "Nakshatra" },
  { id: "shaula", ra: 17.56, dec: -37.104, mag: 1.63, indianName: "Mula", westernName: "Shaula", nodeId: "mula", constellation: "Nakshatra" },
  { id: "kaus-media", ra: 18.35, dec: -29.828, mag: 2.7, indianName: "Purva Ashadha", westernName: "Kaus Media", nodeId: "purva-ashadha", constellation: "Nakshatra" },
  { id: "nunki", ra: 18.921, dec: -26.297, mag: 2.02, indianName: "Uttara Ashadha", westernName: "Nunki", nodeId: "uttara-ashadha", constellation: "Nakshatra" },
  { id: "altair", ra: 19.846, dec: 8.868, mag: 0.76, indianName: "Shravana", westernName: "Altair", nodeId: "shravana", constellation: "Nakshatra" },
  { id: "rotanev", ra: 20.626, dec: 14.595, mag: 3.63, indianName: "Dhanishta", westernName: "Rotanev", nodeId: "dhanishta", constellation: "Nakshatra" },
  { id: "lambda-aquarii", ra: 22.877, dec: -7.58, mag: 3.7, indianName: "Shatabhisha", westernName: "λ Aquarii", nodeId: "shatabhisha", constellation: "Nakshatra" },
  { id: "markab", ra: 23.079, dec: 15.205, mag: 2.49, indianName: "Purva Bhadrapada", westernName: "Markab", nodeId: "purva-bhadrapada", constellation: "Nakshatra" },
  { id: "algenib", ra: 0.221, dec: 15.184, mag: 2.83, indianName: "Uttara Bhadrapada", westernName: "Algenib", nodeId: "uttara-bhadrapada", constellation: "Nakshatra" },
  { id: "zeta-piscium", ra: 1.229, dec: 7.575, mag: 5.28, indianName: "Revati", westernName: "ζ Piscium", nodeId: "revati", constellation: "Nakshatra" },
];

// ADR0003: the other two stars of the Mrigashira "deer head" triangle.
// Share nodeId "mrigashira" with Meissa (the yogatara) rather than each
// getting a distinct node — unlike Saptarishi's seven separate sage
// nodes, Mrigashira is one nakshatra/deity node, and all three stars are
// just its shape, not distinct characters.
export const MRIGASHIRA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "phi1-orionis", ra: 5.5804, dec: 9.4896, mag: 4.42, indianName: "Mrigashira", westernName: "Phi¹ Orionis", nodeId: "mrigashira", constellation: "Nakshatra" },
  { id: "phi2-orionis", ra: 5.6151, dec: 9.2907, mag: 4.08, indianName: "Mrigashira", westernName: "Phi² Orionis", nodeId: "mrigashira", constellation: "Nakshatra" },
];

// ADR0003 priority #3: the rest of the Hyades "V", completing Rohini
// beyond its single Aldebaran yogatara. Aldebaran itself isn't a
// physical Hyades member (it's a much closer foreground star along the
// same line of sight) but is universally included in the visual V
// asterism — see docs/research/rohini-asterism-sources.md. All four
// share nodeId "rohini" with Aldebaran, same reasoning as Mrigashira.
export const HYADES_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "gamma-tauri", ra: 4.3299, dec: 15.6276, mag: 3.65, indianName: "Rohini", westernName: "Gamma Tauri (Prima Hyadum)", nodeId: "rohini", constellation: "Nakshatra" },
  { id: "delta1-tauri", ra: 4.3823, dec: 17.5425, mag: 3.77, indianName: "Rohini", westernName: "Delta¹ Tauri (Secunda Hyadum)", nodeId: "rohini", constellation: "Nakshatra" },
  { id: "epsilon-tauri", ra: 4.4769, dec: 19.1804, mag: 3.53, indianName: "Rohini", westernName: "Epsilon Tauri (Ain)", nodeId: "rohini", constellation: "Nakshatra" },
  { id: "theta2-tauri", ra: 4.4777, dec: 15.8709, mag: 3.4, indianName: "Rohini", westernName: "Theta² Tauri", nodeId: "rohini", constellation: "Nakshatra" },
];

// ADR0003 priority #4: the rest of the naked-eye Pleiades, completing
// Krittika beyond its single Alcyone yogatara. See
// docs/research/krittika-asterism-sources.md. All share nodeId
// "krittika" with Alcyone, same reasoning as Mrigashira/Rohini.
export const PLEIADES_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "electra", ra: 3.7479, dec: 24.1133, mag: 3.7, indianName: "Krittika", westernName: "Electra (17 Tauri)", nodeId: "krittika", constellation: "Nakshatra" },
  { id: "taygeta", ra: 3.7535, dec: 24.4673, mag: 4.29, indianName: "Krittika", westernName: "Taygeta (19 Tauri)", nodeId: "krittika", constellation: "Nakshatra" },
  { id: "maia", ra: 3.7638, dec: 24.3678, mag: 3.87, indianName: "Krittika", westernName: "Maia (20 Tauri)", nodeId: "krittika", constellation: "Nakshatra" },
  { id: "merope", ra: 3.7721, dec: 23.9484, mag: 4.17, indianName: "Krittika", westernName: "Merope (23 Tauri)", nodeId: "krittika", constellation: "Nakshatra" },
  { id: "atlas", ra: 3.8456, dec: 24.1328, mag: 3.63, indianName: "Krittika", westernName: "Atlas (27 Tauri)", nodeId: "krittika", constellation: "Nakshatra" },
];

// ADR0003 priority #5: "Dhruva context" — the rest of Ursa Minor (the
// Little Dipper) around Polaris. Deliberately no nodeId, unlike the
// nakshatra asterisms above: Polaris/Dhruva already has its own correct
// node (dhruva-tara), and these six stars are the surrounding
// constellation's shape, not additional facets of that specific node —
// there's no existing "Ursa Minor" graph node to attach them to, and
// creating one is graph content, which is out of scope for this pass
// (see docs/research/dhruva-context-sources.md). Names are Western-only
// for the same reason BRIGHT_STARS are: no sourced traditional Sanskrit
// name for each individual star, only for Dhruva Tārā itself.
export const URSA_MINOR_CONTEXT_STARS: SkyCatalogStar[] = [
  { id: "yildun", ra: 17.5369, dec: 86.5865, mag: 4.35, westernName: "Yildun (δ UMi)", constellation: "Ursa Minor" },
  { id: "epsilon-umi", ra: 16.7662, dec: 82.0373, mag: 4.19, westernName: "ε Ursae Minoris", constellation: "Ursa Minor" },
  { id: "zeta-umi", ra: 15.7343, dec: 77.7945, mag: 4.29, westernName: "ζ Ursae Minoris", constellation: "Ursa Minor" },
  { id: "eta-umi", ra: 16.2917, dec: 75.7553, mag: 4.95, westernName: "η Ursae Minoris", constellation: "Ursa Minor" },
  { id: "pherkad", ra: 15.3455, dec: 71.834, mag: 3.05, westernName: "Pherkad (γ UMi)", constellation: "Ursa Minor" },
  { id: "kochab", ra: 14.8451, dec: 74.1555, mag: 2.08, westernName: "Kochab (β UMi)", constellation: "Ursa Minor" },
];

// Second asterism batch: Ashwini, Magha, Jyeshtha built out from single
// yogatara points into real multi-star shapes, same pattern as the
// Mrigashira/Rohini/Krittika batch above (share nodeId with the existing
// yogatara star, since these are that nakshatra's own visual form).

// Ashwini: the classical symbol is explicitly "the stars β and γ Arietis" —
// Sheratan (already the yogatara) plus Mesarthim. See
// docs/research/ashwini-asterism-sources.md.
export const ASHWINI_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "mesarthim", ra: 1.8922, dec: 19.2939, mag: 3.86, indianName: "Ashwini", westernName: "Mesarthim (γ Arietis)", nodeId: "ashwini", constellation: "Nakshatra" },
];

// Magha: Regulus (yogatara) plus five fainter stars documented as its
// surrounding asterism — a distinct shape from the Western "Sickle of
// Leo." See docs/research/magha-asterism-sources.md.
export const MAGHA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "algieba", ra: 10.3329, dec: 19.8415, mag: 2.08, indianName: "Magha", westernName: "Algieba (γ Leonis)", nodeId: "magha", constellation: "Nakshatra" },
  { id: "eta-leonis", ra: 10.1222, dec: 16.7627, mag: 3.486, indianName: "Magha", westernName: "Al Jabhah (η Leonis)", nodeId: "magha", constellation: "Nakshatra" },
  { id: "omicron-leonis", ra: 9.6858, dec: 9.8923, mag: 3.52, indianName: "Magha", westernName: "Subra (ο Leonis)", nodeId: "magha", constellation: "Nakshatra" },
  { id: "31-leonis", ra: 10.1317, dec: 9.9975, mag: 4.39, indianName: "Magha", westernName: "31 Leonis", nodeId: "magha", constellation: "Nakshatra" },
  { id: "rho-leonis", ra: 10.5469, dec: 9.3066, mag: 3.85, indianName: "Magha", westernName: "Rho Leonis", nodeId: "magha", constellation: "Nakshatra" },
];

// Jyeshtha: Antares (yogatara) plus Tau and Sigma Scorpii — documented as
// "three stars in a row" forming the traditional earring/umbrella shape.
// See docs/research/jyeshtha-asterism-sources.md.
export const JYESHTHA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "sigma-scorpii", ra: 16.3531, dec: -25.5928, mag: 2.88, indianName: "Jyeshtha", westernName: "Sigma Scorpii", nodeId: "jyeshtha", constellation: "Nakshatra" },
  { id: "tau-scorpii", ra: 16.5981, dec: -28.216, mag: 2.82, indianName: "Jyeshtha", westernName: "Tau Scorpii", nodeId: "jyeshtha", constellation: "Nakshatra" },
];

// Third asterism batch: Ardra, Punarvasu, Pushya. Ardra is a deliberate
// exception -- confirmed with the project owner that it stays a
// single-star nakshatra (its classical symbol is a single teardrop/gem
// with no traditionally sourced companion stars), so there's no
// ARDRA_EXTRA_STARS group; see docs/research/ardra-asterism-sources.md.

// Punarvasu: the existing yogatara Pollux plus its twin Castor -- both
// stars are explicitly named as the nakshatra's basis (not just the
// yogatara alone). Castor previously lived in BRIGHT_STARS as an
// unlinked background star; it moves here now that it has a sourced
// nakshatra role. See docs/research/punarvasu-asterism-sources.md.
export const PUNARVASU_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "castor", ra: 7.577, dec: 31.888, mag: 1.58, indianName: "Punarvasu", westernName: "Castor (α Geminorum)", nodeId: "punarvasu", constellation: "Nakshatra" },
];

// Pushya: the existing yogatara Asellus Australis plus its documented
// companions Asellus Borealis and Theta Cancri -- the classical "Little
// Asses" flanking the Praesepe/Beehive cluster. See
// docs/research/pushya-asterism-sources.md.
export const PUSHYA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "asellus-borealis", ra: 8.7214, dec: 21.4686, mag: 4.65, indianName: "Pushya", westernName: "Asellus Borealis (γ Cancri)", nodeId: "pushya", constellation: "Nakshatra" },
  { id: "theta-cancri", ra: 8.5266, dec: 18.0944, mag: 5.32, indianName: "Pushya", westernName: "Theta Cancri", nodeId: "pushya", constellation: "Nakshatra" },
];

// Fourth asterism batch: Ashlesha, Swati. Swati is a deliberate exception,
// same reasoning as Ardra in the previous batch: it stays a single-star
// nakshatra (its classical symbol is a single wind-blown shoot, with no
// traditionally sourced companion stars), so there's no
// SWATI_EXTRA_STARS group; see docs/research/swati-asterism-sources.md.

// Ashlesha: the existing yogatara Epsilon Hydrae plus the five other stars
// of the compact "ring" forming Hydra's head -- Delta, Eta, Rho, Sigma,
// Zeta Hydrae. See docs/research/ashlesha-asterism-sources.md.
export const ASHLESHA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "delta-hydrae", ra: 8.6276, dec: 5.7038, mag: 4.15, indianName: "Ashlesha", westernName: "Delta Hydrae", nodeId: "ashlesha", constellation: "Nakshatra" },
  { id: "eta-hydrae", ra: 8.7204, dec: 3.3986, mag: 4.29, indianName: "Ashlesha", westernName: "Eta Hydrae", nodeId: "ashlesha", constellation: "Nakshatra" },
  { id: "rho-hydrae", ra: 8.8072, dec: 5.8378, mag: 4.34, indianName: "Ashlesha", westernName: "Rho Hydrae", nodeId: "ashlesha", constellation: "Nakshatra" },
  { id: "sigma-hydrae", ra: 8.646, dec: 3.3414, mag: 4.48, indianName: "Ashlesha", westernName: "Sigma Hydrae", nodeId: "ashlesha", constellation: "Nakshatra" },
  { id: "zeta-hydrae", ra: 8.9232, dec: 5.9456, mag: 3.1, indianName: "Ashlesha", westernName: "Zeta Hydrae", nodeId: "ashlesha", constellation: "Nakshatra" },
];

// Fifth asterism batch: Mula, Shravana, Dhanishta.

// Mula: the existing yogatara Shaula plus the rest of the real "fish-hook"
// tail-of-Scorpius asterism -- Epsilon, Mu1, Zeta2, Eta, Theta (Sargas),
// Iota1, Kappa (Girtab), Upsilon (Lesath) Scorpii. See
// docs/research/mula-asterism-sources.md.
export const MULA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "epsilon-scorpii", ra: 16.8361, dec: -34.2933, mag: 2.29, indianName: "Mula", westernName: "Epsilon Scorpii", nodeId: "mula", constellation: "Nakshatra" },
  { id: "mu1-scorpii", ra: 16.8645, dec: -38.0474, mag: 3.08, indianName: "Mula", westernName: "Mu¹ Scorpii", nodeId: "mula", constellation: "Nakshatra" },
  { id: "zeta2-scorpii", ra: 16.9097, dec: -42.3613, mag: 3.62, indianName: "Mula", westernName: "Zeta² Scorpii", nodeId: "mula", constellation: "Nakshatra" },
  { id: "eta-scorpii", ra: 17.2026, dec: -43.2392, mag: 3.33, indianName: "Mula", westernName: "Eta Scorpii", nodeId: "mula", constellation: "Nakshatra" },
  { id: "theta-scorpii", ra: 17.622, dec: -42.9978, mag: 1.84, indianName: "Mula", westernName: "Sargas (θ Scorpii)", nodeId: "mula", constellation: "Nakshatra" },
  { id: "iota1-scorpii", ra: 17.7931, dec: -40.127, mag: 3.03, indianName: "Mula", westernName: "Iota¹ Scorpii", nodeId: "mula", constellation: "Nakshatra" },
  { id: "kappa-scorpii", ra: 17.7081, dec: -39.0299, mag: 2.39, indianName: "Mula", westernName: "Girtab (κ Scorpii)", nodeId: "mula", constellation: "Nakshatra" },
  { id: "upsilon-scorpii", ra: 17.5127, dec: -37.2958, mag: 2.7, indianName: "Mula", westernName: "Lesath (υ Scorpii)", nodeId: "mula", constellation: "Nakshatra" },
];

// Shravana: the existing yogatara Altair flanked by Tarazed (north) and
// Alshain (south) -- the real "head of Aquila" triad. See
// docs/research/shravana-asterism-sources.md.
export const SHRAVANA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "gamma-aquilae", ra: 19.771, dec: 10.6133, mag: 2.71, indianName: "Shravana", westernName: "Tarazed (γ Aquilae)", nodeId: "shravana", constellation: "Nakshatra" },
  { id: "beta-aquilae", ra: 19.9219, dec: 6.4068, mag: 3.87, indianName: "Shravana", westernName: "Alshain (β Aquilae)", nodeId: "shravana", constellation: "Nakshatra" },
];

// Dhanishta: the existing yogatara Beta Delphini (Rotanev) plus Alpha
// (Sualocin), Gamma, and Delta Delphini -- the compact rhombus/"Job's
// Coffin" shape. See docs/research/dhanishta-asterism-sources.md.
export const DHANISHTA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "alpha-delphini", ra: 20.6606, dec: 15.9121, mag: 3.77, indianName: "Dhanishta", westernName: "Sualocin (α Delphini)", nodeId: "dhanishta", constellation: "Nakshatra" },
  { id: "gamma-delphini", ra: 20.7776, dec: 16.1243, mag: 4.36, indianName: "Dhanishta", westernName: "Gamma Delphini", nodeId: "dhanishta", constellation: "Nakshatra" },
  { id: "delta-delphini", ra: 20.7243, dec: 15.0746, mag: 4.43, indianName: "Dhanishta", westernName: "Delta Delphini", nodeId: "dhanishta", constellation: "Nakshatra" },
];

// Sixth (final) asterism batch: Shatabhisha, Purva Bhadrapada, Uttara
// Bhadrapada, Revati -- this completes all 27 nakshatras. Shatabhisha is
// a deliberate exception, same reasoning as Ardra/Swati: its classical
// symbol is an abstract "hundred stars/empty circle" with no traditionally
// documented small companion grouping, so there's no
// SHATABHISHA_EXTRA_STARS group; see
// docs/research/shatabhisha-asterism-sources.md.

// Purva Bhadrapada: the existing yogatara Markab plus Scheat -- the
// western pair of corners of the Great Square of Pegasus. See
// docs/research/purva-bhadrapada-asterism-sources.md.
export const PURVA_BHADRAPADA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "scheat", ra: 23.0629, dec: 28.0828, mag: 2.42, indianName: "Purva Bhadrapada", westernName: "Scheat (β Pegasi)", nodeId: "purva-bhadrapada", constellation: "Nakshatra" },
];

// Uttara Bhadrapada: the existing yogatara Algenib plus Alpheratz -- the
// eastern pair of corners of the same Great Square of Pegasus (split
// across these two adjacent nakshatras). See
// docs/research/uttara-bhadrapada-asterism-sources.md.
export const UTTARA_BHADRAPADA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "alpheratz", ra: 0.1398, dec: 29.0904, mag: 2.06, indianName: "Uttara Bhadrapada", westernName: "Alpheratz (α Andromedae)", nodeId: "uttara-bhadrapada", constellation: "Nakshatra" },
];

// Revati: the existing yogatara Zeta Piscium plus its documented near
// neighbour Mu Piscium, at the end of the western fish's tail. See
// docs/research/revati-asterism-sources.md.
export const REVATI_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "mu-piscium", ra: 1.5031, dec: 6.1439, mag: 4.84, indianName: "Revati", westernName: "Mu Piscium", nodeId: "revati", constellation: "Nakshatra" },
];

// Seventh asterism batch: Hasta, Chitra, Vishakha, Purva Ashadha. Chitra
// is a deliberate exception, same reasoning as Ardra/Swati/Shatabhisha:
// it's one of the nakshatras explicitly documented as "represented by a
// single star" with no traditional companion, so there's no
// CHITRA_EXTRA_STARS group; see docs/research/chitra-asterism-sources.md.

// Hasta: the existing yogatara Algorab plus the rest of the naked-eye
// Corvus asterism -- Alpha (Alchiba), Beta (Kraz), Gamma (Gienah),
// Epsilon (Minkar) Corvi, "the five fingers of an open hand." See
// docs/research/hasta-asterism-sources.md.
export const HASTA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "alpha-corvi", ra: 12.1402, dec: -24.7289, mag: 4.03, indianName: "Hasta", westernName: "Alchiba (α Corvi)", nodeId: "hasta", constellation: "Nakshatra" },
  { id: "beta-corvi", ra: 12.5731, dec: -23.3968, mag: 2.65, indianName: "Hasta", westernName: "Kraz (β Corvi)", nodeId: "hasta", constellation: "Nakshatra" },
  { id: "gamma-corvi", ra: 12.2634, dec: -17.5419, mag: 2.59, indianName: "Hasta", westernName: "Gienah (γ Corvi)", nodeId: "hasta", constellation: "Nakshatra" },
  { id: "epsilon-corvi", ra: 12.1687, dec: -22.6198, mag: 3.02, indianName: "Hasta", westernName: "Minkar (ε Corvi)", nodeId: "hasta", constellation: "Nakshatra" },
];

// Vishakha: the existing yogatara Zubenelgenubi plus Beta, Gamma, and
// Iota Librae -- the "pylon" of four stars spanning Libra. See
// docs/research/vishakha-asterism-sources.md.
export const VISHAKHA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "beta-librae", ra: 15.2835, dec: -9.3829, mag: 2.61, indianName: "Vishakha", westernName: "Zubeneschamali (β Librae)", nodeId: "vishakha", constellation: "Nakshatra" },
  { id: "gamma-librae", ra: 15.5921, dec: -14.7896, mag: 3.91, indianName: "Vishakha", westernName: "Zubenelakrab (γ Librae)", nodeId: "vishakha", constellation: "Nakshatra" },
  { id: "iota-librae", ra: 15.2037, dec: -19.7917, mag: 4.54, indianName: "Vishakha", westernName: "Iota¹ Librae", nodeId: "vishakha", constellation: "Nakshatra" },
];

// Purva Ashadha: the existing yogatara Kaus Media plus Kaus Borealis
// (north) and Kaus Australis (south) -- the three "Kaus" stars marking
// the Archer's bow. See docs/research/purva-ashadha-asterism-sources.md.
export const PURVA_ASHADHA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "epsilon-sagittarii", ra: 18.4029, dec: -34.3846, mag: 1.85, indianName: "Purva Ashadha", westernName: "Kaus Australis (ε Sagittarii)", nodeId: "purva-ashadha", constellation: "Nakshatra" },
  { id: "lambda-sagittarii", ra: 18.4662, dec: -25.4217, mag: 2.81, indianName: "Purva Ashadha", westernName: "Kaus Borealis (λ Sagittarii)", nodeId: "purva-ashadha", constellation: "Nakshatra" },
];

// Ninth (final) asterism batch: Bharani, Purva Phalguni, Uttara Phalguni,
// Anuradha, Uttara Ashadha -- completes all 27 nakshatras. Requested
// alongside Ardra/Punarvasu/Pushya, which were already done in an
// earlier batch (see git log) -- this batch is only the genuinely
// remaining gaps.

// Bharani: the existing yogatara 41 Arietis plus 35 and 39 Arietis, the
// real three-star triangle. See docs/research/bharani-asterism-sources.md.
export const BHARANI_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "35-arietis", ra: 2.7242, dec: 27.7071, mag: 4.64, indianName: "Bharani", westernName: "35 Arietis", nodeId: "bharani", constellation: "Nakshatra" },
  { id: "39-arietis", ra: 2.7985, dec: 29.2471, mag: 4.51, indianName: "Bharani", westernName: "39 Arietis", nodeId: "bharani", constellation: "Nakshatra" },
];

// Purva Phalguni: the existing yogatara Zosma plus Theta Leonis
// (Chertan). See docs/research/purva-phalguni-asterism-sources.md.
export const PURVA_PHALGUNI_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "theta-leonis", ra: 11.2373, dec: 15.4296, mag: 3.32, indianName: "Purva Phalguni", westernName: "Chertan (θ Leonis)", nodeId: "purva-phalguni", constellation: "Nakshatra" },
];

// Uttara Phalguni: the existing yogatara Denebola plus 93 Leonis. See
// docs/research/uttara-phalguni-asterism-sources.md.
export const UTTARA_PHALGUNI_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "93-leonis", ra: 11.7998, dec: 20.2189, mag: 4.52, indianName: "Uttara Phalguni", westernName: "93 Leonis", nodeId: "uttara-phalguni", constellation: "Nakshatra" },
];

// Anuradha: the existing yogatara Dschubba flanked by Beta Scorpii
// (north) and Pi Scorpii (south) -- the real three-star "staff" line.
// See docs/research/anuradha-asterism-sources.md.
export const ANURADHA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "beta-scorpii", ra: 16.0906, dec: -19.8055, mag: 2.62, indianName: "Anuradha", westernName: "Graffias / Acrab (β Scorpii)", nodeId: "anuradha", constellation: "Nakshatra" },
  { id: "pi-scorpii", ra: 15.9808, dec: -26.1141, mag: 2.89, indianName: "Anuradha", westernName: "π Scorpii", nodeId: "anuradha", constellation: "Nakshatra" },
];

// Uttara Ashadha: the existing yogatara Nunki plus Ascella. See
// docs/research/uttara-ashadha-asterism-sources.md.
export const UTTARA_ASHADHA_EXTRA_STARS: SkyCatalogStar[] = [
  { id: "zeta-sagittarii", ra: 19.0435, dec: -29.8801, mag: 2.59, indianName: "Uttara Ashadha", westernName: "Ascella (ζ Sagittarii)", nodeId: "uttara-ashadha", constellation: "Nakshatra" },
];

export const BRIGHT_STARS: SkyCatalogStar[] = [
  { id: "sirius", ra: 6.753, dec: -16.716, mag: -1.46, westernName: "Sirius" },
  { id: "canopus", ra: 6.399, dec: -52.696, mag: -0.74, westernName: "Canopus" },
  { id: "rigil-kentaurus", ra: 14.66, dec: -60.834, mag: -0.27, westernName: "Rigil Kentaurus" },
  { id: "vega", ra: 18.616, dec: 38.784, mag: 0.03, westernName: "Vega" },
  { id: "capella", ra: 5.278, dec: 45.998, mag: 0.08, westernName: "Capella" },
  { id: "rigel", ra: 5.242, dec: -8.202, mag: 0.13, westernName: "Rigel" },
  { id: "procyon", ra: 7.655, dec: 5.225, mag: 0.34, westernName: "Procyon" },
  { id: "achernar", ra: 1.629, dec: -57.237, mag: 0.46, westernName: "Achernar" },
  { id: "hadar", ra: 14.064, dec: -60.373, mag: 0.61, westernName: "Hadar" },
  { id: "acrux", ra: 12.443, dec: -63.099, mag: 0.77, westernName: "Acrux" },
  { id: "mimosa", ra: 12.795, dec: -59.689, mag: 1.25, westernName: "Mimosa" },
  { id: "fomalhaut", ra: 22.961, dec: -29.622, mag: 1.16, westernName: "Fomalhaut" },
  { id: "deneb", ra: 20.69, dec: 45.28, mag: 1.25, westernName: "Deneb" },
  { id: "bellatrix", ra: 5.419, dec: 6.35, mag: 1.64, westernName: "Bellatrix" },
  { id: "elnath", ra: 5.438, dec: 28.608, mag: 1.65, westernName: "Elnath" },
  { id: "alnilam", ra: 5.604, dec: -1.202, mag: 1.69, westernName: "Alnilam" },
  { id: "alnitak", ra: 5.679, dec: -1.943, mag: 1.74, westernName: "Alnitak" },
  { id: "mintaka", ra: 5.533, dec: -0.299, mag: 2.41, westernName: "Mintaka" },
  { id: "alphard", ra: 9.46, dec: -8.659, mag: 1.98, westernName: "Alphard" },
  { id: "hamal", ra: 2.12, dec: 23.462, mag: 2.0, westernName: "Hamal" },
  { id: "mirfak", ra: 3.405, dec: 49.861, mag: 1.79, westernName: "Mirfak" },
  { id: "kaus-australis", ra: 18.403, dec: -34.385, mag: 1.85, westernName: "Kaus Australis" },
  { id: "alnair", ra: 22.137, dec: -46.961, mag: 1.74, westernName: "Alnair" },
  { id: "peacock", ra: 20.428, dec: -56.735, mag: 1.94, westernName: "Peacock" },
];

export const STAR_CATALOG: SkyCatalogStar[] = [
  DHRUVA_STAR,
  ...SAPTARISHI_STARS,
  ...NAKSHATRA_STARS,
  ...MRIGASHIRA_EXTRA_STARS,
  ...HYADES_EXTRA_STARS,
  ...PLEIADES_EXTRA_STARS,
  ...URSA_MINOR_CONTEXT_STARS,
  ...ASHWINI_EXTRA_STARS,
  ...MAGHA_EXTRA_STARS,
  ...JYESHTHA_EXTRA_STARS,
  ...PUNARVASU_EXTRA_STARS,
  ...PUSHYA_EXTRA_STARS,
  ...ASHLESHA_EXTRA_STARS,
  ...MULA_EXTRA_STARS,
  ...SHRAVANA_EXTRA_STARS,
  ...DHANISHTA_EXTRA_STARS,
  ...PURVA_BHADRAPADA_EXTRA_STARS,
  ...UTTARA_BHADRAPADA_EXTRA_STARS,
  ...REVATI_EXTRA_STARS,
  ...HASTA_EXTRA_STARS,
  ...VISHAKHA_EXTRA_STARS,
  ...PURVA_ASHADHA_EXTRA_STARS,
  ...BHARANI_EXTRA_STARS,
  ...PURVA_PHALGUNI_EXTRA_STARS,
  ...UTTARA_PHALGUNI_EXTRA_STARS,
  ...ANURADHA_EXTRA_STARS,
  ...UTTARA_ASHADHA_EXTRA_STARS,
  ...BRIGHT_STARS,
];
