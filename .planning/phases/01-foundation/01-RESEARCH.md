# Phase 1: Foundation - Research

**Researched:** 2026-03-26
**Domain:** TanStack Router file-based routing, Shadcn Tabs (Radix UI), Tailwind CSS v4, localStorage hooks, React component architecture
**Confidence:** HIGH

## Summary

Phase 1 builds the complete app shell for the randomizer toolkit: a standalone `/randomizer` route (no sidebar), a tabbed interface with Wheel/Dice/Coin panels using Shadcn Tabs, a split desktop layout (tool left, history right), and a shared result history list component. No tool-specific logic ships in this phase — Dice and Coin tabs show greyed-out placeholder UIs.

The existing codebase already has all the foundations needed: TanStack Router for file-based routing, Shadcn + Radix UI for components, Tailwind CSS v4 with `@theme inline` for custom tokens, Lucide icons (already in use throughout), and existing Card/Button/Separator components that the layout directly reuses. The only new dependency is the Shadcn Tabs component, which is not yet installed and must be added via `pnpm dlx shadcn@latest add tabs` from the `apps/web` directory.

State management for history is pure React `useState` — no library needed. History max length of 50 entries per tab is a sensible default (covers long sessions without UI degradation). A "Clear history" button is the right clear behavior. The mobile toggle for the history panel uses `useState` with a Button and conditional Tailwind classes.

