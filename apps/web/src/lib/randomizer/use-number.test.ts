import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNumber } from "./use-number";

describe("useNumber", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Test 1: Initial state — min=1, max=100, rolling=false, result=null, digits=[], history=[]
  it("initializes with min=1, max=100, rolling=false, result=null, digits=[], history=[]", () => {
    const { result } = renderHook(() => useNumber());
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(100);
    expect(result.current.rolling).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.digits).toEqual([]);
    expect(result.current.history).toEqual([]);
  });

  // Test 2: setRange(1, 10) updates min to 1 and max to 10
  it("setRange(1, 10) updates min to 1 and max to 10", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.setRange(1, 10);
    });
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(10);
  });

  // Test 3: setRange with min > max is a no-op
  it("setRange with min > max is a no-op", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.setRange(50, 10);
    });
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(100);
  });

  // Test 4: setRange with min < 0 or max > 999999 is a no-op
  it("setRange with min < 0 is a no-op", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.setRange(-1, 100);
    });
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(100);
  });

  it("setRange with max > 999999 is a no-op", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.setRange(1, 1000000);
    });
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(100);
  });

  // Test 5: setRange is a no-op while rolling
  it("setRange is a no-op while rolling", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.startRoll();
    });
    expect(result.current.rolling).toBe(true);
    act(() => {
      result.current.setRange(1, 10);
    });
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(100);
  });

  // Test 6: startRoll sets rolling=true and pre-determines a result within [min, max]
  it("startRoll sets rolling=true and sets a result", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.startRoll();
    });
    expect(result.current.rolling).toBe(true);
    expect(result.current.result).not.toBeNull();
  });

  // Test 7: startRoll does nothing when already rolling (double-trigger guard via isRollingRef)
  it("startRoll does nothing when already rolling", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.startRoll();
    });
    const resultBefore = result.current.result;
    act(() => {
      result.current.startRoll();
    });
    expect(result.current.result).toBe(resultBefore);
  });

  // Test 8: result value is always >= min and <= max (test with mocked Math.random)
  it("result value is always >= min and <= max", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.setRange(1, 10);
    });
    // Mock Math.random to produce a predictable value: 0.5 -> floor(0.5 * (10-1+1)) + 1 = 6
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.5);
    act(() => {
      result.current.startRoll();
    });
    mockRandom.mockRestore();
    expect(result.current.result).toBeGreaterThanOrEqual(1);
    expect(result.current.result).toBeLessThanOrEqual(10);
    expect(result.current.result).toBe(6);
  });

  // Test 9: digits array correctly decomposes result into individual digit values
  it("digits array correctly decomposes result into individual digit values", () => {
    const { result } = renderHook(() => useNumber());

    // Test 42 -> [4, 2]
    act(() => {
      result.current.setRange(1, 100);
    });
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.41);
    // floor(0.41 * 100) + 1 = 42
    act(() => {
      result.current.startRoll();
    });
    mockRandom.mockRestore();
    expect(result.current.result).toBe(42);
    expect(result.current.digits).toEqual([4, 2]);
  });

  it("digits array for single digit number is [7]", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.setRange(1, 10);
    });
    // floor(0.6 * 10) + 1 = 7
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.6);
    act(() => {
      result.current.startRoll();
    });
    mockRandom.mockRestore();
    expect(result.current.result).toBe(7);
    expect(result.current.digits).toEqual([7]);
  });

  it("digits array for 100 is [1, 0, 0]", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.setRange(1, 1000);
    });
    // floor(0.099 * 1000) + 1 = 100
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.099);
    act(() => {
      result.current.startRoll();
    });
    mockRandom.mockRestore();
    expect(result.current.result).toBe(100);
    expect(result.current.digits).toEqual([1, 0, 0]);
  });

  // Test 10: onRollEnd creates history entry with label "42 (1-100)" format, clears rolling after 200ms settle delay
  it("onRollEnd creates history entry with label format '42 (1-100)' and clears rolling after 200ms", () => {
    const { result } = renderHook(() => useNumber());
    act(() => {
      result.current.setRange(1, 100);
    });
    const mockRandom = vi.spyOn(Math, "random").mockReturnValue(0.41);
    act(() => {
      result.current.startRoll();
    });
    mockRandom.mockRestore();

    act(() => {
      result.current.onRollEnd();
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].label).toBe("42 (1-100)");
    expect(typeof result.current.history[0].id).toBe("number");
    expect(typeof result.current.history[0].timestamp).toBe("number");

    // rolling is still true right after onRollEnd (settle delay not elapsed)
    expect(result.current.rolling).toBe(true);

    // After 200ms, rolling should clear
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.rolling).toBe(false);
  });

  // Test 11: history entries are prepended (newest first) with incrementing IDs
  it("history entries are prepended — newest first — with incrementing IDs", () => {
    const { result } = renderHook(() => useNumber());

    // First roll
    act(() => { result.current.startRoll(); });
    act(() => { result.current.onRollEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    // Second roll
    act(() => { result.current.startRoll(); });
    act(() => { result.current.onRollEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current.history).toHaveLength(2);
    // Newest first
    expect(result.current.history[0].id).toBeGreaterThan(result.current.history[1].id);
  });

  // Test 12: Preset ranges work — calling setRange(1, 10), setRange(1, 100), setRange(1, 1000) sets min/max correctly
  it("preset ranges work: setRange(1, 10), setRange(1, 100), setRange(1, 1000)", () => {
    const { result } = renderHook(() => useNumber());

    act(() => { result.current.setRange(1, 10); });
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(10);

    act(() => { result.current.setRange(1, 100); });
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(100);

    act(() => { result.current.setRange(1, 1000); });
    expect(result.current.min).toBe(1);
    expect(result.current.max).toBe(1000);
  });
});
