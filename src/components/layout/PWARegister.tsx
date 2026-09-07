"use client";

import { useEffect } from "react";

/**
 * Registers the offline-shell service worker — production only. In dev,
 * a service worker will happily cache-first serve stale JS/CSS after every
 * edit (Fast Refresh doesn't override it), which looks like changes aren't
 * taking effect at all. Also actively unregisters any worker + clears
 * caches left over from before this guard existed, so a dev build never
 * gets stuck behind one again.
 */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failing (unsupported browser, blocked, etc.) should
      // never break the app — it just means no offline shell this time.
    });
  }, []);

  return null;
}
