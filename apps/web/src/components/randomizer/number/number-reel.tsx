type NumberReelProps = {
  targetDigit: number;
  rolling: boolean;
  durationMs: number;
  stopped: boolean;
};

// Build an array of digits: 0-9 repeated 3 times (30 items), then the target digit
// This creates the illusion of scrolling through many digits before landing
const REPEAT_COUNT = 3;
const DIGITS_PER_CYCLE = 10;

export function NumberReel({ targetDigit, rolling, durationMs, stopped }: NumberReelProps) {
  const allDigits: number[] = [];
  for (let i = 0; i < REPEAT_COUNT; i++) {
    for (let d = 0; d < DIGITS_PER_CYCLE; d++) {
      allDigits.push(d);
    }
  }
  // Add the target digit at the end (index 30)
  allDigits.push(targetDigit);

  // --reel-target scrolls past 30 digits (3 cycles of 0-9) then lands on target
  const reelTarget = `-${(REPEAT_COUNT * DIGITS_PER_CYCLE + targetDigit) * 60}px`;

  let stripClass = "number-reel-strip";
  if (rolling && !stopped) {
    stripClass += " reel-spinning";
  } else if (stopped) {
    stripClass += " reel-stopped";
  }

  return (
    <div className="number-reel">
      <div
        className={stripClass}
        style={{
          "--reel-target": reelTarget,
          "--reel-duration": `${durationMs}ms`,
        } as React.CSSProperties}
      >
        {allDigits.map((digit, i) => (
          <div key={i} className="number-reel-digit">
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}
