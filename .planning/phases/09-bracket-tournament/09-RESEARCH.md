# Phase 09: Bracket Tournament - Research

**Researched:** 2026-03-27
**Domain:** React state machine, CSS animation, single-elimination bracket algorithm
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Horizontal tree (left to right) — classic March Madness style, rounds flow left to right with winner on the far right
- **D-02:** Bordered match cards — boxed cards with a divider between the two options, winner gets highlighted border/color
- **D-03:** Progressive reveal — only the current round is visible, next round slots appear as winners advance
- **D-04:** Versus showdown animation — dramatic "VS" appears between the two options, both shake/vibrate, then winner slides forward with a flash
- **D-05:** Click per matchup pacing — user clicks to resolve each individual matchup, maximum control
- **D-06:** Two modes: "Random" (browser randomly picks winner with VS animation) and "Judge" (user clicks their pick after VS animation plays). Both modes keep the dramatic showdown effect.
- **D-07:** Dual entry method — textarea for bulk entry (one per line) AND input field + Add button for one at a time
- **D-08:** Byes for non-power-of-2 counts — randomly assign byes so some entries auto-advance to round 2
- **D-09:** 2-16 entries supported — up to 4 rounds, may need horizontal scroll on mobile for larger brackets
- **D-10:** Crown + confetti burst — winner card gets a crown icon, CSS confetti particles burst from the card

### Claude's Discretion
- Bracket connector line style and colors
- Match card sizing and spacing
- VS animation duration and easing
- Confetti particle count and physics
- History entry format for completed tournaments
- Mobile responsiveness strategy (scroll vs scale)
- Bye visual treatment in the bracket
- Mode toggle UI placement and style

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

The BRKT requirements are not yet formally written in REQUIREMENTS.md (they are referenced in ROADMAP.md but undefined there). Based on CONTEXT.md decisions and the phase goal, the requirements map as follows:

| ID | Description | Research Support |
|----|-------------|------------------|
| BRKT-01 | User can enter 2-16 options via textarea (bulk) and input+Add button (one at a time) | D-07, D-09 — dual entry from TeamsTab pattern |
| BRKT-02 | Bracket is generated as single-elimination with byes for non-power-of-2 counts | D-08, D-09 — bracket algorithm section |
| BRKT-03 | Bracket renders left-to-right (rounds flow right, winner far right) with match cards and connector lines | D-01, D-02 — layout section |
| BRKT-04 | VS showdown animation plays per matchup — both options shake/vibrate, VS appears, winner slides forward with flash | D-04 — animation pattern section |
| BRKT-05 | Two modes: Random (browser picks winner) and Judge (user clicks their pick) — both show VS animation | D-05, D-06 — state machine section |
| BRKT-06 | Final winner receives crown icon + CSS confetti burst; completed tournament logged to history | D-10 — celebration + history section |
</phase_requirements>

---

## Summary

Phase 9 adds a Bracket Tournament tab — a single-elimination bracket where 2-16 options compete head-to-head with a dramatic VS animation. The core challenge is a **bracket state machine**: generating the bracket structure, tracking matchup results round by round, and progressively revealing next-round slots as winners advance.

The implementation follows the established project pattern exactly: a `use-bracket.ts` hook holds all state, a `components/randomizer/bracket/` folder holds presentational components, and `bracket-tab.tsx` wires them together. The hook follows the `useCards`/`useTeams` double-ref guard pattern (isAnimatingRef + pendingRef) to prevent double-triggers during animation.

The **bracket algorithm** is pure client-side math: pad entrant count to the next power of 2, randomly assign byes to fill the gap, then track matchup winners through rounds. The **VS animation** is CSS keyframes in `index.css` — a shake on both options, a bold "VS" pulse, then winner highlight flash. Progressive reveal means each round's column renders only after the prior round's winners are set.

