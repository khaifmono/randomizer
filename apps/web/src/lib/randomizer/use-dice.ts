import { useState, useRef, useCallback, useEffect } from "react";
import type { HistoryEntry } from "./types";
import { readStorage, writeStorage } from "./local-storage";

// Matches the CSS @keyframes dice-roll duration in index.css
const ANIMATION_DURATION = 1200;

const DICE_STORAGE_KEY = "dice-state";
type StoredDiceState = { count: number; history: HistoryEntry[] };

function useDice() {
  const stored = readStorage<StoredDiceState | null>(DICE_STORAGE_KEY, null);
  const [count, setCountState] = useState(stored?.count ?? 2);
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [sum, setSum] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(stored?.history ?? []);

  const isRollingRef = useRef(false);
  const pendingResultsRef = useRef<number[]>([]);
  const nextIdRef = useRef(stored?.history?.length ? Math.max(...stored.history.map((h) => h.id)) + 1 : 1);

  useEffect(() => {
    writeStorage<StoredDiceState>(DICE_STORAGE_KEY, { count, history });
  }, [count, history]);

  const setCount = useCallback((n: number) => {
    // No-op when rolling or out of 1-6 range
    if (isRollingRef.current) return;
    if (n < 1 || n > 6) return;
    setCountState(n);
  }, []);

  const startRoll = useCallback(() => {
    if (isRollingRef.current) return;
    isRollingRef.current = true;
    // Pre-determine all dice values before animation starts
    const rolled = Array.from({ length: count }, () => Math.ceil(Math.random() * 6));
    pendingResultsRef.current = rolled;
    setResults(rolled);
    setRolling(true);
  }, [count]);

  const onRollEnd = useCallback(() => {
    const rolled = pendingResultsRef.current;
    const total = rolled.reduce((a, b) => a + b, 0);
    setSum(total);

    // Label format: "4+2+6=12"
    const label = rolled.join("+") + "=" + total;
    const entry: HistoryEntry = {
      id: nextIdRef.current++,
      label,
      timestamp: Date.now(),
    };
    // Prepend — newest first
    setHistory((prev) => [entry, ...prev]);

    // Brief settle delay after animation completes before clearing rolling state
    setTimeout(() => {
      isRollingRef.current = false;
      setRolling(false);
    }, 200);
  }, []);

  return {
    count,
    rolling,
    results,
    sum,
    history,
    setCount,
    startRoll,
    onRollEnd,
  };
}

export { useDice, ANIMATION_DURATION };
