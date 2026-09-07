"use client";

import { useState } from "react";
import { Music2 } from "lucide-react";
import type { Song } from "@/data/songs";
import { hashString } from "@/lib/hash";

/** Falls back to a tasteful generated tile if a song has no artwork file yet. */
export function SongArtwork({
  song,
  className = "",
  sizePx = 56,
}: {
  song: Pick<Song, "title" | "artwork">;
  className?: string;
  sizePx?: number;
}) {
  const [failed, setFailed] = useState(!song.artwork);

  if (failed) {
    const hue = hashString(song.title) % 360;
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 55% 22%), hsl(${(hue + 40) % 360} 55% 14%))`,
        }}
      >
        <Music2 size={Math.max(16, sizePx * 0.32)} className="text-white/70" aria-hidden />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={song.artwork}
      alt=""
      className={`shrink-0 object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
