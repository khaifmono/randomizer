---
phase: 07-team-shuffler
plan: 01
subsystem: randomizer/hooks
tags: [tdd, hook, business-logic, teams, shuffle]
dependency_graph:
  requires: []
  provides:
    - useTeams hook with split and pick-one modes
    - ShuffleResult type
    - TabId extended with "teams"
  affects:
    - apps/web/src/lib/randomizer/types.ts
    - Plan 02 UI components (depend on useTeams contract)
tech_stack:
  added: []
  patterns:
    - ref-mirror pattern (namesRef/modeRef/teamCountRef mirror useState for stable callback reads)
    - Fisher-Yates shuffle with round-robin distribution
    - isShufflingRef synchronous guard (same as useDice)
    - pendingResultRef pre-computes before animation starts
key_files:
  created:
    - apps/web/src/lib/randomizer/use-teams.ts
    - apps/web/src/lib/randomizer/use-teams.test.ts
  modified:
    - apps/web/src/lib/randomizer/types.ts
decisions:
  - "ref-mirror pattern: namesRef/modeRef/teamCountRef mirror useState so startShuffle callbacks always read current values without stale closures"
  - "ANIMATION_DURATION = 800ms — snappier than dice (1200ms) and coin, suits shuffle scramble feel"
  - "Round-robin distribution (index % teamCount) ensures teams are as even as possible"
metrics:
  duration: 3min
  completed: 2026-03-27
  tasks_completed: 2
  files_created_or_modified: 3
---

# Phase 07 Plan 01: useTeams Hook (TDD) Summary

**One-liner:** useTeams hook with Fisher-Yates shuffle and round-robin team distribution, ref-mirror pattern for stable callbacks, 18 tests all passing.

## Tasks Completed

| Task | Type | Description | Commit |
|------|------|-------------|--------|
| 1 | TDD RED | Write 18 failing tests + stub useTeams | 441c2bd |
| 2 | TDD GREEN | Implement useTeams, update types.ts | 99c3fb1 |

## What Was Built

- **`use-teams.ts`**: Full useTeams hook with:
  - State: `names`, `mode`, `teamCount`, `shuffling`, `result`, `history`
  - Actions: `setNames`, `setMode`, `setTeamCount`, `startShuffle`, `onShuffleEnd`
  - Fisher-Yates shuffle on a copy of names array
  - Round-robin distribution: `shuffled.forEach((name, i) => teams[i % teamCount].push(name))`
  - isShufflingRef synchronous guard prevents concurrent shuffles
  - pendingResultRef pre-computes result before animation starts
  - namesRef/modeRef/teamCountRef mirror useState for stale-closure-free callbacks
  - onShuffleEnd appends history entry (newest first) then clears shuffling after 200ms
  - ANIMATION_DURATION = 800

- **`use-teams.test.ts`**: 18 test cases covering:
  - Initial state verification
  - setNames/setMode/setTeamCount happy paths
  - Boundary clamping (teamCount 1 and 9 are no-ops)
  - Guard behavior (all setters and startShuffle no-op during shuffling)
  - pick-one mode with and without names
  - split mode with 4 names + 2 teams (distribution, no duplicates)
  - Empty names in both modes
  - Timer behavior (shuffling clears after 200ms with fake timers)
  - History prepend order and incrementing IDs

- **`types.ts`**: TabId extended with `"teams"` union member

## History Label Formats

- pick-one: `"Picked: {name}"` or `"Picked: (none)"` when empty
- split: `"Teams of {n}: [{name, name}] [{name, name}] ..."` where n = Math.ceil(names.length / teamCount)

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all exported values are fully implemented.

## Self-Check

Files created:
- apps/web/src/lib/randomizer/use-teams.ts — FOUND
- apps/web/src/lib/randomizer/use-teams.test.ts — FOUND
- apps/web/src/lib/randomizer/types.ts — FOUND (modified)

Commits:
- 441c2bd: test(07-01): add failing tests for useTeams hook — FOUND
- 99c3fb1: feat(07-01): implement useTeams hook — split and pick-one logic — FOUND

Test results: 18/18 tests pass, 164/164 total suite tests pass

## Self-Check: PASSED
