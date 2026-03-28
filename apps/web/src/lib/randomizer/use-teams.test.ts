import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTeams } from "./use-teams";

describe("useTeams", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  // Test 1: Initial state
  it("initializes with names=[], mode='split', teamCount=2, shuffling=false, result=null, history=[]", () => {
    const { result } = renderHook(() => useTeams());
    expect(result.current.names).toEqual([]);
    expect(result.current.mode).toBe("split");
    expect(result.current.teamCount).toBe(2);
    expect(result.current.shuffling).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  // Test 2: setNames updates names
  it("setNames(['Alice','Bob','Carol']) updates names", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob", "Carol"]);
    });
    expect(result.current.names).toEqual(["Alice", "Bob", "Carol"]);
  });

  // Test 3: setMode updates mode
  it("setMode('pick-one') updates mode", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setMode("pick-one");
    });
    expect(result.current.mode).toBe("pick-one");
  });

  // Test 4: setTeamCount(3) updates teamCount
  it("setTeamCount(3) updates teamCount to 3", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setTeamCount(3);
    });
    expect(result.current.teamCount).toBe(3);
  });

  // Test 5: setTeamCount(1) is a no-op (below min of 2)
  it("setTeamCount(1) does nothing — teamCount stays at 2", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setTeamCount(1);
    });
    expect(result.current.teamCount).toBe(2);
  });

  // Test 6: setTeamCount(9) is a no-op (above max of 8)
  it("setTeamCount(9) does nothing — teamCount stays at 2", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setTeamCount(9);
    });
    expect(result.current.teamCount).toBe(2);
  });

  // Test 7: startShuffle sets shuffling=true
  it("startShuffle sets shuffling=true", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob"]);
    });
    act(() => {
      result.current.startShuffle();
    });
    expect(result.current.shuffling).toBe(true);
  });

  // Test 8: startShuffle is a no-op when already shuffling (double-call guard)
  it("startShuffle does nothing when already shuffling", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob", "Carol"]);
    });
    act(() => {
      result.current.startShuffle();
    });
    expect(result.current.shuffling).toBe(true);
    // Second call should be no-op — shuffling stays true and result stays null
    act(() => {
      result.current.startShuffle();
    });
    expect(result.current.shuffling).toBe(true);
  });

  // Test 9: setNames no-op when shuffling=true
  it("setNames does nothing while shuffling=true", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob"]);
    });
    act(() => {
      result.current.startShuffle();
    });
    expect(result.current.shuffling).toBe(true);
    act(() => {
      result.current.setNames(["New", "Names"]);
    });
    expect(result.current.names).toEqual(["Alice", "Bob"]);
  });

  // Test 10: setMode no-op when shuffling=true
  it("setMode does nothing while shuffling=true", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob"]);
    });
    act(() => {
      result.current.startShuffle();
    });
    expect(result.current.shuffling).toBe(true);
    act(() => {
      result.current.setMode("pick-one");
    });
    expect(result.current.mode).toBe("split");
  });

  // Test 11: setTeamCount no-op when shuffling=true
  it("setTeamCount does nothing while shuffling=true", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob"]);
    });
    act(() => {
      result.current.startShuffle();
    });
    expect(result.current.shuffling).toBe(true);
    act(() => {
      result.current.setTeamCount(5);
    });
    expect(result.current.teamCount).toBe(2);
  });

  // Test 12: onShuffleEnd (pick-one) — result.mode="pick-one", result.picked is one of the names, history has 1 entry with "Picked:" label
  it("onShuffleEnd in pick-one mode: result.picked is one of the names, history has 'Picked:' label", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob", "Carol"]);
      result.current.setMode("pick-one");
    });
    act(() => {
      result.current.startShuffle();
    });
    act(() => {
      result.current.onShuffleEnd();
    });

    expect(result.current.result).not.toBeNull();
    expect(result.current.result!.mode).toBe("pick-one");
    expect(["Alice", "Bob", "Carol"]).toContain(result.current.result!.picked);
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].label).toMatch(/^Picked: /);
  });

  // Test 13: onShuffleEnd (split, 4 names, 2 teams) — result.teams has 2 arrays, all 4 names distributed, no duplicates
  it("onShuffleEnd in split mode (4 names, 2 teams): result.teams has 2 arrays, all 4 names, no duplicates", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob", "Carol", "Dave"]);
    });
    act(() => {
      result.current.startShuffle();
    });
    act(() => {
      result.current.onShuffleEnd();
    });

    expect(result.current.result).not.toBeNull();
    expect(result.current.result!.mode).toBe("split");
    expect(result.current.result!.teams).toHaveLength(2);

    const allNames = result.current.result!.teams!.flat();
    expect(allNames).toHaveLength(4);
    expect(new Set(allNames).size).toBe(4); // no duplicates
    expect(allNames.sort()).toEqual(["Alice", "Bob", "Carol", "Dave"].sort());
  });

  // Test 14: onShuffleEnd clears shuffling after 200ms (fake timers)
  it("onShuffleEnd clears shuffling after 200ms", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob"]);
    });
    act(() => {
      result.current.startShuffle();
    });
    act(() => {
      result.current.onShuffleEnd();
    });

    // shuffling still true right after onShuffleEnd
    expect(result.current.shuffling).toBe(true);

    // After 200ms, shuffling clears
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.shuffling).toBe(false);
  });

  // Test 15: onShuffleEnd with empty names list — pick-one sets picked=undefined
  it("onShuffleEnd with empty names in pick-one mode: picked=undefined", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setMode("pick-one");
    });
    act(() => {
      result.current.startShuffle();
    });
    act(() => {
      result.current.onShuffleEnd();
    });

    expect(result.current.result!.mode).toBe("pick-one");
    expect(result.current.result!.picked).toBeUndefined();
  });

  // Test 16: onShuffleEnd with empty names list — split sets teams=[]
  it("onShuffleEnd with empty names in split mode: teams=[]", () => {
    const { result } = renderHook(() => useTeams());
    // names starts empty, mode starts as split
    act(() => {
      result.current.startShuffle();
    });
    act(() => {
      result.current.onShuffleEnd();
    });

    expect(result.current.result!.mode).toBe("split");
    expect(result.current.result!.teams).toEqual([]);
  });

  // Test 17: History prepend — second shuffle result is history[0], first is history[1]
  it("history entries are prepended — newest first — with incrementing IDs", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice", "Bob"]);
    });

    // First shuffle
    act(() => { result.current.startShuffle(); });
    act(() => { result.current.onShuffleEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    // Second shuffle
    act(() => { result.current.startShuffle(); });
    act(() => { result.current.onShuffleEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current.history).toHaveLength(2);
    // Newest first — second entry has a higher ID
    expect(result.current.history[0].id).toBeGreaterThan(result.current.history[1].id);
  });

  // Test 18: History IDs increment
  it("history entry IDs are incrementing integers starting at 1", () => {
    const { result } = renderHook(() => useTeams());
    act(() => {
      result.current.setNames(["Alice"]);
      result.current.setMode("pick-one");
    });

    act(() => { result.current.startShuffle(); });
    act(() => { result.current.onShuffleEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current.history[0].id).toBe(1);

    act(() => { result.current.startShuffle(); });
    act(() => { result.current.onShuffleEnd(); });
    act(() => { vi.advanceTimersByTime(200); });

    expect(result.current.history[0].id).toBe(2);
    expect(result.current.history[1].id).toBe(1);
  });
});
