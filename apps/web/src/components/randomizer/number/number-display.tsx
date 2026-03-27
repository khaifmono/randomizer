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
  // Show reel animation while rolling or while digits exist
  if (digits.length > 0 && (rolling || result === null)) {
    return (
      <div className="flex flex-col items-center gap-4">
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
      </div>
    );
  }

  // After animation completes: show large result with range context
  if (result !== null && !rolling && digits.length > 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-5xl font-bold text-number-accent">{result}</p>
        <p className="text-sm text-muted-foreground">from {min} to {max}</p>
      </div>
    );
  }

  // Initial state: nothing to show yet
  return null;
}
