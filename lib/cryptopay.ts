import crypto from "crypto";

/**
 * Minimal Crypto Pay (@CryptoBot) API client + webhook verification.
 * Token comes from the @CryptoBot "Crypto Pay" app (Create App).
 */
const TOKEN = process.env.CRYPTO_PAY_TOKEN || "";
const BASE = process.env.CRYPTO_PAY_BASE || "https://pay.crypt.bot/api";

export function cryptoPayConfigured() {
  return Boolean(TOKEN);
}

export async function cryptoPay<T = unknown>(
  method: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; result?: T; error?: unknown }> {
  const res = await fetch(`${BASE}/${method}`, {
    method: "POST",
    headers: {
      "Crypto-Pay-API-Token": TOKEN,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res.json();
}

/** Verify a Crypto Pay webhook signature against the raw request body. */
export function verifyWebhook(rawBody: string, signature: string): boolean {
  if (!TOKEN || !signature) return false;
  const secret = crypto.createHash("sha256").update(TOKEN).digest();
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  // constant-time compare
  const a = Buffer.from(hmac);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
