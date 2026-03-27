---
phase: 08-card-drawer
plan: "01"
subsystem: randomizer/cards
tags: [tdd, hook, css, animation, deck, state-machine]
dependency_graph:
  requires: []
  provides:
    - useCards hook with 52-card deck state machine
    - ANIMATION_DURATION=800 constant
    - CSS 3D card-flip animation classes
  affects:
    - apps/web/src/lib/randomizer/use-cards.ts
    - apps/web/src/lib/randomizer/use-cards.test.ts
    - apps/web/src/index.css
tech_stack:
  added: []
  patterns:
    - isDrawingRef synchronous guard (mirrors useCoin pattern)
    - pendingDrawnRef pre-determined values during animation
    - deckRef for synchronous depletion in onDrawEnd
    - Fisher-Yates shuffle for deck initialization
    - CSS rotateY for card flip (side-to-side, not end-over-end)
key_files:
  created:
    - apps/web/src/lib/randomizer/use-cards.ts
    - apps/web/src/lib/randomizer/use-cards.test.ts
  modified:
    - apps/web/src/index.css
decisions:
  - "ANIMATION_DURATION=800ms (cards flip faster than coins at 1200ms)"
  - "rotateY (not rotateX) for card flip — playing cards flip side-to-side"
  - "deckRef mirrors useState so onDrawEnd can deplete synchronously without stale closure"
  - "drawnCards set in drawCards() (before animation) so UI can show face-down cards immediately"
metrics:
  duration: "2 minutes"
  completed_date: "2026-03-27"
  tasks_completed: 3
  files_changed: 3
---

# Phase 08 Plan 01: useCards Hook and CSS Card-Flip Animation Summary

**One-liner:** TDD-implemented useCards hook with 52-card Fisher-Yates deck, single/hand draw modes, and CSS rotateY 3D flip animation classes.

## What Was Built

### useCards hook (`apps/web/src/lib/randomizer/use-cards.ts`)

Full deck state machine following the useCoin pattern:

- `buildDeck()` — creates 52-card deck (4 suits x 13 ranks) with Fisher-Yates shuffle
- `drawCards()` — draws 1 (single mode) or N (hand mode, default 5) cards with isDrawingRef guard
- `onDrawEnd()` — depletes deck, appends history entry with label like "A♠ K♥ 7♦", 200ms settle delay
- `reshuffle()` — restores full shuffled deck, clears drawnCards
- `setMode()` / `setHandSize()` — mode and size controls, no-op when animating
- `remainingCount` — derived from deck.length
- `ANIMATION_DURATION = 800` exported constant

### CSS animation (`apps/web/src/index.css`)

Card drawer section appended after confetti section:
- `.card-scene` — perspective: 1000px container
- `.card-inner` — preserve-3d, transition, will-change
- `.card-face` — absolute positioned, backface-visibility hidden
- `.card-face-back` — rotateY(0deg), `.card-face-front` — rotateY(180deg)
- `@keyframes card-flip` — 0deg to 180deg Y-axis rotation
- `.card-inner.card-flipping` — 0.8s animation (matches ANIMATION_DURATION=800)
- `.card-inner.card-show-back` / `.card-inner.card-show-front` — static end-state classes

## Test Results

27 tests passing, all covering:
- Initial state (52 cards, no duplicates, isDrawing=false, empty history)
- ANIMATION_DURATION=800 constant
- drawCards() single/hand mode, isDrawing guard, edge case (fewer than requested)
- onDrawEnd() deck depletion, history label format, 200ms settle delay
- reshuffle() restore 52 cards, clear drawnCards, full cycle test
- setMode() update and no-op when drawing
- setHandSize() valid values, no-op for 0/6, no-op when drawing

Full suite: 200 tests passing, no regressions.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

Files verified:
- FOUND: apps/web/src/lib/randomizer/use-cards.ts
- FOUND: apps/web/src/lib/randomizer/use-cards.test.ts
- FOUND: apps/web/src/index.css (card-flip appears 3 times)

Commits verified:
- 51a0653: test(08-01): add failing tests for useCards hook
- 91797e7: feat(08-01): implement useCards hook with full deck state machine
- e4cfe60: feat(08-01): add CSS 3D card-flip animation classes to index.css
