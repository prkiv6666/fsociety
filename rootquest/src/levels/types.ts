// ─────────────────────────────────────────────────────────────
// The level "schema": the shape every level in chapterN.ts must follow.
// Puzzle components read this data; they never hard-code a level.
// ─────────────────────────────────────────────────────────────

export type Level = {
  id: number; // also the URL: /level/11
  title: string;
  briefing: string; // mission text shown above the puzzle
  free: boolean; // false = needs the "unlocked" flag
  hints: [string, string]; // exactly two, revealed in order
  flag: string; // FLAG{...}, revealed when solved
  lesson: {
    title: string;
    body: string[]; // short paragraphs
    realWorld?: string; // "how to protect yourself" tip
  };
  puzzle: Puzzle;
};

export type Puzzle =
  | HotspotsPuzzle
  | ChoicePuzzle
  | CipherPuzzle
  | TilesPuzzle
  | BrowserPuzzle
  | TerminalPuzzle
  | LogsPuzzle
  | ChainPuzzle;

// ── 1. Hotspots: click the suspicious parts of an email or page ──
// A line is a list of pieces: plain text, or a clickable "spot".
export type Segment = string | { spot: string; text: string };
export type Line = Segment[];

export type HotspotsPuzzle = {
  type: "hotspots";
  instruction: string;
  doc:
    | { kind: "email"; headers: { label: string; value: Line }[]; body: Line[] }
    | { kind: "page"; url: Line; body: Line[] };
  // Every spot id used in `doc` must be listed here.
  spots: Record<string, { correct: boolean; explain: string }>;
  required: number; // how many correct spots to find
};

// ── 2. Choice: pick the one correct option ──
export type ChoicePuzzle = {
  type: "choice";
  prompt: string;
  context?: string;
  mono?: boolean; // show options in monospace (URLs, passwords…)
  options: { id: string; label: string; explain: string }[];
  answer: string; // id of the correct option
};

// ── 3. CipherWheel: rotate to decode a Caesar shift ──
export type CipherPuzzle = {
  type: "cipher";
  ciphertext: string;
  shift: number; // how far each letter was moved forward to encrypt
};

// ── 4. TileBuilder: put tiles in order to build a payload ──
export type TilesPuzzle = {
  type: "tiles";
  instruction: string;
  // The vulnerable code; "{payload}" is replaced by the player's tiles.
  template: string;
  tiles: string[]; // includes decoys
  answer: string[]; // correct tiles, in order
  alsoAccept?: string[][]; // other valid orders
  successOutput: string; // what the "server" does when the payload works
};

// ── 5. MockBrowser: fake browser + view-source + devtools cookies ──
export type PageBlock =
  | { kind: "heading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; href: string }
  | { kind: "code"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "alert"; text: string; tone?: "error" | "success" };

export type MockPage = {
  title: string;
  blocks: PageBlock[];
  source?: string; // custom HTML for view-source (auto-generated if missing)
  // Only shown if a cookie has the right value; otherwise `denied` is shown.
  gate?: { cookie: string; equals: string; denied: PageBlock[] };
};

export type BrowserPuzzle = {
  type: "browser";
  site: string; // fake hostname, e.g. "shop.example"
  startPath: string;
  pages: Record<string, MockPage>; // key = path (+ query), e.g. "/account?user=5"
  cookies?: Record<string, string>;
  tools: { viewSource?: boolean; devtools?: boolean };
  win: { kind: "visit"; path: string };
};

// ── 6. MockTerminal: a fake shell with a few commands ──
// Built-ins: help, ls, cat, echo, base64, clear, whoami, pwd (pipes "|" work).
export type TerminalPuzzle = {
  type: "terminal";
  host: string;
  files?: Record<string, string>;
  commands?: Record<string, string>; // exact command → scripted output
  motd?: string; // message shown when the terminal opens
  win:
    | { kind: "command"; equals: string } // ran this exact command
    | { kind: "output"; includes: string } // any output contained this
    | { kind: "answer"; prompt: string; equals: string }; // typed answer in a box
};

// ── 7. LogPicker: click the malicious lines in a log ──
export type LogsPuzzle = {
  type: "logs";
  instruction: string;
  lines: { text: string; bad: boolean }[];
};

// ── Chain: several puzzles in a row (final mission) ──
export type ChainPuzzle = {
  type: "chain";
  steps: { title: string; intro: string; puzzle: Exclude<Puzzle, ChainPuzzle> }[];
};
