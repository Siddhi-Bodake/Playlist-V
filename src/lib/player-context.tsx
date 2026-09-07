"use client";

/**
 * Centralized music player state — the single source of truth for what's
 * playing, the queue, shuffle/repeat, volume, favorites and recently played.
 * Every player-related component (MusicPlayer, MiniPlayer, Queue, SongList,
 * ...) reads from and dispatches into this one context instead of keeping
 * its own copy of playback state.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { playableSongs, getSongById, type Song } from "@/data/songs";
import { getMood, type Mood } from "@/data/moods";
import { storage, storageKeys } from "@/lib/storage";
import { loadYouTubeIframeAPI, PLAYER_STATE, type YTPlayer } from "@/lib/youtube";

// Only songs with a verified YouTube id take part in radio/shuffle/next —
// songs still awaiting confirmation (see songs.ts) stay visible in All Songs
// but are skipped for playback instead of silently failing.
const ALL_IDS = playableSongs.map((s) => s.id);
const MAX_RECENT = 10;

export type RepeatMode = "off" | "all" | "one";

interface PlayerState {
  currentId: string | null;
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0-100
  muted: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;
  explicitQueue: string[];
  history: string[];
  shuffledOrder: string[];
  favorites: string[];
  recentlyPlayed: string[];
  error: string | null;
  hasStarted: boolean; // has the user pressed play at least once
}

type Action =
  | { type: "READY" }
  | { type: "SELECT_SONG"; id: string }
  | { type: "PRELOAD"; id: string }
  | { type: "START_RADIO" }
  | { type: "TOGGLE_PLAY" }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "NEXT" }
  | { type: "PREVIOUS" }
  | { type: "TICK"; currentTime: number; duration: number }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "CYCLE_REPEAT" }
  | { type: "ADD_TO_QUEUE"; id: string }
  | { type: "PLAY_NEXT_IN_QUEUE"; id: string }
  | { type: "REMOVE_FROM_QUEUE"; index: number }
  | { type: "CLEAR_QUEUE" }
  | { type: "SHUFFLE_QUEUE" }
  | { type: "TOGGLE_FAVORITE"; id: string }
  | { type: "ERROR"; message: string }
  | { type: "SONG_ENDED" }
  | { type: "HYDRATE"; state: Partial<PlayerState> };

function shuffled(ids: string[]): string[] {
  const arr = [...ids];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pushRecent(list: string[], id: string): string[] {
  const next = [id, ...list.filter((x) => x !== id)];
  return next.slice(0, MAX_RECENT);
}

function baseOrderFor(state: PlayerState): string[] {
  return state.shuffle ? state.shuffledOrder : ALL_IDS;
}

/** Where playback goes next when there's nothing explicitly queued. */
function advanceInBase(state: PlayerState, direction: 1 | -1): string | null {
  const order = baseOrderFor(state);
  if (order.length === 0) return null;
  const idx = state.currentId ? order.indexOf(state.currentId) : -1;
  let nextIdx = idx + direction;

  if (nextIdx >= order.length) {
    if (state.repeatMode === "all") nextIdx = 0;
    else return null;
  } else if (nextIdx < 0) {
    if (state.repeatMode === "all") nextIdx = order.length - 1;
    else nextIdx = 0;
  }
  return order[nextIdx] ?? null;
}

