---
phase: quick
plan: 260328-ifb
type: execute
wave: 1
depends_on: []
files_modified:
  - apps/web/src/components/randomizer/bracket/bracket-display.tsx
  - apps/web/src/index.css
autonomous: false
must_haves:
  truths:
    - "Each next-round matchup sits vertically centered between the two feeder matchups from the previous round"
    - "Connector lines visually link feeder matchups to their next-round matchup"
    - "Bracket reads left-to-right with increasing vertical spacing per round"
    - "Bye matchups still render correctly in the tree layout"
  artifacts:
    - path: "apps/web/src/components/randomizer/bracket/bracket-display.tsx"
      provides: "CSS Grid tree layout with connector lines"
    - path: "apps/web/src/index.css"
      provides: "Bracket connector line styles"
  key_links:
    - from: "bracket-display.tsx"
      to: "bracket-match.tsx"
      via: "BracketMatch component rendered per grid cell"
      pattern: "<BracketMatch"
---

<objective>
Fix bracket layout to use classic single-elimination tree centering. Each next-round matchup must sit vertically centered between the two matchups that feed into it, with connector lines between rounds and more vertical gap between matchups.

Purpose: The current layout stacks all matchups top-aligned with `flex-col gap-4`. A proper bracket should visually show the tree structure — Round 2 matchups centered between their two Round 1 feeders, finals centered between the two semis, etc.

Output: Updated bracket-display.tsx with grid-based tree layout and connector lines in CSS.
</objective>

<execution_context>
@/Users/khaif/Documents/code-repo/randomizer-toolkit/.claude/get-shit-done/workflows/execute-plan.md
@/Users/khaif/Documents/code-repo/randomizer-toolkit/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@apps/web/src/components/randomizer/bracket/bracket-display.tsx
@apps/web/src/components/randomizer/bracket/bracket-match.tsx
@apps/web/src/index.css

<interfaces>
From apps/web/src/lib/randomizer/use-bracket.ts:
```typescript
export type Matchup = {
  id: string; // "r{round}-m{index}"
  topEntry: BracketEntry | null;
  bottomEntry: BracketEntry | null;
  winnerId: number | null;
  isBye: boolean;
};

export type BracketState =
  | { phase: "entry" }
  | { phase: "playing"; rounds: Matchup[][]; activeMatchupId: string | null; animating: boolean }
  | { phase: "complete"; winnerId: number };
```

From bracket-display.tsx (current props — keep this interface identical):
```typescript
type BracketDisplayProps = {
  rounds: Matchup[][];
  activeMatchupId: string | null;
  animating: boolean;
  mode: "random" | "judge";
  onTrigger: () => void;
  onResolve: (matchupId: string, winnerId: number) => void;
  onAnimationEnd: (matchupId: string) => void;
};
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite BracketDisplay with CSS Grid tree layout and connector lines</name>
  <files>apps/web/src/components/randomizer/bracket/bracket-display.tsx, apps/web/src/index.css</files>
  <action>
Rewrite the BracketDisplay component to produce a classic single-elimination bracket tree using CSS Grid.

**Layout strategy — CSS Grid with row-span doubling:**

The outer container is still `flex flex-row gap-0 overflow-x-auto` (rounds and connectors flow left to right — use gap-0 since connectors provide spacing). But WITHIN each round column, switch from `flex-col gap-4` to a CSS Grid approach where:

- Round 0 (first round): Each matchup occupies 1 row-span unit. Use `grid-template-rows: repeat(N, 1fr)` where N = number of matchups in round 0. Each matchup is placed in its own grid row, centered within it via `align-self: center`.
- Round 1: Each matchup occupies 2 row-span units (spans 2 grid rows), centered within that span. Grid still has N rows (same as round 0). Matchup 0 spans rows 1-2, matchup 1 spans rows 3-4, etc.
- Round 2: Each matchup occupies 4 row-span units. Matchup 0 spans rows 1-4, etc.
- General: Round R matchup M spans `2^R` rows, starting at row `M * 2^R + 1`.

All round columns share the same total grid height, derived from round 0 matchup count. Set a consistent row height (e.g., `gridTemplateRows: repeat(N, minmax(90px, 1fr))`) so the grid rows stay consistent. The first round dictates the total row count.

Implementation in bracket-display.tsx:

```tsx
const firstRoundCount = rounds[0].length; // e.g., 8, 4, 2

