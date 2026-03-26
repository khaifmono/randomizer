---
phase: 04-coin-flipper
plan: 01
subsystem: ui
tags: [react, hooks, css, animation, tdd, vitest]

# Dependency graph
requires:
  - phase: 03-dice-roller
    provides: useDice hook pattern (isRollingRef, pendingResultsRef, onRollEnd) and dice CSS animation classes
provides:
  - useCoin hook with count (1-10), flipping guard, pre-determined heads/tails results, tally, history
  - ANIMATION_DURATION=1200 constant exported from use-coin.ts
  - CSS 3D coin flip animation classes in index.css (coin-scene, coin-disc, coin-face, coin-flipping, coin-show-heads, coin-show-tails)
affects: [04-coin-flipper plan-02 CoinTab component]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - isFlippingRef synchronous guard prevents double-trigger during animation
    - pendingResultsRef stores pre-determined results stable across animation duration
    - onFlipEnd 200ms settle delay before clearing flipping state
    - CSS coin-flipping and coin-show-heads/coin-show-tails classes are mutually exclusive

key-files:
  created:
    - apps/web/src/lib/randomizer/use-coin.ts
    - apps/web/src/lib/randomizer/use-coin.test.ts
  modified:
    - apps/web/src/index.css

key-decisions:
  - "useCoin mirrors useDice exactly — same ref-guard patterns, 200ms settle delay, history management"
  - "Coin count range is 1-10 (not 1-6 like dice), initial count=1"
  - "CSS coin-flip keyframe uses 1440deg (4 full rotations) for satisfying visual"
  - "coin-face uses border-radius: 50% for circular disc shape"

patterns-established:
  - "useCoin pattern: pre-determine results in startFlip, compute tally in onFlipEnd with label 'XH YT (Z coins)'"
  - "CSS animation classes are mutually exclusive: never apply coin-flipping with coin-show-heads/tails simultaneously"

requirements-completed: [COIN-01, COIN-02, COIN-03]

# Metrics
duration: 2min
completed: 2026-03-26
---

# Phase 4 Plan 01: useCoin Hook and CSS Animation Summary

**useCoin hook with TDD (11 tests), ANIMATION_DURATION=1200, and CSS 3D coin-flip animation classes mirroring the useDice pattern**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-26T13:15:28Z
- **Completed:** 2026-03-26T13:16:52Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Implemented useCoin hook with full state management (count 1-10, flipping guard, pre-determined heads/tails, tally, history)
- Achieved 11/11 TDD tests passing using RED-GREEN-REFACTOR cycle
- Added CSS 3D coin flip animation block to index.css with all required classes and 1.2s keyframe animation
- Full suite of 106 tests passes with no regressions

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Failing tests for useCoin** - `fd85f6d` (test)
2. **Task 1 GREEN: useCoin hook implementation** - `c4b3840` (feat)
3. **Task 2: CSS coin flip animation classes** - `708185a` (feat)

_Note: TDD task has two commits (test RED → feat GREEN)_

## Files Created/Modified
- `apps/web/src/lib/randomizer/use-coin.ts` - useCoin hook with ANIMATION_DURATION=1200, isFlippingRef guard, pendingResultsRef, heads/tails computation, history management
- `apps/web/src/lib/randomizer/use-coin.test.ts` - 11 tests covering all hook behaviors
- `apps/web/src/index.css` - CSS 3D coin flip animation block (coin-scene, coin-disc, coin-face, coin-face-heads, coin-face-tails, @keyframes coin-flip, coin-flipping, coin-show-heads, coin-show-tails)

## Decisions Made
- Mirrored useDice pattern exactly for consistency — same ref-guard approach, same 200ms settle delay, same history prepend pattern
- Coin count range 1-10 (initial count=1) rather than dice's 1-6 (initial count=2) as specified
- CSS coin-flip keyframe rotates 1440deg (4 full rotations at 1.2s) for a satisfying visual effect
- Used oklch color values for gold/amber coin faces (matching existing project color conventions)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- node_modules not present in worktree — symlinked from main repo `apps/web/node_modules` to enable test runner (same pattern documented in STATE.md decisions from Phase 02-03)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- useCoin hook ready for consumption by CoinTab component (Plan 02)
- ANIMATION_DURATION=1200 exported for use in CoinTab's setTimeout wiring
- CSS classes ready for component to conditionally apply coin-flipping / coin-show-heads / coin-show-tails
- Pattern established: CoinTab must wire onFlipEnd via useEffect+setTimeout(ANIMATION_DURATION) — same as DiceTab

## Self-Check: PASSED

- FOUND: apps/web/src/lib/randomizer/use-coin.ts
- FOUND: apps/web/src/lib/randomizer/use-coin.test.ts
- FOUND: .planning/phases/04-coin-flipper/04-01-SUMMARY.md
- FOUND: fd85f6d (test RED commit)
- FOUND: c4b3840 (feat GREEN commit)
- FOUND: 708185a (feat CSS commit)

---
*Phase: 04-coin-flipper*
*Completed: 2026-03-26*
