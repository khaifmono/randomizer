import { useEffect, useState } from "react";
import { RotateCcw, Undo2 } from "lucide-react";
import { playThud, playDing } from "@base-project/web/lib/randomizer/sounds";
import { useBracket } from "@base-project/web/lib/randomizer/use-bracket";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { Button } from "@base-project/web/components/ui/button";
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
    canUndo,
    addEntry,
    setEntries,
    setMode,
    startTournament,
    triggerMatchup,
    resolveMatchup,
    onAnimationEnd,
    resetBracket,
    undoLastResolve,
  } = useBracket();

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  const isPlaying = bracketState.phase === "playing";
  const isComplete = bracketState.phase === "complete";
  const showBracket = isPlaying || isComplete;

  function handleRestart() {
    setShowConfirm(false);
    resetBracket();
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <TutorialButton
        toolName="Bracket Tournament"
        accentColor="#06b6d4"
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

      {showBracket && (
        <>
          <div className="relative w-full overflow-auto flex justify-center">
            <BracketDisplay
              rounds={bracketState.rounds}
              animatingMatchupId={isPlaying ? bracketState.animatingMatchupId : null}
              mode={mode}
              onTrigger={(id) => { triggerMatchup(id); playThud(); }}
              onResolve={(id, wid) => { resolveMatchup(id, wid); playDing(); }}
              onAnimationEnd={onAnimationEnd}
            />

            {isComplete && (
              <BracketWinner
                winnerId={bracketState.winnerId}
                entries={entries}
                onReset={resetBracket}
              />
            )}
          </div>

          {/* Undo + Restart buttons */}
          <div className="flex gap-3">
            {canUndo && (
              <Button
                variant="outline"
                onClick={undoLastResolve}
              >
                <Undo2 className="h-4 w-4" />
                Undo
              </Button>
            )}
            <Button
              variant="outline"
              className="text-muted-foreground"
              onClick={() => setShowConfirm(true)}
            >
              <RotateCcw className="h-4 w-4" />
              Restart Tournament
            </Button>
          </div>
        </>
      )}

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl border shadow-2xl p-6 max-w-sm mx-4 flex flex-col gap-4">
            <h3 className="text-lg font-bold">Restart Tournament?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to restart? All progress will be lost.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRestart}
              >
                Restart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
