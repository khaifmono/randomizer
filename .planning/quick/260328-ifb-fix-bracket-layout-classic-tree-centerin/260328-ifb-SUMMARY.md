---
phase: quick
plan: 260328-ifb
subsystem: bracket
tags: [bracket, layout, css-grid, connector-lines]
dependency_graph:
  requires: []
  provides: [bracket-tree-layout, bracket-connector-lines]
  affects: [bracket-display]
tech_stack:
  added: []
  patterns: [css-grid-row-span-doubling, connector-column-pattern]
key_files:
  created: []
  modified:
    - apps/web/src/components/randomizer/bracket/bracket-display.tsx
    - apps/web/src/index.css
decisions:
  - "CSS Grid row-span doubling: round R matchup spans 2^R rows — simple, declarative, no JS math for positioning"
  - "Connector column is a sibling grid div with same gridTemplateRows — aligns perfectly with matchup cells"
  - "badgeOffset margin-top on connector column skips the badge header row so lines align with card centers"
  - "Stubs extend left with left:-1rem to visually connect back into the previous round's card edges"
metrics:
  duration: 5min
  completed_date: "2026-03-28"
  tasks_completed: 1
  tasks_total: 2
  files_modified: 2
---

# Phase quick Plan 260328-ifb: Fix Bracket Layout — Classic Tree Centering Summary

**One-liner:** CSS Grid tree layout for single-elimination bracket — each next-round matchup vertically centered between its two feeder matchups using row-span doubling, with connector lines between rounds.

## What Was Built

Rewrote `BracketDisplay` to use CSS Grid instead of `flex-col gap-4`. Each round column is a CSS Grid where Round R matchup M spans `2^R` rows starting at `M * 2^R + 1`. All round columns and connector columns share the same `gridTemplateRows` so cells align across columns.

Between each pair of consecutive revealed rounds, a connector column is rendered. Each connector cell aligns to the next round's matchup position and displays four absolutely-positioned divs forming the bracket tree lines (vertical bar, top stub, bottom stub, right horizontal).

The `revealedRounds` array preserves `originalIndex` so row-span math is always calculated from the correct round depth even when early rounds are filtered.

## Tasks

| Task | Name | Status | Commit |
|------|------|--------|--------|
| 1 | Rewrite BracketDisplay with CSS Grid tree layout | Complete | 55b7d89 |
| 2 | Verify bracket tree layout visually | Awaiting human verification | — |

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `apps/web/src/components/randomizer/bracket/bracket-display.tsx` exists and modified
- [x] `apps/web/src/index.css` exists and modified
- [x] Commit 55b7d89 exists
- [x] Build passes: `pnpm --filter @base-project/web build` — "built in 2.48s" with no TypeScript errors
