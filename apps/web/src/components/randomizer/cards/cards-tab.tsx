import { useEffect, useState } from "react";
import { useCards, ANIMATION_DURATION } from "@base-project/web/lib/randomizer/use-cards";
import { CardDisplay } from "./card-display";
import { CardControls } from "./card-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

const CYCLE_DURATION = 600; // deck cycling animation before flip
const STAGGER_DELAY = 200;

type CardsTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

export function CardsTab({ onHistoryChange }: CardsTabProps) {
  const {
    drawnCards,
    isDrawing,
    mode,
    handSize,
    history,
    remainingCount,
    drawCards,
    onDrawEnd,
    reshuffle,
    setMode,
    setHandSize,
  } = useCards();

  const [revealedCount, setRevealedCount] = useState(0);
  const [isCycling, setIsCycling] = useState(false);

  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  // Two-phase animation: cycle through deck, then staggered flip reveal
  useEffect(() => {
    if (!isDrawing) return;

    setRevealedCount(0);
    setIsCycling(true);

    // Phase 1: deck cycling (cards shuffle visually)
    const cycleTimer = setTimeout(() => {
      setIsCycling(false);

      // Phase 2: staggered flip reveal
      drawnCards.forEach((_, i) => {
        setTimeout(() => setRevealedCount(i + 1), i * STAGGER_DELAY);
      });
    }, CYCLE_DURATION);

    // End after all cards revealed + flip animation settles
    const total = CYCLE_DURATION + drawnCards.length * STAGGER_DELAY + ANIMATION_DURATION + 200;
    const endTimer = setTimeout(onDrawEnd, total);

    return () => {
      clearTimeout(cycleTimer);
      clearTimeout(endTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
      {drawnCards.length > 0 && (
        <CardDisplay
          drawnCards={drawnCards}
          isDrawing={isDrawing}
          revealedCount={revealedCount}
          isCycling={isCycling}
        />
      )}
      <CardControls
        mode={mode}
        handSize={handSize}
        isDrawing={isDrawing}
        remainingCount={remainingCount}
        onDraw={drawCards}
        onReshuffle={reshuffle}
        onSetMode={setMode}
        onSetHandSize={setHandSize}
      />
    </div>
  );
}
