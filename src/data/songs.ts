/**
 * SONG LIBRARY
 * ---------------------------------------------------------------------------
 * The single source of truth for every track. Nothing about a song should be
 * hardcoded in a component — add, edit, or remove songs here only.
 *
 * `youtubeId` is the 11-character id from a YouTube URL
 * (https://www.youtube.com/watch?v=XXXXXXXXXXX -> "XXXXXXXXXXX").
 * If a song's correct/official video hasn't been verified yet, `youtubeId`
 * is left `null` and `needsConfirmation` is `true` — the player will skip
 * these gracefully instead of guessing.
 *
 * `mood` drives the background (see moods.ts): "silent" for the slow /
 * quiet songs, "party" for the upbeat ones. This is what makes the
 * background change automatically as the playlist plays.
 *
 * To add song #22: copy any entry below, give it a new unique `id`, fill it
 * in, and it will show up everywhere (All Songs, search, queue, radio mode)
 * automatically.
 */

export type SongMood = "silent" | "party";

export interface Song {
  id: string;
  title: string;
  artist: string;
  movie: string | null;
  /** Path under /public, e.g. "/songs/artwork/tera-hua.jpg". Falls back to a generated cover if missing. */
  artwork: string;
  youtubeId: string | null;
  mood: SongMood;
  tags: string[];
  /** Internal maintenance note — not shown in the UI. */
  needsConfirmation?: boolean;
  note?: string;
}

