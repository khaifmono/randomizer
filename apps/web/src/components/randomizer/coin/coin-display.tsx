import { CoinFace } from "./coin-face";

type CoinDisplayProps = {
  count: number;
  results: ("heads" | "tails")[];
  flipping: boolean;
};

export function CoinDisplay({ count, results, flipping }: CoinDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {Array.from({ length: count }, (_, i) => (
        <CoinFace key={i} value={results[i] || "heads"} flipping={flipping} />
      ))}
    </div>
  );
}
