# Phase 9: Bracket Tournament - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Bracket Tournament: users enter 2-16 options, watch them battle head-to-head in a random single-elimination bracket with animated VS matchups and a final winner celebration. Two modes: Random (browser picks winners) and Judge (user picks winners). Replaces the "Bracket Tournament" coming-soon placeholder on the homepage.

</domain>

<decisions>
## Implementation Decisions

### Bracket layout & visuals
- **D-01:** Horizontal tree (left to right) — classic March Madness style, rounds flow left to right with winner on the far right
- **D-02:** Bordered match cards — boxed cards with a divider between the two options, winner gets highlighted border/color
- **D-03:** Progressive reveal — only the current round is visible, next round slots appear as winners advance

### Matchup animation
- **D-04:** Versus showdown animation — dramatic "VS" appears between the two options, both shake/vibrate, then winner slides forward with a flash
- **D-05:** Click per matchup pacing — user clicks to resolve each individual matchup, maximum control
- **D-06:** Two modes: "Random" (browser randomly picks winner with VS animation) and "Judge" (user clicks their pick after VS animation plays). Both modes keep the dramatic showdown effect.

### Entry & seeding
- **D-07:** Dual entry method — textarea for bulk entry (one per line) AND input field + Add button for one at a time
- **D-08:** Byes for non-power-of-2 counts — randomly assign byes so some entries auto-advance to round 2
- **D-09:** 2-16 entries supported — up to 4 rounds, may need horizontal scroll on mobile for larger brackets

### Winner celebration
- **D-10:** Crown + confetti burst — winner card gets a crown icon, CSS confetti particles burst from the card

### Claude's Discretion
- Bracket connector line style and colors
- Match card sizing and spacing
- VS animation duration and easing
- Confetti particle count and physics
- History entry format for completed tournaments
- Mobile responsiveness strategy (scroll vs scale)
- Bye visual treatment in the bracket
- Mode toggle UI placement and style

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing code to integrate with
- `apps/web/src/routes/randomizer.tsx` — Enable Bracket tab, add to tab list
- `apps/web/src/routes/index.tsx` — Homepage card links to bracket tab
- `apps/web/src/components/result-history.tsx` — Shared history component
- `apps/web/src/lib/randomizer/types.ts` — HistoryEntry type

### Patterns to follow
- `apps/web/src/lib/randomizer/use-teams.ts` — Name entry + textarea pattern (dual input)
- `apps/web/src/lib/randomizer/use-wheel.ts` — State machine with reset pattern
- `apps/web/src/components/randomizer/teams/teams-tab.tsx` — Tab container wiring pattern
- `apps/web/src/index.css` — CSS animation patterns (3D flips, keyframes)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- TeamsTab textarea + input combo pattern can be adapted for bracket entry
- ResultHistory component for tournament results
- HistoryEntry type for logging completed tournaments
- How-to-use tutorial modal pattern (tutorial-modal.tsx) for bracket instructions

### Established Patterns
- Each tool: `use-{tool}.ts` hook + `components/randomizer/{tool}/` folder
- Hook holds all state, components are presentational
- Tab container wires hook to components and history
- CSS animations in index.css with keyframes

### Integration Points
- New hook: `apps/web/src/lib/randomizer/use-bracket.ts`
- New components: `apps/web/src/components/randomizer/bracket/`
- New tab in `randomizer.tsx` tab list
- Homepage card already exists (links to bracket tab)
- New accent color token for bracket tab

</code_context>

<specifics>
## Specific Ideas

- Two modes make this tool versatile: Random mode for quick fun decisions, Judge mode for running actual competitions (e.g., "best pizza topping" vote with friends)
- VS showdown animation should feel dramatic — think fighting game character select screens
- Progressive reveal adds suspense — you don't see the full bracket until it plays out

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-bracket-tournament*
*Context gathered: 2026-03-28*
