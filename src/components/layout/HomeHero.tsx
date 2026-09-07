"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { site } from "@/data/site";
import { getGreeting } from "@/lib/time";

// The greeting depends on the viewer's local clock, which the server can't
// know — useSyncExternalStore lets it render nothing during SSR and pick up
// the real value right after hydration, with no effect/setState needed.
const noopSubscribe = () => () => {};

export function HomeHero({ onPlay }: { onPlay: () => void }) {
  const greeting = useSyncExternalStore(noopSubscribe, () => getGreeting(), () => null);

  return (
    <motion.section
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: greeting ? 0.6 : 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-4 min-h-[1.25rem] text-xs uppercase tracking-[0.3em] text-white/60"
      >
        {greeting}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-balance font-serif text-5xl tracking-wide text-white sm:text-6xl md:text-7xl"
      >
        {site.homeMessage.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-4 max-w-sm text-balance text-sm text-white/70 sm:text-base"
      >
        {site.subtitle}
      </motion.p>

      <motion.button
        type="button"
        onClick={onPlay}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Press play"
        className="group mt-12 flex min-h-14 min-w-14 items-center gap-3 rounded-full bg-white/10 px-8 py-4 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/20"
      >
        <Play size={20} className="fill-current" aria-hidden />
        <span className="font-serif text-lg tracking-wide">{site.homeMessage.prompt}</span>
      </motion.button>
    </motion.section>
  );
}
