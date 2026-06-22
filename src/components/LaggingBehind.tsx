import type { Player } from "../types";

export function LaggingBehind({ players }: { players: Player[] }) {
  const lagging = players.filter((player) => player.scores.length <= 1);

  if (lagging.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-col gap-2" style={{ marginTop: '50px'}}>
      <div>
        <h2 className="text-sm font-medium text-neutral-400">
          Lagging behind
        </h2>
        <p className="text-xs text-neutral-600">
          Play at least two rounds to join the leaderboard.
        </p>
      </div>
      <ul className="divide-y divide-neutral-800 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30">
        {lagging.map((player) => (
          <li
            key={player.name}
            className="flex items-center gap-4 px-4 py-3"
          >
            <img
              src={player.avatarUrl}
              alt=""
              className="size-10 rounded-full bg-neutral-800 object-cover opacity-60"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-neutral-400">
                {player.name}
              </p>
              <p className="text-xs text-neutral-600">
                {player.scores.length}{" "}
                {player.scores.length === 1 ? "round" : "rounds"}
              </p>
            </div>
            <span className="font-mono text-lg font-thin tabular-nums text-neutral-500">
              {(player.scores[0]?.score ?? 0).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
