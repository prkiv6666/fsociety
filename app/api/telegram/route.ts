import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { PORTAL_CHANNELS, WELCOME_MESSAGE } from "@/lib/portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow the function to stay alive long enough to delete the links message.
export const maxDuration = 60;

// Seconds before the posted links self-destruct.
const LINKS_TTL_SECONDS = 60;

// Build emoji from code points: the bundler mangles raw astral-plane
// emoji in string literals into literal "\uXXXX" text, so we avoid them.
const EMO = {
  lock: String.fromCodePoint(0x1f510), // 🔐
  check: String.fromCodePoint(0x2705), // ✅
  hourglass: String.fromCodePoint(0x23f3), // ⏳
  cross: String.fromCodePoint(0x274c), // ❌
  antenna: String.fromCodePoint(0x1f4e1), // 📡
};

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

const api = (method: string) =>
  `https://api.telegram.org/bot${TOKEN}/${method}`;

async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetch(api(method), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Build a "a + b = ?" challenge with four answer options (one correct).
function makeChallenge() {
  const a = 10 + Math.floor(Math.random() * 20);
  const b = 10 + Math.floor(Math.random() * 20);
  const answer = a + b;
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const delta = Math.floor(Math.random() * 13) - 6;
    if (delta !== 0 && answer + delta > 0) opts.add(answer + delta);
  }
  const options = [...opts].sort(() => Math.random() - 0.5);
  return { a, b, answer, options };
}

async function sendChallenge(chatId: number) {
  const { a, b, answer, options } = makeChallenge();
  const buttons = options.map((o) => ({
    text: String(o),
    // callback_data is hidden from users, so this is a fine captcha gate.
    callback_data: o === answer ? "verify_ok" : "verify_no",
  }));
  await tg("sendMessage", {
    chat_id: chatId,
    text:
      `${EMO.lock} <b>Security Verification</b>\n\n` +
      "Solve the math problem to get your invite link:\n\n" +
      `<b>${a} + ${b} = ?</b>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [buttons[0], buttons[1]],
        [buttons[2], buttons[3]],
      ],
    },
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function sendChannelLinks(chatId: number) {
  const lines: string[] = [
    `${EMO.check} <b>Verified! Your channel links:</b>`,
    "",
  ];

  for (const ch of PORTAL_CHANNELS) {
    lines.push(`<b>${esc(ch.title)}:</b>`, ch.url, "");
  }

  lines.push(
    `<i>${EMO.hourglass} These links disappear in ${LINKS_TTL_SECONDS} seconds. Send /start for new ones.</i>`,
  );

  const res = await tg("sendMessage", {
    chat_id: chatId,
    text: lines.join("\n"),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });

  // Self-destruct the message after the TTL. waitUntil keeps the function
  // alive past the webhook response (capped by maxDuration), so Telegram
  // still gets its 200 immediately. Delete a hair early to stay in budget.
  const messageId = res?.result?.message_id;
  if (messageId) {
    waitUntil(
      (async () => {
        await sleep((LINKS_TTL_SECONDS - 2) * 1000);
        await tg("deleteMessage", {
          chat_id: chatId,
          message_id: messageId,
        });
      })(),
    );
  }
}

export async function POST(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({ ok: false, error: "missing token" }, { status: 500 });
  }
  // Reject forged requests when a webhook secret is configured.
  if (SECRET && req.headers.get("x-telegram-bot-api-secret-token") !== SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await req.json().catch(() => null);
  if (!update) return NextResponse.json({ ok: true });

  try {
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id as number;

      // Helper: forward any channel/group post here to learn its chat ID.
      if (msg.forward_from_chat) {
        const c = msg.forward_from_chat;
        await tg("sendMessage", {
          chat_id: chatId,
          text:
            `${EMO.antenna} <b>${esc(c.title || "chat")}</b>\n` +
            `ID: <code>${c.id}</code>\n` +
            `Type: ${esc(c.type || "?")}`,
          parse_mode: "HTML",
        });
        return NextResponse.json({ ok: true });
      }

      const text = String(msg.text || "").trim();
      if (text.startsWith("/id")) {
        await tg("sendMessage", {
          chat_id: chatId,
          text:
            `This chat ID: <code>${chatId}</code>\n\n` +
            "To get a channel's ID, forward any post from that channel to me.",
          parse_mode: "HTML",
        });
      } else if (text.startsWith("/start")) {
        await tg("sendMessage", {
          chat_id: chatId,
          text: WELCOME_MESSAGE,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
        await sendChallenge(chatId);
      }
    } else if (update.channel_post?.text) {
      // Allow /id directly inside a channel where the bot is admin.
      const cp = update.channel_post;
      if (String(cp.text).trim().startsWith("/id")) {
        await tg("sendMessage", {
          chat_id: cp.chat.id,
          text: `Channel ID: <code>${cp.chat.id}</code>`,
          parse_mode: "HTML",
        });
      }
    } else if (update.callback_query) {
      const cq = update.callback_query;
      const chatId = cq.message.chat.id as number;
      if (cq.data === "verify_ok") {
        await tg("answerCallbackQuery", {
          callback_query_id: cq.id,
          text: `${EMO.check} Verified!`,
        });
        await tg("editMessageReplyMarkup", {
          chat_id: chatId,
          message_id: cq.message.message_id,
          reply_markup: { inline_keyboard: [] },
        });
        await sendChannelLinks(chatId);
      } else {
        await tg("answerCallbackQuery", {
          callback_query_id: cq.id,
          text: `${EMO.cross} Wrong answer — try again`,
        });
        await sendChallenge(chatId);
      }
    }
  } catch {
    // Always 200 so Telegram doesn't retry-storm on a transient error.
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    bot: "portal",
    configured: Boolean(TOKEN),
    channels: PORTAL_CHANNELS.length,
  });
}
