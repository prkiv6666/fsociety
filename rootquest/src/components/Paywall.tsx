import { Link } from "react-router-dom";
import { GAME_NAME } from "../config";
import { useProgress } from "../engine/useProgress";
import { Button, Panel } from "./ui";

// Real payments come later. For now this button just flips the "unlocked" flag.
export function Paywall({ levelTitle }: { levelTitle: string }) {
  const { setUnlocked } = useProgress();
  return (
    <Panel className="p-6 text-center">
      <div className="font-mono text-3xl text-accent">🔒</div>
      <h2 className="mt-2 text-xl font-semibold">"{levelTitle}" is part of the full chapter</h2>
      <p className="mt-2 text-muted">
        Levels 1–6 are free. Unlock levels 7–15 to learn web hacking, injection attacks and log forensics in {GAME_NAME}.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={() => setUnlocked(true)}>
          Unlock full chapter (demo)
        </Button>
        <Link to="/">
          <Button>Back to map</Button>
        </Link>
      </div>
      <p className="mt-3 text-xs text-muted">Demo build: no payment is taken.</p>
    </Panel>
  );
}
