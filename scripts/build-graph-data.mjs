// Generates src/data/graph.json — the v1 launch graph for Vyom, per ADR0001 decisions 3 & 4.
// Run with: node scripts/build-graph-data.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nodes = [];
const edges = [];
let edgeId = 0;
const addEdge = (source, target, type, label) => {
  edges.push({ id: `e${++edgeId}`, source, target, type, label });
};

// ---------------------------------------------------------------------------
// Dhruva Tārā — the fixed centre of the whole experience (ADR0001 decision 2)
// ---------------------------------------------------------------------------
nodes.push({
  id: "dhruva-tara",
  type: "celestial",
  group: "center",
  name: "Dhruva Tārā",
  sanskrit: "ध्रुव तारा",
  summary: "The Pole Star (Polaris). The fixed point in the night sky around which all other stars appear to turn.",
});

// ---------------------------------------------------------------------------
// Trimurti
// ---------------------------------------------------------------------------
nodes.push(
  { id: "brahma", type: "deity", group: "trimurti", name: "Brahma", sanskrit: "ब्रह्मा", summary: "The Creator, first of the Trimurti." },
  { id: "vishnu", type: "deity", group: "trimurti", name: "Vishnu", sanskrit: "विष्णु", summary: "The Preserver, second of the Trimurti." },
  { id: "shiva", type: "deity", group: "trimurti", name: "Shiva", sanskrit: "शिव", summary: "The Destroyer/Transformer, third of the Trimurti." },
);

// ---------------------------------------------------------------------------
// Saptarishi — the Seven Sages of the current Manvantara
// ---------------------------------------------------------------------------
const saptarishi = [
  ["atri", "Atri", "अत्रि"],
  ["bharadvaja", "Bharadvaja", "भरद्वाज"],
  ["gautama", "Gautama", "गौतम"],
  ["jamadagni", "Jamadagni", "जमदग्नि"],
  ["kashyapa", "Kashyapa", "कश्यप"],
  ["vashishtha", "Vashishtha", "वशिष्ठ"],
  ["vishvamitra", "Vishvamitra", "विश्वामित्र"],
];
for (const [id, name, sanskrit] of saptarishi) {
  nodes.push({ id, type: "sage", group: "saptarishi", name, sanskrit, summary: `One of the Saptarishi (Seven Sages) of the current Manvantara, represented among the stars of Ursa Major.` });
  addEdge(id, "dhruva-tara", "astronomical-association", "part of the navigable ring around Dhruva Tārā");
}

// Progenitor lineage: Brahma -> Marichi -> Kashyapa
nodes.push({ id: "marichi", type: "sage", group: "progenitor", name: "Marichi", sanskrit: "मरीचि", summary: "Mind-born son of Brahma; father of Kashyapa." });
addEdge("brahma", "marichi", "parent", "mind-born son");
addEdge("marichi", "kashyapa", "parent", undefined);

nodes.push({ id: "aditi", type: "deity", group: "aditya", name: "Aditi", sanskrit: "अदिति", summary: "Mother of the Adityas; consort of Kashyapa." });
addEdge("kashyapa", "aditi", "spouse", undefined);

// ---------------------------------------------------------------------------
// Nakshatra deities (only ones not already defined above)
// ---------------------------------------------------------------------------
const deities = {
  "ashwini-kumaras": ["Ashwini Kumaras", "अश्विनीकुमारौ", "Twin horse-headed physician gods of the Devas."],
  yama: ["Yama", "यम", "God of death and dharma; judge of the dead."],
  agni: ["Agni", "अग्नि", "God of fire, the divine messenger between humans and gods."],
  chandra: ["Chandra", "चन्द्र", "God of the Moon, also known as Soma."],
  rudra: ["Rudra", "रुद्र", "Fierce storm form of Shiva."],
  brihaspati: ["Brihaspati", "बृहस्पति", "Guru of the Devas, god of wisdom and speech."],
  sarpa: ["Sarpa", "सर्प", "The serpent deity, associated with the Nagas."],
  pitris: ["Pitris", "पितृ", "The divine ancestors."],
  bhaga: ["Bhaga", "भग", "Aditya of prosperity, marital bliss and good fortune."],
  aryaman: ["Aryaman", "अर्यमन्", "Aditya of contracts, honour and unions."],
  savitar: ["Savitar", "सवितृ", "Aditya of the sun before sunrise, the impeller."],
  vishvakarma: ["Vishvakarma", "विश्वकर्मा", "Divine architect and craftsman of the gods."],
  vayu: ["Vayu", "वायु", "God of wind and breath."],
  indra: ["Indra", "इन्द्र", "King of the Devas, wielder of the vajra."],
  mitra: ["Mitra", "मित्र", "Aditya of friendship, contracts and covenants."],
  nirriti: ["Nirriti", "निर्ऋति", "Goddess of dissolution and destruction."],
  apah: ["Apah", "आपः", "Deity of the cosmic waters."],
  vishvadevas: ["Vishvadevas", "विश्वेदेवाः", "The collective of Universal Gods."],
  vasu: ["Ashta Vasu", "अष्टवसु", "The eight elemental gods of natural phenomena."],
  varuna: ["Varuna", "वरुण", "God of cosmic and earthly waters, keeper of cosmic order."],
  "aja-ekapada": ["Aja Ekapada", "अज एकपाद", "The one-footed goat, a fierce form associated with lightning."],
  ahirbudhnya: ["Ahirbudhnya", "अहिर्बुध्न्य", "The serpent of the deep, guardian of hidden wisdom."],
  pushan: ["Pushan", "पूषन्", "Aditya who nourishes and protects travellers and animals."],
};
for (const [id, [name, sanskrit, summary]] of Object.entries(deities)) {
  nodes.push({ id, type: "deity", group: "nakshatra-deity", name, sanskrit, summary });
}
addEdge("rudra", "shiva", "form-of", "fierce form of Shiva");

