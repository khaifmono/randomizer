import { useEffect } from "react";
import { useDice, ANIMATION_DURATION } from "@base-project/web/lib/randomizer/use-dice";
import { DiceDisplay } from "./dice-display";
import { DiceControls } from "./dice-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { TutorialButton } from "@base-project/web/components/randomizer/tutorial-modal";
import { diceTutorial } from "@base-project/web/components/randomizer/tutorials";

type DiceTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

export function DiceTab({ onHistoryChange }: DiceTabProps) {
  const { count, rolling, results, sum, history, setCount, startRoll, onRollEnd } = useDice();

  // Sync history up to RandomizerPage for the shared history panel
  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  // Trigger onRollEnd after the CSS animation completes
  // Single setTimeout avoids coordinating N animationend events (one per die)
  useEffect(() => {
    if (!rolling) return;
    const timer = setTimeout(onRollEnd, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [rolling, onRollEnd]);

  return (
    <div className="flex flex-col items-center gap-6">
      <TutorialButton toolName="Dice Roller" accentColor="#10b981" steps={diceTutorial} />
      <DiceDisplay count={count} results={results} rolling={rolling} />
      <DiceControls count={count} rolling={rolling} onSetCount={setCount} onRoll={startRoll} />
      {sum !== null && !rolling && (
        <p className="text-2xl font-bold">Total: {sum}</p>
      )}
    </div>
  );
}
