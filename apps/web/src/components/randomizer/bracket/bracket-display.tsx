import { Crown } from "lucide-react";
import { Badge } from "@base-project/web/components/ui/badge";
import { cn } from "@base-project/web/lib/utils";
import { BracketMatch } from "./bracket-match";
import type { Matchup } from "@base-project/web/lib/randomizer/use-bracket";

function getRoundLabel(roundIndex: number, totalRounds: number): string {
  const roundsFromEnd = totalRounds - 1 - roundIndex;
  if (roundsFromEnd === 0) return "Final";
  if (roundsFromEnd === 1) return "Semi Final";
  if (roundsFromEnd === 2) return "Quarter Final";
  // For earlier rounds, use "Round of N" where N = number of matchups * 2 (entrants in that round)
  const matchupsInRound = Math.pow(2, totalRounds - 1 - roundIndex);
  return `Round of ${matchupsInRound * 2}`;
}

type BracketDisplayProps = {
  rounds: Matchup[][];
  animatingMatchupId: string | null;
  mode: "random" | "judge";
  onTrigger: (matchupId: string) => void;
  onResolve: (matchupId: string, winnerId: number) => void;
  onAnimationEnd: (matchupId: string) => void;
};

export function BracketDisplay({
  rounds,
  animatingMatchupId,
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
  const gridRows = `repeat(${firstRoundCount}, 130px)`;

  // Badge height offset so connector columns align with matchup grids (skip badge row)
  const badgeOffset = "calc(1.25rem + 0.5rem)";

  return (
    <div className="flex flex-row gap-0 p-4 w-max">
      {revealedRounds.map(({ round, originalIndex: roundIndex }, revealedPos) => {
        const rowSpan = Math.pow(2, roundIndex);

        return (
          <>
            {/* Round column */}
            <div key={`round-${roundIndex}`} className="flex flex-col flex-shrink-0">
              {/* Round header badge */}
              <div className="flex justify-center mb-2">
                <Badge variant="outline" className="text-xs text-muted-foreground whitespace-nowrap">
                  {getRoundLabel(roundIndex, totalRounds)}
                </Badge>
              </div>

              {/* Grid of matchups */}
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: gridRows,
                  rowGap: "20px",
                  width: "10rem",
                }}
              >
                {round.map((matchup, matchupIndex) => {
                  const rowStart = matchupIndex * rowSpan + 1;
                  // Add dashed separator between matchup pairs in early rounds
                  const isOddMatchup = matchupIndex % 2 === 1;
                  const isNotLastMatchup = matchupIndex < round.length - 1;
                  const showSeparator = roundIndex === 0 && isOddMatchup && isNotLastMatchup;
                  return (
                    <div
                      key={matchup.id}
                      style={{ gridRow: `${rowStart} / span ${rowSpan}` }}
                      className={cn(
                        "flex items-center",
                        showSeparator && "border-b border-dashed border-border/60",
                      )}
                    >
                      <BracketMatch
                        matchup={matchup}
                        isAnimating={matchup.id === animatingMatchupId}
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
                    rowGap: "20px",
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

      {/* Champion column — shown when final matchup has a winner */}
      {(() => {
        const finalRound = rounds[rounds.length - 1];
        const finalMatchup = finalRound?.[0];
        if (!finalMatchup?.winnerId) return null;
        const winner =
          finalMatchup.topEntry?.id === finalMatchup.winnerId
            ? finalMatchup.topEntry
            : finalMatchup.bottomEntry;
        if (!winner) return null;

        return (
          <>
            {/* Connector to champion */}
            <div
              className="flex-shrink-0"
              style={{
                display: "grid",
                gridTemplateRows: gridRows,
                rowGap: "20px",
                width: "2rem",
                marginTop: badgeOffset,
              }}
            >
              <div
                style={{ gridRow: `1 / span ${firstRoundCount}` }}
                className="flex items-center"
              >
                <div className="relative w-full h-full">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-bracket-accent" style={{ transform: "translateY(-1px)" }} />
                </div>
              </div>
            </div>

            {/* Champion card */}
            <div className="flex flex-col flex-shrink-0">
              <div className="flex justify-center mb-2">
                <Badge variant="outline" className="text-xs text-bracket-accent border-bracket-accent">
                  Champion
                </Badge>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: gridRows,
                  rowGap: "20px",
                  width: "10rem",
                }}
              >
                <div
                  style={{ gridRow: `1 / span ${firstRoundCount}` }}
                  className="flex items-center"
                >
                  <div className="w-full rounded-lg border-2 border-bracket-accent bg-bracket-accent text-white px-3 py-3 flex items-center gap-2 font-bold text-sm shadow-lg overflow-hidden">
                    <Crown className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{winner.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
