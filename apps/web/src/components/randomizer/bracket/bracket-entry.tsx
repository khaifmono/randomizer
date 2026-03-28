import { useState } from "react";
import { Button } from "@base-project/web/components/ui/button";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { cn } from "@base-project/web/lib/utils";
import { Textarea } from "@base-project/web/components/ui/textarea";
import { Input } from "@base-project/web/components/ui/input";
import { Trophy, Dices, Gavel, Swords, Plus } from "lucide-react";

type BracketEntryProps = {
  entries: string[];
  onAddEntry: (name: string) => void;
  onSetEntries: (names: string[]) => void;
  onStart: () => void;
  mode: "random" | "judge";
  onSetMode: (mode: "random" | "judge") => void;
  disabled: boolean;
};

export function BracketEntry({
  entries,
  onAddEntry,
  onSetEntries,
  onStart,
  mode,
  onSetMode,
  disabled,
}: BracketEntryProps) {
  const [singleInput, setSingleInput] = useState("");
  const [rawText, setRawText] = useState("");
  const [attempted, setAttempted] = useState(false);

  function handleTextareaChange(value: string) {
    setRawText(value);
    const lines = value
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    onSetEntries(lines);
  }

  function handleAddSingle() {
    const trimmed = singleInput.trim();
    if (!trimmed) return;
    onAddEntry(trimmed);
    const newRaw = rawText ? `${rawText}\n${trimmed}` : trimmed;
    setRawText(newRaw);
    setSingleInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSingle();
    }
  }

  function handleStart() {
    setAttempted(true);
    if (entries.length >= 2) {
      onStart();
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
          <Trophy className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold">Create Tournament</h2>
        <p className="text-sm text-muted-foreground text-center">Add 2-16 options and let them battle head-to-head</p>
      </div>

      {/* Options card */}
      <Card className="border-2 border-border/60">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-bracket-accent" />
            <span className="text-sm font-semibold">Contenders</span>
            {entries.length > 0 && (
              <span className="ml-auto text-xs font-medium bg-bracket-accent/10 text-bracket-accent px-2 py-0.5 rounded-full">
                {entries.length} entered
              </span>
            )}
          </div>
          <Textarea
            id="bracket-options"
            rows={5}
            placeholder="One option per line...&#10;Pizza&#10;Sushi&#10;Tacos&#10;Burgers"
            value={rawText}
            onChange={(e) => handleTextareaChange(e.target.value)}
            className="resize-none"
          />
          <div className="flex gap-2">
            <Input
              placeholder="Add an option..."
              value={singleInput}
              onChange={(e) => setSingleInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddSingle} type="button" size="icon" className="bg-bracket-accent hover:bg-bracket-accent/90 text-white shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {attempted && entries.length < 2 && (
            <p className="text-sm text-destructive">Add at least 2 options to start.</p>
          )}
        </CardContent>
      </Card>

      {/* Mode selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSetMode("random")}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            mode === "random"
              ? "border-bracket-accent bg-bracket-accent/5 shadow-md shadow-bracket-accent/10"
              : "border-border/60 hover:border-bracket-accent/40 hover:bg-muted/30",
          )}
        >
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
            mode === "random" ? "bg-bracket-accent text-white" : "bg-muted text-muted-foreground",
          )}>
            <Dices className="h-5 w-5" />
          </div>
          <span className={cn("text-sm font-semibold", mode === "random" ? "text-bracket-accent" : "text-foreground")}>
            Random
          </span>
          <span className="text-[11px] text-muted-foreground text-center leading-tight">
            Click a matchup to auto-pick the winner with VS animation
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSetMode("judge")}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
            mode === "judge"
              ? "border-bracket-accent bg-bracket-accent/5 shadow-md shadow-bracket-accent/10"
              : "border-border/60 hover:border-bracket-accent/40 hover:bg-muted/30",
          )}
        >
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
            mode === "judge" ? "bg-bracket-accent text-white" : "bg-muted text-muted-foreground",
          )}>
            <Gavel className="h-5 w-5" />
          </div>
          <span className={cn("text-sm font-semibold", mode === "judge" ? "text-bracket-accent" : "text-foreground")}>
            Judge
          </span>
          <span className="text-[11px] text-muted-foreground text-center leading-tight">
            Click the player you want to advance — you decide who wins
          </span>
        </button>
      </div>

      {/* Start button */}
      <Button
        type="button"
        size="lg"
        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold text-base shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-transform"
        disabled={entries.length < 2 || disabled}
        onClick={handleStart}
      >
        <Swords className="h-5 w-5" />
        Start Tournament
      </Button>
    </div>
  );
}
