# Phase 3: Dice Roller - Research

**Researched:** 2026-03-26
**Domain:** CSS 3D animation, React custom hooks, Tailwind CSS
**Confidence:** HIGH

## Summary

Phase 3 replaces the `DicePlaceholder` in `randomizer.tsx` with a fully functional `DiceTab` component. The implementation follows the exact same patterns established in Phase 2: a `useDice` hook that pre-determines results before animation, a `DiceTab` container component, and child components for the dice display, count selector, and roll controls.

The 3D dice animation uses pure CSS transforms — `transform-style: preserve-3d`, `backface-visibility: hidden`, and `@keyframes` with `rotateX`/`rotateY` — requiring zero new dependencies. Six face positions are fixed CSS rotation values. The tumble is a generic spinning keyframe; on completion, the known final transform is applied to land on the pre-determined face. All six dice animate simultaneously because they each get their own independent CSS animation trigger.

**Primary recommendation:** Pure CSS 3D cube with `preserve-3d`. Apply a `.rolling` class to trigger tumble, then replace with `.show-N` class to land on the pre-determined face value. No library needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
All design decisions delegated to Claude. The following are recommended defaults:

- **Dice visuals:** White dice with black pip dots (classic style), CSS 3D cubes with `preserve-3d` and `backface-visibility: hidden`, 6 pip layouts using CSS grid
- **Dice size:** ~60-80px per die, scaled to fit 1-6 dice comfortably
- **Roll interaction:** Dedicated "Roll" button (green accent), all dice animate simultaneously
- **Animation:** CSS 3D `rotateX`/`rotateY` keyframes, ~1-2 second tumble, lands on pre-determined face
- **Count selector:** Stepper control (- / count / +) or slider, range 1-6
- **Result display:** Individual die face values shown on the dice + sum total displayed prominently below
- **History format:** "#N: 4+2+6=12" compact format, appended to dice tab history

### Claude's Discretion
All design decisions are Claude's discretion (see defaults above as starting points).

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DICE-01 | User can select number of dice to roll (1-6) | Stepper control (- / count / +) — pure HTML + Tailwind, no library needed |
| DICE-02 | User sees dice roll animation using CSS 3D transforms | CSS `preserve-3d` + `@keyframes` tumble + `.show-N` class pattern fully verified |
| DICE-03 | User sees sum total displayed after each roll | `useDice` hook computes sum from result array; rendered below dice grid |
| DICE-04 | All dice animate simultaneously on roll | Each die is independent; applying `.rolling` class simultaneously triggers parallel animations |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.0 (installed) | Component rendering | Already in project |
| Tailwind CSS | 4.1.17 (installed) | Utility styling | Already in project |
| tw-animate-css | 1.4.0 (installed) | `animate-in` / `fade-in` helpers | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.562.0 (installed) | `Loader2` spinner icon for rolling state | Same as WheelControls |
| @testing-library/react | 16.3.2 (installed) | `renderHook` + `render` for tests | All hook and component tests |
| vitest | 3.2.4 (installed) | Test runner | All tests |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure CSS 3D | `motion` (already installed) | motion works for values; CSS is simpler for 3D cube geometry — no added complexity |
| CSS class swap for face landing | Inline style transform | Class swap is cleaner; avoids React re-render per animation frame |

**No new packages required.** Everything needed is already installed.

---

## Architecture Patterns

### Recommended Project Structure
```
apps/web/src/
├── lib/randomizer/
│   ├── use-dice.ts          # Custom hook (state machine + history)
│   └── use-dice.test.ts     # Hook unit tests (co-located)
└── components/randomizer/dice/
    ├── dice-tab.tsx         # Container (hook + children)
    ├── dice-tab.test.tsx    # Container smoke tests
    ├── dice-display.tsx     # Grid of Die components
    ├── die-cube.tsx         # Single CSS 3D die + animation
    └── dice-controls.tsx    # Stepper + Roll button
```

