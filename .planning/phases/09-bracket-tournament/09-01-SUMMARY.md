---
phase: 09-bracket-tournament
plan: 01
subsystem: bracket-hook
tags: [tdd, state-machine, bracket-algorithm, css-animation]
dependency_graph:
  requires:
    - apps/web/src/lib/randomizer/types.ts
    - apps/web/src/index.css
  provides:
    - apps/web/src/lib/randomizer/use-bracket.ts
    - apps/web/src/lib/randomizer/use-bracket.test.ts
  affects:
    - apps/web/src/lib/randomizer/types.ts (TabId union extended)
    - apps/web/src/index.css (bracket accent token + animation keyframes)
tech_stack:
  added: []
  patterns:
    - isAnimatingRef + pendingWinnerRef double-ref guard (use-cards pattern)
    - generateBracket: BYE interleaving ensures each BYE faces a real entry
    - advanceWinner: immutable update — matchup i feeds round+1 matchup floor(i/2)
    - startTournament: bye propagation loop runs synchronously before setBracketState
key_files:
  created:
    - apps/web/src/lib/randomizer/use-bracket.ts
    - apps/web/src/lib/randomizer/use-bracket.test.ts
  modified:
    - apps/web/src/lib/randomizer/types.ts
    - apps/web/src/index.css
decisions:
  - "BYE interleaving: shuffle real entries then interleave BYEs at evenly-spaced positions so each BYE faces a real entry (never BYE vs BYE)"
  - "startTournament uses setEntriesState functional update to avoid stale closure on entries array"
  - "setMode is called inside setEntriesState callback to pre-determine winner atomically with bracket generation"
  - "ANIMATION_DURATION=1200ms: shake 600ms + winner-flash 500ms + 100ms buffer"
metrics:
  duration: 4min
  completed: 2026-03-28
  tasks_completed: 2
  files_created: 2
  files_modified: 2
---

# Phase 09 Plan 01: useBracket Hook + CSS Animation Keyframes Summary

**One-liner:** Single-elimination bracket hook with TDD (31 tests), BYE interleaving algorithm, Random/Judge mode state machine, and CSS VS animation keyframes.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | TDD useBracket hook — bracket algorithm and state machine | 4d80182 | use-bracket.ts, use-bracket.test.ts, types.ts |
| 2 | Add bracket CSS animation keyframes and accent color token | 28b216a | index.css |

## What Was Built

### `use-bracket.ts` — Bracket State Machine Hook

The complete brain of the Bracket Tournament tool. Exports:

- `useBracket()` hook with entry/playing/complete state machine
- `ANIMATION_DURATION = 1200` constant
- `BracketEntry`, `Matchup`, `BracketState` types
- `nextPowerOf2()` — power-of-2 ceiling for 2-16 entrants
- `generateBracket()` — builds full round structure with interleaved BYEs
- `advanceWinner()` — immutable round update propagating winner to next slot

**Key behaviors:**
- Random mode: pre-determines winner before animation via `pendingWinnerRef`; `onAnimationEnd()` applies it
- Judge mode: `resolveMatchup(matchupId, winnerId)` waits for user pick
- BYEs auto-resolve and propagate to round 1 at `startTournament()` time
- `isAnimatingRef` guard prevents double-trigger during animation
- History entry logged on completion: `"Winner: {name} ({N} rounds, {N} entrants)"`

### `types.ts` — TabId Extended

`TabId` union updated to include `"bracket"` for full TypeScript type safety across the app.

### `index.css` — Bracket Animation CSS

- `--color-bracket-accent: oklch(0.72 0.18 85)` — warm gold/amber accent
- `@keyframes bracket-shake` — 0.6s lateral vibrate with rotation for both matchup options
- `@keyframes bracket-vs-pulse` — 0.4s scale-in for VS badge appearance
- `@keyframes bracket-winner-flash` — 0.5s slide + background highlight for winning option
- CSS utility classes: `.bracket-option.is-shaking`, `.bracket-vs-badge.is-pulsing`, `.bracket-option.is-winner-flash`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] BYE pairing: Fisher-Yates shuffle can pair two BYEs together**
- **Found during:** RED phase test run (test "generateBracket with 5 names: 3 rounds, 3 byes" expected 3 bye matchups but got 2)
- **Issue:** Pure Fisher-Yates shuffle on mixed real+BYE entries can pair two BYEs into one matchup, reducing bye matchup count and breaking the "each BYE faces a real entry" invariant
- **Fix:** Separate real entries from BYEs; shuffle only real entries; then interleave BYEs at evenly-spaced positions before pairing into matchups. This guarantees no BYE vs BYE matchup.
- **Files modified:** `use-bracket.ts` (generateBracket function)
- **Commit:** 4d80182

## Known Stubs

None — all logic is fully implemented. Plan 02 will wire presentational components to this hook.

## Self-Check: PASSED

- [x] `apps/web/src/lib/randomizer/use-bracket.ts` — FOUND
- [x] `apps/web/src/lib/randomizer/use-bracket.test.ts` — FOUND
- [x] `apps/web/src/lib/randomizer/types.ts` — contains "bracket"
- [x] `apps/web/src/index.css` — contains bracket-shake, bracket-vs-pulse, bracket-winner-flash, bracket-accent
- [x] Commit 4d80182 — FOUND
- [x] Commit 28b216a — FOUND
- [x] All 31 tests pass
