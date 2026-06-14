"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { reasons } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Built On Trust"
          subtitle="A focused, professional service designed around privacy, speed, and reliability."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={(i % 3) * 0.08}>
              <motion.div
                whileHover={{ y: -5 }}
                className="card group flex h-full items-start gap-4"
              >
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:bg-neon group-hover:text-black">
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-neon" />
                    <h3 className="font-display text-base font-bold text-white">
                      {r.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {r.text}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
