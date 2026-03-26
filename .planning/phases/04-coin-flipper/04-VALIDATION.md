---
phase: 4
slug: coin-flipper
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.1 + @testing-library/react (from Phase 1) |
| **Config file** | apps/web/vitest.config.ts (exists) |
| **Quick run command** | `pnpm --filter web test --run` |
| **Full suite command** | `pnpm --filter web test --run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --filter web test --run`
- **After every plan wave:** Run `pnpm --filter web test --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | COIN-01, COIN-03 | unit | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | COIN-02 | structural | `grep -c "coin-flip\|coin-scene"` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 2 | COIN-01, COIN-02 | component | `npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 2 | COIN-01, COIN-02, COIN-03 | component | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework or tooling needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Coin flip 3D animation looks smooth | COIN-02 | Visual animation quality | Flip coins, observe 3D rotation for ~1.2s |
| Heads/tails faces render correctly | COIN-02 | Visual rendering | Flip coins, verify H and T faces display |
| Multiple coins animate simultaneously | COIN-02 | Visual timing | Select 4+ coins, flip, verify all animate at once |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
