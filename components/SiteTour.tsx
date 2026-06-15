"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X, Pause, MapPin } from "lucide-react";

const SEEN_KEY = "fsociety_tour_seen_v1";
const STEP_MS = 3600; // time spent on each section

type TourStep = { id: string; label: string; text: string };

const steps: TourStep[] = [
  {
    id: "home",
    label: "Welcome",
    text: "FSOCIETY — your private, secure service channel. Let us show you around.",
  },
  {
    id: "stores",
    label: "Supported Stores",
    text: "Browse 25+ stores. Tap any card for live limits, timeframes and fees.",
  },
  {
    id: "services",
    label: "Services",
    text: "Everything we offer, handled around the clock.",
  },
  {
    id: "how-it-works",
    label: "How It Works",
    text: "Getting started is simple — you bring the order, we do the rest.",
  },
  {
    id: "vouches",
    label: "Vouches & Proof",
    text: "Real, transparent proof — swipe through our vouches.",
  },
  {
    id: "contact",
    label: "Get In Touch",
    text: "Ready when you are — reach us on Telegram.",
  },
];

export default function SiteTour() {
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback((markSeen = true) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setRunning(false);
    setPaused(false);
    setStep(0);
    if (markSeen && typeof window !== "undefined") {
      localStorage.setItem(SEEN_KEY, "1");
    }
  }, []);

  const start = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setStep(0);
    setPaused(false);
    setRunning(true);
  }, []);

  // Auto-start on first visit only — but wait until the intro screen finishes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(SEEN_KEY)) return;

    let delay: ReturnType<typeof setTimeout>;
    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      delay = setTimeout(() => start(), 700);
    };

    // Start once the intro signals it's done…
    window.addEventListener("fsociety:intro-done", begin, { once: true });
    // …with a safety fallback in case that event was already missed.
    const fallback = setTimeout(begin, 4000);

    return () => {
      clearTimeout(delay);
      clearTimeout(fallback);
      window.removeEventListener("fsociety:intro-done", begin);
    };
  }, [start]);

  // Drive the tour: scroll to the current step, then advance.
  useEffect(() => {
    if (!running || paused) return;

    const el = document.getElementById(steps[step].id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });

    timer.current = setTimeout(() => {
      if (step >= steps.length - 1) {
        stop(true);
      } else {
        setStep((s) => s + 1);
      }
    }, STEP_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [running, paused, step, stop]);

  // Let the visitor take over: any manual scroll/keypress ends the tour.
  useEffect(() => {
    if (!running) return;
    const end = () => stop(true);
    const opts = { passive: true } as AddEventListenerOptions;
    window.addEventListener("wheel", end, opts);
    window.addEventListener("touchmove", end, opts);
    const onKey = (e: KeyboardEvent) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
          e.key,
        )
      )
        end();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", end, opts);
      window.removeEventListener("touchmove", end, opts);
      window.removeEventListener("keydown", onKey);
    };
  }, [running, stop]);

  return (
    <>
      {/* Replay button — visible when tour isn't running */}
      <AnimatePresence>
        {!running && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={start}
            className="fixed bottom-24 right-5 z-[60] inline-flex items-center gap-2 rounded-full border border-neon/40 bg-base-950/80 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-neon shadow-neon-sm backdrop-blur transition-colors hover:border-neon hover:bg-neon/10 md:bottom-5"
            aria-label="Take the tour"
          >
            <Play className="h-4 w-4 fill-neon" />
            Take the tour
          </motion.button>
        )}
      </AnimatePresence>

      {/* Caption banner — visible while the tour runs */}
      <AnimatePresence>
        {running && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-5"
          >
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neon/30 bg-base-950/90 shadow-neon-sm backdrop-blur-xl">
              <div className="flex items-start gap-3 p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-neon/40 bg-neon/10 text-neon">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-sm font-bold text-white">
                      {steps[step].label}
                    </p>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {step + 1} / {steps.length}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {steps[step].text}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? "Resume tour" : "Pause tour"}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:border-neon/50 hover:text-neon"
                  >
                    {paused ? (
                      <Play className="h-3.5 w-3.5" />
                    ) : (
                      <Pause className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => stop(true)}
                    aria-label="End tour"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:border-neon/50 hover:text-neon"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {/* progress bar */}
              <div className="h-1 w-full bg-white/5">
                <motion.div
                  key={step + (paused ? "p" : "r")}
                  className="h-full bg-neon shadow-neon"
                  initial={{ width: paused ? undefined : "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: paused ? 0 : STEP_MS / 1000,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
