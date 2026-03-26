# Phase 3: Dice Roller - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Dice roller tool: 1-6 dice selector, CSS 3D roll animation with simultaneous tumbling, sum total display, per-tab history integration. Replaces the `DicePlaceholder` in the existing `randomizer.tsx` page.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All design decisions delegated to Claude. The following are recommended defaults:

- **Dice visuals:** White dice with black pip dots (classic style), CSS 3D cubes with `preserve-3d` and `backface-visibility: hidden`, 6 pip layouts using CSS grid
- **Dice size:** ~60-80px per die, scaled to fit 1-6 dice comfortably
- **Roll interaction:** Dedicated "Roll" button (green accent), all dice animate simultaneously
- **Animation:** CSS 3D `rotateX`/`rotateY` keyframes, ~1-2 second tumble, lands on pre-determined face
- **Count selector:** Stepper control (- / count / +) or slider, range 1-6
- **Result display:** Individual die face values shown on the dice + sum total displayed prominently below
- **History format:** "#N: 4+2+6=12" compact format, appended to dice tab history

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing code to integrate with
- `apps/web/src/routes/randomizer.tsx` — Page with tabbed layout, per-tab history state, DicePlaceholder to replace
- `apps/web/src/components/result-history.tsx` — Shared ResultHistory component
- `apps/web/src/lib/randomizer/types.ts` — HistoryEntry and TabId types
- `apps/web/src/index.css` — CSS accent tokens including `--color-dice-accent`

### Patterns to follow from Phase 2
- `apps/web/src/lib/randomizer/use-wheel.ts` — Custom hook pattern (state machine, history append)
- `apps/web/src/components/randomizer/wheel/wheel-tab.tsx` — Container component pattern (hook + children)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ResultHistory` component — wire with dice history entries
- `HistoryEntry` type — reuse for dice results
- Green accent token `--color-dice-accent` — for Roll button and active tab

### Established Patterns
- Custom hook per tool (`useWheel` → `useDice`)
- Container component per tab (`WheelTab` → `DiceTab`)
- TDD approach: RED → GREEN
- Pre-determine result before animation (same as wheel)
- kebab-case files, `type` keyword, `@base-project/web/` alias

### Integration Points
- Replace `DicePlaceholder` in `randomizer.tsx` with `DiceTab`
- Wire `useDice` hook results into existing `diceHistory` state
- Enable the disabled Dice tab trigger
- New files in `apps/web/src/components/randomizer/dice/`
- New hook: `apps/web/src/lib/randomizer/use-dice.ts`

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

*Phase: 03-dice-roller*
*Context gathered: 2026-03-26*
