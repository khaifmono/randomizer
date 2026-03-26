---
phase: 01-foundation
plan: 02
subsystem: ui
tags: [react, tanstack-router, tailwind, radix-ui, tabs, responsive-layout]

# Dependency graph
requires:
  - phase: 01-foundation-plan-01
    provides: "ResultHistory component, HistoryEntry type, TabId type, accent CSS tokens, Tabs/Button/Card UI components"
provides:
  - "/randomizer route with tabbed interface (Wheel active, Dice/Coin disabled placeholders)"
  - "RandomizerPage component with split desktop layout and mobile history toggle"
  - "Per-tab history state management (wheelHistory, diceHistory, coinHistory)"
  - "routeTree.gen.ts updated with /randomizer route registration"
affects:
  - "02-wheel: Phase 2 builds the Wheel tool into the WheelPlaceholder slot"
  - "03-dice: Phase 3 builds the Dice tool into the DicePlaceholder slot"
  - "04-coin: Phase 4 builds the Coin tool into the CoinPlaceholder slot"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD (RED-GREEN) for route components: write failing tests first, then implement"
    - "Named export RandomizerPage alongside Route export for testability"
    - "vi.mock('@tanstack/react-router') pattern for route component unit testing"
    - "Per-tab history state pattern with three independent useState arrays"
    - "Mobile-first responsive layout: flex-col default, md:flex-row on desktop"
    - "Disabled tab triggers + opacity-50 pointer-events-none for 'coming soon' placeholder panels"

key-files:
  created:
    - apps/web/src/routes/randomizer.tsx
    - apps/web/src/routes/randomizer.test.tsx
  modified:
    - apps/web/src/routeTree.gen.ts

key-decisions:
  - "Named export RandomizerPage alongside Route to enable direct unit testing without router context"
  - "routeTree.gen.ts manually updated with /randomizer route since Vite plugin only auto-regenerates on dev server start"

patterns-established:
  - "Route component testing: export named component + vi.mock('@tanstack/react-router') in test files"
  - "Placeholder panels: opacity-50 pointer-events-none divs with disabled Buttons (not just text)"

requirements-completed:
  - SHRD-01
  - SHRD-02

# Metrics
duration: 4min
completed: 2026-03-26
---

# Phase 1 Plan 2: Randomizer Page Route Summary

**Tabbed randomizer page at /randomizer with Wheel/Dice/Coin tabs, split desktop layout, mobile history toggle, per-tab history state, and greyed-out placeholder panels for unbuilt tools**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-26T09:57:03Z
- **Completed:** 2026-03-26T10:01:12Z
- **Tasks:** 1 (TDD: RED + GREEN commits)
- **Files modified:** 3

## Accomplishments

- RandomizerPage component with Wheel tab active by default, Dice/Coin disabled with greyed-out placeholder UI
- Split layout: tool area (flex-1) on left, 64-unit history panel on right on desktop; stacked on mobile
- Mobile "Show/Hide History" toggle button using md:hidden pattern
- Per-tab history state (wheelHistory, diceHistory, coinHistory) wired to ResultHistory component
- Per-tab accent color classes on active tab indicators (wheel-accent, dice-accent, coin-accent)
- routeTree.gen.ts updated to register /randomizer as a known TanStack Router route

## Task Commits

Each task was committed atomically:

1. **RED: Test file for randomizer page** - `9988267` (test)
2. **GREEN: Randomizer page route implementation** - `3f73271` (feat)

**Plan metadata:** (pending — created in final commit)

_Note: TDD tasks have multiple commits (test RED → feat GREEN)_

## Files Created/Modified

- `apps/web/src/routes/randomizer.tsx` - RandomizerPage with tabbed layout, history wiring, placeholder panels; exports both `Route` (for TanStack Router) and `RandomizerPage` (for testing)
- `apps/web/src/routes/randomizer.test.tsx` - 6 tests covering title, tagline, tab triggers, wheel placeholder, history heading, and empty history state
- `apps/web/src/routeTree.gen.ts` - Added /randomizer route registration so TypeScript knows the route path

## Decisions Made

- Named export of `RandomizerPage` alongside the `Route` export: enables direct unit testing without needing router context, following the existing pattern where page components are tested directly.
- Manual routeTree.gen.ts update: TanStack Router's Vite plugin only auto-regenerates on `pnpm dev` start. Since we run `pnpm build` for CI validation, we manually updated routeTree.gen.ts to include `/randomizer` so the TypeScript build passes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Manually updated routeTree.gen.ts to register /randomizer route**
- **Found during:** Task 1 (TypeScript build verification step)
- **Issue:** `pnpm build` reported `error TS2345: Argument of type '"/randomizer"' is not assignable to parameter of type 'keyof FileRoutesByPath | undefined'` — the generated route tree didn't know about the new route file
- **Fix:** Added /randomizer import, route constant, all interface entries (FileRoutesByFullPath, FileRoutesByTo, FileRoutesById, FileRouteTypes union types, RootRouteChildren, declare module section) to routeTree.gen.ts
- **Files modified:** apps/web/src/routeTree.gen.ts
- **Verification:** `pnpm build` no longer reports errors on randomizer.tsx (only pre-existing errors in other files remain)
- **Committed in:** 3f73271 (Task 1 GREEN commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Required for TypeScript compilation to succeed. No scope creep.

## Issues Encountered

- Pre-existing TypeScript errors in `_authenticated.tsx` (unused import), `_authenticated/support.tsx` (missing accordion module), and `login.tsx` (invalid route path `/forgot-password`) were present before this plan and remain out of scope. These are logged here for awareness.

## Known Stubs

- `WheelPlaceholder` in `randomizer.tsx`: Shows "Add items to spin the wheel" — intentional stub. Phase 2 (wheel tool) will replace this with the actual spinning wheel component.
- `DicePlaceholder` in `randomizer.tsx`: Shows greyed-out dice controls — intentional stub. Phase 3 will replace this.
- `CoinPlaceholder` in `randomizer.tsx`: Shows greyed-out coin controls — intentional stub. Phase 4 will replace this.

These stubs are intentional by plan design (D-07). They do not prevent Plan 01-02's goal (tabbed UI scaffold with history) from being achieved.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /randomizer route is registered and renders the complete tabbed scaffold
- WheelPlaceholder slot is ready for Phase 2 to replace with the actual Wheel component
- Per-tab history state is wired — Phase 2 only needs to call `setWheelHistory` to populate history
- All 13 tests pass (6 randomizer route + 7 result-history)

---
*Phase: 01-foundation*
*Completed: 2026-03-26*
