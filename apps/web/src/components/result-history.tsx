import { Button } from "@base-project/web/components/ui/button";
import { cn } from "@base-project/web/lib/utils";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

type ResultHistoryProps = {
  entries: HistoryEntry[];
  onClear: () => void;
  className?: string;
};

export function ResultHistory({ entries, onClear, className }: ResultHistoryProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold leading-snug text-muted-foreground">
          History
        </span>
        {entries.length > 0 && (
          <Button variant="ghost" size="xs" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No results yet
        </p>
      ) : (
        <ul className="space-y-0.5">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="text-xs text-foreground py-1 px-2 rounded hover:bg-muted/50"
            >
              <span className="text-muted-foreground mr-1">#{entry.id}</span>
              {entry.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
