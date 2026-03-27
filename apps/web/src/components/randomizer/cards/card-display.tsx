import type { Card } from "@base-project/web/lib/randomizer/use-cards";
import { CardFace } from "./card-face";

type CardDisplayProps = {
  drawnCards: Card[];
  isDrawing: boolean;
  revealedCount: number;
};

export function CardDisplay({ drawnCards, isDrawing, revealedCount }: CardDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 min-h-[112px]">
      {drawnCards.map((card, i) => (
        <CardFace
          key={i}
          card={card}
          flipping={isDrawing && i === revealedCount}
          revealed={i < revealedCount}
        />
      ))}
    </div>
  );
}
