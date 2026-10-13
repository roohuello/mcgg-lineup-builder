"use client";

import { useEffect, useMemo, useState } from "react";
import HeroIcon from "@/components/HeroIcon";
import { COMMANDERS, COST_COLORS, HEROES, heroById, PRESETS, SYNERGIES } from "@/data/game";
import {
  type Board,
  boardCost,
  COLS,
  decodeBoard,
  emptyBoard,
  emptyStars,
  encodeBoard,
  getSynergyStatus,
  placedCount,
  ROWS,
  STORAGE_COMMANDER_KEY,
  STORAGE_KEY,
  STORAGE_STARS_KEY,
  type Stars,
} from "@/lib/lineup";

export const heroImg = (id: string) => `/heroes/${id}.png`;

function loadState() {
  try {
    const params = new URLSearchParams(window.location.search);
    const { board, stars } = decodeBoard(params.get("b"));
    const commander = params.get("c") ?? localStorage.getItem(STORAGE_COMMANDER_KEY) ?? "";
    // fall back to localStorage board if no URL board
    if (!params.get("b")) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = decodeBoard(saved);
        return { board: d.board, stars: d.stars, commander };
      }
      const savedStars = localStorage.getItem(STORAGE_STARS_KEY);
      if (savedStars) {
        try {
          const arr = JSON.parse(savedStars);
          if (Array.isArray(arr)) return { board, stars: arr, commander };
        } catch {}
      }
    }
    return { board, stars, commander };
  } catch {
    return { board: emptyBoard(), stars: emptyStars(), commander: "" };
  }
}

const STAR_LABEL = ["", "★", "★★", "★★★"];

