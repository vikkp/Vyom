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
  { id: "castor", ra: 7.577, dec: 31.888, mag: 1.58, westernName: "Castor" },
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

export const STAR_CATALOG: SkyCatalogStar[] = [DHRUVA_STAR, ...SAPTARISHI_STARS, ...NAKSHATRA_STARS, ...BRIGHT_STARS];
