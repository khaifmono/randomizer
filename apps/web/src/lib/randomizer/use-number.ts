import { useState, useRef, useCallback, useEffect } from "react";
import type { HistoryEntry } from "./types";
import { readStorage, writeStorage } from "./local-storage";

const REEL_STAGGER_MS = 200;
const BASE_REEL_DURATION_MS = 1000;

const NUMBER_STORAGE_KEY = "number-state";
type StoredNumberState = { min: number; max: number; history: HistoryEntry[] };

function useNumber() {
  const stored = readStorage<StoredNumberState | null>(NUMBER_STORAGE_KEY, null);
  const [min, setMinState] = useState(stored?.min ?? 1);
  const [max, setMaxState] = useState(stored?.max ?? 100);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [digits, setDigits] = useState<number[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>(stored?.history ?? []);

  const isRollingRef = useRef(false);
  const pendingResultRef = useRef<number | null>(null);
  const nextIdRef = useRef(stored?.history?.length ? Math.max(...stored.history.map((h) => h.id)) + 1 : 1);

  useEffect(() => {
    writeStorage<StoredNumberState>(NUMBER_STORAGE_KEY, { min, max, history });
  }, [min, max, history]);

  const setRange = useCallback((newMin: number, newMax: number) => {
    if (isRollingRef.current) return;
    if (newMin > newMax) return;
    if (newMin < 0 || newMax > 999999) return;
    setMinState(newMin);
    setMaxState(newMax);
  }, []);

  const startRoll = useCallback(() => {
    if (isRollingRef.current) return;
    isRollingRef.current = true;
    // Pre-determine result before animation starts (same pattern as dice/coin)
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    // Pad to match max value's digit count so reel count is consistent (e.g. 1-100 always shows 3 reels)
    const maxDigitCount = String(max).length;
    const padded = String(value).padStart(maxDigitCount, "0");
    const digitArray = padded.split("").map(Number);
    pendingResultRef.current = value;
    setResult(value);
    setDigits(digitArray);
    setRolling(true);
  }, [min, max]);

  const onRollEnd = useCallback(() => {
    const value = pendingResultRef.current;
    // Label format: "42 (1-100)" per D-07 showing range context
    const label = `${value} (${min}-${max})`;
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
  }, [min, max]);

  return { min, max, rolling, result, digits, history, setRange, startRoll, onRollEnd };
}

export { useNumber, REEL_STAGGER_MS, BASE_REEL_DURATION_MS };
