"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Shuffle, Trash2, X } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { useEscapeClose } from "@/lib/use-escape-close";
import { SongArtwork } from "@/components/ui/SongArtwork";

export function QueuePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, currentSong, upcoming, removeFromQueue, clearQueue, shuffleQueue } = usePlayer();
  useEscapeClose(open, onClose);

  const explicitCount = state.explicitQueue.length;
  const queued = upcoming.slice(0, explicitCount);
  const upNext = upcoming.slice(explicitCount);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[58] flex justify-end bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Queue"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="safe-top safe-bottom flex h-[100svh] w-full max-w-sm flex-col bg-[#150c22] sm:ring-1 sm:ring-white/10"
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <h2 className="font-serif text-2xl text-white">Queue</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close queue"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 hover:bg-white/5 hover:text-white"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <div className="thin-scroll flex-1 overflow-y-auto px-5 pb-6 pt-2">
              {currentSong && (
                <section className="mb-6">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-white/40">Now Playing</p>
                  <div className="flex items-center gap-3">
                    <SongArtwork song={currentSong} sizePx={48} className="h-12 w-12 rounded-lg" />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">{currentSong.title}</p>
                      <p className="truncate text-xs text-white/50">{currentSong.artist}</p>
                    </div>
                  </div>
                </section>
              )}

              {queued.length > 0 && (
                <section className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">Up Next</p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={shuffleQueue}
                        aria-label="Shuffle queue"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:text-white"
                      >
                        <Shuffle size={15} aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={clearQueue}
                        aria-label="Clear queue"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:text-white"
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {queued.map((song, i) => (
                      <li key={`${song.id}-${i}`} className="group flex items-center gap-3 rounded-lg px-1 py-1.5 hover:bg-white/5">
                        <SongArtwork song={song} sizePx={40} className="h-10 w-10 rounded-md" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-white/90">{song.title}</p>
                          <p className="truncate text-xs text-white/45">{song.artist}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromQueue(i)}
                          aria-label={`Remove ${song.title} from queue`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-white/30 opacity-0 transition-opacity hover:text-white group-hover:opacity-100 group-focus-within:opacity-100"
                        >
                          <X size={14} aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {upNext.length > 0 && (
                <section>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-white/40">
                    Continuing with
                  </p>
                  <ul className="flex flex-col gap-1">
                    {upNext.map((song, i) => (
                      <li key={`${song.id}-${i}`} className="flex items-center gap-3 rounded-lg px-1 py-1.5">
                        <SongArtwork song={song} sizePx={40} className="h-10 w-10 rounded-md opacity-80" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-white/70">{song.title}</p>
                          <p className="truncate text-xs text-white/40">{song.artist}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {!currentSong && queued.length === 0 && upNext.length === 0 && (
                <p className="mt-10 text-center text-sm text-white/40">Nothing queued yet — press play.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
