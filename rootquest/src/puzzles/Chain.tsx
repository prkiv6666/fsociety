import { useState } from "react";
import { PuzzleRenderer, type PuzzleProps } from "../engine/PuzzleRenderer";
import type { ChainPuzzle } from "../levels/types";

// Runs several puzzles one after another. Used for multi-step missions.
export function Chain({ puzzle, onSolve }: PuzzleProps<ChainPuzzle>) {
  const [step, setStep] = useState(0);
  const current = puzzle.steps[step];

  const next = () => (step + 1 < puzzle.steps.length ? setStep(step + 1) : onSolve());

  return (
    <div>
      <ol className="mb-4 flex flex-wrap gap-2 font-mono text-xs">
        {puzzle.steps.map((s, i) => (
          <li
            key={i}
            className={`rounded border px-2 py-1 ${
              i < step ? "border-accent/40 text-accent" : i === step ? "border-accent text-ink" : "border-line text-muted"
            }`}
          >
            {i < step ? "✓" : i + 1}. {s.title}
          </li>
        ))}
      </ol>
      <p className="mb-4 text-sm">{current.intro}</p>
      {/* key={step} gives each step a fresh puzzle state */}
      <PuzzleRenderer key={step} puzzle={current.puzzle} onSolve={next} />
    </div>
  );
}
