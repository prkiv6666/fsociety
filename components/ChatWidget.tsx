"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { TELEGRAM_HANDLE, TELEGRAM_URL, VOUCHES_URL, STORES_URL } from "@/lib/data";

type Msg = { role: "user" | "bot"; content: string };

const GREETING =
  "Hey — I'm the FSOCIETY assistant. Tap a button below or type your question.";

// Quick-reply chips shown under the greeting.
const QUICK = ["Stores", "Shop", "Vouches", "Contact", "How it works"];

// Scripted knowledge base. Each rule: keywords -> answer.
// Order matters — the first rule whose keyword appears wins.
const RULES: { keys: string[]; answer: string }[] = [
  {
    keys: ["refund", "method", "chargeback", "money back", "ftid", "lit", "claim"],
    answer:
      `For anything about specific methods or your order, please talk to us directly on Telegram: ${TELEGRAM_HANDLE} — ${TELEGRAM_URL}. Only that handle is official.`,
  },
  {
    keys: ["store", "shop list", "which stores", "available store"],
    answer:
      `We support 80+ stores, including a UK region. The full live store list is on our Telegram channel: ${STORES_URL} — or open the Stores section on this page.`,
  },
  {
    keys: ["shop", "account", "mail.bg", "abv", "buy", "email account"],
    answer:
      "Our on-site Shop sells email accounts (Mail.bg and ABV.bg). Pick a product, check out, and pay with crypto — you'll get your order on the order page. Scroll to the Shop section to see it.",
  },
  {
    keys: ["vouch", "proof", "review", "legit", "trust"],
    answer: `You can see vouches and proof here: ${VOUCHES_URL} — or check the Vouches section on this page.`,
  },
  {
    keys: ["contact", "telegram", "reach", "dm", "message", "talk", "support", "help"],
    answer: `The official contact is ${TELEGRAM_HANDLE} on Telegram: ${TELEGRAM_URL}. Beware of impersonators — only that handle is official.`,
  },
  {
    keys: ["how", "work", "process", "start", "order"],
    answer:
      "It's simple: 1) Message us on Telegram with what you want, 2) send your order details, 3) we handle the rest and keep you updated. Full steps are in the 'How It Works' section.",
  },
  {
    keys: ["price", "cost", "fee", "how much"],
    answer: `Prices depend on the store and item — we confirm everything up front before anything happens. Message ${TELEGRAM_HANDLE} on Telegram for a quote.`,
  },
  {
    keys: ["crypto", "pay", "payment", "bitcoin", "usdt"],
    answer:
      "The on-site Shop takes crypto at checkout via NOWPayments. For other services, payment is arranged directly on Telegram.",
  },
  {
    keys: ["hello", "hi", "hey", "yo", "sup"],
    answer: "Hey! Ask me about our stores, the shop, vouches, or how to get in touch.",
  },
];

const FALLBACK =
  `I'm not sure about that one — the fastest way to get an answer is our Telegram: ${TELEGRAM_HANDLE} (${TELEGRAM_URL}). You can also tap one of the buttons above.`;

function answerFor(text: string): string {
  const t = text.toLowerCase();
  for (const rule of RULES) {
    if (rule.keys.some((k) => t.includes(k))) return rule.answer;
  }
  return FALLBACK;
}

// Turn bare URLs into clickable links.
function renderContent(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon-soft underline underline-offset-2 break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", content: GREETING },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    haptic();
    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", content: q },
      { role: "bot", content: answerFor(q) },
    ]);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => {
          haptic();
          setOpen((o) => !o);
        }}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#ff2a44] to-[#c10026] text-white shadow-[0_0_26px_rgba(255,30,60,0.5)] transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] flex h-[70vh] max-h-[560px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-neon/30 bg-base-950/95 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(255,30,60,0.18)] backdrop-blur-xl sm:right-6">
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon" />
            </span>
            <div className="font-display text-sm font-bold uppercase tracking-wider text-white">
              FSOCIETY Assistant
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-b from-[#ff2a44] to-[#c10026] px-3.5 py-2 text-sm text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm leading-relaxed text-zinc-200"
                  }
                >
                  {renderContent(m.content)}
                </div>
              </div>
            ))}

            {/* Quick replies */}
            <div className="flex flex-wrap gap-2 pt-1">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="rounded-full border border-neon/30 bg-neon/5 px-3 py-1.5 text-xs font-medium text-neon-soft transition-colors hover:bg-neon/10"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={300}
              placeholder="Ask about stores, shop, contact…"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-neon/50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#ff2a44] to-[#c10026] text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