**Primary recommendation:** Implement in two plans: Plan 1 = `use-bracket.ts` hook with full algorithm TDD. Plan 2 = all bracket components, tab wiring, page integration, and human verification.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.0 | Hook + component state | Project standard |
| TypeScript | ~5.9.3 | Type safety | Project standard |
| Tailwind CSS | 4.1.17 | Styling | Project standard |
| Shadcn/Radix UI | assorted | Button, card primitives | Project standard |
| Lucide React | 0.562.0 | Crown, Trophy icons | Project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx + tailwind-merge | present | Conditional classNames | cn() utility everywhere |
| tw-animate-css | 1.4.0 | Animation utilities | For fade/slide transitions |
| CSS keyframes in index.css | — | VS shake, confetti, flash animations | All custom animations live here |

**No new packages needed.** All required capabilities are in the existing stack.

**Installation:**
```bash
# None required — all dependencies already installed
```

---

## Architecture Patterns

### Recommended Project Structure
```
apps/web/src/
├── lib/randomizer/
│   ├── use-bracket.ts           # All bracket state and logic
│   └── types.ts                 # Add "bracket" to TabId union
├── components/randomizer/bracket/
│   ├── bracket-tab.tsx          # Container — wires hook to components and history
│   ├── bracket-entry.tsx        # Dual input: textarea + Add button
│   ├── bracket-display.tsx      # Renders the full bracket (left-to-right columns)
│   ├── bracket-match.tsx        # Single matchup card with VS animation
│   ├── bracket-winner.tsx       # Final winner celebration (crown + confetti)
│   └── bracket-tab.test.tsx     # Component smoke tests
└── components/randomizer/
    └── tutorials.tsx             # Add bracketTutorial export
```

### Pattern 1: Hook State Machine (useBracket)
**What:** All bracket logic lives in `use-bracket.ts`. Components are purely presentational. Follows the `useCards`/`useTeams` double-ref guard pattern.
**When to use:** Every tool in the project follows this pattern — mandatory.
**Key state shape:**
```typescript
// Source: inferred from use-cards.ts / use-teams.ts patterns
type BracketEntry = {
  id: number;
  name: string;
  isBye: boolean;
};

type Matchup = {
  id: string;             // e.g. "r0-m0"
  topEntry: BracketEntry | null;
  bottomEntry: BracketEntry | null;
  winnerId: number | null;
  isBye: boolean;         // true if one side is a bye — auto-advances immediately
};

type BracketState =
  | { phase: "entry" }
  | { phase: "playing"; rounds: Matchup[][]; activeMatchupId: string | null; animating: boolean }
  | { phase: "complete"; winnerId: number };

// Hook return mirrors useCards/useTeams pattern
function useBracket(): {
  entries: string[];
  mode: "random" | "judge";
  bracketState: BracketState;
  history: HistoryEntry[];
  addEntry: (name: string) => void;
  setEntries: (names: string[]) => void;
  setMode: (mode: "random" | "judge") => void;
  startTournament: () => void;
  resolveMatchup: (matchupId: string, winnerId: number) => void;  // judge mode
  onAnimationEnd: (matchupId: string) => void;                    // triggers resolve in random mode
  resetBracket: () => void;
}
```

### Pattern 2: Bracket Generation Algorithm
**What:** Convert a flat list of entrants into a seeded single-elimination bracket with byes.
**When to use:** Called in `startTournament()` inside the hook.
```typescript
// Source: pure algorithmic approach, no library needed
function generateBracket(names: string[]): Matchup[][] {
  // 1. Clamp to 2-16
  const clamped = names.slice(0, 16);

  // 2. Find next power of 2
  const slots = nextPowerOf2(clamped.length); // 2, 4, 8, or 16

  // 3. Build entries array — pad with bye entries
  const byeCount = slots - clamped.length;
  const entries: BracketEntry[] = [
    ...clamped.map((name, i) => ({ id: i, name, isBye: false })),
    ...Array.from({ length: byeCount }, (_, i) => ({ id: clamped.length + i, name: "BYE", isBye: true })),
  ];

  // 4. Fisher-Yates shuffle entries (randomizes seeding)
  fisherYatesShuffle(entries);

  // 5. Pair into round 0 matchups
  const round0: Matchup[] = [];
  for (let i = 0; i < slots; i += 2) {
    const isBye = entries[i].isBye || entries[i + 1].isBye;
    round0.push({
      id: `r0-m${i / 2}`,
      topEntry: entries[i],
      bottomEntry: entries[i + 1],
      winnerId: isBye ? (entries[i].isBye ? entries[i + 1].id : entries[i].id) : null,
      isBye,
    });
  }

  // 6. Build empty subsequent rounds
  const rounds: Matchup[][] = [round0];
  let prevRoundSize = round0.length;
  while (prevRoundSize > 1) {
    const nextRoundSize = prevRoundSize / 2;
    const round: Matchup[] = Array.from({ length: nextRoundSize }, (_, i) => ({
      id: `r${rounds.length}-m${i}`,
      topEntry: null,
      bottomEntry: null,
      winnerId: null,
      isBye: false,
    }));
    rounds.push(round);
    prevRoundSize = nextRoundSize;
  }

  return rounds;
}

function nextPowerOf2(n: number): number {
  if (n <= 2) return 2;
  if (n <= 4) return 4;
  if (n <= 8) return 8;
  return 16;
}
```

