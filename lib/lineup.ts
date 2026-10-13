import { HEROES, heroById, SYNERGIES } from "@/data/game";

export const ROWS = 4;
export const COLS = 8;
export const TILES = ROWS * COLS;

export type Board = (string | null)[]; // length 32, hero id or null
export type Stars = number[]; // length 32, 0 = empty, else 1|2|3

export const emptyBoard = (): Board => Array(TILES).fill(null);
export const emptyStars = (): Stars => Array(TILES).fill(0);

export type SynergyStatus = {
  id: string;
  name: string;
  count: number;
  breakpoints: number[];
  activeLevel: number; // highest breakpoint met, 0 = inactive
  next: number | null; // next breakpoint to hit
  active: boolean;
};

export function getSynergyStatus(board: Board): SynergyStatus[] {
  const counts = new Map<string, number>();
  for (const cell of board) {
    if (!cell) continue;
    const hero = heroById(cell);
    if (!hero) continue;
    for (const s of hero.synergies) counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return SYNERGIES.map((s) => {
    const count = counts.get(s.id) ?? 0;
    const hit = s.breakpoints.filter((b) => count >= b);
    const activeLevel = hit.length ? hit[hit.length - 1] : 0;
    const next = s.breakpoints.find((b) => count < b) ?? null;
    return {
      id: s.id,
      name: s.name,
      count,
      breakpoints: s.breakpoints,
      activeLevel,
      next,
      active: activeLevel > 0,
    };
  }).sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return b.count - a.count;
  });
}

export function boardCost(board: Board): number {
  let total = 0;
  for (const cell of board) {
    const h = cell ? heroById(cell) : undefined;
    if (h) total += h.cost;
  }
  return total;
}

export function placedCount(board: Board): number {
  return board.filter(Boolean).length;
}

// URL share: b=heroId.tile.star,heroId.tile.star  (star optional, default 2)
// Backward compatible with old b=heroId.tile links.
export function encodeBoard(board: Board, stars?: Stars): string {
  const parts: string[] = [];
  board.forEach((cell, i) => {
    if (cell) {
      const star = stars?.[i] || 2;
      parts.push(`${cell}.${i}.${star}`);
    }
  });
  return parts.join(",");
}

export function decodeBoard(param: string | null): { board: Board; stars: Stars } {
  const board = emptyBoard();
  const stars = emptyStars();
  if (!param) return { board, stars };
  const validIds = new Set(HEROES.map((h) => h.id));
  for (const part of param.split(",")) {
    const [id, tileStr, starStr] = part.split(".");
    const tile = Number(tileStr);
    if (!id || !validIds.has(id)) continue;
    if (!Number.isInteger(tile) || tile < 0 || tile >= TILES) continue;
    const star = Number(starStr);
    board[tile] = id;
    stars[tile] = star === 1 || star === 3 ? star : 2;
  }
  return { board, stars };
}

export const STORAGE_KEY = "mcgg-board-v1";
export const STORAGE_STARS_KEY = "mcgg-stars-v2";
export const STORAGE_COMMANDER_KEY = "mcgg-commander-v2";
