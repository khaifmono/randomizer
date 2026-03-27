# Phase 6: Number Generator - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Random number generator: slot-machine-style digit reel animation, min/max range selector with presets, giant result display, per-tab history. Replaces the "Number" coming-soon placeholder.

</domain>

<decisions>
## Implementation Decisions

### Animation style
- **D-01:** Slot machine reels — individual digit columns spin independently, locking left-to-right
- **D-02:** Each reel scrolls through digits (0-9) vertically with CSS translateY animation
- **D-03:** Staggered stop timing — left digit locks first, each subsequent digit locks ~200ms later for suspense

### Range controls
- **D-04:** Quick presets (1-10, 1-100, 1-1000) as pill buttons, plus custom Min/Max number inputs
- **D-05:** Default range: 1-100

### Result display
- **D-06:** Giant centered number after animation completes — big, bold, unmissable
- **D-07:** Range context shown below result: "from 1 to 100"

### Claude's Discretion
- Reel visual style (border, background, shadow)
- Number of visible digits in each reel window (1 or 3 with center highlighted)
- Generate button placement and styling
- History entry format

</decisions>

<canonical_refs>
## Canonical References

### Existing code to integrate with
- `apps/web/src/routes/randomizer.tsx` — Enable Number tab, replace ComingSoon placeholder
- `apps/web/src/components/result-history.tsx` — Shared history component
- `apps/web/src/lib/randomizer/types.ts` — HistoryEntry type

### Patterns to follow
- `apps/web/src/lib/randomizer/use-dice.ts` — Hook pattern (pre-determine, animation guard)
- `apps/web/src/components/randomizer/dice/dice-tab.tsx` — Tab container pattern

</canonical_refs>

<code_context>
## Existing Code Insights

### Integration Points
- New hook: `apps/web/src/lib/randomizer/use-number.ts`
- New components: `apps/web/src/components/randomizer/number/`
- Enable disabled Number tab in randomizer.tsx
- Add `numberHistory` state to RandomizerPage

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

*Phase: 06-number-generator*
*Context gathered: 2026-03-27*
