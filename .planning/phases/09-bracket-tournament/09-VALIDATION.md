---
phase: 9
slug: bracket-tournament
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `apps/web/vite.config.ts` |
| **Quick run command** | `pnpm --filter web test -- --run` |
| **Full suite command** | `pnpm --filter web test -- --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --filter web test -- --run`
- **After CSS animation tasks:** Visual inspection via dev server
- **After bracket algorithm tasks:** Unit test for winner propagation and bye handling

---

## Critical Paths

1. **Bracket generation** — pad to power-of-2, byes, seeding
2. **Winner propagation** — matchup i feeds round r+1, matchup floor(i/2)
3. **Mode switching** — Random vs Judge mode state management
4. **Animation timing** — VS showdown plays before winner resolution

---

## Acceptance Signals

- `use-bracket.test.ts` passes with bracket generation, bye handling, winner propagation
- VS animation keyframes render (visual check)
- Both Random and Judge modes resolve matchups correctly
- Progressive reveal shows only current round
- Crown + confetti appears for tournament winner
