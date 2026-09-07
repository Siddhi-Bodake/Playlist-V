"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "@/lib/player-context";

export function PlaybackError() {
  const { state } = usePlayer();

  return (
    <AnimatePresence>
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          role="alert"
          className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-[65] flex justify-center px-4"
        >
          <p className="rounded-full bg-black/70 px-4 py-2 text-xs text-white/90 backdrop-blur-md ring-1 ring-white/10">
            {state.error}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
