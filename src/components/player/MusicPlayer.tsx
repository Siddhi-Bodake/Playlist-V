"use client";

/** The larger, desktop/tablet music-room experience — hidden on mobile in favor of MiniPlayer. */

import { ListMusic, ListPlus } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { NowPlaying } from "./NowPlaying";
import { ProgressBar } from "./ProgressBar";
import { PlayerControls } from "./PlayerControls";
import { VolumeControl } from "./VolumeControl";

export function MusicPlayer({
  onOpenSongs,
  onOpenQueue,
}: {
  onOpenSongs: () => void;
  onOpenQueue: () => void;
}) {
  const { state, currentSong, currentMood, seekTo } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="hidden w-full max-w-xl flex-col items-center gap-8 rounded-3xl bg-black/25 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:flex">
      <NowPlaying large />

      <div className="w-full">
        <ProgressBar
          currentTime={state.currentTime}
          duration={state.duration}
          onSeek={seekTo}
          accent={currentMood.accent}
        />
      </div>

      <PlayerControls size="lg" />

      <div className="flex w-full items-center justify-between">
        <VolumeControl />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenQueue}
            aria-label="Open queue"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:text-white"
          >
            <ListPlus size={18} aria-hidden />
          </button>
          <button
            type="button"
            onClick={onOpenSongs}
            aria-label="Open all songs"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:text-white"
          >
            <ListMusic size={18} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
