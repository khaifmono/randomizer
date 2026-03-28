import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  nextPowerOf2,
  generateBracket,
  advanceWinner,
  useBracket,
} from "./use-bracket";

describe("nextPowerOf2", () => {
  it("nextPowerOf2(2) returns 2", () => {
    expect(nextPowerOf2(2)).toBe(2);
  });

  it("nextPowerOf2(3) returns 4", () => {
    expect(nextPowerOf2(3)).toBe(4);
  });

  it("nextPowerOf2(5) returns 8", () => {
    expect(nextPowerOf2(5)).toBe(8);
  });

  it("nextPowerOf2(9) returns 16", () => {
    expect(nextPowerOf2(9)).toBe(16);
  });
});

describe("generateBracket", () => {
  it("generateBracket(['A','B']) returns 1 round with 1 matchup, no byes", () => {
    const rounds = generateBracket(["A", "B"]);
    expect(rounds).toHaveLength(1);
    expect(rounds[0]).toHaveLength(1);
    const matchup = rounds[0][0];
    expect(matchup.isBye).toBe(false);
    expect(matchup.topEntry).not.toBeNull();
    expect(matchup.bottomEntry).not.toBeNull();
    expect(matchup.topEntry!.isBye).toBe(false);
    expect(matchup.bottomEntry!.isBye).toBe(false);
  });

  it("generateBracket(['A','B','C']) returns 2 rounds", () => {
    const rounds = generateBracket(["A", "B", "C"]);
    expect(rounds).toHaveLength(2);
    // round 0 has 2 matchups, round 1 has 1
    expect(rounds[0]).toHaveLength(2);
    expect(rounds[1]).toHaveLength(1);
  });

  it("generateBracket(['A','B','C']) has 1 bye auto-resolved in round 0", () => {
    const rounds = generateBracket(["A", "B", "C"]);
    const byeMatchups = rounds[0].filter((m) => m.isBye);
    expect(byeMatchups).toHaveLength(1);
    // Bye matchup has winnerId pre-set
    expect(byeMatchups[0].winnerId).not.toBeNull();
  });

  it("generateBracket with 5 names: 3 rounds, 3 byes", () => {
    const names = ["A", "B", "C", "D", "E"];
    const rounds = generateBracket(names);
    // 5 -> next power of 2 = 8, so 3 rounds
    expect(rounds).toHaveLength(3);
    // round 0 has 4 matchups
    expect(rounds[0]).toHaveLength(4);
    // 3 byes (8-5=3 bye entries, each in its own matchup with a real entry)
    const byeMatchups = rounds[0].filter((m) => m.isBye);
    expect(byeMatchups).toHaveLength(3);
  });

  it("all bye matchups have isBye=true and winnerId set (non-null)", () => {
    const rounds = generateBracket(["A", "B", "C"]);
    const byeMatchup = rounds[0].find((m) => m.isBye);
    expect(byeMatchup).toBeDefined();
    expect(byeMatchup!.isBye).toBe(true);
    expect(byeMatchup!.winnerId).not.toBeNull();
  });

  it("non-bye matchups have winnerId=null initially", () => {
    const rounds = generateBracket(["A", "B", "C"]);
    const nonByeMatchups = rounds[0].filter((m) => !m.isBye);
    for (const m of nonByeMatchups) {
      expect(m.winnerId).toBeNull();
    }
  });

  it("all matchup IDs follow r{round}-m{index} format", () => {
    const rounds = generateBracket(["A", "B", "C", "D"]);
    expect(rounds[0][0].id).toBe("r0-m0");
    expect(rounds[0][1].id).toBe("r0-m1");
    expect(rounds[1][0].id).toBe("r1-m0");
  });

  it("generateBracket with 16 names returns 4 rounds, 0 byes", () => {
    const names = Array.from({ length: 16 }, (_, i) => `P${i + 1}`);
    const rounds = generateBracket(names);
    expect(rounds).toHaveLength(4);
    const byeMatchups = rounds[0].filter((m) => m.isBye);
    expect(byeMatchups).toHaveLength(0);
  });
});

