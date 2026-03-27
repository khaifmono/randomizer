import { useState, useEffect } from "react";
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

  // rawText is local UI state — the textarea value
  // names in hook are the parsed array; we keep rawText here, parse on change
  const [rawText, setRawText] = useState("");

  // Sync history up to RandomizerPage for the shared history panel
  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  // Parse rawText into names array and sync to hook
  function handleTextChange(text: string) {
    setRawText(text);
    const parsed = text.split("\n").map((s) => s.trim()).filter(Boolean);
    setNames(parsed);
  }

  // Trigger onShuffleEnd after the CSS animation window closes
  useEffect(() => {
    if (!shuffling) return;
    const timer = setTimeout(onShuffleEnd, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [shuffling, onShuffleEnd]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      <TutorialButton toolName="Team Shuffler" accentColor="#8b5cf6" steps={teamsTutorial} />
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
