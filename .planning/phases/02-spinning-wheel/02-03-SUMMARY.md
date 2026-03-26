---
phase: 02-spinning-wheel
plan: 03
subsystem: ui
tags: [react, wheel, lucide-react, testing-library, vitest, shadcn]

# Dependency graph
requires:
  - phase: 02-01
    provides: useWheel hook with items, liveItems, spinning, winner, history, addItem, addBulk, removeItem, reset, startSpin, onSpinEnd, hasRemovedItems
  - phase: 02-02
    provides: WheelCanvas component with spin animation, winner overlay, pointer triangle

provides:
  - WheelItemList component: quick-add input (Enter support), bulk textarea toggle, scrollable item list with x remove, empty state
  - WheelControls component: Spin button (accent bg, disabled/spinning states with Loader2), conditionally visible Reset wheel link
  - WheelTab container: wires useWheel to WheelCanvas + WheelItemList + WheelControls, syncs history to parent, two-column/stacked responsive layout
  - randomizer.tsx updated: WheelPlaceholder removed, WheelTab renders the complete wheel experience
  - test-setup.ts: @testing-library/jest-dom setup file for DOM assertions
affects: [03-dice, 04-coin, future-phases]

# Tech tracking
tech-stack:
  added: []
  patterns: [WheelItemList controlled component pattern with internal state for input/bulk, WheelTab container pattern lifting history via callback]

key-files:
  created:
    - apps/web/src/components/randomizer/wheel/wheel-item-list.tsx
    - apps/web/src/components/randomizer/wheel/wheel-item-list.test.tsx
    - apps/web/src/components/randomizer/wheel/wheel-controls.tsx
    - apps/web/src/components/randomizer/wheel/wheel-tab.tsx
    - apps/web/src/components/randomizer/wheel/wheel-tab.test.tsx
    - apps/web/src/test-setup.ts
  modified:
    - apps/web/src/routes/randomizer.tsx
    - apps/web/vitest.config.ts

key-decisions:
  - "WheelItemList holds its own input state (inputValue, bulkOpen, bulkValue) — keeps form state local, parent only sees addItem/addBulk callbacks"
  - "vi.hoisted() used for mock function in wheel-tab.test.tsx — vi.mock is hoisted before variable declarations so mockFn must also be hoisted"
  - "node_modules symlinked from main repo into worktree — worktree shares git history but not node_modules"

patterns-established:
  - "Container pattern: WheelTab calls hook at top, distributes state down to leaf components via props"
  - "History sync: useEffect watching hook history array, calls onHistoryChange callback for page-level state coordination"
  - "TDD: RED test committed before implementation, GREEN after all tests pass"

requirements-completed: [WHEL-01, WHEL-02, WHEL-03, WHEL-04, WHEL-05, WHEL-06, WHEL-07]

# Metrics
duration: 9min
completed: 2026-03-26
---

# Phase 2 Plan 3: Spinning Wheel UI Integration Summary

**WheelItemList + WheelControls + WheelTab assembled into fully-wired spinning wheel replacing WheelPlaceholder, with 14 passing tests**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-03-26T11:22:00Z
- **Completed:** 2026-03-26T11:31:04Z
- **Tasks:** 2 (Task 3 is checkpoint, not executed)
- **Files modified:** 8

## Accomplishments
- WheelItemList provides complete item CRUD UI: quick-add with Enter support, bulk textarea toggle, per-row x remove, empty state — all verified via 10 tests
- WheelControls provides Spin button (accent bg, Loader2 icon when spinning, tooltip when no items) and conditionally visible Reset wheel link
- WheelTab wires useWheel hook to WheelCanvas + WheelItemList + WheelControls with correct two-column (desktop) / stacked (mobile) layout
- randomizer.tsx now renders the complete spinning wheel in the Wheel tab with history wired via onHistoryChange callback

## Task Commits

Each task was committed atomically:

1. **RED - WheelItemList tests** - `a082c43` (test)
2. **Task 1: WheelItemList + WheelControls** - `33e0f08` (feat)
3. **Task 2: WheelTab + randomizer.tsx wiring** - `1d0b411` (feat)

_Note: TDD tasks have separate RED (test) and GREEN (feat) commits_

## Files Created/Modified
- `apps/web/src/components/randomizer/wheel/wheel-item-list.tsx` - Item management UI: quick-add, bulk textarea, list with remove buttons, empty state
- `apps/web/src/components/randomizer/wheel/wheel-item-list.test.tsx` - 10 tests covering all WheelItemList behaviors
- `apps/web/src/components/randomizer/wheel/wheel-controls.tsx` - Spin + Reset controls with all interaction states
- `apps/web/src/components/randomizer/wheel/wheel-tab.tsx` - Container wiring useWheel to all child components
- `apps/web/src/components/randomizer/wheel/wheel-tab.test.tsx` - 4 tests for WheelTab wiring
- `apps/web/src/routes/randomizer.tsx` - WheelPlaceholder removed, WheelTab + history wired
- `apps/web/src/test-setup.ts` - @testing-library/jest-dom setup for DOM matchers
- `apps/web/vitest.config.ts` - Added test-setup.ts to setupFiles

## Decisions Made
- WheelItemList holds its own input state (inputValue, bulkOpen, bulkValue) — keeps form state local, parent only receives final values via callbacks
- Used `vi.hoisted()` for the mock function in wheel-tab.test.tsx because `vi.mock()` factory is hoisted before variable declarations
- node_modules symlinked from main repo apps/web into the worktree (worktree shares git but not node_modules install)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added @testing-library/jest-dom setup file**
- **Found during:** Task 1 (WheelItemList TDD - GREEN phase)
- **Issue:** vitest.config.ts had `setupFiles: []` — toBeInTheDocument, toBeDisabled, toHaveAttribute all failed with "Invalid Chai property"
- **Fix:** Created `src/test-setup.ts` importing @testing-library/jest-dom, added to vitest.config.ts setupFiles
- **Files modified:** apps/web/src/test-setup.ts, apps/web/vitest.config.ts
- **Verification:** All 10 WheelItemList tests pass after fix
- **Committed in:** 33e0f08 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for test infrastructure. No scope creep.

## Issues Encountered
- wheel-canvas.test.tsx from Plan 02 fails with "Cannot resolve import 'motion'" in the worktree test environment — pre-existing issue, out of scope. Deferred to deferred-items.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None — all components are fully implemented and connected to the useWheel hook. No placeholder data or hardcoded values flow to UI.

## Self-Check: PASSED

All files verified:
- wheel-item-list.tsx: FOUND
- wheel-controls.tsx: FOUND
- wheel-tab.tsx: FOUND
- test-setup.ts: FOUND

All commits verified:
- a082c43 (test RED): FOUND
- 33e0f08 (feat Task 1): FOUND
- 1d0b411 (feat Task 2): FOUND

## Next Phase Readiness
- Complete spinning wheel is functional end-to-end: item entry, wheel animation, winner announcement, auto-remove, reset, localStorage persistence
- Task 3 (checkpoint:human-verify) awaits human verification of the running app
- After human approval, Phase 2 spinning wheel is complete and Phase 3 (dice) can begin
