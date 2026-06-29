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
  {
    title: "FSOCIETY — Main / Store List",
    url: "https://t.me/+NbpIJfy2ZaY5OWM0",
  },
  { title: "FSOCIETY — Vouches & Proof", url: "https://t.me/+_ixcj8eF6c83MDY8" },
  { title: "FSOCIETY — Chat", url: "https://t.me/+IbRvVKWmbOs3M2I0" },
];
