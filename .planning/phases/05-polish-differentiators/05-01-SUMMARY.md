---
phase: 05-polish-differentiators
plan: 01
subsystem: ui
tags: [react, wheel, animation, css, confetti, badge, ux]

# Dependency graph
requires:
  - phase: 02-spinning-wheel
    provides: useWheel hook with liveItems, hasRemovedItems, onSpinEnd, startSpin

provides:
  - Item count badge above wheel canvas showing live item count
  - Empty state "All done!" confetti celebration with Reset Wheel button
  - Split onSpinEnd timeout: spin lock at 600ms, winner overlay at 2200ms
  - CSS confetti-fall keyframes and .confetti-particle class

affects:
  - 05-02-polish-differentiators

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Split timeout pattern: early lock release (600ms) vs overlay dismiss (2200ms) in onSpinEnd"
    - "Static constant arrays defined outside component for confetti particle data"
    - "hasRemovedItems guard prevents false celebration on manual item deletion"

key-files:
  created: []
  modified:
    - apps/web/src/lib/randomizer/use-wheel.ts
    - apps/web/src/lib/randomizer/use-wheel.test.ts
    - apps/web/src/components/randomizer/wheel/wheel-tab.tsx
    - apps/web/src/components/randomizer/wheel/wheel-tab.test.tsx
    - apps/web/src/index.css

key-decisions:
  - "Split single 2200ms setTimeout into two: isSpinningRef.current=false at 600ms, setWinner(null) at 2200ms — enables instant re-spin while winner overlay persists"
  - "CONFETTI_PARTICLES array defined as module-level constant (not inside component) to avoid recreation on each render"
  - "Empty state celebration guarded by liveItems.length===0 && hasRemovedItems — manual deletion does not trigger celebration"

patterns-established:
  - "Split timeout pattern: use two independent setTimeouts when different UI states need to clear at different times"
  - "Celebration guard pattern: check hasRemovedItems to distinguish spin-removal from manual deletion"

requirements-completed: [WHEL-08, WHEL-09, WHEL-10]

# Metrics
duration: 5min
completed: 2026-03-26
---

# Phase 5 Plan 01: Wheel UX Polish Summary

**Item count badge, CSS confetti celebration, and split 600ms/2200ms re-spin timeout turning the wheel from functional to premium-feeling**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-26T16:45:51Z
- **Completed:** 2026-03-26T16:50:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Split onSpinEnd single timeout (2200ms) into two: spin lock releases at 600ms enabling instant re-spin, winner overlay dismisses at 2200ms independently
- Badge above wheel canvas shows "X items remaining" dynamically, disappears when empty
- CSS confetti animation (confetti-fall keyframes + .confetti-particle) with 10 colored particles
- "All done!" empty state celebration with Reset Wheel button appears only after all items spin-removed
- All 120 project tests pass (27 new/updated wheel tests + 93 existing)

## Task Commits

Each task was committed atomically:

1. **Task 1: Instant re-spin timing in use-wheel.ts** - `3223831` (feat)
2. **Task 2: Item count badge, empty state celebration, and confetti CSS** - `bd3f57e` (feat)

**Plan metadata:** (docs commit follows)

_Note: Task 1 used TDD (RED → GREEN phases with vitest fake timers)_

## Files Created/Modified
- `apps/web/src/lib/randomizer/use-wheel.ts` - Split onSpinEnd into two timeouts (600ms spin lock, 2200ms overlay dismiss)
- `apps/web/src/lib/randomizer/use-wheel.test.ts` - Updated test 15 for 600ms assertion + added re-spin timing (WHEL-10) describe block (4 tests)
- `apps/web/src/components/randomizer/wheel/wheel-tab.tsx` - Badge above canvas, CONFETTI_PARTICLES constant, empty state celebration conditional render
- `apps/web/src/components/randomizer/wheel/wheel-tab.test.tsx` - 4 new tests: badge visibility, empty celebration, manual-deletion guard
- `apps/web/src/index.css` - @keyframes confetti-fall and .confetti-particle CSS class

## Decisions Made
- Split single 2200ms setTimeout into two independent timeouts: `isSpinningRef.current = false` at 600ms (spin lock), `setWinner(null)` at 2200ms (overlay). This enables `startSpin` (which checks `isSpinningRef.current`) to be re-invoked while the previous winner overlay is still on screen.
- `CONFETTI_PARTICLES` defined as a module-level constant (outside component) to prevent recreation on each render cycle.
- Empty state celebration is guarded by `liveItems.length === 0 && hasRemovedItems` — ensuring manual item deletion does not trigger the "All done!" screen (only spin-removal does).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Pre-existing ESLint errors in use-wheel.ts** (not introduced by this plan): The `react-hooks/refs` rule flags 4 violations on lines 119, 122, and 126 where refs are read during render. These are intentional (the itemsRef pattern per State decisions) and pre-existed before this plan. Documented in `deferred-items.md`. wheel-tab.tsx and all test files pass ESLint cleanly.

The node_modules symlink was missing from the worktree (noted in STATE.md decisions for Phase 02-03). Re-created symlink at `apps/web/node_modules` → main repo `apps/web/node_modules` to enable test runner access.

## User Setup Required

None - no external service configuration required.

## Self-Check: PASSED

All files found, all commits verified, all content patterns confirmed. The "items remaining" text appears split across JSX expression on line 60 of wheel-tab.tsx (liveItems.length + "items remaining"), which grep for the literal string misses but is correct.

## Next Phase Readiness
- WHEL-08 (badge), WHEL-09 (celebration), WHEL-10 (instant re-spin) all complete
- Ready for 05-02 polish differentiators
- No blockers

---
*Phase: 05-polish-differentiators*
*Completed: 2026-03-26*
