import { Badge } from "@base-project/web/components/ui/badge";
import { BracketMatch } from "./bracket-match";
import type { Matchup } from "@base-project/web/lib/randomizer/use-bracket";

type BracketDisplayProps = {
  rounds: Matchup[][];
  activeMatchupId: string | null;
  animating: boolean;
  mode: "random" | "judge";
  onTrigger: () => void;
  onResolve: (matchupId: string, winnerId: number) => void;
  onAnimationEnd: (matchupId: string) => void;
};

export function BracketDisplay({
  rounds,
  activeMatchupId,
  animating,
  mode,
  onTrigger,
  onResolve,
  onAnimationEnd,
}: BracketDisplayProps) {
  const totalRounds = rounds.length;
  const firstRoundCount = rounds[0]?.length ?? 1;

  // Build revealed rounds array preserving original indices for row-span math
  const revealedRounds = rounds
    .map((round, index) => ({ round, originalIndex: index }))
    .filter(({ originalIndex }) =>
      originalIndex === 0
      || rounds[originalIndex - 1].every((m) => m.winnerId !== null),
    );

  // Shared grid template rows string — all columns use the same row grid
  const gridRows = `repeat(${firstRoundCount}, minmax(90px, 1fr))`;

  // Badge height offset so connector columns align with matchup grids (skip badge row)
  const badgeOffset = "calc(1.25rem + 0.5rem)";

  return (
    <div className="flex flex-row gap-0 overflow-x-auto scrollbar-none p-4">
      {revealedRounds.map(({ round, originalIndex: roundIndex }, revealedPos) => {
        const rowSpan = Math.pow(2, roundIndex);

        return (
          <>
            {/* Round column */}
            <div key={`round-${roundIndex}`} className="flex flex-col flex-shrink-0">
              {/* Round header badge */}
              <div className="flex justify-center mb-2">
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {roundIndex === totalRounds - 1
                    ? "Final"
                    : `Round ${roundIndex + 1} of ${totalRounds}`}
                </Badge>
              </div>

              {/* Grid of matchups */}
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: gridRows,
                  width: "10rem",
                }}
              >
                {round.map((matchup, matchupIndex) => {
                  const rowStart = matchupIndex * rowSpan + 1;
                  return (
                    <div
                      key={matchup.id}
                      style={{ gridRow: `${rowStart} / span ${rowSpan}` }}
                      className="flex items-center"
                    >
                      <BracketMatch
                        matchup={matchup}
                        isActive={matchup.id === activeMatchupId}
                        animating={animating}
                        mode={mode}
                        onTrigger={onTrigger}
                        onResolve={onResolve}
                        onAnimationEnd={onAnimationEnd}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connector column — rendered between this round and the next revealed round */}
            {revealedPos < revealedRounds.length - 1 && (() => {
              const nextRevealed = revealedRounds[revealedPos + 1];
              const nextRoundIndex = nextRevealed.originalIndex;
              const nextRowSpan = Math.pow(2, nextRoundIndex);

              return (
                <div
                  key={`conn-${roundIndex}`}
                  className="flex-shrink-0"
                  style={{
                    display: "grid",
                    gridTemplateRows: gridRows,
                    width: "2rem",
                    marginTop: badgeOffset,
                  }}
                >
                  {nextRevealed.round.map((matchup, matchupIndex) => {
                    const rowStart = matchupIndex * nextRowSpan + 1;
                    return (
                      <div
                        key={`conn-${matchup.id}`}
                        style={{ gridRow: `${rowStart} / span ${nextRowSpan}` }}
                        className="flex items-center"
                      >
                        <div className="bracket-connector">
                          <div className="bracket-connector-vertical" />
                          <div className="bracket-connector-stub-top" />
                          <div className="bracket-connector-stub-bottom" />
                          <div className="bracket-connector-right" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </>
        );
      })}
    </div>
  );
}
