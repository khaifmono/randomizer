---
phase: 02-spinning-wheel
plan: 01
subsystem: ui
tags: [react, vitest, localStorage, canvas, wheel, motion, hooks]

requires:
  - phase: 01-foundation
    provides: "types.ts with HistoryEntry and TabId types"

provides:
  - "motion@^12 installed for wheel spin deceleration animation"
  - "readStorage/writeStorage localStorage utilities with try/catch error guards"
  - "normalizeAngle, calculateStopAngle, SEGMENT_COLORS, getSegmentColor wheel math utilities"
  - "useWheel React hook with full spinning wheel state management"

affects:
  - 02-spinning-wheel
  - 03-wheel-canvas
  - wheel-canvas.tsx (reads items, winnerIndex from useWheel)
  - wheel-item-list.tsx (reads liveItems, addItem, addBulk, removeItem from useWheel)
  - wheel-controls.tsx (reads spinning, hasRemovedItems, startSpin, reset from useWheel)

tech-stack:
  added: ["motion@^12.38.0 — wheel spin deceleration animation"]
  patterns:
    - "itemsRef pattern: useRef mirrors useState so callbacks always access latest value without stale closure"
    - "originalItemsRef: tracks user-mutated items for reset, not updated by spin-driven removals"
    - "itemsSnapshotRef: frozen during spin animation so Canvas reads stable item count"
    - "isSpinningRef: synchronous spin guard (useRef, not useState) prevents double-spin"
    - "Pre-determine winnerIndex before setSpinning(true): no angle drift bugs possible"

key-files:
  created:
    - apps/web/src/lib/randomizer/local-storage.ts
    - apps/web/src/lib/randomizer/local-storage.test.ts
    - apps/web/src/lib/randomizer/wheel-math.ts
    - apps/web/src/lib/randomizer/wheel-math.test.ts
    - apps/web/src/lib/randomizer/use-wheel.ts
    - apps/web/src/lib/randomizer/use-wheel.test.ts
  modified:
    - apps/web/package.json (added motion@^12.38.0)
    - pnpm-lock.yaml

key-decisions:
  - "itemsRef pattern chosen over functional setState updater for callbacks to avoid stale closure issues in rapid sequential mutations (removeItem loops)"
  - "originalItemsRef initialized via readStorage (not from useState value) to correctly mirror initial load"
  - "onSpinEnd does NOT update originalItemsRef — only user-initiated add/remove actions do, preserving reset semantics"

patterns-established:
  - "TDD RED→GREEN: tests written first, failing, then implementation, then all green"
  - "localStorage tests use jsdom built-in (vitest environment: jsdom)"
  - "useWheel tests use @testing-library/react renderHook + act + vi.useFakeTimers for timeout testing"

requirements-completed: [WHEL-01, WHEL-04, WHEL-05, WHEL-06]

duration: 25min
completed: 2026-03-26
---

# Phase 02 Plan 01: Wheel Logic Layer Summary

**motion@^12 installed, localStorage/wheel-math utilities, and useWheel hook delivering full spin state management with 44 passing TDD tests**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-26T10:48:00Z
- **Completed:** 2026-03-26T11:13:26Z
- **Tasks:** 2
- **Files modified:** 8 (6 created, 2 modified)

## Accomplishments

- motion@^12.38.0 installed; all 683 packages resolved without errors
- localStorage utility (readStorage/writeStorage) with try/catch guards, 8 passing tests
- wheel-math utilities: normalizeAngle, calculateStopAngle, SEGMENT_COLORS, getSegmentColor verified for all item counts 2-10, 21 passing tests
- useWheel hook with full state lifecycle: CRUD, localStorage persistence, pre-determined winner, remove-on-spin, reset, history; 15 passing tests
- Zero Canvas/DOM references in any of the three implementation files — pure logic layer

## Task Commits

1. **Task 1: Install motion and create localStorage + wheel-math utilities with tests** - `43799b8` (feat)
2. **Task 2: Create useWheel custom hook with tests** - `734ce0b` (feat)

## Files Created/Modified

