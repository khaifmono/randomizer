import { Loader2 } from "lucide-react";
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
        className="w-full max-w-[200px] h-11 bg-wheel-accent hover:bg-wheel-accent/90 text-white font-semibold"
        title={!hasItems ? "Add items to spin" : undefined}
      >
        {spinning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Spinning...
          </>
        ) : (
          "Spin"
        )}
      </Button>
      {hasRemovedItems && (
        <button
          onClick={onReset}
          className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
        >
          Reset wheel
        </button>
      )}
    </div>
  );
}
