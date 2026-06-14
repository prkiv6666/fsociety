"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Quote, Star, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import VouchCarousel from "./VouchCarousel";
import CountUp from "./CountUp";
import { VOUCHES_URL } from "@/lib/data";

const stats = [
  { value: "500+", label: "Posted proofs" },
  { value: "24/7", label: "Active channel" },
  { value: "100%", label: "Transparent" },
];

export default function Vouches() {
  return (
    <section id="vouches" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-neon/25 bg-base-900/40 p-8 backdrop-blur-xl shadow-neon-sm sm:p-14">
            {/* glow accents */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-radial-neon blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-radial-neon blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <span className="eyebrow">
                <BadgeCheck className="h-4 w-4" />
                Vouches &amp; Proof
              </span>

              <Quote className="mt-6 h-10 w-10 text-neon/60" />

              <h2 className="mt-4 max-w-3xl font-display text-2xl font-extrabold leading-snug text-white sm:text-4xl">
                Recent vouches and proof are posted regularly in our official
                channel.
              </h2>

              <div className="mt-6 flex items-center gap-1 text-neon">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-neon" />
                ))}
              </div>

              <VouchCarousel />

              <div className="mt-10 grid w-full max-w-xl grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-5"
                  >
                    <CountUp
                      value={s.value}
                      className="block font-display text-2xl font-extrabold text-neon-soft sm:text-3xl"
                    />
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <motion.a
                whileHover={{ y: -3 }}
                href={VOUCHES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-10"
              >
                View Vouches
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
