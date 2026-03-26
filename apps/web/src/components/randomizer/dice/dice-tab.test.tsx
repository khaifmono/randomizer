import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DiceTab } from "./dice-tab";

const defaultDiceState = {
  count: 2,
  rolling: false,
  results: [3, 5],
  sum: 8,
  history: [],
  setCount: vi.fn(),
  startRoll: vi.fn(),
  onRollEnd: vi.fn(),
};

const mockUseDice = vi.hoisted(() => vi.fn(() => defaultDiceState));

vi.mock("@base-project/web/lib/randomizer/use-dice", () => ({
  useDice: mockUseDice,
  ANIMATION_DURATION: 1200,
}));

describe("DiceTab", () => {
  beforeEach(() => {
    mockUseDice.mockReturnValue(defaultDiceState);
  });

  it("renders Roll button", () => {
    render(<DiceTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /roll/i })).toBeInTheDocument();
  });

  it("renders stepper Minus and Plus buttons", () => {
    render(<DiceTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /decrease dice count/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /increase dice count/i })).toBeInTheDocument();
  });

  it("displays Total when sum is set and not rolling", () => {
    render(<DiceTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("Total: 8")).toBeInTheDocument();
  });

  it("does not display Total when rolling is true", () => {
    mockUseDice.mockReturnValue({ ...defaultDiceState, rolling: true, sum: 8 });
    render(<DiceTab onHistoryChange={vi.fn()} />);
    expect(screen.queryByText(/total/i)).not.toBeInTheDocument();
  });

  it("does not display Total when sum is null", () => {
    mockUseDice.mockReturnValue({ ...defaultDiceState, sum: null });
    render(<DiceTab onHistoryChange={vi.fn()} />);
    expect(screen.queryByText(/total/i)).not.toBeInTheDocument();
  });

  it("calls onHistoryChange when history updates", () => {
    const mockHistory = [{ id: 1, label: "3+5=8", timestamp: 1000 }];
    mockUseDice.mockReturnValue({ ...defaultDiceState, history: mockHistory });
    const onHistoryChange = vi.fn();
    render(<DiceTab onHistoryChange={onHistoryChange} />);
    expect(onHistoryChange).toHaveBeenCalledWith(mockHistory);
  });
});
