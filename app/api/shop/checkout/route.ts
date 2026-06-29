import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getProduct } from "@/lib/shop";
import { store, storeConfigured } from "@/lib/store";
import { cryptoPay, cryptoPayConfigured } from "@/lib/cryptopay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIAT = process.env.CRYPTO_PAY_FIAT || "EUR";

interface Invoice {
  invoice_id: number;
  bot_invoice_url?: string;
  pay_url?: string;
  mini_app_invoice_url?: string;
}

export async function POST(req: NextRequest) {
  if (!cryptoPayConfigured() || !storeConfigured()) {
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

  const inv = await cryptoPay<Invoice>("createInvoice", {
    currency_type: "fiat",
    fiat: FIAT,
    amount: product.priceEur.toFixed(2),
    description: `${product.name} — FSOCIETY`,
    payload: orderId,
    paid_btn_name: "callback",
    paid_btn_url: `${origin}/order/${orderId}`,
    expires_in: 3600,
    allow_comments: false,
    allow_anonymous: true,
  });

  if (!inv.ok || !inv.result) {
    return NextResponse.json(
      { error: "Could not create invoice." },
      { status: 502 },
    );
  }

  const order = {
    id: orderId,
    productId: product.id,
    productName: product.name,
    invoiceId: inv.result.invoice_id,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  };
  await store.set(`order:${orderId}`, JSON.stringify(order));
  await store.set(`invoice:${inv.result.invoice_id}`, orderId);

  const payUrl =
    inv.result.bot_invoice_url ||
    inv.result.mini_app_invoice_url ||
    inv.result.pay_url;

  return NextResponse.json({ orderId, payUrl });
}
