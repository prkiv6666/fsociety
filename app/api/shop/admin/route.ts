import { NextRequest, NextResponse } from "next/server";
import { store, storeConfigured } from "@/lib/store";
import { getProduct } from "@/lib/shop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Load account stock into the KV store. Credentials never live in git.
 *
 *   POST /api/shop/admin
 *   { "token": "<ADMIN_TOKEN>", "productId": "mailbg",
 *     "lines": ["a@mail.bg:pw1", "b@mail.bg:pw2"] }
 *
 * GET /api/shop/admin?token=...  -> current stock counts
 */
function authed(token: string | null) {
  const expected = process.env.SHOP_ADMIN_TOKEN || "";
  return Boolean(expected) && token === expected;
}

export async function POST(req: NextRequest) {
  if (!storeConfigured()) {
    return NextResponse.json({ error: "store not configured" }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  if (!authed(body?.token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const product = body && getProduct(String(body.productId));
  if (!product) {
    return NextResponse.json({ error: "unknown product" }, { status: 400 });
  }
  const lines: string[] = Array.isArray(body.lines)
    ? body.lines.map((l: unknown) => String(l).trim()).filter(Boolean)
    : [];
  if (lines.length === 0) {
    return NextResponse.json({ error: "no lines" }, { status: 400 });
  }

  await store.rpush(`stock:${product.id}`, ...lines);
  const total = await store.llen(`stock:${product.id}`);
  return NextResponse.json({ ok: true, added: lines.length, total });
}

export async function GET(req: NextRequest) {
  if (!storeConfigured()) {
    return NextResponse.json({ error: "store not configured" }, { status: 503 });
  }
  if (!authed(req.nextUrl.searchParams.get("token"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const counts: Record<string, number> = {};
  for (const id of ["mailbg", "abvbg"]) {
    counts[id] = await store.llen(`stock:${id}`).catch(() => 0);
  }
  return NextResponse.json({ ok: true, stock: counts });
}
