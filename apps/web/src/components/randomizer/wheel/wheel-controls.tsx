import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";

type WheelControlsProps = {
  onSpin: () => void;
  onReset: () => void;
  spinning: boolean;
  hasItems: boolean;
  hasRemovedItems: boolean;
};

export function WheelControls({
  onSpin,
  onReset,
  spinning,
  hasItems,
  hasRemovedItems,
}: WheelControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={onSpin}
        disabled={spinning || !hasItems}
        size="lg"
        className="w-full max-w-[220px] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-transform"
        title={!hasItems ? "Add items to spin" : undefined}
      >
        {spinning ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Spinning...
          </>
        ) : (
          "Spin"
        )}
      </Button>
      {hasRemovedItems && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset wheel
        </button>
      )}
    </div>
  );
}
