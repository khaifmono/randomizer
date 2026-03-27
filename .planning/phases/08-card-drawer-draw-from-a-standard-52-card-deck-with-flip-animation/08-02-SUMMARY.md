---
phase: 08-card-drawer
plan: "02"
subsystem: frontend/cards
tags: [react, components, animation, cards, css-3d]
dependency_graph:
  requires: ["08-01"]
  provides: ["cards-tab-ui", "card-face-component", "card-display-component", "card-controls-component"]
  affects: ["apps/web/src/routes/randomizer.tsx"]
tech_stack:
  added: []
  patterns: ["vi.hoisted mock pattern", "staggered setTimeout animation", "CSS 3D card flip class swap"]
key_files:
  created:
    - apps/web/src/components/randomizer/cards/card-face.tsx
    - apps/web/src/components/randomizer/cards/card-display.tsx
    - apps/web/src/components/randomizer/cards/card-controls.tsx
    - apps/web/src/components/randomizer/cards/cards-tab.tsx
    - apps/web/src/components/randomizer/cards/cards-tab.test.tsx
  modified:
    - apps/web/src/routes/randomizer.tsx
decisions:
  - "activeHistory uses object lookup instead of ternary chain — fixes implicit fallback to teamsHistory when tab is 'cards'"
  - "STAGGER_DELAY=200ms matches D-05 spec — each card in hand mode flips 200ms after the previous"
metrics:
  duration: "3min"
  completed_date: "2026-03-27"
  tasks_completed: 2
  files_changed: 6
---

# Phase 08 Plan 02: Card UI Components and Randomizer Wiring Summary

CSS 3D card flip components (CardFace/CardDisplay/CardControls/CardsTab) with staggered hand reveal and randomizer page integration enabling the full 52-card draw experience.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Card components and tests | 9e1811c | card-face.tsx, card-display.tsx, card-controls.tsx, cards-tab.tsx, cards-tab.test.tsx |
| 2 | Wire CardsTab into randomizer page | d02eab9 | randomizer.tsx |

## What Was Built

### CardFace (card-face.tsx)
CSS 3D playing card component with 80x112px dimensions. Props: `card`, `flipping`, `revealed`. Mutually exclusive class application: `card-flipping` when animating, `card-show-front`/`card-show-back` when static. Red suits (♥♦) use `text-red-600`, black suits (♠♣) use `text-gray-900`. Front face shows rank+suit at top-left, large suit symbol in center, rank+suit rotated at bottom-right.

### CardDisplay (card-display.tsx)
Row of CardFace components. Props: `drawnCards`, `isDrawing`, `revealedCount`. Card `i` is flipping when `isDrawing && i === revealedCount`; card `i` is revealed when `i < revealedCount`. Enables staggered left-to-right flip in hand mode.

### CardControls (card-controls.tsx)
Full controls column (max-w-[240px]): remaining badge (`data-testid="remaining-count"`), Single/Hand mode toggle buttons, hand size stepper (1-5, only shown in hand mode), Draw button (disabled when drawing or deck empty, shows Loader2 spinner when drawing), Reshuffle button with RotateCcw icon.

### CardsTab (cards-tab.tsx)
Container wiring `useCards` to the display/controls components. Manages `revealedCount` state for staggered reveals. When `isDrawing` becomes true: resets revealedCount to 0, schedules `setTimeout(() => setRevealedCount(i+1), i * 200)` for each card, calls `onDrawEnd` after `drawnCards.length * 200 + ANIMATION_DURATION + 200` ms.

### Randomizer Page Updates (randomizer.tsx)
- Added `CardsTab` import
- Added `cardsHistory` state
- Changed `activeHistory` from ternary chain to object lookup (fixes incorrect fallback to teams history)
- Added `cards` case to `handleClearHistory`
- Enabled Cards tab trigger (removed `disabled` and `opacity-40`)
- Replaced ComingSoon placeholder with `<CardsTab onHistoryChange={setCardsHistory} />`

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Notable Decisions

**1. activeHistory object lookup (not just adding cards to existing ternary)**

The existing ternary fell through to `teamsHistory` as the default, meaning the "cards" tab would incorrectly use teams history. Changed to an explicit object lookup with `?? []` fallback, which correctly handles all tabs including future ones.

## Test Results

- Task 1: 9/9 tests pass in `cards-tab.test.tsx`
- Full suite: 209/209 tests pass (18 test files) — no regressions

## Known Stubs

None — all data flows are wired through `useCards` hook.

## Self-Check: PASSED

- card-face.tsx: FOUND
- card-display.tsx: FOUND
- card-controls.tsx: FOUND
- cards-tab.tsx: FOUND
- cards-tab.test.tsx: FOUND
- commit 9e1811c: FOUND
- commit d02eab9: FOUND
