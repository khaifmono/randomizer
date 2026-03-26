import { cn } from "@base-project/web/lib/utils";

type CoinFaceProps = {
  value: "heads" | "tails";
  flipping: boolean;
};

export function CoinFace({ value, flipping }: CoinFaceProps) {
  return (
    <div className="coin-scene">
      <div
        className={cn(
          "coin-disc",
          // CRITICAL: class is EITHER "coin-flipping" OR "coin-show-*", never both
          flipping ? "coin-flipping" : (value === "heads" ? "coin-show-heads" : "coin-show-tails")
        )}
      >
        <div className="coin-face coin-face-heads">H</div>
        <div className="coin-face coin-face-tails">T</div>
      </div>
    </div>
  );
}
