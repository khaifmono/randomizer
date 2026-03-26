# Phase 4: Coin Flipper - Research

**Researched:** 2026-03-26
**Domain:** CSS 3D animation, React custom hooks, coin flip UI
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All design decisions delegated to Claude. The following are recommended defaults:

- **Coin visuals:** Circular coins with distinct heads (H) and tails (T) faces, CSS 3D flip using `rotateY` with `backface-visibility: hidden`, gold/amber accent coloring
- **Coin size:** ~60-70px diameter, scales to fit multiple coins comfortably
- **Flip interaction:** Dedicated "Flip" button (amber accent), all coins animate simultaneously
- **Animation:** CSS 3D `rotateY` keyframes, ~1-1.5 second flip, lands on pre-determined face
- **Count selector:** Stepper control (- / count / +), range 1-10 (more flexible than dice)
- **Result display:** Each coin shows H or T face after landing, summary line "3 Heads, 2 Tails" displayed prominently
- **History format:** "#N: 3H 2T (5 coins)" compact format, appended to coin tab history

### Claude's Discretion
All design decisions delegated to Claude (see Locked Decisions above for recommended defaults).

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| COIN-01 | User can select number of coins to flip (1+) | Stepper pattern from DiceControls; useCoin hook with setCount guarded by isFlippingRef; range 1-10 |
| COIN-02 | User sees coin flip animation using CSS 3D transforms | CSS `rotateY` keyframes with `preserve-3d` and `backface-visibility: hidden`; `.coin-flipping` class swap pattern mirroring dice; ~1200ms animation, ANIMATION_DURATION constant exported for setTimeout |
| COIN-03 | User sees heads/tails count displayed after each flip | Results array of "heads"/"tails" strings; count computed in onFlipEnd; displayed as "X Heads, Y Tails" summary line, hidden while flipping |
</phase_requirements>

## Summary

Phase 4 implements a coin flipper tool that slots into the existing three-tab randomizer page. The implementation pattern is fully established by Phase 3 (dice roller): a custom hook (`useCoin`) manages all state and logic, a container component (`CoinTab`) wires the hook to the UI and coordinates the CSS animation via a single `setTimeout`, and CSS classes in `index.css` drive the 3D flip animation. The only structural difference from dice is the animation axis (coin flips on the Y axis with two flat faces, not a 3D cube with six faces) and the result type (heads/tails vs 1-6).

The coin animation is simpler than dice: a flat disc with two faces (heads and tails), each positioned with `rotateY(0deg)` and `rotateY(180deg)` respectively, using `backface-visibility: hidden`. The `.coin-flipping` animation does multiple full rotations then stops — the exact landing orientation is controlled by `.coin-show-heads` (rotateY(0deg)) or `.coin-show-tails` (rotateY(180deg)). This is structurally identical to how `.dice-rolling` and `.dice-show-N` work.

**Primary recommendation:** Mirror the dice implementation precisely. Create `useCoin` hook, `CoinTab` container, `CoinFace` (the coin component), and `CoinControls` components. Add CSS classes to `index.css`. Replace `CoinPlaceholder` in `randomizer.tsx`. Enable the disabled coin tab trigger. Write tests with the same pattern as `use-dice.test.ts` and `dice-tab.test.tsx`.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.0 | Component rendering and state | Already installed; all other tools use it |
| TypeScript | ~5.9.3 | Type safety | Project-wide requirement |
| Tailwind CSS | 4.1.17 | Utility classes for layout/color | Already installed; all UI uses it |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.562.0 | Icon for Flip button (Coins icon already imported in randomizer.tsx) | Flip button loading/idle state |
| Vitest + @testing-library/react | 3.2.4 | Unit tests | All new hook and component tests |

### No New Packages Required
This phase requires zero new npm dependencies. All required libraries are already installed. CSS 3D animation is pure browser API. The coin flip is simpler than a dice cube — no additional animation library needed.

