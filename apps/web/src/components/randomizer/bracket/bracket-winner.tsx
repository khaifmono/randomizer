import { Crown } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";

const CONFETTI_COLORS = ["#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"];

type BracketWinnerProps = {
  winnerId: number;
  entries: string[];
  onReset: () => void;
};

export function BracketWinner({ winnerId, entries, onReset }: BracketWinnerProps) {
  // Winner name is at index winnerId - 1 (ids are 1-based)
  // But entries array is the original string list — resolve by position
  // The winnerId maps to the BracketEntry.id which is 1-based index into original entries
  const winnerName = entries[winnerId - 1] ?? entries[0] ?? "Champion";

  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.floor(Math.random() * 100)}%`,
    delay: `${(Math.random() * 0.6).toFixed(2)}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  return (
    <div className="flex flex-col items-center gap-4 py-8 relative">
      {/* Confetti particles */}
      <div className="absolute inset-x-0 top-0 h-32 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="confetti-particle absolute"
            style={{
              left: p.left,
              animationDelay: p.delay,
              backgroundColor: p.color,
            }}
          />
        ))}
      </div>

      {/* Winner display */}
      <Crown className="h-8 w-8 text-bracket-accent" />
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-muted-foreground">Winner!</p>
        <p className="text-2xl font-bold text-center">{winnerName}</p>
      </div>

      <Button
        variant="outline"
        className="max-w-[240px] w-full mt-2"
        onClick={onReset}
      >
        New Tournament
      </Button>
    </div>
  );
}
