# Phase 5: Polish & Differentiators - Research

**Researched:** 2026-03-26
**Domain:** React UX polish — badge overlays, CSS confetti, re-spin timing, pip dot layouts, session tally
**Confidence:** HIGH

## Summary

Phase 5 is a pure UX polish pass across all three tools. There are no new libraries to add and no architecture decisions to make — the project already has every primitive needed. Shadcn `Badge` is installed; CSS keyframe infrastructure is in `index.css`; `tw-animate-css` handles mount animations; `--color-wheel-accent` and `--color-dice-accent` are defined in `:root`. The five requirements each map cleanly to a small, isolated change in an existing file.

The most nuanced task is WHEL-10 (instant re-spin). The current `onSpinEnd` has a 2200ms `setTimeout` before clearing `isSpinningRef` and `spinning`. Re-spin immediacy requires reducing or removing that delay — but the winner overlay is visible for exactly that window. The re-spin gate needs to open earlier than the overlay dismisses, which means decoupling "overlay dismiss" timing from "spin lock release" timing inside `use-wheel.ts`.

DICE-05 is already substantially implemented. `die-cube.tsx` already has `PIP_POSITIONS` with the correct 3x3 grid indices and renders pip dots as `rounded-full` divs. The only change is coloring: switch `bg-neutral-900` to `bg-dice-accent` so pips use the green theme color instead of near-black. This is a one-line change.

**Primary recommendation:** Implement each requirement as a separate, independently-testable change. Do not bundle multiple requirements into a single task — tests for each are distinct.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Small badge/pill displayed above the wheel canvas showing "X items remaining"
- D-02: Always visible when items exist, disappears when wheel is empty
- D-03: Fun "All done!" celebration message with a confetti-style animation (CSS, not a library) when last item is drawn
- D-04: Prominent Reset button to restore all items
- D-05: User can spin again immediately after a result without any manual clearing — the wheel auto-advances to the next spin with remaining items
- D-06: Colored pip dots using dice-accent green color on white face — matches the green theme
- D-07: Classic pip layout positions (standard casino die patterns for faces 1-6)
- D-08: Sticky summary line at the top of coin history panel showing running tally: "5H 3T across 8 flips"
- D-09: Accumulates across all flips in the session, resets when history is cleared

### Claude's Discretion
- Exact badge styling (pill shape, color, size)
- Confetti animation details (particles, duration, colors)
- Re-spin UX timing (how quickly after result fade the wheel is spinnable again)
- Pip dot size and spacing within the 3x3 grid

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WHEL-08 | User sees an item count badge showing remaining items during draws | Shadcn Badge already installed (`badge.tsx`); place above WheelCanvas in `wheel-tab.tsx`; driven by `liveItems.length` from `useWheel` |
| WHEL-09 | User sees a clear empty-state when all items are removed ("reset to continue") | Conditional render when `liveItems.length === 0`; CSS confetti via `@keyframes` in `index.css`; Reset button calls existing `reset()` |
| WHEL-10 | User can re-spin instantly without clearing history | Decouple "overlay dismiss" from "spin lock release" in `use-wheel.ts` `onSpinEnd`; reduce/split the 2200ms timeout |
| DICE-05 | Each die displays pip face icons (dot patterns) instead of plain numbers | Already implemented structurally in `die-cube.tsx`; only change is pip color from `bg-neutral-900` to `bg-dice-accent` |
| COIN-04 | User sees running session tally in history ("5H 3T across 8 flips") | Accumulate `sessionHeads`/`sessionTails` in `use-coin.ts`; pass to `coin-tab.tsx`; display sticky above coin history; reset on history clear |
</phase_requirements>

## Standard Stack

