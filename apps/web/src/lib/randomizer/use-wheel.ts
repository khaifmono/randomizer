import { useState, useRef, useCallback, useEffect } from "react";
import { readStorage, writeStorage } from "./local-storage";
import type { HistoryEntry } from "./types";

const STORAGE_KEY = "wheel-items";
const WHEEL_HISTORY_KEY = "wheel-history";
const DEFAULT_ITEMS = ["Option 1", "Option 2", "Option 3", "Option 4"];

function useWheel() {
  const storedHistory = readStorage<HistoryEntry[]>(WHEEL_HISTORY_KEY, []);
  const [items, setItemsState] = useState<string[]>(() =>
    readStorage(STORAGE_KEY, DEFAULT_ITEMS),
  );
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(storedHistory);

  useEffect(() => {
    writeStorage(WHEEL_HISTORY_KEY, history);
  }, [history]);

  // Ref mirrors items state so callbacks can read the latest value without going stale
  const itemsRef = useRef<string[]>(items);

  const originalItemsRef = useRef<string[]>(readStorage(STORAGE_KEY, DEFAULT_ITEMS));
  const itemsSnapshotRef = useRef<string[]>([]);
  const isSpinningRef = useRef(false);
  const winnerIndexRef = useRef<number | null>(null);
  const nextIdRef = useRef(storedHistory.length ? Math.max(...storedHistory.map((h) => h.id)) + 1 : 1);

  // Internal — always write both state and storage
  const applyItems = useCallback((next: string[]) => {
    itemsRef.current = next;
    setItemsState(next);
    writeStorage(STORAGE_KEY, next);
  }, []);

  const addItem = useCallback(
    (text: string) => {
      const trimmed = text.trim().slice(0, 40);
      if (!trimmed) return;
      const next = [...itemsRef.current, trimmed];
      originalItemsRef.current = next;
      applyItems(next);
    },
    [applyItems],
  );

  const addBulk = useCallback(
    (text: string) => {
      const newItems = text
        .split("\n")
        .map((line) => line.trim().slice(0, 40))
        .filter((line) => line.length > 0);
      if (newItems.length === 0) return;
      const next = [...itemsRef.current, ...newItems];
      originalItemsRef.current = next;
      applyItems(next);
    },
    [applyItems],
  );

  const removeItem = useCallback(
    (index: number) => {
      const next = itemsRef.current.filter((_, i) => i !== index);
      originalItemsRef.current = next;
      applyItems(next);
    },
    [applyItems],
  );

  const reset = useCallback(() => {
    applyItems([...originalItemsRef.current]);
  }, [applyItems]);

  const startSpin = useCallback(() => {
    const currentItems = itemsRef.current;
    if (isSpinningRef.current || currentItems.length === 0) return;
    isSpinningRef.current = true;
    itemsSnapshotRef.current = [...currentItems];
    const winnerIndex = Math.floor(Math.random() * currentItems.length);
    winnerIndexRef.current = winnerIndex;
    setWinner(null);
    setSpinning(true);
  }, []);

  const onSpinEnd = useCallback(() => {
    const winnerIndex = winnerIndexRef.current;
    const snapshot = itemsSnapshotRef.current;
    if (winnerIndex === null || snapshot.length === 0) return;

    const won = snapshot[winnerIndex];
    setWinner(won);

    const entry: HistoryEntry = {
      id: nextIdRef.current++,
      label: won,
      timestamp: Date.now(),
    };
    setHistory((prev) => [entry, ...prev]);

    // Remove one occurrence of the winner from live items
    let removed = false;
    const next = itemsRef.current.filter((item) => {
      if (!removed && item === won) {
        removed = true;
        return false;
      }
      return true;
    });
    applyItems(next);

    // Unlock spin early — user can re-spin while overlay is still visible
    setTimeout(() => {
      isSpinningRef.current = false;
      setSpinning(false);
    }, 600);

    // Dismiss winner overlay on its own schedule
    setTimeout(() => {
      setWinner(null);
    }, 2200);
  }, [applyItems]);

  const hasRemovedItems = items.length < originalItemsRef.current.length;

  return {
    items: spinning ? itemsSnapshotRef.current : items,
    liveItems: items,
    spinning,
    winner,
    winnerIndex: winnerIndexRef.current,
    history,
    addItem,
    addBulk,
    removeItem,
    reset,
    startSpin,
    onSpinEnd,
    hasRemovedItems,
  };
}

export { useWheel };
