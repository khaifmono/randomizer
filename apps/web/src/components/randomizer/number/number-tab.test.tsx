import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NumberTab } from "./number-tab";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

const defaultNumberState = {
  min: 1,
  max: 100,
  rolling: false,
  result: 42,
  digits: [4, 2],
  history: [] as HistoryEntry[],
  setRange: vi.fn(),
  startRoll: vi.fn(),
  onRollEnd: vi.fn(),
};

const mockUseNumber = vi.hoisted(() => vi.fn(() => defaultNumberState));

vi.mock("@base-project/web/lib/randomizer/use-number", () => ({
  useNumber: mockUseNumber,
  REEL_STAGGER_MS: 200,
  BASE_REEL_DURATION_MS: 1000,
}));

describe("NumberTab", () => {
  beforeEach(() => {
    mockUseNumber.mockReturnValue(defaultNumberState);
  });

  it("renders Pull the Lever button", () => {
    render(<NumberTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /pull the lever/i })).toBeInTheDocument();
  });

  it("renders preset pills (1-10, 1-100, 1-1000)", () => {
    render(<NumberTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "1-10" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1-100" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1-1000" })).toBeInTheDocument();
  });

  it("displays result number when not rolling and result is set", () => {
    // result=42, rolling=false, digits=[4,2] — should show result view
    render(<NumberTab onHistoryChange={vi.fn()} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("does not display result when rolling is true", () => {
    mockUseNumber.mockReturnValue({ ...defaultNumberState, rolling: true, result: 42, digits: [4, 2] });
    render(<NumberTab onHistoryChange={vi.fn()} />);
    // During rolling the reel animation is shown, not the static result paragraph
    expect(screen.queryByText("42")).not.toBeInTheDocument();
  });

  it("calls onHistoryChange when history updates", () => {
    const mockHistory = [{ id: 1, label: "42 (1-100)", timestamp: 1000 }];
    mockUseNumber.mockReturnValue({ ...defaultNumberState, history: mockHistory });
    const onHistoryChange = vi.fn();
    render(<NumberTab onHistoryChange={onHistoryChange} />);
    expect(onHistoryChange).toHaveBeenCalledWith(mockHistory);
  });
});