### Core (already installed — no new packages needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19 | 19.2.0 | UI rendering | Existing project foundation |
| Tailwind CSS | 4.1.17 | Utility styles | All styling is Tailwind-based |
| Shadcn Badge | installed | Item count pill | Already in `apps/web/src/components/ui/badge.tsx` |
| tw-animate-css | 1.4.0 | Mount/unmount animations | `animate-in fade-in zoom-in-95` already used on winner overlay |
| lucide-react | 0.562.0 | Icons | Used throughout (Reset icon candidate: `RotateCcw` already imported) |

### No New Installs Required

All capabilities needed for this phase are already present. The REQUIREMENTS.md explicitly lists "Confetti / celebration effects: Extra dependency for marginal value" as out of scope — confirmed by the locked decision D-03 which mandates CSS-only confetti.

**Installation:** None required.

## Architecture Patterns

### Recommended Project Structure

No new files needed. Changes are modifications to existing files only:

```
apps/web/src/
├── components/randomizer/wheel/
│   └── wheel-tab.tsx          — add badge, add empty state render
├── lib/randomizer/
│   └── use-wheel.ts           — decouple spinner timing for re-spin
├── components/randomizer/dice/
│   └── die-cube.tsx           — change pip dot color (one line)
├── components/randomizer/coin/
│   └── coin-tab.tsx           — add session tally display
├── lib/randomizer/
│   └── use-coin.ts            — add sessionHeads/sessionTails accumulation
└── index.css                  — add @keyframes for confetti particles
```

### Pattern 1: Shadcn Badge for item count (WHEL-08)

**What:** Render `<Badge>` above `<WheelCanvas>` in `wheel-tab.tsx`, using `liveItems.length` from `useWheel`.
**When to use:** Whenever `liveItems.length > 0`.

The Badge component accepts standard React props and a `variant` prop. Use `className` override to apply `bg-wheel-accent text-white` for brand color.

```tsx
// Source: apps/web/src/components/ui/badge.tsx (confirmed installed)
import { Badge } from "@base-project/web/components/ui/badge";

// In wheel-tab.tsx, above <WheelCanvas>:
{liveItems.length > 0 && (
  <Badge className="bg-wheel-accent text-white text-sm px-3 py-1">
    {liveItems.length} item{liveItems.length !== 1 ? "s" : ""} remaining
  </Badge>
)}
```

### Pattern 2: CSS confetti animation (WHEL-09)

**What:** Pure CSS keyframe confetti using `@keyframes` + multiple absolutely-positioned `<div>` particles.
**When to use:** When `liveItems.length === 0` — rendered conditionally in `wheel-tab.tsx`.

The animation spawns N small divs (8-12 particles) with varied `animation-delay` and `animation-duration` values. Uses `@keyframes confetti-fall` defined in `index.css`. No external library.

```css
/* Source: index.css pattern — matches existing dice/coin keyframe style */
@keyframes confetti-fall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(120px) rotate(360deg); opacity: 0; }
}
```

```tsx
// Empty state in wheel-tab.tsx — conditional on liveItems.length === 0
{liveItems.length === 0 && (
  <div className="relative flex flex-col items-center gap-4 py-8">
    {/* Confetti particles — absolutely positioned, pointer-events-none */}
    {confettiItems.map((p) => (
      <div key={p.id} className="confetti-particle" style={p.style} />
    ))}
    <p className="text-2xl font-bold">All done!</p>
    <p className="text-muted-foreground text-sm">All items have been drawn.</p>
    <Button onClick={reset} className="mt-2">Reset Wheel</Button>
  </div>
)}
```

Confetti particle data (positions, colors, delays) can be a static constant array — no state needed since the empty state is a one-time render.

### Pattern 3: Instant re-spin — decoupling timers (WHEL-10)

**What:** Split the single 2200ms setTimeout in `onSpinEnd` into two: a short delay (~600ms) to release the spin lock, and the existing 2200ms to dismiss the winner overlay.
**When to use:** `onSpinEnd` callback in `use-wheel.ts`.

Current code (from `use-wheel.ts` line 107-111):
```typescript
// Current: single timeout clears both overlay AND spin lock
setTimeout(() => {
  setWinner(null);
  isSpinningRef.current = false;
  setSpinning(false);
}, 2200);
```

