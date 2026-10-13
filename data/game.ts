export type Synergy = {
  id: string;
  name: string;
  type: "faction" | "role";
  breakpoints: number[];
  description: string;
};

export type Hero = {
  id: string;
  name: string;
  cost: number;
  synergies: string[];
  range: number; // 1 = melee, 2+ = ranged
  role: string;
};

export const SYNERGIES: Synergy[] = [
  {
    id: "echomancer",
    name: "Echomancer",
    type: "faction",
    breakpoints: [2, 4, 6],
    description: "Season 7 tech line. Echoes bonus damage as the battle goes on.",
  },
  {
    id: "starbelle",
    name: "Starbelle",
    type: "faction",
    breakpoints: [2, 4, 6],
    description: "Starbelle heroes charm and burst with stellar damage.",
  },
  {
    id: "spectre",
    name: "SPECTRE",
    type: "faction",
    breakpoints: [2, 4, 6],
    description: "2-star each SPECTRE hero to unlock the next, up to 7-gold Alpha.",
  },
  {
    id: "mistbender",
    name: "Mistbender",
    type: "faction",
    breakpoints: [1, 3],
    description: "Mist shields and magic shred — active with just one.",
  },
  {
    id: "dragon-altar",
    name: "Dragon Altar",
    type: "faction",
    breakpoints: [2, 4, 6],
    description: "Generates bonus tiles. Heroes on them gain damage + hybrid DEF.",
  },
  {
    id: "shadeweaver",
    name: "Shadeweaver",
    type: "faction",
    breakpoints: [2, 3],
    description: "Sends a wave down the column, buffing allies and hitting enemies.",
  },
  {
    id: "astro-power",
    name: "Astro Power",
    type: "faction",
    breakpoints: [2, 4, 6],
    description: "Extra damage. Most-equipped hero gains damage + hybrid lifesteal.",
  },
  {
    id: "kishin",
    name: "Kishin",
    type: "faction",
    breakpoints: [2, 4, 6],
    description: "Kishin burst line, pairs with Phasewarper.",
  },
  {
    id: "marksman",
    name: "Marksman",
    type: "role",
    breakpoints: [2, 4, 6],
    description: "Attack speed + enemy DEF shred. Backline carries.",
  },
  {
    id: "mage",
    name: "Mage",
    type: "role",
    breakpoints: [2, 4, 6],
    description: "Team magic attack up, mages gain more. Burst comp core.",
  },
  {
    id: "defender",
    name: "Defender",
    type: "role",
    breakpoints: [2, 4, 6],
    description: "Flat physical + magic defense frontline.",
  },
  {
    id: "weapon-master",
    name: "Weapon Master",
    type: "role",
    breakpoints: [2, 4, 6],
    description: "Hybrid lifesteal for team, more for Weapon Masters.",
  },
  {
    id: "dauntless",
    name: "Dauntless",
    type: "role",
    breakpoints: [2, 4, 6],
    description: "Shields and frontline sustain.",
  },
  {
    id: "stargazer",
    name: "Stargazer",
    type: "role",
    breakpoints: [2, 4, 6],
    description: "Mana regen — one fed caster ults almost nonstop.",
  },
  {
    id: "enchanted-tales",
    name: "Enchanted Tales",
    type: "role",
    breakpoints: [2, 4],
    description: "Enchanted burst line — pairs with Mage and Defender.",
  },
  {
    id: "swiftblade",
    name: "Swiftblade",
    type: "role",
    breakpoints: [2, 4, 6],
    description: "Crit + attack speed duelists.",
  },
  {
    id: "phasewarper",
    name: "Phasewarper",
    type: "role",
    breakpoints: [2, 3],
    description: "Mobility + reposition burst.",
  },
];

