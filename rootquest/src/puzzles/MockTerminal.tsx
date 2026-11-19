import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { PuzzleProps } from "../engine/PuzzleRenderer";
import type { TerminalPuzzle } from "../levels/types";
import { Button, Feedback, SolvedBar } from "../components/ui";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const unquote = (s: string) => s.replace(/^(['"])(.*)\1$/, "$2");

function b64decode(s: string): string | null {
  try {
    const bin = atob(s.replace(/\s+/g, ""));
    return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
}
function b64encode(s: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(s)));
}

type Out = { text: string; error?: boolean };

export function MockTerminal({ puzzle, onSolve }: PuzzleProps<TerminalPuzzle>) {
  const files = puzzle.files ?? {};
  const prompt = `player@${puzzle.host}:~$`;
  const [lines, setLines] = useState<{ kind: "in" | "out" | "err"; text: string }[]>(
    puzzle.motd ? [{ kind: "out", text: puzzle.motd }] : [],
  );
  const [input, setInput] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [pastIdx, setPastIdx] = useState(-1);
  const [solved, setSolved] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answerWrong, setAnswerWrong] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  // Runs one command (no pipes). `stdin` is the output of the previous command.
  function runOne(cmdline: string, stdin: string | null): Out {
    const parts = cmdline.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
    const [cmd, ...args] = parts;
    const plain = args.map(unquote);
    switch (cmd) {
      case "help":
        return {
          text: [
            "Available commands:",
            "  ls                 list files",
            "  cat <file>         print a file",
            "  echo <text>        print text",
            "  base64 [-d] [file] encode / decode base64 (-d = decode)",
            "  whoami, pwd, clear",
            ...Object.keys(puzzle.commands ?? {}).map((c) => `  ${c}`),
            "Tip: pipes work, e.g.  echo aGk= | base64 -d",
          ].join("\n"),
        };
      case "ls":
        return { text: Object.keys(files).join("  ") };
      case "cat": {
        if (!plain.length) return stdin !== null ? { text: stdin } : { text: "cat: missing file name", error: true };
        const outs = plain.map((f) => (f in files ? files[f] : null));
        const missing = plain.find((f) => !(f in files));
        if (missing) return { text: `cat: ${missing}: No such file or directory`, error: true };
        return { text: outs.join("\n") };
      }
      case "echo":
        return { text: plain.join(" ") };
      case "whoami":
        return { text: "player" };
      case "pwd":
        return { text: "/home/player" };
      case "base64": {
        const decode = plain.includes("-d") || plain.includes("--decode");
        const file = plain.find((a) => !a.startsWith("-"));
        let data = stdin;
        if (file) {
          if (!(file in files)) return { text: `base64: ${file}: No such file or directory`, error: true };
          data = files[file];
        }
        if (data === null) return { text: "base64: give me a file, or pipe text in with |", error: true };
        if (!decode) return { text: b64encode(data.replace(/\n$/, "")) };
        const out = b64decode(data);
        return out === null ? { text: "base64: invalid input", error: true } : { text: out };
      }
      case undefined:
        return { text: "" };
      default:
        return { text: `${cmd}: command not found (type "help")`, error: true };
    }
  }

  function run(raw: string) {
    const cmd = norm(raw);
    const newLines = [...lines, { kind: "in" as const, text: raw }];
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    let out: Out;
    // Scripted commands from the level data win over built-ins.
    const scripted = Object.entries(puzzle.commands ?? {}).find(([k]) => norm(k) === cmd);
    if (scripted) out = { text: scripted[1] };
    else {
      out = { text: "" };
      let stdin: string | null = null;
      for (const segment of cmd.split("|").map((s) => s.trim())) {
        out = runOne(segment, stdin);
        if (out.error) break;
        stdin = out.text;
      }
    }
    if (out.text) newLines.push({ kind: out.error ? "err" : "out", text: out.text });
    setLines(newLines);

    const w = puzzle.win;
    if ((w.kind === "command" && cmd === norm(w.equals)) || (w.kind === "output" && !out.error && out.text.includes(w.includes))) {
      setSolved(true);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (solved) return;
    run(input);
    if (input.trim()) setPast((p) => [...p, input]);
    setPastIdx(-1);
    setInput("");
  }

  // Up/down arrows walk through previous commands, like a real shell.
  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    if (!past.length) return;
    let i = pastIdx === -1 ? past.length : pastIdx;
    i = e.key === "ArrowUp" ? Math.max(0, i - 1) : i + 1;
    if (i >= past.length) {
      setPastIdx(-1);
      setInput("");
    } else {
      setPastIdx(i);
      setInput(past[i]);
    }
  }

  function checkAnswer(e: FormEvent) {
    e.preventDefault();
    if (puzzle.win.kind !== "answer") return;
    const ok = norm(answer).toLowerCase() === norm(puzzle.win.equals).toLowerCase();
    setAnswerWrong(!ok);
    if (ok) setSolved(true);
  }

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-line bg-[#050607]" onClick={() => inputRef.current?.focus()}>
        <div className="flex items-center gap-1.5 border-b border-line bg-raised px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="ml-2 font-mono text-xs text-muted">{puzzle.host} — terminal</span>
        </div>
        <div ref={scrollRef} className="h-[300px] overflow-y-auto p-3 font-mono text-[13px] leading-relaxed">
          {lines.map((l, i) => (
            <div key={i} className={`whitespace-pre-wrap break-all ${l.kind === "err" ? "text-danger" : l.kind === "in" ? "text-ink" : "text-muted"}`}>
              {l.kind === "in" && <span className="text-accent">{prompt} </span>}
              {l.text}
            </div>
          ))}
          <form onSubmit={submit} className="flex gap-2">
            <span className="shrink-0 text-accent">{prompt}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={solved}
              className="min-w-0 flex-1 bg-transparent text-[16px] sm:text-[13px] text-ink caret-accent outline-none"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              aria-label="Terminal input"
            />
          </form>
        </div>
      </div>

      {puzzle.win.kind === "answer" && !solved && (
        <form onSubmit={checkAnswer} className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-sm text-muted" htmlFor="answer">{puzzle.win.prompt}</label>
          <input
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-w-0 flex-1 rounded border border-line bg-raised px-3 py-1.5 font-mono text-[16px] sm:text-sm outline-none focus:border-accent"
            spellCheck={false}
            autoCapitalize="off"
          />
          <Button variant="primary" type="submit">Submit</Button>
        </form>
      )}
      {answerWrong && !solved && <Feedback ok={false}>Not quite. Look at the terminal output again.</Feedback>}
      {solved && <SolvedBar onContinue={onSolve} />}
    </div>
  );
}
