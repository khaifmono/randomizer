import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWheel } from "./use-wheel";

const DEFAULT_ITEMS = ["Option 1", "Option 2", "Option 3", "Option 4"];

describe("useWheel", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  // Test 1: Initial state loads from DEFAULT_ITEMS when localStorage is empty
  it("initializes with DEFAULT_ITEMS when localStorage is empty", () => {
    const { result } = renderHook(() => useWheel());
    expect(result.current.liveItems).toEqual(DEFAULT_ITEMS);
    expect(result.current.spinning).toBe(false);
    expect(result.current.winner).toBeNull();
    expect(result.current.history).toEqual([]);
    expect(result.current.winnerIndex).toBeNull();
  });

  // Test 2: Initial state loads from localStorage when key exists
  it("initializes items from localStorage when available", () => {
    const saved = ["Apple", "Banana", "Cherry"];
    localStorage.setItem("wheel-items", JSON.stringify(saved));
    const { result } = renderHook(() => useWheel());
    expect(result.current.liveItems).toEqual(saved);
  });

  // Test 3: addItem appends item and updates localStorage
  it("addItem appends item and updates localStorage", () => {
    const { result } = renderHook(() => useWheel());
    act(() => {
      result.current.addItem("New Item");
    });
    expect(result.current.liveItems).toContain("New Item");
    expect(result.current.liveItems).toHaveLength(5);
    expect(JSON.parse(localStorage.getItem("wheel-items")!)).toContain("New Item");
  });

  // Test 4: addItem does nothing for empty/whitespace strings
  it("addItem does nothing for empty string", () => {
    const { result } = renderHook(() => useWheel());
    const before = result.current.liveItems.length;
    act(() => {
      result.current.addItem("  ");
    });
    expect(result.current.liveItems).toHaveLength(before);
  });

  // Test 5: addItem truncates to 40 characters
  it("addItem truncates item to 40 characters", () => {
    const { result } = renderHook(() => useWheel());
    const longText = "A".repeat(50);
    act(() => {
      result.current.addItem(longText);
    });
    const added = result.current.liveItems[result.current.liveItems.length - 1];
    expect(added).toHaveLength(40);
  });

  // Test 6: addBulk splits newlines, trims, filters empty
  it("addBulk splits newlines, trims, and filters empty lines", () => {
    const { result } = renderHook(() => useWheel());
    act(() => {
      result.current.addBulk("A\nB\n\nC");
    });
    const liveItems = result.current.liveItems;
    expect(liveItems).toContain("A");
    expect(liveItems).toContain("B");
    expect(liveItems).toContain("C");
    // Ensure no empty string was added
    expect(liveItems.every(item => item.length > 0)).toBe(true);
  });

  // Test 7: removeItem removes by index and updates localStorage
  it("removeItem removes item at given index", () => {
    const { result } = renderHook(() => useWheel());
    const before = result.current.liveItems[1];
    act(() => {
      result.current.removeItem(1);
    });
    expect(result.current.liveItems).not.toContain(before);
    expect(result.current.liveItems).toHaveLength(3);
    expect(JSON.parse(localStorage.getItem("wheel-items")!)).not.toContain(before);
  });

  // Test 8: startSpin sets spinning=true and pre-determines winnerIndex
  it("startSpin sets spinning=true and determines winnerIndex", () => {
    const { result } = renderHook(() => useWheel());
    act(() => {
      result.current.startSpin();
    });
    expect(result.current.spinning).toBe(true);
    expect(result.current.winnerIndex).not.toBeNull();
    expect(result.current.winnerIndex).toBeGreaterThanOrEqual(0);
    expect(result.current.winnerIndex).toBeLessThan(DEFAULT_ITEMS.length);
  });

  // Test 9: startSpin does nothing when items is empty
  it("startSpin does nothing when there are no items", () => {
    const { result } = renderHook(() => useWheel());
    // Remove all items first
    act(() => {
      for (let i = 0; i < DEFAULT_ITEMS.length; i++) {
        result.current.removeItem(0);
      }
    });
    act(() => {
      result.current.startSpin();
    });
    expect(result.current.spinning).toBe(false);
  });

  // Test 10: onSpinEnd sets winner, removes winner from liveItems, adds to history
  it("onSpinEnd sets winner string, removes from liveItems, appends HistoryEntry", () => {
    const { result } = renderHook(() => useWheel());
    act(() => {
      result.current.startSpin();
    });
    const winnerIndex = result.current.winnerIndex!;
    const itemsSnapshot = result.current.items;
    const expectedWinner = itemsSnapshot[winnerIndex];

    act(() => {
      result.current.onSpinEnd();
    });

    expect(result.current.winner).toBe(expectedWinner);
    expect(result.current.liveItems).not.toContain(expectedWinner);
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].label).toBe(expectedWinner);
    expect(typeof result.current.history[0].id).toBe("number");
    expect(typeof result.current.history[0].timestamp).toBe("number");
  });

  // Test 11: reset restores original items
  it("reset restores items removed by spins", () => {
    const { result } = renderHook(() => useWheel());
    // Spin once and end it
    act(() => {
      result.current.startSpin();
    });
    act(() => {
      result.current.onSpinEnd();
    });
    // After onSpinEnd, one item should be removed
    expect(result.current.liveItems.length).toBeLessThan(DEFAULT_ITEMS.length);

    // Reset should restore
    act(() => {
      result.current.reset();
    });
    expect(result.current.liveItems).toEqual(DEFAULT_ITEMS);
  });

  // Test 12: History entries are newest-first
  it("history entries are newest-first (prepended)", () => {
    const { result } = renderHook(() => useWheel());

    // First spin
    act(() => { result.current.startSpin(); });
    const firstWinnerIndex = result.current.winnerIndex!;
    const firstWinner = result.current.items[firstWinnerIndex];
    act(() => { result.current.onSpinEnd(); });

    // Second spin
    act(() => { result.current.startSpin(); });
    const secondWinnerIndex = result.current.winnerIndex!;
    const secondWinner = result.current.items[secondWinnerIndex];
    act(() => { result.current.onSpinEnd(); });

    expect(result.current.history).toHaveLength(2);
    // Newest first: history[0] should be the second winner
    expect(result.current.history[0].label).toBe(secondWinner);
    expect(result.current.history[1].label).toBe(firstWinner);
    // History[0] should have a higher id than history[1]
    expect(result.current.history[0].id).toBeGreaterThan(result.current.history[1].id);
  });

  // Test 13: items returns snapshot during spin, live items when idle
  it("items returns snapshot during spin", () => {
    const { result } = renderHook(() => useWheel());
    const itemsBefore = [...result.current.liveItems];
    act(() => {
      result.current.startSpin();
    });
    // During spin, items should be the snapshot (same as before spin)
    expect(result.current.items).toEqual(itemsBefore);
  });

  // Test 14: hasRemovedItems flag reflects whether items were removed
  it("hasRemovedItems is false initially, true after spin removes an item", () => {
    const { result } = renderHook(() => useWheel());
    expect(result.current.hasRemovedItems).toBe(false);

    act(() => { result.current.startSpin(); });
    act(() => { result.current.onSpinEnd(); });

    expect(result.current.hasRemovedItems).toBe(true);
  });

  // Test 15: spinning state clears after onSpinEnd 600ms timeout (WHEL-10 split)
  it("spinning becomes false after 600ms timeout from onSpinEnd", () => {
    const { result } = renderHook(() => useWheel());
    act(() => { result.current.startSpin(); });
    act(() => { result.current.onSpinEnd(); });
    // Still spinning right after (before timeout)
    expect(result.current.spinning).toBe(true);

    // Advance fake timers by 600ms — spin lock should release
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.spinning).toBe(false);
  });
});

