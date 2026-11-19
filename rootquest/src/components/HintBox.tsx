import { Button } from "./ui";

export function HintBox({ hints, used, onReveal }: { hints: [string, string]; used: number; onReveal: () => void }) {
  return (
    <div className="space-y-2">
      {hints.slice(0, used).map((h, i) => (
        <div key={i} className="rounded-md border border-line bg-raised px-3 py-2 text-sm">
          <span className="mr-2 font-mono text-accent">hint {i + 1}:</span>
          {h}
        </div>
      ))}
      {used < 2 && (
        <Button onClick={onReveal} className="text-xs">
          {used === 0 ? "Need a hint?" : "Show hint 2"}
        </Button>
      )}
    </div>
  );
}