### Pattern 3: VS Animation (CSS keyframes)
**What:** Each matchup card plays a shake + VS pulse + winner-flash when resolved. All keyframes go in `index.css` following project convention.
**When to use:** Triggered by adding CSS class to `.bracket-match.is-animating`.
```css
/* Source: follows dice-roll / coin-toss pattern in apps/web/src/index.css */

/* Both option rows shake and vibrate */
@keyframes bracket-shake {
  0%, 100% { transform: translateX(0); }
  15%       { transform: translateX(-4px) rotate(-1deg); }
  30%       { transform: translateX(4px) rotate(1deg); }
  45%       { transform: translateX(-3px); }
  60%       { transform: translateX(3px); }
  75%       { transform: translateX(-2px); }
  90%       { transform: translateX(2px); }
}

/* VS badge pulses in */
@keyframes bracket-vs-pulse {
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* Winner option slides forward and flashes */
@keyframes bracket-winner-flash {
  0%   { background-color: transparent; }
  30%  { background-color: oklch(0.96 0.12 90 / 0.4); transform: translateX(6px); }
  60%  { background-color: oklch(0.96 0.20 90 / 0.2); transform: translateX(3px); }
  100% { background-color: transparent; transform: translateX(0); }
}

.bracket-option.is-shaking {
  animation: bracket-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.bracket-vs-badge.is-pulsing {
  animation: bracket-vs-pulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.bracket-option.is-winner-flash {
  animation: bracket-winner-flash 0.5s ease-out forwards;
}
```

### Pattern 4: Progressive Round Reveal
**What:** Only round columns whose preceding round is fully resolved are rendered. Uses conditional rendering based on `rounds[i-1].every(m => m.winnerId !== null)`.
**When to use:** Inside `BracketDisplay` when mapping rounds to columns.
```typescript
// Source: derived from D-03 decision
{rounds.map((round, roundIndex) => {
  const prevRoundComplete = roundIndex === 0
    || rounds[roundIndex - 1].every((m) => m.winnerId !== null && !m.isBye);
  if (!prevRoundComplete) return null;
  return <BracketColumn key={roundIndex} round={round} roundIndex={roundIndex} ... />;
})}
```

### Pattern 5: Propagation — Advance Winner to Next Round
**What:** When `resolveMatchup()` is called, the hook finds the next-round matchup that this matchup feeds into and sets the appropriate entry slot.
**When to use:** Inside `resolveMatchup()` in the hook.
```typescript
// matchup index i in round r feeds into:
// - round r+1, matchup floor(i/2)
// - topEntry if i is even, bottomEntry if i is odd
function advanceWinner(rounds: Matchup[][], roundIndex: number, matchupIndex: number, winner: BracketEntry): Matchup[][] {
  const nextRound = roundIndex + 1;
  if (nextRound >= rounds.length) return rounds; // final — no next round
  const nextMatchupIndex = Math.floor(matchupIndex / 2);
  const isTop = matchupIndex % 2 === 0;
  const updated = rounds.map((r, ri) =>
    ri !== nextRound ? r : r.map((m, mi) =>
      mi !== nextMatchupIndex ? m : {
        ...m,
        topEntry: isTop ? winner : m.topEntry,
        bottomEntry: isTop ? m.bottomEntry : winner,
      }
    )
  );
  return updated;
}
```