**Primary recommendation:** Add the Shadcn Tabs component, create `apps/web/src/routes/randomizer.tsx` as a flat (non-authenticated) route, and compose the layout from existing Card/Button/Separator primitives.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Tabs use icon + text labels with underline indicator on active tab
- **D-02:** Icons per tab: Wheel, Dice, Coin (emoji or Lucide icons — Claude's call on which icon set)
- **D-03:** Split layout — tool area on the left, result history panel on the right
- **D-04:** On mobile, history collapses behind a toggle button so the tool gets full width
- **D-05:** Compact list format — small text rows, newest at top (e.g. "#3: Pepperoni" or "#7: 4+2+6=12")
- **D-06:** History max length and clear button behavior at Claude's discretion
- **D-07:** Unbuilt tool tabs (Dice, Coin in Phase 1) show placeholder UI with disabled/greyed-out controls — not just a "coming soon" message
- **D-08:** Each tool tab gets a distinct accent color (e.g. blue for Wheel, green for Dice, amber for Coin — exact colors at Claude's discretion)

### Claude's Discretion
- Page placement — recommendation: standalone route `/randomizer` without dashboard sidebar
- Page header — whether to include title/tagline above the tabs and what it says
- History max entries and clear button behavior
- Exact accent colors per tab
- Icon choice (emoji vs Lucide icons)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SHRD-01 | User sees a tabbed interface with three tools: Wheel, Dice, Coin | Shadcn Tabs (Radix UI) installed via `pnpm dlx shadcn@latest add tabs`; `TabsTrigger` with Lucide icons + text labels; `TabsContent` for each panel |
| SHRD-02 | User can view result history per tab (append-only, newest at top) | Per-tab `HistoryEntry[]` state in the page component; `unshift` or `[newEntry, ...prev]` for newest-first; passed as prop to shared `ResultHistory` component |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

The following directives are enforced and must not be violated during planning or implementation:

| Directive | Source | Implication |
|-----------|--------|-------------|
| Must use existing React + Tailwind + Shadcn setup — no new UI frameworks | CLAUDE.md Constraints | Do not add MUI, Chakra, etc. |
| All randomization logic client-side, no API calls | CLAUDE.md Constraints | No server state, no React Query for this feature |
| Animations must feel smooth and fun — CSS/JS, not GIF/video | CLAUDE.md Constraints | Phase 1 has no animations; note for downstream phases |
| kebab-case for all filenames | CONVENTIONS | `randomizer.tsx`, `result-history.tsx` |
| `type` keyword for TypeScript definitions (not `interface`) | CONVENTIONS | `type HistoryEntry = { ... }` |
| Double quotes only, semicolons required, 2-space indentation | CONVENTIONS | ESLint enforced |
| camelCase for function/variable names, PascalCase for types | CONVENTIONS | `ResultHistory`, `historyEntries`, `addHistoryEntry` |
| Named exports for most code, default exports only for factories | CONVENTIONS | Route component uses named `function` + exported `const Route` |
| Import path alias: `@base-project/web/...` | CONVENTIONS | `import { cn } from "@base-project/web/lib/utils"` |
| No new UI frameworks | CLAUDE.md | Shadcn + Radix UI only |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TanStack Router | 1.150.0 (installed) | File-based routing, `createFileRoute` | Project-standard; generates `routeTree.gen.ts` automatically |
| Shadcn Tabs | via `shadcn@3.7.0` (not yet installed) | Tab container, triggers, content panels | Project-standard component system; wraps Radix UI Tabs |
| @radix-ui/react-tabs | 1.1.13 (latest) | Headless tabs primitive under Shadcn | Pulled automatically when Shadcn Tabs is added |
| Tailwind CSS | 4.1.17 (installed) | Utility styling | Project-standard; v4 with `@theme inline` tokens |
| lucide-react | 0.562.0 (installed) | Tab icons (Wheel, Dice, Coin) | Already used throughout project; 562 icons available |
| React | 19.2.0 (installed) | UI rendering, `useState` for history | Project-standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Card, Button, Separator (Shadcn) | installed | Layout panels, mobile toggle, divider | Wrap tool area and history panel in Card; Button for history clear + mobile toggle |
| clsx + tailwind-merge (via `cn()`) | installed | Conditional Tailwind classes | Tab accent colors, mobile visibility toggle |
| class-variance-authority | 0.7.1 (installed) | Variant-based styling | If creating a variant-aware component (e.g. tab accent styles) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Shadcn Tabs | Custom `<div role="tablist">` | Hand-rolling loses a11y, keyboard nav, Radix state management — never hand-roll |
| Lucide icons | Emoji strings | Lucide scales and inherits color; emoji sizing is inconsistent across OS |
| `useState` per-tab history | `useReducer` | `useState` is simpler for append-only lists of this size; `useReducer` adds indirection with no benefit here |
| Standalone `/randomizer` route | Inside `/_authenticated` layout | Standalone avoids sidebar and auth guard — correct for a fun tool page |

**Installation:**
```bash
# From apps/web directory
pnpm dlx shadcn@latest add tabs
```

**Version verification:** `@radix-ui/react-tabs` latest is `1.1.13` (verified via `npm view` on 2026-03-26). `lucide-react` latest is `1.7.0` but project has `0.562.0` — do NOT upgrade; use installed version.

---

## Architecture Patterns

### Recommended Project Structure
```
apps/web/src/
├── routes/
│   └── randomizer.tsx          # Page route: createFileRoute("/randomizer")
├── components/
│   ├── ui/
│   │   └── tabs.tsx             # Added by: pnpm dlx shadcn@latest add tabs
│   └── result-history.tsx       # Shared history list component
└── lib/
    └── randomizer/
        └── types.ts             # HistoryEntry type, ToolTab type
```

### Pattern 1: Standalone TanStack Router Route (no auth guard)

**What:** A flat route file at `apps/web/src/routes/randomizer.tsx` that is a direct child of `__root.tsx`. TanStack Router's file-based plugin auto-generates the route tree entry.

**When to use:** For pages that should not be wrapped in the `_authenticated` layout (no sidebar, no header).

**Example:**
```typescript
// apps/web/src/routes/randomizer.tsx
// Source: existing pattern from apps/web/src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/randomizer")({
  component: RandomizerPage,
});

function RandomizerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ... */}
    </div>
  );
}
```

TanStack Router plugin detects this file and adds it to `routeTree.gen.ts` automatically on next `vite dev` run. No manual registration needed.

### Pattern 2: Shadcn Tabs with Icon + Text Triggers (D-01, D-02)

**What:** `TabsList` with `TabsTrigger` containing a Lucide icon and label text. `variant="line"` on `TabsList` gives the underline indicator style locked by D-01.

**When to use:** Whenever the Shadcn Tabs component is used in this project for this feature.

**Example:**
```typescript
// Source: https://ui.shadcn.com/docs/components/tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@base-project/web/components/ui/tabs";
import { RotateCcw, Dices, Coins } from "lucide-react";

<Tabs defaultValue="wheel" className="w-full">
  <TabsList variant="line">
    <TabsTrigger value="wheel" className="gap-1.5">
      <RotateCcw className="h-4 w-4" />
      Wheel
    </TabsTrigger>
    <TabsTrigger value="dice" className="gap-1.5">
      <Dices className="h-4 w-4" />
      Dice
    </TabsTrigger>
    <TabsTrigger value="coin" className="gap-1.5">
      <Coins className="h-4 w-4" />
      Coin
    </TabsTrigger>
  </TabsList>

  <TabsContent value="wheel">
    {/* Wheel tool area */}
  </TabsContent>
  <TabsContent value="dice">
    {/* Placeholder */}
  </TabsContent>
  <TabsContent value="coin">
    {/* Placeholder */}
  </TabsContent>
</Tabs>
```

**Note on icon names:** Lucide 0.562.0 icon names to verify at implementation time — `RotateCcw`, `Dices`, `Coins` are present in the installed version. If any are absent, fall back to `Circle`, `Square`, `Hexagon` or similar geometric stand-ins.

### Pattern 3: Split Layout with Mobile History Toggle (D-03, D-04)

**What:** Flexbox row on desktop; stacked on mobile with history panel conditionally shown via `useState`.

**Example:**
```typescript
// Source: pattern derived from _authenticated.tsx layout
import { useState } from "react";
import { Button } from "@base-project/web/components/ui/button";
import { History } from "lucide-react";

function RandomizerLayout({ children, historyPanel }: {
  children: React.ReactNode;
  historyPanel: React.ReactNode;
}) {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      {/* Tool area — full width on mobile, 2/3 on desktop */}
      <div className="flex-1 min-w-0">
        {/* Mobile toggle */}
        <div className="flex justify-end mb-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryOpen(!historyOpen)}
          >
            <History className="h-4 w-4" />
            History
          </Button>
        </div>
        {children}
      </div>

      {/* History panel — always visible on desktop, toggled on mobile */}
      <div className={cn(
        "w-full md:w-64 shrink-0",
        historyOpen ? "block" : "hidden md:block"
      )}>
        {historyPanel}
      </div>
    </div>
  );
}
```

### Pattern 4: Per-Tab History State (SHRD-02)

**What:** Each tab maintains its own `HistoryEntry[]` in the page-level component. State is lifted to the page so switching tabs preserves history.

**When to use:** Always for this feature — history must survive tab switches and be passed down to both the tool component and the `ResultHistory` component.

**Example:**
```typescript
// Source: standard React patterns
import { useState } from "react";

type HistoryEntry = {
  id: number;
  label: string;
  timestamp: number;
};

type TabId = "wheel" | "dice" | "coin";

// In page component:
const [wheelHistory, setWheelHistory] = useState<HistoryEntry[]>([]);
const [diceHistory, setDiceHistory] = useState<HistoryEntry[]>([]);
const [coinHistory, setCoinHistory] = useState<HistoryEntry[]>([]);

const MAX_HISTORY = 50;

function addToHistory(setter: React.Dispatch<React.SetStateAction<HistoryEntry[]>>, label: string) {
  setter(prev => {
    const entry: HistoryEntry = {
      id: prev.length + 1,
      label,
      timestamp: Date.now(),
    };
    return [entry, ...prev].slice(0, MAX_HISTORY);
  });
}
```

### Pattern 5: ResultHistory Shared Component

**What:** A reusable presentational component that renders a list of `HistoryEntry` items (newest first, already sorted by caller) with a clear button.

**Example:**
```typescript
// apps/web/src/components/result-history.tsx
import { Button } from "@base-project/web/components/ui/button";
import { cn } from "@base-project/web/lib/utils";

type HistoryEntry = {
  id: number;
  label: string;
};

type ResultHistoryProps = {
  entries: HistoryEntry[];
  onClear: () => void;
  className?: string;
};

export function ResultHistory({ entries, onClear, className }: ResultHistoryProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">History</span>
        {entries.length > 0 && (
          <Button variant="ghost" size="xs" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No results yet</p>
      ) : (
        <ul className="space-y-0.5">
          {entries.map((entry) => (
            <li key={entry.id} className="text-xs text-foreground py-1 px-2 rounded hover:bg-muted/50">
              <span className="text-muted-foreground mr-1">#{entry.id}</span>
              {entry.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Pattern 6: Placeholder Tool Panel (D-07)

**What:** Unbuilt tabs show a realistic but fully disabled UI skeleton — not just text.

**Example:**
```typescript
// Dice placeholder — greyed out controls
function DicePlaceholder() {
  return (
    <div className="opacity-50 pointer-events-none space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="h-12 w-12 rounded-lg border-2 border-border bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
            {n}
          </div>
        ))}
      </div>
      <Button disabled className="w-full">Roll Dice</Button>
    </div>
  );
}
```

### Pattern 7: Per-Tab Accent Colors (D-08)

**What:** Each tab content area uses a distinct accent color. Applied via CSS custom properties or Tailwind `data-*` attributes.

**Recommendation (Claude's discretion):**
- Wheel: blue — `oklch(0.55 0.18 240)` — communicates spin/motion
- Dice: green — `oklch(0.55 0.15 145)` — communicates chance/go
- Coin: amber — `oklch(0.72 0.15 80)` — communicates gold/coin

Implementation: add per-tab CSS vars to `index.css` `@theme inline` block, then reference as `bg-[--wheel-accent]` etc. Or use inline Tailwind arbitrary values — simpler for Phase 1 since accent is subtle.

### Anti-Patterns to Avoid
- **Registering the route manually:** TanStack Router's Vite plugin auto-generates `routeTree.gen.ts`. Never edit that file manually.
- **Nesting randomizer under `/_authenticated`:** This forces the dashboard sidebar and auth guard. Create `randomizer.tsx` at top level.
- **Putting history state inside the `ResultHistory` component:** History must live in the page (or a context) so tab switching preserves it.
- **Calling `shadcn add` from the repo root:** The `components.json` is at `apps/web/components.json`; run the command from `apps/web/` or pass `--cwd apps/web`.
- **Using `interface` keyword for type definitions:** Project convention is `type` keyword only.
- **Importing with `@/components/...`:** The project alias is `@base-project/web/components/...`. The `components.json` uses `@/` as the Shadcn alias but this is for the Shadcn CLI only — actual runtime imports use `@base-project/web/`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible tabs | Custom `<div role="tablist">` with keyboard nav | Shadcn Tabs (Radix UI) | Keyboard navigation (arrows, Home/End), focus management, ARIA attributes — all provided by Radix; hand-rolling is a16y minefield |
| Tab underline indicator | CSS `::after` pseudo-element hack | `variant="line"` on Shadcn `TabsList` | Shadcn provides this variant; avoids fragile CSS positioning |
| Conditional classnames | `classnames` or ternary string concat | `cn()` from `@base-project/web/lib/utils` | Already in codebase; handles Tailwind merge conflicts |
| Icon set | Download SVGs manually | `lucide-react` (already installed) | 562 icons, consistent size/color API, tree-shakeable |

**Key insight:** The entire tab interaction layer (keyboard, mouse, touch, ARIA, focus ring) is solved by Radix UI. The only custom code needed is the layout wiring and the history state.

---

## Common Pitfalls

### Pitfall 1: Shadcn Tabs install cwd
**What goes wrong:** Running `pnpm dlx shadcn@latest add tabs` from the repo root writes files to the wrong location.
**Why it happens:** `components.json` at `apps/web/components.json` — Shadcn CLI looks for it relative to cwd.
**How to avoid:** `cd apps/web && pnpm dlx shadcn@latest add tabs` — or from monorepo root: `pnpm --filter @base-project/web dlx shadcn@latest add tabs`
**Warning signs:** Component written to `./src/components/ui/tabs.tsx` instead of `apps/web/src/components/ui/tabs.tsx`.

### Pitfall 2: routeTree.gen.ts not updating
**What goes wrong:** New route file exists but app still 404s on `/randomizer`.
**Why it happens:** `routeTree.gen.ts` is generated on dev server start or file save when the Vite plugin is active. If the dev server was not restarted, the file may not have regenerated.
**How to avoid:** After creating `randomizer.tsx`, verify `routeTree.gen.ts` contains the new route. If not, restart `pnpm dev`.
**Warning signs:** TypeScript error "Argument of type '/randomizer' is not assignable" on `createFileRoute`.

### Pitfall 3: History state inside tab content components
**What goes wrong:** Each tab has its own history state — switching tabs resets it.
**Why it happens:** React state is local to a component instance; `TabsContent` unmounts inactive panels by default.
**How to avoid:** Lift all three history arrays to the `RandomizerPage` component. Pass `entries` and `onClear` as props to `ResultHistory`.
**Warning signs:** History disappears when switching between tabs.

### Pitfall 4: `forceMount` on TabsContent causing layout issues
**What goes wrong:** If `forceMount` is used on `TabsContent`, all three panels render simultaneously and may affect height/layout.
**Why it happens:** `forceMount` keeps content in DOM for animation purposes.
**How to avoid:** Do NOT use `forceMount` in Phase 1 — default unmounting behavior is correct. (Only relevant for Phase 2 if animation libraries need the canvas mounted early.)
**Warning signs:** All three tool panels are visible stacked vertically.

### Pitfall 5: Tailwind CSS v4 custom token syntax
**What goes wrong:** Defining custom colors with `tailwind.config.js` `extend.colors` — no such file in this project.
**Why it happens:** Project uses Tailwind CSS v4 with `@theme inline` block in `index.css` — not a `tailwind.config.js`.
**How to avoid:** Add per-tab accent colors to the `@theme inline` block in `apps/web/src/index.css`, e.g. `--color-wheel-accent: oklch(0.55 0.18 240);`. Reference in classes as `bg-wheel-accent`, `text-wheel-accent`, etc.
**Warning signs:** Custom color class not being applied; Tailwind does not generate utility for the custom token.

### Pitfall 6: Import alias mismatch
**What goes wrong:** Importing `from "@/components/ui/tabs"` works in `components.json` references but fails at runtime.
**Why it happens:** Vite alias is `@base-project/web` → `./src`, not `@` → `./src`.
**How to avoid:** Always import as `from "@base-project/web/components/ui/tabs"`. The `@/` alias appears only in Shadcn CLI config, not in Vite.
**Warning signs:** TypeScript "cannot find module '@/components/...'" error.

---

## Code Examples

Verified patterns from official sources and existing codebase:

### TanStack Router — standalone route
```typescript
// Source: pattern from apps/web/src/routes/index.tsx (existing codebase)
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/randomizer")({
  component: RandomizerPage,
});

