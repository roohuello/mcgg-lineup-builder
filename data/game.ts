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
  synergies: [string, string];
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
    breakpoints: [2, 3, 4],
    description: "2-star each SPECTRE hero to unlock the next, up to 7-gold Alpha.",
  },
  {
    id: "mistbender",
    name: "Mistbender",
    type: "faction",
    breakpoints: [2, 4, 6],
    description: "Mist shields and magic shred.",
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
    breakpoints: [2, 4],
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
    breakpoints: [2, 4],
    description: "Kishin burst line, pairs with Phase Warper.",
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
    breakpoints: [3, 6],
    description: "Mana regen — one fed caster ults almost nonstop.",
  },
  {
    id: "swift-blade",
    name: "Swift Blade",
    type: "role",
    breakpoints: [2, 4],
    description: "Crit + attack speed duelists.",
  },
  {
    id: "phase-warper",
    name: "Phase Warper",
    type: "role",
    breakpoints: [2, 4],
    description: "Mobility + reposition burst.",
  },
];

export const HEROES: Hero[] = [
  { id: "melissa", name: "Melissa", cost: 5, synergies: ["echomancer", "marksman"], range: 4, role: "carry" },
  { id: "fanny", name: "Fanny", cost: 5, synergies: ["starbelle", "swift-blade"], range: 1, role: "carry" },
  { id: "vale", name: "Vale", cost: 5, synergies: ["mistbender", "stargazer"], range: 4, role: "carry" },
  { id: "baxia", name: "Baxia", cost: 5, synergies: ["dragon-altar", "defender"], range: 1, role: "tank" },
  {
    id: "thamuz",
    name: "Thamuz",
    cost: 5,
    synergies: ["shadeweaver", "weapon-master"],
    range: 1,
    role: "tank",
  },
  { id: "odette", name: "Odette", cost: 5, synergies: ["astro-power", "mage"], range: 3, role: "carry" },
  {
    id: "lancelot",
    name: "Lancelot",
    cost: 5,
    synergies: ["kishin", "phase-warper"],
    range: 1,
    role: "carry",
  },
  { id: "alice", name: "Alice", cost: 5, synergies: ["spectre", "dauntless"], range: 2, role: "burst" },
  { id: "alpha", name: "Alpha", cost: 7, synergies: ["spectre", "weapon-master"], range: 1, role: "carry" },
  { id: "moskov", name: "Moskov", cost: 4, synergies: ["marksman", "astro-power"], range: 4, role: "carry" },
  { id: "claude", name: "Claude", cost: 4, synergies: ["marksman", "mistbender"], range: 4, role: "carry" },
  { id: "vexana", name: "Vexana", cost: 4, synergies: ["mage", "stargazer"], range: 4, role: "carry" },
  { id: "lunox", name: "Lunox", cost: 4, synergies: ["mage", "starbelle"], range: 3, role: "carry" },
  { id: "sun", name: "Sun", cost: 4, synergies: ["weapon-master", "dragon-altar"], range: 1, role: "tank" },
  { id: "ling", name: "Ling", cost: 4, synergies: ["dragon-altar", "swift-blade"], range: 1, role: "carry" },
  { id: "irithel", name: "Irithel", cost: 3, synergies: ["marksman", "dauntless"], range: 4, role: "carry" },
  { id: "wanwan", name: "Wanwan", cost: 3, synergies: ["dragon-altar", "marksman"], range: 4, role: "carry" },
  { id: "aurora", name: "Aurora", cost: 3, synergies: ["mage", "shadeweaver"], range: 3, role: "burst" },
  {
    id: "gatotkaca",
    name: "Gatotkaca",
    cost: 3,
    synergies: ["defender", "mistbender"],
    range: 1,
    role: "tank",
  },
  { id: "nana", name: "Nana", cost: 2, synergies: ["stargazer", "mistbender"], range: 3, role: "support" },
  { id: "tigreal", name: "Tigreal", cost: 2, synergies: ["defender", "dauntless"], range: 1, role: "tank" },
  { id: "franco", name: "Franco", cost: 2, synergies: ["defender", "dauntless"], range: 1, role: "tank" },
];

export const heroById = (id: string) => HEROES.find((h) => h.id === id);
export const synergyById = (id: string) => SYNERGIES.find((s) => s.id === id);

export type Commander = {
  id: string;
  name: string;
  tier: "S" | "A" | "B";
  skill: string;
  tip: string;
};

export const COMMANDERS: Commander[] = [
  {
    id: "minotaur",
    name: "Minotaur",
    tier: "S",
    skill: "Safety-net sustain + team shields",
    tip: " default climb pick — forgiving while you learn econ.",
  },
  {
    id: "nana",
    name: "Nana",
    tier: "S",
    skill: "Stargazer / roll support",
    tip: " best with Mage + Stargazer — rush Vexana 2★.",
  },
  {
    id: "brody",
    name: "Brody",
    tier: "S",
    skill: "Converts spare heroes into value",
    tip: " new S7 — hold pairs, let Brody fund your roll.",
  },
  {
    id: "franco",
    name: "Franco",
    tier: "A",
    skill: "Plunderer's Claw hooks nearest enemy",
    tip: " vs Franco: keep carry CENTER back, not edge.",
  },
  {
    id: "ling-duel",
    name: "Ling",
    tier: "A",
    skill: "Dueling Ring pulls farthest hero",
    tip: " vs Ling: leave back corner empty or park a tank there.",
  },
  {
    id: "angela",
    name: "Angela",
    tier: "A",
    skill: "Early-mid tempo buffs",
    tip: " camp mid early, pull once backline is set.",
  },
];

export const COST_COLORS: Record<number, string> = {
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
      5: "gatotkaca",
      6: "baxia",
      18: "irithel",
      24: "wanwan",
      26: "moskov",
      27: "claude",
    },
  },
  {
    name: "Mage + Stargazer",
    desc: "One caster carries with mana regen.",
    tiles: { 2: "gatotkaca", 5: "baxia", 17: "nana", 18: "aurora", 25: "lunox", 26: "vexana", 27: "odette" },
  },
  {
    name: "SPECTRE → Alpha",
    desc: "2-star each SPECTRE to climb to 7-gold Alpha.",
    tiles: { 2: "thamuz", 10: "alice", 18: "sun", 26: "alpha" },
  },
];
