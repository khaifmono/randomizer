import { Coins, Loader2 } from "lucide-react";
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
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      {/* Coin count selector — pill buttons */}
      <div className="flex items-center gap-1 bg-muted/40 rounded-xl p-1 border border-border/40 flex-wrap justify-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <button
            key={n}
            onClick={() => onSetCount(n)}
            disabled={flipping}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-bold transition-all",
              count === n
                ? "bg-coin-accent text-white shadow-md shadow-coin-accent/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {count === 1 ? "1 coin" : `${count} coins`}
      </p>

      {/* Flip button */}
      <Button
        onClick={onFlip}
        disabled={flipping}
        size="lg"
        className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-bold text-base shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-transform"
      >
        {flipping ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Flipping...
          </>
        ) : (
          <>
            <Coins className="h-5 w-5" />
            Flip {count === 1 ? "Coin" : "Coins"}
          </>
        )}
      </Button>
    </div>
  );
}
