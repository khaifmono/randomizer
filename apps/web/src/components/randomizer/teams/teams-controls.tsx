import { Minus, Plus, Loader2, Users } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";

type TeamsControlsProps = {
  mode: "pick-one" | "split";
  teamCount: number;
  shuffling: boolean;
  nameCount: number;
  onSetMode: (mode: "pick-one" | "split") => void;
  onSetTeamCount: (n: number) => void;
  onShuffle: () => void;
};

export function TeamsControls({
  mode,
  teamCount,
  shuffling,
  nameCount,
  onSetMode,
  onSetTeamCount,
  onShuffle,
}: TeamsControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[260px]">
      {/* Mode toggle row */}
      <div className="flex gap-2 w-full">
        <Button
          className={
            mode === "pick-one"
              ? "flex-1 bg-teams-accent text-white hover:bg-teams-accent/90 font-semibold"
              : "flex-1 border-teams-accent text-teams-accent"
          }
          variant={mode === "pick-one" ? "default" : "outline"}
          onClick={() => onSetMode("pick-one")}
          disabled={shuffling}
        >
          Pick One
        </Button>
        <Button
          className={
            mode === "split"
              ? "flex-1 bg-teams-accent text-white hover:bg-teams-accent/90 font-semibold"
              : "flex-1 border-teams-accent text-teams-accent"
          }
          variant={mode === "split" ? "default" : "outline"}
          onClick={() => onSetMode("split")}
          disabled={shuffling}
        >
          Split Teams
        </Button>
      </div>

      {/* Team count stepper — only shown when in split mode */}
      {mode === "split" && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSetTeamCount(teamCount - 1)}
            disabled={teamCount === 2 || shuffling}
            aria-label="Decrease team count"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-base font-semibold">{teamCount}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSetTeamCount(teamCount + 1)}
            disabled={teamCount === 8 || shuffling}
            aria-label="Increase team count"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Shuffle button */}
      <Button
        onClick={onShuffle}
        disabled={shuffling || nameCount === 0}
        className="w-full bg-teams-accent text-white hover:bg-teams-accent/90 font-semibold"
      >
        {shuffling ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Shuffling...
          </>
        ) : (
          <>
            <Users className="h-4 w-4" />
            Shuffle
          </>
        )}
      </Button>
    </div>
  );
}
