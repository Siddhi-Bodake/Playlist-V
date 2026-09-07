/**
 * MEMORIES — "Our Little Things"
 * ---------------------------------------------------------------------------
 * Each entry is one memory card. `layout` picks how it's presented so the
 * section doesn't force every memory into the same grid tile.
 *
 * To add a memory: drop a photo into /public/memories/ (optional — text-only
 * memories are fine too) and add an entry below.
 */

export type MemoryLayout = "polaroid" | "full" | "note" | "strip";

export interface Memory {
  id: string;
  layout: MemoryLayout;
  /** Path under /public/memories/, or an array of paths for layout "strip". */
  photo?: string | string[];
  date?: string; // free text, e.g. "14 Feb" or "Our first winter"
  caption?: string;
  note?: string;
}

export const memories: Memory[] = [
  {
    id: "sample-note-1",
    layout: "note",
    date: "Somewhere, sometime",
    caption: "Our little things",
    note: "This section is waiting for the two of you — add photos and captions here whenever you're ready.",
  },
];
