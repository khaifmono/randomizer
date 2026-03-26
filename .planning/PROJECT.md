# Randomizer Toolkit

## What This Is

A fun, animated web app with three randomizer tools in a tabbed interface: a spinning wheel where users enter custom items (removed on hit, manual reset), a configurable dice roller (1-6 dice), and a multi-coin flipper. Each tab keeps a history of past results. Built on an existing Hono + React monorepo.

## Core Value

Satisfying, animated randomization that feels fun to use — the wheel spins smoothly, dice tumble, coins flip with personality.

## Requirements

### Validated

- ✓ Monorepo scaffold with Hono API and React frontend — existing
- ✓ TanStack Router file-based routing — existing
- ✓ Tailwind CSS + Shadcn component system — existing
- ✓ Vite dev server and build pipeline — existing

### Active

- [ ] Tabbed interface with three tools: Wheel, Dice, Coin
- [ ] Spinning wheel with user-entered item list
- [ ] Wheel removes hit item after landing
- [ ] Manual reset button to restore all wheel items
- [ ] Wheel item list saved to browser local storage
- [ ] Configurable dice roller (1-6 dice)
- [ ] Dice roll animation
- [ ] Multi-coin flipper with selectable coin count
- [ ] Coin flip animation
- [ ] Result history log per tab
- [ ] Fun, smooth animations across all tools

### Out of Scope

- Sound effects — adds complexity, can layer on later
- Backend/API integration — all randomization is client-side
- User accounts or cloud sync — local-only for v1
- Sharing results — no social features
- Custom dice types (D20, etc.) — standard 6-sided only

## Context

- Existing monorepo with `apps/api` and `apps/web` — new features go in `apps/web`
- React 19 with TanStack Router for routing, TanStack Query for data fetching
- Shadcn + Radix UI + Tailwind CSS for components and styling
- tw-animate-css already available for animations
- This is a client-side feature — no API changes needed
- Browser localStorage for wheel item persistence

## Constraints

- **Tech stack**: Must use existing React + Tailwind + Shadcn setup — no new UI frameworks
- **Client-side only**: All randomization logic runs in the browser, no API calls
- **Animations**: Must feel smooth and fun — CSS/JS animations, not GIF/video

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Client-side only | Randomization doesn't need a server, keeps it simple and fast | — Pending |
| localStorage for wheel items | Simple persistence without auth/backend complexity | — Pending |
| Standard 6-sided dice only | Keeps scope focused for v1 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-26 after initialization*