Split approach:
```typescript
// Unlock spin early so user can spin again while overlay still shows
setTimeout(() => {
  isSpinningRef.current = false;
  setSpinning(false);
}, 600);  // timing is Claude's discretion per D-05

// Dismiss winner overlay later
setTimeout(() => {
  setWinner(null);
}, 2200);
```

The exact 600ms is Claude's discretion. The key invariant: `spinning` becomes false (enabling startSpin) before the winner overlay disappears. This satisfies "re-spin immediately" — the Spin button becomes active while the result is still visible.

**Constraint:** `startSpin` checks `isSpinningRef.current`, not `spinning` state. So the ref must be cleared to allow the next spin. Both the ref and `spinning` state must be cleared together in the first timeout.

### Pattern 4: Pip dots color change (DICE-05)

**What:** The pip dot rendering is already correct in `die-cube.tsx`. Only the color class needs changing.

```tsx
// Current (die-cube.tsx line 39-41):
<div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />

// Change to:
<div className="w-2.5 h-2.5 rounded-full bg-dice-accent" />
```

`--color-dice-accent` is defined as `oklch(0.55 0.15 145)` (green) in `index.css` `@theme inline` block. Tailwind 4 resolves `bg-dice-accent` to this CSS variable automatically.

### Pattern 5: Session tally in coin history (COIN-04)

**What:** Accumulate session-level heads/tails counts in `use-coin.ts`, expose as a new return value, and render a sticky tally line in `coin-tab.tsx`.

The `tally` in `useCoin` is per-flip (cleared/replaced each flip). The session tally is cumulative. Add two new state variables `sessionHeads` and `sessionTails` to `use-coin.ts`.

```typescript
// In use-coin.ts — add session accumulation to onFlipEnd:
const [sessionHeads, setSessionHeads] = useState(0);
const [sessionTails, setSessionTails] = useState(0);

// Inside onFlipEnd, after computing heads/tails:
setSessionHeads((prev) => prev + heads);
setSessionTails((prev) => prev + tails);

// Expose from hook:
return {
  ...,
  sessionHeads,
  sessionTails,
  // sessionTotal derived: sessionHeads + sessionTails
};
```

Per D-09, session tally resets when history is cleared. The clear action currently lives in `randomizer.tsx` (`handleClearHistory` sets state to `[]`). There are two implementation options:

**Option A (simpler):** Pass a `onClearHistory` callback prop down to `CoinTab`, which calls a `clearSession()` function exposed by `useCoin`. The hook resets `sessionHeads`/`sessionTails` to 0.

**Option B:** Move history clear into `useCoin` itself (own its history), matching how `useWheel` handles its own history internally. This is more consistent with the existing architecture where `useWheel` owns its history.

Option A is simpler and maintains the current architecture without reorganizing ownership. Recommend Option A for this phase.

Display in `coin-tab.tsx` — sticky summary line above the CoinDisplay or below the controls:

```tsx
{sessionHeads + sessionTails > 0 && (
  <p className="text-sm text-muted-foreground font-medium">
    {sessionHeads}H {sessionTails}T across {sessionHeads + sessionTails} flips
  </p>
)}
```

**Important note on "flips" vs "coins":** D-08 says "5H 3T across 8 flips". Each call to `startFlip` is one "flip event". If the user flips 3 coins at once, that counts as 1 flip event, contributing 3 to the coin total but 1 to the flip count. The format "across 8 flips" counts flip events, not individual coins. Verify this interpretation is correct for planning.

Alternative read: "8 flips" could mean 8 total coin outcomes (heads + tails total). In a "5H 3T" scenario, 5+3=8, so "across 8 flips" = total coin count. This interpretation makes more sense dimensionally. Use `sessionHeads + sessionTails` as the flip count denominator.

### Anti-Patterns to Avoid

