"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { site } from "@/data/site";
import { useEscapeClose } from "@/lib/use-escape-close";

export function LoveLetter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const paragraphs = site.letter.body.split("\n\n");
  useEscapeClose(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[58] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={site.letter.heading}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, rotateX: -6 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="safe-top safe-bottom relative max-h-[85svh] w-full max-w-md overflow-y-auto thin-scroll rounded-2xl bg-[#fbf3e7] p-8 text-[#3a2418] shadow-2xl sm:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close letter"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-[#3a2418]/50 hover:bg-black/5"
            >
              <X size={18} aria-hidden />
            </button>

            <p className="mb-6 text-center font-serif text-2xl italic">{site.letter.heading}</p>

            <div className="space-y-4 font-serif text-[17px] leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <p className="mt-8 text-right font-serif italic text-[#3a2418]/70">{site.letter.signature}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