export default function Builder() {
  const [board, setBoard] = useState<Board>(() =>
    typeof window === "undefined" ? emptyBoard() : loadState().board,
  );
  const [stars, setStars] = useState<Stars>(() =>
    typeof window === "undefined" ? emptyStars() : loadState().stars,
  );
  const [commander, setCommander] = useState<string>(() =>
    typeof window === "undefined" ? "" : loadState().commander,
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterSyn, setFilterSyn] = useState<string>("all");
  const [filterCost, setFilterCost] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  // Persist + sync URL (replace, no reload)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, encodeBoard(board, stars));
      localStorage.setItem(STORAGE_COMMANDER_KEY, commander);
    } catch {}
    const b = encodeBoard(board, stars);
    const params = new URLSearchParams();
    if (b) params.set("b", b);
    if (commander) params.set("c", commander);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [board, stars, commander]);

  const status = useMemo(() => getSynergyStatus(board), [board]);
  const activeSynergies = status.filter((s) => s.active);
  const commanderInfo = COMMANDERS.find((c) => c.id === commander);

  const filtered = HEROES.filter((h) => {
    if (filterCost !== "all" && h.cost !== Number(filterCost)) return false;
    if (filterSyn !== "all" && !h.synergies.includes(filterSyn)) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const place = (heroId: string) => {
    if (selected == null) return;
    const target = selected;
    setBoard((prev) => {
      const next = [...prev];
      const existing = next.indexOf(heroId);
      if (existing !== -1) next[existing] = null;
      next[target] = heroId;
      return next;
    });
    setStars((prev) => {
      const next = [...prev];
      const existing = board.indexOf(heroId);
      if (existing !== -1) next[existing] = 0;
      next[target] = 2; // new placements assumed 2★
      return next;
    });
    const nextEmpty = board.findIndex((c, i) => !c && i !== target);
    setSelected(nextEmpty === -1 ? null : nextEmpty);
  };

  const onTileClick = (i: number) => {
    if (selected == null) {
      setSelected(i);
      return;
    }
    if (selected === i) {
      setSelected(null); // second click deselects (use ✕ to remove)
      return;
    }
    const a = selected;
    const b = i;
    const heroA = board[a];
    const heroB = board[b];
    if (heroA && !heroB) {
      // move
      setBoard((prev) => {
        const next = [...prev];
        next[b] = next[a];
        next[a] = null;
        return next;
      });
      setStars((prev) => {
        const next = [...prev];
        next[b] = next[a];
        next[a] = 0;
        return next;
      });
      setSelected(b);
    } else if (heroA && heroB) {
      // swap
      setBoard((prev) => {
        const next = [...prev];
        [next[a], next[b]] = [next[b], next[a]];
        return next;
      });
      setStars((prev) => {
        const next = [...prev];
        [next[a], next[b]] = [next[b], next[a]];
        return next;
      });
      setSelected(b);
    } else {
      setSelected(b);
    }
  };

  const setStar = (n: number) => {
    if (selected == null || !board[selected]) return;
    setStars((prev) => {
      const next = [...prev];
      next[selected] = n;
      return next;
    });
  };

  const removeSelected = () => {
    if (selected == null) return;
    const t = selected;
    setBoard((prev) => {
      const next = [...prev];
      next[t] = null;
      return next;
    });
    setStars((prev) => {
      const next = [...prev];
      next[t] = 0;
      return next;
    });
    setSelected(null);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const selectedId = selected != null ? board[selected] : null;
  const selectedHero = selectedId ? heroById(selectedId) : undefined;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      {/* Board column */}
      <div>
        {/* Commander picker */}
        <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100">Commander</h3>
            {commander && (
              <button
                type="button"
                onClick={() => setCommander("")}
                className="text-xs text-zinc-500 underline hover:text-zinc-300"
              >
                clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMANDERS.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCommander(commander === c.id ? "" : c.id)}
                className={`flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-1 text-xs font-semibold transition ${
                  commander === c.id
                    ? "border-amber-300 bg-amber-300/15 text-amber-200"
                    : "border-white/10 bg-black/30 text-zinc-300 hover:border-indigo-400/50"
                }`}
              >
                <HeroIcon
                  src={c.img}
                  name={c.name}
                  size={20}
                  className="h-5 w-5 rounded-full object-cover"
                  fallbackClassName="text-[10px]"
                />
                [{c.tier}] {c.name}
              </button>
            ))}
          </div>
          {commanderInfo && (
            <p className="mt-2 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">{commanderInfo.name}:</span> {commanderInfo.skill}{" "}
              —{commanderInfo.tip}
            </p>
          )}
        </div>

        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
          <span className="uppercase tracking-widest">▲ Front — faces enemy</span>
          <span>
            {placedCount(board)}/10 on board · {boardCost(board)}g value
            {commanderInfo ? ` · ${commanderInfo.name}` : ""}
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
            const star = stars[i] || 0;
            return (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed 32-tile board, indices are stable IDs
                key={i}
                onClick={() => onTileClick(i)}
                title={
                  hero
                    ? `${hero.name} ${STAR_LABEL[star]} — click another tile to move/swap`
                    : `Tile ${i + 1} — click then pick a hero`
                }
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg border text-[11px] font-semibold transition ${
                  hero
                    ? `${COST_COLORS[hero.cost] ?? "border-zinc-600"} border-2 bg-gradient-to-b from-indigo-500/40 to-slate-900`
                    : "border-white/10 bg-white/[0.03] hover:border-indigo-400/60 hover:bg-white/[0.07]"
                } ${isSel ? "ring-2 ring-amber-300 ring-offset-2 ring-offset-[#0d1226]" : ""} ${
                  star === 3 ? "shadow-[0_0_12px_rgba(251,191,36,0.45)]" : ""
                }`}
              >
                {row === 0 && !hero && (
                  <span className="absolute top-0.5 text-[8px] text-zinc-600">FRONT</span>
                )}
                {hero ? (
                  <>
                    <span className="relative aspect-square h-1/2">
                      <HeroIcon
                        src={heroImg(hero.id)}
                        name={hero.name}
                        fill
                        sizes="(max-width: 1024px) 12vw, 64px"
                        className="rounded-md object-cover"
                        fallbackClassName="text-sm"
                      />
                    </span>
                    <span className="max-w-full truncate px-0.5 text-[9px] font-medium text-zinc-200">
                      {hero.name}
                    </span>
                    <span className={`text-[9px] ${star === 3 ? "text-amber-300" : "text-zinc-400"}`}>
                      {STAR_LABEL[star]} · {hero.cost}g
                    </span>
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
          <span className="hidden sm:inline">
            Tip: keep carry centered vs Franco, don&apos;t hard-corner vs Ling
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            {copied ? "Link copied ✓" : "Copy share link"}
          </button>
          <button
            type="button"
            onClick={() => {
              setBoard(emptyBoard());
              setStars(emptyStars());
              setSelected(null);
            }}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Reset board
          </button>
          {selected != null && !selectedHero && (
            <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm text-amber-200">
              Tile {selected + 1} selected — pick a hero below
            </span>
          )}
          {selected != null && selectedHero && (
            <span className="flex flex-wrap items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-sm text-amber-200">
              {selectedHero.name}
              {[1, 2, 3].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setStar(n)}
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    (stars[selected] || 2) === n
                      ? "bg-amber-300 text-black"
                      : "bg-white/10 text-amber-100 hover:bg-white/20"
                  }`}
                >
                  {STAR_LABEL[n]}
                </button>
              ))}
              <button
                type="button"
                onClick={removeSelected}
                className="rounded-full bg-white/10 px-2 py-0.5 text-xs hover:bg-white/20"
              >
                ✕
              </button>
              <span className="text-xs text-amber-200/70">tap another tile to move/swap</span>
            </span>
          )}
        </div>

        {/* Presets */}
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">Starter comps</h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <button
                type="button"
                key={p.name}
                onClick={() => {
                  const next = emptyBoard();
                  const ns = emptyStars();
                  for (const [tile, id] of Object.entries(p.tiles)) {
                    next[Number(tile)] = id;
                    ns[Number(tile)] = 2;
                  }
                  setBoard(next);
                  setStars(ns);
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
            Synergies{" "}
            {activeSynergies.length > 0 && (
              <span className="text-emerald-300">· {activeSynergies.length} active</span>
            )}
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
                  <span className={`font-semibold ${s.active ? "text-emerald-200" : "text-zinc-300"}`}>
                    {s.name}
                  </span>
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
              <option value="1">1g</option>
              <option value="2">2g</option>
              <option value="3">3g</option>
              <option value="4">4g</option>
              <option value="5">5g</option>
              <option value="7">7g</option>
            </select>
          </div>
          {!selected && (
            <p className="mb-2 text-xs text-amber-200/80">Tap a board tile first, then tap a hero.</p>
          )}
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((h) => (
              <button
                type="button"
                key={h.id}
                disabled={selected == null}
                onClick={() => place(h.id)}
                className={`rounded-lg border-2 bg-black/30 p-2 text-left transition ${COST_COLORS[h.cost] ?? "border-zinc-600"} ${
                  selected == null ? "opacity-40" : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <HeroIcon
                    src={heroImg(h.id)}
                    name={h.name}
                    size={32}
                    className="h-8 w-8 flex-none rounded-md object-cover"
                    fallbackClassName="text-xs font-bold"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-xs font-bold text-zinc-100">{h.name}</span>
                      <span className="text-[10px] font-semibold text-amber-300">{h.cost}g</span>
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-zinc-400">
                      {h.synergies.map((s) => s).join(" · ")}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-500">
                  {h.range === 1 ? "melee — front" : `range ${h.range} — back`} · {h.role}
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="col-span-2 text-xs text-zinc-500">No heroes match.</p>}
          </div>
          <p className="mt-2 text-[11px] text-zinc-600">
            Rows: {ROWS}×{COLS} = your half. New picks land as 2★ — adjust per tile. Data: Season 7 starter
            set ({HEROES.length} heroes).
          </p>
        </section>
      </div>
    </div>
  );
}
