import { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS, getLevel, isPlayable } from "../levels";
import { useProgress } from "../engine/useProgress";
import { PuzzleRenderer } from "../engine/PuzzleRenderer";
import { HintBox } from "../components/HintBox";
import { Paywall } from "../components/Paywall";
import { Panel } from "../components/ui";
import { SuccessScreen } from "./SuccessScreen";

export function LevelScreen({ id }: { id: number }) {
  const level = getLevel(id);
  const { completed, hintsUsed, unlocked, completeLevel, revealHint } = useProgress();
  const [solved, setSolved] = useState(false);

  if (!level) {
    return (
      <Panel className="p-6 text-center">
        <p className="font-mono text-danger">404: level {Number.isNaN(id) ? "?" : id} not found</p>
        <Link to="/" className="mt-3 inline-block text-accent underline">Back to the map</Link>
      </Panel>
    );
  }

  const header = (
    <div className="mb-4">
      <div className="font-mono text-xs text-muted">
        LEVEL {level.id} / {LEVELS.length}
        {completed.includes(level.id) && <span className="ml-2 text-accent">✓ completed</span>}
      </div>
      <h1 className="mt-1 text-2xl font-semibold">{level.title}</h1>
    </div>
  );

  if (!isPlayable(level, unlocked)) {
    return (
      <>
        {header}
        <Paywall levelTitle={level.title} />
      </>
    );
  }

  if (solved) return <SuccessScreen level={level} hintsUsed={hintsUsed[level.id] ?? 0} />;

  const handleSolve = () => {
    completeLevel(level.id);
    setSolved(true);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {header}
      <Panel className="mb-4 p-4">
        <div className="mb-1 font-mono text-xs text-accent">// mission</div>
        <p>{level.briefing}</p>
      </Panel>
      <Panel className="p-4">
        <PuzzleRenderer puzzle={level.puzzle} onSolve={handleSolve} />
      </Panel>
      <div className="mt-4">
        <HintBox hints={level.hints} used={hintsUsed[level.id] ?? 0} onReveal={() => revealHint(level.id)} />
      </div>
    </div>
  );
}
