import { useState, useEffect } from "react";
import { useNumber, REEL_STAGGER_MS, BASE_REEL_DURATION_MS } from "@base-project/web/lib/randomizer/use-number";
import { NumberDisplay } from "./number-display";
import { NumberControls } from "./number-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { TutorialButton } from "@base-project/web/components/randomizer/tutorial-modal";
import { numberTutorial } from "@base-project/web/components/randomizer/tutorials";

type NumberTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

export function NumberTab({ onHistoryChange }: NumberTabProps) {
  const { min, max, rolling, result, digits, history, setRange, startRoll, onRollEnd } = useNumber();
  const [stoppedReels, setStoppedReels] = useState<boolean[]>([]);

  // Sync history up to RandomizerPage
  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  // Compute per-reel durations based on digit count (per D-03 stagger)
  const reelDurations = digits.map((_, i) => BASE_REEL_DURATION_MS + i * REEL_STAGGER_MS);

  // Staggered reel stop: when rolling starts, schedule each reel to "stop" after its duration
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

    // After the last reel stops, call onRollEnd
    const totalDuration = BASE_REEL_DURATION_MS + (digits.length - 1) * REEL_STAGGER_MS;
    const endTimer = setTimeout(onRollEnd, totalDuration + 100); // +100ms for visual settle

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(endTimer);
    };
  }, [rolling]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: intentionally exclude digits/onRollEnd from deps — same pattern as dice-tab
  // where onRollEnd is excluded to prevent animation restart on callback identity changes

  return (
    <div className="flex flex-col items-center gap-6">
      <TutorialButton toolName="Number Generator" accentColor="#a855f7" steps={numberTutorial} />
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
        onGenerate={startRoll}
      />
    </div>
  );
}
