"use client";

/**
 * Full-screen, crossfading background. It never reloads or interrupts
 * playback — it just fades from one mood's image to the next as the current
 * song's mood changes. Falls back to a plain gradient if an image hasn't
 * been dropped into /public/backgrounds/ yet, so the site never looks broken.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Mood } from "@/data/moods";

function BackgroundLayer({ mood }: { mood: Mood }) {
  const [failed, setFailed] = useState(false);
  const { background } = mood;

  if (failed) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, color-mix(in oklab, ${mood.accent} 35%, #0f0a1a) 0%, #0f0a1a 70%)`,
        }}
      />
    );
  }

  if (background.type === "video") {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={background.source}
        poster={background.poster}
        autoPlay
        muted
        loop
        playsInline
        onError={() => setFailed(true)}
      />
    );
  }

  // Plain <img> (not next/image) so a missing user-supplied file degrades
  // gracefully via onError instead of surfacing Next's image-error overlay.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={background.source}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export function MoodBackground({ mood }: { mood: Mood }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0f0a1a]">
      <AnimatePresence initial={false}>
        <motion.div
          key={mood.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <BackgroundLayer mood={mood} />
        </motion.div>
      </AnimatePresence>

      {/* Adaptive overlay so text always stays readable regardless of the image. */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: `linear-gradient(180deg, rgba(6,4,12,${mood.overlay}) 0%, rgba(6,4,12,${Math.min(
            mood.overlay + 0.25,
            0.85
          )}) 55%, rgba(6,4,12,${Math.min(mood.overlay + 0.35, 0.92)}) 100%)`,
        }}
      />
    </div>
  );
}
