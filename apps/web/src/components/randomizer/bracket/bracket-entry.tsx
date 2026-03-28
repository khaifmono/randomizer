import { useState } from "react";
import { Button } from "@base-project/web/components/ui/button";
import { Card, CardContent } from "@base-project/web/components/ui/card";
import { Textarea } from "@base-project/web/components/ui/textarea";
import { Input } from "@base-project/web/components/ui/input";
import { Label } from "@base-project/web/components/ui/label";

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
    // Also append to textarea
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
    <div className="flex flex-col gap-3 w-full max-w-3xl">
      <Card>
        <CardContent className="p-4 space-y-3">
          <Label htmlFor="bracket-options">Options</Label>
          <Textarea
            id="bracket-options"
            rows={6}
            placeholder="One option per line..."
            value={rawText}
            onChange={(e) => handleTextareaChange(e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Add an option..."
              value={singleInput}
              onChange={(e) => setSingleInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddSingle} type="button">
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{entries.length} options</p>
          {attempted && entries.length < 2 && (
            <p className="text-sm text-destructive">Add at least 2 options to start.</p>
          )}
        </CardContent>
      </Card>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "random" ? "default" : "outline"}
          onClick={() => onSetMode("random")}
          disabled={disabled}
          className="flex-1"
        >
          Random
        </Button>
        <Button
          type="button"
          variant={mode === "judge" ? "default" : "outline"}
          onClick={() => onSetMode("judge")}
          disabled={disabled}
          className="flex-1"
        >
          Judge
        </Button>
      </div>

      {/* Start button */}
      <Button
        type="button"
        className="w-full"
        disabled={entries.length < 2 || disabled}
        onClick={handleStart}
      >
        Start Tournament
      </Button>
    </div>
  );
}
