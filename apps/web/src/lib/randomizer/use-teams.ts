import { useState, useRef, useCallback } from "react";
import type { HistoryEntry } from "./types";

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
  const isShufflingRef = useRef(false);
  const pendingResultRef = useRef<ShuffleResult | null>(null);
  const nextIdRef = useRef(1);

  const setNames = useCallback((_names: string[]) => {}, []);
  const setMode = useCallback((_mode: "pick-one" | "split") => {}, []);
  const setTeamCount = useCallback((_n: number) => {}, []);
  const startShuffle = useCallback(() => {}, []);
  const onShuffleEnd = useCallback(() => {}, []);

  return { names, mode, teamCount, shuffling, result, history, setNames, setMode, setTeamCount, startShuffle, onShuffleEnd };
}

export { useTeams, ANIMATION_DURATION };
export type { ShuffleResult };