### Pattern 1: useDice Hook (mirrors useWheel)
**What:** Manages count, rolling state, per-roll results array, history, and roll trigger.
**When to use:** All dice business logic lives here; components stay display-only.

```typescript
// apps/web/src/lib/randomizer/use-dice.ts
import { useState, useRef, useCallback } from "react";
import type { HistoryEntry } from "./types";

type DiceState = {
  count: number;           // 1-6
  rolling: boolean;        // animation in progress
  results: number[];       // pre-determined face values (length = count)
  sum: number | null;      // null before first roll
  history: HistoryEntry[];
  setCount: (n: number) => void;
  startRoll: () => void;
  onRollEnd: () => void;
};

function useDice(): DiceState {
  const [count, setCountState] = useState(2);
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [sum, setSum] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const isRollingRef = useRef(false);
  const pendingResultsRef = useRef<number[]>([]);
  const nextIdRef = useRef(1);

  const setCount = useCallback((n: number) => {
    if (n < 1 || n > 6) return;
    setCountState(n);
  }, []);

  const startRoll = useCallback(() => {
    if (isRollingRef.current) return;
    isRollingRef.current = true;
    // Pre-determine all results before animation
    const rolled = Array.from({ length: count }, () => Math.ceil(Math.random() * 6));
    pendingResultsRef.current = rolled;
    setResults(rolled);
    setRolling(true);
  }, [count]);

  const onRollEnd = useCallback(() => {
    const rolled = pendingResultsRef.current;
    const total = rolled.reduce((a, b) => a + b, 0);
    setSum(total);

    const label = rolled.join("+") + "=" + total;
    const entry: HistoryEntry = {
      id: nextIdRef.current++,
      label,
      timestamp: Date.now(),
    };
    setHistory((prev) => [entry, ...prev]);

    setTimeout(() => {
      isRollingRef.current = false;
      setRolling(false);
    }, 200); // brief settle after animation completes
  }, []);

  return { count, rolling, results, sum, history, setCount, startRoll, onRollEnd };
}

export { useDice };
```

### Pattern 2: CSS 3D Die Face Mapping
**What:** Six faces of a cube, each positioned with `rotateX`/`rotateY` + `translateZ(half-size)`.
**When to use:** The container has `transform-style: preserve-3d`; each `.face` uses `backface-visibility: hidden`.

Standard face rotations for a standard die (verified from multiple sources):
```css
/* translateZ = half the die width (e.g., 35px for 70px die) */
.face-1 { transform: rotateY(0deg)    translateZ(35px); }  /* front */
.face-2 { transform: rotateY(180deg)  translateZ(35px); }  /* back  */
.face-3 { transform: rotateY(-90deg)  translateZ(35px); }  /* left  */
.face-4 { transform: rotateY(90deg)   translateZ(35px); }  /* right */
.face-5 { transform: rotateX(90deg)   translateZ(35px); }  /* top   */
.face-6 { transform: rotateX(-90deg)  translateZ(35px); }  /* bottom */
```

Landing on face N: apply a final `rotateX`/`rotateY` to the cube wrapper such that face N faces the viewer. These are the inverse of the face positions:
```css
/* Applied to the cube wrapper to show face N to the viewer */
.show-1 { transform: rotateX(0deg)   rotateY(0deg);   }
.show-2 { transform: rotateX(0deg)   rotateY(180deg); }
.show-3 { transform: rotateX(0deg)   rotateY(90deg);  }
.show-4 { transform: rotateX(0deg)   rotateY(-90deg); }
.show-5 { transform: rotateX(-90deg) rotateY(0deg);   }
.show-6 { transform: rotateX(90deg)  rotateY(0deg);   }
```

### Pattern 3: Die Animation Trigger via React State
**What:** Apply `.rolling` class (generic tumble keyframe) then swap to `.show-N` class on completion.
**When to use:** CSS handles all animation; React only manages a `phase` state string.

