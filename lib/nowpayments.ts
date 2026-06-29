import crypto from "crypto";

/**
 * Minimal NOWPayments client + IPN signature verification.
 *   NOWPAYMENTS_API_KEY    — from the NOWPayments dashboard (Store settings)
 *   NOWPAYMENTS_IPN_SECRET — IPN secret key (Store settings → Instant Payments)
 */
const API_KEY = process.env.NOWPAYMENTS_API_KEY || "";
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET || "";
const BASE = process.env.NOWPAYMENTS_BASE || "https://api.nowpayments.io/v1";

export function nowPaymentsConfigured() {
  return Boolean(API_KEY);
}

export interface InvoiceResult {
  id?: string;
  invoice_url?: string;
}

export async function createInvoice(
  params: Record<string, unknown>,
): Promise<InvoiceResult & { [k: string]: unknown }> {
  const res = await fetch(`${BASE}/invoice`, {
    method: "POST",
    headers: { "x-api-key": API_KEY, "content-type": "application/json" },
    body: JSON.stringify(params),
    cache: "no-store",
  });
  return res.json();
}

// NOWPayments signs the IPN body with HMAC-SHA512 over the JSON with keys
// sorted alphabetically (recursively).
function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sortDeep(obj[k]);
        return acc;
      }, {});
  }
  return value;
}

export function verifyIpn(parsedBody: unknown, signature: string): boolean {
  if (!IPN_SECRET || !signature) return false;
  const sorted = JSON.stringify(sortDeep(parsedBody));
  const hmac = crypto
    .createHmac("sha512", IPN_SECRET)
    .update(sorted)
    .digest("hex");
  const a = Buffer.from(hmac);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
