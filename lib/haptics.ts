/**
 * Fire a tiny haptic tap on supported devices (mostly Android browsers).
 * No-ops where the Vibration API is unavailable (e.g. iOS Safari).
 */
export function haptic(ms = 10) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* ignore */
    }
  }
}
