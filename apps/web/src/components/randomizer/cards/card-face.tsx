import { cn } from "@base-project/web/lib/utils";
import type { Card } from "@base-project/web/lib/randomizer/use-cards";

type CardFaceProps = {
  card: Card | null;
  flipping: boolean;
  revealed: boolean;
  cycling?: boolean;
};

export function CardFace({ card, flipping, revealed, cycling = false }: CardFaceProps) {
  const isRed = card?.suit === "♥" || card?.suit === "♦";

  return (
    <div className={cn("card-scene relative", cycling && "is-cycling")} style={{ width: 80, height: 112 }}>
      <div
        className={cn(
          "card-inner w-full h-full rounded-lg",
          cycling ? "card-cycling" : flipping ? "card-flipping" : (revealed ? "card-show-front" : "card-show-back"),
        )}
      >
        {/* Back face */}
        <div className="card-face card-face-back w-full h-full rounded-lg bg-blue-700 border-2 border-blue-900 flex items-center justify-center">
          <div className="w-14 h-20 rounded border-2 border-blue-500/60 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.08)_4px,rgba(255,255,255,0.08)_8px)]" />
        </div>
        {/* Front face */}
        <div
          className={cn(
            "card-face card-face-front w-full h-full rounded-lg border-2 border-border",
            "bg-white dark:bg-gray-50 flex flex-col justify-between p-1.5 select-none",
            isRed ? "text-red-600" : "text-gray-900",
          )}
        >
          <span className="text-xs font-bold leading-none">{card?.rank ?? ""}{card?.suit ?? ""}</span>
          <span className="text-lg font-bold leading-none self-center">{card?.suit ?? ""}</span>
          <span className="text-xs font-bold leading-none self-end rotate-180">{card?.rank ?? ""}{card?.suit ?? ""}</span>
        </div>
      </div>
    </div>
  );
}
