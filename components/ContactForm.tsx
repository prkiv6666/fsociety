"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { haptic } from "@/lib/haptics";

const SUBJECTS = [
  "General enquiry",
  "Store access",
  "Vouches / proof",
  "Support",
  "Other",
];

export default function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    haptic();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      contact: fd.get("contact"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      website: fd.get("website"), // honeypot
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="mt-10 w-full max-w-xl rounded-2xl border border-neon/30 bg-white/[0.03] p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-neon" />
        <h3 className="mt-4 font-display text-xl font-bold text-white">
          Message sent
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Thanks — we&apos;ll get back to you through the contact you provided.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-neon/50 focus:bg-white/[0.05]";

  return (
    <form onSubmit={submit} className="mt-10 w-full max-w-xl text-left">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Name / handle *
          </label>
          <input name="name" required maxLength={80} placeholder="Your name" className={field} />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            How we reach you *
          </label>
          <input
            name="contact"
            required
            maxLength={120}
            placeholder="@telegram or email"
            className={field}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Subject
        </label>
        <select name="subject" defaultValue={SUBJECTS[0]} className={field}>
          {SUBJECTS.map((s) => (
            <option key={s} value={s} className="bg-base-900">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Message *
        </label>
        <textarea
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder="How can we help?"
          className={`${field} resize-none`}
        />
      </div>

      {/* honeypot (hidden from users) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      {error && (
        <p className="mt-4 rounded-xl border border-neon/40 bg-neon/10 px-4 py-3 text-center text-sm text-neon-soft">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn btn-primary mt-6 w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
