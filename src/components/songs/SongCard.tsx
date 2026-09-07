"use client";

import { Heart, ListPlus, Pause, Play } from "lucide-react";
import clsx from "clsx";
import type { Song } from "@/data/songs";
import { usePlayer } from "@/lib/player-context";
import { SongArtwork } from "@/components/ui/SongArtwork";

export function SongCard({ song, index }: { song: Song; index: number }) {
  const { state, currentSong, selectSong, isFavorite, toggleFavorite, addToQueue } = usePlayer();
  const isCurrent = currentSong?.id === song.id;
  const playable = !!song.youtubeId;
  const fav = isFavorite(song.id);

  return (
    <div
      className={clsx(
        "group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors sm:px-3",
        isCurrent ? "bg-panel-hover" : "hover:bg-panel-soft"
      )}
    >
      <span className="w-6 shrink-0 text-center text-xs tabular-nums text-panel-muted">
        {String(index + 1).padStart(2, "0")}
      </span>

      <button
        type="button"
        onClick={() => playable && selectSong(song.id)}
        disabled={!playable}
        aria-label={playable ? `Play ${song.title}` : `${song.title} — needs confirmation`}
        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg disabled:opacity-40"
      >
        <SongArtwork song={song} sizePx={48} className="absolute inset-0 h-full w-full rounded-lg" />
        {playable && (
          <span className="relative z-10 flex h-full w-full items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            {isCurrent && state.isPlaying ? (
              <Pause size={16} className="fill-white text-white" aria-hidden />
            ) : (
              <Play size={16} className="translate-x-0.5 fill-white text-white" aria-hidden />
            )}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => playable && selectSong(song.id)}
        disabled={!playable}
        className="min-w-0 flex-1 text-left disabled:opacity-40"
      >
        <p className="truncate text-sm text-panel-fg">{song.title}</p>
        <p className="truncate text-xs text-panel-muted">
          {song.artist}
          {song.movie ? ` · ${song.movie}` : ""}
        </p>
        {!playable && (
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-panel-muted">Needs confirmation</p>
        )}
      </button>

      <div className="flex shrink-0 items-center gap-1">
        {playable && (
          <button
            type="button"
            onClick={() => addToQueue(song.id)}
            aria-label={`Add ${song.title} to queue`}
            className="flex h-11 w-11 items-center justify-center rounded-full text-panel-muted opacity-0 transition-opacity hover:text-panel-fg group-hover:opacity-100 group-focus-within:opacity-100 sm:h-9 sm:w-9"
          >
            <ListPlus size={16} aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={() => toggleFavorite(song.id)}
          aria-label={fav ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`}
          aria-pressed={fav}
          className={clsx(
            "flex h-11 w-11 items-center justify-center rounded-full sm:h-9 sm:w-9",
            fav ? "text-[#ff6fa5]" : "text-panel-muted hover:text-panel-fg"
          )}
        >
          <Heart size={16} className={clsx(fav && "fill-current")} aria-hidden />
        </button>
      </div>
    </div>
  );
}
