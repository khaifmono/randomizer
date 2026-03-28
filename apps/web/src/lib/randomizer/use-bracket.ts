import { useState, useRef, useCallback, useEffect } from "react";
import type { HistoryEntry } from "./types";
import { readStorage, writeStorage } from "./local-storage";

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
  | { phase: "playing"; rounds: Matchup[][]; animatingMatchupId: string | null }
  | { phase: "complete"; winnerId: number; rounds: Matchup[][] };

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
  const clamped = names.slice(0, 16);
  const size = nextPowerOf2(Math.max(clamped.length, 2));
  const numRounds = Math.log2(size);
  const byeCount = size - clamped.length;

  let idCounter = 1;
  const realEntries: BracketEntry[] = clamped.map((name) => ({
    id: idCounter++,
    name,
    isBye: false,
  }));
  shuffle(realEntries);

  const byeEntries: BracketEntry[] = Array.from({ length: byeCount }, () => ({
    id: idCounter++,
    name: "BYE",
    isBye: true,
  }));

  const slotCount = size;
  const slots: (BracketEntry | null)[] = Array(slotCount).fill(null);

  const byeStep = slotCount / Math.max(byeCount, 1);
  let byeIdx = 0;
  const byePositions: number[] = [];
  for (let i = 0; i < byeCount; i++) {
    byePositions.push(Math.round(i * byeStep));
  }
  for (const pos of byePositions) {
    slots[pos] = byeEntries[byeIdx++];
  }

  let realIdx = 0;
  for (let i = 0; i < slotCount; i++) {
    if (slots[i] === null) {
      slots[i] = realEntries[realIdx++];
    }
  }

  const entries = slots as BracketEntry[];

  const round0: Matchup[] = [];
  for (let i = 0; i < size / 2; i++) {
    const top = entries[i * 2];
    const bottom = entries[i * 2 + 1];
    const isBye = top.isBye || bottom.isBye;
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

// A matchup is ready to play if it has both entries, no winner, and isn't a bye
export function isMatchupReady(matchup: Matchup): boolean {
  return (
    !matchup.isBye &&
    matchup.winnerId === null &&
    matchup.topEntry !== null &&
    matchup.bottomEntry !== null
  );
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

function isTournamentComplete(rounds: Matchup[][]): boolean {
  const lastRound = rounds[rounds.length - 1];
  return lastRound[0].winnerId !== null;
}

const STORAGE_KEY = "bracket-state";

type StoredBracketState = {
  entries: string[];
  mode: "random" | "judge";
  bracketState: BracketState;
  history: HistoryEntry[];
};

function useBracket() {
  const stored = readStorage<StoredBracketState | null>(STORAGE_KEY, null);
  const [entries, setEntriesState] = useState<string[]>(stored?.entries ?? []);
  const [mode, setModeState] = useState<"random" | "judge">(stored?.mode ?? "random");
  const [bracketState, setBracketState] = useState<BracketState>(stored?.bracketState ?? { phase: "entry" });
  const [history, setHistory] = useState<HistoryEntry[]>(stored?.history ?? []);

  const pendingWinnersRef = useRef<Map<string, BracketEntry>>(new Map());
  const roundsRef = useRef<Matchup[][]>([]);
  const nextIdRef = useRef(stored?.history?.length ? Math.max(...stored.history.map((h) => h.id)) + 1 : 1);
  const entrantCountRef = useRef(0);
  // Undo stack — stores previous bracket states before each resolve
  const undoStackRef = useRef<Matchup[][][]>([]);

  useEffect(() => {
    writeStorage<StoredBracketState>(STORAGE_KEY, { entries, mode, bracketState, history });
  }, [entries, mode, bracketState, history]);

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
      pendingWinnersRef.current = new Map();

      setBracketState({
        phase: "playing",
        rounds,
        animatingMatchupId: null,
      });

      return currentEntries;
    });
  }, []);

  // Trigger animation on a specific matchup
  const triggerMatchup = useCallback((matchupId: string) => {
    setBracketState((prev) => {
      if (prev.phase !== "playing") return prev;
      if (prev.animatingMatchupId !== null) return prev; // already animating something

      // Find the matchup and verify it's ready
      const matchup = prev.rounds.flat().find((m) => m.id === matchupId);
      if (!matchup || !isMatchupReady(matchup)) return prev;

      // Pre-determine winner for random mode
      setModeState((currentMode) => {
        if (currentMode === "random") {
          const winner = pickRandomWinner(matchup);
          if (winner) {
            pendingWinnersRef.current.set(matchupId, winner);
          }
        }
        return currentMode;
      });

      return { ...prev, animatingMatchupId: matchupId };
    });
  }, []);

  const resolveMatchup = useCallback((matchupId: string, winnerId: number) => {
    setBracketState((prev) => {
      if (prev.phase !== "playing") return prev;

      // Save current state to undo stack
      undoStackRef.current = [...undoStackRef.current, prev.rounds];

      let rounds = prev.rounds.map((round) =>
        round.map((m) =>
          m.id === matchupId ? { ...m, winnerId } : m,
        ),
      );

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

      if (isTournamentComplete(rounds)) {
        const lastRound = rounds[rounds.length - 1];
        const finalWinnerId = lastRound[0].winnerId!;
        const finalWinnerEntry = findWinnerEntry(rounds, finalWinnerId);
        const winnerName = finalWinnerEntry?.name ?? "Unknown";

        const label = `Winner: ${winnerName} (${rounds.length} rounds, ${entrantCountRef.current} entrants)`;
        const entry: HistoryEntry = {
          id: nextIdRef.current++,
          label,
          timestamp: Date.now(),
        };
        setHistory((h) => [entry, ...h]);

        return { phase: "complete", winnerId: finalWinnerId, rounds };
      }

      return {
        phase: "playing",
        rounds,
        animatingMatchupId: null,
      };
    });
  }, []);

  const onAnimationEnd = useCallback((matchupId: string) => {
    const winner = pendingWinnersRef.current.get(matchupId);
    pendingWinnersRef.current.delete(matchupId);

    // Judge mode: no pre-determined winner — just clear animation so user can pick
    if (!winner) {
      setBracketState((prev) => {
        if (prev.phase !== "playing") return prev;
        if (prev.animatingMatchupId !== matchupId) return prev;
        return { ...prev, animatingMatchupId: null };
      });
      return;
    }

    setBracketState((prev) => {
      if (prev.phase !== "playing") return prev;
      if (prev.animatingMatchupId !== matchupId) return prev;

      // Save current state to undo stack
      undoStackRef.current = [...undoStackRef.current, prev.rounds];

      let rounds = prev.rounds.map((round) =>
        round.map((m) =>
          m.id === matchupId ? { ...m, winnerId: winner.id } : m,
        ),
      );

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

      if (isTournamentComplete(rounds)) {
        const lastRound = rounds[rounds.length - 1];
        const finalWinnerId = lastRound[0].winnerId!;
        const finalWinnerEntry = findWinnerEntry(rounds, finalWinnerId);
        const winnerName = finalWinnerEntry?.name ?? "Unknown";

        const label = `Winner: ${winnerName} (${rounds.length} rounds, ${entrantCountRef.current} entrants)`;
        const entry: HistoryEntry = {
          id: nextIdRef.current++,
          label,
          timestamp: Date.now(),
        };
        setHistory((h) => [entry, ...h]);

        return { phase: "complete", winnerId: finalWinnerId, rounds };
      }

      return {
        phase: "playing",
        rounds,
        animatingMatchupId: null,
      };
    });
  }, []);

  const resetBracket = useCallback(() => {
    pendingWinnersRef.current = new Map();
    roundsRef.current = [];
    setBracketState({ phase: "entry" });
    undoStackRef.current = [];
  }, []);

  const undoLastResolve = useCallback(() => {
    const stack = undoStackRef.current;
    if (stack.length === 0) return;
    const previousRounds = stack[stack.length - 1];
    undoStackRef.current = stack.slice(0, -1);

    // If undoing from complete phase, remove the history entry that was just added
    setBracketState((prev) => {
      if (prev.phase === "complete") {
        setHistory((h) => h.slice(1));
      }
      return {
        phase: "playing",
        rounds: previousRounds,
        animatingMatchupId: null,
      };
    });
  }, []);

  const canUndo = bracketState.phase !== "entry" && undoStackRef.current.length > 0;

  return {
    entries,
    mode,
    bracketState,
    history,
    canUndo,
    addEntry,
    setEntries,
    setMode,
    startTournament,
    triggerMatchup,
    resolveMatchup,
    onAnimationEnd,
    resetBracket,
    undoLastResolve,
  };
}

export { useBracket };
