import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getProduct } from "@/lib/shop";
import { store, storeConfigured } from "@/lib/store";
import { createInvoice, nowPaymentsConfigured } from "@/lib/nowpayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!nowPaymentsConfigured() || !storeConfigured()) {
    return NextResponse.json(
      { error: "Shop is not configured yet." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const product = body && getProduct(String(body.productId));
  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }

  // Don't take money for something we can't deliver.
  const inStock = await store.llen(`stock:${product.id}`).catch(() => 0);
  if (!inStock) {
    return NextResponse.json({ error: "Out of stock." }, { status: 409 });
  }

  const orderId = crypto.randomUUID();
  const origin = req.nextUrl.origin;

  const inv = await createInvoice({
    price_amount: product.priceEur,
    price_currency: "eur",
    order_id: orderId,
    order_description: `${product.name} — FSOCIETY`,
    ipn_callback_url: `${origin}/api/shop/webhook`,
    success_url: `${origin}/order/${orderId}`,
    cancel_url: `${origin}/#shop`,
  });

  if (!inv || !inv.invoice_url) {
    return NextResponse.json(
      { error: "Could not create invoice." },
      { status: 502 },
    );
  }

  const order = {
    id: orderId,
    productId: product.id,
    productName: product.name,
    invoiceId: inv.id,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };
  await store.set(`order:${orderId}`, JSON.stringify(order));

  return NextResponse.json({ orderId, payUrl: inv.invoice_url });
}
