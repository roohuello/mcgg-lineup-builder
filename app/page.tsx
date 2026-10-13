import Builder from "@/components/Builder";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070b18] font-sans text-zinc-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              MCGG Lineup Builder <span className="ml-2 rounded-full bg-indigo-500/20 border border-indigo-400/40 px-2 py-0.5 text-xs font-semibold text-indigo-200">Season 7 Chrono Echoes</span>
            </h1>
            <p className="mt-0.5 text-sm text-zinc-400">
              Plan your Magic Chess: Go Go board — tap a tile, tap a hero, watch synergies light up.
            </p>
          </div>
          <a
            href="https://loadoutgg.com/magic-chess-gogo/team-builder/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-500 underline hover:text-zinc-300"
          >
            How positioning works
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5">
        <Builder />
        <footer className="mt-8 border-t border-white/10 pt-4 text-xs text-zinc-600">
          Simple planner — not affiliated with Moonton. Synergy numbers simplified for planning; check in-game for exact patch values. Board saves in the link + your browser.
        </footer>
      </main>
    </div>
  );
}
