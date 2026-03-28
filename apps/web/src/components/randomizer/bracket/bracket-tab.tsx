import { useEffect } from "react";
import { useBracket } from "@base-project/web/lib/randomizer/use-bracket";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { TutorialButton } from "@base-project/web/components/randomizer/tutorial-modal";
import { bracketTutorial } from "@base-project/web/components/randomizer/tutorials";
import { BracketEntry } from "./bracket-entry";
import { BracketDisplay } from "./bracket-display";
import { BracketWinner } from "./bracket-winner";

type BracketTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

export function BracketTab({ onHistoryChange }: BracketTabProps) {
  const {
    entries,
    mode,
    bracketState,
    history,
    addEntry,
    setEntries,
    setMode,
    startTournament,
    resolveMatchup,
    onAnimationEnd,
    resetBracket,
  } = useBracket();

  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
      <TutorialButton
        toolName="Bracket Tournament"
        accentColor="#eab308"
        steps={bracketTutorial}
      />

      {bracketState.phase === "entry" && (
        <BracketEntry
          entries={entries}
          onAddEntry={addEntry}
          onSetEntries={setEntries}
          onStart={startTournament}
          mode={mode}
          onSetMode={setMode}
          disabled={false}
        />
      )}

      {bracketState.phase === "playing" && (
        <BracketDisplay
          rounds={bracketState.rounds}
          activeMatchupId={bracketState.activeMatchupId}
          animating={bracketState.animating}
          mode={mode}
          onResolve={resolveMatchup}
          onAnimationEnd={onAnimationEnd}
        />
      )}

      {bracketState.phase === "complete" && (
        <BracketWinner
          winnerId={bracketState.winnerId}
          entries={entries}
          onReset={resetBracket}
        />
      )}
    </div>
  );
}
