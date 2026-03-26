---
phase: 02-spinning-wheel
plan: 02
subsystem: ui
tags: [react, canvas, animation, motion, vitest, wheel, dpr]

requires:
  - phase: 02-spinning-wheel
    plan: 01
    provides: "calculateStopAngle, getSegmentColor from wheel-math.ts; useWheel hook contract"

provides:
  - "WheelCanvas component with Canvas rendering, DPR scaling, motion animation, pointer triangle, winner overlay"

affects:
  - 02-spinning-wheel
  - 03-wheel-tab (will import WheelCanvas and wire it to useWheel)

tech-stack:
  added: []
  patterns:
    - "itemsRef pattern in draw loop: useRef mirrors items prop so rAF callback always reads latest without stale closure"
    - "motion imperative animate() (from 'motion' package): drives rotationRef value via onUpdate callback, rAF draw loop reads it each frame"
    - "ResizeObserver on canvas parent for responsive DPR-aware sizing"
    - "HTML SVG overlay for pointer triangle (not drawn on canvas) — avoids canvas repaint costs"

key-files:
  created:
    - apps/web/src/components/randomizer/wheel/wheel-canvas.tsx
    - apps/web/src/components/randomizer/wheel/wheel-canvas.test.tsx
  modified:
    - apps/web/vitest.config.ts

key-decisions:
  - "SVG pointer triangle as HTML overlay rather than CSS border-trick — cleaner, scales without coordinate math"
  - "animate() imported from 'motion' (not useAnimate from motion/react) — imperative API can target a plain number ref, not a DOM element"
  - "onSpinEnd excluded from spin animation effect deps — prevents animation from restarting when callback identity changes"

patterns-established:
  - "Canvas 2D API mocked in jsdom tests via HTMLCanvasElement.prototype.getContext = vi.fn()"
  - "ResizeObserver mocked globally to prevent jsdom errors in Canvas component tests"
  - "motion animate mocked with vi.mock('motion', ...) for predictable test behavior"

requirements-completed: [WHEL-02, WHEL-03, WHEL-07]

duration: 5min
completed: 2026-03-26
---

# Phase 02 Plan 02: WheelCanvas Component Summary

**WheelCanvas component with Canvas rendering, DPR-aware scaling via ResizeObserver, motion imperative animate() with cubic-bezier [0.12, 0, 0.39, 0] deceleration, SVG pointer triangle, winner overlay with tw-animate-css fade-in, and 8 passing unit tests**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-26T11:16:23Z
- **Completed:** 2026-03-26T11:21:50Z
- **Tasks:** 2
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments

- WheelCanvas component with full Canvas 2D rendering: colored segments, white borders, radial text with shadow, center hub
- DPR-aware canvas sizing via ResizeObserver on canvas parent — crisp rendering on retina displays
- requestAnimationFrame draw loop with itemsRef pattern to always read latest items
- Motion imperative `animate()` from `motion` package driving `rotationRef` via `onUpdate` callback
- Cubic-bezier easing `[0.12, 0, 0.39, 0]` for fast-start, dramatic-slowdown feel (D-06)
- Spin duration 4-5 seconds with 4-6 full rotations before landing on pre-determined winner
- SVG pointer triangle at 12 o'clock (HTML overlay, not canvas-drawn)
- Winner overlay with `animate-in fade-in zoom-in-95 duration-200` from tw-animate-css
- Empty state renders "Add items to spin" on canvas with muted gray circle
- Canvas click gating: only triggers onSpin when not spinning AND items.length > 0
- 8 passing unit tests covering all interactive behaviors

## Task Commits

1. **Task 1: Create WheelCanvas component with Canvas rendering and DPR scaling** - `ae43b01` (feat)
2. **Task 2: Add WheelCanvas unit tests for props and state handling** - `524fd1f` (feat)

## Files Created/Modified

- `apps/web/src/components/randomizer/wheel/wheel-canvas.tsx` - WheelCanvas component (238 lines)
- `apps/web/src/components/randomizer/wheel/wheel-canvas.test.tsx` - 8 unit tests with Canvas/ResizeObserver/motion mocks
- `apps/web/vitest.config.ts` - Added `@/` path alias to match tsconfig.app.json (was missing, blocked tests)

## Decisions Made

- **SVG pointer triangle over CSS border-trick**: SVG gives exact control over shape and stroke without coordinate arithmetic. The CSS border-trick produces a triangle using transparent borders, which requires careful size tuning and doesn't benefit from SVG's explicit coordinates.
- **animate() from 'motion' (not useAnimate)**: `useAnimate()` from `motion/react` is designed to animate DOM elements via a ref returned from the hook. To animate a plain number value (rotationRef.current), the imperative `animate(from, to, { onUpdate })` API is the correct approach.
- **onSpinEnd excluded from spin effect deps**: The effect should only re-run when `spinning`, `winnerIndex`, or `items.length` change. Including `onSpinEnd` would cause the animation to restart if the parent re-renders with a new callback identity.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added `@/` path alias to vitest.config.ts**
- **Found during:** Task 2 (running tests)
- **Issue:** `wheel-canvas.tsx` imports `@/lib/randomizer/wheel-math` using the `@/` path alias defined in `tsconfig.app.json`. The `vitest.config.ts` only had `@base-project/web` alias, not `@/`. Tests failed to resolve the import.
- **Fix:** Added `"@": path.resolve(__dirname, "./src")` to vitest.config.ts resolve aliases.
- **Files modified:** `apps/web/vitest.config.ts`
- **Commit:** `524fd1f` (included in Task 2 commit)

**2. [Rule 3 - Blocking] Ran pnpm install to create worktree node_modules**
- **Found during:** Task 2 (running tests)
- **Issue:** This worktree (agent-a75790e8) did not have a `node_modules` directory — the vitest binary could not be found.
- **Fix:** Ran `pnpm install --frozen-lockfile` in the worktree root. All 957 packages resolved from cache in 8.4 seconds (reused, no downloads).
- **Files modified:** None (node_modules is not committed)
- **Note:** The `node_modules/.pnpm/node_modules/.bin/vitest` binary then worked correctly when invoked from `apps/web/` directory.

## Known Stubs

None — WheelCanvas is a fully implemented component. The canvas draw loop renders real segments using live items, the animation drives real rotation, and the winner overlay renders the actual winner name.

## Next Phase Readiness

- `WheelCanvas` exports the `WheelCanvas` named export ready to be imported by Plan 03 (`WheelTab`)
- Props interface matches `useWheel` output exactly: `items`, `spinning`, `winnerIndex`, `winner`, `onSpin`, `onSpinEnd`
- `calculateStopAngle` and `getSegmentColor` are correctly imported from `wheel-math.ts`
- Winner overlay auto-dismiss (2 second timer) is handled by `WheelTab` (Plan 03) — `WheelCanvas` just shows overlay when `winner !== null`

---
*Phase: 02-spinning-wheel*
*Completed: 2026-03-26*

## Self-Check: PASSED

- `apps/web/src/components/randomizer/wheel/wheel-canvas.tsx` exists on disk
- `apps/web/src/components/randomizer/wheel/wheel-canvas.test.tsx` exists on disk
- `apps/web/vitest.config.ts` updated with `@/` alias
- Commit `ae43b01` exists in git log
- Commit `524fd1f` exists in git log