```tsx
// apps/web/src/components/randomizer/dice/die-cube.tsx
type DieCubeProps = {
  value: number;   // 1-6, pre-determined
  rolling: boolean;
  onRollEnd?: () => void; // called by LAST die (or coordinated via parent)
};

export function DieCube({ value, rolling, onRollEnd }: DieCubeProps) {
  // CSS class applied to cube wrapper: "rolling" during animation, "show-N" after
  const cubeClass = rolling ? "rolling" : `show-${value}`;
  // ...
}
```

The `@keyframes roll` animation runs for ~1.2s. After it ends (`animationend` event or `onAnimationEnd` React prop), call `onRollEnd`. Because all dice animate simultaneously, only the last die's `onRollEnd` (or a single coordinated `setTimeout` in `useDice`) triggers the `onRollEnd` callback on the hook.

**Coordination approach:** Use a single `setTimeout` in `useDice.onRollEnd` — simpler than coordinating N `animationend` events. The duration in CSS `@keyframes` and the `setTimeout` value must match.

### Pattern 4: Pip Layout Using CSS Grid
**What:** Each face shows 1-6 dots in classic die arrangement using a 3x3 grid.
**When to use:** Render `.pip` elements inside a grid; use `grid-area` or flexbox column with `justify-content` to position dots.

Classic pip positions (grid areas `tl`=top-left, `tc`=top-center, `tr`=top-right, `ml`=mid-left, `mc`=mid-center, `mr`=mid-right, `bl`=bottom-left, `bc`=bottom-center, `br`=bottom-right):

| Face | Active positions |
|------|-----------------|
| 1 | mc |
| 2 | tr, bl |
| 3 | tr, mc, bl |
| 4 | tl, tr, bl, br |
| 5 | tl, tr, mc, bl, br |
| 6 | tl, tr, ml, mr, bl, br |

Implementation: Hardcode pip visibility per face value using a lookup map or `switch`. Each face renders its pip grid as a static layout, not computed.

### Pattern 5: DiceTab Container (mirrors WheelTab)
**What:** Container that calls `useDice`, syncs `history` up via `useEffect`, and renders child components.

```tsx
// apps/web/src/components/randomizer/dice/dice-tab.tsx
type DiceTabProps = {
  onHistoryChange: (entries: HistoryEntry[]) => void;
};

export function DiceTab({ onHistoryChange }: DiceTabProps) {
  const { count, rolling, results, sum, history, setCount, startRoll, onRollEnd } = useDice();

  useEffect(() => {
    onHistoryChange(history);
  }, [history, onHistoryChange]);

  return (
    <div className="flex flex-col items-center gap-6">
      <DiceDisplay count={count} results={results} rolling={rolling} onRollEnd={onRollEnd} />
      <DiceControls count={count} rolling={rolling} onSetCount={setCount} onRoll={startRoll} />
      {sum !== null && !rolling && (
        <p className="text-2xl font-bold">Total: {sum}</p>
      )}
    </div>
  );
}
```

### Anti-Patterns to Avoid

- **Determining the result after animation:** Pre-determine with `Math.random()` in `startRoll` BEFORE setting `rolling: true`. Same principle as wheel's `winnerIndexRef`.
- **Coordinating `animationend` across N dice:** N separate event handlers race. Use a single `setTimeout` in `useDice` matching the CSS animation duration.
- **Using `motion` for the 3D cube:** The `motion` package controls scalar values (like wheel rotation angle). CSS `preserve-3d` cube geometry is more natural with CSS keyframes.
- **Re-creating die elements on each roll:** Keep die elements in the DOM; only toggle CSS classes. DOM thrash during animation causes jank.
- **`translateZ` not matching half the die size:** If die is 70px, `translateZ` must be `35px`. Mismatch causes face gaps or overlaps.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS 3D cube face positioning | Custom transform math | Established `rotateX/Y + translateZ(half-size)` pattern | The math is fixed and well-documented |
| Pip dot layouts | Dynamic dot calculation | Static face→pip map | 6 fixed patterns; runtime calculation adds complexity with no benefit |
| Animation timing coordination | Complex event bus | Single `setTimeout` matching CSS duration | Simpler, less surface for bugs |
| Button variants | Custom button | Existing `Button` Shadcn component | Already styled, accessible |

