import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 512;
const MAX_MESSAGES = 24; // cap conversation length sent to the model
const MAX_CHARS = 2000; // per user message

// Curated knowledge the assistant is allowed to answer from. Keeping this
// tight keeps the bot on-message, cheap, and predictable.
const SYSTEM_PROMPT = `You are the assistant for the FSOCIETY SERVICES website (fsociety.services).
Be brief, friendly, and helpful. Answer in 1-3 short sentences. Use plain text, no markdown headers.

What the site has, and where to point people:
- Stores: a large list of supported stores (80+), including a UK region. The full live store list is on Telegram.
- Shop: an on-site shop selling email accounts (Mail.bg and ABV.bg), paid with crypto at checkout.
- Vouches & Proof: a public Telegram channel with screenshots/proof.
- Contact: everything goes through the official Telegram. The official contact is @fsocietyr3fs — warn people that impersonators exist and only that handle is official.

Links you may share:
- Telegram contact: https://t.me/fsocietyr3fs (@fsocietyr3fs)
- Store list channel and Vouches channel: tell them to use the buttons/links on the site, or to message the Telegram.

Rules:
- Help visitors navigate the site, understand the shop, find the store list/vouches, and reach the official contact.
- Keep answers short. If you don't know something, say so and point them to the Telegram contact.
- Do NOT explain, coach, or walk anyone through any refund method, "how the method works", claiming orders as lost/not received, or anything about getting money or goods back from a retailer. If asked, decline briefly and redirect them to contact @fsocietyr3fs on Telegram. Do not improvise details you weren't given here.`;

// Very small in-memory rate limiter (per warm instance). Not bulletproof, but
// stops casual spam from running up token cost.
const HITS = new Map<string, { n: number; t: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 15;

function rateLimited(ip: string) {
  const now = Date.now();
  const rec = HITS.get(ip);
  if (!rec || now - rec.t > WINDOW_MS) {
    HITS.set(ip, { n: 1, t: now });
    return false;
  }
  rec.n += 1;
  return rec.n > LIMIT;
}

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return Response.json(
      { error: "Assistant is not configured yet." },
      { status: 503 },
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "You're sending messages too fast. Give it a moment." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const raw: unknown = body?.messages;
  if (!Array.isArray(raw)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages: Msg[] = raw
    .filter(
      (m: any) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    )
    .slice(-MAX_MESSAGES)
    .map((m: any) => ({
      role: m.role,
      content: String(m.content).slice(0, MAX_CHARS),
    }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: key });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        const s = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages,
        });
        s.on("text", (delta) => controller.enqueue(enc.encode(delta)));
        await s.finalMessage();
      } catch {
        controller.enqueue(
          enc.encode("Sorry — I couldn't respond just now. Try again in a moment."),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
