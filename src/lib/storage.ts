/**
 * localStorage helpers — every call is wrapped in try/catch so a blocked or
 * full storage (private browsing, quota, etc.) never crashes the app; it
 * just silently no-ops and the site falls back to in-memory defaults.
 */

const PREFIX = "for-vishuu:";

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    // storage unavailable or full — ignore, nothing persists this session
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

export function getJSON<T>(key: string, fallback: T): T {
  const raw = safeGet(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON<T>(key: string, value: T): void {
  try {
    safeSet(key, JSON.stringify(value));
  } catch {
    // value wasn't serializable — ignore
  }
}

export const storageKeys = {
  favorites: "favorites",
  recentlyPlayed: "recently-played",
  volume: "volume",
  muted: "muted",
  shuffle: "shuffle",
  repeatMode: "repeat-mode",
  lastSongId: "last-song-id",
  stickyNote: "sticky-note",
  installPromptDismissed: "install-prompt-dismissed",
} as const;

export const storage = {
  get: safeGet,
  set: safeSet,
  remove: safeRemove,
  getJSON,
  setJSON,
};
