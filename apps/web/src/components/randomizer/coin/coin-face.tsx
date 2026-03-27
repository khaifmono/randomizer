import { cn } from "@base-project/web/lib/utils";

type CoinFaceProps = {
  value: "heads" | "tails";
  flipping: boolean;
};

function HeadsIcon() {
  return (
    <span className="text-4xl font-black tracking-tight leading-none">50</span>
  );
}

function TailsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Eagle / bird spread wings — fills the entire face */}
      {/* Body */}
      <ellipse cx="32" cy="34" rx="6" ry="10" fill="currentColor" opacity="0.85" />
      {/* Head */}
      <circle cx="32" cy="22" r="5" fill="currentColor" opacity="0.85" />
      {/* Beak */}
      <path d="M37 22L42 24L37 25Z" fill="currentColor" opacity="0.7" />
      {/* Eye */}
      <circle cx="34" cy="21" r="1" fill="oklch(0.92 0.10 80)" />
      {/* Left wing */}
      <path d="M26 30Q12 22 8 32Q14 30 20 34Q16 28 26 30Z" fill="currentColor" opacity="0.75" />
      <path d="M24 34Q10 30 6 38Q14 34 22 38Z" fill="currentColor" opacity="0.55" />
      {/* Right wing */}
      <path d="M38 30Q52 22 56 32Q50 30 44 34Q48 28 38 30Z" fill="currentColor" opacity="0.75" />
      <path d="M40 34Q54 30 58 38Q50 34 42 38Z" fill="currentColor" opacity="0.55" />
      {/* Tail feathers */}
      <path d="M28 44Q32 52 36 44Q34 48 32 50Q30 48 28 44Z" fill="currentColor" opacity="0.65" />
      {/* Feet */}
      <path d="M28 44L26 48M28 44L30 48" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <path d="M36 44L34 48M36 44L38 48" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
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
