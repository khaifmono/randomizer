import { useState, useRef, useCallback } from "react";
import type { HistoryEntry } from "./types";

// Matches the CSS @keyframes card-flip duration in index.css
export const ANIMATION_DURATION = 800;

const SUITS = ["♠", "♥", "♦", "♣"] as const;
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

type Suit = typeof SUITS[number];
type Rank = typeof RANKS[number];
export type Card = { suit: Suit; rank: Rank };

type Mode = "single" | "hand";

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function cardLabel(card: Card): string {
  return `${card.rank}${card.suit}`;
}

function useCards() {
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [drawnCards, setDrawnCards] = useState<Card[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mode, setModeState] = useState<Mode>("single");
  const [handSize, setHandSizeState] = useState(5);

  // Synchronous guard — prevents double-trigger during animation
  const isDrawingRef = useRef(false);
  // Pre-determined drawn cards stable during animation
  const pendingDrawnRef = useRef<Card[]>([]);
  // Remaining deck ref for synchronous depletion in onDrawEnd
  const deckRef = useRef<Card[]>(deck);
  const nextIdRef = useRef(1);

  const drawCards = useCallback(() => {
    if (isDrawingRef.current) return;
    isDrawingRef.current = true;

    const currentDeck = deckRef.current;
    const drawCount = mode === "single" ? 1 : handSize;
    const actualCount = Math.min(drawCount, currentDeck.length);
    const drawn = currentDeck.slice(0, actualCount);

    pendingDrawnRef.current = drawn;
    setDrawnCards(drawn);
    setIsDrawing(true);
  }, [mode, handSize]);

  const onDrawEnd = useCallback(() => {
    const drawn = pendingDrawnRef.current;

    // Deplete deck
    const newDeck = deckRef.current.slice(drawn.length);
    deckRef.current = newDeck;
    setDeck(newDeck);

    // Append history entry
    const label = drawn.map(cardLabel).join(" ");
    const entry: HistoryEntry = {
      id: nextIdRef.current++,
      label,
      timestamp: Date.now(),
    };
    setHistory((prev) => [entry, ...prev]);

    // Brief settle delay after animation completes
    setTimeout(() => {
      isDrawingRef.current = false;
      setIsDrawing(false);
    }, 200);
  }, []);

  const reshuffle = useCallback(() => {
    const newDeck = buildDeck();
    deckRef.current = newDeck;
    setDeck(newDeck);
    setDrawnCards([]);
  }, []);

  const setMode = useCallback((newMode: Mode) => {
    if (isDrawingRef.current) return;
    setModeState(newMode);
  }, []);

  const setHandSize = useCallback((n: number) => {
    if (isDrawingRef.current) return;
    if (n < 1 || n > 5) return;
    setHandSizeState(n);
  }, []);

  return {
    deck,
    drawnCards,
    isDrawing,
    history,
    mode,
    handSize,
    remainingCount: deck.length,
    drawCards,
    onDrawEnd,
    reshuffle,
    setMode,
    setHandSize,
  };
}

export { useCards };
