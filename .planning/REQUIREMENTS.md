# Requirements: Randomizer Toolkit

**Defined:** 2026-03-26
**Core Value:** Satisfying, animated randomization that feels fun to use — the wheel spins smoothly, dice tumble, coins flip with personality.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Shared

- [x] **SHRD-01**: User sees a tabbed interface with three tools: Wheel, Dice, Coin
- [x] **SHRD-02**: User can view result history per tab (append-only, newest at top)

### Wheel

- [x] **WHEL-01**: User can enter custom items for the wheel (add/remove from list)
- [ ] **WHEL-02**: User sees a spinning wheel that animates with smooth deceleration to a result
- [ ] **WHEL-03**: User sees the winning item clearly announced after the wheel stops
- [x] **WHEL-04**: Winning item is automatically removed from the active wheel after each spin
- [x] **WHEL-05**: User can reset the wheel to restore all removed items
- [x] **WHEL-06**: Wheel item list persists in browser localStorage across sessions
- [ ] **WHEL-07**: Wheel spin uses smooth cubic-bezier deceleration that feels premium
- [ ] **WHEL-08**: User sees an item count badge showing remaining items during draws
- [ ] **WHEL-09**: User sees a clear empty-state when all items are removed ("reset to continue")
- [ ] **WHEL-10**: User can re-spin instantly without clearing history

### Dice

- [ ] **DICE-01**: User can select number of dice to roll (1-6)
- [ ] **DICE-02**: User sees dice roll animation using CSS 3D transforms
- [ ] **DICE-03**: User sees sum total displayed after each roll
- [ ] **DICE-04**: All dice animate simultaneously on roll
- [ ] **DICE-05**: Each die displays pip face icons (dot patterns) instead of plain numbers

### Coin

- [ ] **COIN-01**: User can select number of coins to flip (1+)
- [ ] **COIN-02**: User sees coin flip animation using CSS 3D transforms
- [ ] **COIN-03**: User sees heads/tails count displayed after each flip
- [ ] **COIN-04**: User sees running session tally in history ("5H 3T across 8 flips")

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhancements

- **ENH-01**: Sound effects (opt-in toggle for spin, roll, flip sounds)
- **ENH-02**: Export/import wheel item lists for cross-device sharing
- **ENH-03**: Custom dice types (D4, D8, D12, D20)
- **ENH-04**: Probability/statistics view over result history
- **ENH-05**: Dark mode toggle (audit if scaffold already handles prefers-color-scheme)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Cloud sync / user accounts | Destroys client-side-only constraint; localStorage covers primary use case |
| Sharing results via URL | Requires backend or URL encoding; disproportionate complexity for personal tool |
| Weighted wheel segments | Complicates item entry UX; uniform randomness is the honest contract |
| Confetti / celebration effects | Extra dependency for marginal value; animation + bold result achieves the feeling |
| Backend/API integration | All randomization is client-side; no server needed |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SHRD-01 | Phase 1 | Complete |
| SHRD-02 | Phase 1 | Complete |
| WHEL-01 | Phase 2 | Complete |
| WHEL-02 | Phase 2 | Pending |
| WHEL-03 | Phase 2 | Pending |
| WHEL-04 | Phase 2 | Complete |
| WHEL-05 | Phase 2 | Complete |
| WHEL-06 | Phase 2 | Complete |
| WHEL-07 | Phase 2 | Pending |
| WHEL-08 | Phase 5 | Pending |
| WHEL-09 | Phase 5 | Pending |
| WHEL-10 | Phase 5 | Pending |
| DICE-01 | Phase 3 | Pending |
| DICE-02 | Phase 3 | Pending |
| DICE-03 | Phase 3 | Pending |
| DICE-04 | Phase 3 | Pending |
| DICE-05 | Phase 5 | Pending |
| COIN-01 | Phase 4 | Pending |
| COIN-02 | Phase 4 | Pending |
| COIN-03 | Phase 4 | Pending |
| COIN-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after roadmap creation*
