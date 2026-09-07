"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("offline", callback);
  window.addEventListener("online", callback);
  return () => {
    window.removeEventListener("offline", callback);
    window.removeEventListener("online", callback);
  };
}

/** Subtle, non-crashing notice for when the connection drops mid-session. */
export function OfflineBanner() {
  const offline = useSyncExternalStore(
    subscribe,
    () => !navigator.onLine,
    () => false // server/first paint: assume online, avoids a hydration flash
  );

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          role="status"
          className="fixed inset-x-0 top-0 z-[70] flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))]"
        >
          <div className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-xs text-white/90 backdrop-blur-md ring-1 ring-white/10">
            <WifiOff size={14} className="shrink-0" aria-hidden />
            <span>You&rsquo;re offline. The little room is still here — music will return when you&rsquo;re back.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