**Installation:**
```bash
# No new packages — all dependencies already present
```

## Architecture Patterns

### Recommended Project Structure
```
apps/web/src/
├── lib/randomizer/
│   └── use-coin.ts          # Custom hook (mirrors use-dice.ts)
│   └── use-coin.test.ts     # Hook unit tests (mirrors use-dice.test.ts)
└── components/randomizer/
    └── coin/
        ├── coin-tab.tsx         # Container component (mirrors dice-tab.tsx)
        ├── coin-tab.test.tsx    # Component tests (mirrors dice-tab.test.tsx)
        ├── coin-display.tsx     # Renders N CoinFace components (mirrors dice-display.tsx)
        └── coin-controls.tsx    # Stepper + Flip button (mirrors dice-controls.tsx)
        # Note: coin-face.tsx is the equivalent of die-cube.tsx — could be named coin-face.tsx
```

CSS additions go in `apps/web/src/index.css` under a `/* Coin flipper */` comment block.

### Pattern 1: Custom Hook (useCoin)
**What:** Encapsulates all coin state and logic. Mirrors `useDice` exactly, with coin-specific types.
**When to use:** All state management lives here; components are presentational.

```typescript
// Source: apps/web/src/lib/randomizer/use-dice.ts (established pattern)
// Key differences from useDice:
// - results: ("heads" | "tails")[] instead of number[]
// - count range: 1-10 instead of 1-6
// - sum equivalent: { heads: number; tails: number } | null instead of number | null
// - history label format: "3H 2T (5 coins)"
// - random function: Math.random() < 0.5 ? "heads" : "tails"

const ANIMATION_DURATION = 1200; // Must match CSS keyframe duration in index.css

function useCoin() {
  const [count, setCountState] = useState(1);
  const [flipping, setFlipping] = useState(false);
  const [results, setResults] = useState<("heads" | "tails")[]>([]);
  const [tally, setTally] = useState<{ heads: number; tails: number } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const isFlippingRef = useRef(false);
  const pendingResultsRef = useRef<("heads" | "tails")[]>([]);
  const nextIdRef = useRef(1);

  // setCount: guard isFlippingRef.current; clamp 1-10
  // startFlip: guard isFlippingRef.current; pre-determine results; setFlipping(true)
  // onFlipEnd: compute heads/tails counts; build label; append history; setTimeout 200ms to clear
}
```

### Pattern 2: CoinFace Component (CSS 3D Disc)
**What:** A 2-faced CSS 3D disc — simpler than DieCube (2 faces vs 6). Class swap drives animation.
**When to use:** Rendered N times inside CoinDisplay.

```typescript
// Source: apps/web/src/components/randomizer/dice/die-cube.tsx (established pattern)
// Key differences:
// - shape: rounded-full (disc) instead of cube faces
// - faces: front (heads) and back (tails) only — no six-face setup needed
// - CSS: .coin-scene, .coin-disc, .coin-face-heads, .coin-face-tails
// - class swap: rolling ? "coin-flipping" : (value === "heads" ? "coin-show-heads" : "coin-show-tails")
// CRITICAL: Same mutual exclusion rule — .coin-flipping and .coin-show-heads/tails NEVER simultaneously applied

type CoinFaceProps = {
  value: "heads" | "tails";  // pre-determined result
  flipping: boolean;
};
```

### Pattern 3: Container Component (CoinTab)
**What:** Wires hook to UI components; owns the `setTimeout` that triggers `onFlipEnd`. Mirrors DiceTab.