### Pattern 6: Confetti Burst (CSS particles, no external library)
**What:** On tournament complete, render N absolutely-positioned divs with `confetti-particle` class and random positions/delays. Uses the existing `confetti-particle` / `confetti-fall` keyframe already in `index.css` (from wheel empty-state).
**When to use:** In `BracketWinner` when `bracketState.phase === "complete"`.
```typescript
// Source: confetti-particle pattern already exists in apps/web/src/index.css
const CONFETTI_COLORS = ["#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"];
const particles = Array.from({ length: 20 }, (_, i) => ({
  key: i,
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 0.6}s`,
  backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));
```

### Anti-Patterns to Avoid
- **Storing derived bracket display data in state:** Rounds are computed from `generateBracket()` once and stored as state. Don't recompute on every render.
- **Mutating rounds array directly:** Always return new array reference via `.map()` in `advanceWinner()` and `resolveMatchup()` — React state is immutable.
- **Triggering animation outside the hook:** Only the hook calls `setAnimating(true)`. Components add/remove CSS classes based on hook state, they don't trigger their own animation timers.
- **Animating byes:** Bye matchups auto-resolve instantly in `generateBracket()` — they should never trigger the VS animation. Check `matchup.isBye` before animating.
- **Forgetting to propagate bye winners at generation time:** Round 0 byes must have their winner set AND propagated to round 1 immediately during `startTournament()`, not deferred to a click.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Confetti particles | Custom physics engine | Existing `.confetti-particle` CSS class + `confetti-fall` keyframe already in index.css | Already implemented for wheel empty state |
| Crown icon | SVG from scratch | `Crown` from lucide-react | Already in the dependency tree |
| Modal / overlay | Custom dialog component | Already used pattern: fixed inset backdrop + absolute-positioned div (tutorial-modal pattern) | No new Radix Dialog needed |
| Shuffle/Fisher-Yates | Custom randomizer | Inline implementation (already used in use-wheel, use-teams, use-cards) | Trivial, don't introduce lodash |
| Horizontal scroll on mobile | Custom scroll library | Native `overflow-x-auto` with `scrollbar-none` class | Already used in the tab bar |
| Animation orchestration | framer-motion or react-spring | CSS keyframes in index.css + setTimeout for state transitions | Established project pattern |

**Key insight:** Zero new dependencies for this phase. Every building block (icons, animations, scroll, confetti, modals) already exists in the project.

---

## Runtime State Inventory

> Not applicable — this is a greenfield feature addition with no rename/refactor/migration component. No stored data, live service config, OS-registered state, secrets, or build artifacts are affected.

---

## Common Pitfalls

### Pitfall 1: Stale Closure in Animation Callback
**What goes wrong:** `onAnimationEnd` callback captures stale `rounds` state if not guarded with a ref.
**Why it happens:** The callback is created at render time; if the animation CSS completes and calls back into a stale closure, the winner propagation uses the wrong rounds array.
**How to avoid:** Use the `isAnimatingRef` + `pendingRef` double-ref guard pattern from `use-cards.ts` and `use-teams.ts`. Pre-determine the winner before starting the animation; store in `pendingWinnerRef.current`; apply in `onAnimationEnd`.
**Warning signs:** Winner cards appear but next round slots don't populate, or wrong winner advances.

### Pitfall 2: Bye Auto-Advancement on Tournament Start
**What goes wrong:** Byes in round 0 aren't advanced to round 1, leaving null slots in round 1.
**Why it happens:** `generateBracket()` sets `winnerId` on bye matchups but if round 1 slots aren't pre-populated at generation time, round 1 matchups have null entries.
**How to avoid:** After generating round 0, immediately call `advanceWinner()` for all bye matchups during `startTournament()` before setting state. Round 1 is then partially pre-populated before any user interaction.
**Warning signs:** Tournament starts but some round 1 cards show empty/null names.

### Pitfall 3: Even/Odd Propagation Bug
**What goes wrong:** Winner from matchup index `i` goes to wrong slot (top vs bottom) in the next round.
**Why it happens:** Off-by-one in the `isTop = matchupIndex % 2 === 0` calculation, or using wrong index.
**How to avoid:** Write a unit test for `advanceWinner` before implementing the hook. Test pairs: (round 0, matchup 0) → round 1, matchup 0, topEntry; (round 0, matchup 1) → round 1, matchup 0, bottomEntry; (round 0, matchup 2) → round 1, matchup 1, topEntry.
**Warning signs:** The wrong option advances, or both options appear in the same slot.

### Pitfall 4: TabId Type Not Updated
**What goes wrong:** TypeScript error or runtime fallback to wrong history when `activeTab === "bracket"`.
**Why it happens:** `types.ts` exports `TabId` as a union, and `randomizer.tsx` uses `historyMap[activeTab]` — if "bracket" is not in the union or map, fallback to empty array silently fails.
**How to avoid:** Update `TabId` in `types.ts` to include `"bracket"`. Add `bracket: bracketHistory` to `historyMap` in `randomizer.tsx`. Add `else if (activeTab === "bracket")` in `handleClearHistory`. This is the Phase 8 (cards) pattern from `STATE.md`.
**Warning signs:** History panel shows blank for bracket tab, or TypeScript lint error on TabId assignment.

### Pitfall 5: Progressive Reveal Column Width Jank
**What goes wrong:** The bracket layout shifts as new columns reveal, causing the already-visible columns to jump left/right.
**Why it happens:** Using flexbox without fixed column widths — each column being added changes the flex container distribution.
**How to avoid:** Use a fixed-width column layout (`flex-shrink-0` with explicit `w-[NNpx]` per column). The horizontal scroll container (`overflow-x-auto`) absorbs the growing width without reflowing existing columns.
**Warning signs:** Round 1 cards visibly shift position when round 2 column appears.

### Pitfall 6: Judge Mode Interaction During Animation
**What goes wrong:** User clicks both options rapidly during the VS shake animation, triggering double-resolution.
**Why it happens:** Judge mode renders clickable option rows; if `animating` state isn't checked before allowing clicks, two clicks can fire.
**How to avoid:** Disable click handlers on option rows when `bracketState.phase === "playing" && bracketState.animating`. Add `disabled` or `pointer-events-none` to option rows during animation.
**Warning signs:** Tournament skips rounds or crashes with array out-of-bounds.

---

## Code Examples

### Bracket Tab Wiring (follows TeamsTab / CardsTab pattern)
```typescript
// Source: apps/web/src/components/randomizer/teams/teams-tab.tsx pattern
export function BracketTab({ onHistoryChange }: BracketTabProps) {
  const bracket = useBracket();

  useEffect(() => {
    onHistoryChange(bracket.history);
  }, [bracket.history, onHistoryChange]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
      <TutorialButton toolName="Bracket Tournament" accentColor="#eab308" steps={bracketTutorial} />
      {bracket.bracketState.phase === "entry" && (
        <BracketEntry
          entries={bracket.entries}
          onAddEntry={bracket.addEntry}
          onSetEntries={bracket.setEntries}
          onStart={bracket.startTournament}
          mode={bracket.mode}
          onSetMode={bracket.setMode}
          disabled={false}
        />
      )}
      {bracket.bracketState.phase === "playing" && (
        <BracketDisplay
          rounds={bracket.bracketState.rounds}
          activeMatchupId={bracket.bracketState.activeMatchupId}
          animating={bracket.bracketState.animating}
          mode={bracket.mode}
          onResolve={bracket.resolveMatchup}
          onAnimationEnd={bracket.onAnimationEnd}
        />
      )}
      {bracket.bracketState.phase === "complete" && (
        <BracketWinner
          winnerId={bracket.bracketState.winnerId}
          entries={bracket.entries}
          onReset={bracket.resetBracket}
        />
      )}
    </div>
  );
}
```

### Tab Registration (follows cards pattern in randomizer.tsx)
```typescript
// Source: apps/web/src/routes/randomizer.tsx
// 1. Add to tabs array:
{ value: "bracket", icon: Trophy, label: "Bracket", accent: "data-[state=active]:border-bracket-accent data-[state=active]:text-bracket-accent" },

