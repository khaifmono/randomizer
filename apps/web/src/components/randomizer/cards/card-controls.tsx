import { Loader2, Minus, Plus, RectangleHorizontal, RotateCcw, Square, Layers } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";
import { cn } from "@base-project/web/lib/utils";

type CardControlsProps = {
  mode: "single" | "hand";
  handSize: number;
  isDrawing: boolean;
  remainingCount: number;
  onDraw: () => void;
  onReshuffle: () => void;
  onSetMode: (mode: "single" | "hand") => void;
  onSetHandSize: (n: number) => void;
};

export function CardControls({
  mode,
  handSize,
  isDrawing,
  remainingCount,
  onDraw,
  onReshuffle,
  onSetMode,
  onSetHandSize,
}: CardControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      {/* Remaining badge */}
      <span className="text-xs font-medium bg-cards-accent/10 text-cards-accent px-3 py-1 rounded-full" data-testid="remaining-count">
        {remainingCount} remaining
      </span>

      {/* Mode selection cards */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          type="button"
          onClick={() => onSetMode("single")}
          disabled={isDrawing}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all",
            mode === "single"
              ? "border-cards-accent bg-cards-accent/5 shadow-md shadow-cards-accent/10"
              : "border-border/60 hover:border-cards-accent/40 hover:bg-muted/30",
          )}
        >
          <div className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
            mode === "single" ? "bg-cards-accent text-white" : "bg-muted text-muted-foreground",
          )}>
            <Square className="h-4 w-4" />
          </div>
          <span className={cn("text-xs font-semibold", mode === "single" ? "text-cards-accent" : "text-foreground")}>
            Single
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode("hand")}
          disabled={isDrawing}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all",
            mode === "hand"
              ? "border-cards-accent bg-cards-accent/5 shadow-md shadow-cards-accent/10"
              : "border-border/60 hover:border-cards-accent/40 hover:bg-muted/30",
          )}
        >
          <div className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
            mode === "hand" ? "bg-cards-accent text-white" : "bg-muted text-muted-foreground",
          )}>
            <Layers className="h-4 w-4" />
          </div>
          <span className={cn("text-xs font-semibold", mode === "hand" ? "text-cards-accent" : "text-foreground")}>
            Hand
          </span>
        </button>
      </div>

      {/* Hand size stepper */}
      {mode === "hand" && (
        <div className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2 border border-border/40">
          <span className="text-sm text-muted-foreground font-medium">Cards</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onSetHandSize(handSize - 1)}
            disabled={handSize === 1 || isDrawing}
            aria-label="Decrease hand size"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-8 text-center text-base font-bold">{handSize}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onSetHandSize(handSize + 1)}
            disabled={handSize === 5 || isDrawing}
            aria-label="Increase hand size"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Draw button */}
      <Button
        onClick={onDraw}
        disabled={isDrawing || remainingCount === 0}
        size="lg"
        className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold text-base shadow-lg shadow-red-500/25 active:scale-[0.98] transition-transform"
      >
        {isDrawing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Drawing...
          </>
        ) : (
          <>
            <RectangleHorizontal className="h-5 w-5" />
            {mode === "single" ? "Draw Card" : `Draw ${handSize}`}
          </>
        )}
      </Button>

      {/* Reshuffle button */}
      <Button
        variant="outline"
        onClick={onReshuffle}
        disabled={isDrawing}
        className="w-full font-semibold text-muted-foreground"
      >
        <RotateCcw className="h-4 w-4" />
        Reshuffle
      </Button>
    </div>
  );
}