```typescript
// Source: apps/web/src/components/randomizer/dice/dice-tab.tsx (established pattern)
export function CoinTab({ onHistoryChange }: CoinTabProps) {
  const { count, flipping, results, tally, history, setCount, startFlip, onFlipEnd } = useCoin();

  // Sync history to parent (RandomizerPage coinHistory state)
  useEffect(() => { onHistoryChange(history); }, [history, onHistoryChange]);

  // Single setTimeout — avoids coordinating N animationend events (one per coin)
  useEffect(() => {
    if (!flipping) return;
    const timer = setTimeout(onFlipEnd, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [flipping, onFlipEnd]);

  return (
    <div className="flex flex-col items-center gap-6">
      <CoinDisplay count={count} results={results} flipping={flipping} />
      <CoinControls count={count} flipping={flipping} onSetCount={setCount} onFlip={startFlip} />
      {tally !== null && !flipping && (
        <p className="text-2xl font-bold">{tally.heads} Heads, {tally.tails} Tails</p>
      )}
    </div>
  );
}
```

### Pattern 4: CSS 3D Coin Animation
**What:** Two flat circular faces (heads/tails), rotated on the Y axis. Simpler than dice cube.

```css
/* Source: apps/web/src/index.css — dice CSS pattern to follow */
/* Coin flipper */

.coin-scene {
  perspective: 600px;
  width: 64px;
  height: 64px;
}

.coin-disc {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s;
  will-change: transform;
}

.coin-face {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 50%;          /* circular disc */
  backface-visibility: hidden;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
}

.coin-face-heads {
  transform: rotateY(0deg);
  background-color: oklch(0.88 0.10 80);   /* gold/amber — near --color-coin-accent */
  color: oklch(0.40 0.12 80);
}

.coin-face-tails {
  transform: rotateY(180deg);
  background-color: oklch(0.78 0.08 80);   /* slightly darker reverse */
  color: oklch(0.35 0.10 80);
}

@keyframes coin-flip {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(1440deg); }   /* 4 full rotations */
}

/* CRITICAL: mutually exclusive — never apply both simultaneously */
.coin-disc.coin-flipping {
  animation: coin-flip 1.2s ease-out forwards;
}

.coin-disc.coin-show-heads { transform: rotateY(0deg); }
.coin-disc.coin-show-tails { transform: rotateY(180deg); }
```

### Pattern 5: randomizer.tsx Integration
**What:** Replace `CoinPlaceholder` with `<CoinTab>`, remove `disabled` from coin TabsTrigger.

```typescript
// Source: apps/web/src/routes/randomizer.tsx
// Changes needed:
// 1. Add import: import { CoinTab } from "@base-project/web/components/randomizer/coin/coin-tab";
// 2. Remove CoinPlaceholder function entirely
// 3. Replace <CoinPlaceholder /> with <CoinTab onHistoryChange={setCoinHistory} />
// 4. Remove `disabled` prop from coin TabsTrigger
```

### Anti-Patterns to Avoid
- **Applying .coin-flipping and .coin-show-heads/.coin-show-tails simultaneously:** The CSS animation `forwards` fill keeps the final frame; applying the show class simultaneously breaks the display. Use the same ternary guard as DieCube: `rolling ? "coin-flipping" : "coin-show-heads"`.
- **Using animationend events for coordination:** With N coins, you'd have N events. The established pattern is a single `setTimeout(onFlipEnd, ANIMATION_DURATION)` in the tab component. Do not deviate.
- **Computing results inside onFlipEnd from state:** State reads in callbacks can be stale. Store pre-determined results in `pendingResultsRef.current` during `startFlip`, read from ref in `onFlipEnd` (exactly as useDice does).
- **Initializing results as empty before first flip:** Pass `results[i] || "heads"` as the default value in CoinDisplay so CoinFace always receives a valid value prop (mirrors `results[i] || 1` in DiceDisplay).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animation coordination across N coins | Custom animationend event aggregator | Single `setTimeout` matching CSS duration | Already proven in Phase 3; animationend fires N times and can misfire |
| Random heads/tails | Crypto API or seeded RNG | `Math.random() < 0.5` | Uniform randomness, no bias, matches dice pattern |
| 3D flip CSS | Custom canvas or SVG animation | CSS `rotateY` keyframes | Already validated pattern in this codebase; hardware-accelerated; no JS dependency |
| History ID generation | UUID library | Auto-incrementing `nextIdRef` | Matches HistoryEntry type contract; already used in useDice |

