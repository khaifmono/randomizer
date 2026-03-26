# Feature Research

**Domain:** Randomizer toolkit — spinning wheel, dice roller, coin flipper
**Researched:** 2026-03-26
**Confidence:** HIGH (verified against multiple live competitor products)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Spinning wheel that visually spins | Core identity of the tool — a static picker is not a wheel | MEDIUM | Requires canvas or CSS conic-gradient + rotation animation |
| Custom item entry for wheel | No point in spinning if you can't put your own options in | LOW | Textarea or list input; one item per line is standard pattern |
| Wheel result clearly announced | User must know what was picked after the spin stops | LOW | Large result overlay or highlighted segment on stop |
| Remove-on-hit for wheel | Standard in every major wheel app (Wheel of Names, Picker Wheel) — users expect it for fair sequential draws | LOW | Toggle item out of active set; don't delete from source list |
| Manual reset to restore all wheel items | Complements remove-on-hit — users expect to be able to restart | LOW | Restore all removed items, re-render wheel |
| LocalStorage persistence for wheel items | Users close the tab and expect their list to survive | LOW | JSON serialize item list; load on mount |
| Configurable number of dice (1-6) | Every dice roller app supports multi-dice; single-die-only feels broken | LOW | Stepper/counter input |
| Sum total display for dice | Users need the aggregate, not just individual values | LOW | Sum all face values after roll |
| Dice roll animation | Static face change with no animation feels unfinished | MEDIUM | CSS 3D rotation or frame-based animation per die |
| Selectable coin count (multi-coin) | Most coin apps support multiple coins; single-only feels limited | LOW | Counter input, render N coins |
| Coin flip animation | Static heads/tails swap with no motion feels broken | MEDIUM | CSS 3D flip (rotateY 180deg) per coin |
| Heads/tails result display | Users need to see the outcome clearly, especially with many coins | LOW | Count display: "3 Heads, 1 Tail" |
| Result history per tool tab | Standard in every reference app — users scroll back to see previous results | LOW | Append-only list, newest at top, scoped per tool |
| Tabbed interface between the three tools | Expected navigation pattern for multi-tool apps | LOW | Shadcn Tabs component; already in scope |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Smooth, satisfying spin-down deceleration | Most wheel apps feel mechanical; eased deceleration with natural slowdown makes the tool feel premium | MEDIUM | Cubic bezier or custom easing on CSS animation; spin many full rotations before landing |
| All-dice animate simultaneously | Some apps animate dice one at a time; simultaneous parallel animation looks more satisfying | LOW | All N dice trigger animation class at same roll event |
| Coin flip result tally in history | Showing running heads/tails counts (e.g., "5H 3T across 8 flips") makes the history more useful than a raw log | LOW | Compute from history array on render |
| Wheel item count badge | Showing "8 items remaining" while depleting items creates engagement and urgency | LOW | Derived from active item count |
| Individual die face icons (pip dots) | SVG or CSS pip patterns look far better than a number in a square | MEDIUM | 6 pip layouts; can use CSS grid for pips |
| Clear empty-state for wheel | When all items are removed, display a clear "Wheel is empty — reset to continue" state rather than a broken wheel | LOW | Guard render on zero items |
| Instant re-spin without clearing history | Allow rapid repeated spins without page reload — results append to log | LOW | Keep history in component state, do not reset on spin |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Sound effects | "More fun" — coin ping, dice rattle, wheel tick | Adds asset management complexity, autoplay policies block audio on most browsers without user gesture, intrusive for shared environments | Animation conveys the same physical satisfaction; add sound as a v2 opt-in toggle only after core is solid |
| Cloud sync / user accounts | "Save my wheels across devices" | Full auth + backend scope creep; destroys the "client-side only" constraint; adds weeks of work | localStorage covers the primary use case; export/import (v2) covers the edge case |
| Sharing via URL or link | "Send my wheel to someone" | Requires URL encoding or a backend, plus sharing UI — disproportionate complexity for a personal tool | Noted as explicit out-of-scope in PROJECT.md; revisit post-v1 |
| Weighted wheel segments | "I want some items to be picked more often" | Requires weighted random algorithm, complicates item entry UX significantly | Uniform randomness is the honest, simple contract; implement equal probability |
| Custom D20/D12/D8 dice | "I play D&D" | Expands scope significantly — different face counts, different pip layouts, different UX | Standard 6-sided dice covers board game use cases; flag as v2 scope in PROJECT.md |
| Confetti / celebration effects on win | "Makes it more exciting" | External confetti libraries add bundle weight; hand-rolling is non-trivial for genuine polish | Satisfying animation + bold result announcement achieves the celebration feeling without an extra dependency |
| Probability/statistics view | "Show me the distribution of results" | Adds significant UI complexity and detracts from the fun, casual feel of the tool | History log implicitly shows this; dedicated stats view is v2+ |
| Dark mode toggle | "I prefer dark mode" | Shadcn/Tailwind dark mode is non-trivial to wire correctly without existing setup; scope risk | Existing Tailwind + Shadcn setup may already handle system `prefers-color-scheme`; audit existing scaffold rather than building explicitly |

