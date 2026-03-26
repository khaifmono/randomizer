import { useEffect } from "react";
import { useCoin, ANIMATION_DURATION } from "@base-project/web/lib/randomizer/use-coin";
import { CoinDisplay } from "./coin-display";
import { CoinControls } from "./coin-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

type CoinTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

export function CoinTab({ onHistoryChange }: CoinTabProps) {
  const { count, flipping, results, tally, history, setCount, startFlip, onFlipEnd } = useCoin();

  // Sync history up to RandomizerPage for the shared history panel
  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  // Trigger onFlipEnd after the CSS animation completes
  // Single setTimeout avoids coordinating N animationend events (one per coin)
  useEffect(() => {
    if (!flipping) return;
    const timer = setTimeout(onFlipEnd, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [flipping, onFlipEnd]);

  return (
    <div className="flex flex-col items-center gap-6">
      <CoinDisplay count={count} results={results} flipping={flipping} />
      <CoinControls count={count} flipping={flipping} onSetCount={setCount} onFlip={startFlip} />
      {tally !== null && !flipping && (
        <p className="text-2xl font-bold">{tally.heads} Heads, {tally.tails} Tails</p>
      )}
    </div>
  );
}
