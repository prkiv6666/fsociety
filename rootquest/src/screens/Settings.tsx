import { useState } from "react";
import { GAME_NAME } from "../config";
import { useProgress } from "../engine/useProgress";
import { storageAvailable } from "../engine/progress";
import { Button, Panel } from "../components/ui";

export function Settings() {
  const { completed, unlocked, setUnlocked, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [msg, setMsg] = useState("");
  const canSave = storageAvailable();

  return (
    <div className="space-y-4">
      <h1 className="font-mono text-2xl font-semibold">Settings</h1>

      <Panel className="p-5">
        <h2 className="font-semibold">Progress</h2>
        <p className="mt-1 text-sm text-muted">
          {completed.length} level{completed.length === 1 ? "" : "s"} completed. Progress is saved in this browser only.
        </p>
        {!canSave && (
          <p className="mt-2 text-sm text-danger">
            Your browser is blocking storage (private mode?), so progress will be lost when you close the tab.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {!confirming ? (
            <Button variant="danger" onClick={() => { setConfirming(true); setMsg(""); }}>
              Reset progress
            </Button>
          ) : (
            <>
              <Button variant="danger" onClick={() => { reset(); setConfirming(false); setMsg("Progress wiped."); }}>
                Yes, erase everything
              </Button>
              <Button onClick={() => setConfirming(false)}>Cancel</Button>
            </>
          )}
        </div>
        {msg && <p className="mt-2 font-mono text-xs text-accent">{msg}</p>}
      </Panel>

      <Panel className="p-5">
        <h2 className="font-semibold">Full chapter</h2>
        <p className="mt-1 text-sm text-muted">
          {unlocked ? "Levels 7–15 are unlocked." : "Levels 7–15 are locked."} Payments aren't built yet, so this is a demo switch.
        </p>
        <div className="mt-4">
          <Button variant={unlocked ? "ghost" : "primary"} onClick={() => setUnlocked(!unlocked)}>
            {unlocked ? "Lock again (testing)" : "Unlock (demo)"}
          </Button>
        </div>
      </Panel>

      <p className="text-center font-mono text-xs text-muted">{GAME_NAME} v0.1</p>
    </div>
  );
}
