import { useState } from "react";
import type { PuzzleProps } from "../engine/PuzzleRenderer";
import type { ChoicePuzzle } from "../levels/types";
import { Feedback, SolvedBar } from "../components/ui";

export function Choice({ puzzle, onSolve }: PuzzleProps<ChoicePuzzle>) {
  const [wrong, setWrong] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const solved = picked === puzzle.answer;
  const pickedOption = puzzle.options.find((o) => o.id === picked);

  function pick(id: string) {
    if (solved) return;
    setPicked(id);
    if (id !== puzzle.answer) setWrong((w) => (w.includes(id) ? w : [...w, id]));
  }

  return (
    <div>
      <p className="font-medium">{puzzle.prompt}</p>
      {puzzle.context && <p className="mt-1 text-sm text-muted">{puzzle.context}</p>}

      <div className="mt-4 grid gap-2">
        {puzzle.options.map((o) => {
          const isWrong = wrong.includes(o.id);
          const isRight = solved && o.id === puzzle.answer;
          return (
            <button
              key={o.id}
              onClick={() => pick(o.id)}
              disabled={isWrong || solved}
              className={`rounded-md border px-4 py-3 text-left transition break-all ${puzzle.mono ? "font-mono text-sm" : ""} ${
                isRight
                  ? "border-accent bg-accent/10 text-accent"
                  : isWrong
                    ? "border-danger/40 text-muted line-through"
                    : "border-line bg-raised hover:border-accent/60"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      {pickedOption && <Feedback ok={solved}>{pickedOption.explain}</Feedback>}
      {solved && <SolvedBar onContinue={onSolve} />}
    </div>
  );
}
