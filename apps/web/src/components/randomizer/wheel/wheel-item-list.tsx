import { useState, useRef } from "react";
import { Plus, X, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { Input } from "@base-project/web/components/ui/input";
import { Textarea } from "@base-project/web/components/ui/textarea";
import { Button } from "@base-project/web/components/ui/button";

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
    <Card className="border-2 border-border/60">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-wheel-accent" />
          <span className="text-sm font-semibold">Items</span>
          {items.length > 0 && (
            <span className="ml-auto text-xs font-medium bg-wheel-accent/10 text-wheel-accent px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </div>

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
            onClick={handleAdd}
            disabled={disabled || !inputValue.trim()}
            size="icon"
            className="bg-wheel-accent hover:bg-wheel-accent/90 text-white shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Bulk add toggle */}
        <button
          onClick={() => setBulkOpen(!bulkOpen)}
          disabled={disabled}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {bulkOpen ? "Close bulk add" : "Bulk add (paste list)"}
        </button>

        {/* Bulk textarea */}
        {bulkOpen && (
          <div className="space-y-2">
            <Textarea
              placeholder="One item per line..."
              value={bulkValue}
              onChange={(e) => setBulkValue(e.target.value)}
              disabled={disabled}
              rows={4}
              className="resize-none"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkAdd}
              disabled={disabled || !bulkValue.trim()}
              className="w-full"
            >
              Add all
            </Button>
          </div>
        )}

        {/* Item list */}
        {items.length === 0 ? (
          <div className="text-center py-6 rounded-lg bg-muted/30 border border-dashed border-border/40">
            <p className="text-sm font-medium text-muted-foreground">No items yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add items to get started</p>
          </div>
        ) : (
          <ul className="space-y-0.5 max-h-64 overflow-y-auto">
            {items.map((item, i) => (
              <li
                key={`${item}-${i}`}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-muted/50 text-sm group transition-colors"
              >
                <span className="truncate">{item}</span>
                <button
                  onClick={() => onRemoveItem(i)}
                  disabled={disabled}
                  className="text-muted-foreground/0 group-hover:text-muted-foreground hover:!text-destructive ml-1 shrink-0 transition-colors"
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
