import { Users } from "lucide-react";
import type { ShuffleResult } from "@base-project/web/lib/randomizer/use-teams";

type TeamsDisplayProps = {
  result: ShuffleResult | null;
  shuffling: boolean;
};

export function TeamsDisplay({ result, shuffling }: TeamsDisplayProps) {
  if (shuffling) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground animate-pulse">
        <Users className="h-5 w-5" />
        <span>Shuffling...</span>
      </div>
    );
  }

  if (result === null) {
    return null;
  }

  if (result.mode === "pick-one") {
    return (
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground font-medium">Picked</p>
        <p className="text-4xl font-bold text-teams-accent" data-testid="picked-result">
          {result.picked ?? "(none)"}
        </p>
      </div>
    );
  }

  // split mode
  return (
    <div className="flex flex-wrap gap-3 justify-center" data-testid="split-result">
      {result.teams!.map((team, i) => (
        <div key={i} className="rounded-lg border border-border p-3 min-w-[100px] space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">Team {i + 1}</p>
          {team.map((name, j) => (
            <p key={j} className="text-sm font-medium">{name}</p>
          ))}
          {team.length === 0 && (
            <p className="text-xs text-muted-foreground italic">empty</p>
          )}
        </div>
      ))}
    </div>
  );
}
