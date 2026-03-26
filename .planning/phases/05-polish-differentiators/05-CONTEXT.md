# Phase 5: Polish & Differentiators - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

UX polish across all three tools: wheel item count badge, wheel empty state with celebration, instant re-spin UX, colored pip dot patterns on dice, and running session tally in coin history.

</domain>

<decisions>
## Implementation Decisions

### Wheel item count badge (WHEL-08)
- **D-01:** Small badge/pill displayed above the wheel canvas showing "X items remaining"
- **D-02:** Always visible when items exist, disappears when wheel is empty

### Wheel empty state (WHEL-09)
- **D-03:** Fun "All done!" celebration message with a confetti-style animation (CSS, not a library) when last item is drawn
- **D-04:** Prominent Reset button to restore all items

### Instant re-spin (WHEL-10)
- **D-05:** User can spin again immediately after a result without any manual clearing — the wheel auto-advances to the next spin with remaining items

### Dice pip dots (DICE-05)
- **D-06:** Colored pip dots using dice-accent green color on white face — matches the green theme
- **D-07:** Classic pip layout positions (standard casino die patterns for faces 1-6)

### Coin session tally (COIN-04)
- **D-08:** Sticky summary line at the top of coin history panel showing running tally: "5H 3T across 8 flips"
- **D-09:** Accumulates across all flips in the session, resets when history is cleared

### Claude's Discretion
- Exact badge styling (pill shape, color, size)
- Confetti animation details (particles, duration, colors)
- Re-spin UX timing (how quickly after result fade the wheel is spinnable again)
- Pip dot size and spacing within the 3x3 grid

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing code to modify
- `apps/web/src/components/randomizer/wheel/wheel-tab.tsx` — Add badge and empty state
- `apps/web/src/components/randomizer/wheel/wheel-canvas.tsx` — Empty state rendering
- `apps/web/src/lib/randomizer/use-wheel.ts` — Re-spin timing, empty detection
- `apps/web/src/components/randomizer/dice/die-cube.tsx` — Replace number display with pip dots
- `apps/web/src/components/randomizer/coin/coin-tab.tsx` — Add session tally
- `apps/web/src/routes/randomizer.tsx` — Tally display in history panel
- `apps/web/src/index.css` — Confetti keyframes, pip dot styles

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Wheel accent `--color-wheel-accent` for badge
- Dice accent `--color-dice-accent` for pip dots
- `tw-animate-css` for mount/unmount transitions (confetti)
- Existing `useWheel` hook already has `items` array and `reset()` function

### Established Patterns
- Badge component: can use Shadcn Badge (`apps/web/src/components/ui/badge.tsx`) already installed
- CSS keyframes in `index.css` for animations (proven in dice and coin)
- `useWheel` hook manages item state — empty state derived from `items.length === 0`

### Integration Points
- Badge: above WheelCanvas in wheel-tab.tsx
- Empty state: conditional render in wheel-tab.tsx when items.length === 0
- Pip dots: replace content in die-cube.tsx `.dice-face` children
- Session tally: computed from `coinHistory` in randomizer.tsx, passed to history panel

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

*Phase: 05-polish-differentiators*
*Context gathered: 2026-03-27*
