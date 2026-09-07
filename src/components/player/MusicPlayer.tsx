"use client";

/**
 * Desktop/tablet playback bar — docked to the bottom of the screen, solid
 * and blurred enough to read clearly no matter what's behind it (unlike a
 * translucent floating card, which disappears over a bright background).
 * Hidden on mobile in favor of MiniPlayer.
 */

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
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 hidden justify-center px-6 pb-6 sm:flex">
      <div className="flex w-full max-w-5xl items-center gap-6 rounded-2xl bg-black/75 px-5 py-3.5 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
        <div className="w-56 shrink-0 lg:w-64">
          <NowPlaying />
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <PlayerControls />
          <ProgressBar
            currentTime={state.currentTime}
            duration={state.duration}
            onSeek={seekTo}
            accent={currentMood.accent}
          />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <VolumeControl className="hidden lg:flex" />
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