- **Importing confetti library:** D-03 locks "CSS, not a library". Never import `canvas-confetti` or similar.
- **Modifying `originalItemsRef` in reset for empty state:** The existing `reset()` restores from `originalItemsRef.current` which was set at item-add time. Do not corrupt this ref.
- **Rendering the empty state inside WheelCanvas:** The canvas already handles empty state as a gray circle with "Add items to spin" text. The WHEL-09 celebration is separate UI in `wheel-tab.tsx`, not the canvas. These are two different empty states: canvas handles "never had items", wheel-tab handles "all items drawn". Check: the canvas empty state triggers when `items.length === 0`; after draws this will also be empty. The planner needs to decide whether to suppress the canvas empty state during the "all done" celebration, or replace it entirely.
- **Adding `sessionHeads/sessionTails` directly to `HistoryEntry` type:** These are ephemeral session values. They don't belong in persisted history entries.
- **Putting session tally in `randomizer.tsx` as derived state:** The coin history is already owned by `useCoin`. Deriving tally in the parent from `coinHistory` string labels would require parsing "3H 2T (5 coins)" strings — fragile. Keep accumulation inside `useCoin`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Badge/pill | Custom CSS class | Shadcn `<Badge>` | Already installed, consistent with design system |
| Icon for Reset | SVG string | `RotateCcw` from lucide-react | Already imported in `randomizer.tsx` |
| Confetti animation | JS particle system | CSS `@keyframes` + static particle divs | D-03 explicit lock, no library needed |
| Color values | Hardcoded hex | CSS variables via Tailwind (`bg-dice-accent`, `bg-wheel-accent`) | Variables already defined in `index.css` |

**Key insight:** This phase adds zero new dependencies. Every building block already exists.

## Common Pitfalls

### Pitfall 1: Re-spin race with winner display still showing

**What goes wrong:** User spins again while winner overlay from previous spin is still fading out. The new winner overlay tries to render on top of the old one, causing a flash.
**Why it happens:** `setWinner(null)` (overlay dismiss) is set on the longer timeout (2200ms). If the user spins before that clears, `winner` goes null from `startSpin` → `setWinner(null)` on the first line of `startSpin`. Then the new winner overlay appears at the end of the new spin.
**How to avoid:** `startSpin` already calls `setWinner(null)` before setting spinning. This clears any lingering overlay when a new spin begins. No special handling needed — the pattern already works.
**Warning signs:** If the winner overlay persists through the new spin animation, check that `setWinner(null)` in `startSpin` runs before `setSpinning(true)`.

### Pitfall 2: `hasRemovedItems` vs `liveItems.length === 0` for empty state

**What goes wrong:** Showing the WHEL-09 "All done" empty state before all items are drawn (e.g., when the user manually removes the last item, not via spin).
**Why it happens:** `liveItems.length === 0` is true both when all items are spin-removed AND when the user deletes the last item manually. The "All done!" celebration may feel wrong if triggered by manual deletion.
**How to avoid:** The decisions don't distinguish these cases (D-03 says "when last item is drawn"). Consider only showing the celebration when `hasRemovedItems` is true AND `liveItems.length === 0`, meaning the empty state is due to spinning (items were removed by draw, not just deleted). Pure `liveItems.length === 0` with no items ever added would also skip it.
**Warning signs:** User sees celebration animation when they manually delete items.

### Pitfall 3: Session tally resets when history is cleared — implementation coupling

**What goes wrong:** History clear in `randomizer.tsx` only sets `setCoinHistory([])`. This doesn't touch session state in `useCoin`.
**Why it happens:** The session state lives in `useCoin`, but the clear action is dispatched from `randomizer.tsx`. They are decoupled.
**How to avoid:** Either (a) expose `clearSession()` from `useCoin` and call it from `CoinTab` when history clear is triggered, or (b) pass a `onClear` callback to `CoinTab` that calls both the parent's `setCoinHistory([])` and the hook's `clearSession()`. Approach (b) means `CoinTab` must know about history clearing — check current props for `CoinTab` (it receives `onHistoryChange`, not `onClear`).
**Warning signs:** Session tally persists after user clicks "Clear" in the history panel.

