"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Globe,
  HelpCircle,
  ArrowUpRight,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { stores, STORES_URL, type Region } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

function regionStyle(region: Region): { cls: string; Icon: typeof Globe } {
  switch (region) {
    case "Worldwide":
      return {
        cls: "border-neon/40 bg-neon/10 text-neon-soft",
        Icon: Globe,
      };
    case "Europe":
      return {
        cls: "border-neon/30 bg-neon/5 text-neon-soft",
        Icon: Globe,
      };
    case "UK":
      return {
        cls: "border-neon-soft/40 bg-neon-soft/10 text-neon-soft",
        Icon: MapPin,
      };
    case "USA":
      return {
        cls: "border-white/15 bg-white/5 text-zinc-300",
        Icon: MapPin,
      };
    case "USA/Canada":
      return {
        cls: "border-neon-ember/40 bg-neon-ember/10 text-neon-ember",
        Icon: MapPin,
      };
    case "Available on request":
      return {
        cls: "border-white/10 bg-transparent text-zinc-500",
        Icon: HelpCircle,
      };
  }
}

export default function Stores() {
  const [openStore, setOpenStore] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");

  const regions = useMemo<(Region | "All")[]>(() => {
    const set = new Set<Region>(stores.map((s) => s.region));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stores.filter((s) => {
      const matchesRegion = region === "All" || s.region === region;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.website?.toLowerCase().includes(q) ?? false);
      return matchesRegion && matchesQuery;
    });
  }, [query, region]);

  return (
    <section id="stores" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Hottest Stores"
          title="Supported Store List"
          subtitle="A curated selection of supported stores spanning global and region-specific availability. Availability is updated regularly inside the channel."
        />

        {/* Search + region filter */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-stretch gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stores…"
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-3 pl-11 pr-11 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-neon/50 focus:bg-white/[0.05]"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  region === r
                    ? "border-neon/60 bg-neon/10 text-neon"
                    : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 items-start gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((store, i) => {
            const { cls, Icon } = regionStyle(store.region);
            const infoRows = [
              { label: "Website", value: store.website },
              { label: "Limit", value: store.limit },
              { label: "Time frame", value: store.timeframe },
              { label: "Works in", value: store.worksIn },
              { label: "Min. order", value: store.minOrder },
              { label: "Fee", value: store.fee },
            ].filter((r) => r.value);
            const hasDetails = infoRows.length > 0 || Boolean(store.note);
            const storeId = `${store.name}-${store.region}`;
            const isOpen = openStore === storeId;
            return (
              <Reveal key={storeId} delay={(i % 4) * 0.05}>
                <motion.div
                  whileHover={{ y: hasDetails ? -3 : -5 }}
                  onClick={() =>
                    hasDetails && setOpenStore(isOpen ? null : storeId)
                  }
                  className={`card group flex h-full flex-col justify-between gap-4 p-5 ${
                    hasDetails ? "cursor-pointer" : ""
                  } ${isOpen ? "border-neon/50 shadow-neon-sm" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-gothic text-xl font-bold tracking-wide text-white transition-colors group-hover:text-neon-soft sm:text-2xl">
                      {store.name}
                    </span>
                    {hasDetails ? (
                      <ChevronDown
                        className={`mt-1 h-4 w-4 shrink-0 text-zinc-500 transition-all duration-300 group-hover:text-neon ${
                          isOpen ? "rotate-180 text-neon" : ""
                        }`}
                      />
                    ) : (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white/20 transition-all duration-300 group-hover:bg-neon group-hover:shadow-neon" />
                    )}
                  </div>

                  <span className={`badge w-fit ${cls}`}>
                    <Icon className="h-3 w-3" />
                    {store.region}
                  </span>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <dl className="mt-1 space-y-2 border-t border-white/10 pt-4 text-left">
                          {infoRows.map((row) => (
                            <div
                              key={row.label}
                              className="flex items-baseline justify-between gap-3"
                            >
                              <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                                {row.label}
                              </dt>
                              <dd className="text-right text-sm font-medium text-zinc-200">
                                {row.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                        {store.note && (
                          <p className="mt-3 rounded-lg border border-neon-ember/40 bg-neon-ember/10 px-3 py-2 text-center font-mono text-[11px] uppercase tracking-wider text-neon-ember">
                            {store.note}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-center">
            <p className="font-mono text-sm text-zinc-400">
              No stores match{" "}
              {query && <span className="text-neon">“{query}”</span>}. Try a
              different search — or just ask in the channel.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setRegion("All");
              }}
              className="mt-4 rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:border-neon/50 hover:text-neon"
            >
              Reset filters
            </button>
          </div>
        )}

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              More stores available on request — just ask in the channel
            </p>
            <motion.a
              whileHover={{ y: -3 }}
              href={STORES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              View Full Store List
              <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
