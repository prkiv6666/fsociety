"use client";

import { Send } from "lucide-react";
import { TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/data";
import { haptic } from "@/lib/haptics";

/**
 * Mobile-only sticky bar pinned to the bottom of the viewport with a
 * always-reachable Telegram CTA. Hidden on md+ (desktop has the navbar
 * button). Pads for the iOS home-indicator safe area.
 */
export default function MobileContactBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-base-950/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon-soft">
            Official contact
          </p>
          <p className="truncate font-mono text-xs text-zinc-400">
            {TELEGRAM_HANDLE}
          </p>
        </div>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => haptic()}
          className="btn btn-primary h-11 shrink-0 px-6"
        >
          <Send className="h-4 w-4" />
          Contact
        </a>
      </div>
    </div>
  );
}
