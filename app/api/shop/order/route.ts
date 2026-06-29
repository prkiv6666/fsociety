import { NextRequest, NextResponse } from "next/server";
import { store, storeConfigured } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!storeConfigured()) {
    return NextResponse.json({ status: "unconfigured" }, { status: 503 });
  }
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) return NextResponse.json({ status: "not_found" }, { status: 400 });

  const raw = await store.get(`order:${id}`).catch(() => null);
  if (!raw) return NextResponse.json({ status: "not_found" }, { status: 404 });

  const order = JSON.parse(raw);
  return NextResponse.json({
    status: order.status, // pending | delivered | out_of_stock
    productName: order.productName,
    // Only expose the credential once the order is delivered.
    credential: order.status === "delivered" ? order.credential : undefined,
  });
}
