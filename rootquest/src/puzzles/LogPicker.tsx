import { useState } from "react";
import type { PuzzleProps } from "../engine/PuzzleRenderer";
import type { LogsPuzzle } from "../levels/types";
import { Button, Feedback, SolvedBar } from "../components/ui";

export function LogPicker({ puzzle, onSolve }: PuzzleProps<LogsPuzzle>) {
  const [picked, setPicked] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const solved = feedback?.ok === true;
  const badCount = puzzle.lines.filter((l) => l.bad).length;

  const toggle = (i: number) => {
    if (solved) return;
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
    setFeedback(null);
  };

  function check() {
    const hits = picked.filter((i) => puzzle.lines[i].bad).length;
    const falseAlarms = picked.length - hits;
    if (hits === badCount && falseAlarms === 0) {
      setFeedback({ ok: true, text: `All ${badCount} malicious lines flagged, no false alarms.` });
    } else {
      const parts = [`${hits}/${badCount} malicious lines found`];
      if (falseAlarms) parts.push(`${falseAlarms} normal line${falseAlarms > 1 ? "s" : ""} flagged by mistake`);
      setFeedback({ ok: false, text: parts.join(", ") + "." });
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">{puzzle.instruction}</p>
        <span className="font-mono text-sm text-accent">flagged: {picked.length}</span>
      </div>
      <div className="mt-3 max-h-[420px] overflow-y-auto rounded-md border border-line bg-[#050607] py-1 font-mono text-xs sm:text-[13px]">
        {puzzle.lines.map((l, i) => {
          const on = picked.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`flex w-full gap-3 px-3 py-1 text-left transition ${on ? "bg-danger/15 text-ink" : "text-muted hover:bg-raised hover:text-ink"}`}
            >
              <span className="w-6 shrink-0 select-none text-right opacity-50">{i + 1}</span>
              <span className={`w-3 shrink-0 ${on ? "text-danger" : "opacity-0"}`}>⚑</span>
              <span className="min-w-0 whitespace-pre-wrap break-all">{l.text}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3">
        <Button variant="primary" onClick={check} disabled={solved || picked.length === 0}>
          Report flagged lines
        </Button>
      </div>
      {feedback && <Feedback ok={feedback.ok}>{feedback.text}</Feedback>}
      {solved && <SolvedBar onContinue={onSolve} />}
    </div>
  );
}
