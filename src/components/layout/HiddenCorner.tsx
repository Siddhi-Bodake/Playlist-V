"use client";

import { site } from "@/data/site";
import { useSecrets } from "@/lib/secrets-context";

/** One of the 2-3 hidden surprises — a barely-there corner that isn't meant to be obvious. */
export function HiddenCorner() {
  const { reveal } = useSecrets();
  return (
    <button
      type="button"
      onClick={() => reveal(site.secrets.hidden)}
      aria-hidden
      tabIndex={-1}
      className="fixed bottom-0 left-0 z-30 h-10 w-10 opacity-0"
    />
  );
}
