import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { Input } from "@base-project/web/components/ui/input";
import { Textarea } from "@base-project/web/components/ui/textarea";
import { Button } from "@base-project/web/components/ui/button";
import { Label } from "@base-project/web/components/ui/label";

type WheelItemListProps = {
  items: string[];
  onAddItem: (text: string) => void;
  onAddBulk: (text: string) => void;
  onRemoveItem: (index: number) => void;
  disabled?: boolean;
};

export function WheelItemList({
  items,
  onAddItem,
  onAddBulk,
  onRemoveItem,
  disabled,
}: WheelItemListProps) {
  const [inputValue, setInputValue] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkValue, setBulkValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAddItem(trimmed);
    setInputValue("");
    inputRef.current?.focus();
  }

  function handleBulkAdd() {
    onAddBulk(bulkValue);
    setBulkValue("");
    setBulkOpen(false);
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <Label className="text-sm font-semibold">Items</Label>

        {/* Quick-add row */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Enter an item..."
            maxLength={40}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            disabled={disabled}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={disabled || !inputValue.trim()}
            className="border-wheel-accent text-wheel-accent shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Bulk add toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBulkOpen(!bulkOpen)}
          disabled={disabled}
          className="text-muted-foreground text-xs"
        >
          {bulkOpen ? "Close bulk" : "Bulk add"}
        </Button>

        {/* Bulk textarea (conditional) */}
        {bulkOpen && (
          <div className="space-y-2">
            <Textarea
              placeholder="One item per line..."
              value={bulkValue}
              onChange={(e) => setBulkValue(e.target.value)}
              disabled={disabled}
              rows={4}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkAdd}
              disabled={disabled || !bulkValue.trim()}
            >
              Add all
            </Button>
          </div>
        )}

        {/* Item list or empty state */}
        {items.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm font-semibold text-muted-foreground">No items yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add items above to get started.</p>
          </div>
        ) : (
          <ul className="space-y-1 max-h-64 overflow-y-auto">
            {items.map((item, i) => (
              <li
                key={`${item}-${i}`}
                className="flex items-center justify-between py-1 px-2 rounded hover:bg-secondary text-sm"
              >
                <span className="truncate">{item}</span>
                <button
                  onClick={() => onRemoveItem(i)}
                  disabled={disabled}
                  className="text-muted-foreground hover:text-destructive ml-1 shrink-0"
                  aria-label={`Remove ${item}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
