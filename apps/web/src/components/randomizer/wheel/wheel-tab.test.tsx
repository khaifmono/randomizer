import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WheelTab } from "./wheel-tab";

const defaultWheelState = {
  items: ["A", "B", "C"],
  liveItems: ["A", "B", "C"],
  spinning: false,
  winner: null,
  winnerIndex: null,
  history: [],
  addItem: vi.fn(),
  addBulk: vi.fn(),
  removeItem: vi.fn(),
  reset: vi.fn(),
  startSpin: vi.fn(),
  onSpinEnd: vi.fn(),
  hasRemovedItems: false,
};

const mockUseWheel = vi.hoisted(() => vi.fn(() => defaultWheelState));

vi.mock("@base-project/web/lib/randomizer/use-wheel", () => ({
  useWheel: mockUseWheel,
}));

vi.mock("./wheel-canvas", () => ({
  WheelCanvas: () => <div data-testid="wheel-canvas" />,
}));

describe("WheelTab", () => {
  beforeEach(() => {
    mockUseWheel.mockReturnValue(defaultWheelState);
  });

  it("renders WheelCanvas", () => {
    render(<WheelTab onHistoryChange={vi.fn()} />);
    expect(screen.getByTestId("wheel-canvas")).toBeInTheDocument();
  });

  it("renders Spin button text", () => {
    render(<WheelTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /spin/i })).toBeInTheDocument();
  });

  it("renders item management input placeholder", () => {
    render(<WheelTab onHistoryChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Enter an item...")).toBeInTheDocument();
  });

  it("calls onHistoryChange when history changes", () => {
    const mockHistory = [{ id: 1, label: "A", timestamp: 1000 }];
    mockUseWheel.mockReturnValueOnce({
      ...defaultWheelState,
      history: mockHistory,
    });
    const onHistoryChange = vi.fn();
    render(<WheelTab onHistoryChange={onHistoryChange} />);
    expect(onHistoryChange).toHaveBeenCalledWith(mockHistory);
  });
});
