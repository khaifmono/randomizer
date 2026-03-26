---
phase: 02-spinning-wheel
verified: 2026-03-26T12:20:00Z
status: gaps_found
score: 9/10 must-haves verified
re_verification: false
gaps:
  - truth: "All tests pass across the workspace (no regressions)"
    status: failed
    reason: "6 tests in src/routes/randomizer.test.tsx fail with 'ResizeObserver is not defined' — this pre-Phase-2 test file was written against the old WheelPlaceholder and now renders the real WheelCanvas (via WheelTab) without the ResizeObserver mock that wheel-canvas.test.tsx provides. One test also checks for stale text 'Add items to spin the wheel' which never existed in Phase 2 output."
    artifacts:
      - path: "apps/web/src/routes/randomizer.test.tsx"
        issue: "Six tests fail: ResizeObserver not mocked, and one test looks for text 'Add items to spin the wheel' (stale Phase 1 expectation — the actual empty-state text in the canvas is 'Add items to spin', and the item list empty state says 'No items yet')"
    missing:
      - "Add global ResizeObserver mock and motion mock to randomizer.test.tsx (or its vitest setup) so WheelCanvas renders without crashing"
      - "Update stale test assertion from 'Add items to spin the wheel' to a text that actually appears in the wheel tab (e.g. 'Enter an item...' or 'No items yet')"
human_verification:
  - test: "End-to-end spin flow in browser"
    expected: "Wheel animates smoothly with cubic-bezier deceleration, stops on winner, overlay fades, winner disappears from list"
    why_human: "Canvas animation, timing, and visual quality cannot be verified programmatically"
  - test: "localStorage persistence across page refresh"
    expected: "Items added before refresh are still in the list after refresh"
    why_human: "Requires a live browser session to test actual localStorage read/write round-trip"
  - test: "Responsive layout at mobile viewport"
    expected: "Canvas + controls stack above item list panel when viewport < 768px"
    why_human: "CSS breakpoint behavior is not testable in jsdom"
---

# Phase 02: Spinning Wheel — Verification Report

**Phase Goal:** Users can spin a custom-item wheel that animates smoothly and manages its item list across sessions
**Verified:** 2026-03-26T12:20:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | useWheel hook manages items with addItem, removeItem, addBulk, reset, startSpin | VERIFIED | `use-wheel.ts` line 32-79: all functions implemented with itemsRef pattern, 15 passing tests |
| 2 | Items persist to localStorage on every mutation and restore on hook initialization | VERIFIED | `use-wheel.ts` line 9: `readStorage` in useState initializer; `applyItems` line 29: `writeStorage` on every mutation |
| 3 | startSpin pre-determines winnerIndex before setting spinning=true | VERIFIED | `use-wheel.ts` lines 71-78: winnerIndex computed before `setSpinning(true)`, guarded by isSpinningRef |
| 4 | onSpinEnd removes winner, appends to history, clears spinning after overlay timeout | VERIFIED | `use-wheel.ts` lines 81-112: removes winner from liveItems, prepends HistoryEntry, setTimeout 2200ms |
| 5 | reset restores items to original snapshot from load | VERIFIED | `use-wheel.ts` line 67: `applyItems([...originalItemsRef.current])` |
| 6 | WheelCanvas renders colored segments with motion animation and winner overlay | VERIFIED | `wheel-canvas.tsx` 238 lines: Canvas 2D draw loop, `animate()` from motion with ease `[0.12, 0, 0.39, 0]`, winner overlay renders when `winner !== null` |
| 7 | User can add, remove, and bulk-add items from the UI | VERIFIED | `wheel-item-list.tsx`: quick-add input, Enter key handler, bulk textarea toggle, per-row x buttons, empty state |
| 8 | WheelTab wires useWheel to WheelCanvas + WheelItemList + WheelControls and syncs history | VERIFIED | `wheel-tab.tsx`: `useWheel()` at top, all state distributed to children, `useEffect` syncing history via `onHistoryChange` |
| 9 | randomizer.tsx renders WheelTab (WheelPlaceholder removed) | VERIFIED | `randomizer.tsx` line 10: `import { WheelTab }`, line 101: `<WheelTab onHistoryChange={setWheelHistory} />`, no WheelPlaceholder function exists |
| 10 | All tests pass across the workspace | FAILED | 6 tests in `src/routes/randomizer.test.tsx` fail with `ResizeObserver is not defined` — WheelCanvas renders inside RandomizerPage but this test file has no ResizeObserver mock |

**Score:** 9/10 truths verified

---

### Required Artifacts

