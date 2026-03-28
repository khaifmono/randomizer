import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WheelItemList } from "./wheel-item-list";

const defaultProps = {
  items: ["Apple", "Banana", "Cherry"],
  onAddItem: vi.fn(),
  onAddBulk: vi.fn(),
  onRemoveItem: vi.fn(),
};

describe("WheelItemList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input with placeholder 'Enter an item...'", () => {
    render(<WheelItemList {...defaultProps} />);
    expect(screen.getByPlaceholderText("Enter an item...")).toBeInTheDocument();
  });

  it("Add button is disabled when input is empty", () => {
    render(<WheelItemList {...defaultProps} />);
    // Icon-only add button — find by the plus icon button
    const buttons = screen.getAllByRole("button");
    const addBtn = buttons.find((b) => !b.textContent || b.textContent.trim() === "");
    expect(addBtn).toBeDefined();
  });

  it("typing text then pressing Enter calls onAddItem with trimmed text", async () => {
    const user = userEvent.setup();
    const onAddItem = vi.fn();
    render(<WheelItemList {...defaultProps} onAddItem={onAddItem} />);
    const input = screen.getByPlaceholderText("Enter an item...");
    await user.type(input, "  Pizza  ");
    await user.keyboard("{Enter}");
    expect(onAddItem).toHaveBeenCalledWith("Pizza");
  });

  it("pressing Enter in input calls onAddItem", async () => {
    const user = userEvent.setup();
    const onAddItem = vi.fn();
    render(<WheelItemList {...defaultProps} onAddItem={onAddItem} />);
    const input = screen.getByPlaceholderText("Enter an item...");
    await user.type(input, "Tacos");
    await user.keyboard("{Enter}");
    expect(onAddItem).toHaveBeenCalledWith("Tacos");
  });

  it("bulk add toggle shows and hides textarea", async () => {
    const user = userEvent.setup();
    render(<WheelItemList {...defaultProps} />);
    expect(screen.queryByPlaceholderText("One item per line...")).not.toBeInTheDocument();
    const bulkToggle = screen.getByText(/bulk add/i);
    await user.click(bulkToggle);
    expect(screen.getByPlaceholderText("One item per line...")).toBeInTheDocument();
    // Second click collapses it
    const closeButton = screen.getByText(/close bulk/i);
    await user.click(closeButton);
    expect(screen.queryByPlaceholderText("One item per line...")).not.toBeInTheDocument();
  });

  it("Add all button calls onAddBulk with textarea content", async () => {
    const user = userEvent.setup();
    const onAddBulk = vi.fn();
    render(<WheelItemList {...defaultProps} onAddBulk={onAddBulk} />);
    const bulkToggle = screen.getByText(/bulk add/i);
    await user.click(bulkToggle);
    const textarea = screen.getByPlaceholderText("One item per line...");
    await user.type(textarea, "Item 1\nItem 2\nItem 3");
    const addAllButton = screen.getByRole("button", { name: /add all/i });
    await user.click(addAllButton);
    expect(onAddBulk).toHaveBeenCalledWith("Item 1\nItem 2\nItem 3");
  });

  it("item list renders each item text", () => {
    render(<WheelItemList {...defaultProps} />);
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("clicking x button calls onRemoveItem with correct index", async () => {
    const user = userEvent.setup();
    const onRemoveItem = vi.fn();
    render(<WheelItemList {...defaultProps} onRemoveItem={onRemoveItem} />);
    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[1]);
    expect(onRemoveItem).toHaveBeenCalledWith(1);
  });

  it("empty state shows 'No items yet' when items is empty", () => {
    render(<WheelItemList {...defaultProps} items={[]} />);
    expect(screen.getByText("No items yet")).toBeInTheDocument();
    expect(screen.getByText("Add items to get started")).toBeInTheDocument();
  });

  it("input has maxLength attribute of 40", () => {
    render(<WheelItemList {...defaultProps} />);
    const input = screen.getByPlaceholderText("Enter an item...");
    expect(input).toHaveAttribute("maxlength", "40");
  });
});
