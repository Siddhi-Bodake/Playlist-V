/**
 * SITE CONTENT CONFIGURATION
 * ---------------------------------------------------------------------------
 * Every piece of personal copy on the site lives here. Edit this file to
 * change what the site says — no component should hardcode this text.
 */

export const site = {
  name: "For Visshuu",
  shortName: "Visshuu",
  displayName: "FOR VISSHUU ♡",
  // Bare wordmark (no heart) — the nav renders the ♡ as its own clickable
  // easter-egg button right after this, rather than baking it into the text.
  wordmark: "FOR VISSHUU",
  subtitle: "Kya hal chal Visshuu? 🙂‍↔️",
  tagline: "Press play. Stay for a while.",
  description: "A little corner of the internet made just for Visshuu.",

  // Shown briefly under the title on first load, before the player starts.
  homeMessage: {
    title: "FOR VISSHUU ♡",
    prompt: "Press play.",
  },

  // Big decorative headline shown behind the player once a song is playing
  // — edit or remove freely (set to null to hide it entirely). "Visshuu"
  // stays in English (his name), "ki playlist" is in Hindi — the common
  // Hinglish mixing style, not a translation slip.
  playlistHeadline: "Visshuu की प्लेलिस्ट",

  // Time-of-day greetings shown subtly once the player is open.
  // Keep these short — this is atmosphere, not a headline.
  greetings: {
    morning: "Good morning, Visshuu.",
    afternoon: "Hi, Visshuu.",
    evening: "Good evening, Visshuu.",
    lateNight: "Still awake?",
  },

  // "A little something for you" — the personal letter. Edit freely.
  letter: {
    trigger: "A little something for you",
    heading: "For you",
    // Use "\n\n" for paragraph breaks — the LoveLetter component splits on it.
    body: `Hello Visshuu! If you are reading this matalb you pressed the right button🙂‍↔️💅🏻

Gane Wane Sunooo aurr Nachooo....🙂‍↔️💗`,
    signature: "— always yours",
  },

  // Small hidden interactions. Keep this list short and intentional.
  secrets: {
    heart: "You're my favorite person.",
    hidden: "Found something that wasn't supposed to be this easy to find.",
  },

  social: {
    ogTitle: "FOR VISSHUU ♡",
    ogDescription: "A little corner of the internet made just for Visshuu.",
  },
} as const;

export type Site = typeof site;
