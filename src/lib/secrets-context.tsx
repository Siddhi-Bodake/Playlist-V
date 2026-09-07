"use client";

/**
 * Tiny shared toast for the 2-3 hidden interactions scattered around the
 * site (see site.ts -> secrets). Keep this list short — these should feel
 * like a nice surprise, not a feature.
 */

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SecretsContext = createContext<{ reveal: (message: string) => void } | null>(null);

export function SecretsProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const reveal = useCallback((msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage((current) => (current === msg ? null : current)), 3200);
  }, []);

  return (
    <SecretsContext.Provider value={{ reveal }}>
      {children}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="pointer-events-none fixed inset-x-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-[80] flex justify-center px-6 sm:bottom-28"
          >
            <p className="rounded-full bg-white/10 px-5 py-2.5 text-center font-serif text-sm text-white shadow-xl ring-1 ring-white/15 backdrop-blur-md">
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </SecretsContext.Provider>
  );
}

export function useSecrets() {
  const ctx = useContext(SecretsContext);
  if (!ctx) throw new Error("useSecrets must be used within a SecretsProvider");
  return ctx;
}