**Key insight:** The die faces are a lookup table problem, not a calculation problem. Hardcode all six face layouts.

---

## Common Pitfalls

### Pitfall 1: `transform-style: preserve-3d` Not Inheriting
**What goes wrong:** The 3D perspective collapses — faces appear flat or in wrong positions.
**Why it happens:** `transform-style: preserve-3d` does not automatically inherit. The `.scene` (perspective container) AND the `.cube` wrapper both need it.
**How to avoid:** Set `transform-style: preserve-3d` on both the scene wrapper and the cube div. The faces themselves only need `backface-visibility: hidden`.
**Warning signs:** Dice look like flat squares during roll.

### Pitfall 2: Animation + backface-visibility Interaction
**What goes wrong:** During the roll animation, the "wrong" faces flash through the viewport because `backface-visibility` stops working while a CSS animation is running.
**Why it happens:** Some browsers re-evaluate `backface-visibility` differently when an animation modifies `transform`. Adding `transform: translateZ(0)` to the faces (forcing GPU layer) can resolve it.
**How to avoid:** Add `will-change: transform` to both `.cube` and `.face` elements. Test in Chrome and Safari.
**Warning signs:** Random face flicker during tumble animation.

### Pitfall 3: `onRollEnd` Called Multiple Times
**What goes wrong:** History gets N entries per roll (one per die) instead of one.
**Why it happens:** If each `DieCube` fires `onRollEnd`, all N fire independently.
**How to avoid:** Only one entity calls `onRollEnd`. Use a `setTimeout` in `useDice.startRoll` that fires once after animation duration. Pass `onRollEnd` to `DiceDisplay` (not individual dice) or don't use `animationend` at all.
**Warning signs:** History accumulates entries equal to dice count per roll.

### Pitfall 4: `rolling` State Cleared Too Early
**What goes wrong:** Dice snap to final position before animation finishes (same pattern as wheel).
**Why it happens:** `setRolling(false)` called immediately in `onRollEnd` instead of after CSS animation duration.
**How to avoid:** Use same `setTimeout` pattern as `useWheel.onSpinEnd` — delay `setRolling(false)` until after the visual is settled (200-300ms after `onRollEnd` fires).
**Warning signs:** Dice snap to result; no smooth landing.

### Pitfall 5: `show-N` Transform Overriding Tumble Animation
**What goes wrong:** During the tumble animation, the `.show-N` class is already applied and fights the keyframe.
**Why it happens:** Both the CSS animation and the static `transform` in `.show-N` try to own the `transform` property.
**How to avoid:** The state machine must be exclusive: during rolling, apply ONLY `.rolling`; after animation ends, remove `.rolling` and apply `.show-N`. Never have both classes simultaneously.
**Warning signs:** Die jumps to final face immediately on roll trigger.

---

## Code Examples

### CSS 3D Cube Structure
```css
/* Source: CSS 3D transforms spec + dev.to/dailydevtips1 verified pattern */
.scene {
  perspective: 600px;
  width: 70px;
  height: 70px;
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s;
  will-change: transform;
}

.face {
  position: absolute;
  width: 70px;
  height: 70px;
  background: white;
  border: 2px solid #222;
  border-radius: 8px;
  backface-visibility: hidden;
  will-change: transform;
}

.face-1 { transform: rotateY(0deg)    translateZ(35px); }
.face-2 { transform: rotateY(180deg)  translateZ(35px); }
.face-3 { transform: rotateY(-90deg)  translateZ(35px); }
.face-4 { transform: rotateY(90deg)   translateZ(35px); }
.face-5 { transform: rotateX(90deg)   translateZ(35px); }
.face-6 { transform: rotateX(-90deg)  translateZ(35px); }
```

