import { Minus, Plus, Loader2, Dices } from "lucide-react";
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
    <div className="flex flex-col items-center gap-4 w-full max-w-[200px]">
      {/* Stepper row */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSetCount(count - 1)}
          disabled={count === 1 || rolling}
          aria-label="Decrease dice count"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className={cn("w-10 text-center text-base font-semibold")}>{count}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSetCount(count + 1)}
          disabled={count === 6 || rolling}
          aria-label="Increase dice count"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Roll button */}
      <Button
        onClick={onRoll}
        disabled={rolling}
        className="w-full bg-dice-accent text-white hover:bg-dice-accent/90 font-semibold"
      >
        {rolling ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Rolling...
          </>
        ) : (
          <>
            <Dices className="h-4 w-4" />
            Roll
          </>
        )}
      </Button>
    </div>
  );
}
