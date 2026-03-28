import { Loader2, Dices } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";
import { cn } from "@base-project/web/lib/utils";

type DiceControlsProps = {
  count: number;
  rolling: boolean;
  onSetCount: (n: number) => void;
  onRoll: () => void;
};

export function DiceControls({ count, rolling, onSetCount, onRoll }: DiceControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      {/* Dice count selector — pill buttons */}
      <div className="flex items-center gap-1 bg-muted/40 rounded-xl p-1 border border-border/40">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => onSetCount(n)}
            disabled={rolling}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-bold transition-all",
              count === n
                ? "bg-dice-accent text-white shadow-md shadow-dice-accent/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {count === 1 ? "1 die" : `${count} dice`}
      </p>

      {/* Roll button */}
      <Button
        onClick={onRoll}
        disabled={rolling}
        size="lg"
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-transform"
      >
        {rolling ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Rolling...
          </>
        ) : (
          <>
            <Dices className="h-5 w-5" />
            Roll {count === 1 ? "Die" : "Dice"}
          </>
        )}
      </Button>
    </div>
  );
}
