import { Link } from "react-router-dom";
import { GAME_NAME } from "../config";
import { LEVELS, isPlayable } from "../levels";
import { useProgress } from "../engine/useProgress";

export function LevelMap() {
  const { completed, unlocked } = useProgress();
  const done = LEVELS.filter((l) => completed.includes(l.id)).length;

  return (
    <div>
      <h1 className="font-mono text-2xl font-semibold">Chapter 1: First Contact</h1>
      <p className="mt-1 text-muted">
        Learn how real attacks work by pulling them off in a safe, simulated world. Every level in {GAME_NAME} ends with a flag.
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded bg-raised">
        <div className="h-full bg-accent transition-all" style={{ width: `${(done / LEVELS.length) * 100}%` }} />
      </div>
      <p className="mt-1 font-mono text-xs text-muted">
        {done}/{LEVELS.length} flags captured
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {LEVELS.map((l) => {
          const isDone = completed.includes(l.id);
          const playable = isPlayable(l, unlocked);
          const status = isDone ? "completed" : playable ? "open" : "locked";
          return (
            <Link
              key={l.id}
              to={`/level/${l.id}`}
              className={`group rounded-lg border p-3 transition ${
                isDone
                  ? "border-accent/50 bg-accent/5"
                  : playable
                    ? "border-line bg-panel hover:border-accent/60"
                    : "border-line bg-panel/50 opacity-60 hover:opacity-90"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-muted">LVL {String(l.id).padStart(2, "0")}</span>
                <span className={isDone ? "text-accent" : "text-muted"}>
                  {status === "completed" ? "✓ done" : status === "locked" ? "🔒" : "▶"}
                </span>
              </div>
              <div className="mt-2 font-medium leading-snug group-hover:text-accent">{l.title}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
