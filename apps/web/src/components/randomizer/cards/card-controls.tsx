import { Loader2, Minus, Plus, RectangleHorizontal, RotateCcw } from "lucide-react";
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
    <div className="flex flex-col items-center gap-4 w-full max-w-[240px]">
      {/* Remaining badge */}
      <span className="text-sm text-muted-foreground" data-testid="remaining-count">
        {remainingCount} remaining
      </span>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === "single" ? "default" : "outline"}
          size="sm"
          onClick={() => onSetMode("single")}
          disabled={isDrawing}
        >
          Single
        </Button>
        <Button
          variant={mode === "hand" ? "default" : "outline"}
          size="sm"
          onClick={() => onSetMode("hand")}
          disabled={isDrawing}
        >
          Hand
        </Button>
      </div>

      {/* Hand size stepper — only shown in hand mode */}
      {mode === "hand" && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSetHandSize(handSize - 1)}
            disabled={handSize === 1 || isDrawing}
            aria-label="Decrease hand size"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className={cn("w-10 text-center text-base font-semibold")}>{handSize}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSetHandSize(handSize + 1)}
            disabled={handSize === 5 || isDrawing}
            aria-label="Increase hand size"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Draw button */}
      <Button
        onClick={onDraw}
        disabled={isDrawing || remainingCount === 0}
        className="w-full font-semibold"
      >
        {isDrawing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Drawing...
          </>
        ) : (
          <>
            <RectangleHorizontal className="h-4 w-4" />
            {mode === "single" ? "Draw Card" : `Draw ${handSize}`}
          </>
        )}
      </Button>

      {/* Reshuffle button */}
      <Button
        variant="outline"
        onClick={onReshuffle}
        disabled={isDrawing}
        className="w-full font-semibold"
      >
        <RotateCcw className="h-4 w-4" />
        Reshuffle
      </Button>
    </div>
  );
}
