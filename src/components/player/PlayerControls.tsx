"use client";

import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import clsx from "clsx";

export function PlayerControls({ size = "md" }: { size?: "md" | "lg" }) {
  const { state, togglePlay, next, previous, toggleShuffle, cycleRepeat } = usePlayer();

  const iconSize = size === "lg" ? 22 : 18;
  const playButtonSize = size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const playIconSize = size === "lg" ? 26 : 20;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={toggleShuffle}
        aria-label="Shuffle"
        aria-pressed={state.shuffle}
        className={clsx(
          "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
          state.shuffle ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
        )}
      >
        <Shuffle size={iconSize} aria-hidden />
      </button>

      <button
        type="button"
        onClick={previous}
        aria-label="Previous"
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/85 hover:text-white"
      >
        <SkipBack size={iconSize + 2} className="fill-current" aria-hidden />
      </button>

      <button
        type="button"
        onClick={togglePlay}
        aria-label={state.isPlaying ? "Pause" : "Play"}
        className={clsx(
          "flex items-center justify-center rounded-full bg-white text-[#1a1025] shadow-lg transition-transform active:scale-95",
          playButtonSize
        )}
      >
        {state.isPlaying ? (
          <Pause size={playIconSize} className="fill-current" aria-hidden />
        ) : (
          <Play size={playIconSize} className="translate-x-0.5 fill-current" aria-hidden />
        )}
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="flex h-11 w-11 items-center justify-center rounded-full text-white/85 hover:text-white"
      >
        <SkipForward size={iconSize + 2} className="fill-current" aria-hidden />
      </button>

      <button
        type="button"
        onClick={cycleRepeat}
        aria-label={`Repeat: ${state.repeatMode}`}
        aria-pressed={state.repeatMode !== "off"}
        className={clsx(
          "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
          state.repeatMode !== "off" ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
        )}
      >
        {state.repeatMode === "one" ? (
          <Repeat1 size={iconSize} aria-hidden />
        ) : (
          <Repeat size={iconSize} aria-hidden />
        )}
      </button>
    </div>
  );
}