// Adityas — children of Kashyapa and Aditi (key progenitors, ADR0001 decision 4)
for (const child of ["indra", "mitra", "aryaman", "bhaga", "varuna", "pushan", "savitar"]) {
  addEdge("kashyapa", child, "parent", "Aditya");
  addEdge("aditi", child, "parent", "Aditya");
}

// ---------------------------------------------------------------------------
// The 27 Nakshatras
// ---------------------------------------------------------------------------
const nakshatras = [
  ["ashwini", "Ashwini", "अश्विनी", "ashwini-kumaras", "Horse's head", "The healer — swift beginnings and new starts."],
  ["bharani", "Bharani", "भरणी", "yama", "Yoni (womb)", "The bearer — restraint, transformation and the boundary of life."],
  ["krittika", "Krittika", "कृत्तिका", "agni", "Razor / flame", "The cutter — sharp purification and burning away illusion."],
  ["rohini", "Rohini", "रोहिणी", "brahma", "Ox-cart / chariot", "The ascender — growth, fertility and creative beauty."],
  ["mrigashira", "Mrigashira", "मृगशिरा", "chandra", "Deer's head", "The searcher — gentle curiosity and quiet pursuit."],
  ["ardra", "Ardra", "आर्द्रा", "rudra", "Teardrop / gem", "The moist one — storms that clear the way for renewal."],
  ["punarvasu", "Punarvasu", "पुनर्वसु", "aditi", "Bow and quiver", "The return of the light — renewal after hardship."],
  ["pushya", "Pushya", "पुष्य", "brihaspati", "Lotus / cow's udder", "The nourisher — the most auspicious of the Nakshatras."],
  ["ashlesha", "Ashlesha", "आश्लेषा", "sarpa", "Coiled serpent", "The embracer — hypnotic wisdom and hidden intent."],
  ["magha", "Magha", "मघा", "pitris", "Royal throne", "The mighty one — ancestry, legacy and inherited power."],
  ["purva-phalguni", "Purva Phalguni", "पूर्वाफाल्गुनी", "bhaga", "Front legs of a bed", "The former reddish one — pleasure, rest and good fortune."],
  ["uttara-phalguni", "Uttara Phalguni", "उत्तराफाल्गुनी", "aryaman", "Back legs of a bed", "The latter reddish one — bonds of friendship and patronage."],
  ["hasta", "Hasta", "हस्त", "savitar", "The hand", "The hand — skill, craft and the power to grasp opportunity."],
  ["chitra", "Chitra", "चित्रा", "vishvakarma", "Bright jewel", "The brilliant one — artistry and divine craftsmanship."],
  ["swati", "Swati", "स्वाती", "vayu", "Young shoot swaying in the wind", "The independent one — movement, trade and self-reliance."],
  ["vishakha", "Vishakha", "विशाखा", "indra", "Triumphal archway", "The forked branch — determined pursuit of a goal."],
  ["anuradha", "Anuradha", "अनुराधा", "mitra", "Triumphal archway / lotus", "The follower of Radha — devotion, friendship and success through cooperation."],
  ["jyeshtha", "Jyeshtha", "ज्येष्ठा", "indra", "Circular amulet / umbrella", "The eldest — seniority, protection and quiet authority."],
  ["mula", "Mula", "मूल", "nirriti", "Bundle of roots", "The root — getting to the foundation by uprooting what came before."],
  ["purva-ashadha", "Purva Ashadha", "पूर्वाषाढा", "apah", "Elephant tusk / fan", "The former invincible one — early, unstoppable conviction."],
  ["uttara-ashadha", "Uttara Ashadha", "उत्तराषाढा", "vishvadevas", "Elephant tusk / planks of a bed", "The latter invincible one — lasting victory earned through universal support."],
  ["shravana", "Shravana", "श्रवण", "vishnu", "Ear / three footprints", "The listener — learning, memory and connection through hearing."],
  ["dhanishta", "Dhanishta", "धनिष्ठा", "vasu", "Drum", "The wealthiest — rhythm, prosperity and celebration."],
  ["shatabhisha", "Shatabhisha", "शतभिषा", "varuna", "Empty circle / a hundred stars", "The hundred healers — mystery, healing and cosmic law."],
  ["purva-bhadrapada", "Purva Bhadrapada", "पूर्वाभाद्रपदा", "aja-ekapada", "Front legs of a funeral cot", "The former auspicious feet — intense transformation through fire."],
  ["uttara-bhadrapada", "Uttara Bhadrapada", "उत्तराभाद्रपदा", "ahirbudhnya", "Back legs of a funeral cot", "The latter auspicious feet — deep wisdom held in stillness."],
  ["revati", "Revati", "रेवती", "pushan", "Fish", "The wealthy wanderer — safe passage and nourishment at the journey's end."],
];
for (const [id, name, sanskrit, deityId, symbol, summary] of nakshatras) {
  nodes.push({ id, type: "nakshatra", group: "nakshatra", name, sanskrit, symbol, summary });
  const deityLabel =
    id === "rohini"
      ? "presiding deity (also identified as Prajapati in this role)"
      : id === "vishakha"
        ? "co-presiding deity (Indra-Agni, dual)"
        : "presiding deity";
  addEdge(deityId, id, "astronomical-association", deityLabel);
  addEdge(id, "dhruva-tara", "astronomical-association", "part of the navigable ring around Dhruva Tārā");
}