| Artifact | Provided | Status | Details |
|----------|----------|--------|---------|
| `apps/web/src/lib/randomizer/local-storage.ts` | readStorage, writeStorage with try/catch | VERIFIED | 22 lines, both functions exported, error-safe |
| `apps/web/src/lib/randomizer/wheel-math.ts` | normalizeAngle, calculateStopAngle, SEGMENT_COLORS, getSegmentColor | VERIFIED | 35 lines, all 4 exports present, exact SEGMENT_COLORS palette confirmed |
| `apps/web/src/lib/randomizer/use-wheel.ts` | useWheel hook with full state management | VERIFIED | 133 lines, returns all 12 expected keys including hasRemovedItems |
| `apps/web/src/components/randomizer/wheel/wheel-canvas.tsx` | WheelCanvas with Canvas rendering, animation, overlay | VERIFIED | 238 lines (exceeds min_lines: 100), all Canvas/motion/DPR features present |
| `apps/web/src/components/randomizer/wheel/wheel-item-list.tsx` | WheelItemList with quick-add, bulk, remove | VERIFIED | 132 lines, all UI behaviors implemented |
| `apps/web/src/components/randomizer/wheel/wheel-controls.tsx` | WheelControls with Spin + Reset | VERIFIED | 46 lines, Loader2 icon, conditional Reset visibility |
| `apps/web/src/components/randomizer/wheel/wheel-tab.tsx` | WheelTab container | VERIFIED | 67 lines, useWheel() called, all children rendered, history synced |
| `apps/web/src/routes/randomizer.tsx` | Page updated to use WheelTab | VERIFIED | WheelPlaceholder removed, WheelTab imported and rendered |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| use-wheel.ts | local-storage.ts | readStorage / writeStorage imports | VERIFIED | Line 2: `import { readStorage, writeStorage }`, used in useState (line 10) and applyItems (line 29) |
| use-wheel.ts | types.ts | HistoryEntry type import | VERIFIED | Line 3: `import type { HistoryEntry } from "./types"` |
| wheel-canvas.tsx | wheel-math.ts | getSegmentColor, calculateStopAngle | VERIFIED | Line 3: `import { getSegmentColor, calculateStopAngle }`, used in draw loop (line 105) and spin effect (line 168) |
| wheel-canvas.tsx | motion | animate() imperative API | VERIFIED | Line 2: `import { animate } from "motion"`, used line 171 with onUpdate driving rotationRef |
| wheel-tab.tsx | use-wheel.ts | useWheel() call | VERIFIED | Line 2: import, line 12: `useWheel()` call at top of component |
| wheel-tab.tsx | wheel-canvas.tsx | WheelCanvas rendered with hook state | VERIFIED | Line 3: import, line 38: `<WheelCanvas items={items} spinning={spinning} .../>` |
| randomizer.tsx | wheel-tab.tsx | WheelTab import replacing WheelPlaceholder | VERIFIED | Line 10: `import { WheelTab }`, line 101: `<WheelTab onHistoryChange={setWheelHistory} />` |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| wheel-canvas.tsx | items (segments drawn) | useWheel().items — snapshot or live from localStorage | Yes — items populated from readStorage, mutated by user actions, frozen via itemsSnapshotRef during spin | FLOWING |
| wheel-canvas.tsx | rotationRef | animate() onUpdate callback from motion | Yes — driven frame-by-frame by motion's imperative animate() with cubic-bezier easing | FLOWING |
| wheel-canvas.tsx | winner (overlay display) | useWheel().winner — set in onSpinEnd from itemsSnapshotRef | Yes — real item label from snapshot, cleared after 2200ms | FLOWING |
| wheel-tab.tsx | history (passed to onHistoryChange) | useWheel().history — prepended on each onSpinEnd | Yes — HistoryEntry objects with real labels, timestamps, and auto-incremented IDs | FLOWING |
| randomizer.tsx | wheelHistory (passed to ResultHistory) | WheelTab onHistoryChange callback | Yes — receives real history array from useWheel hook via callback | FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Motion installed in package.json | `grep "motion" apps/web/package.json` | `"motion": "^12.38.0"` | PASS |
| local-storage.ts exports readStorage, writeStorage | Grep exports | Both exported at line 21 | PASS |
| wheel-math.ts exports correct SEGMENT_COLORS | Grep palette | Exact 10-color array confirmed | PASS |
| useWheel returns all expected keys | Read source | 12 keys in return object confirmed | PASS |
| WheelPlaceholder no longer in randomizer.tsx | Grep | Not found | PASS |
| WheelTab rendered in randomizer.tsx wheel tab | Grep | Line 101 confirmed | PASS |
| Full test suite | `npx vitest run` from apps/web | 73 pass / 6 fail | PARTIAL — 6 pre-Phase-2 tests in randomizer.test.tsx fail due to missing ResizeObserver mock |
| TypeScript compilation | `npx tsc --noEmit` from apps/web | No output (exit 0) | PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| WHEL-01 | 02-01, 02-03 | User can enter custom items for the wheel (add/remove from list) | SATISFIED | useWheel addItem/removeItem/addBulk; WheelItemList with input, bulk toggle, x buttons |
| WHEL-02 | 02-02, 02-03 | User sees a spinning wheel that animates with smooth deceleration | SATISFIED | WheelCanvas with requestAnimationFrame draw loop + motion imperative animate() |
| WHEL-03 | 02-02, 02-03 | User sees the winning item clearly announced after the wheel stops | SATISFIED | Winner overlay in WheelCanvas: `animate-in fade-in zoom-in-95`, renders `winner` name at 20px/600 |
| WHEL-04 | 02-01, 02-03 | Winning item is automatically removed after each spin | SATISFIED | onSpinEnd filters winner from liveItems (use-wheel.ts line 98-105) |
| WHEL-05 | 02-01, 02-03 | User can reset the wheel to restore all removed items | SATISFIED | reset() in useWheel restores originalItemsRef; WheelControls "Reset wheel" conditionally visible |
| WHEL-06 | 02-01, 02-03 | Wheel item list persists in localStorage across sessions | SATISFIED | readStorage in useState initializer; writeStorage in applyItems on every mutation |
| WHEL-07 | 02-02, 02-03 | Wheel spin uses smooth cubic-bezier deceleration that feels premium | SATISFIED | ease: [0.12, 0, 0.39, 0] in animate() call; 4-5 second duration; 4-6 full rotations |

