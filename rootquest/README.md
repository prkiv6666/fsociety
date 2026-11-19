# RootQuest

A browser-based CTF-style puzzle game that teaches real cybersecurity concepts.
Everything is simulated: no real network requests, no real targets.

## Run it

```bash
cd rootquest
npm install
npm run dev      # open the URL it prints (usually http://localhost:5173)
npm run build    # production build into dist/
```

## Where things live

| What | File |
| --- | --- |
| Game name | `src/config.ts` → `GAME_NAME` |
| Level content | `src/levels/chapter1.ts` |
| Level schema (what fields a level has) | `src/levels/types.ts` |
| Reusable puzzle components | `src/puzzles/` |
| Picks the component for a level | `src/engine/PuzzleRenderer.tsx` |
| Saved progress (localStorage) | `src/engine/progress.ts` |
| Screens (map, level, success, settings) | `src/screens/` |
| Colors and fonts | `tailwind.config.ts` |

## Adding a level

Copy an existing level object in `src/levels/chapter1.ts`, give it a new `id`,
and change the text. Set `free: false` to put it behind the unlock.
The `puzzle.type` field picks the component: `hotspots`, `choice`, `cipher`,
`tiles`, `browser`, `terminal`, `logs` or `chain`.

## Deploying

- **Vercel**: import the repo, set *Root Directory* to `rootquest`. `vercel.json` makes `/level/11` links work.
- **Netlify**: base directory `rootquest`, build `npm run build`, publish `dist`. `public/_redirects` handles links.
- **GitHub Pages**: needs a `404.html` fallback and a `base` path in `vite.config.ts` (not set up yet).

## Note on flags

This is a static site, so anyone can read the game's JavaScript (flags included)
with real browser devtools. That's fine for a learning game. Don't rely on it for prizes.
