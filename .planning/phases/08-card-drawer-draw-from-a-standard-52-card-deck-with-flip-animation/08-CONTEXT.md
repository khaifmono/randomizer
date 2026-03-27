# Phase 8: Card Drawer - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Card drawer: standard 52-card deck, draw single or hand of N cards, CSS 3D flip reveal animation, deck depletion with remaining count, reshuffle reset. Replaces the "Cards" coming-soon placeholder.

</domain>

<decisions>
## Implementation Decisions

### Card visuals
- **D-01:** Classic playing card design — traditional red (hearts, diamonds) and black (spades, clubs) with suit symbols
- **D-02:** Card back design for the deck/face-down state — patterned or solid color
- **D-03:** CSS 3D flip animation (rotateY) to reveal card face from back — same technique as coin

### Draw modes
- **D-04:** Toggle between "Single draw" (one card at a time) and "Hand" mode (draw 1-5 cards)
- **D-05:** Hand mode uses staggered flip reveals — cards flip one at a time left-to-right with ~200ms delay

### Deck state
- **D-06:** 52-card deck depletes as cards are drawn — no duplicates within a session
- **D-07:** Remaining card count badge shown (like wheel's "X items remaining")
- **D-08:** "Reshuffle" button to reset the deck (like wheel's Reset)

### Claude's Discretion
- Card size and layout
- Deck visual (stacked card pile vs count)
- Drawn cards display arrangement
- History entry format
- Face card (J, Q, K) visual style

</decisions>

<canonical_refs>
## Canonical References

### Existing code to integrate with
- `apps/web/src/routes/randomizer.tsx` — Enable Cards tab, replace ComingSoon
- `apps/web/src/components/result-history.tsx` — Shared history
- `apps/web/src/lib/randomizer/types.ts` — HistoryEntry type
- `apps/web/src/index.css` — Coin flip CSS 3D pattern to reuse for card flip

### Patterns to follow
- `apps/web/src/lib/randomizer/use-wheel.ts` — Depletion + reset pattern
- `apps/web/src/components/randomizer/coin/coin-face.tsx` — CSS 3D flip with backface-visibility

</canonical_refs>

<code_context>
## Existing Code Insights

### Integration Points
- New hook: `apps/web/src/lib/randomizer/use-cards.ts`
- New components: `apps/web/src/components/randomizer/cards/`
- Enable disabled Cards tab in randomizer.tsx
- Add `cardsHistory` state to RandomizerPage

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>

---

*Phase: 08-card-drawer*
*Context gathered: 2026-03-27*
