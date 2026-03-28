import { Minus, Plus, Loader2, Shuffle, UserRound, Users } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";
import { cn } from "@base-project/web/lib/utils";

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
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Mode selection cards */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          type="button"
          onClick={() => onSetMode("pick-one")}
          disabled={shuffling}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            mode === "pick-one"
              ? "border-teams-accent bg-teams-accent/5 shadow-md shadow-teams-accent/10"
              : "border-border/60 hover:border-teams-accent/40 hover:bg-muted/30",
          )}
        >
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
            mode === "pick-one" ? "bg-teams-accent text-white" : "bg-muted text-muted-foreground",
          )}>
            <UserRound className="h-5 w-5" />
          </div>
          <span className={cn("text-sm font-semibold", mode === "pick-one" ? "text-teams-accent" : "text-foreground")}>
            Pick One
          </span>
          <span className="text-[11px] text-muted-foreground text-center leading-tight">
            Randomly select one person from the list
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode("split")}
          disabled={shuffling}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            mode === "split"
              ? "border-teams-accent bg-teams-accent/5 shadow-md shadow-teams-accent/10"
              : "border-border/60 hover:border-teams-accent/40 hover:bg-muted/30",
          )}
        >
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
            mode === "split" ? "bg-teams-accent text-white" : "bg-muted text-muted-foreground",
          )}>
            <Users className="h-5 w-5" />
          </div>
          <span className={cn("text-sm font-semibold", mode === "split" ? "text-teams-accent" : "text-foreground")}>
            Split Teams
          </span>
          <span className="text-[11px] text-muted-foreground text-center leading-tight">
            Divide everyone into balanced random teams
          </span>
        </button>
      </div>

      {/* Team count stepper — only shown when in split mode */}
      {mode === "split" && (
        <div className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2.5 border border-border/40">
          <span className="text-sm text-muted-foreground font-medium">Teams</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onSetTeamCount(teamCount - 1)}
            disabled={teamCount === 2 || shuffling}
            aria-label="Decrease team count"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-8 text-center text-base font-bold">{teamCount}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onSetTeamCount(teamCount + 1)}
            disabled={teamCount === 8 || shuffling}
            aria-label="Increase team count"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Shuffle button */}
      <Button
        onClick={onShuffle}
        disabled={shuffling || nameCount === 0}
        size="lg"
        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-violet-500/25 active:scale-[0.98] transition-transform"
      >
        {shuffling ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Shuffling...
          </>
        ) : (
          <>
            <Shuffle className="h-5 w-5" />
            Shuffle
          </>
        )}
      </Button>
    </div>
  );
}
