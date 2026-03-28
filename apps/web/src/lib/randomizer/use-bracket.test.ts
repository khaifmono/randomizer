import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  nextPowerOf2,
  generateBracket,
  advanceWinner,
  useBracket,
  isMatchupReady,
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
    expect(rounds[0][0].isBye).toBe(false);
  });

  it("generateBracket(['A','B','C']) returns 2 rounds", () => {
    const rounds = generateBracket(["A", "B", "C"]);
    expect(rounds).toHaveLength(2);
    expect(rounds[0]).toHaveLength(2);
    expect(rounds[1]).toHaveLength(1);
  });

  it("generateBracket(['A','B','C']) has 1 bye auto-resolved in round 0", () => {
    const rounds = generateBracket(["A", "B", "C"]);
    const byeMatchups = rounds[0].filter((m) => m.isBye);
    expect(byeMatchups).toHaveLength(1);
    expect(byeMatchups[0].winnerId).not.toBeNull();
  });

  it("generateBracket with 5 names: 3 rounds, 3 byes", () => {
    const rounds = generateBracket(["A", "B", "C", "D", "E"]);
    expect(rounds).toHaveLength(3);
    const byeCount = rounds[0].filter((m) => m.isBye).length;
    expect(byeCount).toBe(3);
  });

  it("all bye matchups have isBye=true and winnerId set (non-null)", () => {
    const rounds = generateBracket(["A", "B", "C"]);
    for (const matchup of rounds[0]) {
      if (matchup.isBye) {
        expect(matchup.winnerId).not.toBeNull();
      }
    }
  });

  it("non-bye matchups have winnerId=null initially", () => {
    const rounds = generateBracket(["A", "B", "C", "D"]);
    for (const matchup of rounds[0]) {
      if (!matchup.isBye) {
        expect(matchup.winnerId).toBeNull();
      }
    }
  });

  it("all matchup IDs follow r{round}-m{index} format", () => {
    const rounds = generateBracket(["A", "B", "C", "D", "E"]);
    for (let r = 0; r < rounds.length; r++) {
      for (let m = 0; m < rounds[r].length; m++) {
        expect(rounds[r][m].id).toBe(`r${r}-m${m}`);
      }
    }
  });

  it("generateBracket with 16 names returns 4 rounds, 0 byes", () => {
    const names = Array.from({ length: 16 }, (_, i) => `Player${i + 1}`);
    const rounds = generateBracket(names);
    expect(rounds).toHaveLength(4);
    const byeCount = rounds[0].filter((m) => m.isBye).length;
    expect(byeCount).toBe(0);
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
    const names = Array.from({ length: 8 }, (_, i) => `P${i + 1}`);
    const rounds = generateBracket(names);
    const winner = rounds[0][2].topEntry!;
    const updated = advanceWinner(rounds, 0, 2, winner);
    expect(updated[1][1].topEntry).toEqual(winner);
  });

  it("advanceWinner is immutable — original rounds not mutated", () => {
    const rounds = generateBracket(["A", "B", "C", "D"]);
    const original = JSON.stringify(rounds);
    const winner = rounds[0][0].topEntry!;
    advanceWinner(rounds, 0, 0, winner);
    expect(JSON.stringify(rounds)).toBe(original);
  });
});

