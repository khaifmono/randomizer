---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.1 + @testing-library/react |
| **Config file** | apps/web/vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `pnpm --filter web test --run` |
| **Full suite command** | `pnpm --filter web test --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --filter web test --run`
- **After every plan wave:** Run `pnpm --filter web test --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 0 | SHRD-01 | setup | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | SHRD-01 | component | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | SHRD-02 | component | `pnpm --filter web test --run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `apps/web/vitest.config.ts` — Vitest config with jsdom environment
- [ ] `@testing-library/react` + `@testing-library/jest-dom` — test utilities
- [ ] `jsdom` — browser environment for component tests

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Tab switching shows correct panel | SHRD-01 | Visual tab panel rendering | Navigate to /randomizer, click each tab, verify correct panel shows |
| History displays newest-first | SHRD-02 | Visual ordering verification | Add multiple entries, verify newest appears at top |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
