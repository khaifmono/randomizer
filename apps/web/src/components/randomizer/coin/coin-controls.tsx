import { Coins, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";
import { cn } from "@base-project/web/lib/utils";

type CoinControlsProps = {
  count: number;
  flipping: boolean;
  onSetCount: (n: number) => void;
  onFlip: () => void;
};

export function CoinControls({ count, flipping, onSetCount, onFlip }: CoinControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[200px]">
      {/* Stepper row */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSetCount(count - 1)}
          disabled={count === 1 || flipping}
          aria-label="Decrease coin count"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className={cn("w-10 text-center text-base font-semibold")}>{count}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSetCount(count + 1)}
          disabled={count === 10 || flipping}
          aria-label="Increase coin count"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Flip button */}
      <Button
        onClick={onFlip}
        disabled={flipping}
        className="w-full bg-coin-accent text-white hover:bg-coin-accent/90 font-semibold"
      >
        {flipping ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Flipping...
          </>
        ) : (
          <>
            <Coins className="h-4 w-4" />
            Flip
          </>
        )}
      </Button>
    </div>
  );
}
