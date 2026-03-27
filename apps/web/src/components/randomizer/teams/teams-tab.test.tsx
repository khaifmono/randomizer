import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TeamsTab } from "./teams-tab";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import type { ShuffleResult } from "@base-project/web/lib/randomizer/use-teams";

const defaultTeamsState = {
  names: [] as string[],
  mode: "split" as const,
  teamCount: 2,
  shuffling: false,
  result: null as ShuffleResult | null,
  history: [] as HistoryEntry[],
  setNames: vi.fn(),
  setMode: vi.fn(),
  setTeamCount: vi.fn(),
  startShuffle: vi.fn(),
  onShuffleEnd: vi.fn(),
};

const mockUseTeams = vi.hoisted(() => vi.fn(() => defaultTeamsState));

vi.mock("@base-project/web/lib/randomizer/use-teams", () => ({
  useTeams: mockUseTeams,
  ANIMATION_DURATION: 800,
}));

describe("TeamsTab", () => {
  beforeEach(() => {
    mockUseTeams.mockReturnValue(defaultTeamsState);
  });

  it("renders Shuffle button", () => {
    render(<TeamsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /shuffle/i })).toBeInTheDocument();
  });

  it("renders mode toggle buttons (Pick One, Split Teams)", () => {
    render(<TeamsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /pick one/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /split teams/i })).toBeInTheDocument();
  });

  it("renders textarea for names", () => {
    render(<TeamsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/one name per line/i)).toBeInTheDocument();
  });

  it("Shuffle button is disabled when nameCount === 0 (no names entered)", () => {
    mockUseTeams.mockReturnValue({ ...defaultTeamsState, names: [] });
    render(<TeamsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /shuffle/i })).toBeDisabled();
  });

  it("Shuffle button is disabled when shuffling === true", () => {
    mockUseTeams.mockReturnValue({ ...defaultTeamsState, names: ["Alice"], shuffling: true });
    render(<TeamsTab onHistoryChange={vi.fn()} />);
    // When shuffling, button text changes to "Shuffling..." — check it's disabled
    const shufflingBtn = screen.getByRole("button", { name: /shuffling/i });
    expect(shufflingBtn).toBeDisabled();
  });

  it("displays picked-result when result.mode='pick-one' and not shuffling", () => {
    mockUseTeams.mockReturnValue({
      ...defaultTeamsState,
      names: ["Alice"],
      shuffling: false,
      result: { mode: "pick-one" as const, picked: "Alice" },
    });
    render(<TeamsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByTestId("picked-result")).toBeInTheDocument();
    expect(screen.getByTestId("picked-result").textContent).toBe("Alice");
  });

  it("displays split-result when result.mode='split' and not shuffling", () => {
    mockUseTeams.mockReturnValue({
      ...defaultTeamsState,
      names: ["Alice", "Bob"],
      shuffling: false,
      result: { mode: "split" as const, teams: [["Alice"], ["Bob"]] },
    });
    render(<TeamsTab onHistoryChange={vi.fn()} />);
    expect(screen.getByTestId("split-result")).toBeInTheDocument();
  });

  it("calls onHistoryChange when history updates", () => {
    const mockHistory = [{ id: 1, label: "Picked: Alice", timestamp: 1000 }];
    mockUseTeams.mockReturnValue({ ...defaultTeamsState, history: mockHistory });
    const onHistoryChange = vi.fn();
    render(<TeamsTab onHistoryChange={onHistoryChange} />);
    expect(onHistoryChange).toHaveBeenCalledWith(mockHistory);
  });

  it("does not show result while shuffling", () => {
    mockUseTeams.mockReturnValue({
      ...defaultTeamsState,
      names: ["Alice"],
      shuffling: true,
      result: { mode: "pick-one" as const, picked: "Alice" },
    });
    render(<TeamsTab onHistoryChange={vi.fn()} />);
    expect(screen.queryByTestId("picked-result")).not.toBeInTheDocument();
    expect(screen.queryByTestId("split-result")).not.toBeInTheDocument();
  });
});