**Key insight:** This phase is a faithful port of Phase 3 to coins. Every architectural problem was already solved. Diverging from the established pattern costs more than it saves.

## Common Pitfalls

### Pitfall 1: Animation vs. Show Class Conflict
**What goes wrong:** Applying both `.coin-flipping` and `.coin-show-heads` simultaneously. The coin face shows but animation may flicker or snap.
**Why it happens:** Developer adds the show class eagerly before clearing the flipping state.
**How to avoid:** Use a strict ternary: `flipping ? "coin-flipping" : (value === "heads" ? "coin-show-heads" : "coin-show-tails")`. Never both.
**Warning signs:** Coin snaps to face without animation completing, or animation loops unexpectedly.

### Pitfall 2: Stale Closure in onFlipEnd
**What goes wrong:** `onFlipEnd` reads `results` from React state, which may be stale after async render.
**Why it happens:** `useCallback` captures a snapshot of state at creation time.
**How to avoid:** Store pre-determined results in `pendingResultsRef.current` during `startFlip`. Read from the ref (not state) inside `onFlipEnd`. Exact same pattern as `use-dice.ts`.
**Warning signs:** History entry label shows wrong counts or "0H 0T".

### Pitfall 3: ANIMATION_DURATION Mismatch
**What goes wrong:** CSS keyframe duration and `ANIMATION_DURATION` constant diverge. Coins show the flipping class after animation already ended, or onFlipEnd fires too early.
**Why it happens:** Developer updates CSS without updating the constant (or vice versa).
**How to avoid:** Both are 1200ms. Add a comment in the CSS: `/* Matches ANIMATION_DURATION in use-coin.ts */`. If you change one, change both.
**Warning signs:** Coins snap to result without animation, or result summary appears while coins are still mid-animation.

### Pitfall 4: Double-Flip Guard Missing
**What goes wrong:** User clicks Flip rapidly; second click starts a new flip before the first completes.
**Why it happens:** `rolling` state is async; a ref-based synchronous guard is needed.
**How to avoid:** Use `isFlippingRef.current` as the synchronous guard in `startFlip`, exactly as `useDice` uses `isRollingRef`. Disable the Flip button while `flipping === true` in `CoinControls`.
**Warning signs:** Two animations run simultaneously, history gets two entries for one user intent.

### Pitfall 5: CoinTab Disabled Not Removed
**What goes wrong:** The coin TabsTrigger still has `disabled` prop after implementing CoinTab, so users can't access the tool.
**Why it happens:** Easy to forget this one-line change in `randomizer.tsx`.
**How to avoid:** Include it explicitly as a task step.
**Warning signs:** Coin tab is grayed out and unclickable in the browser.

## Code Examples

### useCoin History Entry Format
```typescript
// Source: apps/web/src/lib/randomizer/use-dice.ts (label format pattern)
// Coin equivalent:
const heads = results.filter((r) => r === "heads").length;
const tails = results.filter((r) => r === "tails").length;
const label = `${heads}H ${tails}T (${results.length} coins)`;
// e.g. "3H 2T (5 coins)"
```

### CoinDisplay Component
```typescript
// Source: apps/web/src/components/randomizer/dice/dice-display.tsx
export function CoinDisplay({ count, results, flipping }: CoinDisplayProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {Array.from({ length: count }, (_, i) => (
        <CoinFace key={i} value={results[i] || "heads"} flipping={flipping} />
      ))}
    </div>
  );
}
```

### Flip Button with Coins Icon
```typescript
// Source: apps/web/src/routes/randomizer.tsx — Coins already imported from lucide-react
// CoinControls Flip button pattern:
<Button
  onClick={onFlip}
  disabled={flipping}
  className="w-full bg-coin-accent text-white hover:bg-coin-accent/90 font-semibold"
>
  {flipping ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      Flipping...
    </>
  ) : (
    <>
      <Coins className="h-4 w-4" />
      Flip
    </>
  )}
</Button>
```

