import type { Player } from "../types";

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function PolePosition({ players }: { players: Player[] }) {
  const today = todayString();

  const leader = players
    .map((player) => ({
      player,
      score: player.scores.find((s) => s.date === today)?.score ?? null,
    }))
    .filter((entry): entry is { player: Player; score: number } =>
      entry.score !== null,
    )
    .sort((a, b) => b.score - a.score)
    .at(0);

  if (!leader) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center gap-5 rounded-2xl border border-yellow-500/30 bg-linear-to-r from-yellow-500/10 to-sky-500/10 px-5 py-4">
      <img
        src={leader.player.avatarUrl}
        alt=""
        className="size-16 rounded-full bg-neutral-800 object-cover ring-2 ring-yellow-400/60"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-yellow-400">
          🏁 Pole position
        </p>
        <p className="truncate text-xl font-semibold text-neutral-100">
          {leader.player.name}
        </p>
        <p className="text-xs text-neutral-400">Today's highest scorer</p>
      </div>
      <span className="font-mono text-3xl font-thin tabular-nums text-yellow-400">
        {leader.score.toLocaleString()}
      </span>
    </div>
  );
}
