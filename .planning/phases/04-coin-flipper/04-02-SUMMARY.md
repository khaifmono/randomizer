---
phase: 04-coin-flipper
plan: 02
subsystem: ui
tags: [react, tailwind, css-animations, coin-flipper, vitest, typescript]

# Dependency graph
requires:
  - phase: 04-coin-flipper (plan 01)
    provides: useCoin hook, ANIMATION_DURATION constant, CSS coin-flip classes in index.css
provides:
  - CoinFace component (CSS 3D disc with heads/tails faces and mutually exclusive class swap)
  - CoinDisplay component (grid of N CoinFace instances)
  - CoinControls component (stepper 1-10 and amber Flip button)
  - CoinTab container component (wires useCoin hook to UI with setTimeout animation coordination)
  - coin-tab.test.tsx (6 component smoke tests)
  - Coin tab enabled and wired in randomizer.tsx page
affects: [05-polish, verifier]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS 3D coin disc with two faces positioned via rotateY(0deg) / rotateY(180deg)
    - Mutually exclusive class swap pattern: coin-flipping OR coin-show-heads/coin-show-tails never both
    - Container component wires hook + setTimeout(onFlipEnd, ANIMATION_DURATION) for animation coordination
    - vi.hoisted() pattern for mock functions in component tests

key-files:
  created:
    - apps/web/src/components/randomizer/coin/coin-face.tsx
    - apps/web/src/components/randomizer/coin/coin-display.tsx
    - apps/web/src/components/randomizer/coin/coin-controls.tsx
    - apps/web/src/components/randomizer/coin/coin-tab.tsx
    - apps/web/src/components/randomizer/coin/coin-tab.test.tsx
  modified:
    - apps/web/src/routes/randomizer.tsx

key-decisions:
  - "coin-flipping and coin-show-* classes are mutually exclusive — same ternary pattern as DieCube ensures animation correctness"
  - "CoinTab uses single setTimeout(onFlipEnd, ANIMATION_DURATION) rather than per-coin animationend events — mirrors DiceTab pattern"
  - "CoinPlaceholder deleted entirely — no dead code left in randomizer.tsx"

patterns-established:
  - "Coin components mirror dice component structure exactly (CoinFace~DieCube, CoinDisplay~DiceDisplay, CoinControls~DiceControls, CoinTab~DiceTab)"
  - "Component tests use vi.hoisted() for mock hook functions and cover render, state, and history sync"

requirements-completed: [COIN-01, COIN-02, COIN-03]

# Metrics
duration: 2min
completed: 2026-03-26
---

# Phase 4 Plan 02: Coin Flipper UI Components Summary

**CSS 3D coin flip with CoinFace/CoinDisplay/CoinControls/CoinTab components wired into the randomizer page, enabling multi-coin (1-10) flip with tally and history**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-26T16:14:58Z
- **Completed:** 2026-03-26T16:17:00Z
- **Tasks:** 2 (of 3 — Task 3 is human-verify checkpoint)
- **Files modified:** 6

## Accomplishments
- Created 4 coin components following the established dice component pattern exactly
- CoinFace renders a CSS 3D disc with heads (H) and tails (T) faces positioned via rotateY — mutually exclusive class swap ensures animation correctness
- CoinTab wires useCoin hook with setTimeout(onFlipEnd, ANIMATION_DURATION) coordination and history sync to parent
- Coin tab enabled (removed `disabled` prop), CoinPlaceholder deleted, CoinTab rendered in randomizer page
- 6 component tests pass; full test suite of 112 tests passes with no regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: CoinFace, CoinDisplay, CoinControls, CoinTab components and tests** - `ba226fb` (feat)
2. **Task 2: Wire CoinTab into randomizer page and enable coin tab** - `10e9b9e` (feat)

**Plan metadata:** (to be committed)

## Files Created/Modified
- `apps/web/src/components/randomizer/coin/coin-face.tsx` - CSS 3D coin disc with heads/tails faces and mutually exclusive flipping/show class swap
- `apps/web/src/components/randomizer/coin/coin-display.tsx` - Grid of N CoinFace components, flex-wrap layout
- `apps/web/src/components/randomizer/coin/coin-controls.tsx` - Stepper (1-10) with Minus/Plus buttons and amber Flip button with Loader2 spinner
- `apps/web/src/components/randomizer/coin/coin-tab.tsx` - Container wiring useCoin to UI, setTimeout animation, history sync
- `apps/web/src/components/randomizer/coin/coin-tab.test.tsx` - 6 component smoke tests covering render, tally display, flipping state, history callback
- `apps/web/src/routes/randomizer.tsx` - Added CoinTab import, removed disabled from coin trigger, replaced CoinPlaceholder with CoinTab, deleted CoinPlaceholder function

## Decisions Made
- coin-flipping and coin-show-* are applied via ternary (mutually exclusive) — critical for CSS animation correctness
- Single setTimeout approach mirrors DiceTab rather than per-coin animationend events
- CoinPlaceholder deleted entirely to keep codebase clean

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- node_modules not available in worktree by default — resolved by running `pnpm install` in the worktree root which populated all packages

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Coin flipper feature is fully implemented and ready for visual verification (Task 3 checkpoint)
- User needs to verify: 3D flip animation looks correct, tally displays properly, history populates, stepper bounds work, no regressions in Wheel/Dice tabs

---
*Phase: 04-coin-flipper*
*Completed: 2026-03-26*
