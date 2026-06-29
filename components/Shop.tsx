"use client";

import { Check, ShoppingBag, Lock } from "lucide-react";
import { shopAccounts, SHOP_BOT_URL } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import TiltCard from "./TiltCard";
import { haptic } from "@/lib/haptics";

export default function Shop() {
  if (shopAccounts.length === 0) return null;

  return (
    <section id="shop" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Shop"
          title="Accounts For Sale"
          subtitle="Browse available accounts and check out securely through our Telegram bot — instant delivery, crypto accepted."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shopAccounts.map((acc, i) => (
            <Reveal key={acc.id} delay={(i % 3) * 0.08}>
              <TiltCard className="h-full">
                <div className="card group/card flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon shadow-neon-sm">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    {acc.badge && (
                      <span className="badge border-neon/40 bg-neon/10 text-neon">
                        {acc.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {acc.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {acc.description}
                  </p>

                  {acc.features && acc.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {acc.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-xs text-zinc-300"
                        >
                          <Check className="h-3.5 w-3.5 shrink-0 text-neon" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6 flex items-end justify-between gap-3 pt-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                        Price
                      </p>
                      <p className="font-display text-2xl font-extrabold text-neon-soft">
                        {acc.price}
                      </p>
                    </div>

                    {acc.inStock ? (
                      <a
                        href={`${SHOP_BOT_URL}?start=${acc.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => haptic()}
                        className="btn btn-primary h-11 px-5"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Buy
                      </a>
                    ) : (
                      <span className="btn btn-ghost h-11 cursor-not-allowed px-5 opacity-60">
                        <Lock className="h-4 w-4" />
                        Sold out
                      </span>
                    )}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          Checkout is handled by our official Telegram bot.
        </p>
      </div>
    </section>
  );
}
