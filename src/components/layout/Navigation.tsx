"use client";

import { Images, ListMusic, Mail } from "lucide-react";
import { site } from "@/data/site";
import { useSecrets } from "@/lib/secrets-context";
import { ShareButton } from "./ShareButton";

export function Navigation({
  onOpenSongs,
  onOpenMemories,
  onOpenLetter,
}: {
  onOpenSongs: () => void;
  onOpenMemories: () => void;
  onOpenLetter: () => void;
}) {
  const { reveal } = useSecrets();

  return (
    <header className="safe-top fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pb-3 sm:px-8">
      <p className="select-none font-serif text-base tracking-wide text-white/90 sm:text-lg">
        {site.wordmark}{" "}
        <button
          type="button"
          onClick={() => reveal(site.secrets.heart)}
          aria-label="♡"
          className="inline-flex h-11 w-6 items-center justify-center align-middle"
        >
          ♡
        </button>
      </p>

      <nav className="flex items-center gap-1" aria-label="Site">
        <ShareButton />
        <button
          type="button"
          onClick={onOpenMemories}
          aria-label="Our little things"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Images size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onOpenLetter}
          aria-label={site.letter.trigger}
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Mail size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onOpenSongs}
          aria-label="All songs"
          className="flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm text-white/90 transition-colors hover:bg-white/20"
        >
          <ListMusic size={16} aria-hidden />
          <span className="hidden sm:inline">All Songs</span>
        </button>
      </nav>
    </header>
  );
}
