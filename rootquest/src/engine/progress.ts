import { STORAGE_KEY } from "../config";

export type Progress = {
  completed: number[]; // level ids
  hintsUsed: Record<string, number>; // level id → 0, 1 or 2
  unlocked: boolean; // paid levels unlocked (stubbed for now)
};

export const emptyProgress = (): Progress => ({ completed: [], hintsUsed: {}, unlocked: false });

// Every storage call is wrapped in try/catch: private browsing or blocked
// cookies can make localStorage throw, and the game must still work.
export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const p = JSON.parse(raw);
    return {
      completed: Array.isArray(p.completed) ? p.completed.filter((n: unknown) => typeof n === "number") : [],
      hintsUsed: p.hintsUsed && typeof p.hintsUsed === "object" ? p.hintsUsed : {},
      unlocked: p.unlocked === true,
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export function storageAvailable(): boolean {
  try {
    const k = STORAGE_KEY + ".test";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}
