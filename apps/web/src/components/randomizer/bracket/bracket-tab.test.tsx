import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BracketTab } from "./bracket-tab";

const defaultBracketState = {
  entries: [] as string[],
  mode: "random" as const,
  bracketState: { phase: "entry" as const },
  history: [] as { id: number; label: string; timestamp: number }[],
  addEntry: vi.fn(),
  setEntries: vi.fn(),
  setMode: vi.fn(),
  startTournament: vi.fn(),
  resolveMatchup: vi.fn(),
  onAnimationEnd: vi.fn(),
  resetBracket: vi.fn(),
};

const mockUseBracket = vi.hoisted(() => vi.fn(() => defaultBracketState));

vi.mock("@base-project/web/lib/randomizer/use-bracket", () => ({
  useBracket: mockUseBracket,
  ANIMATION_DURATION: 1200,
}));

describe("BracketTab", () => {
  beforeEach(() => {
    mockUseBracket.mockReturnValue({ ...defaultBracketState });
  });

  it("renders Start Tournament button in entry phase", () => {
    render(<BracketTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /start tournament/i })).toBeInTheDocument();
  });

  it("Start Tournament button is disabled when entries.length < 2", () => {
    mockUseBracket.mockReturnValue({ ...defaultBracketState, entries: [] });
    render(<BracketTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /start tournament/i })).toBeDisabled();
  });

  it("Start Tournament button is enabled when entries.length >= 2", () => {
    mockUseBracket.mockReturnValue({ ...defaultBracketState, entries: ["Alice", "Bob"] });
    render(<BracketTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /start tournament/i })).not.toBeDisabled();
  });

  it("renders mode toggle buttons (Random / Judge)", () => {
    render(<BracketTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /^random$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^judge$/i })).toBeInTheDocument();
  });

  it("calls onHistoryChange when history updates", () => {
    const mockHistory = [{ id: 1, label: "Winner: Alice (2 rounds, 4 entrants)", timestamp: 1000 }];
    mockUseBracket.mockReturnValue({ ...defaultBracketState, history: mockHistory });
    const onHistoryChange = vi.fn();
    render(<BracketTab onHistoryChange={onHistoryChange} />);
    expect(onHistoryChange).toHaveBeenCalledWith(mockHistory);
  });

  it("shows bracket display when phase=playing", () => {
    mockUseBracket.mockReturnValue({
      ...defaultBracketState,
      bracketState: {
        phase: "playing" as const,
        rounds: [
          [
            {
              id: "r0-m0",
              topEntry: { id: 1, name: "Alice", isBye: false },
              bottomEntry: { id: 2, name: "Bob", isBye: false },
              winnerId: null,
              isBye: false,
            },
          ],
        ],
        activeMatchupId: "r0-m0",
        animating: false,
      },
    });
    render(<BracketTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    // Start Tournament button should not be visible in playing phase
    expect(screen.queryByRole("button", { name: /start tournament/i })).not.toBeInTheDocument();
  });

  it("shows winner name when phase=complete", () => {
    mockUseBracket.mockReturnValue({
      ...defaultBracketState,
      entries: ["Alice", "Bob"],
      bracketState: {
        phase: "complete" as const,
        winnerId: 1,
      },
    });
    render(<BracketTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /new tournament/i })).toBeInTheDocument();
  });
});
