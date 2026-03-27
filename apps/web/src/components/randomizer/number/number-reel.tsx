type NumberReelProps = {
  targetDigit: number;
  rolling: boolean;
  durationMs: number;
  stopped: boolean;
};

const REPEAT_COUNT = 3;
const DIGITS_PER_CYCLE = 10;
const DIGIT_HEIGHT = 80;

export function NumberReel({ targetDigit, rolling, durationMs, stopped }: NumberReelProps) {
  const allDigits: number[] = [];
  for (let i = 0; i < REPEAT_COUNT; i++) {
    for (let d = 0; d < DIGITS_PER_CYCLE; d++) {
      allDigits.push(d);
    }
  }
  allDigits.push(targetDigit);

  const targetIndex = REPEAT_COUNT * DIGITS_PER_CYCLE;
  const reelTarget = `-${targetIndex * DIGIT_HEIGHT}px`;

  // Idle: show target digit directly (no animation)
  const idleOffset = `-${targetDigit * DIGIT_HEIGHT}px`;

  let stripClass = "number-reel-strip";
  let stripStyle: React.CSSProperties;

  if (rolling && !stopped) {
    stripClass += " reel-spinning";
    stripStyle = {
      "--reel-target": reelTarget,
      "--reel-duration": `${durationMs}ms`,
    } as React.CSSProperties;
  } else if (stopped) {
    stripClass += " reel-stopped";
    stripStyle = {
      "--reel-target": reelTarget,
    } as React.CSSProperties;
  } else {
    // Idle — show current target digit without animation
    stripStyle = {
      transform: `translateY(${idleOffset})`,
    };
  }

  return (
    <div className="number-reel">
      <div className={stripClass} style={stripStyle}>
        {allDigits.map((digit, i) => (
          <div key={i} className="number-reel-digit">
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}