### Pitfall 4: `tw-animate-css` class naming

**What goes wrong:** Using `animate-in` without the correct `fade-in` or `zoom-in-95` modifiers — or using them incorrectly for the empty state show/hide.
**Why it happens:** `tw-animate-css` classes must be combined correctly. The winner overlay already uses `animate-in fade-in zoom-in-95 duration-200` as the proven pattern.
**How to avoid:** Mirror the exact class combination from the winner overlay for the confetti/empty state container. For exit animations (animating away when items re-appear after reset), `tw-animate-css` supports `animate-out fade-out` but requires the element to still be in the DOM. Conditional rendering (`{condition && <div>}`) removes immediately, so exit animations don't play without extra management. Keep it simple: no exit animation for the empty state.
**Warning signs:** Empty state appears without animation, or exit animation breaks layout.

### Pitfall 5: Tailwind 4 CSS variable resolution for `bg-dice-accent`

**What goes wrong:** Adding `bg-dice-accent` in a Tailwind class and getting no styling, or getting the wrong color.
**Why it happens:** Tailwind 4 resolves custom color tokens defined in `@theme inline {}` blocks. `--color-dice-accent` is defined there. The class `bg-dice-accent` maps to `background-color: var(--color-dice-accent)`.
**How to avoid:** Verify the variable exists in `index.css` before using. It does: `--color-dice-accent: oklch(0.55 0.15 145)`. Use `bg-dice-accent` directly — it will work. Do not use `style={{ backgroundColor: "var(--color-dice-accent)" }}` as that duplicates the Tailwind pattern.
**Warning signs:** Pip dots appear invisible (matching white background) or remain black. Inspect computed styles to confirm the class applies.

## Code Examples

### WHEL-08 — Item count badge placement

```tsx
// Source: apps/web/src/components/randomizer/wheel/wheel-tab.tsx (modified)
// Insert between the flex-col wrapper and WheelCanvas
<div className="flex flex-col items-center gap-4">
  {liveItems.length > 0 && (
    <Badge className="bg-wheel-accent text-white border-0 text-sm px-3 py-1">
      {liveItems.length} {liveItems.length === 1 ? "item" : "items"} remaining
    </Badge>
  )}
  <WheelCanvas ... />
</div>
```

### WHEL-09 — CSS confetti keyframes

```css
/* Source: apps/web/src/index.css — append after coin-flipper section */
@keyframes confetti-fall {
  0%   { transform: translateY(-10px) rotate(0deg) scale(1); opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(100px) rotate(720deg) scale(0.5); opacity: 0; }
}

.confetti-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: confetti-fall 1.2s ease-in forwards;
  pointer-events: none;
}
```

### WHEL-10 — Decoupled spin timing

```typescript
// Source: apps/web/src/lib/randomizer/use-wheel.ts — onSpinEnd (modified)
const onSpinEnd = useCallback(() => {
  const winnerIndex = winnerIndexRef.current;
  const snapshot = itemsSnapshotRef.current;
  if (winnerIndex === null || snapshot.length === 0) return;

  const won = snapshot[winnerIndex];
  setWinner(won);

  const entry: HistoryEntry = {
    id: nextIdRef.current++,
    label: won,
    timestamp: Date.now(),
  };
  setHistory((prev) => [entry, ...prev]);

  let removed = false;
  const next = itemsRef.current.filter((item) => {
    if (!removed && item === won) {
      removed = true;
      return false;
    }
    return true;
  });
  applyItems(next);

  // Unlock spin early — user can spin again before overlay dismisses
  setTimeout(() => {
    isSpinningRef.current = false;
    setSpinning(false);
  }, 600);

  // Dismiss winner overlay later
  setTimeout(() => {
    setWinner(null);
  }, 2200);
}, [applyItems]);
```

