"use client";

/**
 * Big, decorative title shown directly over the background once a song is
 * playing — no card behind it, just text + shadow, the way the reference
 * sites treat their headline. Purely decorative (favorite/etc. controls
 * live in the bottom player bar), so it never intercepts clicks.
 *
 * The headline mixes scripts on purpose — "Visshuu" stays in English (his
 * name), "की प्लेलिस्ट" is in Hindi — set in the same bold, chunky display
 * face (Baloo 2) that gives the reference sites' headlines their poster-y
 * look, in both scripts.
 */

import { motion } from "framer-motion";
import { site } from "@/data/site";
import { usePlayer } from "@/lib/player-context";

export function NowPlayingHeadline() {
  const { currentSong } = usePlayer();
  if (!currentSong) return null;

  return (
    <div className="pointer-events-none flex flex-col items-center px-6 text-center">
      {site.playlistHeadline && (
        <p className="font-hindi text-balance text-[10vw] font-extrabold leading-none text-white/95 drop-shadow-[0_6px_32px_rgba(0,0,0,0.65)] sm:text-6xl md:text-7xl lg:text-8xl">
          {site.playlistHeadline}
        </p>
      )}

      <motion.p
        key={currentSong.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-5 max-w-lg text-balance font-serif text-3xl text-white drop-shadow-lg sm:text-4xl"
      >
        {currentSong.title}
      </motion.p>
      <p className="mt-2 text-sm text-white/60 sm:text-base">
        {currentSong.artist}
        {currentSong.movie ? ` · ${currentSong.movie}` : ""}
      </p>
    </div>
  );
}
