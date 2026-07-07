import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CONTACT_TELEGRAM_CHAT_ID;

function esc(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clean(v: unknown, max: number) {
  return String(v ?? "")
    .trim()
    .slice(0, max);
}

export async function POST(req: NextRequest) {
  if (!TOKEN || !CHAT_ID) {
    return NextResponse.json(
      { error: "Contact form is not configured yet." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 80);
  const contact = clean(body.contact, 120);
  const subject = clean(body.subject, 80);
  const message = clean(body.message, 2000);

  if (!name || !contact || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, contact, and message." },
      { status: 400 },
    );
  }

  // Simple honeypot: bots fill hidden fields.
  if (clean(body.website, 40)) {
    return NextResponse.json({ ok: true });
  }

  const text =
    "📩 <b>New enquiry — FSOCIETY</b>\n\n" +
    `<b>Name:</b> ${esc(name)}\n` +
    `<b>Contact:</b> ${esc(contact)}\n` +
    (subject ? `<b>Subject:</b> ${esc(subject)}\n` : "") +
    `\n<b>Message:</b>\n${esc(message)}`;

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) {
    return NextResponse.json({ error: "Could not send. Try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
