"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Send, ShieldAlert } from "lucide-react";
import { Reveal } from "./Reveal";
import { TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-neon/30 bg-gradient-to-b from-base-900/70 to-base-950/70 p-10 text-center backdrop-blur-xl shadow-neon sm:p-16">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-radial-neon blur-3xl" />

            <div className="relative flex flex-col items-center">
              <Image
                src="/logo.png"
                alt="FSOCIETY"
                width={612}
                height={408}
                className="w-56 drop-shadow-[0_0_22px_rgba(255,30,60,0.5)] sm:w-72"
              />

              <h2 className="mt-8 font-display text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
                Join <span className="text-neon text-glow">FSOCIETY</span> Today
              </h2>

              <p className="mt-5 max-w-xl text-base text-zinc-400 sm:text-lg">
                Reach out directly through the official channel.
              </p>

              <motion.a
                whileHover={{ y: -3 }}
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-8 px-8 py-4 text-base"
              >
                <Send className="h-5 w-5" />
                DM us on Telegram
              </motion.a>

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-sm text-neon-soft"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-neon shadow-neon" />
                {TELEGRAM_HANDLE}
              </a>

              <div className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                <ShieldAlert className="h-4 w-4 text-neon" />
                Only trust the official FSOCIETY contact.
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
