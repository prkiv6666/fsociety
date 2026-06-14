"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Services"
          title="What We Offer"
          subtitle="Everything is handled professionally through the official channel, with clear guidance at every step."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) * 0.07}>
              <motion.div
                whileHover={{ y: -6 }}
                className="card group flex h-full flex-col"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neon transition-all duration-300 group-hover:border-neon/50 group-hover:shadow-neon-sm">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold leading-snug text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {s.text}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
