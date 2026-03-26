# Phase 4: Coin Flipper - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Coin flipper tool: selectable coin count (1+), CSS 3D flip animation with simultaneous flipping, heads/tails count display, per-tab history integration. Replaces the `CoinPlaceholder` in the existing `randomizer.tsx` page.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All design decisions delegated to Claude. The following are recommended defaults:

- **Coin visuals:** Circular coins with distinct heads (H) and tails (T) faces, CSS 3D flip using `rotateY` with `backface-visibility: hidden`, gold/amber accent coloring
- **Coin size:** ~60-70px diameter, scales to fit multiple coins comfortably
- **Flip interaction:** Dedicated "Flip" button (amber accent), all coins animate simultaneously
- **Animation:** CSS 3D `rotateY` keyframes, ~1-1.5 second flip, lands on pre-determined face
- **Count selector:** Stepper control (- / count / +), range 1-10 (more flexible than dice)
- **Result display:** Each coin shows H or T face after landing, summary line "3 Heads, 2 Tails" displayed prominently
- **History format:** "#N: 3H 2T (5 coins)" compact format, appended to coin tab history

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing code to integrate with
- `apps/web/src/routes/randomizer.tsx` — Page with tabbed layout, per-tab history state, CoinPlaceholder to replace
- `apps/web/src/components/result-history.tsx` — Shared ResultHistory component
- `apps/web/src/lib/randomizer/types.ts` — HistoryEntry and TabId types
- `apps/web/src/index.css` — CSS accent tokens including `--color-coin-accent`, plus dice CSS classes to follow as pattern

### Patterns to follow from Phase 3
- `apps/web/src/lib/randomizer/use-dice.ts` — Custom hook pattern (pre-determine, setTimeout for animation end)
- `apps/web/src/components/randomizer/dice/dice-tab.tsx` — Container component pattern
- `apps/web/src/components/randomizer/dice/die-cube.tsx` — CSS 3D component pattern (rolling class + show-N class)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ResultHistory` component — wire with coin history entries
- `HistoryEntry` type — reuse for coin results
- Amber accent token `--color-coin-accent` — for Flip button and active tab
- CSS 3D pattern from dice: `preserve-3d`, `backface-visibility: hidden`, keyframes

### Established Patterns
- Custom hook per tool (`useWheel` → `useDice` → `useCoin`)
- Container component per tab (`WheelTab` → `DiceTab` → `CoinTab`)
- CSS class swap: `.coin-flipping` during animation, `.coin-show-heads`/`.coin-show-tails` after landing
- Pre-determine result before animation
- Single `setTimeout` matching CSS animation duration for coordinating N simultaneous animations
- TDD: RED → GREEN

### Integration Points
- Replace `CoinPlaceholder` in `randomizer.tsx` with `CoinTab`
- Wire `useCoin` hook results into existing `coinHistory` state
- Enable the disabled Coin tab trigger
- New files in `apps/web/src/components/randomizer/coin/`
- New hook: `apps/web/src/lib/randomizer/use-coin.ts`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-coin-flipper*
*Context gathered: 2026-03-26*
