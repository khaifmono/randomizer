import { useEffect, useState } from "react";
import { useCards, ANIMATION_DURATION } from "@base-project/web/lib/randomizer/use-cards";
import { CardDisplay } from "./card-display";
import { CardControls } from "./card-controls";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";

// Delay between each card flip reveal in hand mode (ms)
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

  // Sync history up to parent
  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  // Staggered flip animation — reveal cards one at a time during draw
  useEffect(() => {
    if (!isDrawing) return;
    setRevealedCount(0);
    // Reveal each card with STAGGER_DELAY ms gap
    drawnCards.forEach((_, i) => {
      setTimeout(() => setRevealedCount(i + 1), i * STAGGER_DELAY);
    });
    // Call onDrawEnd after all cards have flipped + settle (200ms extra)
    const total = drawnCards.length * STAGGER_DELAY + ANIMATION_DURATION + 200;
    const timer = setTimeout(onDrawEnd, total);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawing]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {drawnCards.length > 0 && (
        <CardDisplay
          drawnCards={drawnCards}
          isDrawing={isDrawing}
          revealedCount={revealedCount}
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
