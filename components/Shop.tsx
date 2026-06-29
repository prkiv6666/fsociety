"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag, Loader2 } from "lucide-react";
import { PRODUCTS } from "@/lib/shop";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import TiltCard from "./TiltCard";
import { haptic } from "@/lib/haptics";

export default function Shop() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buy = async (productId: string) => {
    setError(null);
    setBusy(productId);
    haptic();
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok || !data.payUrl) {
        setError(data.error || "Could not start checkout. Try again.");
        setBusy(null);
        return;
      }
      // Open the crypto invoice and take the buyer to their order page.
      window.open(data.payUrl, "_blank", "noopener,noreferrer");
      router.push(`/order/${data.orderId}`);
    } catch {
      setError("Network error. Please try again.");
      setBusy(null);
    }
  };

  return (
    <section id="shop" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Shop"
          title="Accounts For Sale"
          subtitle="Pay with crypto and your account is delivered instantly — automatically, right here on the site."
        />

        {error && (
          <p className="mx-auto mt-6 max-w-md rounded-xl border border-neon/40 bg-neon/10 px-4 py-3 text-center text-sm text-neon-soft">
            {error}
          </p>
        )}

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.08}>
              <TiltCard className="h-full">
                <div className="card flex h-full flex-col">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon shadow-neon-sm">
                    <ShoppingBag className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {p.description}
                  </p>

                  {p.features && (
                    <ul className="mt-4 space-y-1.5">
                      {p.features.map((f) => (
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
                        €{p.priceEur.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => buy(p.id)}
                      disabled={busy !== null}
                      className="btn btn-primary h-11 px-5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy === p.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingBag className="h-4 w-4" />
                      )}
                      {busy === p.id ? "Starting…" : "Buy"}
                    </button>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
          Secure crypto checkout · instant automated delivery
        </p>
      </div>
    </section>
  );
}
