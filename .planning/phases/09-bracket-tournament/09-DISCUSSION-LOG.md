# Phase 9: Bracket Tournament - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 09-bracket-tournament
**Areas discussed:** Bracket layout & visuals, Matchup animation, Entry & seeding, Winner celebration

---

## Bracket layout & visuals

| Option | Description | Selected |
|--------|-------------|----------|
| Horizontal tree (left to right) | Classic March Madness style — rounds flow left to right, final winner on the far right | ✓ |
| Vertical tree (top to bottom) | Rounds stack vertically — mobile-friendly but less traditional | |
| Animated step-by-step | Show one matchup at a time, simpler and very mobile-friendly | |

**User's choice:** Horizontal tree (left to right)

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal pill cards | Simple rounded pills with thin connecting lines | |
| Bordered match cards | Boxed cards with divider, winner gets highlighted border/color | ✓ |
| You decide | Claude picks best visual style | |

**User's choice:** Bordered match cards

| Option | Description | Selected |
|--------|-------------|----------|
| Full bracket visible | All matchups shown at once with empty slots | |
| Progressive reveal | Only current round visible, next round appears as winners advance | ✓ |
| You decide | Claude picks what works best | |

**User's choice:** Progressive reveal

---

## Matchup animation

| Option | Description | Selected |
|--------|-------------|----------|
| Highlight & pulse | Both glow for 1-2 seconds, winner highlights, loser fades | |
| Versus showdown | Dramatic VS appears, both shake, winner slides forward with flash | ✓ |
| Rapid flip | Both alternate highlighting rapidly, settle on winner | |

**User's choice:** Versus showdown

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-play all rounds | Click Start once, watch whole bracket play out | |
| Click per round | Click Next Round to advance | |
| Click per matchup | Click to resolve each individual matchup | ✓ |

**User's choice:** Click per matchup

**Notes:** User requested two modes: (1) Random mode where browser decides who advances, (2) Judge mode where user picks the winner. Both modes keep the dramatic VS showdown animation.

---

## Entry & seeding

| Option | Description | Selected |
|--------|-------------|----------|
| Textarea (one per line) | Same as Team Shuffler — bulk-friendly | |
| Add one at a time | Input field + Add button, like wheel | |
| Both | Textarea AND input field | ✓ |

**User's choice:** Both entry methods

| Option | Description | Selected |
|--------|-------------|----------|
| Byes for top seeds | Some entries auto-advance to round 2, randomly assigned | ✓ |
| Force power of 2 | Require 4, 8, or 16 entries | |
| You decide | Claude picks best approach | |

**User's choice:** Byes for top seeds

| Option | Description | Selected |
|--------|-------------|----------|
| 2-8 entries | Small brackets, max 3 rounds | |
| 2-16 entries | Medium brackets, up to 4 rounds | ✓ |
| 2-32 entries | Large brackets, real tournament size | |

**User's choice:** 2-16 entries

---

## Winner celebration

| Option | Description | Selected |
|--------|-------------|----------|
| Trophy + glow | Winner card scales up with golden glow, trophy icon | |
| Crown + confetti burst | Winner gets crown icon, CSS confetti particles burst | ✓ |
| Full-screen reveal | Winner name appears large center-screen | |
| You decide | Claude picks whatever fits best | |

**User's choice:** Crown + confetti burst

---

## Claude's Discretion

- Bracket connector line style and colors
- Match card sizing and spacing
- VS animation duration and easing
- Confetti particle count and physics
- History entry format
- Mobile responsiveness strategy
- Bye visual treatment
- Mode toggle UI placement

## Deferred Ideas

None — discussion stayed within phase scope
