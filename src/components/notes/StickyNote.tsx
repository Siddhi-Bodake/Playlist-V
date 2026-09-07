"use client";

/**
 * A little sticky note that's always there, no matter what mood/song is
 * playing. Visshuu can write whatever he wants in it — it saves itself
 * (localStorage, nothing leaves the browser) and just stays, collapsed into
 * a small tab, until he opens it again. It only ever disappears if he
 * explicitly clears it.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NotebookPen, Trash2, X } from "lucide-react";
import { storage, storageKeys } from "@/lib/storage";
import { useEscapeClose } from "@/lib/use-escape-close";

const noopSubscribe = () => () => {};

export function StickyNote() {
  const [open, setOpen] = useState(false);
  // `draft` is null until Visshuu actually edits the note — until then the
  // persisted value (read safely across server/client via
  // useSyncExternalStore, avoiding any hydration mismatch) is shown as-is.
  const persisted = useSyncExternalStore(
    noopSubscribe,
    () => storage.get(storageKeys.stickyNote) ?? "",
    () => ""
  );
  const [draft, setDraft] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const text = draft ?? persisted;

  useEffect(() => {
    if (draft === null) return; // nothing typed yet this session — nothing new to save
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => storage.set(storageKeys.stickyNote, draft), 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [draft]);

  useEscapeClose(open, () => setOpen(false));

  const hasNote = text.trim().length > 0;

  return (
    <>
      {/* Collapsed tab — always present in the corner. */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={hasNote ? "Open your note" : "Leave a note"}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-11 min-h-11 w-11 min-w-11 items-center justify-center rounded-full bg-[#f6e9d8]/95 text-[#3a2418] shadow-lg ring-1 ring-black/10 backdrop-blur-sm transition-transform hover:scale-105 sm:bottom-6"
      >
        <NotebookPen size={18} aria-hidden />
        {hasNote && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#ff6fa5] ring-2 ring-[#f6e9d8]" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, rotate: -1 }}
              animate={{ y: 0, opacity: 1, rotate: -1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mb-[env(safe-area-inset-bottom)] w-[min(24rem,92vw)] rounded-sm bg-[#f6e9d8] p-5 text-[#3a2418] shadow-2xl"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 27px, rgba(58,36,24,0.08) 28px)",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="font-serif text-sm tracking-wide text-[#3a2418]/70">a note, just for you</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close note"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#3a2418]/60 hover:bg-black/5"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>

              <textarea
                value={text}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write something that stays…"
                rows={6}
                maxLength={2000}
                autoFocus
                className="w-full resize-none bg-transparent font-serif text-base leading-[28px] text-[#3a2418] placeholder:text-[#3a2418]/40 focus:outline-none"
              />

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#3a2418]/40">saves as you type</span>
                {confirmClear ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#3a2418]/60">Clear it?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft("");
                        setConfirmClear(false);
                      }}
                      className="rounded-full bg-[#3a2418]/10 px-3 py-1 font-medium hover:bg-[#3a2418]/15"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="rounded-full px-3 py-1 text-[#3a2418]/60 hover:bg-black/5"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={!hasNote}
                    onClick={() => setConfirmClear(true)}
                    aria-label="Clear note"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#3a2418]/50 hover:bg-black/5 disabled:opacity-30"
                  >
                    <Trash2 size={15} aria-hidden />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
