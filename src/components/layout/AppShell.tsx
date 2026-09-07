"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { getSongById, playableSongs } from "@/data/songs";
import { getMood, defaultMood } from "@/data/moods";
import { usePlayer } from "@/lib/player-context";
import { MoodBackground } from "@/components/background/MoodBackground";
import { HomeHero } from "@/components/layout/HomeHero";
import { Navigation } from "@/components/layout/Navigation";
import { MusicPlayer } from "@/components/player/MusicPlayer";
import { MiniPlayer } from "@/components/player/MiniPlayer";
import { NowPlayingHeadline } from "@/components/player/NowPlayingHeadline";
import { PlaybackError } from "@/components/player/PlaybackError";
import { AllSongsPanel } from "@/components/songs/AllSongsPanel";
import { QueuePanel } from "@/components/queue/QueuePanel";
import { LoveLetter } from "@/components/memories/LoveLetter";

export function AppShell() {
  const { state, currentMood, preload, startRadio } = usePlayer();
  const searchParams = useSearchParams();
  const appliedShareLink = useRef(false);

  const [songsOpen, setSongsOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  // Shareable URLs: /?song=blue-eyes or /?mood=party — applied once on load.
  useEffect(() => {
    if (appliedShareLink.current) return;
    appliedShareLink.current = true;
    const songParam = searchParams.get("song");
    const moodParam = searchParams.get("mood");

    // We only ever preload (cue, muted, paused) — never auto-play — since
    // browsers block audio playback without a user gesture, and this site
    // never plays sound before Visshuu presses play himself.
    const song = getSongById(songParam);
    if (song?.youtubeId) {
      preload(song.id);
      return;
    }
    if (moodParam) {
      const match = playableSongs.find((s) => s.mood === moodParam);
      if (match) preload(match.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const backgroundMood = state.hasStarted ? currentMood : getMood(defaultMood.id);
  const variantSeed = state.currentId ?? "home";

  return (
    <div className="relative min-h-[100svh]">
      <MoodBackground mood={backgroundMood} variantSeed={variantSeed} />

      <AnimatePresence mode="wait">
        {!state.hasStarted ? (
          <HomeHero key="hero" onPlay={startRadio} />
        ) : (
          <div key="main" className="flex min-h-[100svh] flex-col">
            <Navigation onOpenSongs={() => setSongsOpen(true)} onOpenLetter={() => setLetterOpen(true)} />

            <main className="flex flex-1 items-center justify-center px-4 pb-32 pt-24 sm:pb-40">
              <NowPlayingHeadline />
            </main>

            <MusicPlayer onOpenSongs={() => setSongsOpen(true)} onOpenQueue={() => setQueueOpen(true)} />
            <MiniPlayer onOpenSongs={() => setSongsOpen(true)} onOpenQueue={() => setQueueOpen(true)} />
          </div>
        )}
      </AnimatePresence>

      <PlaybackError />
      <AllSongsPanel open={songsOpen} onClose={() => setSongsOpen(false)} />
      <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
      <LoveLetter open={letterOpen} onClose={() => setLetterOpen(false)} />
    </div>
  );
}
