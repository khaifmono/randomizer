import type { Card } from "@base-project/web/lib/randomizer/use-cards";
import { CardFace } from "./card-face";

type CardDisplayProps = {
  drawnCards: Card[];
  isDrawing: boolean;
  revealedCount: number;
  isCycling: boolean;
};

export function CardDisplay({ drawnCards, isDrawing, revealedCount, isCycling }: CardDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 min-h-[112px]">
      {drawnCards.map((card, i) => (
        <CardFace
          key={i}
          card={card}
          cycling={isCycling && i >= revealedCount}
          flipping={!isCycling && isDrawing && i === revealedCount}
          revealed={!isCycling && i < revealedCount}
        />
      ))}
    </div>
  );
}
