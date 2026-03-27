import { cn } from "@base-project/web/lib/utils";
import type { Card } from "@base-project/web/lib/randomizer/use-cards";

type CardFaceProps = {
  card: Card | null;
  flipping: boolean;
  revealed: boolean;
  cycling?: boolean;
};

function KingIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 80" className="w-16 h-20" fill="none">
      {/* Crown */}
      <path d="M12 40L18 20L26 32L32 12L38 32L46 20L52 40Z" fill={color} opacity="0.15" />
      <path d="M12 40L18 20L26 32L32 12L38 32L46 20L52 40Z" stroke={color} strokeWidth="2" fill="none" />
      <rect x="12" y="40" width="40" height="6" rx="1" fill={color} opacity="0.2" />
      {/* Face */}
      <circle cx="32" cy="56" r="10" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      <text x="32" y="60" textAnchor="middle" fontSize="12" fontWeight="900" fill={color}>K</text>
      {/* Jewels */}
      <circle cx="32" cy="18" r="3" fill={color} opacity="0.4" />
      <circle cx="22" cy="28" r="2" fill={color} opacity="0.3" />
      <circle cx="42" cy="28" r="2" fill={color} opacity="0.3" />
    </svg>
  );
}

function QueenIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 80" className="w-16 h-20" fill="none">
      {/* Tiara */}
      <path d="M20 36Q24 22 32 18Q40 22 44 36" stroke={color} strokeWidth="2" fill={color} opacity="0.1" />
      <circle cx="28" cy="26" r="2.5" fill={color} opacity="0.35" />
      <circle cx="32" cy="22" r="3" fill={color} opacity="0.45" />
      <circle cx="36" cy="26" r="2.5" fill={color} opacity="0.35" />
      {/* Veil / dress */}
      <path d="M22 38Q22 50 20 66L32 62L44 66Q42 50 42 38Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      {/* Face */}
      <circle cx="32" cy="44" r="8" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
      <text x="32" y="48" textAnchor="middle" fontSize="10" fontWeight="900" fill={color}>Q</text>
    </svg>
  );
}

function JackIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 80" className="w-16 h-20" fill="none">
      {/* Hat */}
      <path d="M22 34L32 16L42 34Z" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5" />
      <rect x="20" y="34" width="24" height="4" rx="1" fill={color} opacity="0.2" />
      {/* Feather */}
      <path d="M36 18Q46 10 48 20Q42 16 36 18Z" fill={color} opacity="0.3" />
      {/* Face */}
      <circle cx="32" cy="50" r="10" fill={color} opacity="0.08" stroke={color} strokeWidth="1.5" />
      <text x="32" y="54" textAnchor="middle" fontSize="12" fontWeight="900" fill={color}>J</text>
      {/* Collar */}
      <path d="M24 62Q28 58 32 60Q36 58 40 62" stroke={color} strokeWidth="1.5" fill={color} opacity="0.1" />
    </svg>
  );
}

function CardCenter({ rank, suit, color }: { rank: string; suit: string; color: string }) {
  if (rank === "K") return <KingIcon color={color} />;
  if (rank === "Q") return <QueenIcon color={color} />;
  if (rank === "J") return <JackIcon color={color} />;
  return <span className="text-5xl font-bold leading-none self-center">{suit}</span>;
}

export function CardFace({ card, flipping, revealed, cycling = false }: CardFaceProps) {
  const isRed = card?.suit === "♥" || card?.suit === "♦";
  const color = isRed ? "#dc2626" : "#1a1a1a";

  return (
    <div className={cn("card-scene relative", cycling && "is-cycling")} style={{ width: 140, height: 196 }}>
      <div
        className={cn(
          "card-inner w-full h-full rounded-xl",
          cycling ? "card-cycling" : flipping ? "card-flipping" : (revealed ? "card-show-front" : "card-show-back"),
        )}
      >
        {/* Back face */}
        <div className="card-face card-face-back w-full h-full rounded-xl bg-blue-700 border-3 border-blue-900 flex items-center justify-center shadow-lg">
          <div className="w-24 h-36 rounded-lg border-2 border-blue-500/60 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(255,255,255,0.08)_6px,rgba(255,255,255,0.08)_12px)]" />
        </div>
        {/* Front face */}
        <div
          className={cn(
            "card-face card-face-front w-full h-full rounded-xl border-3 border-border shadow-lg",
            "bg-white dark:bg-gray-50 flex flex-col justify-between p-3 select-none",
            isRed ? "text-red-600" : "text-gray-900",
          )}
        >
          <span className="text-lg font-bold leading-none">{card?.rank ?? ""}{card?.suit ?? ""}</span>
          <CardCenter rank={card?.rank ?? ""} suit={card?.suit ?? ""} color={color} />
          <span className="text-lg font-bold leading-none self-end rotate-180">{card?.rank ?? ""}{card?.suit ?? ""}</span>
        </div>
      </div>
    </div>
  );
}