### Roll Keyframe + Face Landing Classes
```css
/* Tumble animation — generic, direction-agnostic */
@keyframes roll {
  0%   { transform: rotateX(0deg)    rotateY(0deg);    }
  100% { transform: rotateX(720deg)  rotateY(720deg);  }
}

.cube.rolling {
  animation: roll 1.2s ease-out forwards;
}

/* Landing states — applied after animation completes */
.cube.show-1 { transform: rotateX(0deg)   rotateY(0deg);   }
.cube.show-2 { transform: rotateX(0deg)   rotateY(180deg); }
.cube.show-3 { transform: rotateX(0deg)   rotateY(90deg);  }
.cube.show-4 { transform: rotateX(0deg)   rotateY(-90deg); }
.cube.show-5 { transform: rotateX(-90deg) rotateY(0deg);   }
.cube.show-6 { transform: rotateX(90deg)  rotateY(0deg);   }
```

### CSS Grid Pip Layout (face 5 example)
```tsx
/* Source: classic die pip pattern — all 6 layouts are static */
const PIP_LAYOUT: Record<number, string[]> = {
  1: ["mc"],
  2: ["tr", "bl"],
  3: ["tr", "mc", "bl"],
  4: ["tl", "tr", "bl", "br"],
  5: ["tl", "tr", "mc", "bl", "br"],
  6: ["tl", "tr", "ml", "mr", "bl", "br"],
};

// Tailwind grid-area equivalent using grid-cols-3 + explicit placement
// Each pip is a rounded black dot ~10px, positioned in 3x3 grid cells
```

### History Entry Format
```typescript
// "#N: 4+2+6=12" — matches CONTEXT.md spec
const label = rolled.join("+") + "=" + total;
const entry: HistoryEntry = {
  id: nextIdRef.current++,
  label,           // "4+2+6=12"
  timestamp: Date.now(),
};
// Prepend: setHistory(prev => [entry, ...prev])
```

### Enabling the Dice Tab Trigger (randomizer.tsx patch)
```tsx
// Remove `disabled` prop from the Dice TabsTrigger
<TabsTrigger
  value="dice"
  className={cn("gap-1", "data-[state=active]:border-dice-accent")}
  // disabled  ← remove this line
>
  <Dices className="h-4 w-4" />
  Dice
</TabsTrigger>

// Replace DicePlaceholder with DiceTab
<TabsContent value="dice" className="mt-6">
  <DiceTab onHistoryChange={setDiceHistory} />
</TabsContent>
```

---

## Integration Points (Verified from Source)

These are confirmed from reading the existing code:

| Point | File | Action |
|-------|------|--------|
| Replace placeholder | `apps/web/src/routes/randomizer.tsx` line 104 | Replace `<DicePlaceholder />` with `<DiceTab onHistoryChange={setDiceHistory} />` |
| Enable tab | `apps/web/src/routes/randomizer.tsx` line 83 | Remove `disabled` from Dice `TabsTrigger` |
| Import DiceTab | `apps/web/src/routes/randomizer.tsx` | Add import for `DiceTab` |
| History type | `apps/web/src/lib/randomizer/types.ts` | Use existing `HistoryEntry` — no changes needed |
| CSS token | `apps/web/src/index.css` | `--color-dice-accent: oklch(0.55 0.15 145)` — green, already defined |
| No new CSS files | — | Add `@keyframes roll` + face classes in `index.css` (project has single CSS file) |

---

## Environment Availability

Step 2.6: SKIPPED — this phase is purely frontend code/CSS changes with no external CLI tools, services, databases, or runtimes beyond the already-verified Node.js + pnpm environment.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 |
| Config file | `apps/web/vitest.config.ts` |
| Quick run command | `pnpm --filter @base-project/web exec vitest run` |
| Full suite command | `pnpm --filter @base-project/web exec vitest run` |