## Feature Dependencies

```
[Tabbed interface]
    └──enables──> [Wheel tab] + [Dice tab] + [Coin tab]
                      each └──contains──> [Result history (per tab)]

[Wheel item entry]
    └──required by──> [Spinning wheel render]
                          └──required by──> [Remove-on-hit behavior]
                                                └──required by──> [Manual reset button]

[LocalStorage persistence]
    └──depends on──> [Wheel item entry] (what gets persisted)
    └──reads on mount──> [Wheel item entry] (populates initial state)

[Dice count selector]
    └──required by──> [Multi-dice render]
                          └──required by──> [Sum total display]
                          └──required by──> [Simultaneous dice animation]

[Coin count selector]
    └──required by──> [Multi-coin render]
                          └──required by──> [Flip animation (N coins)]
                          └──required by──> [Heads/tails result display]

[Result history (per tab)]
    └──enhances──> [Coin tally display] (computed from history)
    └──enhances──> [Wheel item count badge] (remaining = total - removed)
```

### Dependency Notes

- **Wheel item entry requires tabbed interface:** Items are scoped to the Wheel tab; tab routing must exist first.
- **Remove-on-hit requires wheel render:** Removal is a post-spin state mutation; the wheel must first exist.
- **Manual reset requires remove-on-hit:** Reset only makes sense when removal has happened; they are a pair.
- **LocalStorage depends on wheel item entry:** There is nothing to persist until the item list exists.
- **Sum display requires multi-dice render:** You cannot sum dice that have not been rendered and rolled.
- **History enhances tally display:** Coin tally is a derived view over the history array — no separate data store needed.

## MVP Definition

### Launch With (v1)

Minimum viable product that delivers the core value: fun, animated randomization.