// Each round column wrapped in flex-col: badge on top, grid below
<div key={roundIndex} className="flex flex-col flex-shrink-0">
  {/* Round header Badge */}
  <div className="flex justify-center mb-2">
    <Badge variant="outline" className="text-xs text-muted-foreground">
      {roundIndex === totalRounds - 1 ? "Final" : `Round ${roundIndex + 1} of ${totalRounds}`}
    </Badge>
  </div>

  {/* Grid of matchups */}
  <div
    style={{
      display: "grid",
      gridTemplateRows: `repeat(${firstRoundCount}, minmax(90px, 1fr))`,
      width: "10rem",
    }}
  >
    {round.map((matchup, matchupIndex) => {
      const rowSpan = Math.pow(2, roundIndex);
      const rowStart = matchupIndex * rowSpan + 1;
      return (
        <div
          key={matchup.id}
          style={{ gridRow: `${rowStart} / span ${rowSpan}` }}
          className="flex items-center"
        >
          <BracketMatch ... />
        </div>
      );
    })}
  </div>
</div>
```

**Connector lines between rounds:**

Between each pair of revealed round columns, render a connector column. The connector column is also a CSS Grid with the same `gridTemplateRows: repeat(firstRoundCount, minmax(90px, 1fr))`. It has a top margin matching the badge height (add `mt-[calc(1.25rem+0.5rem)]` or similar to align with the matchup grids, not the badge).

For each matchup M in round R (where R > 0), the connector spans the same grid rows as that matchup: `gridRow: ${M * 2^R + 1} / span ${2^R}`.

Inside each connector cell, use absolute-positioned divs:
```tsx
<div className="bracket-connector">
  <div className="bracket-connector-vertical" />
  <div className="bracket-connector-stub-top" />
  <div className="bracket-connector-stub-bottom" />
  <div className="bracket-connector-right" />
</div>
```

The math for positioning within each connector cell:
- The cell spans 2^R grid rows. The two feeder matchups each occupy the top half and bottom half of this span.
- Feeder centers are at 25% and 75% of the cell height (always, at every depth).
- Vertical line: from 25% to 75% on the left side
- Top horizontal stub: at 25% height, extending full width left
- Bottom horizontal stub: at 75% height, extending full width left
- Right horizontal: at 50% height, extending full width right

**CSS in index.css (add after existing bracket styles):**
```css
.bracket-connector {
  position: relative;
  width: 2rem;
  height: 100%;
}

.bracket-connector-vertical {
  position: absolute;
  left: 0;
  top: 25%;
  bottom: 25%;
  width: 2px;
  background: var(--color-border);
}

.bracket-connector-stub-top {
  position: absolute;
  top: 25%;
  left: -1rem;
  width: calc(1rem + 1px);
  height: 2px;
  background: var(--color-border);
}

.bracket-connector-stub-bottom {
  position: absolute;
  bottom: 25%;
  left: -1rem;
  width: calc(1rem + 1px);
  height: 2px;
  background: var(--color-border);
}

.bracket-connector-right {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-border);
  transform: translateY(-1px);
}
```

The `left: -1rem` on stubs extends back into the previous round column to visually connect to the matchup cards. Adjust as needed — the goal is that stubs appear to start from the right edge of the feeder matchup cards.

**Connector rendering logic in bracket-display.tsx:**

After each revealed round (except the last revealed), check if the NEXT round is also revealed. If so, render a connector column. The connector column iterates over the next round's matchups and places connector cells at their grid positions.

```tsx
{/* After each round grid, optionally render connector */}
{roundIndex < revealedRounds.length - 1 && (
  <div
    className="flex-shrink-0"
    style={{
      display: "grid",
      gridTemplateRows: `repeat(${firstRoundCount}, minmax(90px, 1fr))`,
      width: "2rem",
      marginTop: "calc(1.25rem + 0.5rem)", // align with matchup grid, skip badge height
    }}
  >
    {revealedRounds[roundIndex + 1].round.map((matchup, matchupIndex) => {
      const nextRoundIndex = revealedRounds[roundIndex + 1].originalIndex;
      const rowSpan = Math.pow(2, nextRoundIndex);
      const rowStart = matchupIndex * rowSpan + 1;
      return (
        <div
          key={`conn-${matchup.id}`}
          style={{ gridRow: `${rowStart} / span ${rowSpan}` }}
          className="flex items-center"
        >
          <div className="bracket-connector">
            <div className="bracket-connector-vertical" />
            <div className="bracket-connector-stub-top" />
            <div className="bracket-connector-stub-bottom" />
            <div className="bracket-connector-right" />
          </div>
        </div>
      );
    })}
  </div>
)}
```

**Handling progressive reveal with connectors:**

Build a `revealedRounds` array that filters rounds by the existing `isRevealed` logic, preserving original round indices (needed for correct row-span calculation). Render round columns and connector columns only for revealed rounds.

```tsx
const revealedRounds = rounds
  .map((round, index) => ({ round, originalIndex: index }))
  .filter(({ originalIndex }) =>
    originalIndex === 0 || rounds[originalIndex - 1].every((m) => m.winnerId !== null)
  );