describe("advanceWinner", () => {
  it("matchup 0 in round 0 feeds round 1 matchup 0 topEntry (even index)", () => {
    const rounds = generateBracket(["A", "B", "C", "D"]);
    const winner = rounds[0][0].topEntry!;
    const updated = advanceWinner(rounds, 0, 0, winner);
    expect(updated[1][0].topEntry).toEqual(winner);
  });

  it("matchup 1 in round 0 feeds round 1 matchup 0 bottomEntry (odd index)", () => {
    const rounds = generateBracket(["A", "B", "C", "D"]);
    const winner = rounds[0][1].topEntry!;
    const updated = advanceWinner(rounds, 0, 1, winner);
    expect(updated[1][0].bottomEntry).toEqual(winner);
  });

  it("matchup 2 in round 0 feeds round 1 matchup 1 topEntry (even index)", () => {
    const rounds = generateBracket(["A", "B", "C", "D", "E", "F", "G", "H"]);
    const winner = rounds[0][2].topEntry!;
    const updated = advanceWinner(rounds, 0, 2, winner);
    expect(updated[1][1].topEntry).toEqual(winner);
  });

  it("advanceWinner is immutable — original rounds not mutated", () => {
    const rounds = generateBracket(["A", "B", "C", "D"]);
    const originalRound1 = rounds[1][0].topEntry;
    const winner = rounds[0][0].topEntry!;
    advanceWinner(rounds, 0, 0, winner);
    // Original should be unchanged
    expect(rounds[1][0].topEntry).toBe(originalRound1);
  });
});