describe("useBracket", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
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
      result.current.setEntries(["A", "B", "C"]);
    });
    expect(result.current.entries).toEqual(["A", "B", "C"]);
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
    act(() => {
      result.current.setEntries(["A", "B", "C"]);
    });
    act(() => {
      result.current.startTournament();
    });
    expect(result.current.bracketState.phase).toBe("playing");
    if (result.current.bracketState.phase === "playing") {
      const { rounds } = result.current.bracketState;
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

    if (result.current.bracketState.phase === "playing") {
      const { rounds } = result.current.bracketState;
      const readyMatchup = rounds.flat().find((m) => isMatchupReady(m))!;
      const winnerId = readyMatchup.topEntry!.id;

      act(() => {
        result.current.resolveMatchup(readyMatchup.id, winnerId);
      });

      if (result.current.bracketState.phase === "playing") {
        const updatedRounds = result.current.bracketState.rounds;
        const resolvedMatchup = updatedRounds.flat().find((m) => m.id === readyMatchup.id)!;
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

    if (result.current.bracketState.phase === "playing") {
      const { rounds } = result.current.bracketState;
      const readyMatchup = rounds.flat().find((m) => isMatchupReady(m))!;

      // Trigger animation first (pre-determines winner)
      act(() => {
        result.current.triggerMatchup(readyMatchup.id);
      });

      act(() => {
        result.current.onAnimationEnd(readyMatchup.id);
      });

      if (result.current.bracketState.phase === "playing") {
        const updatedRounds = result.current.bracketState.rounds;
        const resolvedMatchup = updatedRounds.flat().find((m) => m.id === readyMatchup.id)!;
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

    if (result.current.bracketState.phase !== "playing") return;
    const { rounds } = result.current.bracketState;
    const readyMatchup = rounds.flat().find((m) => isMatchupReady(m))!;
    const winnerId = readyMatchup.topEntry!.id;

    act(() => {
      result.current.resolveMatchup(readyMatchup.id, winnerId);
    });

    const state = result.current.bracketState as { phase: string; winnerId?: number };
    expect(state.phase).toBe("complete");
    expect(state.winnerId).toBe(winnerId);
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
      const { rounds } = result.current.bracketState;
      const readyMatchup = rounds.flat().find((m) => isMatchupReady(m))!;
      const winnerId = readyMatchup.topEntry!.id;
      const winnerName = readyMatchup.topEntry!.name;

      act(() => {
        result.current.resolveMatchup(readyMatchup.id, winnerId);
      });

      expect(result.current.history).toHaveLength(1);
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

  it("double onAnimationEnd on same matchup is harmless", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase === "playing") {
      const { rounds } = result.current.bracketState;
      const readyMatchup = rounds.flat().find((m) => isMatchupReady(m))!;

      act(() => {
        result.current.triggerMatchup(readyMatchup.id);
      });

      act(() => {
        result.current.onAnimationEnd(readyMatchup.id);
      });

      act(() => {
        result.current.onAnimationEnd(readyMatchup.id);
      });

      expect(["playing", "complete"]).toContain(
        result.current.bracketState.phase,
      );
    }
  });

  it("tournament with 2 entries via onAnimationEnd in random mode completes", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B"]);
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase === "playing") {
      const { rounds } = result.current.bracketState;
      const readyMatchup = rounds.flat().find((m) => isMatchupReady(m))!;

      act(() => {
        result.current.triggerMatchup(readyMatchup.id);
      });

      act(() => {
        result.current.onAnimationEnd(readyMatchup.id);
      });

      expect(result.current.bracketState.phase).toBe("complete");
      expect(result.current.history).toHaveLength(1);
    }
  });

  it("can click any ready matchup, not just the first one", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
      result.current.setMode("judge");
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase === "playing") {
      const { rounds } = result.current.bracketState;
      const readyMatchups = rounds.flat().filter((m) => isMatchupReady(m));
      expect(readyMatchups.length).toBeGreaterThan(1);

      // Resolve the SECOND ready matchup (not the first)
      const secondMatchup = readyMatchups[1];
      const winnerId = secondMatchup.topEntry!.id;

      act(() => {
        result.current.resolveMatchup(secondMatchup.id, winnerId);
      });

      if (result.current.bracketState.phase === "playing") {
        const updatedRounds = result.current.bracketState.rounds;
        const resolved = updatedRounds.flat().find((m) => m.id === secondMatchup.id)!;
        expect(resolved.winnerId).toBe(winnerId);
      }
    }
  });

  it("judge mode: single resolveMatchup call directly picks winner (no trigger/animation needed)", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B"]);
      result.current.setMode("judge");
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase !== "playing") return;

    const { rounds } = result.current.bracketState;
    const readyMatchup = rounds.flat().find((m) => isMatchupReady(m))!;
    const winnerId = readyMatchup.topEntry!.id;

    // Single call — no triggerMatchup or onAnimationEnd needed
    act(() => {
      result.current.resolveMatchup(readyMatchup.id, winnerId);
    });

    const finalState = result.current.bracketState as { phase: string; winnerId?: number };
    expect(finalState.phase).toBe("complete");
    expect(finalState.winnerId).toBe(winnerId);
    expect(result.current.history).toHaveLength(1);
  });

  it("judge mode 4 entries: resolve all matchups directly, advances through rounds to completion", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
      result.current.setMode("judge");
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase !== "playing") return;

    const readyMatchups = result.current.bracketState.rounds.flat().filter((m) => isMatchupReady(m));
    expect(readyMatchups).toHaveLength(2);

    // Directly resolve both round 1 matchups
    act(() => { result.current.resolveMatchup(readyMatchups[0].id, readyMatchups[0].topEntry!.id); });
    act(() => { result.current.resolveMatchup(readyMatchups[1].id, readyMatchups[1].topEntry!.id); });

    // Round 2 should have a ready matchup
    if (result.current.bracketState.phase === "playing") {
      const round2Ready = result.current.bracketState.rounds[1].filter((m) => isMatchupReady(m));
      expect(round2Ready).toHaveLength(1);

      // Resolve final
      act(() => { result.current.resolveMatchup(round2Ready[0].id, round2Ready[0].topEntry!.id); });

      const finalState = result.current.bracketState as { phase: string };
      expect(finalState.phase).toBe("complete");
    }
  });

  it("undoLastResolve restores previous bracket state", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B", "C", "D"]);
      result.current.setMode("judge");
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase !== "playing") return;

    const readyMatchups = result.current.bracketState.rounds.flat().filter((m) => isMatchupReady(m));
    const m1 = readyMatchups[0];

    // Resolve first matchup
    act(() => { result.current.resolveMatchup(m1.id, m1.topEntry!.id); });

    if (result.current.bracketState.phase !== "playing") return;
    // Matchup should be resolved
    const resolved = result.current.bracketState.rounds.flat().find((m) => m.id === m1.id)!;
    expect(resolved.winnerId).toBe(m1.topEntry!.id);

    // Undo
    act(() => { result.current.undoLastResolve(); });

    // Matchup should be unresolved again
    if (result.current.bracketState.phase === "playing") {
      const undone = result.current.bracketState.rounds.flat().find((m) => m.id === m1.id)!;
      expect(undone.winnerId).toBeNull();
    }
  });

  it("undoLastResolve from complete phase goes back to playing and removes history entry", () => {
    const { result } = renderHook(() => useBracket());
    act(() => {
      result.current.setEntries(["A", "B"]);
      result.current.setMode("judge");
    });
    act(() => {
      result.current.startTournament();
    });

    if (result.current.bracketState.phase !== "playing") return;

    const readyMatchup = result.current.bracketState.rounds.flat().find((m) => isMatchupReady(m))!;

    act(() => { result.current.resolveMatchup(readyMatchup.id, readyMatchup.topEntry!.id); });
    expect((result.current.bracketState as { phase: string }).phase).toBe("complete");
    expect(result.current.history).toHaveLength(1);

    // Undo from complete
    act(() => { result.current.undoLastResolve(); });

    expect(result.current.bracketState.phase).toBe("playing");
    expect(result.current.history).toHaveLength(0);
  });
});
