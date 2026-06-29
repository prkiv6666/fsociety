/**
 * Config for the Telegram "portal" verification bot (see app/api/telegram).
 *
 * Channel chat IDs are NOT secrets, so they live here for easy editing.
 * The bot token / webhook secret are read from environment variables.
 *
 * IMPORTANT: the bot must be an ADMIN in each channel below, with the
 * "Invite Users via Link" permission, or createChatInviteLink will fail.
 * The chatId is the numeric ID (e.g. "-1001234567890"), not the @username,
 * for private channels. Easiest way to get it: add the bot as admin, then
 * forward a channel post to @userinfobot, or check getChat.
 */
export interface PortalChannel {
  title: string;
  chatId: string;
}

// TODO: replace the placeholder chatIds with your real channel IDs.
export const PORTAL_CHANNELS: PortalChannel[] = [
  { title: "GU$$ SERVICE MAIN CHANNEL", chatId: "-1000000000000" },
  { title: "Gu$$ Chat", chatId: "-1000000000001" },
  { title: "Cashback Chat", chatId: "-1000000000002" },
];

/** How long (seconds) the generated invite links stay valid. */
export const LINK_EXPIRY_SECONDS = 60;

/** Allow each generated link to be used once (set to 0 to disable the cap). */
export const LINK_MEMBER_LIMIT = 1;
