import { useState } from "react";
import { motion } from "motion/react";
import type { Player } from "../types";

type Trend = "up" | "down" | "flat";
type Metric = "average" | "total";

interface Row {
  player: Player;
  total: number;
  average: number;
  trend: Trend;
  delta: number;
}

function computeRow(player: Player): Row {
  const sorted = [...player.scores].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  
  const total = sorted.reduce((sum, s) => sum + s.score, 0);
  const average = sorted.length > 0 ? Math.round(total / sorted.length) : 0;
  const latest = sorted.at(-1)?.score ?? 0;
  const previous = sorted.at(-2)?.score ?? latest;
  const delta = latest - previous;
  const trend: Trend = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
 
  return { player, total, average, trend, delta };
}

function TrendBadge({ trend, delta }: { trend: Trend; delta: number }) {
  const styles = {
    up: "bg-emerald-500/10 text-emerald-400",
    down: "bg-rose-500/10 text-rose-400",
    flat: "bg-neutral-500/10 text-neutral-400",
  }[trend];

  const arrow = {
    up: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-arrow-up-icon lucide-arrow-up"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    ),
    down: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-arrow-up-icon lucide-arrow-up"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    ),
    flat: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-arrow-up-icon lucide-arrow-up"
      >
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </svg>
    )
  }[trend];
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
  const [metric, setMetric] = useState<Metric>("average");
  const rows = players.map(computeRow).sort((a, b) => b[metric] - a[metric]);

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

  const segments: { value: Metric; label: string }[] = [
    { value: "average", label: "Average" },
    { value: "total", label: "High score" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div
          role="tablist"
          aria-label="Ranking metric"
          className="inline-flex rounded-full border border-neutral-700 bg-neutral-900/50 p-1"
        >
          {segments.map((segment) => {
            const active = metric === segment.value;
            return (
              <button
                key={segment.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMetric(segment.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "bg-neutral-700 text-neutral-100"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {segment.label}
              </button>
            );
          })}
        </div>
      </div>
      <ol className="divide-y divide-neutral-700 overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900/50 backdrop-blur">
        {rows.map((row, index) => {
          const primary = metric === "average" ? row.average : row.total;
          const secondary = metric === "average" ? row.total : row.average;
          return (
        <motion.li
          layout
          key={row.player.name}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className="flex items-center gap-4 bg-neutral-900/50 px-4 py-3 transition-colors hover:bg-neutral-800/40"
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
          <div className="flex flex-center flex-col w-20">
            <span
              className={`block text-center font-mono text-lg font-thin tabular-nums ${getTextColor(index)}`}
            >
              {primary.toLocaleString()}
            </span>
            <span className="block text-center font-mono text-xs tabular-nums text-neutral-600">
              ({secondary.toLocaleString()})
            </span>
          </div>
          <div className="w-18 text-right">
            <TrendBadge trend={row.trend} delta={row.delta} />
          </div>
            </motion.li>
          );
        })}
        {rows.length === 0 && (
          <li className="px-4 py-12 text-center text-sm text-neutral-500">
            No players yet.
          </li>
        )}
      </ol>
    </div>
  );
}
