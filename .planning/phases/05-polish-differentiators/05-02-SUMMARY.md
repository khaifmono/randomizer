---
phase: 05-polish-differentiators
plan: "02"
subsystem: ui
tags: [react, tailwind, vitest, dice, coin, animation, css]

requires:
  - phase: 04-coin-flipper
    provides: useCoin hook, CoinTab component, coin flip animation

provides:
  - Green pip dots on all dice faces using dice-accent CSS theme color
  - Coin session tally accumulating heads/tails across multiple flips
  - clearSession function resetting session totals on history clear

affects:
  - coin-tab rendering
  - die-cube visual appearance
  - randomizer.tsx handleClearHistory

tech-stack:
  added: []
  patterns:
    - "registerClearSession ref callback: parent passes a registration function to child; child calls it on mount with its clear function; parent stores ref and calls on history clear"
    - "TDD RED/GREEN: failing tests committed before implementation to capture intended behavior"

key-files:
  created: []
  modified:
    - apps/web/src/components/randomizer/dice/die-cube.tsx
    - apps/web/src/components/randomizer/dice/dice-tab.test.tsx
    - apps/web/src/lib/randomizer/use-coin.ts
    - apps/web/src/lib/randomizer/use-coin.test.ts
    - apps/web/src/components/randomizer/coin/coin-tab.tsx
    - apps/web/src/components/randomizer/coin/coin-tab.test.tsx
    - apps/web/src/routes/randomizer.tsx

key-decisions:
  - "registerClearSession ref callback pattern: parent stores a ref to child's clearSession, called in handleClearHistory alongside setCoinHistory([]), avoids prop-drilling or useImperativeHandle"
  - "Session tally rendered above CoinDisplay so it's visible before the coin animation result, providing persistent context"
  - "node_modules symlinked from main repo into worktree to enable vitest to resolve packages (consistent with Phase 02-03 decision)"

patterns-established:
  - "Ref callback registration: parent creates a useRef<(() => void) | null>(null), passes registerFn to child, child calls it in useEffect on mount"

requirements-completed: [DICE-05, COIN-04]

duration: 5min
completed: 2026-03-26
---

# Phase 05 Plan 02: Polish Differentiators Summary

**Green dice pips via bg-dice-accent and coin session tally showing "XH YT across Z flips" with clear-on-history-reset**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-26T16:46:00Z
- **Completed:** 2026-03-26T16:51:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Changed die pip dot color from `bg-neutral-900` to `bg-dice-accent` (oklch green) across all six die faces
- Added `sessionHeads`, `sessionTails`, `clearSession` to `useCoin` hook with accumulation across flip events
- Displayed running session tally in `CoinTab` as "XH YT across Z flips" above the coin display
- Wired session clear to fire when parent `handleClearHistory` is called via ref callback pattern
- 118 tests passing (was 111 before this plan added 7 new tests)

## Task Commits

Each task was committed atomically:

1. **Task 1: Green pip dots on dice faces** - `a035108` (feat)
2. **Task 2 RED: Failing tests for coin session tally** - `fce55a1` (test)
3. **Task 2 GREEN: Coin session tally implementation** - `545f6de` (feat)

_Note: Task 2 used TDD — RED commit before GREEN implementation._

## Files Created/Modified

- `apps/web/src/components/randomizer/dice/die-cube.tsx` - Changed pip dot class from `bg-neutral-900` to `bg-dice-accent`
- `apps/web/src/components/randomizer/dice/dice-tab.test.tsx` - Added `DieCube` pip dot test asserting `bg-dice-accent`
- `apps/web/src/lib/randomizer/use-coin.ts` - Added `sessionHeads`, `sessionTails` state, session accumulation in `onFlipEnd`, `clearSession` callback
- `apps/web/src/lib/randomizer/use-coin.test.ts` - Added `session tally (COIN-04)` describe block (3 tests)
- `apps/web/src/components/randomizer/coin/coin-tab.tsx` - Added session tally display, `registerClearSession` prop, useEffect to register clear function
- `apps/web/src/components/randomizer/coin/coin-tab.test.tsx` - Added 2 tests for session tally visibility
- `apps/web/src/routes/randomizer.tsx` - Added `useRef` import, `coinClearSessionRef`, wired `registerClearSession` and called `coinClearSessionRef.current?.()` in `handleClearHistory`

## Decisions Made

- `registerClearSession` ref callback pattern chosen over `useImperativeHandle` or prop-drilling — parent stores a ref to child's `clearSession`, child registers it via `useEffect` on mount. Simple, no ref forwarding needed.
- Session tally rendered above `CoinDisplay` (not below controls) so it's persistent context visible before/after animation.

## Deviations from Plan

None - plan executed exactly as written. The plan provided detailed implementation instructions including the exact ref callback pattern, which was implemented as specified.

## Issues Encountered

- Worktree did not have `node_modules` — symlinked from main repo's `apps/web/node_modules` so vitest could resolve packages. This matched the established pattern from Phase 02-03.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Dice visual polish (green pips) and coin session tracking are complete
- All 118 tests pass, no ESLint warnings
- Ready for remaining Phase 05 plans

## Self-Check: PASSED

All files verified present. All commits verified in git log:
- `a035108` - feat(05-02): green pip dots
- `fce55a1` - test(05-02): failing tests (TDD RED)
- `545f6de` - feat(05-02): coin session tally implementation

---
*Phase: 05-polish-differentiators*
*Completed: 2026-03-26*
