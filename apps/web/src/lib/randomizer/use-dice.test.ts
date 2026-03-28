import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDice } from "./use-dice";

describe("useDice", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  // Test 1: Initial state
  it("initializes with count=2, rolling=false, results=[], sum=null, history=[]", () => {
    const { result } = renderHook(() => useDice());
    expect(result.current.count).toBe(2);
    expect(result.current.rolling).toBe(false);
    expect(result.current.results).toEqual([]);
    expect(result.current.sum).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  // Test 2: setCount updates count
  it("setCount(3) updates count to 3", () => {
    const { result } = renderHook(() => useDice());
    act(() => {
      result.current.setCount(3);
    });
    expect(result.current.count).toBe(3);
  });

  // Test 3: setCount(0) is a no-op (below min)
  it("setCount(0) does nothing — count stays at 2", () => {
    const { result } = renderHook(() => useDice());
    act(() => {
      result.current.setCount(0);
    });
    expect(result.current.count).toBe(2);
  });

  // Test 4: setCount(7) is a no-op (above max)
  it("setCount(7) does nothing — count stays at 2", () => {
    const { result } = renderHook(() => useDice());
    act(() => {
      result.current.setCount(7);
    });
    expect(result.current.count).toBe(2);
  });

  // Test 5: startRoll sets rolling=true and populates results with length === count
  it("startRoll sets rolling=true and populates results with length === count", () => {
    const { result } = renderHook(() => useDice());
    act(() => {
      result.current.setCount(3);
    });
    act(() => {
      result.current.startRoll();
    });
    expect(result.current.rolling).toBe(true);
    expect(result.current.results).toHaveLength(3);
  });

  // Test 6: startRoll does nothing when already rolling (double-roll guard)
  it("startRoll does nothing when already rolling", () => {
    const { result } = renderHook(() => useDice());
    act(() => {
      result.current.startRoll();
    });
    const resultsBefore = result.current.results;
    act(() => {
      result.current.startRoll();
    });
    // Results should be the same — second call was a no-op
    expect(result.current.results).toEqual(resultsBefore);
  });

  // Test 7: each result value is between 1 and 6 inclusive
  it("all result values are between 1 and 6 inclusive", () => {
    const { result } = renderHook(() => useDice());
    act(() => {
      result.current.setCount(6);
    });
    act(() => {
      result.current.startRoll();
    });
    for (const value of result.current.results) {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    }
  });

  // Test 8: onRollEnd computes sum, creates history entry, clears rolling after 200ms
  it("onRollEnd computes correct sum, creates history entry with correct format, and clears rolling after 200ms", () => {
    const { result } = renderHook(() => useDice());
    act(() => {
      result.current.setCount(3);
    });
    // Mock Math.random to produce predictable values: 0.5 -> ceil = 3 each time
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.5);
    act(() => {
      result.current.startRoll();
    });
    mockRandom.mockRestore();

    act(() => {
      result.current.onRollEnd();
    });

    // sum should be 3+3+3 = 9
    expect(result.current.sum).toBe(9);

    // history should have one entry
    expect(result.current.history).toHaveLength(1);
    // label format: "3+3+3=9"
    expect(result.current.history[0].label).toBe("3+3+3=9");
    expect(typeof result.current.history[0].id).toBe("number");
    expect(typeof result.current.history[0].timestamp).toBe("number");

    // rolling is still true right after onRollEnd (settle delay not elapsed)
    expect(result.current.rolling).toBe(true);

    // After 200ms, rolling should clear
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.rolling).toBe(false);
  });

  // Test 9: history entries are prepended (newest first) with incrementing IDs
  it("history entries are prepended — newest first — with incrementing IDs", () => {
    const { result } = renderHook(() => useDice());

    // First roll
    act(() => { result.current.startRoll(); });
    act(() => { result.current.onRollEnd(); });
    // Advance timers so rolling clears before next roll
    act(() => { vi.advanceTimersByTime(200); });

    // Second roll
    act(() => { result.current.startRoll(); });
    act(() => { result.current.onRollEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current.history).toHaveLength(2);
    // Newest first
    expect(result.current.history[0].id).toBeGreaterThan(result.current.history[1].id);
  });

  // Test 10: count cannot be changed while rolling
  it("setCount does nothing while rolling is true", () => {
    const { result } = renderHook(() => useDice());
    act(() => {
      result.current.startRoll();
    });
    expect(result.current.rolling).toBe(true);
    act(() => {
      result.current.setCount(5);
    });
    // count should still be 2 (the initial value) since we are rolling
    expect(result.current.count).toBe(2);
  });
});
