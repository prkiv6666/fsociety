/**
 * Config for the Telegram "portal" verification bot (see app/api/telegram).
 *
 * After a visitor passes the captcha, the bot posts these channel links.
 * Just paste your real invite links below — the bot does NOT need to be
 * an admin in the channels for this to work.
 */
export interface PortalChannel {
  title: string;
  url: string;
}

export const PORTAL_CHANNELS: PortalChannel[] = [
  { title: "Store List", url: "https://t.me/+NbpIJfy2ZaY5OWM0" },
  { title: "Vouches & Proof", url: "https://t.me/+_ixcj8eF6c83MDY8" },
  { title: "Main Channel", url: "https://t.me/+IbRvVKWmbOs3M2I0" },
];

// Greeting sent on /start, just before the security check. HTML formatting.
export const WELCOME_MESSAGE =
  "👁️ <b>Welcome to FSOCIETY SERVICES</b>\n\n" +
  "Private. Secure. Fast. — your portal to our official channels: store access, vouches & proof, and live updates.\n\n" +
  "🔒 Complete the quick security check below to unlock your invite links.";
