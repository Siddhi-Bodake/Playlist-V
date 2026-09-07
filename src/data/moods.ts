/**
 * MOOD / BACKGROUND CONFIGURATION
 * ---------------------------------------------------------------------------
 * The background isn't picked from a menu — it follows whatever is currently
 * playing. Every song in `songs.ts` is tagged with a `mood` id (see the
 * `SongMood` union there). Whichever mood the current song belongs to is the
 * background you see, and the site crossfades between them without
 * interrupting playback.
 *
 * Each mood can hold *several* background images (a "pool") instead of just
 * one — the site picks one deterministically based on the current song, so
 * the same song always shows the same background, but different songs in
 * the same mood show some variety instead of one static image forever.
 *
 * To add a new mood later:
 *   1. Drop image(s) into /public/backgrounds/
 *   2. Add an entry below with a new id
 *   3. Tag songs in songs.ts with that id
 * That's the whole process — nothing else in the UI needs to change.
 */

export interface MoodBackground {
  type: "image" | "video";
  /** Default source — used on landscape/wide viewports (and everywhere if no portraitSource). */
  source: string;
  /** Optional alternate crop shown on narrow/tall (phone-portrait) viewports. */
  portraitSource?: string;
  /** Required for type "video" — shown until the video can play. */
  poster?: string;
}

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  backgrounds: MoodBackground[];
  /** CSS color used for glows/accents/active states while this mood is showing. */
  accent: string;
  /** Overlay strength (0-1) so text stays readable regardless of the image. */
  overlay: number;
  /** Optional line shown near the player while this mood is active. Keep it short. */
  message?: string;
}

export const moods: Mood[] = [
  {
    id: "silent",
    name: "Quiet",
    emoji: "🌙",
    backgrounds: [
      {
        type: "image",
        source: "/backgrounds/silent-1-sunset-mountain.jpg",
        portraitSource: "/backgrounds/silent-1-sunset-mountain-portrait.jpg",
      },
      { type: "image", source: "/backgrounds/silent-2-night-drive.jpg" },
      { type: "image", source: "/backgrounds/silent-3-campfire.jpg" },
      { type: "image", source: "/backgrounds/silent-4-beach-sunset.jpg" },
    ],
    accent: "#a9b8d9",
    overlay: 0.55,
    message: "For the slow ones.",
  },
  {
    id: "party",
    name: "Party",
    emoji: "✨",
    backgrounds: [{ type: "image", source: "/backgrounds/party-1-dj-crowd.jpg" }],
    accent: "#ff6fa5",
    overlay: 0.4,
    message: "Turn it up.",
  },
];

export const defaultMood = moods[0];

export function getMood(id: string | undefined | null): Mood {
  return moods.find((m) => m.id === id) ?? defaultMood;
}
