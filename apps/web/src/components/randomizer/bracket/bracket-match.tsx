import { useEffect, useRef, useState } from "react";
import { Card } from "@base-project/web/components/ui/card";
import { cn } from "@base-project/web/lib/utils";
import type { Matchup } from "@base-project/web/lib/randomizer/use-bracket";

type BracketMatchProps = {
  matchup: Matchup;
  isActive: boolean;
  animating: boolean;
  mode: "random" | "judge";
  onResolve: (matchupId: string, winnerId: number) => void;
  onAnimationEnd: (matchupId: string) => void;
};

export function BracketMatch({
  matchup,
  isActive,
  animating,
  mode,
  onResolve,
  onAnimationEnd,
}: BracketMatchProps) {
  const [showWinnerFlash, setShowWinnerFlash] = useState(false);
  const [vsVisible, setVsVisible] = useState(false);
  // Guard to prevent double-firing animation end
  const animationFiredRef = useRef(false);

  useEffect(() => {
    if (!isActive || !animating) {
      setShowWinnerFlash(false);
      setVsVisible(false);
      animationFiredRef.current = false;
      return;
    }

    animationFiredRef.current = false;
    setVsVisible(true);

    // After shake phase (~600ms), show winner flash
    const flashTimer = setTimeout(() => {
      setShowWinnerFlash(true);
    }, 600);

    // After full animation, call onAnimationEnd
    const endTimer = setTimeout(() => {
      if (!animationFiredRef.current) {
        animationFiredRef.current = true;
        onAnimationEnd(matchup.id);
      }
    }, 1200);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(endTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, animating]);

  const isAnimationPhase = isActive && animating;
  const isResolved = matchup.winnerId !== null && !isAnimationPhase && !showWinnerFlash;

  // Judge mode: clickable after animation completes and no winner set yet
  const isJudgeClickable = mode === "judge" && isActive && !animating && matchup.winnerId === null;

  function handleOptionClick(entryId: number) {
    if (isJudgeClickable) {
      onResolve(matchup.id, entryId);
    }
  }

  if (matchup.isBye) {
    return (
      <Card className="w-40 border-2 border-dashed border-border/40">
        <div className="px-3 py-2 flex items-center min-h-[44px] text-sm text-muted-foreground italic">
          {matchup.topEntry?.name ?? "BYE"}
        </div>
        <div className="border-t border-border" />
        <div className="px-3 py-2 flex items-center min-h-[44px] text-sm text-muted-foreground italic">
          {matchup.bottomEntry?.name ?? "BYE"}
        </div>
      </Card>
    );
  }

  const topIsWinner = matchup.topEntry !== null && matchup.winnerId === matchup.topEntry.id;
  const bottomIsWinner = matchup.bottomEntry !== null && matchup.winnerId === matchup.bottomEntry.id;

  return (
    <Card
      className={cn(
        "w-40 border-2 relative",
        isActive ? "border-bracket-accent" : "border-border",
      )}
    >
      {/* VS badge overlay — shown during animation */}
      {vsVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span
            className={cn(
              "text-2xl font-bold text-foreground bracket-vs-badge",
              isAnimationPhase && "is-pulsing",
            )}
          >
            VS
          </span>
        </div>
      )}

      {/* Top option */}
      <div
        className={cn(
          "bracket-option px-3 py-2 flex items-center min-h-[44px] text-sm",
          isAnimationPhase && "is-shaking",
          showWinnerFlash && topIsWinner && "is-winner-flash",
          isResolved && topIsWinner && "text-bracket-accent font-bold",
          isResolved && !topIsWinner && matchup.bottomEntry && "text-muted-foreground line-through",
          isJudgeClickable && "cursor-pointer hover:bg-muted/50",
          isAnimationPhase && "pointer-events-none",
        )}
        onClick={() => matchup.topEntry && handleOptionClick(matchup.topEntry.id)}
      >
        {matchup.topEntry?.name ?? ""}
      </div>

      <div className="border-t border-border" />

      {/* Bottom option */}
      <div
        className={cn(
          "bracket-option px-3 py-2 flex items-center min-h-[44px] text-sm",
          isAnimationPhase && "is-shaking",
          showWinnerFlash && bottomIsWinner && "is-winner-flash",
          isResolved && bottomIsWinner && "text-bracket-accent font-bold",
          isResolved && !bottomIsWinner && matchup.topEntry && "text-muted-foreground line-through",
          isJudgeClickable && "cursor-pointer hover:bg-muted/50",
          isAnimationPhase && "pointer-events-none",
        )}
        onClick={() => matchup.bottomEntry && handleOptionClick(matchup.bottomEntry.id)}
      >
        {matchup.bottomEntry?.name ?? ""}
      </div>
    </Card>
  );
}