**WHEL-08, WHEL-09, WHEL-10** — not claimed by Phase 2 plans; mapped to Phase 5 in REQUIREMENTS.md. These are not orphaned — they are deferred by design.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| apps/web/src/routes/randomizer.tsx | 136-152 | DicePlaceholder with "Coming in the next phase" text | Info | Expected — Phase 3 not yet built. DicePlaceholder is intentional and marked `disabled` |
| apps/web/src/routes/randomizer.tsx | 154-170 | CoinPlaceholder with "Coming in the next phase" text | Info | Expected — Phase 4 not yet built. CoinPlaceholder is intentional and marked `disabled` |
| apps/web/src/routes/randomizer.test.tsx | 33-36 | Test checks for "Add items to spin the wheel" — stale Phase 1 expectation | Blocker | This text never existed in Phase 2 output; test was written pre-Phase-2 and never updated |
| apps/web/src/routes/randomizer.test.tsx | 1-47 | All 6 tests fail — ResizeObserver not defined in jsdom environment | Blocker | WheelCanvas uses ResizeObserver in useEffect; test renders the full RandomizerPage tree including WheelCanvas without the mock that wheel-canvas.test.tsx provides |

Note: The DicePlaceholder and CoinPlaceholder stubs are intentional phase scaffolding, not goal-blocking stubs for Phase 2. They do not render dynamic data and have no data-flow concerns.

---

### Human Verification Required

#### 1. Spin Animation Quality

**Test:** Start dev server, navigate to /randomizer, click Spin
**Expected:** Wheel spins 4-6 full rotations with fast start and dramatic slowdown matching cubic-bezier [0.12, 0, 0.39, 0]; stops cleanly on winner segment; winner overlay fades in with zoom-in effect; overlay disappears after ~2 seconds
**Why human:** Canvas animation timing and visual quality cannot be asserted in jsdom; motion's animate() is mocked in tests

#### 2. localStorage Persistence

**Test:** Add a uniquely named item ("TestPersistence-XYZ"), then hard-refresh the page (Cmd+Shift+R)
**Expected:** The item reappears in the list after refresh
**Why human:** Requires a live browser with real localStorage; jsdom's localStorage is in-memory per test run

#### 3. Responsive Layout

**Test:** Open browser DevTools, resize viewport to 375px wide
**Expected:** Wheel + controls stack above the item panel (no side-by-side columns)
**Why human:** CSS Tailwind md: breakpoints cannot be tested in jsdom

---

## Gaps Summary

**1 gap blocks a clean test suite.** The pre-Phase-2 test file `apps/web/src/routes/randomizer.test.tsx` was written in Phase 1 to test the old WheelPlaceholder. Phase 2 replaced WheelPlaceholder with WheelTab (which renders WheelCanvas), but `randomizer.test.tsx` was never updated to:

1. Mock `ResizeObserver` — WheelCanvas creates a `new ResizeObserver` in a useEffect, which throws in jsdom without a global mock
2. Mock `motion` — WheelCanvas imports from `motion`, which is not resolvable in the test environment without a mock
3. Update the stale assertion that looks for `"Add items to spin the wheel"` (this text never existed in Phase 2)

All 7 Phase 2 artifacts are fully implemented, substantive, and wired. The data flow is real end-to-end. The gap is purely a test infrastructure issue — the spinning wheel feature itself is complete.

---

_Verified: 2026-03-26T12:20:00Z_
_Verifier: Claude (gsd-verifier)_
