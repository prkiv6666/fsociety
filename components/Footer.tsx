import { Send } from "lucide-react";
import { Wordmark } from "./Logo";
import { navLinks, TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-base-950/60 backdrop-blur-sm">
      <div className="container-x py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <Wordmark className="text-3xl" />
            <p className="mt-3 max-w-xs font-mono text-xs uppercase tracking-[0.3em] text-neon-soft">
              Private • Secure • Fast
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-neon"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost h-11"
          >
            <Send className="h-4 w-4" />
            {TELEGRAM_HANDLE}
          </a>
        </div>

        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[11px] text-zinc-600">
            © {new Date().getFullYear()} FSOCIETY SERVICES. All rights reserved.
          </p>
          <p className="font-mono text-[11px] text-zinc-600">
            Official contact only: {TELEGRAM_HANDLE}
          </p>
        </div>
      </div>
    </footer>
  );
}