function withSelection(state: PlayerState, id: string, play: boolean): PlayerState {
  const history = state.currentId ? [...state.history, state.currentId].slice(-50) : state.history;
  return {
    ...state,
    currentId: id,
    history,
    isPlaying: play,
    hasStarted: true,
    currentTime: 0,
    error: null,
    recentlyPlayed: pushRecent(state.recentlyPlayed, id),
  };
}

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case "READY":
      return { ...state, isReady: true };

    case "HYDRATE":
      return { ...state, ...action.state };

    case "SELECT_SONG":
      return withSelection(state, action.id, true);

    // Used by shareable links (?song=...) to have the right track ready
    // without ever auto-playing without a user gesture.
    case "PRELOAD":
      return state.currentId ? state : { ...state, currentId: action.id };

    case "START_RADIO": {
      if (state.currentId) return { ...state, isPlaying: true, hasStarted: true };
      const order = baseOrderFor(state);
      const first = order[0] ?? ALL_IDS[0];
      if (!first) return state;
      return withSelection(state, first, true);
    }

    case "TOGGLE_PLAY":
      if (!state.currentId) return reducer(state, { type: "START_RADIO" });
      return { ...state, isPlaying: !state.isPlaying, hasStarted: true };

    case "PLAY":
      return { ...state, isPlaying: true };

    case "PAUSE":
      return { ...state, isPlaying: false };

    case "NEXT": {
      if (state.explicitQueue.length > 0) {
        const [nextId, ...rest] = state.explicitQueue;
        return { ...withSelection(state, nextId, true), explicitQueue: rest };
      }
      const nextId = advanceInBase(state, 1);
      if (!nextId) return { ...state, isPlaying: false };
      return withSelection(state, nextId, true);
    }

    case "SONG_ENDED": {
      if (state.repeatMode === "one" && state.currentId) {
        return { ...state, currentTime: 0, isPlaying: true };
      }
      return reducer(state, { type: "NEXT" });
    }

    case "PREVIOUS": {
      if (state.currentTime > 3) {
        return { ...state, currentTime: 0 };
      }
      if (state.history.length > 0) {
        const prevId = state.history[state.history.length - 1];
        return {
          ...state,
          currentId: prevId,
          history: state.history.slice(0, -1),
          isPlaying: true,
          currentTime: 0,
          error: null,
        };
      }
      const prevId = advanceInBase(state, -1);
      if (!prevId) return state;
      return { ...state, currentId: prevId, isPlaying: true, currentTime: 0, error: null };
    }

    case "TICK":
      return { ...state, currentTime: action.currentTime, duration: action.duration };

    case "SET_VOLUME":
      return { ...state, volume: action.volume, muted: action.volume === 0 ? state.muted : false };

    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };

    case "TOGGLE_SHUFFLE": {
      const turningOn = !state.shuffle;
      return {
        ...state,
        shuffle: turningOn,
        shuffledOrder: turningOn ? shuffled(ALL_IDS) : state.shuffledOrder,
      };
    }

    case "CYCLE_REPEAT": {
      const order: RepeatMode[] = ["off", "all", "one"];
      const nextMode = order[(order.indexOf(state.repeatMode) + 1) % order.length];
      return { ...state, repeatMode: nextMode };
    }

    case "ADD_TO_QUEUE":
      return { ...state, explicitQueue: [...state.explicitQueue, action.id] };

    case "PLAY_NEXT_IN_QUEUE":
      return { ...state, explicitQueue: [action.id, ...state.explicitQueue] };

    case "REMOVE_FROM_QUEUE":
      return {
        ...state,
        explicitQueue: state.explicitQueue.filter((_, i) => i !== action.index),
      };

    case "CLEAR_QUEUE":
      return { ...state, explicitQueue: [] };

    case "SHUFFLE_QUEUE":
      return { ...state, explicitQueue: shuffled(state.explicitQueue) };

    case "TOGGLE_FAVORITE": {
      const isFav = state.favorites.includes(action.id);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter((id) => id !== action.id)
          : [...state.favorites, action.id],
      };
    }

    case "ERROR":
      return { ...state, error: action.message };

    default:
      return state;
  }
}

function initialState(): PlayerState {
  return {
    currentId: null,
    isPlaying: false,
    isReady: false,
    currentTime: 0,
    duration: 0,
    volume: 80,
    muted: false,
    shuffle: false,
    repeatMode: "off",
    explicitQueue: [],
    history: [],
    shuffledOrder: ALL_IDS,
    favorites: [],
    recentlyPlayed: [],
    error: null,
    hasStarted: false,
  };
}

export interface PlayerContextValue {
  state: PlayerState;
  currentSong: Song | undefined;
  currentMood: Mood;
  upcoming: Song[];
  isFavorite: (id: string) => boolean;
  selectSong: (id: string) => void;
  preload: (id: string) => void;
  startRadio: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (id: string) => void;
  playNext: (id: string) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  shuffleQueue: () => void;
  toggleFavorite: (id: string) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadedIdRef = useRef<string | null>(null);
  const hydrated = useRef(false);

