"use client";

import { motion } from "framer-motion";
import { Send, ListTree, ShieldCheck } from "lucide-react";
import { BrandLockup } from "./Logo";
import DecryptText from "./DecryptText";
import Magnetic from "./Magnetic";
import { haptic } from "@/lib/haptics";
import { TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/data";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-20"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="container-x flex flex-col items-center text-center"
      >
        <motion.div variants={item}>
          <span className="eyebrow rounded-full border border-neon/30 bg-neon/5 px-4 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            Private Digital Service Channel
          </span>
        </motion.div>

        <motion.div variants={item} className="mt-8">
          <BrandLockup />
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-8 font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-white sm:text-3xl md:text-4xl"
        >
          <DecryptText text="FSOCIETY" />{" "}
          <DecryptText
            text="Services"
            className="text-neon text-glow"
            delay={140}
          />
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-3 font-mono text-sm uppercase tracking-[0.4em] text-neon-soft sm:text-base"
        >
          Private. Secure. Fast.
        </motion.p>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          A private digital service channel focused on selected store access,
          clear communication, trusted updates, and fast support.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Magnetic className="w-full sm:w-auto">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptic()}
              className="btn btn-primary w-full sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Contact on Telegram
            </a>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <a
              href="#stores"
              onClick={() => haptic()}
              className="btn btn-ghost w-full sm:w-auto"
            >
              <ListTree className="h-4 w-4" />
              View Store List
            </a>
          </Magnetic>
        </motion.div>

        <motion.a
          variants={item}
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-zinc-400 backdrop-blur transition-colors hover:border-neon/50 hover:text-neon"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-neon shadow-neon" />
          Telegram contact: {TELEGRAM_HANDLE}
        </motion.a>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1 rounded-full bg-neon"
          />
        </div>
      </motion.div>
    </section>
  );
}
