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

  return (
    <div className={clsx("flex items-center gap-4", large && "flex-col text-center sm:flex-row sm:text-left")}>
      <motion.div
        key={currentSong.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={clsx(
          "overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10",
          large ? "h-56 w-56 sm:h-64 sm:w-64" : "h-14 w-14"
        )}
      >
        <SongArtwork
          song={currentSong}
          sizePx={large ? 256 : 56}
          className={clsx("h-full w-full", large ? "rounded-2xl" : "rounded-xl")}
        />
      </motion.div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">Now Playing</p>
        <motion.h2
          key={currentSong.id + "-title"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "truncate font-serif text-white",
            large ? "mt-2 text-3xl sm:text-4xl" : "mt-0.5 text-base"
          )}
        >
          {currentSong.title}
        </motion.h2>
        <p className={clsx("truncate text-white/60", large ? "mt-1 text-base" : "text-xs")}>
          {currentSong.artist}
          {currentSong.movie ? ` · ${currentSong.movie}` : ""}
        </p>

        <button
          type="button"
          onClick={() => toggleFavorite(currentSong.id)}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={fav}
          className={clsx(
            "mt-3 flex h-11 w-11 items-center justify-center rounded-full transition-colors",
            large ? "mx-auto sm:mx-0" : "",
            fav ? "text-[var(--accent)]" : "text-white/50 hover:text-white"
          )}
          style={fav ? { color: currentMood.accent } : undefined}
        >
          <Heart size={20} className={clsx(fav && "fill-current")} aria-hidden />
        </button>
      </div>
    </div>
  );
}
