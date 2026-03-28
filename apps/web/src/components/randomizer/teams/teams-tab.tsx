import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useTeams, ANIMATION_DURATION } from "@base-project/web/lib/randomizer/use-teams";
import { TeamsNameEntry } from "./teams-name-entry";
import { TeamsControls } from "./teams-controls";
import { TeamsDisplay } from "./teams-display";
import type { HistoryEntry } from "@base-project/web/lib/randomizer/types";
import { TutorialButton } from "@base-project/web/components/randomizer/tutorial-modal";
import { teamsTutorial } from "@base-project/web/components/randomizer/tutorials";

type TeamsTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

export function TeamsTab({ onHistoryChange }: TeamsTabProps) {
  const {
    names,
    mode,
    teamCount,
    shuffling,
    result,
    history,
    setNames,
    setMode,
    setTeamCount,
    startShuffle,
    onShuffleEnd,
  } = useTeams();

  const [rawText, setRawText] = useState("");

  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  function handleTextChange(text: string) {
    setRawText(text);
    const parsed = text.split("\n").map((s) => s.trim()).filter(Boolean);
    setNames(parsed);
  }

  useEffect(() => {
    if (!shuffling) return;
    const timer = setTimeout(onShuffleEnd, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [shuffling, onShuffleEnd]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <TutorialButton toolName="Team Shuffler" accentColor="#8b5cf6" steps={teamsTutorial} />

      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold">Team Shuffler</h2>
        <p className="text-sm text-muted-foreground text-center">Enter names and randomly pick one or split into teams</p>
      </div>

      <TeamsNameEntry
        rawText={rawText}
        onChange={handleTextChange}
        disabled={shuffling}
      />
      <TeamsControls
        mode={mode}
        teamCount={teamCount}
        shuffling={shuffling}
        nameCount={names.length}
        onSetMode={setMode}
        onSetTeamCount={setTeamCount}
        onShuffle={startShuffle}
      />
      <TeamsDisplay result={result} shuffling={shuffling} />
    </div>
  );
}
