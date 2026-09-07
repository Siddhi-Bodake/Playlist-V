"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import clsx from "clsx";
import { songs } from "@/data/songs";
import { usePlayer } from "@/lib/player-context";
import { useEscapeClose } from "@/lib/use-escape-close";
import { SongCard } from "./SongCard";

type Filter = "all" | "favorites" | "recent" | "silent" | "party";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
  { id: "recent", label: "Recently played" },
  { id: "silent", label: "Quiet" },
  { id: "party", label: "Party" },
];

export function AllSongsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = usePlayer();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  useEscapeClose(open, onClose);

  const results = useMemo(() => {
    let list = songs;
    if (filter === "favorites") list = list.filter((s) => state.favorites.includes(s.id));
    else if (filter === "recent") {
      list = state.recentlyPlayed
        .map((id) => songs.find((s) => s.id === id))
        .filter((s): s is (typeof songs)[number] => !!s);
    } else if (filter === "silent" || filter === "party") list = list.filter((s) => s.mood === filter);

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((s) =>
      [s.title, s.artist, s.movie ?? "", ...s.tags].some((field) => field.toLowerCase().includes(q))
    );
  }, [query, filter, state.favorites, state.recentlyPlayed]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[58] flex justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="All songs"
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="safe-top safe-bottom flex h-[100svh] w-full max-w-2xl flex-col bg-panel sm:my-6 sm:h-[calc(100svh-3rem)] sm:rounded-3xl sm:ring-1 sm:ring-panel-border"
          >
            <div className="flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-8">
              <div>
                <h2 className="font-serif text-3xl text-panel-fg">All Songs</h2>
                <p className="mt-1 text-sm text-panel-muted">Choose what you want to hear.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-11 w-11 items-center justify-center rounded-full text-panel-muted hover:bg-panel-soft hover:text-panel-fg"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <div className="px-5 pt-4 sm:px-8">
              <div className="flex items-center gap-2 rounded-full bg-panel-soft px-4 py-2.5 ring-1 ring-panel-border">
                <Search size={16} className="text-panel-muted" aria-hidden />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search songs, artists, movies…"
                  aria-label="Search songs"
                  className="min-h-6 w-full bg-transparent text-sm text-panel-fg placeholder:text-panel-muted focus:outline-none"
                />
              </div>

              <div className="thin-scroll mt-3 flex gap-2 overflow-x-auto pb-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={filter === f.id}
                    className={clsx(
                      "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors",
                      filter === f.id
                        ? "bg-panel-fg text-panel"
                        : "bg-panel-soft text-panel-muted hover:bg-panel-hover"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="thin-scroll mt-3 flex-1 overflow-y-auto px-3 pb-6 sm:px-5">
              {results.length === 0 ? (
                <p className="mt-10 text-center text-sm text-panel-muted">Nothing found.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {results.map((song, i) => (
                    <SongCard key={song.id} song={song} index={i} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
