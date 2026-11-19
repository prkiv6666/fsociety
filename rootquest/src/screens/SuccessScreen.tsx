import { useState } from "react";
import { Link } from "react-router-dom";
import { GAME_NAME } from "../config";
import { getLevel } from "../levels";
import type { Level } from "../levels/types";
import { Button, Panel } from "../components/ui";

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function SuccessScreen({ level, hintsUsed }: { level: Level; hintsUsed: number }) {
  const [shareMsg, setShareMsg] = useState("");
  const [flagCopied, setFlagCopied] = useState(false);
  const next = getLevel(level.id + 1);
  const url = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}/level/${level.id}`;

  async function share() {
    const text = `Can you beat level ${level.id} of ${GAME_NAME}: "${level.title}"?`;
    // Phones: open the native share sheet. Desktop: copy the link.
    if (navigator.share) {
      try {
        await navigator.share({ title: GAME_NAME, text, url });
        return;
      } catch {
        /* user cancelled: fall through to copy */
      }
    }
    setShareMsg((await copy(url)) ? "Link copied!" : url);
  }

  return (
    <div className="space-y-4">
      <Panel className="border-accent/50 p-6 text-center">
        <div className="font-mono text-xs text-muted">LEVEL {level.id} COMPLETE</div>
        <h1 className="mt-1 text-2xl font-semibold">{level.title}</h1>
        <button
          onClick={async () => setFlagCopied(await copy(level.flag))}
          className="mt-4 inline-block max-w-full break-all rounded-md border border-accent/60 bg-accent/10 px-4 py-2 font-mono text-lg text-accent glow"
          title="Copy flag"
        >
          {level.flag}
        </button>
        <div className="mt-1 h-4 text-xs text-muted">{flagCopied ? "copied" : ""}</div>
        <p className="font-mono text-xs text-muted">
          hints used: {hintsUsed}/2 {hintsUsed === 0 && <span className="text-accent">· clean run!</span>}
        </p>
      </Panel>

      <Panel className="p-5">
        <div className="font-mono text-xs text-accent">// what you learned</div>
        <h2 className="mt-1 text-lg font-semibold">{level.lesson.title}</h2>
        <div className="mt-2 space-y-3 leading-relaxed">
          {level.lesson.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {level.lesson.realWorld && (
          <div className="mt-4 rounded-md border border-line bg-raised p-3 text-sm">
            <span className="font-mono text-accent">protect yourself: </span>
            {level.lesson.realWorld}
          </div>
        )}
      </Panel>

      <div className="flex flex-wrap gap-3">
        {next ? (
          <Link to={`/level/${next.id}`}>
            <Button variant="primary">Next level →</Button>
          </Link>
        ) : (
          <Link to="/">
            <Button variant="primary">Back to map</Button>
          </Link>
        )}
        <Button onClick={share}>Share this level</Button>
        <Link to="/">
          <Button>Level map</Button>
        </Link>
      </div>
      {shareMsg && <p className="break-all font-mono text-xs text-muted">{shareMsg}</p>}
    </div>
  );
}
