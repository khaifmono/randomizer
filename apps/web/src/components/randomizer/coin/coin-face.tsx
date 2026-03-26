import { cn } from "@base-project/web/lib/utils";

type CoinFaceProps = {
  value: "heads" | "tails";
  flipping: boolean;
};

function HeadsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Crown */}
      <path d="M16 38L20 24L26 32L32 20L38 32L44 24L48 38Z" fill="currentColor" opacity="0.9" />
      {/* Crown base */}
      <rect x="16" y="38" width="32" height="4" rx="1" fill="currentColor" opacity="0.7" />
      {/* Star on crown */}
      <path d="M32 24L33.5 28L37 28.5L34.5 31L35 34.5L32 33L29 34.5L29.5 31L27 28.5L30.5 28Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function TailsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield */}
      <path d="M32 16L46 22V34C46 42 40 48 32 50C24 48 18 42 18 34V22L32 16Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.15" />
      {/* Inner shield lines */}
      <path d="M32 22L40 26V34C40 38 37 42 32 44C27 42 24 38 24 34V26L32 22Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* T letter */}
      <text x="32" y="37" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor" opacity="0.8">T</text>
    </svg>
  );
}

export function CoinFace({ value, flipping }: CoinFaceProps) {
  return (
    <div className="coin-scene">
      <div
        className={cn(
          "coin-disc",
          flipping ? "coin-flipping" : (value === "heads" ? "coin-show-heads" : "coin-show-tails")
        )}
      >
        <div className="coin-face coin-face-heads">
          <HeadsIcon />
        </div>
        <div className="coin-face coin-face-tails">
          <TailsIcon />
        </div>
      </div>
    </div>
  );
}