// Vishakha's second co-presiding deity: Indra-Agni is a dual deity in the
// Taittiriya Samhita and virtually all subsequent Jyotish sources — Agni is
// not dropped just because it already presides over Krittika (senior review,
// 2026-08-10: "Do not simplify" to Indra alone).
addEdge("agni", "vishakha", "astronomical-association", "co-presiding deity (Indra-Agni, dual)");

// ---------------------------------------------------------------------------
// Dhruva family
// ---------------------------------------------------------------------------
nodes.push(
  { id: "swayambhuva-manu", type: "character", group: "dhruva-family", name: "Swayambhuva Manu", sanskrit: "स्वायम्भुव मनु", summary: "The first Manu; Dhruva's grandfather." },
  { id: "shatarupa", type: "character", group: "dhruva-family", name: "Shatarupa", sanskrit: "शतरूपा", summary: "Consort of Swayambhuva Manu; Dhruva's grandmother." },
  { id: "uttanapada", type: "character", group: "dhruva-family", name: "Uttanapada", sanskrit: "उत्तानपाद", summary: "King, son of Swayambhuva Manu; Dhruva's father." },
  { id: "suniti", type: "character", group: "dhruva-family", name: "Suniti", sanskrit: "सुनीति", summary: "Elder queen of Uttanapada; Dhruva's mother." },
  { id: "suruchi", type: "character", group: "dhruva-family", name: "Suruchi", sanskrit: "सुरुचि", summary: "Younger, favoured queen of Uttanapada; Uttama's mother." },
  { id: "uttama", type: "character", group: "dhruva-family", name: "Uttama", sanskrit: "उत्तम", summary: "Son of Suruchi; Dhruva's half-brother." },
  { id: "dhruva", type: "character", group: "dhruva-family", name: "Dhruva", sanskrit: "ध्रुव", summary: "Prince who, through penance, was granted an unmoving place in the sky by Vishnu." },
  { id: "narada", type: "character", group: "dhruva-family", name: "Narada", sanskrit: "नारद", summary: "Celestial sage who guided young Dhruva toward his penance." },
);

addEdge("swayambhuva-manu", "shatarupa", "spouse", undefined);
addEdge("swayambhuva-manu", "uttanapada", "parent", undefined);
addEdge("shatarupa", "uttanapada", "parent", undefined);
addEdge("uttanapada", "suniti", "spouse", undefined);
addEdge("uttanapada", "suruchi", "spouse", undefined);
addEdge("suniti", "dhruva", "parent", undefined);
addEdge("suruchi", "uttama", "parent", undefined);
addEdge("uttama", "dhruva", "sibling", "half-brother");

// ---------------------------------------------------------------------------
// Story event: Dhruva's Penance
// ---------------------------------------------------------------------------
nodes.push({
  id: "dhruva-penance",
  type: "story-event",
  group: "story",
  name: "Dhruva's Penance",
  sanskrit: undefined,
  summary: "Wounded by Suruchi's rejection, Dhruva undertakes fierce penance in the forest, guided by Narada, until Vishnu grants him an eternal place in the heavens.",
});
addEdge("suruchi", "dhruva-penance", "story-link", "rejection that sparked the penance");
addEdge("narada", "dhruva-penance", "guru", "guided Dhruva's practice");
addEdge("dhruva", "dhruva-penance", "story-link", undefined);
addEdge("vishnu", "dhruva-penance", "story-link", "granted the boon");
addEdge("vishnu", "dhruva", "boon", "granted Dhruva an unmoving, eternal place in the sky");
addEdge("dhruva", "dhruva-tara", "transformation", "became the pole star");

// ---------------------------------------------------------------------------
mkdirSync(join(__dirname, "..", "src", "data"), { recursive: true });
writeFileSync(
  join(__dirname, "..", "src", "data", "graph.json"),
  JSON.stringify({ nodes, edges }, null, 2) + "\n",
);

console.log(`Wrote ${nodes.length} nodes and ${edges.length} edges.`);
