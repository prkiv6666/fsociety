import { NextRequest, NextResponse } from "next/server";
import {
  PORTAL_CHANNELS,
  LINK_EXPIRY_SECONDS,
  LINK_MEMBER_LIMIT,
} from "@/lib/portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      "🔐 <b>Security Verification</b>\n\n" +
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

async function sendInviteLinks(chatId: number) {
  const expire = Math.floor(Date.now() / 1000) + LINK_EXPIRY_SECONDS;
  const lines: string[] = ["🔗 <b>Your temporary invite links:</b>", ""];

  for (const ch of PORTAL_CHANNELS) {
    const body: Record<string, unknown> = {
      chat_id: ch.chatId,
      expire_date: expire,
    };
    if (LINK_MEMBER_LIMIT > 0) body.member_limit = LINK_MEMBER_LIMIT;

    const r = await tg("createChatInviteLink", body);
    if (r.ok && r.result?.invite_link) {
      lines.push(`<b>${esc(ch.title)}:</b>`, r.result.invite_link, "");
    } else {
      lines.push(`<b>${esc(ch.title)}:</b> unavailable`, "");
    }
  }

  lines.push(
    `<i>These links expire in ${LINK_EXPIRY_SECONDS} seconds. Send /start to get new ones.</i>`,
  );

  await tg("sendMessage", {
    chat_id: chatId,
    text: lines.join("\n"),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
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
            `📡 <b>${esc(c.title || "chat")}</b>\n` +
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
          text: "✅ Verified!",
        });
        await tg("editMessageReplyMarkup", {
          chat_id: chatId,
          message_id: cq.message.message_id,
          reply_markup: { inline_keyboard: [] },
        });
        await sendInviteLinks(chatId);
      } else {
        await tg("answerCallbackQuery", {
          callback_query_id: cq.id,
          text: "❌ Wrong answer — try again",
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