// 2. Add accent colors to bgAccentMap and dotAccentMap:
bracket: "from-yellow-50 via-background to-amber-50/50",  // bgAccentMap
bracket: "text-yellow-200/40",                             // dotAccentMap

// 3. Add to historyMap:
bracket: bracketHistory,

// 4. Add to handleClearHistory:
else if (activeTab === "bracket") setBracketHistory([]);

// 5. Add bracket accent token to index.css @theme inline block:
--color-bracket-accent: oklch(0.72 0.18 85);  // yellow-ish to match Trophy icon
```

### History Entry Format
```typescript
// Source: follows use-teams.ts label pattern
// Log completed tournament as: "Winner: [name] (4 rounds, 8 entrants)"
const entry: HistoryEntry = {
  id: nextIdRef.current++,
  label: `Winner: ${winnerName} (${rounds.length} rounds, ${entrantCount} entrants)`,
  timestamp: Date.now(),
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| motion/framer-motion for animations | CSS keyframes in index.css | Phase 02 decision | No motion library for CSS-only animations |
| Global history in route component | Hook-local history, synced up via useEffect + onHistoryChange prop | Phase 01 | Keeps hook self-contained |
| Custom scroll components | Native overflow-x-auto + scrollbar-none | Phase 07 (tabs) | No new scroll library |

**Deprecated/outdated:**
- `framer-motion` package name: Project uses `motion@^12.37.0` (the `animate()` imperative API, not hooks). But bracket needs no motion library — pure CSS.

---

## Open Questions

1. **BRKT requirement IDs not in REQUIREMENTS.md**
   - What we know: ROADMAP.md references BRKT-01 through BRKT-06 but they aren't yet written in REQUIREMENTS.md.
   - What's unclear: Whether requirements need to be formally added before planning proceeds.
   - Recommendation: The planner should add BRKT-01 through BRKT-06 to REQUIREMENTS.md as the first task in Wave 0, derived from CONTEXT.md decisions. The requirements map in this document is authoritative enough to proceed with planning.

2. **Connector lines between rounds**
   - What we know: D-01 specifies horizontal tree layout. Claude's discretion covers connector line style.
   - What's unclear: Whether SVG or CSS border-based lines work better for the progressive reveal (SVG needs known dimensions; CSS borders can work with flexbox).
   - Recommendation: Use CSS-only connector lines (right border + pseudo-elements) rather than SVG to avoid needing to know the final bracket height at render time. This is simpler and works with progressive column reveal.

3. **Animation timing for 2-round vs 4-round brackets**
   - What we know: VS animation has user-controlled pacing (click per matchup, D-05).
   - What's unclear: Whether a single ANIMATION_DURATION constant covers all bracket sizes or if larger brackets need shorter animations to keep momentum.
   - Recommendation: Use a single `ANIMATION_DURATION = 1200ms` (shake 600ms + flash 600ms). Since pacing is click-driven (D-05), total time scales with user click speed, not animation duration.

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — all required capabilities are in the existing installed package tree).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 + @testing-library/react |
| Config file | `apps/web/vitest.config.ts` |
| Quick run command | `pnpm --filter @base-project/web test --run src/lib/randomizer/use-bracket.test.ts` |
| Full suite command | `pnpm --filter @base-project/web test --run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BRKT-01 | Entry state accepts names, dual input parses correctly | unit | `pnpm --filter @base-project/web test --run src/lib/randomizer/use-bracket.test.ts` | Wave 0 |
| BRKT-02 | generateBracket() produces correct round count, bye count, and winner propagation | unit | `pnpm --filter @base-project/web test --run src/lib/randomizer/use-bracket.test.ts` | Wave 0 |
| BRKT-03 | BracketTab renders without crash; rounds columns present | smoke | `pnpm --filter @base-project/web test --run src/components/randomizer/bracket/bracket-tab.test.tsx` | Wave 0 |
| BRKT-04 | VS animation class applied to matchup during animation state | unit | `pnpm --filter @base-project/web test --run src/lib/randomizer/use-bracket.test.ts` | Wave 0 |
| BRKT-05 | Random mode auto-resolves; Judge mode waits for user click | unit | `pnpm --filter @base-project/web test --run src/lib/randomizer/use-bracket.test.ts` | Wave 0 |
| BRKT-06 | Complete state reached; history entry logged with winner name | unit | `pnpm --filter @base-project/web test --run src/lib/randomizer/use-bracket.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm --filter @base-project/web test --run src/lib/randomizer/use-bracket.test.ts`
- **Per wave merge:** `pnpm --filter @base-project/web test --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/web/src/lib/randomizer/use-bracket.test.ts` — covers BRKT-01, BRKT-02, BRKT-04, BRKT-05, BRKT-06
- [ ] `apps/web/src/components/randomizer/bracket/bracket-tab.test.tsx` — covers BRKT-03

*(Existing test infrastructure and vitest.config.ts already cover all other setup needs — no new framework config or shared fixtures needed.)*

---

## Project Constraints (from CLAUDE.md)

Directives the planner MUST verify compliance with:

| Directive | Impact on Phase |
|-----------|----------------|
| **Client-side only** — no API calls | All bracket logic in hook, no server calls |
| **Must use React + Tailwind + Shadcn** — no new UI frameworks | No new UI libraries; use existing Button, Card primitives |
| **Animations: CSS/JS only, not GIF/video** | VS animation via CSS keyframes in index.css |
| **kebab-case filenames** | `use-bracket.ts`, `bracket-tab.tsx`, `bracket-display.tsx`, `bracket-match.tsx` etc. |
| **camelCase functions, PascalCase types** | `useBracket`, `generateBracket`, `BracketEntry`, `Matchup`, `BracketState` |
| **Named exports** (default only for factory/app creators) | All components and hook use named exports |
| **2-space indentation, double quotes, semicolons** | Follow existing code style |
| **GSD workflow enforcement** — no direct edits outside a GSD command | Plans required before implementation |
| **Vitest for tests** — co-located `.test.ts` files | `use-bracket.test.ts` co-located with `use-bracket.ts` |
| **`motion@^12.37.0`** — correct package for wheel animation | Bracket uses CSS keyframes only, no motion library needed |
| **Hook pattern** — each tool has `use-{tool}.ts` hook + `components/randomizer/{tool}/` folder | `use-bracket.ts` + `components/randomizer/bracket/` |

---

## Sources

### Primary (HIGH confidence)
- `apps/web/src/lib/randomizer/use-cards.ts` — double-ref guard pattern, pre-determine before animation
- `apps/web/src/lib/randomizer/use-teams.ts` — dual entry (textarea + parsed array), history pattern
- `apps/web/src/routes/randomizer.tsx` — tab registration pattern, historyMap, accent color maps
- `apps/web/src/index.css` — all CSS animation patterns (keyframes, will-change, perspective)
- `apps/web/src/components/randomizer/cards/cards-tab.test.tsx` — vi.hoisted() mock pattern for hook
- `apps/web/vitest.config.ts` — test configuration, jsdom environment

### Secondary (MEDIUM confidence)
- `.planning/phases/09-bracket-tournament/09-CONTEXT.md` — locked user decisions
- `.planning/STATE.md` — accumulated project patterns and decisions
- CLAUDE.md — project-wide constraints and conventions

### Tertiary (LOW confidence)
- None — all findings verified from first-party source code

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json and existing imports
- Architecture: HIGH — derived directly from existing hook/component patterns in codebase
- Bracket algorithm: HIGH — pure math, no external dependency, verified against D-08/D-09 constraints
- Pitfalls: HIGH — derived from STATE.md accumulated decisions and existing code patterns
- CSS animations: HIGH — derived from existing index.css patterns

**Research date:** 2026-03-27
**Valid until:** 2026-06-27 (stable stack, no moving dependencies)