```

Then iterate `revealedRounds` for rendering, using `originalIndex` for row-span math.

**Do NOT change:**
- BracketMatch component (bracket-match.tsx) — leave untouched
- Props interface for BracketDisplay — keep identical
- Badge round labels — keep them
- Bye matchup handling — BracketMatch handles this internally, just place it in the grid correctly

**Edge case:** When there's only 1 round (2 entries), grid has 1 row, no connectors needed. The connector column rendering is naturally skipped since there's no next round.

**Edge case:** When `firstRoundCount` is 1 (only 1 matchup in round 0, e.g., 2 entries), the grid is just 1 row. This works fine — the single matchup fills the row.
  </action>
  <verify>
    <automated>cd /Users/khaif/Documents/code-repo/randomizer-toolkit && pnpm --filter @base-project/web build 2>&1 | tail -5</automated>
  </verify>
  <done>
    - Bracket rounds display left-to-right with CSS Grid per column
    - Round N+1 matchups are vertically centered between their two Round N feeder matchups
    - Connector lines visually link feeders to their next-round matchup
    - Build passes with no TypeScript errors
    - Bye matchups render correctly in the grid layout
    - Progressive reveal still works (later rounds hidden until previous rounds complete)
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Verify bracket tree layout visually</name>
  <files>apps/web/src/components/randomizer/bracket/bracket-display.tsx</files>
  <action>Present bracket for visual verification.</action>
  <verify>Human confirms layout is correct.</verify>
  <done>Visual verification complete.</done>
  <what-built>Classic single-elimination bracket tree layout with connector lines. Each next-round matchup is vertically centered between its two feeder matchups. Connector lines link rounds together.</what-built>
  <how-to-verify>
    1. Run `cd /Users/khaif/Documents/code-repo/randomizer-toolkit && pnpm dev` (if not already running)
    2. Open the app in browser, navigate to the Bracket tab
    3. Enter 4-8 names and start the bracket
    4. Verify:
       a. Round 1 matchups are evenly spaced vertically
       b. Round 2 matchups sit centered between their two Round 1 feeders
       c. If 8 entries: Round 3 (final) sits centered between the two Round 2 matchups
       d. Connector lines visibly link feeders to next-round matchups
       e. Clicking through matchups works — progressive reveal shows later rounds correctly
       f. Bye matchups (odd entry counts like 3, 5, 6) render properly in the tree
       g. Horizontal scroll works for large brackets
    5. Check on mobile viewport (narrow screen) — bracket should scroll horizontally
  </how-to-verify>
  <resume-signal>Type "approved" or describe issues</resume-signal>
</task>

</tasks>

<verification>
- `pnpm --filter @base-project/web build` succeeds
- Visual inspection confirms tree centering
- All existing bracket functionality (animations, progressive reveal, judge/random mode) still works
</verification>

<success_criteria>
- Bracket matchups form a classic elimination tree: each next-round matchup vertically centered between its two feeders
- Connector lines visually link rounds together
- More vertical gap between matchups than the previous gap-4 layout
- No regressions in bracket animations, interactions, or progressive reveal
</success_criteria>

<output>
After completion, create `.planning/quick/260328-ifb-fix-bracket-layout-classic-tree-centerin/260328-ifb-SUMMARY.md`
</output>
