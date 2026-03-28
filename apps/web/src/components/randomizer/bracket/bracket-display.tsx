import { Badge } from "@base-project/web/components/ui/badge";
import { BracketMatch } from "./bracket-match";
import type { Matchup } from "@base-project/web/lib/randomizer/use-bracket";

type BracketDisplayProps = {
  rounds: Matchup[][];
  activeMatchupId: string | null;
  animating: boolean;
  mode: "random" | "judge";
  onResolve: (matchupId: string, winnerId: number) => void;
  onAnimationEnd: (matchupId: string) => void;
};

export function BracketDisplay({
  rounds,
  activeMatchupId,
  animating,
  mode,
  onResolve,
  onAnimationEnd,
}: BracketDisplayProps) {
  const totalRounds = rounds.length;

  return (
    <div className="flex flex-row gap-8 overflow-x-auto scrollbar-none p-4">
      {rounds.map((round, roundIndex) => {
        // Progressive reveal: only show when all previous rounds are complete
        const isRevealed =
          roundIndex === 0 ||
          rounds[roundIndex - 1].every((m) => m.winnerId !== null);

        if (!isRevealed) return null;

        return (
          <div key={roundIndex} className="flex flex-col gap-4 flex-shrink-0">
            {/* Round header */}
            <div className="flex justify-center">
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {roundIndex === totalRounds - 1
                  ? "Final"
                  : `Round ${roundIndex + 1} of ${totalRounds}`}
              </Badge>
            </div>

            {/* Matchup cards with vertical spacing */}
            <div className="flex flex-col justify-around gap-4 w-40">
              {round.map((matchup) => (
                <BracketMatch
                  key={matchup.id}
                  matchup={matchup}
                  isActive={matchup.id === activeMatchupId}
                  animating={animating}
                  mode={mode}
                  onResolve={onResolve}
                  onAnimationEnd={onAnimationEnd}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
