import { useEffect } from "react";
import { Dices } from "lucide-react";
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

  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  useEffect(() => {
    if (!rolling) return;
    const timer = setTimeout(onRollEnd, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [rolling, onRollEnd]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <TutorialButton toolName="Dice Roller" accentColor="#10b981" steps={diceTutorial} />

      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
          <Dices className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold">Dice Roller</h2>
        <p className="text-sm text-muted-foreground text-center">Roll 1-6 dice with 3D tumbling animation</p>
      </div>

      {/* Dice display */}
      <DiceDisplay count={count} results={results} rolling={rolling} />

      {/* Controls */}
      <DiceControls count={count} rolling={rolling} onSetCount={setCount} onRoll={startRoll} />

      {/* Sum result */}
      {sum !== null && !rolling && (
        <div className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95 duration-300">
          <span className="text-sm text-muted-foreground font-medium">Total</span>
          <span className="text-4xl font-black text-dice-accent" style={{ textShadow: "0 0 20px rgba(16,185,129,0.3)" }}>
            {sum}
          </span>
        </div>
      )}
    </div>
  );
}
