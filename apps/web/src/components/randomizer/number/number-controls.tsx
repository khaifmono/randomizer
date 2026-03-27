import { useState } from "react";
import { Hash, Loader2 } from "lucide-react";
import { Button } from "@base-project/web/components/ui/button";
import { cn } from "@base-project/web/lib/utils";

const PRESETS = [
  { label: "1-10", min: 1, max: 10 },
  { label: "1-100", min: 1, max: 100 },
  { label: "1-1000", min: 1, max: 1000 },
];

type NumberControlsProps = {
  min: number;
  max: number;
  rolling: boolean;
  onSetRange: (min: number, max: number) => void;
  onGenerate: () => void;
};

export function NumberControls({ min, max, rolling, onSetRange, onGenerate }: NumberControlsProps) {
  const [localMin, setLocalMin] = useState(String(min));
  const [localMax, setLocalMax] = useState(String(max));

  // Keep local inputs in sync when min/max change from outside (e.g., preset selection)
  // We only sync when not actively editing — tracked by using the controlled value pattern
  const activePreset = PRESETS.find((p) => p.min === min && p.max === max);

  function handlePresetClick(preset: { min: number; max: number }) {
    setLocalMin(String(preset.min));
    setLocalMax(String(preset.max));
    onSetRange(preset.min, preset.max);
  }

  function commitRange() {
    const parsedMin = parseInt(localMin, 10);
    const parsedMax = parseInt(localMax, 10);
    if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
      onSetRange(parsedMin, parsedMax);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      commitRange();
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[260px]">
      {/* Preset pills */}
      <div className="flex items-center gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full px-3 text-xs font-medium",
              activePreset?.label === preset.label && "bg-number-accent text-white border-number-accent hover:bg-number-accent/90 hover:text-white"
            )}
            onClick={() => handlePresetClick(preset)}
            disabled={rolling}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Custom inputs */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <label className="text-xs text-muted-foreground">Min</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={commitRange}
            onKeyDown={handleKeyDown}
            disabled={rolling}
            className="w-20 px-2 py-1 text-center border rounded-md bg-background text-foreground text-sm disabled:opacity-50"
          />
        </div>
        <span className="text-muted-foreground mt-4">to</span>
        <div className="flex flex-col items-center gap-1">
          <label className="text-xs text-muted-foreground">Max</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={commitRange}
            onKeyDown={handleKeyDown}
            disabled={rolling}
            className="w-20 px-2 py-1 text-center border rounded-md bg-background text-foreground text-sm disabled:opacity-50"
          />
        </div>
      </div>

      {/* Generate button */}
      <Button
        onClick={onGenerate}
        disabled={rolling}
        className="w-full bg-number-accent text-white hover:bg-number-accent/90 font-semibold"
      >
        {rolling ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Rolling...
          </>
        ) : (
          <>
            <Hash className="h-4 w-4" />
            Generate
          </>
        )}
      </Button>
    </div>
  );
}
