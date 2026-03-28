import { useState, useEffect } from "react";
import { Hash } from "lucide-react";
import { useNumber, REEL_STAGGER_MS, BASE_REEL_DURATION_MS } from "@base-project/web/lib/randomizer/use-number";
import { NumberDisplay } from "./number-display";
import { NumberControls } from "./number-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { TutorialButton } from "@base-project/web/components/randomizer/tutorial-modal";
import { numberTutorial } from "@base-project/web/components/randomizer/tutorials";
import { playWhoosh, playDing } from "@base-project/web/lib/randomizer/sounds";

type NumberTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

export function NumberTab({ onHistoryChange }: NumberTabProps) {
  const { min, max, rolling, result, digits, history, setRange, startRoll, onRollEnd } = useNumber();
  const [stoppedReels, setStoppedReels] = useState<boolean[]>([]);

  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  const reelDurations = digits.map((_, i) => BASE_REEL_DURATION_MS + i * REEL_STAGGER_MS);

  useEffect(() => {
    if (!rolling) return;
    setStoppedReels(new Array(digits.length).fill(false));
    const timers = digits.map((_, i) => {
      const duration = BASE_REEL_DURATION_MS + i * REEL_STAGGER_MS;
      return setTimeout(() => {
        setStoppedReels((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, duration);
    });

    const totalDuration = BASE_REEL_DURATION_MS + (digits.length - 1) * REEL_STAGGER_MS;
    const endTimer = setTimeout(() => { onRollEnd(); playDing(); }, totalDuration + 100);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(endTimer);
    };
  }, [rolling]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <TutorialButton toolName="Number Generator" accentColor="#f97316" steps={numberTutorial} />

      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
          <Hash className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold">Lucky Number</h2>
        <p className="text-sm text-muted-foreground text-center">Pull the lever on a slot machine to get your number</p>
      </div>

      <NumberDisplay
        digits={digits}
        result={result}
        rolling={rolling}
        stoppedReels={stoppedReels}
        reelDurations={reelDurations}
        min={min}
        max={max}
      />
      <NumberControls
        min={min}
        max={max}
        rolling={rolling}
        onSetRange={setRange}
        onGenerate={() => { startRoll(); playWhoosh(); }}
      />
    </div>
  );
}
