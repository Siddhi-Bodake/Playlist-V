import { useSyncExternalStore } from "react";

const QUERY = "(orientation: portrait)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** True on narrow/tall (phone-portrait) viewports — used to swap in portrait-cropped backgrounds. */
export function useIsPortrait(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
