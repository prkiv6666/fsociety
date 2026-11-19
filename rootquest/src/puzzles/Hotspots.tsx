import { useState } from "react";
import type { PuzzleProps } from "../engine/PuzzleRenderer";
import type { HotspotsPuzzle, Line } from "../levels/types";
import { Feedback, SolvedBar } from "../components/ui";

export function Hotspots({ puzzle, onSolve }: PuzzleProps<HotspotsPuzzle>) {
  const [found, setFound] = useState<string[]>([]);
  const [misses, setMisses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const done = found.length >= puzzle.required;

  function click(id: string) {
    const spot = puzzle.spots[id];
    if (!spot || done) return;
    setFeedback({ ok: spot.correct, text: spot.explain });
    if (spot.correct) setFound((f) => (f.includes(id) ? f : [...f, id]));
    else setMisses((m) => (m.includes(id) ? m : [...m, id]));
  }

  // Renders one line: plain text stays plain, spots become tappable.
  // Spots look like normal text on purpose, so they don't give themselves away.
  const renderLine = (line: Line) =>
    line.map((seg, i) => {
      if (typeof seg === "string") return <span key={i}>{seg}</span>;
      const isFound = found.includes(seg.spot);
      const isMiss = misses.includes(seg.spot);
      return (
        <span
          key={i}
          role="button"
          tabIndex={0}
          onClick={() => click(seg.spot)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && click(seg.spot)}
          className={`cursor-pointer rounded transition hover:bg-black/5 ${
            isFound ? "bg-accent/35 outline outline-1 outline-[#1f9a0a]" : ""
          } ${isMiss ? "text-black/40 line-through" : ""}`}
        >
          {seg.text}
        </span>
      );
    });

  const doc = puzzle.doc;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">{puzzle.instruction}</p>
        <span className="font-mono text-sm text-accent">
          red flags: {found.length}/{puzzle.required}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-[#f4f5f2] text-[#1b1f1d]">
        {doc.kind === "email" ? (
          <>
            <div className="space-y-1 border-b border-black/10 bg-white px-4 py-3 text-sm">
              {doc.headers.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <span className="w-16 shrink-0 text-black/50">{h.label}</span>
                  <span className="min-w-0 break-words">{renderLine(h.value)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 px-4 py-4 text-[15px] leading-relaxed">
              {doc.body.map((line, i) => (
                <p key={i} className="break-words">
                  {renderLine(line)}
                </p>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-black/10 bg-white px-4 py-2 font-mono text-xs">{renderLine(doc.url)}</div>
            <div className="space-y-3 px-4 py-4">
              {doc.body.map((line, i) => (
                <p key={i} className="break-words">
                  {renderLine(line)}
                </p>
              ))}
            </div>
          </>
        )}
      </div>

      {feedback && <Feedback ok={feedback.ok}>{feedback.text}</Feedback>}
      {done && <SolvedBar onContinue={onSolve} />}
    </div>
  );
}
