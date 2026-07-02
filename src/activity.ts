import type { Player } from "./types";

function cutoffDate(withinDays: number) {
  const d = new Date();
  d.setDate(d.getDate() - withinDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * A player is "active" if their most recent score is within the last `withinDays`
 * days (inclusive). `YYYY-MM-DD` dates sort lexically, so string comparison works.
 * Players with no scores are inactive.
 */
export function isActivePlayer(player: Player, withinDays = 5): boolean {
  const latest = player.scores.reduce<string | null>(
    (max, s) => (max === null || s.date > max ? s.date : max),
    null,
  );

  if (latest === null) {
    return false;
  }

  return latest >= cutoffDate(withinDays);
}
