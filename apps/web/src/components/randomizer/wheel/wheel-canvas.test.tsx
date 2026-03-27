import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WheelCanvas } from "./wheel-canvas";

// Mock the motion animate function
vi.mock("motion", () => ({
  animate: vi.fn(() => ({ stop: vi.fn() })),
}));

// Mock canvas getContext to prevent jsdom errors
// eslint-disable-next-line ts/no-explicit-any
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
  set shadowColor(_: string) {},
  set shadowBlur(_: number) {},
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const defaultProps = {
  items: ["Pizza", "Burger"],
  spinning: false,
  winnerIndex: null,
  winner: null,
  onSpin: vi.fn(),
  onSpinEnd: vi.fn(),
};

describe("WheelCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Renders canvas element
  it("renders a canvas element", () => {
    const { container } = render(<WheelCanvas {...defaultProps} />);
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
  });

  // Test 2: Canvas click triggers onSpin when idle with items present
  it("calls onSpin when canvas is clicked in idle state with items present", () => {
    const onSpin = vi.fn();
    const { container } = render(
      <WheelCanvas {...defaultProps} spinning={false} items={["A", "B"]} onSpin={onSpin} />,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    fireEvent.click(canvas!);
    expect(onSpin).toHaveBeenCalledTimes(1);
  });

  // Test 3: Canvas click does NOT trigger onSpin when spinning
  it("does NOT call onSpin when canvas is clicked during a spin", () => {
    const onSpin = vi.fn();
    const { container } = render(
      <WheelCanvas {...defaultProps} spinning={true} items={["A", "B"]} onSpin={onSpin} />,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    fireEvent.click(canvas!);
    expect(onSpin).not.toHaveBeenCalled();
  });

  // Test 4: Canvas click does NOT trigger onSpin when items are empty
  it("does NOT call onSpin when canvas is clicked with empty items list", () => {
    const onSpin = vi.fn();
    const { container } = render(
      <WheelCanvas {...defaultProps} spinning={false} items={[]} onSpin={onSpin} />,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    fireEvent.click(canvas!);
    expect(onSpin).not.toHaveBeenCalled();
  });

  // Test 5: Winner overlay renders when winner is set
  it("shows winner overlay with winner name and 'Winner!' text when winner is set", () => {
    render(
      <WheelCanvas {...defaultProps} winner="Pizza" />,
    );
    expect(screen.getByText("Pizza")).toBeDefined();
    expect(screen.getByText("Winner!")).toBeDefined();
  });

  // Test 6: Winner overlay hidden when winner is null
  it("does NOT show winner overlay when winner is null", () => {
    render(<WheelCanvas {...defaultProps} winner={null} />);
    expect(screen.queryByText("Winner!")).toBeNull();
  });

  // Test 7: Pointer triangle is always rendered (regardless of state)
  it("renders the pointer SVG regardless of spinning state or items", () => {
    const { container } = render(<WheelCanvas {...defaultProps} items={[]} spinning={false} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  // Test 8: Pointer triangle present even when spinning
  it("renders the pointer SVG while spinning", () => {
    const { container } = render(
      <WheelCanvas {...defaultProps} items={["A", "B"]} spinning={true} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});
