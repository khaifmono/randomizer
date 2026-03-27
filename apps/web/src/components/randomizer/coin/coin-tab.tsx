import { useEffect } from "react";
import { useCoin, ANIMATION_DURATION } from "@base-project/web/lib/randomizer/use-coin";
import { CoinDisplay } from "./coin-display";
import { CoinControls } from "./coin-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { TutorialButton } from "@base-project/web/components/randomizer/tutorial-modal";
import { coinTutorial } from "@base-project/web/components/randomizer/tutorials";

type CoinTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
  registerClearSession?: (fn: () => void) => void;
};

export function CoinTab({ onHistoryChange, registerClearSession }: CoinTabProps) {
  const { count, flipping, results, tally, history, sessionHeads, sessionTails, setCount, startFlip, onFlipEnd, clearSession } = useCoin();

  // Sync history up to RandomizerPage for the shared history panel
  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  // Register clearSession so parent can call it when clearing history
  useEffect(() => {
    registerClearSession?.(clearSession);
  }, [registerClearSession, clearSession]);

  // Trigger onFlipEnd after the CSS animation completes
  // Single setTimeout avoids coordinating N animationend events (one per coin)
  useEffect(() => {
    if (!flipping) return;
    const timer = setTimeout(onFlipEnd, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [flipping, onFlipEnd]);

  return (
    <div className="flex flex-col items-center gap-6">
      <TutorialButton toolName="Coin Flipper" accentColor="#f59e0b" steps={coinTutorial} />
      {sessionHeads + sessionTails > 0 && (
        <p className="text-sm font-medium text-muted-foreground" data-testid="session-tally">
          {sessionHeads}H {sessionTails}T across {sessionHeads + sessionTails} flips
        </p>
      )}
      <CoinDisplay count={count} results={results} flipping={flipping} />
      <CoinControls count={count} flipping={flipping} onSetCount={setCount} onFlip={startFlip} />
      {tally !== null && !flipping && (
        <p className="text-2xl font-bold">{tally.heads} Heads, {tally.tails} Tails</p>
      )}
    </div>
  );
}