export const songs: Song[] = [
  {
    id: "tera-hua",
    title: "Tera Hua",
    artist: "Atif Aslam",
    movie: "Loveyatri",
    artwork: "/songs/artwork/tera-hua.jpg",
    youtubeId: "Ipbe7C4w1qc",
    mood: "silent",
    tags: ["romantic", "bollywood"],
  },
  {
    id: "i-love-you",
    title: "I Love You",
    artist: "Ash King, Clinton Cerejo",
    movie: "Bodyguard",
    artwork: "/songs/artwork/i-love-you.jpg",
    youtubeId: "v3F3QIfKAxk",
    mood: "party",
    tags: ["romantic", "bollywood", "fun"],
    needsConfirmation: true,
    note: "Singers corrected to Ash King & Clinton Cerejo (composer Pritam) — please confirm this is the right track.",
  },
  {
    id: "youre-my-love",
    title: "You're My Love",
    artist: "Shaan, Shweta Pandit, Suzanne D'Mello, Earl D'Souza",
    movie: "Partner",
    artwork: "/songs/artwork/youre-my-love.jpg",
    youtubeId: "dBUxfFoQpuo",
    mood: "silent",
    tags: ["romantic", "bollywood"],
  },
  {
    id: "teri-ore",
    title: "Teri Ore",
    artist: "Rahat Fateh Ali Khan, Shreya Ghoshal",
    movie: "Singh Is Kinng",
    artwork: "/songs/artwork/teri-ore.jpg",
    youtubeId: "GLEx6bhPu7s",
    mood: "silent",
    tags: ["romantic", "bollywood"],
  },
  {
    id: "halkat-jawani",
    title: "Halkat Jawani",
    artist: "Sunidhi Chauhan",
    movie: "Heroine",
    artwork: "/songs/artwork/halkat-jawani.jpg",
    youtubeId: "KStmDXnGXUc",
    mood: "party",
    tags: ["fun", "bollywood", "dance"],
  },
  {
    id: "sun-saathiya",
    title: "Sun Saathiya",
    artist: "Priya Saraiya, Divya Kumar",
    movie: "ABCD 2",
    artwork: "/songs/artwork/sun-saathiya.jpg",
    youtubeId: "TGpG56pg3UU",
    mood: "party",
    tags: ["fun", "bollywood", "dance"],
    needsConfirmation: true,
    note: "Singers corrected to Priya Saraiya & Divya Kumar (Sachin-Jigar compose, don't sing).",
  },
  {
    id: "ucha-lamba-kad",
    title: "Ucha Lamba Kad",
    artist: "Anand Raaj Anand, Kalpana Patowary",
    movie: "Welcome",
    artwork: "/songs/artwork/ucha-lamba-kad.jpg",
    youtubeId: "G3eacaumZxE",
    mood: "party",
    tags: ["fun", "bollywood", "dance"],
    needsConfirmation: true,
    note: "Singers corrected to Anand Raaj Anand & Kalpana Patowary.",
  },
  {
    id: "afghan-jalebi",
    title: "Afghan Jalebi (Ya Baba)",
    artist: "Asrar, Akhtar Chanal Zahri",
    movie: "Phantom",
    artwork: "/songs/artwork/afghan-jalebi.jpg",
    youtubeId: "zC3UbTf4qrM",
    mood: "party",
    tags: ["fun", "bollywood", "dance"],
    needsConfirmation: true,
    note: "Singers corrected to Asrar & Akhtar Chanal Zahri (composer Pritam).",
  },
  {
    id: "rishte-naate",
    title: "Rishte Naate",
    artist: "Rahat Fateh Ali Khan, Suzanne D'Mello",
    movie: "De Dana Dan",
    artwork: "/songs/artwork/rishte-naate.jpg",
    youtubeId: "2tcGMjvoIsI",
    mood: "silent",
    tags: ["romantic", "bollywood", "calm"],
    needsConfirmation: true,
    note: "Singers corrected to Rahat Fateh Ali Khan & Suzanne D'Mello (a separate remix features Kunal Ganjawala).",
  },
  {
    id: "dooriya",
    title: "Dooriya",
    artist: "Needs your confirmation",
    movie: null,
    artwork: "/songs/artwork/dooriya.jpg",
    youtubeId: null,
    mood: "silent",
    tags: ["calm"],
    needsConfirmation: true,
    note: "Ambiguous title — multiple unrelated songs share it (mostly spelled 'Dooriyan'). Top candidates: (1) 'Dooriyan' - Love Aaj Kal (2009), Mohit Chauhan — the classic Bollywood pick; (2) 'Dooriyan' - Zaeden ft. Aashna Hegde — the modern indie single. Tell me which one and I'll wire it in.",
  },
  {
    id: "tenu-le",
    title: "Tenu Le",
    artist: "Omer Inayat",
    movie: "Jai Veeru",
    artwork: "/songs/artwork/tenu-le.jpg",
    youtubeId: "U_Eqj9pGbcM",
    mood: "party",
    tags: ["nostalgia", "bollywood", "dance"],
    needsConfirmation: true,
    note: "Jai Veeru's actual song is 'Tennu Le Ke Jaana' by Omer Inayat — please confirm this is the one you meant.",
  },
  {
    id: "jab-tak",
    title: "Jab Tak",
    artist: "Armaan Malik",
    movie: "M.S. Dhoni: The Untold Story",
    artwork: "/songs/artwork/jab-tak.jpg",
    youtubeId: "K-Ts-NFR62o",
    mood: "silent",
    tags: ["romantic", "bollywood", "calm"],
  },
  {
    id: "falling-for-you",
    title: "Falling For You",
    artist: "Shrey Singhal",
    movie: null,
    artwork: "/songs/artwork/falling-for-you.jpg",
    youtubeId: "sVzKavzIKDI",
    mood: "silent",
    tags: ["romantic", "calm"],
  },
  {
    id: "aankhon-aankhon",
    title: "Aankhon Aankhon",
    artist: "Yo Yo Honey Singh",
    movie: "Bhaag Johnny",
    artwork: "/songs/artwork/aankhon-aankhon.jpg",
    youtubeId: "QYcWLqyZFjs",
    mood: "party",
    tags: ["fun"],
  },
  {
    id: "brown-rang",
    title: "Brown Rang",
    artist: "Yo Yo Honey Singh",
    movie: null,
    artwork: "/songs/artwork/brown-rang.jpg",
    youtubeId: "PqFMFVcCZgI",
    mood: "party",
    tags: ["fun"],
  },
  {
    id: "amplifier",
    title: "Amplifier",
    artist: "Imran Khan",
    movie: null,
    artwork: "/songs/artwork/amplifier.jpg",
    youtubeId: "uuCFRaFWjwY",
    mood: "party",
    tags: ["fun", "nostalgia"],
  },
  {
    id: "hulara",
    title: "Hulara",
    artist: "J-Star",
    movie: null,
    artwork: "/songs/artwork/hulara.jpg",
    youtubeId: "hmjlQ4vPt4c",
    mood: "party",
    tags: ["fun", "dance"],
    needsConfirmation: true,
    note: "'J Star' is an artist name (Jagdeep Singh), not a movie — this is his standalone single.",
  },
  {
    id: "criminal",
    title: "Criminal",
    artist: "Akon, Vishal Dadlani, Shruti Pathak",
    movie: "Ra.One",
    artwork: "/songs/artwork/criminal.jpg",
    youtubeId: "VIV3nS7KRok",
    mood: "party",
    tags: ["fun", "bollywood", "dance"],
    needsConfirmation: true,
    note: "Singers corrected to Akon, Vishal Dadlani & Shruti Pathak.",
  },
  {
    id: "one-thousand-miles",
    title: "One Thousand Miles",
    artist: "Yo Yo Honey Singh",
    movie: null,
    artwork: "/songs/artwork/one-thousand-miles.jpg",
    youtubeId: "EWRBHho2b_E",
    mood: "party",
    tags: ["fun", "nostalgia"],
  },
  {
    id: "blue-eyes",
    title: "Blue Eyes",
    artist: "Yo Yo Honey Singh",
    movie: null,
    artwork: "/songs/artwork/blue-eyes.jpg",
    youtubeId: "r7voxxo9rj8",
    mood: "party",
    tags: ["fun", "nostalgia"],
  },
  {
    id: "pari-hoon-main",
    title: "Pari Hoon Main",
    artist: "Falguni Pathak",
    movie: null,
    artwork: "/songs/artwork/pari-hoon-main.jpg",
    youtubeId: "ssh7iliB19E",
    mood: "party",
    tags: ["nostalgia", "dance"],
    needsConfirmation: true,
    note: "Pre-dates the music-video era, so this is Falguni Pathak's own channel upload rather than a polished official video.",
  },
];

export function getSongById(id: string | null | undefined): Song | undefined {
  if (!id) return undefined;
  return songs.find((s) => s.id === id);
}

export const playableSongs = songs.filter((s) => !!s.youtubeId);

/** Curated pointers used by the mood system / "for when..." section — suggestions, not restrictions. */
export const recommendedByMood: Record<SongMood, string[]> = {
  silent: songs.filter((s) => s.mood === "silent").map((s) => s.id),
  party: songs.filter((s) => s.mood === "party").map((s) => s.id),
};
