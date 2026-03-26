import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultHistory } from "./result-history";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

const mockEntries: HistoryEntry[] = [
  { id: 3, label: "Pepperoni", timestamp: 1000003 },
  { id: 2, label: "Mushroom", timestamp: 1000002 },
  { id: 1, label: "Cheese", timestamp: 1000001 },
];

describe("ResultHistory", () => {
  it("renders 'No results yet' when entries array is empty", () => {
    render(<ResultHistory entries={[]} onClear={() => {}} />);
    expect(screen.getByText("No results yet")).toBeDefined();
  });

  it("does NOT render Clear button when entries array is empty", () => {
    render(<ResultHistory entries={[]} onClear={() => {}} />);
    expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
  });

  it("renders all entry labels when entries are provided", () => {
    render(<ResultHistory entries={mockEntries} onClear={() => {}} />);
    expect(screen.getByText("Pepperoni")).toBeDefined();
    expect(screen.getByText("Mushroom")).toBeDefined();
    expect(screen.getByText("Cheese")).toBeDefined();
  });

  it("renders entry IDs with # prefix", () => {
    render(<ResultHistory entries={mockEntries} onClear={() => {}} />);
    expect(screen.getByText("#3")).toBeDefined();
    expect(screen.getByText("#2")).toBeDefined();
    expect(screen.getByText("#1")).toBeDefined();
  });

  it("renders Clear button when entries exist", () => {
    render(<ResultHistory entries={mockEntries} onClear={() => {}} />);
    expect(screen.getByRole("button", { name: /clear/i })).toBeDefined();
  });

  it("calls onClear when Clear button is clicked", async () => {
    const onClear = vi.fn();
    render(<ResultHistory entries={mockEntries} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("renders History heading", () => {
    render(<ResultHistory entries={[]} onClear={() => {}} />);
    expect(screen.getByText("History")).toBeDefined();
  });
});
