"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "fsociety_intro_v1";
export const INTRO_DONE_EVENT = "fsociety:intro-done";

const lines = [
  "> initializing fsociety...",
  "> establishing secure channel...",
  "> decrypting nodes...",
  "> access granted_",
];

export default function IntroScreen() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const finishEarly = () => {
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    };

    // Only play once per session.
    if (sessionStorage.getItem(SESSION_KEY)) {
      finishEarly();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(SESSION_KEY, "1");
      finishEarly();
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    setShow(true);

    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 450 + i * 480));
    });
    timers.push(setTimeout(() => setGranted(true), 450 + lines.length * 480));
    timers.push(setTimeout(() => finish(), 450 + lines.length * 480 + 1100));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    setShow(false);
    window.dispatchEvent(new Event(INTRO_DONE_EVENT));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-base-950"
        >
          {/* scanline overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)]" />

          {/* Logo with glitch flicker */}
          <motion.div
            animate={
              granted
                ? { opacity: 1, scale: 1 }
                : { opacity: [0.2, 1, 0.4, 1, 0.6], x: [0, -2, 2, -1, 0] }
            }
            transition={
              granted
                ? { duration: 0.5, ease: "easeOut" }
                : { duration: 1.2, repeat: Infinity }
            }
            className="relative w-56 sm:w-72"
          >
            <Image
              src="/logo.png"
              alt="FSOCIETY"
              width={600}
              height={400}
              priority
              className="h-auto w-full"
            />
          </motion.div>

          {/* Terminal lines */}
          <div className="mt-8 h-28 w-full max-w-sm px-6 font-mono text-xs text-neon-soft sm:text-sm">
            {lines.slice(0, step).map((l, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={
                  i === lines.length - 1 ? "text-neon" : "text-zinc-400"
                }
              >
                {l}
              </motion.p>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-2 h-1 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-neon shadow-neon"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.3, ease: "easeInOut" }}
            />
          </div>

          {/* Skip */}
          <button
            type="button"
            onClick={finish}
            className="absolute bottom-6 right-6 font-mono text-[11px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-neon"
          >
            Skip ›
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