describe("re-spin timing (WHEL-10)", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it("spinning becomes false within 600ms after onSpinEnd", () => {
    const { result } = renderHook(() => useWheel());
    act(() => { result.current.startSpin(); });
    act(() => { result.current.onSpinEnd(); });

    // Before 600ms: still spinning
    expect(result.current.spinning).toBe(true);

    // After 600ms: spin lock released
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.spinning).toBe(false);
  });

  it("winner remains non-null at 600ms after onSpinEnd", () => {
    const { result } = renderHook(() => useWheel());
    act(() => { result.current.startSpin(); });
    act(() => { result.current.onSpinEnd(); });

    // Advance to 600ms — overlay still visible
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.winner).not.toBeNull();
  });

  it("winner becomes null after 2200ms after onSpinEnd", () => {
    const { result } = renderHook(() => useWheel());
    act(() => { result.current.startSpin(); });
    act(() => { result.current.onSpinEnd(); });

    // Advance past 2200ms — overlay dismissed
    act(() => { vi.advanceTimersByTime(2200); });
    expect(result.current.winner).toBeNull();
  });

  it("user can call startSpin again after 600ms while winner still visible", () => {
    const { result } = renderHook(() => useWheel());
    act(() => { result.current.startSpin(); });
    act(() => { result.current.onSpinEnd(); });

    // After 600ms, spin lock released — should be able to spin again
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.spinning).toBe(false);
    expect(result.current.winner).not.toBeNull();

    // Start another spin — should succeed
    act(() => { result.current.startSpin(); });
    expect(result.current.spinning).toBe(true);
  });
});
