# Deferred Items - Phase 05 Polish Differentiators

## Pre-existing ESLint Errors in use-wheel.ts

**Found during:** 05-01 Task 2 (ESLint verification)
**Status:** Pre-existing, out of scope for this plan

The `react-hooks/refs` ESLint rule flags 4 errors in `apps/web/src/lib/randomizer/use-wheel.ts`:

- Line 119: `originalItemsRef.current` accessed during render for `hasRemovedItems`
- Line 122: `itemsSnapshotRef.current` accessed during render for `items` return value
- Line 126: `winnerIndexRef.current` accessed during render for `winnerIndex` return value

These are pre-existing violations not introduced by this plan's changes. The refs are intentionally read during render as part of the hook's design pattern (the `itemsRef` pattern documented in STATE.md decisions). Fixing these would require significant architectural changes (storing snapshot/winnerIndex in state instead of refs).

**Deferred to:** A future refactor plan or 05-02 if applicable.
