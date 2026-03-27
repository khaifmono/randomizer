# Phase 7: Team Shuffler - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Team shuffler: enter names, choose mode (pick one person OR split into N teams), shuffle animation, result display. Replaces the "Teams" coming-soon placeholder.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All design decisions delegated to Claude. Recommended defaults:

- **Name entry:** Textarea (one name per line) — bulk entry is primary use case for teams
- **Modes:** Toggle between "Pick one" (highlight a random name) and "Split teams" (divide into N groups)
- **Team count:** Stepper selector (2-8 teams) when in split mode
- **Shuffle animation:** Names visually shuffle/scramble before settling into final positions — CSS transitions on reordering
- **Result display:** Colored team columns showing assigned members. In "pick one" mode, single name highlighted large
- **History format:** "#N: Teams of 3 — [Ali, Bo] [Cal, Di] [Eve, Fay]" or "#N: Picked: Ali"

</decisions>

<canonical_refs>
## Canonical References

### Existing code to integrate with
- `apps/web/src/routes/randomizer.tsx` — Enable Teams tab, replace ComingSoon
- `apps/web/src/components/result-history.tsx` — Shared history
- `apps/web/src/lib/randomizer/types.ts` — HistoryEntry type

### Patterns to follow
- `apps/web/src/lib/randomizer/use-wheel.ts` — Hook with item management pattern
- `apps/web/src/components/randomizer/wheel/wheel-item-list.tsx` — Name entry similar to wheel item entry

</canonical_refs>

<code_context>
## Existing Code Insights

### Integration Points
- New hook: `apps/web/src/lib/randomizer/use-teams.ts`
- New components: `apps/web/src/components/randomizer/teams/`
- Enable disabled Teams tab in randomizer.tsx
- Add `teamsHistory` state to RandomizerPage

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

*Phase: 07-team-shuffler*
*Context gathered: 2026-03-27*
