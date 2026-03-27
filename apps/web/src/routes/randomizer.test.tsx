import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock TanStack Router to avoid router context errors in test
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (opts: { component: unknown }) => ({
    component: opts.component,
  }),
  useSearch: () => ({ tab: "wheel" }),
  Link: ({ children, ...props }: { children: React.ReactNode; to?: string }) => <a {...props}>{children}</a>,
}));

// Mock motion animate function (used by WheelCanvas)
vi.mock("motion", () => ({
  animate: vi.fn(() => ({ stop: vi.fn() })),
}));

// Mock ResizeObserver (used by WheelCanvas useEffect)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock canvas getContext (used by WheelCanvas)
HTMLCanvasElement.prototype.getContext = vi.fn((_contextId: string) => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  arc: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  set fillStyle(_: string) {},
  set strokeStyle(_: string) {},
  set lineWidth(_: number) {},
  set font(_: string) {},
  set textAlign(_: string) {},
  set textBaseline(_: string) {},
  measureText: vi.fn(() => ({ width: 50 })),
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// RandomizerPage is exported as a named export from randomizer.tsx
import { RandomizerPage } from "./randomizer";

describe("RandomizerPage", () => {
  it("renders page title with 'Randomizer' text", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("Randomizer")).toBeDefined();
  });

  it("renders 'Toolkit' in the header", () => {
    render(<RandomizerPage />);
    expect(screen.getByText(/Toolkit/)).toBeDefined();
  });

  it("renders three tab triggers: Wheel, Dice, Coin", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("Wheel")).toBeDefined();
    expect(screen.getByText("Dice")).toBeDefined();
    expect(screen.getByText("Coin")).toBeDefined();
  });

  it("Wheel tab shows item management UI with default items", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("Option 1")).toBeDefined();
  });

  it("renders 'History' in the page", () => {
    render(<RandomizerPage />);
    expect(screen.getAllByText("History").length).toBeGreaterThan(0);
  });

  it("renders 'No results yet' in the history panel initially", () => {
    render(<RandomizerPage />);
    expect(screen.getByText("No results yet")).toBeDefined();
  });
});
