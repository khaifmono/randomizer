import { useEffect, useRef, useState } from "react";
import { cn } from "@base-project/web/lib/utils";
import type { Matchup } from "@base-project/web/lib/randomizer/use-bracket";
import { isMatchupReady } from "@base-project/web/lib/randomizer/use-bracket";

type BracketMatchProps = {
  matchup: Matchup;
  isAnimating: boolean;
  mode: "random" | "judge";
  onTrigger: (matchupId: string) => void;
  onResolve: (matchupId: string, winnerId: number) => void;
  onAnimationEnd: (matchupId: string) => void;
};

export function BracketMatch({
  matchup,
  isAnimating,
  mode,
  onTrigger,
  onResolve,
  onAnimationEnd,
}: BracketMatchProps) {
  const [showWinnerFlash, setShowWinnerFlash] = useState(false);
  const [vsVisible, setVsVisible] = useState(false);
  const animationFiredRef = useRef(false);

  useEffect(() => {
    if (!isAnimating) {
      setShowWinnerFlash(false);
      setVsVisible(false);
      animationFiredRef.current = false;
      return;
    }

    animationFiredRef.current = false;
    setVsVisible(true);

    const flashTimer = setTimeout(() => {
      setShowWinnerFlash(true);
    }, 600);

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
  }, [isAnimating]);

  const ready = isMatchupReady(matchup);
  const isResolved = matchup.winnerId !== null && !isAnimating && !showWinnerFlash;

  // Judge mode: option boxes are directly clickable when matchup is ready
  const isJudgeClickable = mode === "judge" && ready && !isAnimating;

  // Random mode: click the card to trigger animation
  const canTriggerRandom = mode === "random" && ready && !isAnimating;

  function handleCardClick() {
    if (canTriggerRandom) {
      onTrigger(matchup.id);
    }
  }

  function handleOptionClick(entryId: number, e: React.MouseEvent) {
    if (isJudgeClickable) {
      e.stopPropagation();
      onResolve(matchup.id, entryId);
    }
  }

  const topIsWinner = matchup.topEntry !== null && matchup.winnerId === matchup.topEntry.id;
  const bottomIsWinner = matchup.bottomEntry !== null && matchup.winnerId === matchup.bottomEntry.id;

  if (matchup.isBye) {
    const realEntry = matchup.topEntry?.isBye ? matchup.bottomEntry : matchup.topEntry;
    return (
      <div className="flex flex-col items-center gap-1 w-40">
        <div className="w-full rounded-lg border-2 border-dashed border-border/40 px-3 py-2 min-h-[44px] flex items-center text-sm text-muted-foreground italic overflow-hidden">
          <span className="truncate">{realEntry?.name ?? "BYE"}</span>
        </div>
        <span className="text-xs text-muted-foreground italic">BYE</span>
        <div className="w-full rounded-lg border-2 border-dashed border-border/40 px-3 py-2 min-h-[44px] flex items-center text-sm text-muted-foreground italic">
          BYE
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 w-40",
        (canTriggerRandom || isJudgeClickable) && "cursor-pointer",
      )}
      onClick={handleCardClick}
    >
      {/* Top option box */}
      <div
        className={cn(
          "bracket-option w-full rounded-lg border-2 px-3 py-2 min-h-[44px] flex items-center text-sm transition-colors overflow-hidden",
          isAnimating ? "border-red-500" : (ready || isJudgeClickable) ? "border-bracket-accent" : "border-border",
          isAnimating && "is-shaking",
          showWinnerFlash && topIsWinner && "is-winner-flash",
          isResolved && topIsWinner && "bg-bracket-accent text-white font-bold border-bracket-accent",
          isResolved && !topIsWinner && matchup.bottomEntry && "text-muted-foreground line-through border-border/40",
          isJudgeClickable && "cursor-pointer hover:bg-bracket-accent hover:text-white",
          isAnimating && "pointer-events-none",
        )}
        onClick={(e) => matchup.topEntry && handleOptionClick(matchup.topEntry.id, e)}
      >
        <span className="truncate">{matchup.topEntry?.name ?? ""}</span>
      </div>

      {/* VS label between boxes */}
      <span
        className={cn(
          "text-xs font-bold text-muted-foreground select-none",
          isAnimating && "text-red-500 text-sm font-black",
          vsVisible && !isAnimating && "text-foreground text-sm bracket-vs-badge",
          isAnimating && vsVisible && "is-pulsing text-base",
        )}
      >
        VS
      </span>

      {/* Bottom option box */}
      <div
        className={cn(
          "bracket-option w-full rounded-lg border-2 px-3 py-2 min-h-[44px] flex items-center text-sm transition-colors overflow-hidden",
          isAnimating ? "border-red-500" : (ready || isJudgeClickable) ? "border-bracket-accent" : "border-border",
          isAnimating && "is-shaking",
          showWinnerFlash && bottomIsWinner && "is-winner-flash",
          isResolved && bottomIsWinner && "bg-bracket-accent text-white font-bold border-bracket-accent",
          isResolved && !bottomIsWinner && matchup.topEntry && "text-muted-foreground line-through border-border/40",
          isJudgeClickable && "cursor-pointer hover:bg-bracket-accent hover:text-white",
          isAnimating && "pointer-events-none",
        )}
        onClick={(e) => matchup.bottomEntry && handleOptionClick(matchup.bottomEntry.id, e)}
      >
        <span className="truncate">{matchup.bottomEntry?.name ?? ""}</span>
      </div>
    </div>
  );
}
