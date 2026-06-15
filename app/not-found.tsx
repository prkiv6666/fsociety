import type { Metadata } from "next";
import Link from "next/link";
import { Home, Send } from "lucide-react";
import Background from "@/components/Background";
import DecryptText from "@/components/DecryptText";
import { TELEGRAM_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "404 — Signal Lost | FSOCIETY SERVICES",
};

export default function NotFound() {
  return (
    <>
      <Background />
      <main className="relative flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center">
        <span className="eyebrow rounded-full border border-neon/30 bg-neon/5 px-4 py-1.5">
          [ ERROR ]
        </span>

        <h1 className="logo-glitch metallic mt-8 font-gothic text-8xl font-extrabold leading-none tracking-[0.04em] sm:text-9xl">
          404
        </h1>

        <p className="mt-6 font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-white sm:text-3xl">
          <DecryptText text="Signal Lost" />
        </p>

        <p className="mt-4 max-w-md font-mono text-sm uppercase tracking-[0.3em] text-neon-soft">
          Access denied
        </p>

        <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400">
          This page has been wiped from the grid — the link is dead or never
          existed. Let&apos;s get you back to safety.
        </p>

        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href="/" className="btn btn-primary w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost w-full sm:w-auto"
          >
            <Send className="h-4 w-4" />
            Contact on Telegram
          </a>
        </div>
      </main>
    </>
  );
}
