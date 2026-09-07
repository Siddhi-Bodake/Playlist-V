"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/lib/player-context";

export function VolumeControl({ className = "" }: { className?: string }) {
  const { state, setVolume, toggleMute } = usePlayer();
  const effectiveVolume = state.muted ? 0 : state.volume;

  const Icon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 55 ? Volume1 : Volume2;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={state.muted ? "Unmute" : "Mute"}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/70 hover:text-white"
      >
        <Icon size={18} aria-hidden />
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={effectiveVolume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
        className="h-11 w-24 cursor-pointer appearance-none bg-transparent
          [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/20
          [&::-webkit-slider-thumb]:mt-[-5px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  );
}
