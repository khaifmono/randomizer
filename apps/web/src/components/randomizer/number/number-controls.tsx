import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
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
    <div className="flex flex-col items-center gap-5 w-full max-w-[360px]">
      {/* Preset chips */}
      <div className="flex items-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all border-2",
              activePreset?.label === preset.label
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black border-orange-400 shadow-lg shadow-orange-500/20"
                : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
            )}
            onClick={() => handlePresetClick(preset)}
            disabled={rolling}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom range inputs */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Min</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={commitRange}
            onKeyDown={handleKeyDown}
            disabled={rolling}
            className="w-24 px-3 py-2.5 text-center border-2 border-zinc-700 rounded-lg bg-zinc-900 text-white text-base font-bold disabled:opacity-50 focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>
        <span className="text-zinc-500 mt-4 font-bold">to</span>
        <div className="flex flex-col items-center gap-1">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Max</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={commitRange}
            onKeyDown={handleKeyDown}
            disabled={rolling}
            className="w-24 px-3 py-2.5 text-center border-2 border-zinc-700 rounded-lg bg-zinc-900 text-white text-base font-bold disabled:opacity-50 focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Pull the lever button */}
      <Button
        onClick={onGenerate}
        disabled={rolling}
        size="lg"
        className={cn(
          "w-full font-black text-lg uppercase tracking-wider h-14",
          rolling
            ? "bg-zinc-700 text-zinc-400"
            : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-black hover:from-orange-400 hover:via-amber-400 hover:to-orange-400 shadow-lg shadow-orange-500/30 active:scale-95 transition-transform"
        )}
      >
        {rolling ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Spinning...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Pull the Lever!
          </>
        )}
      </Button>
    </div>
  );
}
