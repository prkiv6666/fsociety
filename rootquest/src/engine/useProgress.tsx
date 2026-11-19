import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { emptyProgress, loadProgress, saveProgress, type Progress } from "./progress";

type ProgressApi = Progress & {
  completeLevel: (id: number) => void;
  revealHint: (id: number) => void;
  setUnlocked: (v: boolean) => void;
  reset: () => void;
};

const Ctx = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  // Save whenever progress changes.
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLevel = useCallback((id: number) => {
    setProgress((p) => (p.completed.includes(id) ? p : { ...p, completed: [...p.completed, id] }));
  }, []);

  const revealHint = useCallback((id: number) => {
    setProgress((p) => {
      const used = p.hintsUsed[id] ?? 0;
      return used >= 2 ? p : { ...p, hintsUsed: { ...p.hintsUsed, [id]: used + 1 } };
    });
  }, []);

  const setUnlocked = useCallback((v: boolean) => setProgress((p) => ({ ...p, unlocked: v })), []);
  const reset = useCallback(() => setProgress(emptyProgress()), []);

  const api = useMemo(
    () => ({ ...progress, completeLevel, revealHint, setUnlocked, reset }),
    [progress, completeLevel, revealHint, setUnlocked, reset],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useProgress(): ProgressApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProgress must be used inside <ProgressProvider>");
  return v;
}
