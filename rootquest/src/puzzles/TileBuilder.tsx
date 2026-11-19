import { useState, type DragEvent } from "react";
import type { PuzzleProps } from "../engine/PuzzleRenderer";
import type { TilesPuzzle } from "../levels/types";
import { Button, Feedback, SolvedBar } from "../components/ui";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

// Tap a tile to add/remove it (works on phones). On desktop you can also drag
// tiles into the payload and drag them around to reorder.
export function TileBuilder({ puzzle, onSolve }: PuzzleProps<TilesPuzzle>) {
  const [built, setBuilt] = useState<number[]>([]); // indexes into puzzle.tiles
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const solved = feedback?.ok === true;
  const payload = built.map((i) => puzzle.tiles[i]).join("");
  const [before, after] = puzzle.template.split("{payload}");

  const add = (i: number, at = built.length) => {
    if (solved) return;
    setBuilt((b) => {
      const next = b.filter((x) => x !== i);
      next.splice(Math.min(at, next.length), 0, i);
      return next;
    });
    setFeedback(null);
  };
  const remove = (i: number) => {
    if (solved) return;
    setBuilt((b) => b.filter((x) => x !== i));
    setFeedback(null);
  };

  const onDragStart = (e: DragEvent, i: number) => e.dataTransfer.setData("text/plain", String(i));
  const dropAt = (e: DragEvent, at?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const i = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(i)) add(i, at);
  };
  const dropToPool = (e: DragEvent) => {
    e.preventDefault();
    const i = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(i)) remove(i);
  };

  function check() {
    const valid = [puzzle.answer, ...(puzzle.alsoAccept ?? [])].map((a) => norm(a.join("")));
    setFeedback(
      valid.includes(norm(payload))
        ? { ok: true, text: puzzle.successOutput }
        : { ok: false, text: "The server rejected that input. Read the code above: what would your payload turn it into?" },
    );
  }

  const tileCls = "rounded border px-2.5 py-1.5 font-mono text-sm whitespace-pre transition";

  return (
    <div>
      <p className="text-sm text-muted">{puzzle.instruction}</p>

      {/* Live preview: the vulnerable code with the payload pasted in */}
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-md border border-line bg-raised p-3 font-mono text-sm">
        {before}
        <span className="bg-accent/15 text-accent">{payload || "…"}</span>
        {after}
      </pre>

      <div className="mt-4 text-xs font-mono text-muted">your payload:</div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => dropAt(e)}
        className="mt-1 flex min-h-[52px] flex-wrap gap-2 rounded-md border border-dashed border-accent/50 p-2"
      >
        {built.length === 0 && <span className="self-center text-sm text-muted">Tap or drag tiles here</span>}
        {built.map((i, pos) => (
          <button
            key={i}
            draggable={!solved}
            onDragStart={(e) => onDragStart(e, i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => dropAt(e, pos)}
            onClick={() => remove(i)}
            className={`${tileCls} border-accent/60 bg-accent/10 text-accent`}
            title="Tap to remove"
          >
            {puzzle.tiles[i]}
          </button>
        ))}
      </div>

      <div className="mt-4 text-xs font-mono text-muted">tiles:</div>
      <div onDragOver={(e) => e.preventDefault()} onDrop={dropToPool} className="mt-1 flex min-h-[52px] flex-wrap gap-2 rounded-md border border-line p-2">
        {puzzle.tiles.map((t, i) =>
          built.includes(i) ? null : (
            <button
              key={i}
              draggable={!solved}
              onDragStart={(e) => onDragStart(e, i)}
              onClick={() => add(i)}
              className={`${tileCls} border-line bg-raised hover:border-accent/60`}
            >
              {t}
            </button>
          ),
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={check} disabled={solved || built.length === 0}>
          Send payload
        </Button>
        <Button onClick={() => { setBuilt([]); setFeedback(null); }} disabled={solved}>
          Clear
        </Button>
      </div>

      {feedback && <Feedback ok={feedback.ok}>{feedback.text}</Feedback>}
      {solved && <SolvedBar onContinue={onSolve} />}
    </div>
  );
}
