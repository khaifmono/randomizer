import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { useWheel } from "@base-project/web/lib/randomizer/use-wheel";
import { WheelCanvas } from "./wheel-canvas";
import { WheelItemList } from "./wheel-item-list";
import { WheelControls } from "./wheel-controls";
import { Badge } from "@base-project/web/components/ui/badge";
import { Button } from "@base-project/web/components/ui/button";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

type WheelTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

// Static confetti particles — defined outside component to avoid re-creation
const CONFETTI_PARTICLES = [
  { id: 1, style: { left: "10%", animationDelay: "0s", animationDuration: "1.1s", backgroundColor: "oklch(0.55 0.18 240)" } },
  { id: 2, style: { left: "20%", animationDelay: "0.1s", animationDuration: "1.3s", backgroundColor: "oklch(0.65 0.20 340)" } },
  { id: 3, style: { left: "30%", animationDelay: "0.15s", animationDuration: "1.0s", backgroundColor: "oklch(0.72 0.15 80)" } },
  { id: 4, style: { left: "40%", animationDelay: "0.05s", animationDuration: "1.2s", backgroundColor: "oklch(0.55 0.15 145)" } },
  { id: 5, style: { left: "50%", animationDelay: "0.2s", animationDuration: "1.4s", backgroundColor: "oklch(0.70 0.22 20)" } },
  { id: 6, style: { left: "60%", animationDelay: "0.08s", animationDuration: "1.1s", backgroundColor: "oklch(0.65 0.20 300)" } },
  { id: 7, style: { left: "70%", animationDelay: "0.18s", animationDuration: "1.3s", backgroundColor: "oklch(0.55 0.18 240)" } },
  { id: 8, style: { left: "80%", animationDelay: "0.03s", animationDuration: "1.0s", backgroundColor: "oklch(0.72 0.15 80)" } },
  { id: 9, style: { left: "88%", animationDelay: "0.12s", animationDuration: "1.2s", backgroundColor: "oklch(0.65 0.20 340)" } },
  { id: 10, style: { left: "25%", animationDelay: "0.25s", animationDuration: "1.5s", backgroundColor: "oklch(0.70 0.22 20)" } },
];

export function WheelTab({ onHistoryChange }: WheelTabProps) {
  const {
    items,
    liveItems,
    spinning,
    winner,
    winnerIndex,
    history,
    addItem,
    addBulk,
    removeItem,
    reset,
    startSpin,
    onSpinEnd,
    hasRemovedItems,
  } = useWheel();

  // Sync history up to RandomizerPage for the shared history panel
  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  const showCelebration = liveItems.length === 0 && hasRemovedItems;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left column: Wheel + Controls */}
      <div className="flex-1 flex flex-col items-center gap-4">
        {/* Item count badge — visible when items exist */}
        {liveItems.length > 0 && (
          <Badge className="bg-wheel-accent text-white border-0 text-sm px-3 py-1">
            {liveItems.length} {liveItems.length === 1 ? "item" : "items"} remaining
          </Badge>
        )}

        {showCelebration ? (
          /* Empty state celebration — only after spin-removal */
          <div className="relative flex flex-col items-center gap-4 py-12 w-full max-w-[480px]">
            {/* Confetti particles */}
            {CONFETTI_PARTICLES.map((p) => (
              <div key={p.id} className="confetti-particle" style={p.style} />
            ))}
            <p className="text-2xl font-bold animate-in fade-in zoom-in-95 duration-300">All done!</p>
            <p className="text-sm text-muted-foreground">All items have been drawn.</p>
            <Button onClick={reset} className="mt-2 gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Reset Wheel
            </Button>
          </div>
        ) : (
          <>
            <WheelCanvas
              items={items}
              spinning={spinning}
              winnerIndex={winnerIndex}
              winner={winner}
              onSpin={startSpin}
              onSpinEnd={onSpinEnd}
            />
            <WheelControls
              onSpin={startSpin}
              onReset={reset}
              spinning={spinning}
              hasItems={liveItems.length > 0}
              hasRemovedItems={hasRemovedItems}
            />
          </>
        )}
      </div>

      {/* Right column: Item management */}
      <div className="w-full md:w-72 shrink-0">
        <WheelItemList
          items={liveItems}
          onAddItem={addItem}
          onAddBulk={addBulk}
          onRemoveItem={removeItem}
          disabled={spinning}
        />
      </div>
    </div>
  );
}
