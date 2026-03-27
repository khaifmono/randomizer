import { NumberReel } from "./number-reel";

type NumberDisplayProps = {
  digits: number[];
  result: number | null;
  rolling: boolean;
  stoppedReels: boolean[];
  reelDurations: number[];
  min: number;
  max: number;
};

export function NumberDisplay({
  digits,
  result,
  rolling,
  stoppedReels,
  reelDurations,
  min,
  max,
}: NumberDisplayProps) {
  if (digits.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Slot machine frame */}
      <div className="relative px-6 py-5 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-zinc-700 shadow-2xl">
        {/* Top chrome bar */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black text-[10px] font-black uppercase tracking-widest px-4 py-0.5 rounded-full shadow-lg">
          Lucky Number
        </div>

        {/* Reels */}
        <div className="flex flex-row gap-3 justify-center">
          {digits.map((digit, i) => (
            <NumberReel
              key={i}
              targetDigit={digit}
              rolling={rolling}
              durationMs={reelDurations[i] ?? 1000}
              stopped={stoppedReels[i] ?? false}
            />
          ))}
        </div>

        {/* Bottom lights */}
        <div className="flex justify-center gap-2 mt-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: rolling ? "#ffd700" : "#555",
                boxShadow: rolling ? "0 0 6px #ffd700" : "none",
                animation: rolling ? `pulse 0.5s ease-in-out infinite ${i * 0.1}s` : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Range context */}
      <p className="text-sm text-muted-foreground">
        Range: <span className="font-semibold">{min}</span> to <span className="font-semibold">{max}</span>
      </p>

      {/* Result */}
      {result !== null && !rolling && (
        <div className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95 duration-300">
          <p className="text-5xl font-black text-number-accent" style={{ textShadow: "0 0 20px rgba(168,85,247,0.4)" }}>
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
