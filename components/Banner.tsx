"use client";

import { TELEGRAM_URL } from "@/lib/data";

export default function Banner() {
  return (
    <div className="container-x pt-24 sm:pt-28">
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open FSOCIETY on Telegram"
        className="group relative block overflow-hidden rounded-2xl border border-neon/30 shadow-[0_0_40px_rgba(255,30,60,0.18)] transition-transform duration-300 hover:scale-[1.01]"
      >
        <video
          className="block h-auto w-full"
          src="/banner.mp4"
          poster="/banner-poster.png"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
      </a>
    </div>
  );
}
