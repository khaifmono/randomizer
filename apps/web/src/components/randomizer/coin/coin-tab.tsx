import { useEffect } from "react";
import { Coins } from "lucide-react";
import { useCoin, ANIMATION_DURATION } from "@base-project/web/lib/randomizer/use-coin";
import { CoinDisplay } from "./coin-display";
import { CoinControls } from "./coin-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { TutorialButton } from "@base-project/web/components/randomizer/tutorial-modal";
import { coinTutorial } from "@base-project/web/components/randomizer/tutorials";
import { playWhoosh, playDing } from "@base-project/web/lib/randomizer/sounds";

type CoinTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
  registerClearSession?: (fn: () => void) => void;
};

export function CoinTab({ onHistoryChange, registerClearSession }: CoinTabProps) {
  const { count, flipping, results, tally, history, sessionHeads, sessionTails, setCount, startFlip, onFlipEnd, clearSession } = useCoin();

  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  useEffect(() => {
    registerClearSession?.(clearSession);
  }, [registerClearSession, clearSession]);

  useEffect(() => {
    if (!flipping) return;
    const timer = setTimeout(() => { onFlipEnd(); playDing(); }, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [flipping, onFlipEnd]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <TutorialButton toolName="Coin Flipper" accentColor="#f59e0b" steps={coinTutorial} />

      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
          <Coins className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold">Coin Flipper</h2>
        <p className="text-sm text-muted-foreground text-center">Flip 1-10 coins with 3D tossing animation</p>
      </div>

      {/* Session tally */}
      {sessionHeads + sessionTails > 0 && (
        <div className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2 border border-border/40" data-testid="session-tally">
          <span className="text-sm font-bold text-coin-accent">{sessionHeads}H</span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-sm font-bold text-coin-accent">{sessionTails}T</span>
          <span className="text-xs text-muted-foreground">across {sessionHeads + sessionTails} flips</span>
        </div>
      )}

      <CoinDisplay count={count} results={results} flipping={flipping} />
      <CoinControls count={count} flipping={flipping} onSetCount={setCount} onFlip={() => { startFlip(); playWhoosh(); }} />

      {/* Result */}
      {tally !== null && !flipping && (
        <div className="flex items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-coin-accent">{tally.heads}</span>
            <span className="text-xs text-muted-foreground font-medium">Heads</span>
          </div>
          <span className="text-muted-foreground text-lg">/</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-coin-accent">{tally.tails}</span>
            <span className="text-xs text-muted-foreground font-medium">Tails</span>
          </div>
        </div>
      )}
    </div>
  );
}