- [ ] Tabbed interface (Wheel / Dice / Coin) — required navigation structure
- [ ] Wheel: custom item entry, spin animation with eased deceleration, result display — core identity
- [ ] Wheel: remove-on-hit + manual reset — differentiating mechanic called out in PROJECT.md
- [ ] Wheel: localStorage persistence — users will lose their list without this; very low effort
- [ ] Dice: 1-6 dice selector, roll animation, sum display — all table stakes, low complexity
- [ ] Coin: 1-N coin selector (reasonable cap ~10), flip animation, heads/tails count display — table stakes
- [ ] Result history log per tab — expected by all reference apps; simple append-only list

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Individual die pip face icons (SVG dots) — polish upgrade from numeric display; add when v1 ships cleanly
- [ ] Wheel item count badge ("X items remaining") — low effort, high engagement; add once remove/reset is solid
- [ ] Coin flip tally over session ("5H 3T across 8 flips") — easy to compute from existing history array

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Sound effects — revisit only as opt-in toggle; browser autoplay policy makes this non-trivial
- [ ] Export/import wheel lists — covers the cross-device use case without accounts
- [ ] Custom dice types (D4, D8, D10, D12, D20) — clear user demand but scope risk for v1
- [ ] Probability/statistics view per tool — useful for educational use cases, deferred for focus

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Tabbed interface | HIGH | LOW | P1 |
| Wheel spin animation (eased) | HIGH | MEDIUM | P1 |
| Wheel custom item entry | HIGH | LOW | P1 |
| Wheel remove-on-hit + reset | HIGH | LOW | P1 |
| Wheel localStorage persistence | HIGH | LOW | P1 |
| Dice 1-6 selector + roll animation | HIGH | MEDIUM | P1 |
| Dice sum display | HIGH | LOW | P1 |
| Coin count selector + flip animation | HIGH | MEDIUM | P1 |
| Coin heads/tails result display | HIGH | LOW | P1 |
| Result history per tab | HIGH | LOW | P1 |
| Die pip face icons | MEDIUM | MEDIUM | P2 |
| Wheel item count badge | MEDIUM | LOW | P2 |
| Coin tally over session | MEDIUM | LOW | P2 |
| Sound effects (opt-in) | MEDIUM | HIGH | P3 |
| Custom dice types | MEDIUM | HIGH | P3 |
| Export/import wheel lists | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Wheel of Names | Picker Wheel | flipsimu.com | Our Approach |
|---------|---------------|-------------|--------------|--------------|
| Custom item entry | Yes, textarea | Yes, list | N/A | Yes, textarea or list input |
| Remove winner after spin | Yes (button) | Yes (toggle) | N/A | Yes, automatic on spin land |
| Manual reset | Yes | Yes | N/A | Yes, explicit reset button |
| Spin animation | Smooth, eased | Smooth, eased | N/A | Smooth with cubic-bezier deceleration |
| Result history | Yes | Yes | Yes (stats board) | Yes, append-only log per tab |
| Multi-coin | N/A | N/A | Yes (up to 100) | Yes, selectable count |
| Coin flip animation | N/A | N/A | Yes, 3D flip | Yes, CSS 3D rotateY |
| Multi-dice | Limited | Limited | Yes | Yes, 1-6 dice |
| Dice animation | Limited | Limited | Yes | Yes, per-die CSS animation |
| LocalStorage persistence | Yes (wheel data) | Yes | Partial | Yes, wheel items only |
| Sound effects | Yes | Yes | Yes | No (v1 scope exclusion) |
| Sharing / URL save | Yes | Yes | No | No (v1 scope exclusion) |
| Accounts / cloud sync | Yes | Yes | No | No (explicit out-of-scope) |

## Sources

- [Wheel of Names](https://wheelofnames.com/) — live competitor, feature analysis via WebFetch
- [Picker Wheel](https://pickerwheel.com/) — live competitor, feature analysis via WebFetch
- [flipsimu.com](https://flipsimu.com/) — live coin flip competitor, feature analysis via WebFetch
- [react-custom-roulette npm](https://www.npmjs.com/package/react-custom-roulette) — implementation reference
- [spin-wheel (CrazyTim)](https://crazytim.github.io/spin-wheel/) — implementation reference for animation patterns
- [Roll A Die](https://rolladie.net/) — dice roller competitor reference
- Web search: "spinning wheel randomizer app features 2026" — ecosystem survey (MEDIUM confidence)
- Web search: "coin flipper web app features animation multi coin 2026" — ecosystem survey (MEDIUM confidence)
- Web search: "dice roller app features multiple dice sum display animation UX 2025" — ecosystem survey (MEDIUM confidence)

---
*Feature research for: randomizer toolkit (spinning wheel, dice roller, coin flipper)*
*Researched: 2026-03-26*
