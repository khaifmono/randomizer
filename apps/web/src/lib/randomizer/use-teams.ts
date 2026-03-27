import { useState, useRef, useCallback } from "react";
import type { HistoryEntry } from "./types";

// Shuffle scramble is snappier than dice/coin
const ANIMATION_DURATION = 800;

type ShuffleResult = {
  mode: "pick-one" | "split";
  picked?: string;
  teams?: string[][];
};

function useTeams() {
  const [names, setNamesState] = useState<string[]>([]);
  const [mode, setModeState] = useState<"pick-one" | "split">("split");
  const [teamCount, setTeamCountState] = useState(2);
  const [shuffling, setShuffling] = useState(false);
  const [result, setResult] = useState<ShuffleResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Synchronous guard — prevents double-trigger during animation
  const isShufflingRef = useRef(false);
  // Mirror current state for stable reads inside callbacks
  const namesRef = useRef<string[]>([]);
  const modeRef = useRef<"pick-one" | "split">("split");
  const teamCountRef = useRef(2);
  // Pre-determined result stable during animation
  const pendingResultRef = useRef<ShuffleResult | null>(null);
  const nextIdRef = useRef(1);

  const setNames = useCallback((newNames: string[]) => {
    if (isShufflingRef.current) return;
    namesRef.current = newNames;
    setNamesState(newNames);
  }, []);

  const setMode = useCallback((newMode: "pick-one" | "split") => {
    if (isShufflingRef.current) return;
    modeRef.current = newMode;
    setModeState(newMode);
  }, []);

  const setTeamCount = useCallback((n: number) => {
    if (isShufflingRef.current) return;
    if (n < 2 || n > 8) return;
    teamCountRef.current = n;
    setTeamCountState(n);
  }, []);

  const startShuffle = useCallback(() => {
    if (isShufflingRef.current) return;
    isShufflingRef.current = true;

    let pending: ShuffleResult;
    const currentNames = namesRef.current;
    const currentMode = modeRef.current;
    const currentTeamCount = teamCountRef.current;

    if (currentMode === "pick-one") {
      if (currentNames.length === 0) {
        pending = { mode: "pick-one", picked: undefined };
      }
      else {
        const idx = Math.floor(Math.random() * currentNames.length);
        pending = { mode: "pick-one", picked: currentNames[idx] };
      }
    }
    else {
      if (currentNames.length === 0) {
        pending = { mode: "split", teams: [] };
      }
      else {
        // Fisher-Yates shuffle on a copy
        const shuffled = [...currentNames];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        // Round-robin distribution into teamCount buckets
        const teams: string[][] = Array.from({ length: currentTeamCount }, () => []);
        shuffled.forEach((name, i) => teams[i % currentTeamCount].push(name));
        pending = { mode: "split", teams };
      }
    }

    pendingResultRef.current = pending;
    setShuffling(true);
  }, []);

  const onShuffleEnd = useCallback(() => {
    const pending = pendingResultRef.current!;
    setResult(pending);

    let label: string;
    if (pending.mode === "pick-one") {
      label = pending.picked !== undefined ? `Picked: ${pending.picked}` : "Picked: (none)";
    }
    else {
      const maxSize = pending.teams!.length > 0
        ? Math.ceil(namesRef.current.length / teamCountRef.current)
        : 0;
      const brackets = pending.teams!.map((t) => `[${t.join(", ")}]`).join(" ");
      label = `Teams of ${maxSize}: ${brackets}`;
    }

    const entry: HistoryEntry = {
      id: nextIdRef.current++,
      label,
      timestamp: Date.now(),
    };
    // Prepend — newest first
    setHistory((prev) => [entry, ...prev]);

    // Brief settle delay after animation completes before clearing shuffling state
    setTimeout(() => {
      isShufflingRef.current = false;
      setShuffling(false);
    }, 200);
  }, []);

  return {
    names,
    mode,
    teamCount,
    shuffling,
    result,
    history,
    setNames,
    setMode,
    setTeamCount,
    startShuffle,
    onShuffleEnd,
  };
}

export { useTeams, ANIMATION_DURATION };
export type { ShuffleResult };
