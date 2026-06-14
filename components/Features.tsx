"use client";

import { motion } from "framer-motion";
import { features } from "@/lib/data";
import { Reveal } from "./Reveal";

export default function Features() {
  return (
    <section className="container-x py-20 sm:py-28">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -6 }}
              className="card group h-full"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon shadow-neon-sm transition-all duration-300 group-hover:bg-neon group-hover:text-black">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {f.text}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
