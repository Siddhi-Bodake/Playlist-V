"use client";

import { useEffect } from "react";

/** Registers the offline-shell service worker. Renders nothing. */
export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failing (unsupported browser, blocked, etc.) should
      // never break the app — it just means no offline shell this time.
    });
  }, []);

  return null;
}
