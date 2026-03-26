# Roadmap: Randomizer Toolkit

## Overview

Build three animated randomizer tools (spinning wheel, dice roller, coin flipper) into the existing React monorepo. The journey goes from shared infrastructure and routing, through each tool in complexity order (wheel first — most complex, coin last — simplest), and finishes with the UX polish items that elevate the experience from functional to genuinely fun.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Shared infrastructure, routing, history component, and utilities every tool depends on
- [x] **Phase 2: Spinning Wheel** - Full wheel tab with Canvas animation, item management, and localStorage persistence (completed 2026-03-26)
- [x] **Phase 3: Dice Roller** - Dice tab with CSS 3D roll animation, count selector, and sum display (completed 2026-03-26)
- [x] **Phase 4: Coin Flipper** - Coin tab with CSS 3D flip animation, count selector, and heads/tails display (completed 2026-03-26)
- [ ] **Phase 5: Polish & Differentiators** - Item count badge, empty state, re-spin UX, pip icons, session tally

## Phase Details

### Phase 1: Foundation
**Goal**: The app shell exists and shared infrastructure is in place for all three tools to be built
**Depends on**: Nothing (first phase)
**Requirements**: SHRD-01, SHRD-02
**Success Criteria** (what must be TRUE):
  1. User can navigate to the randomizer page and see a tabbed interface with three tabs: Wheel, Dice, Coin
  2. Clicking each tab shows the correct tab panel without a page reload
  3. A result history list is visible in each tab and correctly displays entries in newest-first order
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Install Shadcn Tabs, shared types, CSS accent tokens, ResultHistory component with tests
- [x] 01-02-PLAN.md — Randomizer page route with tabbed layout, placeholders, mobile history toggle, per-tab history state
**UI hint**: yes

### Phase 2: Spinning Wheel
**Goal**: Users can spin a custom-item wheel that animates smoothly and manages its item list across sessions
**Depends on**: Phase 1
**Requirements**: WHEL-01, WHEL-02, WHEL-03, WHEL-04, WHEL-05, WHEL-06, WHEL-07
**Success Criteria** (what must be TRUE):
  1. User can type items into the wheel list, add them, and remove individual items before spinning
  2. User sees the wheel canvas animate with smooth, decelerating spin (cubic-bezier feel) and stop on a clearly announced winner
  3. The winning item disappears from the wheel list automatically after the spin completes
  4. User can click Reset to restore all removed items to the wheel
  5. Refreshing the page restores the wheel item list from the previous session
**Plans**: 3 plans
Plans:
- [x] 02-01-PLAN.md — Install motion, localStorage utility, wheel math utilities, and useWheel hook with tests
- [x] 02-02-PLAN.md — WheelCanvas component with Canvas rendering, motion animation, DPR scaling, and winner overlay
- [x] 02-03-PLAN.md — WheelItemList, WheelControls, WheelTab container, page integration, and human verification
**UI hint**: yes

### Phase 3: Dice Roller
**Goal**: Users can roll 1-6 dice with a satisfying simultaneous 3D animation and see the total
**Depends on**: Phase 2
**Requirements**: DICE-01, DICE-02, DICE-03, DICE-04
**Success Criteria** (what must be TRUE):
  1. User can select a number of dice between 1 and 6 and click Roll
  2. All selected dice animate simultaneously with a visible 3D tumbling motion
  3. After the roll completes, the sum total of all dice is displayed
  4. Each roll result is appended to the history log in the Dice tab
**Plans**: 2 plans
Plans:
- [x] 03-01-PLAN.md — useDice hook with TDD tests and CSS 3D dice animation classes in index.css
- [x] 03-02-PLAN.md — DieCube, DiceDisplay, DiceControls, DiceTab components, page wiring, and human verification
**UI hint**: yes

### Phase 4: Coin Flipper
**Goal**: Users can flip multiple coins with a satisfying 3D animation and see the heads/tails breakdown
**Depends on**: Phase 3
**Requirements**: COIN-01, COIN-02, COIN-03
**Success Criteria** (what must be TRUE):
  1. User can select how many coins to flip and click Flip
  2. All coins animate simultaneously with a visible 3D flip motion
  3. After the flip completes, the count of heads and tails is clearly displayed
  4. Each flip result is appended to the history log in the Coin tab
**Plans**: 2 plans
Plans:
- [x] 04-01-PLAN.md — useCoin hook with TDD tests and CSS 3D coin flip animation classes in index.css
- [x] 04-02-PLAN.md — CoinFace, CoinDisplay, CoinControls, CoinTab components, page wiring, and human verification
**UI hint**: yes

### Phase 5: Polish & Differentiators
**Goal**: All three tools have the UX details that make the experience feel premium and complete
**Depends on**: Phase 4
**Requirements**: WHEL-08, WHEL-09, WHEL-10, DICE-05, COIN-04
**Success Criteria** (what must be TRUE):
  1. User sees a badge on the wheel showing how many items remain during a draw sequence
  2. When all wheel items have been drawn, the wheel shows a clear empty state with a prompt to reset
  3. User can spin the wheel again immediately after a result without manually clearing anything
  4. Each die face displays pip dot patterns (not plain numbers) after a roll
  5. The coin history log shows a running session tally (e.g., "5H 3T across 8 flips")
**Plans**: 2 plans
Plans:
- [x] 05-01-PLAN.md — Wheel item count badge, empty state celebration with CSS confetti, and instant re-spin timing
- [ ] 05-02-PLAN.md — Green pip dots on dice faces and coin session tally with accumulation and clear
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete |  |
| 2. Spinning Wheel | 3/3 | Complete   | 2026-03-26 |
| 3. Dice Roller | 2/2 | Complete   | 2026-03-26 |
| 4. Coin Flipper | 2/2 | Complete   | 2026-03-26 |
| 5. Polish & Differentiators | 1/2 | In progress | - |
