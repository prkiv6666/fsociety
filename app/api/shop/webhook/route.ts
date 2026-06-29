import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { verifyIpn } from "@/lib/nowpayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-nowpayments-sig") || "";

  let body: { payment_status?: string; order_id?: string };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (!verifyIpn(body, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    // Deliver only when the payment is fully completed.
    if (body.payment_status === "finished" && body.order_id) {
      const raw2 = await store.get(`order:${body.order_id}`);
      if (raw2) {
        const order = JSON.parse(raw2);
        if (order.status !== "delivered" && order.status !== "out_of_stock") {
          const credential = await store.lpop(`stock:${order.productId}`);
          if (credential) {
            order.status = "delivered";
            order.credential = credential;
            order.deliveredAt = new Date().toISOString();
          } else {
            order.status = "out_of_stock";
          }
          await store.set(`order:${body.order_id}`, JSON.stringify(order));
        }
      }
    }
  } catch {
    // swallow — always ack so the IPN isn't retried forever
  }

  return NextResponse.json({ ok: true });
}
