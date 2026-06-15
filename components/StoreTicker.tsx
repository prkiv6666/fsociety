"use client";

import { stores } from "@/lib/data";

/**
 * Infinite, seamless marquee of supported store names. The list is
 * rendered twice and translated by -50% so the loop is gapless; it pauses
 * on hover and is disabled under prefers-reduced-motion (see globals.css).
 */
export default function StoreTicker() {
  const names = stores.map((s) => s.name);
  if (names.length === 0) return null;
  const row = [...names, ...names];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-base-950/40 py-4">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-base-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-base-950 to-transparent" />

      <div className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {row.map((name, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-zinc-500 transition-colors hover:text-neon">
              {name}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-neon/50 shadow-neon-sm" />
          </span>
        ))}
      </div>
    </div>
  );
}
