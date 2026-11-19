import { useState, type FormEvent } from "react";
import type { PuzzleProps } from "../engine/PuzzleRenderer";
import type { BrowserPuzzle, MockPage, PageBlock } from "../levels/types";
import { SolvedBar } from "../components/ui";

const notFound: MockPage = {
  title: "404 Not Found",
  blocks: [{ kind: "heading", text: "404 – Not Found" }, { kind: "text", text: "The page you asked for doesn't exist." }],
};

/** Turns whatever the player typed into a path like "/robots.txt". */
function parseAddress(input: string, site: string): { path: string; offsite: boolean } {
  let s = input.trim().replace(/^https?:\/\//i, "");
  if (s.toLowerCase().startsWith(site.toLowerCase())) s = s.slice(site.length);
  else if (!s.startsWith("/") && s.includes(".") && !s.startsWith("?")) return { path: s, offsite: true };
  if (!s.startsWith("/")) s = "/" + s;
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return { path: s, offsite: false };
}

function findPage(pages: Record<string, MockPage>, path: string): MockPage | undefined {
  if (pages[path]) return pages[path];
  const key = Object.keys(pages).find((k) => k.toLowerCase() === path.toLowerCase());
  return key ? pages[key] : undefined;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Fake HTML for view-source when a page doesn't define its own. */
function autoSource(page: MockPage, blocks: PageBlock[]) {
  const body = blocks
    .map((b) => {
      switch (b.kind) {
        case "heading": return `    <h1>${esc(b.text)}</h1>`;
        case "text": return `    <p>${esc(b.text)}</p>`;
        case "link": return `    <a href="${esc(b.href)}">${esc(b.text)}</a>`;
        case "code": return `    <pre>${esc(b.text)}</pre>`;
        case "list": return `    <ul>\n${b.items.map((i) => `      <li>${esc(i)}</li>`).join("\n")}\n    </ul>`;
        case "alert": return `    <div class="alert">${esc(b.text)}</div>`;
      }
    })
    .join("\n");
  return `<!DOCTYPE html>\n<html>\n  <head>\n    <title>${esc(page.title)}</title>\n  </head>\n  <body>\n${body}\n  </body>\n</html>`;
}

export function MockBrowser({ puzzle, onSolve }: PuzzleProps<BrowserPuzzle>) {
  const [history, setHistory] = useState<string[]>([puzzle.startPath]);
  const [address, setAddress] = useState(puzzle.site + puzzle.startPath);
  const [offsite, setOffsite] = useState<string | null>(null);
  const [cookies, setCookies] = useState<Record<string, string>>(puzzle.cookies ?? {});
  // The cookies the *current page* was loaded with. Edits only count after a reload,
  // just like a real browser sends cookies with each request.
  const [sentCookies, setSentCookies] = useState(cookies);
  const [showSource, setShowSource] = useState(false);
  const [devtools, setDevtools] = useState(false);
  const [solved, setSolved] = useState(false);

  const path = history[history.length - 1];
  const page = findPage(puzzle.pages, path) ?? notFound;
  const denied = page.gate && sentCookies[page.gate.cookie] !== page.gate.equals;
  const blocks = denied ? page.gate!.denied : page.blocks;
  const source = !denied && page.source ? page.source : autoSource(page, blocks);

  function visit(raw: string, withCookies = cookies) {
    const { path: p, offsite: off } = parseAddress(raw, puzzle.site);
    setShowSource(false);
    setSentCookies(withCookies);
    if (off) {
      setOffsite(p);
      setAddress(p);
      return;
    }
    setOffsite(null);
    setHistory((h) => [...h, p]);
    setAddress(puzzle.site + p);
    // Win check: reached the target page and wasn't blocked by its gate.
    const target = findPage(puzzle.pages, p);
    const blocked = target?.gate && withCookies[target.gate.cookie] !== target.gate.equals;
    if (target && !blocked && p.toLowerCase() === puzzle.win.path.toLowerCase()) setSolved(true);
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    visit(address);
  };
  const back = () => {
    if (history.length < 2) return;
    const h = history.slice(0, -1);
    setHistory(h);
    setOffsite(null);
    setShowSource(false);
    setAddress(puzzle.site + h[h.length - 1]);
  };
  const reload = () => visit(offsite ?? path, cookies);

  const renderBlock = (b: PageBlock, i: number) => {
    switch (b.kind) {
      case "heading": return <h1 key={i} className="text-xl font-bold">{b.text}</h1>;
      case "text": return <p key={i}>{b.text}</p>;
      case "link":
        return (
          <button key={i} onClick={() => visit(b.href)} className="block text-left text-[#1a55c9] underline">
            {b.text}
          </button>
        );
      case "code": return <pre key={i} className="overflow-x-auto rounded bg-black/5 p-3 font-mono text-sm whitespace-pre-wrap break-all">{b.text}</pre>;
      case "list": return <ul key={i} className="list-disc pl-5">{b.items.map((x, j) => <li key={j}>{x}</li>)}</ul>;
      case "alert":
        return (
          <div key={i} className={`rounded border px-3 py-2 text-sm ${b.tone === "success" ? "border-green-600/40 bg-green-50 text-green-900" : "border-red-600/40 bg-red-50 text-red-900"}`}>
            {b.text}
          </div>
        );
    }
  };

  const toolBtn = (on: boolean) =>
    `rounded px-2 py-1 font-mono text-xs border ${on ? "border-accent text-accent" : "border-line text-muted hover:text-ink"}`;

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-line bg-panel">
        {/* Browser chrome: back, reload, address bar */}
        <form onSubmit={submit} className="flex items-center gap-2 border-b border-line bg-raised p-2">
          <button type="button" onClick={back} disabled={history.length < 2} className="px-1 text-muted hover:text-ink disabled:opacity-30" aria-label="Back">←</button>
          <button type="button" onClick={reload} className="px-1 text-muted hover:text-ink" aria-label="Reload">↻</button>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="min-w-0 flex-1 rounded border border-line bg-base px-3 py-1.5 font-mono text-[16px] sm:text-sm outline-none focus:border-accent"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Address bar"
          />
          <button type="submit" className="rounded border border-line px-2 py-1 font-mono text-xs text-muted hover:text-accent">Go</button>
        </form>
        {(puzzle.tools.viewSource || puzzle.tools.devtools) && (
          <div className="flex gap-2 border-b border-line px-2 py-1.5">
            {puzzle.tools.viewSource && <button className={toolBtn(showSource)} onClick={() => setShowSource((v) => !v)}>view-source</button>}
            {puzzle.tools.devtools && <button className={toolBtn(devtools)} onClick={() => setDevtools((v) => !v)}>devtools</button>}
          </div>
        )}

        {/* Page area */}
        {offsite ? (
          <div className="bg-[#f4f5f2] p-5 text-[#1b1f1d]">
            <h1 className="text-lg font-bold">This site can't be reached</h1>
            <p className="mt-2 text-sm">This training browser can only open <b>{puzzle.site}</b>. Nothing in this game touches the real internet.</p>
          </div>
        ) : showSource ? (
          <pre className="max-h-[420px] overflow-auto bg-[#050607] p-3 font-mono text-xs leading-relaxed text-ink">
            {source.split("\n").map((l, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-6 shrink-0 select-none text-right text-muted/50">{i + 1}</span>
                <span className={`whitespace-pre-wrap break-all ${l.trim().startsWith("<!--") ? "text-accent/80" : ""}`}>{l}</span>
              </div>
            ))}
          </pre>
        ) : (
          <div className="min-h-[220px] space-y-3 bg-[#f4f5f2] p-5 text-[#1b1f1d]">{blocks.map(renderBlock)}</div>
        )}

        {/* Devtools: editable cookies */}
        {devtools && (
          <div className="border-t border-line bg-[#0a0e0f] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-accent">Application › Cookies › {puzzle.site}</span>
            </div>
            {Object.keys(cookies).length === 0 ? (
              <p className="text-xs text-muted">No cookies.</p>
            ) : (
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="py-1 pr-2 font-normal">Name</th>
                    <th className="py-1 font-normal">Value (editable)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(cookies).map(([name, value]) => (
                    <tr key={name} className="border-t border-line">
                      <td className="py-1.5 pr-2 align-middle">{name}</td>
                      <td className="py-1.5">
                        <input
                          value={value}
                          onChange={(e) => setCookies((c) => ({ ...c, [name]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && reload()}
                          className="w-full rounded border border-line bg-base px-2 py-1 text-[16px] sm:text-xs outline-none focus:border-accent"
                          spellCheck={false}
                          autoCapitalize="off"
                          aria-label={`Cookie ${name}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="mt-2 text-xs text-muted">Changed a cookie? Press ↻ reload so the browser sends it to the server.</p>
          </div>
        )}
      </div>
      {solved && <SolvedBar onContinue={onSolve} />}
    </div>
  );
}