describe("useBracket", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with phase=entry, mode=random, entries=[], history=[]", () => {
    const { result } = renderHook(() => useBracket());
    expect(result.current.bracketState.phase).toBe("entry");
    expect(result.current.mode).toBe("random");
    expect(result.current.entries).toEqual([]);
    expect(result.current.history).toEqual([]);
  });

  it("addEntry adds a name to entries when phase=entry", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.addEntry("Alice");
    });
    expect(result.current.entries).toEqual(["Alice"]);
  });

  it("setEntries replaces entries when phase=entry", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["Alice", "Bob", "Carol"]);
    });
    expect(result.current.entries).toEqual(["Alice", "Bob", "Carol"]);
  });

  it("setMode changes mode when phase=entry", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setMode("judge");
    });
    expect(result.current.mode).toBe("judge");
  });

  it("startTournament with 4 entries: phase becomes playing, rounds has 2 rounds", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
    });
    act(() => {
      result.current.startTournament();
    });
    expect(result.current.bracketState.phase).toBe("playing");
    if (result.current.bracketState.phase === "playing") {
      expect(result.current.bracketState.rounds).toHaveLength(2);
    }
  });

  it("startTournament propagates bye winners to round 1 slots immediately", () => {
    const { result } = renderHook(() => useBracket());
    // 3 entries -> 1 bye -> bye winner goes to round 1
    act(() => {
      result.current.setEntries(["A", "B", "C"]);
    });
    act(() => {
      result.current.startTournament();
    });
    expect(result.current.bracketState.phase).toBe("playing");
    if (result.current.bracketState.phase === "playing") {
      const { rounds } = result.current.bracketState;
      // At least one slot in round 1 should have an entry (from bye propagation)
      const round1Slots = rounds[1];
      const hasFilledSlot = round1Slots.some(
        (m) => m.topEntry !== null || m.bottomEntry !== null,
      );
      expect(hasFilledSlot).toBe(true);
    }
  });

  it("setEntries is blocked during playing phase", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
    });
    act(() => {
      result.current.startTournament();
    });
    act(() => {
      result.current.setEntries(["X", "Y"]);
    });
    expect(result.current.entries).toEqual(["A", "B", "C", "D"]);
  });

  it("setMode is blocked during playing phase", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
    });
    act(() => {
      result.current.startTournament();
    });
    act(() => {
      result.current.setMode("judge");
    });
    expect(result.current.mode).toBe("random");
  });

  it("resolveMatchup in judge mode: sets winnerId on matchup and advances winner", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
      result.current.setMode("judge");
    });
    act(() => {
      result.current.startTournament();
    });

    expect(result.current.bracketState.phase).toBe("playing");
    if (result.current.bracketState.phase === "playing") {
      const { rounds, activeMatchupId } = result.current.bracketState;
      const activeMatchup = rounds[0].find((m) => m.id === activeMatchupId)!;
      const winnerId = activeMatchup.topEntry!.id;

      act(() => {
        result.current.resolveMatchup(activeMatchupId!, winnerId);
      });

      if (result.current.bracketState.phase === "playing") {
        const updatedRounds = result.current.bracketState.rounds;
        const resolvedMatchup = updatedRounds[0].find(
          (m) => m.id === activeMatchupId,
        )!;
        expect(resolvedMatchup.winnerId).toBe(winnerId);
      }
    }
  });

  it("onAnimationEnd in random mode applies pre-determined winner", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
    });
    act(() => {
      result.current.startTournament();
    });

    expect(result.current.bracketState.phase).toBe("playing");
    if (result.current.bracketState.phase === "playing") {
      const { activeMatchupId } = result.current.bracketState;

      act(() => {
        result.current.onAnimationEnd(activeMatchupId!);
      });

      if (result.current.bracketState.phase === "playing") {
        const updatedRounds = result.current.bracketState.rounds;
        const resolvedMatchup = updatedRounds[0].find(
          (m) => m.id === activeMatchupId,
        )!;
        // Winner should have been set by pre-determined random choice
        expect(resolvedMatchup.winnerId).not.toBeNull();
      }
    }
  });

  it("tournament with 2 entries completes after resolveMatchup in judge mode", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B"]);
      result.current.setMode("judge");
    });
    act(() => {
      result.current.startTournament();
    });

    expect(result.current.bracketState.phase).toBe("playing");
    if (result.current.bracketState.phase === "playing") {
      const { rounds, activeMatchupId } = result.current.bracketState;
      const activeMatchup = rounds[0].find((m) => m.id === activeMatchupId)!;
      const winnerId = activeMatchup.topEntry!.id;

      act(() => {
        result.current.resolveMatchup(activeMatchupId!, winnerId);
      });

      expect(result.current.bracketState.phase).toBe("complete");
      if (result.current.bracketState.phase === "complete") {
        expect(result.current.bracketState.winnerId).toBe(winnerId);
      }
    }
  });

  it("history entry logged on completion with correct label format", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B"]);
      result.current.setMode("judge");
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase === "playing") {
      const { rounds, activeMatchupId } = result.current.bracketState;
      const activeMatchup = rounds[0].find((m) => m.id === activeMatchupId)!;
      const winnerId = activeMatchup.topEntry!.id;
      const winnerName = activeMatchup.topEntry!.name;

      act(() => {
        result.current.resolveMatchup(activeMatchupId!, winnerId);
      });

      expect(result.current.history).toHaveLength(1);
      // Format: "Winner: {name} ({N} rounds, {N} entrants)"
      expect(result.current.history[0].label).toMatch(
        new RegExp(`^Winner: ${winnerName} \\(\\d+ rounds?, \\d+ entrants\\)$`),
      );
    }
  });

  it("resetBracket returns to entry phase and clears rounds", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
    });
    act(() => {
      result.current.startTournament();
    });
    expect(result.current.bracketState.phase).toBe("playing");

    act(() => {
      result.current.resetBracket();
    });
    expect(result.current.bracketState.phase).toBe("entry");
  });

  it("isAnimatingRef prevents double-trigger during animation (random mode)", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase === "playing") {
      const { activeMatchupId } = result.current.bracketState;

      // First call triggers animation
      act(() => {
        result.current.onAnimationEnd(activeMatchupId!);
      });

      // Second call on the now-resolved matchup should be a no-op
      // (the active matchup has changed; resolving old ID does nothing new)
      act(() => {
        result.current.onAnimationEnd(activeMatchupId!);
      });

      // Phase should still be valid (playing or complete, not broken)
      expect(["playing", "complete"]).toContain(
        result.current.bracketState.phase,
      );
    }
  });

  it("tournament with 2 entries via onAnimationEnd in random mode completes", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B"]);
      // keep mode as random (default)
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase === "playing") {
      const { activeMatchupId } = result.current.bracketState;
      act(() => {
        result.current.onAnimationEnd(activeMatchupId!);
      });
      expect(result.current.bracketState.phase).toBe("complete");
      expect(result.current.history).toHaveLength(1);
    }
  });
});
