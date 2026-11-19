import { chapter1 } from "./chapter1";
import type { Level } from "./types";

// Add future chapters here.
export const LEVELS: Level[] = [...chapter1];

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function isPlayable(level: Level, unlocked: boolean): boolean {
  return level.free || unlocked;
}
