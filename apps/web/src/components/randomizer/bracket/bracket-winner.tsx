import { useEffect } from "react";
import { Crown } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";
import { playFanfare } from "@base-project/web/lib/randomizer/sounds";

const CONFETTI_COLORS = ["#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"];

type BracketWinnerProps = {
  winnerId: number;
  entries: string[];
  onReset: () => void;
};

export function BracketWinner({ winnerId, entries, onReset }: BracketWinnerProps) {
  useEffect(() => {
    playFanfare();
  }, []);

  const winnerName = entries[winnerId - 1] ?? entries[0] ?? "Champion";

  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.floor(Math.random() * 100)}%`,
    delay: `${(Math.random() * 0.6).toFixed(2)}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      {/* Confetti particles — full width overlay */}
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
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

      {/* Winner card — centered over the bracket */}
      <div className="pointer-events-auto flex flex-col items-center gap-3 bg-background/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl border border-bracket-accent/30">
        <Crown className="h-8 w-8 text-bracket-accent" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-muted-foreground">Winner!</p>
          <p className="text-2xl font-bold text-center">{winnerName}</p>
        </div>
        <Button
          variant="outline"
          className="max-w-[240px] w-full mt-1"
          onClick={onReset}
        >
          New Tournament
        </Button>
      </div>
    </div>
  );
}
