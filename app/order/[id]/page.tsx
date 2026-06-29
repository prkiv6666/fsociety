"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertTriangle, Copy, Home } from "lucide-react";
import Background from "@/components/Background";

type OrderState = {
  status: "pending" | "delivered" | "out_of_stock" | "not_found" | "unconfigured";
  productName?: string;
  credential?: string;
};

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [order, setOrder] = useState<OrderState | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const res = await fetch(`/api/shop/order?id=${id}`, { cache: "no-store" });
        const data = (await res.json()) as OrderState;
        if (!active) return;
        setOrder(data);
        // keep polling while we're still waiting for payment
        if (data.status === "pending") timer = setTimeout(poll, 4000);
      } catch {
        if (active) timer = setTimeout(poll, 6000);
      }
    };
    poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [id]);

  const copy = () => {
    if (order?.credential) {
      navigator.clipboard?.writeText(order.credential);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <Background />
      <main className="relative flex min-h-screen items-center justify-center px-5 py-24">
        <div className="card w-full max-w-lg text-center">
          {(!order || order.status === "pending") && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-neon" />
              <h1 className="mt-5 font-display text-2xl font-extrabold text-white">
                Waiting for payment…
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Complete the crypto payment in the window that opened. This page
                updates automatically the moment it&apos;s confirmed.
              </p>
            </>
          )}

          {order?.status === "delivered" && (
            <>
              <CheckCircle2 className="mx-auto h-10 w-10 text-neon" />
              <h1 className="mt-5 font-display text-2xl font-extrabold text-white">
                Payment confirmed
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Here is your {order.productName}. Save it now — this page is your
                only copy.
              </p>
              <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-neon/30 bg-base-950/60 px-4 py-3 text-left">
                <code className="break-all font-mono text-sm text-neon-soft">
                  {order.credential}
                </code>
                <button
                  type="button"
                  onClick={copy}
                  aria-label="Copy"
                  className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-white hover:border-neon/50 hover:text-neon"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copied && (
                <p className="mt-2 font-mono text-xs text-neon">Copied!</p>
              )}
            </>
          )}

          {order?.status === "out_of_stock" && (
            <>
              <AlertTriangle className="mx-auto h-10 w-10 text-neon" />
              <h1 className="mt-5 font-display text-2xl font-extrabold text-white">
                Sold out during checkout
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Your payment went through but stock just ran out. Contact us on
                Telegram and we&apos;ll sort you out right away.
              </p>
            </>
          )}

          {(order?.status === "not_found" ||
            order?.status === "unconfigured") && (
            <>
              <AlertTriangle className="mx-auto h-10 w-10 text-zinc-500" />
              <h1 className="mt-5 font-display text-2xl font-extrabold text-white">
                Order not found
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                This order link is invalid or has expired.
              </p>
            </>
          )}

          <Link href="/" className="btn btn-ghost mt-8">
            <Home className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </main>
    </>
  );
}