### DICE-05 — Pip color (one-line change)

```tsx
// Source: apps/web/src/components/randomizer/dice/die-cube.tsx line ~39
// Before:
<div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
// After:
<div className="w-2.5 h-2.5 rounded-full bg-dice-accent" />
```

### COIN-04 — Session tally in useCoin

```typescript
// Source: apps/web/src/lib/randomizer/use-coin.ts (additions)
const [sessionHeads, setSessionHeads] = useState(0);
const [sessionTails, setSessionTails] = useState(0);

// Inside onFlipEnd, after computing heads/tails:
setSessionHeads((prev) => prev + heads);
setSessionTails((prev) => prev + tails);

// New clearSession function exposed from hook:
const clearSession = useCallback(() => {
  setSessionHeads(0);
  setSessionTails(0);
}, []);

// Return:
return { ..., sessionHeads, sessionTails, clearSession };
```

```tsx
// Source: apps/web/src/components/randomizer/coin/coin-tab.tsx (additions)
const { ..., sessionHeads, sessionTails, clearSession } = useCoin();

// Display tally — inside the return JSX, above or below CoinDisplay:
{sessionHeads + sessionTails > 0 && (
  <p className="text-sm font-medium text-muted-foreground">
    {sessionHeads}H {sessionTails}T across {sessionHeads + sessionTails} flips
  </p>
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Number display on dice faces | Pip dot grid (already in code) | Phase 3 scaffold | DICE-05 is already mostly done — just color |
| No item count visible during wheel | Badge above wheel | Phase 5 | Improves awareness during multi-draw sessions |
| Manual "clear" required between spins | Auto re-spin without clearing | Phase 5 | Reduces friction for fast multi-draw |

**Deprecated/outdated:**
- The 2200ms monolithic timeout in `onSpinEnd`: Replace with split timers for WHEL-10.

## Open Questions

1. **"Flips" in COIN-04 session tally: events or individual coin outcomes?**
   - What we know: D-08 says "5H 3T across 8 flips". 5+3=8, so "8 flips" = total coin outcomes.
   - What's unclear: If a user flips 4 coins twice, is it "across 8 flips" or "across 2 flips"?
   - Recommendation: Treat "flips" as total coin outcomes (heads + tails sum). Format `${sessionHeads + sessionTails} flips` is dimensionally consistent with "5H 3T".

2. **WHEL-09 "All done" state: triggered by spin-removal only, or also by manual deletion?**
   - What we know: D-03 says "when last item is drawn". Drawn = via spin.
   - What's unclear: If user manually deletes all items (via WheelItemList remove buttons), should the celebration also appear?
   - Recommendation: Check `hasRemovedItems` (items were spin-removed) AND `liveItems.length === 0`. This fires only after at least one spin removal, even if last item was manually deleted. If total simplicity is preferred, use `liveItems.length === 0` unconditionally.

3. **Re-spin timing: 600ms unlock delay vs. immediate**
   - What we know: D-05 says "immediately". Claude's discretion covers timing.
   - What's unclear: Whether 0ms (instant) is too jarring, or whether 600ms feels "immediate enough".
   - Recommendation: Use 600ms for the first implementation — this lets the spin result render and be visible before the button unlocks. Can be tuned down if it feels slow.

4. **Canvas empty state during WHEL-09 celebration**
   - What we know: `wheel-canvas.tsx` renders its own empty state ("Add items to spin" circle) when `items.length === 0`.
   - What's unclear: Should the canvas be hidden/replaced entirely when showing the WHEL-09 celebration, or shown behind it?
   - Recommendation: The WHEL-09 celebration in `wheel-tab.tsx` replaces the canvas area when `liveItems.length === 0`. Do not show the canvas behind the celebration. Use conditional rendering: `{liveItems.length > 0 ? <WheelCanvas .../> : <EmptyState />}`.

## Environment Availability

Step 2.6: SKIPPED — No external dependencies. This phase is purely code modifications to existing React components and CSS. No new CLI tools, services, or runtimes required.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 + @testing-library/react |
| Config file | `apps/web/vitest.config.ts` |
| Quick run command | `cd apps/web && pnpm vitest run --reporter=verbose` |
| Full suite command | `cd apps/web && pnpm vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WHEL-08 | Badge shows "X items remaining" when liveItems.length > 0; hidden when 0 | unit (component) | `pnpm vitest run --reporter=verbose src/components/randomizer/wheel/wheel-tab.test.tsx` | Yes — extend existing |
| WHEL-09 | Empty state renders when liveItems.length === 0; Reset button calls reset() | unit (component) | `pnpm vitest run --reporter=verbose src/components/randomizer/wheel/wheel-tab.test.tsx` | Yes — extend existing |
| WHEL-10 | spinning becomes false within ~600ms of onSpinEnd; winner null only after 2200ms | unit (hook) | `pnpm vitest run --reporter=verbose src/lib/randomizer/use-wheel.test.ts` | Yes — extend existing |
| DICE-05 | Pip dots have bg-dice-accent class, not bg-neutral-900 | unit (component) | `pnpm vitest run --reporter=verbose src/components/randomizer/dice/dice-tab.test.tsx` | Yes — extend existing |
| COIN-04 | Session tally increments after each flip; resets on clearSession(); format "XH YT across Z flips" | unit (hook + component) | `pnpm vitest run --reporter=verbose src/lib/randomizer/use-coin.test.ts` | Yes — extend existing |

