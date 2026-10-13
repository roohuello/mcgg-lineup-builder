import { HEROES, SYNERGIES, heroById } from "@/data/game";

export const ROWS = 4;
export const COLS = 8;
export const TILES = ROWS * COLS;

export type Board = (string | null)[]; // length 32, hero id or null

export const emptyBoard = (): Board => Array(TILES).fill(null);

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
  // unique heroes only? MCGG counts unique placements; duplicates on board
  // still count (builder allows 1 copy each, so fine).
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

// URL share: b=heroId.tile,heroId.tile  (tile = 0..31)
export function encodeBoard(board: Board): string {
  const parts: string[] = [];
  board.forEach((cell, i) => {
    if (cell) parts.push(`${cell}.${i}`);
  });
  return parts.join(",");
}

export function decodeBoard(param: string | null): Board {
  const board = emptyBoard();
  if (!param) return board;
  const validIds = new Set(HEROES.map((h) => h.id));
  for (const part of param.split(",")) {
    const [id, tileStr] = part.split(".");
    const tile = Number(tileStr);
    if (!id || !validIds.has(id)) continue;
    if (!Number.isInteger(tile) || tile < 0 || tile >= TILES) continue;
    board[tile] = id;
  }
  return board;
}

export const STORAGE_KEY = "mcgg-board-v1";
