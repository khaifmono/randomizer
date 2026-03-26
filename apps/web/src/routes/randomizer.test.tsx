import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock TanStack Router's createFileRoute to avoid router context errors in test
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (opts: { component: unknown }) => ({
    component: opts.component,
  }),
}));

// Import the page component after mocking
// We need to access the inner component for testing
const { RandomizerPage } = await import("./randomizer");

describe("RandomizerPage", () => {
  it("renders page title 'Randomizer Toolkit'", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("Randomizer Toolkit")).toBeDefined();
  });

  it("renders page tagline 'Spin, roll, or flip — decide anything.'", () => {
    render(<RandomizerPage />);
    expect(screen.getByText(/Spin, roll, or flip/)).toBeDefined();
  });

  it("renders three tab triggers: Wheel, Dice, Coin", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("Wheel")).toBeDefined();
    expect(screen.getByText("Dice")).toBeDefined();
    expect(screen.getByText("Coin")).toBeDefined();
  });

  it("Wheel tab content shows placeholder text 'Add items to spin the wheel'", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("Add items to spin the wheel")).toBeDefined();
  });

  it("renders 'History' heading in the history panel", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("History")).toBeDefined();
  });

  it("renders 'No results yet' in the history panel initially", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("No results yet")).toBeDefined();
  });
});
