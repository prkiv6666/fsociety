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

// TODO: replace the placeholder URLs with your real invite links.
export const PORTAL_CHANNELS: PortalChannel[] = [
  { title: "GU$$ SERVICE MAIN CHANNEL", url: "https://t.me/REPLACE_ME" },
  { title: "Gu$$ Chat", url: "https://t.me/REPLACE_ME" },
  { title: "Cashback Chat", url: "https://t.me/REPLACE_ME" },
];