export const HEROES: Hero[] = [
  {
    id: "melissa",
    name: "Melissa",
    cost: 5,
    synergies: ["shadeweaver", "marksman"],
    range: 4,
    role: "carry",
  },
  { id: "fanny", name: "Fanny", cost: 5, synergies: ["starbelle", "swiftblade"], range: 1, role: "carry" },
  { id: "baxia", name: "Baxia", cost: 5, synergies: ["dragon-altar", "defender"], range: 1, role: "tank" },
  {
    id: "thamuz",
    name: "Thamuz",
    cost: 5,
    synergies: ["echomancer", "weapon-master"],
    range: 1,
    role: "tank",
  },
  { id: "odette", name: "Odette", cost: 5, synergies: ["astro-power", "mage"], range: 4, role: "carry" },
  {
    id: "lancelot",
    name: "Lancelot",
    cost: 5,
    synergies: ["kishin", "phasewarper"],
    range: 1,
    role: "carry",
  },
  { id: "alice", name: "Alice", cost: 5, synergies: ["spectre", "dauntless"], range: 2, role: "burst" },
  { id: "alpha", name: "Alpha", cost: 7, synergies: ["spectre"], range: 1, role: "carry" },
  { id: "nana", name: "Nana", cost: 5, synergies: ["mistbender", "stargazer"], range: 4, role: "support" },
  {
    id: "irithel",
    name: "Irithel",
    cost: 4,
    synergies: ["astro-power", "marksman"],
    range: 4,
    role: "carry",
  },
  { id: "lunox", name: "Lunox", cost: 4, synergies: ["kishin", "stargazer"], range: 4, role: "support" },
  { id: "vexana", name: "Vexana", cost: 4, synergies: ["enchanted-tales", "mage"], range: 4, role: "carry" },
  { id: "gord", name: "Gord", cost: 4, synergies: ["spectre", "mage"], range: 4, role: "carry" },
  { id: "wanwan", name: "Wanwan", cost: 3, synergies: ["dragon-altar", "marksman"], range: 4, role: "carry" },
  { id: "tigreal", name: "Tigreal", cost: 3, synergies: ["echomancer", "defender"], range: 1, role: "tank" },
  { id: "franco", name: "Franco", cost: 3, synergies: ["kishin", "dauntless"], range: 1, role: "tank" },
  { id: "kadita", name: "Kadita", cost: 3, synergies: ["shadeweaver", "mage"], range: 4, role: "burst" },
  {
    id: "karina",
    name: "Karina",
    cost: 3,
    synergies: ["astro-power", "swiftblade"],
    range: 1,
    role: "carry",
  },
  { id: "miya", name: "Miya", cost: 2, synergies: ["starbelle", "marksman"], range: 4, role: "carry" },
  { id: "hylos", name: "Hylos", cost: 2, synergies: ["shadeweaver", "defender"], range: 1, role: "tank" },
  { id: "granger", name: "Granger", cost: 2, synergies: ["spectre", "marksman"], range: 4, role: "carry" },
  { id: "vale", name: "Vale", cost: 1, synergies: ["echomancer", "mage"], range: 4, role: "support" },
];

export const heroById = (id: string) => HEROES.find((h) => h.id === id);
export const synergyById = (id: string) => SYNERGIES.find((s) => s.id === id);

export type Commander = {
  id: string;
  name: string;
  tier: "S" | "A" | "B";
  skill: string;
  tip: string;
  img: string;
};

export const COMMANDERS: Commander[] = [
  {
    id: "minotaur",
    name: "Minotaur",
    tier: "S",
    skill: "Safety-net sustain + team shields",
    tip: " default climb pick — forgiving while you learn econ.",
    img: "/heroes/minotaur.png",
  },
  {
    id: "nana",
    name: "Nana",
    tier: "S",
    skill: "Stargazer / roll support",
    tip: " best with Mage + Stargazer — rush Vexana 2★.",
    img: "/heroes/nana.png",
  },
  {
    id: "brody",
    name: "Brody",
    tier: "S",
    skill: "Converts spare heroes into value",
    tip: " new S7 — hold pairs, let Brody fund your roll.",
    img: "/heroes/brody.png",
  },
  {
    id: "franco",
    name: "Franco",
    tier: "A",
    skill: "Plunderer's Claw hooks nearest enemy",
    tip: " vs Franco: keep carry CENTER back, not edge.",
    img: "/heroes/franco.png",
  },
  {
    id: "ling-duel",
    name: "Ling",
    tier: "A",
    skill: "Dueling Ring pulls farthest hero",
    tip: " vs Ling: leave back corner empty or park a tank there.",
    img: "/heroes/ling.png",
  },
  {
    id: "angela",
    name: "Angela",
    tier: "A",
    skill: "Early-mid tempo buffs",
    tip: " camp mid early, pull once backline is set.",
    img: "/heroes/angela.png",
  },
];

export const COST_COLORS: Record<number, string> = {
  1: "border-zinc-400",
  2: "border-emerald-500",
  3: "border-sky-500",
  4: "border-violet-500",
  5: "border-amber-400",
  7: "border-rose-500",
};

export const PRESETS: { name: string; desc: string; tiles: Record<number, string> }[] = [
  {
    name: "Marksman / Dauntless",
    desc: "Default climb. Dauntless front, marksmen back.",
    tiles: {
      1: "tigreal",
      2: "franco",
      5: "baxia",
      6: "alice",
      17: "miya",
      18: "wanwan",
      21: "irithel",
      22: "melissa",
    },
  },
  {
    name: "Mage + Echomancer",
    desc: "Mage burst with an echo front and Stargazer support.",
    tiles: {
      1: "tigreal",
      2: "thamuz",
      17: "vale",
      18: "kadita",
      24: "gord",
      25: "vexana",
      26: "odette",
      27: "nana",
    },
  },
  {
    name: "SPECTRE → Alpha",
    desc: "2-star each SPECTRE to climb to 7-gold Alpha.",
    tiles: { 1: "hylos", 3: "alpha", 10: "alice", 25: "granger", 26: "gord", 27: "melissa" },
  },
];
