import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCards, ANIMATION_DURATION } from "./use-cards";

describe("useCards", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("initializes with a full 52-card deck", () => {
      const { result } = renderHook(() => useCards());
      expect(result.current.deck.length).toBe(52);
    });

    it("deck has no duplicate cards", () => {
      const { result } = renderHook(() => useCards());
      const labels = result.current.deck.map((c) => `${c.rank}${c.suit}`);
      const unique = new Set(labels);
      expect(unique.size).toBe(52);
    });

    it("initializes with isDrawing=false", () => {
      const { result } = renderHook(() => useCards());
      expect(result.current.isDrawing).toBe(false);
    });

    it("initializes with empty history", () => {
      const { result } = renderHook(() => useCards());
      expect(result.current.history).toHaveLength(0);
    });

    it("initializes with empty drawnCards", () => {
      const { result } = renderHook(() => useCards());
      expect(result.current.drawnCards).toHaveLength(0);
    });

    it("initializes with mode 'single'", () => {
      const { result } = renderHook(() => useCards());
      expect(result.current.mode).toBe("single");
    });

    it("initializes with handSize 5", () => {
      const { result } = renderHook(() => useCards());
      expect(result.current.handSize).toBe(5);
    });

    it("remainingCount equals 52 initially", () => {
      const { result } = renderHook(() => useCards());
      expect(result.current.remainingCount).toBe(52);
    });
  });

  describe("ANIMATION_DURATION constant", () => {
    it("exports ANIMATION_DURATION as 800", () => {
      expect(ANIMATION_DURATION).toBe(800);
    });
  });

  describe("drawCards()", () => {
    it("draws exactly 1 card in single mode", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      expect(result.current.drawnCards).toHaveLength(1);
    });

    it("sets isDrawing=true after drawCards()", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      expect(result.current.isDrawing).toBe(true);
    });

    it("draws exactly handSize cards in hand mode", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.setMode("hand");
      });
      act(() => {
        result.current.drawCards();
      });
      expect(result.current.drawnCards).toHaveLength(5);
    });

    it("draws only remaining cards when fewer than requested", () => {
      const { result } = renderHook(() => useCards());
      // Deplete deck to 2 cards by drawing single + onDrawEnd repeatedly
      act(() => {
        result.current.setMode("hand");
        result.current.setHandSize(5);
      });
      // Draw 10 hands = 50 cards, leaving 2
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.drawCards();
        });
        act(() => {
          result.current.onDrawEnd();
          vi.runAllTimers();
        });
      }
      expect(result.current.remainingCount).toBe(2);
      act(() => {
        result.current.drawCards();
      });
      // drawnCards should be 2 (all remaining)
      expect(result.current.drawnCards).toHaveLength(2);
    });

    it("is a no-op when isDrawing is true (guard)", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      const drawnAfterFirst = result.current.drawnCards;
      act(() => {
        result.current.drawCards();
      });
      // Should still be the same drawn cards
      expect(result.current.drawnCards).toBe(drawnAfterFirst);
    });
  });

  describe("onDrawEnd()", () => {
    it("reduces deck.length by drawn count", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      act(() => {
        result.current.onDrawEnd();
        vi.runAllTimers();
      });
      expect(result.current.deck.length).toBe(51);
    });

    it("appends a history entry with correct label format", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      const drawn = result.current.drawnCards;
      const expectedLabel = drawn.map((c) => `${c.rank}${c.suit}`).join(" ");
      act(() => {
        result.current.onDrawEnd();
        vi.runAllTimers();
      });
      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].label).toBe(expectedLabel);
    });

    it("sets isDrawing=false after 200ms settle delay", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      expect(result.current.isDrawing).toBe(true);
      act(() => {
        result.current.onDrawEnd();
      });
      // Before 200ms timer fires, isDrawing may still be true (guard clears async)
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current.isDrawing).toBe(false);
    });

    it("updates remainingCount after draw", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      act(() => {
        result.current.onDrawEnd();
        vi.runAllTimers();
      });
      expect(result.current.remainingCount).toBe(51);
    });
  });

  describe("reshuffle()", () => {
    it("restores deck to 52 cards", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      act(() => {
        result.current.onDrawEnd();
        vi.runAllTimers();
      });
      act(() => {
        result.current.reshuffle();
      });
      expect(result.current.deck.length).toBe(52);
    });

    it("clears drawnCards", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      act(() => {
        result.current.onDrawEnd();
        vi.runAllTimers();
      });
      act(() => {
        result.current.reshuffle();
      });
      expect(result.current.drawnCards).toHaveLength(0);
    });

    it("drawing until empty then reshuffle restores 52 cards", () => {
      const { result } = renderHook(() => useCards());
      // Draw all 52 single cards
      for (let i = 0; i < 52; i++) {
        act(() => {
          result.current.drawCards();
        });
        act(() => {
          result.current.onDrawEnd();
          vi.runAllTimers();
        });
      }
      expect(result.current.remainingCount).toBe(0);
      act(() => {
        result.current.reshuffle();
      });
      expect(result.current.remainingCount).toBe(52);
    });
  });

  describe("setMode()", () => {
    it("updates mode to 'hand'", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.setMode("hand");
      });
      expect(result.current.mode).toBe("hand");
    });

    it("is a no-op when isDrawing", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      act(() => {
        result.current.setMode("hand");
      });
      expect(result.current.mode).toBe("single");
    });
  });

  describe("setHandSize()", () => {
    it("updates handSize to valid value", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.setHandSize(3);
      });
      expect(result.current.handSize).toBe(3);
    });

    it("is a no-op for value 0 (< 1)", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.setHandSize(0);
      });
      expect(result.current.handSize).toBe(5);
    });

    it("is a no-op for value 6 (> 5)", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.setHandSize(6);
      });
      expect(result.current.handSize).toBe(5);
    });

    it("is a no-op when isDrawing", () => {
      const { result } = renderHook(() => useCards());
      act(() => {
        result.current.drawCards();
      });
      act(() => {
        result.current.setHandSize(2);
      });
      expect(result.current.handSize).toBe(5);
    });
  });
});
