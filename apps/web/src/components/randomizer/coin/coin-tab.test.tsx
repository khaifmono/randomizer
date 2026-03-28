import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CoinTab } from "./coin-tab";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

const defaultCoinState = {
  count: 1,
  flipping: false,
  results: ["heads" as const],
  tally: { heads: 1, tails: 0 } as { heads: number; tails: number } | null,
  history: [] as HistoryEntry[],
  sessionHeads: 0,
  sessionTails: 0,
  setCount: vi.fn(),
  startFlip: vi.fn(),
  onFlipEnd: vi.fn(),
  clearSession: vi.fn(),
};

const mockUseCoin = vi.hoisted(() => vi.fn(() => defaultCoinState));

vi.mock("@base-project/web/lib/randomizer/use-coin", () => ({
  useCoin: mockUseCoin,
  ANIMATION_DURATION: 1200,
}));

describe("CoinTab", () => {
  beforeEach(() => {
    mockUseCoin.mockReturnValue(defaultCoinState);
  });

  it("renders Flip button", () => {
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /flip/i })).toBeInTheDocument();
  });

  it("renders coin count selector buttons", () => {
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
  });

  it("displays tally when tally is set and not flipping", () => {
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("Heads")).toBeInTheDocument();
    expect(screen.getByText("Tails")).toBeInTheDocument();
  });

  it("does not display tally when flipping is true", () => {
    mockUseCoin.mockReturnValue({ ...defaultCoinState, flipping: true, tally: { heads: 1, tails: 0 } });
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.queryByText(/heads/i)).not.toBeInTheDocument();
  });

  it("does not display tally when tally is null", () => {
    mockUseCoin.mockReturnValue({ ...defaultCoinState, tally: null });
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.queryByText(/heads/i)).not.toBeInTheDocument();
  });

  it("calls onHistoryChange when history updates", () => {
    const mockHistory = [{ id: 1, label: "1H 0T (1 coins)", timestamp: 1000 }];
    mockUseCoin.mockReturnValue({ ...defaultCoinState, history: mockHistory });
    const onHistoryChange = vi.fn();
    render(<CoinTab onHistoryChange={onHistoryChange} />);
    expect(onHistoryChange).toHaveBeenCalledWith(mockHistory);
  });

  it("shows session tally after flips", () => {
    mockUseCoin.mockReturnValue({ ...defaultCoinState, sessionHeads: 5, sessionTails: 3 });
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.getByTestId("session-tally")).toBeInTheDocument();
    expect(screen.getByText("5H")).toBeInTheDocument();
    expect(screen.getByText("3T")).toBeInTheDocument();
  });

  it("hides session tally when no flips have occurred", () => {
    mockUseCoin.mockReturnValue({ ...defaultCoinState, sessionHeads: 0, sessionTails: 0 });
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.queryByTestId("session-tally")).not.toBeInTheDocument();
    expect(screen.queryByText(/across/)).not.toBeInTheDocument();
  });
});