### Sampling Rate
- **Per task commit:** `cd apps/web && pnpm vitest run --reporter=verbose [changed-file].test.{ts,tsx}`
- **Per wave merge:** `cd apps/web && pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

None — all test files for affected modules already exist. New test cases should be appended to existing test files:
- `use-wheel.test.ts` — add tests for WHEL-08 (badge state), WHEL-09 (empty state), WHEL-10 (split timeout)
- `wheel-tab.test.tsx` — add render assertions for badge and empty state
- `use-coin.test.ts` — add tests for sessionHeads/sessionTails accumulation and clearSession
- `coin-tab.test.tsx` — add session tally display assertion
- No new test files needed; no framework install needed.

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 5 |
|-----------|-------------------|
| No new UI frameworks — existing React + Tailwind + Shadcn only | No new component libraries; CSS-only confetti (D-03) is enforced by this |
| Client-side only — all logic in browser, no API calls | Confirmed — all changes are local state |
| Animations: CSS/JS, not GIF/video | Confetti must be `@keyframes` CSS |
| kebab-case filenames | No new files needed; if any created, must use kebab-case |
| Named exports for components | All new/modified components use named exports |
| Double quotes, 2-space indent, semicolons required | Code style in all modified files |
| Comments explain WHY, not WHAT | Keep implementation comments minimal and purposeful |

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `apps/web/src/` — all findings above are from reading actual source files
- `apps/web/src/index.css` — confirmed CSS variables and keyframe patterns
- `apps/web/src/components/ui/badge.tsx` — confirmed Shadcn Badge is installed with exact API
- `apps/web/src/lib/randomizer/use-wheel.ts` — confirmed timing and state shape
- `apps/web/src/lib/randomizer/use-coin.ts` — confirmed `tally` is per-flip, not session
- `apps/web/src/components/randomizer/dice/die-cube.tsx` — confirmed PIP_POSITIONS already correct; only color change needed

### Secondary (MEDIUM confidence)
- Tailwind CSS 4 `@theme inline` token resolution behavior — verified by presence and working pattern in `index.css` and existing `bg-wheel-accent`/`bg-dice-accent` usage

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed by direct file reads, no new libraries
- Architecture: HIGH — all integration points are visible in actual source code
- Pitfalls: HIGH — derived from reading the actual implementation (timing in use-wheel.ts, color class in die-cube.tsx)

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable codebase, no external dependencies)
