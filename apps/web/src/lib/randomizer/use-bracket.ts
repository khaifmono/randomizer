import { useState, useRef, useCallback } from "react";
import type { HistoryEntry } from "./types";

export const ANIMATION_DURATION = 1200;

export type BracketEntry = { id: number; name: string; isBye: boolean };

export type Matchup = {
  id: string; // "r{round}-m{index}"
  topEntry: BracketEntry | null;
  bottomEntry: BracketEntry | null;
  winnerId: number | null;
  isBye: boolean;
};

export type BracketState =
  | { phase: "entry" }
  | { phase: "playing"; rounds: Matchup[][]; activeMatchupId: string | null; animating: boolean }
  | { phase: "complete"; winnerId: number };

// Returns the smallest power of 2 >= n (clamped to 2-16)
export function nextPowerOf2(n: number): number {
  if (n <= 2) return 2;
  if (n <= 4) return 4;
  if (n <= 8) return 8;
  return 16;
}

// Fisher-Yates shuffle (in-place, returns array)
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateBracket(names: string[]): Matchup[][] {
  // Clamp to 16 entries
  const clamped = names.slice(0, 16);
  const size = nextPowerOf2(Math.max(clamped.length, 2));
  const numRounds = Math.log2(size);
  const byeCount = size - clamped.length;

  // Build real entries and shuffle them
  let idCounter = 1;
  const realEntries: BracketEntry[] = clamped.map((name) => ({
    id: idCounter++,
    name,
    isBye: false,
  }));
  shuffle(realEntries);

  // Build BYE entries
  const byeEntries: BracketEntry[] = Array.from({ length: byeCount }, () => ({
    id: idCounter++,
    name: "BYE",
    isBye: true,
  }));

  // Interleave BYEs with real entries so each BYE faces a real entry (never BYE vs BYE)
  // Strategy: place BYEs at evenly-spaced positions among all slots
  const slotCount = size;
  const slots: (BracketEntry | null)[] = Array(slotCount).fill(null);

  // Place BYEs at evenly-spaced positions
  const byeStep = slotCount / Math.max(byeCount, 1);
  let byeIdx = 0;
  const byePositions: number[] = [];
  for (let i = 0; i < byeCount; i++) {
    byePositions.push(Math.round(i * byeStep));
  }
  for (const pos of byePositions) {
    slots[pos] = byeEntries[byeIdx++];
  }

  // Fill remaining slots with real entries
  let realIdx = 0;
  for (let i = 0; i < slotCount; i++) {
    if (slots[i] === null) {
      slots[i] = realEntries[realIdx++];
    }
  }

  const entries = slots as BracketEntry[];

  // Build round 0 matchups
  const round0: Matchup[] = [];
  for (let i = 0; i < size / 2; i++) {
    const top = entries[i * 2];
    const bottom = entries[i * 2 + 1];
    const isBye = top.isBye || bottom.isBye;
    // Pre-determine winner for bye matchups
    let winnerId: number | null = null;
    if (isBye) {
      winnerId = top.isBye ? bottom.id : top.id;
    }
    round0.push({
      id: `r0-m${i}`,
      topEntry: top,
      bottomEntry: bottom,
      winnerId,
      isBye,
    });
  }

  // Build empty subsequent rounds
  const rounds: Matchup[][] = [round0];
  for (let r = 1; r < numRounds; r++) {
    const prevSize = rounds[r - 1].length;
    const roundMatchups: Matchup[] = [];
    for (let m = 0; m < prevSize / 2; m++) {
      roundMatchups.push({
        id: `r${r}-m${m}`,
        topEntry: null,
        bottomEntry: null,
        winnerId: null,
        isBye: false,
      });
    }
    rounds.push(roundMatchups);
  }

  return rounds;
}

// Immutable update — advances winner from matchup[roundIndex][matchupIndex] to next round
export function advanceWinner(
  rounds: Matchup[][],
  roundIndex: number,
  matchupIndex: number,
  winner: BracketEntry,
): Matchup[][] {
  if (roundIndex + 1 >= rounds.length) return rounds;

  const nextRoundIndex = roundIndex + 1;
  const nextMatchupIndex = Math.floor(matchupIndex / 2);
  const isTop = matchupIndex % 2 === 0;

  return rounds.map((round, ri) => {
    if (ri !== nextRoundIndex) return round;
    return round.map((matchup, mi) => {
      if (mi !== nextMatchupIndex) return matchup;
      return isTop
        ? { ...matchup, topEntry: winner }
        : { ...matchup, bottomEntry: winner };
    });
  });
}

