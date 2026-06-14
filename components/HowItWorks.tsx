"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { howItWorks } from "@/lib/data";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="How It Works"
          title="We'll Walk You Through It"
          subtitle="A simple, guided process — you bring the order, we handle everything else."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* Connecting line that draws in as you scroll */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute left-6 top-4 bottom-4 w-px origin-top bg-gradient-to-b from-neon via-neon/40 to-transparent sm:left-8"
          />

          <ol className="space-y-10">
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={i * 0.15}>
                  <li className="relative flex items-start gap-5 sm:gap-7">
                    {/* Numbered node */}
                    <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-neon/40 bg-base-950 shadow-neon-sm sm:h-16 sm:w-16">
                      <Icon className="h-5 w-5 text-neon sm:h-7 sm:w-7" />
                      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-neon font-mono text-[10px] font-bold text-base-950 sm:h-6 sm:w-6 sm:text-xs">
                        {i + 1}
                      </span>
                    </div>

                    {/* Copy */}
                    <div className="card flex-1 p-5 sm:p-6">
                      <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
                        {step.text}
                      </p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
