import type { Player } from "../types";

type Trend = "up" | "down" | "flat";

interface Row {
  player: Player;
  total: number;
  trend: Trend;
  delta: number;
}

function computeRow(player: Player): Row {
  const sorted = [...player.scores].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const total = sorted.reduce((sum, s) => sum + s.score, 0);
  const latest = sorted.at(-1)?.score ?? 0;
  const previous = sorted.at(-2)?.score ?? latest;
  const delta = latest - previous;
  const trend: Trend = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return { player, total, trend, delta };
}

function TrendBadge({ trend, delta }: { trend: Trend; delta: number }) {
  const styles = {
    up: "bg-emerald-500/10 text-emerald-400",
    down: "bg-rose-500/10 text-rose-400",
    flat: "bg-neutral-500/10 text-neutral-400",
  }[trend];

  const arrow = { up: "▲", down: "▼", flat: "—" }[trend];
  const label = trend === "flat" ? "0" : `${delta > 0 ? "+" : ""}${delta}`;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}
    >
      <span aria-hidden>{arrow}</span>
      {label}
    </span>
  );
}

export function Leaderboard({ players }: { players: Player[] }) {
  const rows = players.map(computeRow).sort((a, b) => b.total - a.total);

  const getTextColor = (index: number) => {
    if (index === 0) {
      return "text-amber-400";
    }

    if (index === 1) {
      return "text-slate-400";
    }

    if (index === 2) {
      return "text-taupe-400";
    }

    return `text-neutral-500`;
  };

  const getTextSize = (index: number) => {
    if (index <= 2) {
      return "text-3xl";
    }

    return `text-base`;
  };

  const getPositionSymbol = (index: number) => {
    if (index === 0) {
      return "🥇";
    }

    if (index === 1) {
      return "🥈";
    }

    if (index === 2) {
      return "🥉";
    }

    return index + 1;
  };

  return (
    <ol className="divide-y divide-neutral-700 overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900/50 backdrop-blur">
      {rows.map((row, index) => (
        <li
          key={row.player.name}
          className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-neutral-800/40"
        >
          <span
            className={`w-8 text-center font-mono tabular-nums ${getTextColor(index)} ${getTextSize(index)}`}
          >
            {getPositionSymbol(index)}
          </span>
          <img
            src={row.player.avatarUrl}
            alt=""
            className="size-10 rounded-full bg-neutral-800 object-cover"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-neutral-100">
              {row.player.name}
            </p>
            <p className="text-xs text-neutral-500">
              {row.player.scores.length}{" "}
              {row.player.scores.length === 1 ? "round" : "rounds"}
            </p>
          </div>
          <span
            className={`font-mono text-base font-thin tabular-nums ${getTextColor(index)}`}
          >
            {row.total.toLocaleString()}
          </span>
          <div className="w-24 text-right">
            <TrendBadge trend={row.trend} delta={row.delta} />
          </div>
        </li>
      ))}
      {rows.length === 0 && (
        <li className="px-4 py-12 text-center text-sm text-neutral-500">
          No players yet.
        </li>
      )}
    </ol>
  );
}
