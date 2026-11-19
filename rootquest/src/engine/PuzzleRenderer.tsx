import type { Puzzle } from "../levels/types";
import { Hotspots } from "../puzzles/Hotspots";
import { Choice } from "../puzzles/Choice";
import { CipherWheel } from "../puzzles/CipherWheel";
import { TileBuilder } from "../puzzles/TileBuilder";
import { MockBrowser } from "../puzzles/MockBrowser";
import { MockTerminal } from "../puzzles/MockTerminal";
import { LogPicker } from "../puzzles/LogPicker";
import { Chain } from "../puzzles/Chain";

// Every puzzle component gets the same two props:
//   puzzle  – its data from the level file
//   onSolve – call this when the player wins
export type PuzzleProps<P> = { puzzle: P; onSolve: () => void };

export function PuzzleRenderer({ puzzle, onSolve }: PuzzleProps<Puzzle>) {
  switch (puzzle.type) {
    case "hotspots":
      return <Hotspots puzzle={puzzle} onSolve={onSolve} />;
    case "choice":
      return <Choice puzzle={puzzle} onSolve={onSolve} />;
    case "cipher":
      return <CipherWheel puzzle={puzzle} onSolve={onSolve} />;
    case "tiles":
      return <TileBuilder puzzle={puzzle} onSolve={onSolve} />;
    case "browser":
      return <MockBrowser puzzle={puzzle} onSolve={onSolve} />;
    case "terminal":
      return <MockTerminal puzzle={puzzle} onSolve={onSolve} />;
    case "logs":
      return <LogPicker puzzle={puzzle} onSolve={onSolve} />;
    case "chain":
      return <Chain puzzle={puzzle} onSolve={onSolve} />;
  }
}
