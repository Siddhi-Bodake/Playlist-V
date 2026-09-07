"use client";

/**
 * Shares the current song (a ?song=<id> link, per the shareable-URL support
 * in AppShell) via the native share sheet where available, falling back to
 * copying the link to the clipboard. Never throws — a cancelled share sheet
 * or a blocked clipboard just quietly does nothing.
 */

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { site } from "@/data/site";
import { usePlayer } from "@/lib/player-context";
import { useSecrets } from "@/lib/secrets-context";

export function ShareButton() {
  const { currentSong } = usePlayer();
  const { reveal } = useSecrets();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}${
      currentSong ? `?song=${currentSong.id}` : ""
    }`;
    const title = currentSong ? `${currentSong.title} — ${site.displayName}` : site.displayName;
    const text = currentSong
      ? `Listening to ${currentSong.title} on ${site.displayName}`
      : site.social.ogDescription;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // Cancelled or blocked — not an error, nothing to show for it.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      reveal("Link copied.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — fail quietly rather than crash.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={currentSong ? `Share ${currentSong.title}` : "Share this site"}
      className="flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check size={18} aria-hidden /> : <Share2 size={18} aria-hidden />}
    </button>
  );
}
