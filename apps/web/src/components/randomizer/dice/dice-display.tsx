import { DieCube } from "./die-cube";

type DiceDisplayProps = {
  count: number;
  results: number[];
  rolling: boolean;
};

export function DiceDisplay({ count, results, rolling }: DiceDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {Array.from({ length: count }, (_, i) => (
        <DieCube key={i} value={results[i] || 1} rolling={rolling} />
      ))}
    </div>
  );
}
