"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { usePlayer } from "@/lib/player-context";
import { SongArtwork } from "@/components/ui/SongArtwork";

export function NowPlaying({ large = false }: { large?: boolean }) {
  const { currentSong, isFavorite, toggleFavorite, currentMood } = usePlayer();

  if (!currentSong) return null;
  const fav = isFavorite(currentSong.id);

  const artwork = (
    <motion.div
      key={currentSong.id}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsx(
        "shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10",
        large ? "h-56 w-56 sm:h-64 sm:w-64" : "h-12 w-12"
      )}
    >
      <SongArtwork
        song={currentSong}
        sizePx={large ? 256 : 48}
        className={clsx("h-full w-full", large ? "rounded-2xl" : "rounded-xl")}
      />
    </motion.div>
  );

  const favoriteButton = (
    <button
      type="button"
      onClick={() => toggleFavorite(currentSong.id)}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={fav}
      className={clsx(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
        fav ? "" : "text-white/50 hover:text-white"
      )}
      style={fav ? { color: currentMood.accent } : undefined}
    >
      <Heart size={large ? 20 : 17} className={clsx(fav && "fill-current")} aria-hidden />
    </button>
  );

  if (large) {
    return (
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        {artwork}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">Now Playing</p>
          <motion.h2
            key={currentSong.id + "-title"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 truncate font-serif text-3xl text-white sm:text-4xl"
          >
            {currentSong.title}
          </motion.h2>
          <p className="mt-1 truncate text-base text-white/60">
            {currentSong.artist}
            {currentSong.movie ? ` · ${currentSong.movie}` : ""}
          </p>
          <div className="mx-auto mt-3 sm:mx-0">{favoriteButton}</div>
        </div>
      </div>
    );
  }

  // Compact — used in the bottom player bar: one row, no label, heart inline.
  return (
    <div className="flex items-center gap-3">
      {artwork}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{currentSong.title}</p>
        <p className="truncate text-xs text-white/55">
          {currentSong.artist}
          {currentSong.movie ? ` · ${currentSong.movie}` : ""}
        </p>
      </div>
      {favoriteButton}
    </div>
  );
}