function findNextActiveMatchup(rounds: Matchup[][]): string | null {
  for (const round of rounds) {
    for (const matchup of round) {
      if (
        !matchup.isBye &&
        matchup.winnerId === null &&
        matchup.topEntry !== null &&
        matchup.bottomEntry !== null
      ) {
        return matchup.id;
      }
    }
  }
  return null;
}

function findWinnerEntry(rounds: Matchup[][], winnerId: number): BracketEntry | null {
  for (const round of rounds) {
    for (const matchup of round) {
      if (matchup.topEntry?.id === winnerId) return matchup.topEntry;
      if (matchup.bottomEntry?.id === winnerId) return matchup.bottomEntry;
    }
  }
  return null;
}

function pickRandomWinner(matchup: Matchup): BracketEntry | null {
  const candidates: BracketEntry[] = [];
  if (matchup.topEntry && !matchup.topEntry.isBye) candidates.push(matchup.topEntry);
  if (matchup.bottomEntry && !matchup.bottomEntry.isBye) candidates.push(matchup.bottomEntry);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function useBracket() {
  const [entries, setEntriesState] = useState<string[]>([]);
  const [mode, setModeState] = useState<"random" | "judge">("random");
  const [bracketState, setBracketState] = useState<BracketState>({ phase: "entry" });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Synchronous guard — prevents double-trigger during animation
  const isAnimatingRef = useRef(false);
  // Pre-determined winner for random mode, stable across animation
  const pendingWinnerRef = useRef<BracketEntry | null>(null);
  // Mirrors rounds state for synchronous reads in callbacks
  const roundsRef = useRef<Matchup[][]>([]);
  const nextIdRef = useRef(1);
  // Track entrant count for history label
  const entrantCountRef = useRef(0);

  const addEntry = useCallback((name: string) => {
    if (bracketState.phase !== "entry") return;
    setEntriesState((prev) => [...prev, name]);
  }, [bracketState.phase]);

  const setEntries = useCallback((names: string[]) => {
    if (bracketState.phase !== "entry") return;
    setEntriesState(names);
  }, [bracketState.phase]);

  const setMode = useCallback((m: "random" | "judge") => {
    if (bracketState.phase !== "entry") return;
    setModeState(m);
  }, [bracketState.phase]);

  const startTournament = useCallback(() => {
    if (isAnimatingRef.current) return;
    // Read entries from state directly (no stale closure issue since setEntriesState is committed)
    setEntriesState((currentEntries) => {
      if (currentEntries.length < 2) return currentEntries;

      entrantCountRef.current = currentEntries.length;
      let rounds = generateBracket(currentEntries);

      // Propagate all bye winners immediately
      for (let r = 0; r < rounds.length - 1; r++) {
        for (let m = 0; m < rounds[r].length; m++) {
          const matchup = rounds[r][m];
          if (matchup.isBye && matchup.winnerId !== null) {
            const winner = findWinnerEntry(rounds, matchup.winnerId);
            if (winner) {
              rounds = advanceWinner(rounds, r, m, winner);
            }
          }
        }
      }

      roundsRef.current = rounds;

      const activeMatchupId = findNextActiveMatchup(rounds);

      // Pre-determine winner for random mode
      if (activeMatchupId) {
        setModeState((currentMode) => {
          if (currentMode === "random") {
            const activeMatchup = rounds
              .flat()
              .find((m) => m.id === activeMatchupId);
            if (activeMatchup) {
              pendingWinnerRef.current = pickRandomWinner(activeMatchup);
            }
          }
          return currentMode;
        });
      }

      setBracketState({
        phase: "playing",
        rounds,
        activeMatchupId,
        animating: false,
      });

      return currentEntries;
    });
  }, []);

  const resolveMatchup = useCallback((matchupId: string, winnerId: number) => {
    if (isAnimatingRef.current) return;

    setBracketState((prev) => {
      if (prev.phase !== "playing") return prev;

      let rounds = prev.rounds.map((round) =>
        round.map((m) =>
          m.id === matchupId ? { ...m, winnerId } : m,
        ),
      );

      // Find the round/matchup index to advance winner
      let roundIndex = -1;
      let matchupIndex = -1;
      let winnerEntry: BracketEntry | null = null;

      for (let r = 0; r < rounds.length; r++) {
        for (let mi = 0; mi < rounds[r].length; mi++) {
          if (rounds[r][mi].id === matchupId) {
            roundIndex = r;
            matchupIndex = mi;
            const m = rounds[r][mi];
            winnerEntry =
              m.topEntry?.id === winnerId
                ? m.topEntry
                : m.bottomEntry?.id === winnerId
                  ? m.bottomEntry
                  : null;
            break;
          }
        }
        if (roundIndex !== -1) break;
      }

      if (winnerEntry && roundIndex !== -1) {
        rounds = advanceWinner(rounds, roundIndex, matchupIndex, winnerEntry);
      }

      roundsRef.current = rounds;

      const nextActiveId = findNextActiveMatchup(rounds);

      if (nextActiveId === null) {
        // Tournament complete
        const lastRound = rounds[rounds.length - 1];
        const finalMatchup = lastRound[0];
        const finalWinnerId = finalMatchup.winnerId!;
        const finalWinnerEntry = findWinnerEntry(rounds, finalWinnerId);
        const winnerName = finalWinnerEntry?.name ?? "Unknown";

        const label = `Winner: ${winnerName} (${rounds.length} rounds, ${entrantCountRef.current} entrants)`;
        const entry: HistoryEntry = {
          id: nextIdRef.current++,
          label,
          timestamp: Date.now(),
        };
        setHistory((h) => [entry, ...h]);

        return { phase: "complete", winnerId: finalWinnerId };
      }

      return {
        phase: "playing",
        rounds,
        activeMatchupId: nextActiveId,
        animating: false,
      };
    });
  }, []);

  const onAnimationEnd = useCallback((matchupId: string) => {
    const winner = pendingWinnerRef.current;
    if (!winner) return;
    pendingWinnerRef.current = null;

    setBracketState((prev) => {
      if (prev.phase !== "playing") return prev;
      if (prev.activeMatchupId !== matchupId) return prev;

      let rounds = prev.rounds.map((round) =>
        round.map((m) =>
          m.id === matchupId ? { ...m, winnerId: winner.id } : m,
        ),
      );

      // Find round/matchup index to advance
      let roundIndex = -1;
      let matchupIndex = -1;

      for (let r = 0; r < rounds.length; r++) {
        for (let mi = 0; mi < rounds[r].length; mi++) {
          if (rounds[r][mi].id === matchupId) {
            roundIndex = r;
            matchupIndex = mi;
            break;
          }
        }
        if (roundIndex !== -1) break;
      }

      if (roundIndex !== -1) {
        rounds = advanceWinner(rounds, roundIndex, matchupIndex, winner);
      }

      roundsRef.current = rounds;

      const nextActiveId = findNextActiveMatchup(rounds);

      if (nextActiveId === null) {
        // Tournament complete
        const lastRound = rounds[rounds.length - 1];
        const finalMatchup = lastRound[0];
        const finalWinnerId = finalMatchup.winnerId!;
        const finalWinnerEntry = findWinnerEntry(rounds, finalWinnerId);
        const winnerName = finalWinnerEntry?.name ?? "Unknown";

        const label = `Winner: ${winnerName} (${rounds.length} rounds, ${entrantCountRef.current} entrants)`;
        const entry: HistoryEntry = {
          id: nextIdRef.current++,
          label,
          timestamp: Date.now(),
        };
        setHistory((h) => [entry, ...h]);

        return { phase: "complete", winnerId: finalWinnerId };
      }

      // Pre-determine next winner for random mode
      setModeState((currentMode) => {
        if (currentMode === "random") {
          const nextMatchup = rounds.flat().find((m) => m.id === nextActiveId);
          if (nextMatchup) {
            pendingWinnerRef.current = pickRandomWinner(nextMatchup);
          }
        }
        return currentMode;
      });

      return {
        phase: "playing",
        rounds,
        activeMatchupId: nextActiveId,
        animating: false,
      };
    });
  }, []);

  const resetBracket = useCallback(() => {
    isAnimatingRef.current = false;
    pendingWinnerRef.current = null;
    roundsRef.current = [];
    setBracketState({ phase: "entry" });
  }, []);

  return {
    entries,
    mode,
    bracketState,
    history,
    addEntry,
    setEntries,
    setMode,
    startTournament,
    resolveMatchup,
    onAnimationEnd,
    resetBracket,
  };
}

export { useBracket };
