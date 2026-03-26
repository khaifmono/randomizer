import { useEffect } from "react";
import { useWheel } from "@base-project/web/lib/randomizer/use-wheel";
import { WheelCanvas } from "./wheel-canvas";
import { WheelItemList } from "./wheel-item-list";
import { WheelControls } from "./wheel-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

type WheelTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

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

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left column: Wheel + Controls */}
      <div className="flex-1 flex flex-col items-center gap-4">
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
