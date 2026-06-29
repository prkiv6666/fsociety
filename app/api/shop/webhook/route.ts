import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyWebhook } from "@/lib/cryptopay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("crypto-pay-api-signature") || "";

  if (!verifyWebhook(raw, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: { update_type?: string; payload?: Record<string, unknown> };
  try {
    update = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    if (update.update_type === "invoice_paid" && update.payload) {
      const invoice = update.payload as {
        invoice_id: number;
        payload?: string;
      };
      const orderId =
        invoice.payload ||
        (await store.get(`invoice:${invoice.invoice_id}`)) ||
        "";

      if (orderId) {
        const raw2 = await store.get(`order:${orderId}`);
        if (raw2) {
          const order = JSON.parse(raw2);
          // Idempotency: only deliver once.
          if (order.status !== "delivered" && order.status !== "out_of_stock") {
            const credential = await store.lpop(`stock:${order.productId}`);
            if (credential) {
              order.status = "delivered";
              order.credential = credential;
              order.deliveredAt = new Date().toISOString();
            } else {
              order.status = "out_of_stock";
            }
            await store.set(`order:${orderId}`, JSON.stringify(order));
          }
        }
      }
    }
  } catch {
    // swallow — always ack so Crypto Pay doesn't retry-storm
  }

  return NextResponse.json({ ok: true });
}
