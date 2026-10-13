"use client";

import { useEffect, useMemo, useState } from "react";
import { HEROES, SYNERGIES, COST_COLORS, PRESETS, heroById } from "@/data/game";
import {
  Board,
  COLS,
  ROWS,
  STORAGE_KEY,
  boardCost,
  decodeBoard,
  emptyBoard,
  encodeBoard,
  getSynergyStatus,
  placedCount,
} from "@/lib/lineup";

function heroInitials(name: string) {
  return name
    .split(/[^A-Za-z]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Builder() {
  const [board, setBoard] = useState<Board>(() => {
    if (typeof window === "undefined") return emptyBoard();
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("b");
      if (fromUrl) return decodeBoard(fromUrl);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return decodeBoard(saved);
    } catch {}
    return emptyBoard();
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterSyn, setFilterSyn] = useState<string>("all");
  const [filterCost, setFilterCost] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  // Persist + sync URL (replace, no reload)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, encodeBoard(board));
    } catch {}
    const encoded = encodeBoard(board);
    const url = encoded ? `?b=${encoded}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [board]);

  const status = useMemo(() => getSynergyStatus(board), [board]);
  const activeSynergies = status.filter((s) => s.active);

  const filtered = HEROES.filter((h) => {
    if (filterCost !== "all" && h.cost !== Number(filterCost)) return false;
    if (filterSyn !== "all" && !h.synergies.includes(filterSyn)) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const place = (heroId: string) => {
    if (selected == null) return;
    setBoard((prev) => {
      const next = [...prev];
      // prevent duplicate hero on board (swap if exists elsewhere)
      const existing = next.indexOf(heroId);
      if (existing !== -1) next[existing] = null;
      next[selected] = heroId;
      return next;
    });
    // auto-advance to next empty tile
    const nextEmpty = board.findIndex((c, i) => !c && i !== selected);
    setSelected(nextEmpty === -1 ? null : nextEmpty);
  };

  const onTileClick = (i: number) => {
    if (board[i]) {
      if (selected === i) {
        // second click removes
        setBoard((prev) => {
          const next = [...prev];
          next[i] = null;
          return next;
        });
        setSelected(null);
      } else {
        setSelected(i);
      }
    } else {
      setSelected(selected === i ? null : i);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      {/* Board column */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
          <span className="uppercase tracking-widest">▲ Front — faces enemy</span>
          <span>
            {placedCount(board)}/10 on board · {boardCost(board)}g value
          </span>
        </div>
        <div
          className="grid gap-1.5 rounded-2xl border border-white/10 bg-[#0d1226] p-3"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}
        >
          {board.map((cell, i) => {
            const hero = cell ? heroById(cell) : undefined;
            const isSel = selected === i;
            const row = Math.floor(i / COLS);
            return (
              <button
                key={i}
                onClick={() => onTileClick(i)}
                title={hero ? `${hero.name} — click again to remove` : `Tile ${i + 1} — click then pick a hero`}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border text-[11px] font-semibold transition ${
                  hero
                    ? `${COST_COLORS[hero.cost] ?? "border-zinc-600"} border-2 bg-gradient-to-b from-indigo-500/40 to-slate-900`
                    : "border-white/10 bg-white/[0.03] hover:border-indigo-400/60 hover:bg-white/[0.07]"
                } ${isSel ? "ring-2 ring-amber-300 ring-offset-2 ring-offset-[#0d1226]" : ""}`}
              >
                {row === 0 && !hero && <span className="absolute top-0.5 text-[8px] text-zinc-600">FRONT</span>}
                {hero ? (
                  <>
                    <span className="text-sm">{heroInitials(hero.name)}</span>
                    <span className="max-w-full truncate px-0.5 text-[9px] font-medium text-zinc-200">{hero.name}</span>
                    <span className="text-[9px] text-amber-300">{hero.cost}g</span>
                  </>
                ) : (
                  <span className="text-zinc-700">+</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
          <span className="uppercase tracking-widest">▼ Back — carries here</span>
          <span className="hidden sm:inline">Tip: keep carry centered vs Franco, don&apos;t hard-corner vs Ling</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={copyLink}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            {copied ? "Link copied ✓" : "Copy share link"}
          </button>
          <button
            onClick={() => {
              setBoard(emptyBoard());
              setSelected(null);
            }}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Reset board
          </button>
          {selected != null && (
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm text-amber-200">
              Tile {selected + 1} selected — pick a hero below
            </span>
          )}
        </div>

        {/* Presets */}
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">Starter comps</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  const next = emptyBoard();
                  for (const [tile, id] of Object.entries(p.tiles)) next[Number(tile)] = id;
                  setBoard(next);
                  setSelected(null);
                }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left hover:border-indigo-400/50"
              >
                <div className="text-sm font-semibold text-zinc-100">{p.name}</div>
                <div className="mt-0.5 text-xs text-zinc-400">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side column */}
      <div className="flex flex-col gap-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-1 text-sm font-semibold text-zinc-100">
            Synergies {activeSynergies.length > 0 && <span className="text-emerald-300">· {activeSynergies.length} active</span>}
          </h3>
          <p className="mb-3 text-xs text-zinc-500">Counts update as you place heroes.</p>
          <div className="flex flex-col gap-2">
            {status.map((s) => (
              <div
                key={s.id}
                className={`rounded-lg border px-2.5 py-1.5 text-xs ${
                  s.active ? "border-emerald-400/40 bg-emerald-400/10" : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${s.active ? "text-emerald-200" : "text-zinc-300"}`}>{s.name}</span>
                  <span className="text-zinc-400">
                    {s.count}
                    {s.next ? ` → ${s.next}` : " MAX"}
                  </span>
                </div>
                <div className="mt-1 flex gap-1">
                  {s.breakpoints.map((b) => (
                    <span
                      key={b}
                      className={`rounded px-1.5 py-0.5 text-[10px] ${
                        s.count >= b ? "bg-emerald-400 text-black font-bold" : "bg-white/10 text-zinc-400"
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-2 text-sm font-semibold text-zinc-100">Heroes</h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search heroes…"
            className="mb-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-400 focus:outline-none"
          />
          <div className="mb-2 flex gap-2">
            <select
              value={filterSyn}
              onChange={(e) => setFilterSyn(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-2 py-2 text-xs text-zinc-200"
            >
              <option value="all">All synergies</option>
              {SYNERGIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={filterCost}
              onChange={(e) => setFilterCost(e.target.value)}
              className="w-24 rounded-lg border border-white/10 bg-black/30 px-2 py-2 text-xs text-zinc-200"
            >
              <option value="all">Cost</option>
              <option value="2">2g</option>
              <option value="3">3g</option>
              <option value="4">4g</option>
              <option value="5">5g</option>
              <option value="7">7g</option>
            </select>
          </div>
          {!selected && <p className="mb-2 text-xs text-amber-200/80">Tap a board tile first, then tap a hero.</p>}
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((h) => (
              <button
                key={h.id}
                disabled={selected == null}
                onClick={() => place(h.id)}
                className={`rounded-lg border-2 bg-black/30 p-2 text-left transition ${COST_COLORS[h.cost] ?? "border-zinc-600"} ${
                  selected == null ? "opacity-40" : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-100">{h.name}</span>
                  <span className="text-[10px] font-semibold text-amber-300">{h.cost}g</span>
                </div>
                <div className="mt-0.5 truncate text-[10px] text-zinc-400">
                  {h.synergies.map((s) => s).join(" · ")}
                </div>
                <div className="text-[10px] text-zinc-500">
                  {h.range === 1 ? "melee — front" : `range ${h.range} — back`} · {h.role}
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="col-span-2 text-xs text-zinc-500">No heroes match.</p>}
          </div>
          <p className="mt-2 text-[11px] text-zinc-600">
            Rows: {ROWS}×{COLS} = your half. Data: Season 7 Chrono Echoes starter set ({HEROES.length} heroes).
          </p>
        </section>
      </div>
    </div>
  );
}
