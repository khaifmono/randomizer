---
phase: 06-number-generator
plan: 01
subsystem: randomizer/number
tags: [hook, tdd, animation, css, slot-machine]
dependency_graph:
  requires: []
  provides:
    - useNumber hook with range, rolling, digits, history
    - CSS slot-machine reel animation classes
    - --color-number-accent design token
  affects:
    - apps/web/src/lib/randomizer/types.ts (TabId updated)
tech_stack:
  added: []
  patterns:
    - TDD (red-green-refactor)
    - isRollingRef synchronous double-trigger guard
    - pendingResultRef pre-determined result pattern
    - CSS custom properties for per-reel JS control (--reel-target, --reel-duration)
key_files:
  created:
    - apps/web/src/lib/randomizer/use-number.ts
    - apps/web/src/lib/randomizer/use-number.test.ts
  modified:
    - apps/web/src/lib/randomizer/types.ts
    - apps/web/src/index.css
decisions:
  - useNumber follows exact useDice/useCoin pattern with isRollingRef guard and 200ms settle delay
  - onRollEnd takes min/max in useCallback deps so label captures current range values
  - REEL_STAGGER_MS=200 and BASE_REEL_DURATION_MS=1000 exported as named constants for component use
  - --color-number-accent oklch(0.60 0.20 310) purple/magenta distinct from wheel(240), dice(145), coin(80)
  - CSS keyframe overshoot at 92% (bounce past target by 10px) for mechanical slot-machine feel
metrics:
  duration: 6min
  completed_date: 2026-03-27
  tasks_completed: 2
  files_created: 2
  files_modified: 2
---

# Phase 06 Plan 01: useNumber Hook and CSS Slot-Machine Reel Animation Summary

useNumber hook with configurable min/max range, digit decomposition, rolling guard, history, and CSS keyframe animation for slot-machine reel display.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 (RED) | useNumber failing tests | 829e6cf | use-number.test.ts |
| 1 (GREEN) | useNumber hook implementation | 3f0aa35 | use-number.ts, types.ts |
| 2 | CSS reel animation and accent token | 0d15ce6 | index.css |

## Decisions Made

1. **onRollEnd label with range context:** Hook captures current `min`/`max` in `useCallback` deps so the history label accurately reflects the range at the time of the roll (e.g., "42 (1-100)").

2. **Exported timing constants:** `REEL_STAGGER_MS` (200ms) and `BASE_REEL_DURATION_MS` (1000ms) exported from the hook so the future NumberTab component can compute per-reel `--reel-duration` inline styles without hardcoding values.

3. **CSS overshoot animation:** The `@keyframes number-reel-scroll` overshoots the target at 92% (bounces 10px past) then settles. This gives a satisfying mechanical slot-machine feel matching the physical behavior of slot reels.

4. **No pendingDigitsRef needed:** Digits are derived directly from the result value and stored in React state. Unlike pendingResultsRef in useDice (needed for sum computation in onRollEnd), the digit array isn't needed after the animation — the component reads from `digits` state for rendering.

## Deviations from Plan

None — plan executed exactly as written. The test count is 15 (vs. 12 described in plan) because Test 4 was split into two tests (min<0 and max>999999) and Test 9 was split into three tests (42→[4,2], 7→[7], 100→[1,0,0]) for clearer test isolation.

## Known Stubs

None — this plan creates a hook with no UI rendering. The hook itself is fully functional with real randomization logic. The CSS classes are real (not stubs). The component that renders the slot-machine UI will be created in Plan 06-02.

## Self-Check: PASSED

- [x] apps/web/src/lib/randomizer/use-number.ts — created
- [x] apps/web/src/lib/randomizer/use-number.test.ts — created
- [x] apps/web/src/lib/randomizer/types.ts — modified (TabId includes "number")
- [x] apps/web/src/index.css — modified (@keyframes number-reel-scroll added)
- [x] 829e6cf — test(06-01): add failing tests for useNumber hook
- [x] 3f0aa35 — feat(06-01): implement useNumber hook with range, rolling, digits, and history
- [x] 0d15ce6 — feat(06-01): add CSS slot-machine reel animation and number accent token
- [x] All 15 use-number tests pass
- [x] All 141 tests pass (no regressions)
