import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCoin } from "./use-coin";

describe("useCoin", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Test 1: Initial state
  it("initializes with count=1, flipping=false, results=[], tally=null, history=[]", () => {
    const { result } = renderHook(() => useCoin());
    expect(result.current.count).toBe(1);
    expect(result.current.flipping).toBe(false);
    expect(result.current.results).toEqual([]);
    expect(result.current.tally).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  // Test 2: setCount updates count
  it("setCount(5) updates count to 5", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.setCount(5);
    });
    expect(result.current.count).toBe(5);
  });

  // Test 3: setCount(0) is a no-op (below min)
  it("setCount(0) does nothing — count stays at 1", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.setCount(0);
    });
    expect(result.current.count).toBe(1);
  });

  // Test 4: setCount(11) is a no-op (above max)
  it("setCount(11) does nothing — count stays at 1", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.setCount(11);
    });
    expect(result.current.count).toBe(1);
  });

  // Test 5: startFlip sets flipping=true and populates results with length === count
  it("startFlip sets flipping=true and populates results with length === count", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.setCount(3);
    });
    act(() => {
      result.current.startFlip();
    });
    expect(result.current.flipping).toBe(true);
    expect(result.current.results).toHaveLength(3);
  });

  // Test 6: startFlip does nothing when already flipping (double-flip guard)
  it("startFlip does nothing when already flipping", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.startFlip();
    });
    const resultsBefore = result.current.results;
    act(() => {
      result.current.startFlip();
    });
    // Results should be the same — second call was a no-op
    expect(result.current.results).toEqual(resultsBefore);
  });

  // Test 7: all result values are "heads" or "tails"
  it("all result values are 'heads' or 'tails'", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.setCount(10);
    });
    act(() => {
      result.current.startFlip();
    });
    for (const value of result.current.results) {
      expect(["heads", "tails"]).toContain(value);
    }
  });

  // Test 8: Math.random < 0.5 produces "heads", >= 0.5 produces "tails"
  it("Math.random < 0.5 gives 'heads', >= 0.5 gives 'tails'", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.setCount(2);
    });

    const mockRandom = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.7);
    act(() => {
      result.current.startFlip();
    });
    mockRandom.mockRestore();

    expect(result.current.results[0]).toBe("heads");
    expect(result.current.results[1]).toBe("tails");
  });

  // Test 9: onFlipEnd computes correct tally, creates history entry, clears flipping after 200ms
  it("onFlipEnd computes correct tally, creates history entry with correct format, and clears flipping after 200ms", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.setCount(5);
    });

    // Mock Math.random: 3 heads (0.3) and 2 tails (0.7)
    const mockRandom = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.7);
    act(() => {
      result.current.startFlip();
    });
    mockRandom.mockRestore();

    act(() => {
      result.current.onFlipEnd();
    });

    // tally should be { heads: 3, tails: 2 }
    expect(result.current.tally).toEqual({ heads: 3, tails: 2 });

    // history should have one entry
    expect(result.current.history).toHaveLength(1);
    // label format: "3H 2T (5 coins)"
    expect(result.current.history[0].label).toBe("3H 2T (5 coins)");
    expect(typeof result.current.history[0].id).toBe("number");
    expect(typeof result.current.history[0].timestamp).toBe("number");

    // flipping is still true right after onFlipEnd (settle delay not elapsed)
    expect(result.current.flipping).toBe(true);

    // After 200ms, flipping should clear
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.flipping).toBe(false);
  });

  // Test 10: history entries are prepended (newest first) with incrementing IDs
  it("history entries are prepended — newest first — with incrementing IDs", () => {
    const { result } = renderHook(() => useCoin());

    // First flip
    act(() => { result.current.startFlip(); });
    act(() => { result.current.onFlipEnd(); });
    // Advance timers so flipping clears before next flip
    act(() => { vi.advanceTimersByTime(200); });

    // Second flip
    act(() => { result.current.startFlip(); });
    act(() => { result.current.onFlipEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current.history).toHaveLength(2);
    // Newest first
    expect(result.current.history[0].id).toBeGreaterThan(result.current.history[1].id);
  });

  // Test 11: count cannot be changed while flipping
  it("setCount does nothing while flipping is true", () => {
    const { result } = renderHook(() => useCoin());
    act(() => {
      result.current.startFlip();
    });
    expect(result.current.flipping).toBe(true);
    act(() => {
      result.current.setCount(5);
    });
    // count should still be 1 (the initial value) since we are flipping
    expect(result.current.count).toBe(1);
  });
});

describe("session tally (COIN-04)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with sessionHeads=0 and sessionTails=0", () => {
    const { result } = renderHook(() => useCoin());
    expect(result.current.sessionHeads).toBe(0);
    expect(result.current.sessionTails).toBe(0);
  });

  it("accumulates sessionHeads and sessionTails across multiple onFlipEnd calls", () => {
    const { result } = renderHook(() => useCoin());

    // First flip: 3 coins yielding 2H 1T
    act(() => { result.current.setCount(3); });
    const mock1 = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.7);
    act(() => { result.current.startFlip(); });
    mock1.mockRestore();
    act(() => { result.current.onFlipEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current.sessionHeads).toBe(2);
    expect(result.current.sessionTails).toBe(1);

    // Second flip: 2 coins yielding 1H 1T
    act(() => { result.current.setCount(2); });
    const mock2 = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.7);
    act(() => { result.current.startFlip(); });
    mock2.mockRestore();
    act(() => { result.current.onFlipEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    // Accumulated: 2+1=3 heads, 1+1=2 tails
    expect(result.current.sessionHeads).toBe(3);
    expect(result.current.sessionTails).toBe(2);
  });

  it("clearSession resets sessionHeads and sessionTails to 0", () => {
    const { result } = renderHook(() => useCoin());

    // Do a flip to accumulate some tally
    const mock = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.7);
    act(() => { result.current.startFlip(); });
    mock.mockRestore();
    act(() => { result.current.onFlipEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current.sessionHeads).toBeGreaterThan(0);

    // Clear session
    act(() => { result.current.clearSession(); });
    expect(result.current.sessionHeads).toBe(0);
    expect(result.current.sessionTails).toBe(0);
  });
});
