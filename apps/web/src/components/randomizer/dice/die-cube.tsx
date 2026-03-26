import { cn } from "@base-project/web/lib/utils";

// Static lookup — each key maps to the 3x3 grid indices where pips are rendered
const PIP_POSITIONS: Record<number, number[]> = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

type DieCubeProps = {
  value: number;
  rolling: boolean;
};

export function DieCube({ value, rolling }: DieCubeProps) {
  return (
    <div className="dice-scene">
      <div
        className={cn(
          "dice-cube",
          // CRITICAL: class is EITHER "dice-rolling" OR "dice-show-N", never both
          rolling ? "dice-rolling" : `dice-show-${value}`
        )}
      >
        {[1, 2, 3, 4, 5, 6].map((face) => (
          <div
            key={face}
            className={cn(
              "dice-face",
              `dice-face-${face}`,
              "bg-white border-2 border-neutral-800 rounded-lg"
            )}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="flex items-center justify-center">
                {PIP_POSITIONS[face].includes(i) && (
                  <div className="w-2.5 h-2.5 rounded-full bg-dice-accent" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
