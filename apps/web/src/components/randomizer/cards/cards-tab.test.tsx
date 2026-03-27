import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CardsTab } from "./cards-tab";

const defaultCardsState = {
  deck: Array(52).fill(null).map((_, i) => ({ suit: "♠" as const, rank: String(i + 1) as never })),
  drawnCards: [] as { suit: "♠" | "♥" | "♦" | "♣"; rank: "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" }[],
  isDrawing: false,
  mode: "single" as const,
  handSize: 5,
  history: [] as { id: number; label: string; timestamp: number }[],
  remainingCount: 52,
  drawCards: vi.fn(),
  onDrawEnd: vi.fn(),
  reshuffle: vi.fn(),
  setMode: vi.fn(),
  setHandSize: vi.fn(),
};

const mockUseCards = vi.hoisted(() => vi.fn(() => defaultCardsState));

vi.mock("@base-project/web/lib/randomizer/use-cards", () => ({
  useCards: mockUseCards,
  ANIMATION_DURATION: 800,
}));

describe("CardsTab", () => {
  beforeEach(() => {
    mockUseCards.mockReturnValue(defaultCardsState);
  });

  it("renders Draw button", () => {
    render(<CardsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /draw card/i })).toBeInTheDocument();
  });

  it("renders Reshuffle button", () => {
    render(<CardsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /reshuffle/i })).toBeInTheDocument();
  });

  it("renders remaining count badge showing 52 remaining", () => {
    render(<CardsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByTestId("remaining-count")).toHaveTextContent("52 remaining");
  });

  it("Draw button is disabled when isDrawing=true", () => {
    mockUseCards.mockReturnValue({ ...defaultCardsState, isDrawing: true });
    render(<CardsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /drawing/i })).toBeDisabled();
  });

  it("calls onHistoryChange when history updates", () => {
    const mockHistory = [{ id: 1, label: "A♠", timestamp: 1000 }];
    mockUseCards.mockReturnValue({ ...defaultCardsState, history: mockHistory });
    const onHistoryChange = vi.fn();
    render(<CardsTab onHistoryChange={onHistoryChange} />);
    expect(onHistoryChange).toHaveBeenCalledWith(mockHistory);
  });

  it("does not show drawn cards area when drawnCards is empty", () => {
    render(<CardsTab onHistoryChange={vi.fn()} />);
    // No card faces should be rendered when drawnCards is empty
    expect(screen.queryByTestId("card-display")).not.toBeInTheDocument();
    // Also verify no card-scene divs present
    const container = document.querySelector(".card-scene");
    expect(container).not.toBeInTheDocument();
  });

  it("shows drawn cards when drawnCards has items", () => {
    mockUseCards.mockReturnValue({
      ...defaultCardsState,
      drawnCards: [{ suit: "♠" as const, rank: "A" as const }],
    });
    render(<CardsTab onHistoryChange={vi.fn()} />);
    const cardScene = document.querySelector(".card-scene");
    expect(cardScene).toBeInTheDocument();
  });

  it("renders mode toggle buttons (Single / Hand)", () => {
    render(<CardsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /^single$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^hand$/i })).toBeInTheDocument();
  });

  it("hides hand size stepper in single mode", () => {
    render(<CardsTab onHistoryChange={vi.fn()} />);
    // stepper buttons only appear when mode=hand
    expect(screen.queryByRole("button", { name: /decrease hand size/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /increase hand size/i })).not.toBeInTheDocument();
  });
});
