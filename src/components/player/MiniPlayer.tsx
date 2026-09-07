"use client";

/** Sticky bottom mini-player for mobile — tap it to expand into the full player. */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ListMusic, ListPlus, Pause, Play, SkipForward } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { SongArtwork } from "@/components/ui/SongArtwork";
import { NowPlaying } from "./NowPlaying";
import { ProgressBar } from "./ProgressBar";
import { PlayerControls } from "./PlayerControls";
import { VolumeControl } from "./VolumeControl";

export function MiniPlayer({
  onOpenSongs,
  onOpenQueue,
}: {
  onOpenSongs: () => void;
  onOpenQueue: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { state, currentSong, currentMood, togglePlay, next, seekTo } = usePlayer();

  if (!currentSong) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setExpanded(true)}
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        aria-label={`Now playing: ${currentSong.title}. Open full player`}
        className="fixed inset-x-2 bottom-2 z-50 flex items-center gap-3 rounded-2xl bg-black/60 p-2 pr-3 text-left shadow-2xl ring-1 ring-white/10 backdrop-blur-xl sm:hidden"
      >
        <SongArtwork song={currentSong} sizePx={48} className="h-12 w-12 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{currentSong.title}</p>
          <p className="truncate text-xs text-white/60">{currentSong.movie ?? currentSong.artist}</p>
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          onKeyDown={(e) => e.key === "Enter" && next()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/85"
        >
          <SkipForward size={18} className="fill-current" aria-hidden />
        </span>
        <span
          role="button"
          tabIndex={0}
          aria-label={state.isPlaying ? "Pause" : "Play"}
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          onKeyDown={(e) => e.key === "Enter" && togglePlay()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1a1025]"
        >
          {state.isPlaying ? (
            <Pause size={18} className="fill-current" aria-hidden />
          ) : (
            <Play size={18} className="translate-x-0.5 fill-current" aria-hidden />
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed inset-0 z-[55] flex flex-col justify-end sm:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
            />
            <div className="safe-bottom relative flex max-h-[92svh] flex-col gap-6 overflow-y-auto rounded-t-3xl bg-[#150c22]/95 p-6 pt-4 shadow-2xl ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Collapse player"
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-full text-white/60"
              >
                <ChevronDown size={22} aria-hidden />
              </button>

              <NowPlaying large />

              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration}
                onSeek={seekTo}
                accent={currentMood.accent}
              />

              <PlayerControls size="lg" />

              <VolumeControl className="justify-center" />

              <div className="flex items-center justify-center gap-3 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(false);
                    onOpenQueue();
                  }}
                  className="flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80"
                >
                  <ListPlus size={16} aria-hidden /> Queue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(false);
                    onOpenSongs();
                  }}
                  className="flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80"
                >
                  <ListMusic size={16} aria-hidden /> All Songs
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