function RandomizerPage() {
  // ...
}
```

### Shadcn Tabs — line variant with icons
```typescript
// Source: https://ui.shadcn.com/docs/components/tabs
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@base-project/web/components/ui/tabs";

<Tabs defaultValue="wheel">
  <TabsList variant="line">
    <TabsTrigger value="wheel" className="gap-1.5">
      <RotateCcw className="h-4 w-4" />
      Wheel
    </TabsTrigger>
    <TabsTrigger value="dice" className="gap-1.5" disabled>
      <Dices className="h-4 w-4" />
      Dice
    </TabsTrigger>
  </TabsList>
  <TabsContent value="wheel">...</TabsContent>
  <TabsContent value="dice">...</TabsContent>
</Tabs>
```

### Tailwind CSS v4 — adding custom tokens
```css
/* Source: apps/web/src/index.css (existing codebase pattern) */
@theme inline {
  /* existing tokens ... */
  --color-wheel-accent: oklch(0.55 0.18 240);
  --color-dice-accent: oklch(0.55 0.15 145);
  --color-coin-accent: oklch(0.72 0.15 80);
}
```

### History newest-first append
```typescript
// Source: standard React immutable state update
const MAX_HISTORY = 50;

const addEntry = (label: string) => {
  setHistory(prev => {
    const entry: HistoryEntry = { id: prev.length + 1, label, timestamp: Date.now() };
    return [entry, ...prev].slice(0, MAX_HISTORY);
  });
};
```

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | pnpm / vite | Yes | v24.12.0 | — |
| pnpm | Package manager | Yes | 10.5.2 | — |
| Shadcn CLI (dlx) | Installing Tabs component | Yes (via pnpm dlx) | 3.7.0 | Manually write the component |
| lucide-react | Tab icons | Yes (installed) | 0.562.0 | Use emoji fallbacks |
| @tanstack/react-router | Routing | Yes (installed) | 1.150.0 | — |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:**
- `@radix-ui/react-tabs` — not yet installed; pulled automatically by `pnpm dlx shadcn@latest add tabs`. If Shadcn CLI fails: manually install with `pnpm add @radix-ui/react-tabs@1.1.13` and write the wrapper component.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 (installed in `apps/api`; no web vitest config exists) |
| Config file | None in `apps/web` — Wave 0 must create `apps/web/vitest.config.ts` |
| Quick run command | `pnpm --filter @base-project/web test` (after config is created) |
| Full suite command | `pnpm --filter @base-project/web test --run` |

**Note:** `apps/web` has no Vitest configuration or test files. The API vitest config uses `@cloudflare/vitest-pool-workers` which is backend-specific and cannot be reused for React component tests. Phase 1 will need a separate web vitest config with `@vitejs/plugin-react` and `jsdom` environment.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SHRD-01 | Tabbed interface renders with three tabs (Wheel, Dice, Coin) | unit | `pnpm --filter @base-project/web test --run src/routes/randomizer.test.tsx` | Wave 0 |
| SHRD-01 | Clicking each tab shows correct panel without page reload | unit | same file | Wave 0 |
| SHRD-02 | History list renders entries newest-first | unit | `pnpm --filter @base-project/web test --run src/components/result-history.test.tsx` | Wave 0 |
| SHRD-02 | History displays correctly formatted entries | unit | same file | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm --filter @base-project/web test --run`
- **Per wave merge:** `pnpm --filter @base-project/web test --run`
- **Phase gate:** All tests green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `apps/web/vitest.config.ts` — Vitest config with jsdom environment for React components
- [ ] `apps/web/src/routes/randomizer.test.tsx` — covers SHRD-01 tab rendering and switching
- [ ] `apps/web/src/components/result-history.test.tsx` — covers SHRD-02 history display
- [ ] Install test deps: `pnpm --filter @base-project/web add -D vitest @testing-library/react @testing-library/jest-dom jsdom`

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` extend.colors | `@theme inline` block in CSS | Tailwind v4 (2024) | Custom color tokens defined in CSS, not JS config |
| `framer-motion` package name | `motion` package name | 2024 (Framer Motion v11+) | STATE.md explicitly notes: use `motion@^12.37.0`, NOT `framer-motion` |
| `interface` keyword in React props | `type` keyword | Project convention | Enforced by project ESLint config |
| `@tanstack/react-router` v0.x file conventions | v1.x `createFileRoute` with path in call | TanStack Router 1.x | Route path is the string arg to `createFileRoute`, not derived from filename alone |

**Deprecated/outdated:**
- `tailwind.config.js`: Not present in this project. Do not create one. All customization goes in `index.css`.
- `framer-motion` package name: STATE.md explicitly marks this deprecated. The correct package is `motion` (though Phase 1 has no animations).
- `interface` for React props: project convention forbids it. Use `type`.

---

## Open Questions

1. **Lucide icon availability for Wheel/Dice/Coin in version 0.562.0**
   - What we know: `lucide-react@0.562.0` is installed. `Dices` and `Coins` icons are common.
   - What's unclear: Exact icon names available in this specific version vs. latest (1.7.0).
   - Recommendation: At implementation time, verify by importing — if an icon doesn't exist, pick the closest geometric alternative (`CircleDot`, `Square`, `Circle`). Do not upgrade lucide-react.

2. **Shadcn Tabs `variant="line"` availability in this project's Shadcn version**
   - What we know: The Shadcn docs show `variant="line"` on `TabsList`. The project uses `shadcn@3.7.0`.
   - What's unclear: Whether the generated `tabs.tsx` in this project's Shadcn style (`radix-vega`) includes the `line` variant.
   - Recommendation: After running `pnpm dlx shadcn@latest add tabs`, inspect the generated `tabs.tsx` to confirm variant support. If absent, the underline indicator (D-01) can be added via a custom CVA variant on `TabsList`.

---

## Sources

### Primary (HIGH confidence)
- Existing codebase (`apps/web/src/routes/`, `apps/web/src/components/ui/`, `apps/web/src/index.css`) — patterns, aliases, Tailwind token format confirmed by direct file reading
- `apps/web/components.json` — Shadcn config, style name, icon library, aliases
- `apps/web/package.json` — exact installed versions confirmed
- `apps/web/vite.config.ts` — alias and plugin configuration confirmed

### Secondary (MEDIUM confidence)
- `https://ui.shadcn.com/docs/components/tabs` — install command, component API, `variant="line"` (fetched 2026-03-26)
- `https://www.radix-ui.com/primitives/docs/components/tabs` — full Radix Tabs API (fetched 2026-03-26)
- `npm view @radix-ui/react-tabs version` → `1.1.13` (verified 2026-03-26)

### Tertiary (LOW confidence)
- Lucide icon name availability (`Dices`, `Coins`, `RotateCcw`) in version 0.562.0 — assumed present based on naming conventions but not verified against package source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified from `package.json` and `npm view`
- Architecture: HIGH — routing and component patterns confirmed from existing source files
- Pitfalls: HIGH — derived from concrete codebase facts (alias config, CSS token format, router gen file)
- Lucide icon names: LOW — need runtime verification at implementation time

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (stable libraries; Shadcn CLI output may vary but is easily inspected post-install)
