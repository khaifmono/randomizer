import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BracketMatch } from "./bracket-match";
import type { Matchup } from "@base-project/web/lib/randomizer/use-bracket";

vi.mock("@base-project/web/lib/randomizer/use-bracket", () => ({
  isMatchupReady: (m: { winnerId: unknown; topEntry: unknown; bottomEntry: unknown; isBye: boolean }) =>
    !m.isBye && m.winnerId === null && m.topEntry !== null && m.bottomEntry !== null,
}));

const readyMatchup: Matchup = {
  id: "r0-m0",
  topEntry: { id: 1, name: "Alice", isBye: false },
  bottomEntry: { id: 2, name: "Bob", isBye: false },
  winnerId: null,
  isBye: false,
};

describe("BracketMatch — Judge mode (single click)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("clicking option in judge mode directly calls onResolve (no animation step needed)", () => {
    const onResolve = vi.fn();

    render(
      <BracketMatch
        matchup={readyMatchup}
        isAnimating={false}
        mode="judge"
        onTrigger={vi.fn()}
        onResolve={onResolve}
        onAnimationEnd={vi.fn()}
      />,
    );

    // Single click on Alice picks her as winner
    act(() => {
      screen.getByText("Alice").click();
    });

    expect(onResolve).toHaveBeenCalledWith("r0-m0", 1);
  });

  it("option boxes have hover classes in judge mode when matchup is ready", () => {
    render(
      <BracketMatch
        matchup={readyMatchup}
        isAnimating={false}
        mode="judge"
        onTrigger={vi.fn()}
        onResolve={vi.fn()}
        onAnimationEnd={vi.fn()}
      />,
    );

    const aliceBox = screen.getByText("Alice").closest(".bracket-option")!;
    expect(aliceBox.className).toContain("hover:bg-bracket-accent");
    expect(aliceBox.className).toContain("cursor-pointer");
  });

  it("resolved matchup shows winner with accent and loser with strikethrough", () => {
    const resolvedMatchup: Matchup = {
      ...readyMatchup,
      winnerId: 1,
    };

    render(
      <BracketMatch
        matchup={resolvedMatchup}
        isAnimating={false}
        mode="judge"
        onTrigger={vi.fn()}
        onResolve={vi.fn()}
        onAnimationEnd={vi.fn()}
      />,
    );

    const aliceBox = screen.getByText("Alice").closest(".bracket-option")!;
    const bobBox = screen.getByText("Bob").closest(".bracket-option")!;

    expect(aliceBox.className).toContain("bg-bracket-accent");
    expect(aliceBox.className).toContain("font-bold");
    expect(bobBox.className).toContain("line-through");
  });

  it("random mode clicking card calls onTrigger (not onResolve)", () => {
    const onTrigger = vi.fn();
    const onResolve = vi.fn();

    render(
      <BracketMatch
        matchup={readyMatchup}
        isAnimating={false}
        mode="random"
        onTrigger={onTrigger}
        onResolve={onResolve}
        onAnimationEnd={vi.fn()}
      />,
    );

    act(() => {
      screen.getByText("Alice").click();
    });

    expect(onTrigger).toHaveBeenCalledWith("r0-m0");
    expect(onResolve).not.toHaveBeenCalled();
  });
});
