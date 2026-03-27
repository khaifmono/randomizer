import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WheelTab } from "./wheel-tab";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

const defaultWheelState = {
  items: ["A", "B", "C"],
  liveItems: ["A", "B", "C"],
  spinning: false,
  winner: null as string | null,
  winnerIndex: null as number | null,
  history: [] as HistoryEntry[],
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

  it("shows item count badge when items exist", () => {
    mockUseWheel.mockReturnValue({
      ...defaultWheelState,
      liveItems: ["A", "B", "C"],
    });
    render(<WheelTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("3 items remaining")).toBeInTheDocument();
  });

  it("hides badge when no items remain", () => {
    mockUseWheel.mockReturnValue({
      ...defaultWheelState,
      liveItems: [],
      hasRemovedItems: false,
    });
    render(<WheelTab onHistoryChange={vi.fn()} />);
    expect(screen.queryByText(/remaining/)).not.toBeInTheDocument();
  });

  it("shows empty celebration when all items drawn via spinning", () => {
    mockUseWheel.mockReturnValue({
      ...defaultWheelState,
      liveItems: [],
      hasRemovedItems: true,
    });
    render(<WheelTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("All done!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset wheel/i })).toBeInTheDocument();
  });

  it("does NOT show celebration when items manually deleted", () => {
    mockUseWheel.mockReturnValue({
      ...defaultWheelState,
      liveItems: [],
      hasRemovedItems: false,
    });
    render(<WheelTab onHistoryChange={vi.fn()} />);
    expect(screen.queryByText("All done!")).not.toBeInTheDocument();
  });
});
