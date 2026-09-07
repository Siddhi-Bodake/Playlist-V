# FOR VISHUU ♡

A private little music room — built for one person. Next.js + TypeScript +
Tailwind + Framer Motion, playing back through the official YouTube IFrame
Player API (no downloaded/ripped audio, ever).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it on [vercel.com/new](https://vercel.com/new) — no special
   configuration needed, it's a standard Next.js app.
3. Set the one environment variable below (optional but recommended).
4. Deploy.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Optional | Absolute URL of the deployed site (e.g. `https://for-vishuu.vercel.app`), used to build correct Open Graph/share-preview image URLs. Falls back to a placeholder if omitted. |

No database, no auth, no server-only secrets — everything (favorites,
recently played, the sticky note, preferences) lives in the visitor's own
browser via `localStorage`.

## Project structure

```
src/
  app/                 # routes, layout, metadata, manifest, PWA icons
  components/
    player/            # MusicPlayer (desktop), MiniPlayer (mobile), controls
    songs/              # All Songs panel, search/filter, song rows
    queue/              # Queue panel
    background/         # crossfading mood background
    memories/            # "Our Little Things" + the letter
    notes/               # the always-there sticky note
    layout/              # nav, hero, PWA/offline plumbing, easter eggs
    ui/                  # small shared bits (artwork w/ fallback)
  data/                # <- all editable content lives here
    site.ts             # site copy, greetings, the letter, secrets
    songs.ts            # the song library
    moods.ts            # backgrounds ("silent" / "party")
    memories.ts          # "Our Little Things" cards
  lib/                 # player state, YouTube loader, storage, helpers
public/
  backgrounds/         # mood background images
  songs/artwork/       # song cover art
  memories/            # memory photos
  icons/, photos/
```

## How the "mood" system works

There's no manual mood picker. Every song in `src/data/songs.ts` is tagged
`mood: "silent" | "party"`, and the full-screen background crossfades to
match whatever's currently playing (see `src/data/moods.ts`). Adding a new
mood later is 3 steps: drop an image in `/public/backgrounds/`, add an entry
to `moods.ts`, tag some songs with that mood id — nothing else changes.

## How to add a song

Open `src/data/songs.ts` and copy any entry:

```ts
{
  id: "some-unique-id",
  title: "Song Title",
  artist: "Artist Name",
  movie: "Movie Name",       // or null for a standalone single
  artwork: "/songs/artwork/some-unique-id.jpg",
  youtubeId: "XXXXXXXXXXX",  // from youtube.com/watch?v=XXXXXXXXXXX
  mood: "silent",            // or "party"
  tags: ["romantic", "bollywood"],
}
```

It will automatically show up in All Songs, search, radio mode, and the
queue. If you don't have artwork yet, leave the file missing — the UI shows
a tasteful generated cover instead of a broken image.

**A few songs are marked `needsConfirmation: true`** with a `note` field —
these are titles where the official YouTube video wasn't 100% certain (see
the note on each). They're safely skipped during playback (never guessed)
until you fill in a real `youtubeId`.

## How to change backgrounds

Drop images into `/public/backgrounds/` named to match `src/data/moods.ts`
(currently `silent.jpg` and `party.jpg`). Any image size works — it's
cropped to fill the screen with a readability overlay on top. No image yet?
The site falls back to a soft gradient instead of breaking.

## How to add memories

Open `src/data/memories.ts` and add an entry. `layout` controls how it's
presented (`"polaroid"`, `"full"`, `"note"`, `"strip"` for a photo strip).
Photos go in `/public/memories/`.

## How to modify the personal message

Everything text-related — the homepage line, greetings, the letter, the
hidden-surprise messages — lives in `src/data/site.ts`. Edit it directly;
no component contains hardcoded copy.

## Notes on the YouTube video choices

Every `youtubeId` was looked up and matched against title/artist/movie on
the official channel where possible; a few required correcting the
originally-assumed singer/movie credit (see the `note` field on those
entries). One song, **"Dooriya"**, was left unset — the title is shared by
several unrelated songs (most are actually spelled "Dooriyan") and picking
wrong risked embedding the wrong song entirely. See the note on that entry
in `songs.ts` for the two most likely candidates, then fill in the id
yourself once you've picked one.

## PWA / offline

The site is installable (Add to Home Screen) and ships a minimal offline
shell (`public/sw.js`) so the interface itself can still open with no
signal. Songs still need an internet connection — YouTube audio is never
cached or downloaded — and the UI says so plainly when offline instead of
pretending otherwise.
