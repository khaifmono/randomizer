# Phase 1: Foundation - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Shared infrastructure for the randomizer toolkit: app shell with tabbed interface (Wheel, Dice, Coin), shared result history component, routing, and utility foundations. No tool-specific logic — that's Phases 2-4.

</domain>

<decisions>
## Implementation Decisions

### Tab style
- **D-01:** Tabs use icon + text labels with underline indicator on active tab
- **D-02:** Icons per tab: Wheel, Dice, Coin (emoji or Lucide icons — Claude's call on which icon set)

### Page layout
- **D-03:** Split layout — tool area on the left, result history panel on the right
- **D-04:** On mobile, history collapses behind a toggle button so the tool gets full width

### History display
- **D-05:** Compact list format — small text rows, newest at top (e.g. "#3: Pepperoni" or "#7: 4+2+6=12")
- **D-06:** History max length and clear button behavior at Claude's discretion

### Empty tab states
- **D-07:** Unbuilt tool tabs (Dice, Coin in Phase 1) show placeholder UI with disabled/greyed-out controls — not just a "coming soon" message

### Color scheme
- **D-08:** Each tool tab gets a distinct accent color (e.g. blue for Wheel, green for Dice, amber for Coin — exact colors at Claude's discretion)

### Claude's Discretion
- Page placement — where the randomizer route lives (standalone `/randomizer`, inside authenticated layout, or replace landing page). Recommendation: standalone route without dashboard sidebar for a focused, fun experience.
- Page header — whether to include a title/tagline above the tabs, and what it says
- History max entries and clear button behavior
- Exact accent colors per tab
- Icon choice (emoji vs Lucide icons)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Existing code to align with
- `apps/web/src/routes/__root.tsx` — Root layout with QueryClientProvider; new route must be a child of this
- `apps/web/src/routes/_authenticated.tsx` — Existing authenticated layout with sidebar; reference for layout patterns but may not be used
- `apps/web/src/components/ui/` — Shadcn component library; Tabs component needs to be added (not currently installed)
- `apps/web/src/lib/utils.ts` — Existing utility functions (cn helper for Tailwind class merging)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/web/src/components/ui/card.tsx` — Card component with shadow/rounded variants; could wrap the split layout panels
- `apps/web/src/components/ui/button.tsx` — Button component for history toggle on mobile
- `apps/web/src/components/ui/separator.tsx` — Visual separator between tool area and history
- `apps/web/src/lib/utils.ts` — `cn()` utility for conditional Tailwind classes

### Established Patterns
- TanStack Router file-based routing: new routes go in `apps/web/src/routes/`
- Shadcn + Radix UI for all UI components: add Tabs via `npx shadcn@latest add tabs`
- Tailwind CSS v4 with `@theme` block for custom tokens
- kebab-case filenames enforced by ESLint
- `type` keyword for TypeScript definitions (not `interface`)
- Import path alias: `@base-project/web/...`

### Integration Points
- New route file(s) in `apps/web/src/routes/` for the randomizer page
- Shadcn Tabs component needs to be added to `apps/web/src/components/ui/`
- New shared components go in `apps/web/src/components/` (e.g. `result-history.tsx`)
- New hooks go in `apps/web/src/lib/` or a new `apps/web/src/lib/randomizer/` directory
- New utility functions (randomizer logic, localStorage helpers) in `apps/web/src/lib/randomizer/`

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

*Phase: 01-foundation*
*Context gathered: 2026-03-26*