  // Hydrate persisted preferences on mount (client only).
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const favorites = storage.getJSON<string[]>(storageKeys.favorites, []);
    const recentlyPlayed = storage.getJSON<string[]>(storageKeys.recentlyPlayed, []);
    const volume = storage.getJSON<number>(storageKeys.volume, 80);
    const muted = storage.getJSON<boolean>(storageKeys.muted, false);
    const shuffle = storage.getJSON<boolean>(storageKeys.shuffle, false);
    const repeatMode = storage.getJSON<RepeatMode>(storageKeys.repeatMode, "off");
    dispatch({
      type: "HYDRATE",
      state: {
        favorites,
        recentlyPlayed,
        volume,
        muted,
        shuffle,
        repeatMode,
        shuffledOrder: shuffle ? shuffled(ALL_IDS) : ALL_IDS,
      },
    });
  }, []);

  // Persist small preferences whenever they change.
  useEffect(() => storage.setJSON(storageKeys.favorites, state.favorites), [state.favorites]);
  useEffect(
    () => storage.setJSON(storageKeys.recentlyPlayed, state.recentlyPlayed),
    [state.recentlyPlayed]
  );
  useEffect(() => storage.setJSON(storageKeys.volume, state.volume), [state.volume]);
  useEffect(() => storage.setJSON(storageKeys.muted, state.muted), [state.muted]);
  useEffect(() => storage.setJSON(storageKeys.shuffle, state.shuffle), [state.shuffle]);
  useEffect(() => storage.setJSON(storageKeys.repeatMode, state.repeatMode), [state.repeatMode]);
  useEffect(() => {
    if (state.currentId) storage.set(storageKeys.lastSongId, state.currentId);
  }, [state.currentId]);

  // Set up the (hidden) YouTube player once.
  useEffect(() => {
    let cancelled = false;
    loadYouTubeIframeAPI().then((YT) => {
      if (cancelled || !containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        host: "https://www.youtube-nocookie.com",
        playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0 },
        events: {
          onReady: () => dispatch({ type: "READY" }),
          onStateChange: (event) => {
            if (event.data === PLAYER_STATE.ENDED) dispatch({ type: "SONG_ENDED" });
          },
          onError: () => {
            dispatch({ type: "ERROR", message: "Couldn't play this one. Moving to the next song…" });
            window.setTimeout(() => dispatch({ type: "NEXT" }), 1500);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
      playerRef.current?.destroy();
    };
  }, []);

  // Load/cue whichever video should be current.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !state.isReady || !state.currentId) return;
    const song = getSongById(state.currentId);
    if (!song?.youtubeId) return;
    if (loadedIdRef.current === state.currentId) return;
    loadedIdRef.current = state.currentId;
    if (state.isPlaying) player.loadVideoById(song.youtubeId);
    else player.cueVideoById(song.youtubeId);
  }, [state.currentId, state.isReady, state.isPlaying]);

  // Play / pause side effect.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !state.isReady) return;
    if (state.isPlaying) player.playVideo();
    else player.pauseVideo();
  }, [state.isPlaying, state.isReady]);

  // Volume / mute side effects.
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !state.isReady) return;
    player.setVolume(state.volume);
    if (state.muted) player.mute();
    else player.unMute();
  }, [state.volume, state.muted, state.isReady]);

  // Progress polling while playing.
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!state.isPlaying || !state.isReady) return;
    pollRef.current = setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      dispatch({
        type: "TICK",
        currentTime: player.getCurrentTime?.() ?? 0,
        duration: player.getDuration?.() ?? 0,
      });
    }, 500);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [state.isPlaying, state.isReady]);

  // Manual seeks (from the progress bar) and the "restart if >3s" previous
  // behavior both need to reach the real player, not just the reducer.
  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
    dispatch({ type: "TICK", currentTime: seconds, duration: state.duration });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentSong = getSongById(state.currentId);
  const currentMood = getMood(currentSong?.mood ?? "silent");

  const upcoming = useMemo(() => {
    const queued = state.explicitQueue.map((id) => getSongById(id)).filter(Boolean) as Song[];
    const order = baseOrderFor(state);
    const idx = state.currentId ? order.indexOf(state.currentId) : -1;
    const rest: Song[] = [];
    for (let i = 1; i <= order.length && rest.length < 10; i++) {
      const id = order[(idx + i) % order.length];
      const song = getSongById(id);
      if (song && song.id !== state.currentId) rest.push(song);
      if (state.repeatMode === "off" && idx + i >= order.length) break;
    }
    return [...queued, ...rest];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.explicitQueue, state.currentId, state.shuffle, state.shuffledOrder, state.repeatMode]);

  const value: PlayerContextValue = {
    state,
    currentSong,
    currentMood,
    upcoming,
    isFavorite: (id) => state.favorites.includes(id),
    selectSong: (id) => dispatch({ type: "SELECT_SONG", id }),
    preload: (id) => dispatch({ type: "PRELOAD", id }),
    startRadio: () => dispatch({ type: "START_RADIO" }),
    togglePlay: () => dispatch({ type: "TOGGLE_PLAY" }),
    next: () => dispatch({ type: "NEXT" }),
    previous: () => dispatch({ type: "PREVIOUS" }),
    seekTo,
    setVolume: (volume) => dispatch({ type: "SET_VOLUME", volume }),
    toggleMute: () => dispatch({ type: "TOGGLE_MUTE" }),
    toggleShuffle: () => dispatch({ type: "TOGGLE_SHUFFLE" }),
    cycleRepeat: () => dispatch({ type: "CYCLE_REPEAT" }),
    addToQueue: (id) => dispatch({ type: "ADD_TO_QUEUE", id }),
    playNext: (id) => dispatch({ type: "PLAY_NEXT_IN_QUEUE", id }),
    removeFromQueue: (index) => dispatch({ type: "REMOVE_FROM_QUEUE", index }),
    clearQueue: () => dispatch({ type: "CLEAR_QUEUE" }),
    shuffleQueue: () => dispatch({ type: "SHUFFLE_QUEUE" }),
    toggleFavorite: (id) => dispatch({ type: "TOGGLE_FAVORITE", id }),
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* Hidden YouTube player — kept tiny + transparent rather than display:none,
          which can make some browsers stop firing player state events. */}
      <div className="pointer-events-none fixed bottom-0 left-0 h-px w-px overflow-hidden opacity-0">
        <div ref={containerRef} />
      </div>
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}
