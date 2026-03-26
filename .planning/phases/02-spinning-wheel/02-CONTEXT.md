# Phase 2: Spinning Wheel - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Full spinning wheel tool: item entry/management, HTML5 Canvas wheel rendering, smooth deceleration animation via `motion@^12`, remove-on-hit behavior, manual reset, and localStorage persistence. Replaces the `WheelPlaceholder` in the existing `randomizer.tsx` page.

</domain>

<decisions>
## Implementation Decisions

### Item entry UX
- **D-01:** Dual-mode item entry: quick-add input (single text field + "Add" button for one item at a time) AND expandable bulk textarea (one item per line, for pasting lists)
- **D-02:** Visible item list below input showing all items with individual remove (×) buttons per item

### Wheel visual style
- **D-03:** Classic downward-pointing triangle pointer at 12 o'clock position
- **D-04:** Segment colors at Claude's discretion — should be visually appealing and distinct between adjacent segments

### Spin interaction
- **D-05:** Both click/tap the wheel AND a dedicated "Spin" button trigger a spin — maximum flexibility
- **D-06:** Fast + dramatic spin: 4-6 full rotations, quick start, dramatic slow-down, ~4-5 seconds total duration

### Winner announcement
- **D-07:** Center overlay on the wheel — winner name pops up bold with celebration styling, then fades out after a moment
- **D-08:** After fade, the winning item is automatically removed from the wheel (per WHEL-04)

### Claude's Discretion
- Segment color palette (rainbow, themed, or custom)
- Text placement on segments (radial vs horizontal)
- Wheel size relative to container
- Exact overlay fade timing and animation
- Quick-add vs bulk textarea toggle UX details
- Spin button placement (below wheel, beside wheel, etc.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing code to integrate with
- `apps/web/src/routes/randomizer.tsx` — Page with tabbed layout, per-tab history state, WheelPlaceholder to replace
- `apps/web/src/components/result-history.tsx` — Shared ResultHistory component for history display
- `apps/web/src/lib/randomizer/types.ts` — HistoryEntry and TabId types
- `apps/web/src/index.css` — CSS accent tokens including `--color-wheel-accent`
- `apps/web/src/components/ui/tabs.tsx` — Shadcn Tabs with line variant

### Research findings (from project-level research)
- `.planning/research/SUMMARY.md` — Architecture approach, pitfalls, stack recommendations
- `.planning/research/ARCHITECTURE.md` — Component hierarchy and data flow patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ResultHistory` component: accepts `entries: HistoryEntry[]` and `onClear: () => void` — ready to wire
- `HistoryEntry` type: `{ id: number; label: string; timestamp: number }` — wheel results will use this
- `randomizer.tsx` already manages `wheelHistory` state and `handleClearHistory` — hook into existing state
- Blue accent token `--color-wheel-accent` in CSS — use for wheel-related UI elements

### Established Patterns
- TDD approach: write failing tests first (RED), then implement (GREEN) — established in Phase 1
- kebab-case filenames, `type` keyword for TypeScript, `@base-project/web/` import alias
- Custom hooks for state management (planned: `useWheel` hook per research ARCHITECTURE.md)
- Canvas-based rendering per research recommendation — no DOM-based wheel

### Integration Points
- Replace `WheelPlaceholder` in `randomizer.tsx` with real `WheelTab` container component
- Wire `useWheel` hook results into existing `wheelHistory` state in `RandomizerPage`
- New files in `apps/web/src/components/` for wheel-specific components (e.g. `wheel-canvas.tsx`, `wheel-item-list.tsx`)
- New hook in `apps/web/src/lib/randomizer/` (e.g. `use-wheel.ts`)
- localStorage utilities in `apps/web/src/lib/randomizer/` (e.g. `local-storage.ts`)

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

*Phase: 02-spinning-wheel*
*Context gathered: 2026-03-26*
