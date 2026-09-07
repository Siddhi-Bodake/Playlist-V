"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";
import { memories } from "@/data/memories";
import { useEscapeClose } from "@/lib/use-escape-close";

function MemoryCard({ memory }: { memory: (typeof memories)[number] }) {
  const [failed, setFailed] = useState(false);
  const photos = Array.isArray(memory.photo) ? memory.photo : memory.photo ? [memory.photo] : [];

  if (memory.layout === "note") {
    return (
      <div className="flex flex-col justify-between rounded-2xl bg-[#f6e9d8] p-5 text-[#3a2418] shadow-lg">
        {memory.date && <p className="text-[11px] uppercase tracking-widest opacity-50">{memory.date}</p>}
        {memory.caption && <p className="mt-2 font-serif text-lg">{memory.caption}</p>}
        {memory.note && <p className="mt-2 text-sm leading-relaxed opacity-80">{memory.note}</p>}
      </div>
    );
  }

  if (memory.layout === "strip" && photos.length > 0) {
    return (
      <div className="flex flex-col gap-1 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
        {photos.map((src, i) =>
          failed ? null : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src + i}
              src={src}
              alt=""
              className="aspect-[4/3] w-full rounded-lg object-cover"
              onError={() => setFailed(true)}
            />
          )
        )}
        {memory.caption && <p className="px-1 pt-1 text-center font-serif text-sm text-white/80">{memory.caption}</p>}
      </div>
    );
  }

  // polaroid / full — both are photo-forward, full is just larger.
  const isFull = memory.layout === "full";
  return (
    <div
      className={clsx(
        "flex flex-col gap-2 rounded-lg bg-white p-3 pb-4 text-[#3a2418] shadow-xl rotate-[-1.5deg]",
        isFull && "sm:col-span-2 rotate-0"
      )}
    >
      {photos[0] && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photos[0]}
          alt=""
          className={clsx("w-full rounded-sm object-cover", isFull ? "aspect-[16/10]" : "aspect-square")}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={clsx("flex w-full items-center justify-center rounded-sm bg-[#efe3d3]", isFull ? "aspect-[16/10]" : "aspect-square")}>
          <span className="font-serif text-2xl opacity-30">♡</span>
        </div>
      )}
      {(memory.date || memory.caption) && (
        <div className="px-1 text-center">
          {memory.date && <p className="text-[10px] uppercase tracking-widest opacity-50">{memory.date}</p>}
          {memory.caption && <p className="font-serif text-sm">{memory.caption}</p>}
        </div>
      )}
    </div>
  );
}

export function Memories({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEscapeClose(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[58] bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Our little things"
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="safe-top safe-bottom mx-auto flex h-[100svh] w-full max-w-3xl flex-col bg-[#150c22] sm:my-6 sm:h-[calc(100svh-3rem)] sm:rounded-3xl sm:ring-1 sm:ring-white/10"
          >
            <div className="flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-8">
              <div>
                <h2 className="font-serif text-3xl text-white">Our Little Things</h2>
                <p className="mt-1 text-sm text-white/50">A few small things worth keeping.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-11 w-11 items-center justify-center rounded-full text-white/60 hover:bg-white/5 hover:text-white"
              >
                <X size={20} aria-hidden />
              </button>
            </div>

            <div className="thin-scroll mt-4 flex-1 overflow-y-auto px-5 pb-8 sm:px-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
