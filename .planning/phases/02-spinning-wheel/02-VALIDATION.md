---
phase: 2
slug: spinning-wheel
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 2 — Validation Strategy

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
| 02-01-01 | 01 | 0 | WHEL-01 | unit | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | WHEL-01 | unit | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | WHEL-02, WHEL-07 | unit+component | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | WHEL-03, WHEL-04, WHEL-05 | component | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 2 | WHEL-06 | unit | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `motion@^12.38.0` — animation library for wheel spin deceleration
- [ ] Canvas mock setup in vitest for jsdom environment

*Existing infrastructure (vitest, testing-library) covers remaining needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Wheel spin animation looks smooth with deceleration | WHEL-02, WHEL-07 | Visual animation quality | Spin the wheel, observe 4-6 rotations with smooth slow-down |
| Winner overlay appears and fades out | WHEL-03 | Visual timing/animation | Spin wheel, verify bold overlay shows winner, fades after ~2s |
| Canvas renders segments with readable text | WHEL-01 | Visual rendering quality | Add 5+ items, verify all segments have readable text |
| localStorage persists across page refresh | WHEL-06 | Browser storage behavior | Add items, refresh page, verify items restored |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
