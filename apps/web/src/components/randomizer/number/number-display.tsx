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
    <div className="flex flex-col items-center gap-4">
      {/* Reels — always visible when digits exist */}
      <div className="flex flex-row gap-2 justify-center">
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

      {/* Range context — always show */}
      <p className="text-sm text-muted-foreground">from {min} to {max}</p>

      {/* Result text after animation */}
      {result !== null && !rolling && (
        <p className="text-4xl font-bold text-number-accent">{result}</p>
      )}
    </div>
  );
}