### Test Pattern: useCoin Hook
```typescript
// Source: apps/web/src/lib/randomizer/use-dice.test.ts (test structure to mirror)
// Key assertions for useCoin:
// - initializes with count=1, flipping=false, results=[], tally=null, history=[]
// - setCount(0) no-op; setCount(11) no-op; setCount(5) succeeds
// - startFlip sets flipping=true, results.length === count, all values "heads"|"tails"
// - startFlip is no-op while flipping
// - setCount no-op while flipping
// - onFlipEnd computes correct tally, correct label, creates history entry, clears flipping after 200ms
// - history entries are prepended (newest first) with incrementing IDs
```

### Test Pattern: CoinTab Component
```typescript
// Source: apps/web/src/components/randomizer/dice/dice-tab.test.tsx (mock pattern to mirror)
const mockUseCoin = vi.hoisted(() => vi.fn(() => defaultCoinState));
vi.mock("@base-project/web/lib/randomizer/use-coin", () => ({
  useCoin: mockUseCoin,
  ANIMATION_DURATION: 1200,
}));
// Tests: renders Flip button, renders stepper buttons, shows tally when set and not flipping,
//        hides tally while flipping, calls onHistoryChange when history updates
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CoinPlaceholder (disabled) | CoinTab (functional) | This phase | Coin tab becomes fully interactive |
| Two coin faces shown as flat divs | CSS 3D disc with rotateY flip | This phase | Satisfying animated flip experience |

**Deprecated/outdated:**
- `CoinPlaceholder` function in `randomizer.tsx`: removed entirely and replaced with `CoinTab`

## Open Questions

1. **Single coin (count=1) tally display format**
   - What we know: Summary line will read "1 Heads, 0 Tails" or "0 Heads, 1 Tails"
   - What's unclear: Grammatically should it be "1 Head" (singular)? CONTEXT.md shows "3 Heads, 2 Tails" (plural only)
   - Recommendation: Use plural throughout ("1 Heads, 0 Tails") for implementation simplicity. Matches the dice pattern where "Total: 1" doesn't use special grammar.

2. **Initial results array when count changes after a flip**
   - What we know: DiceDisplay uses `results[i] || 1` as fallback; shows previous result faces until next flip
   - What's unclear: If count increases from 3 to 5 after a flip, coins 4 and 5 have no result yet
   - Recommendation: Use `results[i] || "heads"` as fallback (shows heads face as default). Mirrors dice behavior exactly.

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified — pure CSS + React, no new packages, no external services)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 + @testing-library/react |
| Config file | `apps/web/vitest.config.ts` |
| Quick run command | `cd apps/web && pnpm vitest run src/lib/randomizer/use-coin.test.ts` |
| Full suite command | `cd apps/web && pnpm vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| COIN-01 | setCount updates count; guards 1-10 range; no-op while flipping | unit | `cd apps/web && pnpm vitest run src/lib/randomizer/use-coin.test.ts -t "setCount"` | ❌ Wave 0 |
| COIN-01 | Stepper renders -/+ buttons; disabled at bounds and while flipping | unit | `cd apps/web && pnpm vitest run src/components/randomizer/coin/coin-tab.test.tsx -t "stepper"` | ❌ Wave 0 |
| COIN-02 | startFlip sets flipping=true, populates results array | unit | `cd apps/web && pnpm vitest run src/lib/randomizer/use-coin.test.ts -t "startFlip"` | ❌ Wave 0 |
| COIN-02 | CoinTab hides tally while flipping is true | unit | `cd apps/web && pnpm vitest run src/components/randomizer/coin/coin-tab.test.tsx -t "flipping"` | ❌ Wave 0 |
| COIN-03 | onFlipEnd computes correct heads/tails tally | unit | `cd apps/web && pnpm vitest run src/lib/randomizer/use-coin.test.ts -t "onFlipEnd"` | ❌ Wave 0 |
| COIN-03 | CoinTab displays tally when set and not flipping | unit | `cd apps/web && pnpm vitest run src/components/randomizer/coin/coin-tab.test.tsx -t "tally"` | ❌ Wave 0 |
| COIN-03 | onFlipEnd appends history entry with correct label format | unit | `cd apps/web && pnpm vitest run src/lib/randomizer/use-coin.test.ts -t "history"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `cd apps/web && pnpm vitest run src/lib/randomizer/use-coin.test.ts src/components/randomizer/coin/coin-tab.test.tsx`
- **Per wave merge:** `cd apps/web && pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/web/src/lib/randomizer/use-coin.test.ts` — covers COIN-01, COIN-02, COIN-03
- [ ] `apps/web/src/components/randomizer/coin/coin-tab.test.tsx` — covers COIN-01, COIN-02, COIN-03 (component layer)

*(No framework gaps — existing vitest + @testing-library/react infrastructure covers all needs)*

## Project Constraints (from CLAUDE.md)

| Constraint | Details |
|------------|---------|
| Tech stack | Must use existing React + Tailwind + Shadcn setup — no new UI frameworks |
| Client-side only | All randomization logic runs in the browser, no API calls |
| Animations | Must feel smooth and fun — CSS/JS animations, not GIF/video |
| File naming | kebab-case for all filenames (ESLint `unicorn/filename-case`) |
| Exports | Named exports for components and hooks; no default exports for these |
| Quotes | Double quotes only |
| Semicolons | Required |
| Indentation | 2 spaces |
| Import alias | Use `@base-project/web` for imports within apps/web |
| Test files | Co-located with implementation (e.g., `use-coin.test.ts` next to `use-coin.ts`) |
| Comments | Explain WHY, not WHAT; minimal; no JSDoc required |
| Constants | UPPER_SNAKE_CASE (e.g., `ANIMATION_DURATION`) |

## Sources

### Primary (HIGH confidence)
- Direct code read: `apps/web/src/lib/randomizer/use-dice.ts` — complete hook pattern
- Direct code read: `apps/web/src/components/randomizer/dice/dice-tab.tsx` — container pattern
- Direct code read: `apps/web/src/components/randomizer/dice/die-cube.tsx` — CSS 3D component pattern
- Direct code read: `apps/web/src/components/randomizer/dice/dice-display.tsx` — display pattern
- Direct code read: `apps/web/src/components/randomizer/dice/dice-controls.tsx` — controls pattern
- Direct code read: `apps/web/src/index.css` — existing CSS animation classes and CSS custom property `--color-coin-accent`
- Direct code read: `apps/web/src/routes/randomizer.tsx` — integration point, CoinPlaceholder, disabled tab
- Direct code read: `apps/web/src/lib/randomizer/types.ts` — HistoryEntry type
- Direct code read: `apps/web/src/lib/randomizer/use-dice.test.ts` — test pattern
- Direct code read: `apps/web/src/components/randomizer/dice/dice-tab.test.tsx` — component test pattern
- Direct code read: `apps/web/vitest.config.ts` — test runner config
- Direct code read: `apps/web/src/components/result-history.tsx` — shared history component

### Secondary (MEDIUM confidence)
- CSS 3D transform `backface-visibility` and `preserve-3d` behavior: Well-established browser APIs, consistent across all modern browsers (Chrome, Firefox, Safari, Edge)

### Tertiary (LOW confidence)
- None — all claims verified directly from project source code

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — zero new packages; everything directly read from installed codebase
- Architecture: HIGH — exact mirror of Phase 3 dice pattern, directly read from source
- Pitfalls: HIGH — derived from Phase 3 implementation notes in STATE.md and direct code analysis
- Test patterns: HIGH — directly read from existing test files

**Research date:** 2026-03-26
**Valid until:** Stable (pure code-pattern research, no external API dependencies)