Tests confirmed passing (79 tests, 8 files) before Phase 3 begins.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DICE-01 | setCount clamps to 1-6, updates count state | unit | `pnpm --filter @base-project/web exec vitest run src/lib/randomizer/use-dice.test.ts` | ❌ Wave 0 |
| DICE-02 | rolling state triggers CSS animation class; `show-N` class applied on completion | unit | `pnpm --filter @base-project/web exec vitest run src/lib/randomizer/use-dice.test.ts` | ❌ Wave 0 |
| DICE-03 | sum equals sum of results array; displayed in DiceTab after roll | unit + smoke | `pnpm --filter @base-project/web exec vitest run src/lib/randomizer/use-dice.test.ts` | ❌ Wave 0 |
| DICE-04 | all N dice receive rolling=true simultaneously; single onRollEnd fires once | unit | `pnpm --filter @base-project/web exec vitest run src/lib/randomizer/use-dice.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm --filter @base-project/web exec vitest run`
- **Per wave merge:** `pnpm --filter @base-project/web exec vitest run`
- **Phase gate:** Full suite green (all 8+ files) before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/web/src/lib/randomizer/use-dice.test.ts` — covers DICE-01, DICE-02, DICE-03, DICE-04 (hook unit tests)
- [ ] `apps/web/src/components/randomizer/dice/dice-tab.test.tsx` — smoke tests: renders Roll button, renders stepper, calls onHistoryChange
- [ ] `@keyframes roll` + `.show-N` classes added to `apps/web/src/index.css` before `DieCube` component is built

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS class on `<div>` with inline style | `transform-style: preserve-3d` on cube wrapper | CSS3 / 2012 | Stable — no churn |
| JavaScript animation loops | CSS `@keyframes` + `animation` property | CSS3 / 2012 | Stable — GPU accelerated |

No breaking changes in this domain. CSS 3D transforms are stable across all modern browsers.

---

## Open Questions

1. **CSS `@keyframes` location**
   - What we know: Project uses `index.css` as its single CSS file (per imports in `apps/web/src/index.css`)
   - What's unclear: Whether dice-specific keyframes belong in `index.css` or a co-located `.css` module
   - Recommendation: Add to `index.css` under a `/* Dice roller */` comment — consistent with project's single-file CSS approach (no CSS modules used elsewhere in the project)

2. **Pip layout implementation technique**
   - What we know: CONTEXT.md specifies "CSS grid" for pip layout; 3x3 grid with 9 cells and active pip visibility is the standard approach
   - What's unclear: Whether to use Tailwind grid utilities or a `<style>` block / CSS class per face value
   - Recommendation: Use Tailwind `grid grid-cols-3 gap-1` with conditional class visibility per cell position. Each pip is `rounded-full bg-foreground`. Map face value to a set of active cell indices.

---

## Sources

### Primary (HIGH confidence)
- MDN Web Docs — `transform-style`, `backface-visibility`, `@keyframes`, `rotateX/Y` — browser-standard, stable API
- Existing project source code (`use-wheel.ts`, `wheel-tab.tsx`, `wheel-canvas.tsx`, `index.css`) — direct read, no assumptions

### Secondary (MEDIUM confidence)
- [Creating a 3D dice in CSS - DEV Community](https://dev.to/dailydevtips1/creating-a-3d-dice-in-css-3ad5) — face rotation angles and `translateZ(half-size)` formula verified
- [Create Your Own Interactive 3D Dice Roller - DEV Community](https://dev.to/learncomputer/create-your-own-interactive-3d-dice-roller-a-step-by-step-guide-34b3) — `.rolling` → `.show-N` class swap pattern verified
- [3D CSS cube — desandro.com](https://3dtransforms.desandro.com/cube) — canonical reference for `preserve-3d` cube construction

### Tertiary (LOW confidence)
- None — all claims in this document are backed by PRIMARY or SECONDARY sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, verified in package.json
- Architecture: HIGH — directly modeled on Phase 2 code read from source
- CSS 3D technique: HIGH — verified with multiple authoritative sources + MDN
- Pitfalls: MEDIUM — sourced from dev.to articles and known CSS animation issues; not all verified against this exact browser target
- Test patterns: HIGH — directly read from existing test files in repo

**Research date:** 2026-03-26
**Valid until:** 2026-09-26 (CSS 3D transforms are stable; no churn expected)
