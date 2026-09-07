"use client";

import { useState } from "react";
import { formatTime } from "@/lib/format";

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
  accent,
}: {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  accent: string;
}) {
  const [dragValue, setDragValue] = useState<number | null>(null);
  const safeDuration = duration > 0 ? duration : 0;
  const shown = dragValue ?? currentTime;
  const pct = safeDuration > 0 ? Math.min(100, (shown / safeDuration) * 100) : 0;

  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-white/60">
        {formatTime(shown)}
      </span>
      <div className="relative flex min-h-11 flex-1 items-center">
        <div className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full bg-white/15">
          <div
            className="h-full rounded-full transition-[width] duration-150"
            style={{ width: `${pct}%`, background: accent }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={safeDuration || 1}
          step={0.1}
          value={shown}
          aria-label="Seek"
          onChange={(e) => setDragValue(Number(e.target.value))}
          onPointerUp={(e) => {
            const value = Number((e.target as HTMLInputElement).value);
            onSeek(value);
            setDragValue(null);
          }}
          className="relative z-10 h-11 w-full cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
        />
      </div>
      <span className="w-9 shrink-0 text-[11px] tabular-nums text-white/60">
        {formatTime(safeDuration)}
      </span>
    </div>
  );
}