- `apps/web/package.json` - Added motion@^12.38.0 dependency
- `pnpm-lock.yaml` - Updated lockfile with motion and transitive deps
- `apps/web/src/lib/randomizer/local-storage.ts` - readStorage/writeStorage with error guards
- `apps/web/src/lib/randomizer/local-storage.test.ts` - 8 tests covering read/write/error cases
- `apps/web/src/lib/randomizer/wheel-math.ts` - normalizeAngle, calculateStopAngle, SEGMENT_COLORS, getSegmentColor
- `apps/web/src/lib/randomizer/wheel-math.test.ts` - 21 tests covering all angle cases and item counts 2-10
- `apps/web/src/lib/randomizer/use-wheel.ts` - useWheel hook with itemsRef, originalItemsRef, itemsSnapshotRef, isSpinningRef patterns
- `apps/web/src/lib/randomizer/use-wheel.test.ts` - 15 tests covering all state transitions

## Decisions Made

- **itemsRef pattern over functional setState**: Rapid sequential mutations (e.g., removeItem loop in tests) require callbacks to always read the latest value. `useRef` mirroring `useState` solves stale closure issues without requiring functional updaters to thread through all call sites.
- **originalItemsRef initialized via readStorage**: The ref must start with the same value as the state, so calling `readStorage` again (not reading `items`) avoids a subtle initialization order issue.
- **onSpinEnd does NOT update originalItemsRef**: Only user-initiated mutations (addItem, addBulk, removeItem) update the "original" snapshot. Spin-driven removals are intentional ephemeral changes that reset() should be able to undo.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed stale closure issue in removeItem/addItem by introducing itemsRef**
- **Found during:** Task 2 (useWheel hook implementation)
- **Issue:** Initial design passed `items` directly to callbacks via wrapper `(index) => removeItem(index, items)`. When the test called `removeItem(0)` four times in a loop, all four calls operated on the same stale `items` array from the render where the wrapper was defined.
- **Fix:** Introduced `itemsRef = useRef<string[]>(items)` that is synchronously updated in `applyItems()`. All callbacks read `itemsRef.current` instead of closed-over `items`.
- **Files modified:** `apps/web/src/lib/randomizer/use-wheel.ts`
- **Verification:** "startSpin does nothing when there are no items" test now passes
- **Committed in:** `734ce0b` (Task 2 commit)

**2. [Rule 1 - Bug] Fixed originalItemsRef initialization (function vs array)**
- **Found during:** Task 2 (useWheel hook first test run)
- **Issue:** `useRef<string[]>(() => readStorage(...))` passes a function to `useRef`. Unlike `useState`, `useRef` does not call functions — it stores the function itself. `originalItemsRef.current.length` was `0` (function.length with 0 params) instead of `4`.
- **Fix:** Changed to `useRef<string[]>(readStorage(STORAGE_KEY, DEFAULT_ITEMS))` — call the function immediately.
- **Files modified:** `apps/web/src/lib/randomizer/use-wheel.ts`
- **Verification:** "hasRemovedItems is false initially, true after spin removes an item" and "reset restores items" tests now pass
- **Committed in:** `734ce0b` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - Bug)
**Impact on plan:** Both bugs were in the hook implementation, discovered during RED→GREEN TDD cycle. No scope creep.

## Issues Encountered

- `pnpm --filter @base-project/web exec vitest run` from the main monorepo root searches `apps/web` relative to the main worktree, not the agent worktree. Fixed by running `npx vitest run` directly from the agent worktree's `apps/web` directory (`/Users/khaif/Documents/code-repo/randomizer-toolkit/.claude/worktrees/agent-a6791f78/apps/web`).

## Known Stubs

None — all three files deliver complete, tested implementations with no placeholder data or TODO markers.

## Next Phase Readiness

- All three files are ready to be imported by Plan 02 (WheelCanvas) and Plan 03 (WheelTab + UI components)
- `useWheel` exports match the interface expected by `WheelCanvas` (`items`, `winnerIndex`, `spinning`, `onSpinEnd`)
- `calculateStopAngle` and `SEGMENT_COLORS` are ready for use in the Canvas draw loop
- motion@^12 is installed and available for `useAnimate()` in wheel-canvas.tsx

---
*Phase: 02-spinning-wheel*
*Completed: 2026-03-26*

## Self-Check: PASSED

- All 7 expected files exist on disk
- Both task commits (43799b8, 734ce0b) exist in git log
