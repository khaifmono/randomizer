import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DiceTab } from "./dice-tab";
import { DieCube } from "./die-cube";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

const defaultDiceState = {
  count: 2,
  rolling: false,
  results: [3, 5],
  sum: 8 as number | null,
  history: [] as HistoryEntry[],
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

  it("renders dice count selector buttons (1-6)", () => {
    render(<DiceTab onHistoryChange={vi.fn()} />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByRole("button", { name: String(i) })).toBeInTheDocument();
    }
  });

  it("displays Total when sum is set and not rolling", () => {
    render(<DiceTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
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

describe("DieCube", () => {
  it("pip dots use dice-accent color class", () => {
    const { container } = render(<DieCube value={6} rolling={false} />);
    const roundedDots = container.querySelectorAll(".rounded-full");
    const accentDots = container.querySelectorAll(".bg-dice-accent");
    // Should have at least one pip dot with the dice-accent class
    expect(accentDots.length).toBeGreaterThan(0);
    // Should NOT have any pips using bg-neutral-900
    const neutralDots = container.querySelectorAll(".bg-neutral-900");
    expect(neutralDots.length).toBe(0);
    // roundedDots sanity check: all rounded-full elements should be accented
    expect(roundedDots.length).toBe(accentDots.length);
  });
});
