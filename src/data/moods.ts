/**
 * MOOD / BACKGROUND CONFIGURATION
 * ---------------------------------------------------------------------------
 * The background isn't picked from a menu — it follows whatever is currently
 * playing. Every song in `songs.ts` is tagged with a `mood` id (see the
 * `SongMood` union below). Whichever mood the current song belongs to is the
 * background you see, and the site crossfades between them without
 * interrupting playback.
 *
 * To add a new mood later:
 *   1. Drop an image (or video) into /public/backgrounds/
 *   2. Add an entry below with a new id
 *   3. Tag songs in songs.ts with that id
 * That's the whole process — nothing else in the UI needs to change.
 */

export type MoodBackground =
  | { type: "image"; source: string; poster?: never }
  | { type: "video"; source: string; poster: string };

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  background: MoodBackground;
  /** CSS color used for glows/accents/active states while this mood is showing. */
  accent: string;
  /** Small overlay strength (0-1) so text stays readable regardless of the image. */
  overlay: number;
  /** Optional line shown near the player while this mood is active. Keep it short. */
  message?: string;
}

export const moods: Mood[] = [
  {
    id: "silent",
    name: "Quiet",
    emoji: "🌙",
    background: {
      type: "image",
      source: "/backgrounds/silent.jpg",
    },
    accent: "#a9b8d9",
    overlay: 0.55,
    message: "For the slow ones.",
  },
  {
    id: "party",
    name: "Party",
    emoji: "✨",
    background: {
      type: "image",
      source: "/backgrounds/party.jpg",
    },
    accent: "#ff6fa5",
    overlay: 0.4,
    message: "Turn it up.",
  },
];

export const defaultMood = moods[0];

export function getMood(id: string | undefined | null): Mood {
  return moods.find((m) => m.id === id) ?? defaultMood;
}
