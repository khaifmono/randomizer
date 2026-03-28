import { useState, useRef, useCallback, useEffect } from "react";
import type { HistoryEntry } from "./types";
import { readStorage, writeStorage } from "./local-storage";

const ANIMATION_DURATION = 1200;

const COIN_STORAGE_KEY = "coin-state";
type StoredCoinState = { count: number; history: HistoryEntry[]; sessionHeads: number; sessionTails: number };

function useCoin() {
  const stored = readStorage<StoredCoinState | null>(COIN_STORAGE_KEY, null);
  const [count, setCountState] = useState(stored?.count ?? 1);
  const [flipping, setFlipping] = useState(false);
  const [results, setResults] = useState<("heads" | "tails")[]>([]);
  const [tally, setTally] = useState<{ heads: number; tails: number } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(stored?.history ?? []);
  const [sessionHeads, setSessionHeads] = useState(stored?.sessionHeads ?? 0);
  const [sessionTails, setSessionTails] = useState(stored?.sessionTails ?? 0);

  const isFlippingRef = useRef(false);
  const pendingResultsRef = useRef<("heads" | "tails")[]>([]);
  const nextIdRef = useRef(stored?.history?.length ? Math.max(...stored.history.map((h) => h.id)) + 1 : 1);

  useEffect(() => {
    writeStorage<StoredCoinState>(COIN_STORAGE_KEY, { count, history, sessionHeads, sessionTails });
  }, [count, history, sessionHeads, sessionTails]);

  const setCount = useCallback((n: number) => {
    // No-op when flipping or out of 1-10 range
    if (isFlippingRef.current) return;
    if (n < 1 || n > 10) return;
    setCountState(n);
  }, []);

  const startFlip = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    // Pre-determine all coin values before animation starts
    const flipped = Array.from(
      { length: count },
      () => (Math.random() < 0.5 ? "heads" : "tails") as "heads" | "tails",
    );
    pendingResultsRef.current = flipped;
    setResults(flipped);
    setFlipping(true);
  }, [count]);

  const onFlipEnd = useCallback(() => {
    const flipped = pendingResultsRef.current;
    const heads = flipped.filter((r) => r === "heads").length;
    const tails = flipped.filter((r) => r === "tails").length;
    setTally({ heads, tails });

    // Accumulate session totals
    setSessionHeads((prev) => prev + heads);
    setSessionTails((prev) => prev + tails);

    // Label format: "3H 2T (5 coins)"
    const label = `${heads}H ${tails}T (${flipped.length} coins)`;
    const entry: HistoryEntry = {
      id: nextIdRef.current++,
      label,
      timestamp: Date.now(),
    };
    // Prepend — newest first
    setHistory((prev) => [entry, ...prev]);

    // Brief settle delay after animation completes before clearing flipping state
    setTimeout(() => {
      isFlippingRef.current = false;
      setFlipping(false);
    }, 200);
  }, []);

  const clearSession = useCallback(() => {
    setSessionHeads(0);
    setSessionTails(0);
  }, []);

  return {
    count,
    flipping,
    results,
    tally,
    history,
    sessionHeads,
    sessionTails,
    setCount,
    startFlip,
    onFlipEnd,
    clearSession,
  };
}

export { useCoin, ANIMATION_DURATION };
