import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CoinTab } from "./coin-tab";

const defaultCoinState = {
  count: 1,
  flipping: false,
  results: ["heads" as const],
  tally: { heads: 1, tails: 0 },
  history: [],
  setCount: vi.fn(),
  startFlip: vi.fn(),
  onFlipEnd: vi.fn(),
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

  it("renders stepper Minus and Plus buttons", () => {
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /decrease coin count/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /increase coin count/i })).toBeInTheDocument();
  });

  it("displays tally when tally is set and not flipping", () => {
    render(<CoinTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("1 Heads, 0 Tails")).toBeInTheDocument();
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
});
