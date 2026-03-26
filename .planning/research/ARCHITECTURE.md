# Architecture Research

**Domain:** Animated randomizer toolkit (spinning wheel, dice roller, coin flipper) in React SPA
**Researched:** 2026-03-26
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    apps/web/src/routes/                           │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │   _authenticated/randomizer.tsx   (TanStack Router page)  │    │
│  │   - Renders <RandomizerPage />                            │    │
│  │   - No loaders needed (client-only, no API calls)         │    │
│  └──────────────────────┬───────────────────────────────────┘    │
└─────────────────────────┼────────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│               apps/web/src/components/randomizer/                 │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                  RandomizerPage                            │   │
│  │  - Renders <Tabs> shell (Shadcn)                          │   │
│  │  - No state of its own; each tab is self-contained        │   │
│  └───────┬─────────────────┬────────────────────┬────────────┘   │
│          │                 │                    │                  │
│  ┌───────▼──────┐  ┌───────▼──────┐  ┌─────────▼─────┐          │
│  │  WheelTab    │  │   DiceTab    │  │   CoinTab     │          │
│  │  (container) │  │  (container) │  │  (container)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘          │
│         │                 │                  │                    │
│  ┌──────▼──────────────────▼──────────────────▼────────────────┐ │
│  │               Leaf / Primitive Components                    │ │
│  │                                                              │ │
│  │   WheelCanvas   DiceGrid   CoinGrid   ResultHistory          │ │
│  │   ItemList      Die        Coin       (shared)               │ │
│  │   WheelControls DiceControls CoinControls                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│               apps/web/src/lib/randomizer/                        │
│                                                                   │
│   Custom hooks (pure logic, no JSX):                             │
│   useWheel()   useDice()   useCoin()   useHistory()              │
│                                                                   │
│   Utilities:                                                      │
│   randomizer.ts   localStorage.ts                                │
└───────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|----------------|-------------------|
| `randomizer.tsx` (route) | TanStack Router entry point — renders `<RandomizerPage />` | Nothing; delegates immediately |
| `RandomizerPage` | Tab shell only — no state of its own | `WheelTab`, `DiceTab`, `CoinTab` via Shadcn `<Tabs>` |
| `WheelTab` | Orchestrates wheel state via `useWheel()` hook; wires controls to canvas | `WheelCanvas`, `ItemList`, `WheelControls`, `ResultHistory` |
| `DiceTab` | Orchestrates dice state via `useDice()` hook | `DiceGrid`, `DiceControls`, `ResultHistory` |
| `CoinTab` | Orchestrates coin state via `useCoin()` hook | `CoinGrid`, `CoinControls`, `ResultHistory` |
| `WheelCanvas` | Canvas/SVG rendering of the wheel; receives items + spin trigger as props | Reads from `useWheel()` via parent; emits `onSpinEnd` |
| `ItemList` | Editable list of wheel items (add/remove/reset) | Parent `WheelTab` via callback props |
| `Die` | Single die face — CSS 3D cube, animates on `rolling` prop | Parent `DiceGrid` |
| `DiceGrid` | Renders 1-6 `<Die>` instances | Parent `DiceTab` |
| `Coin` | Single coin — CSS 3D flip animation on `flipping` prop | Parent `CoinGrid` |
| `CoinGrid` | Renders 1-N `<Coin>` instances | Parent `CoinTab` |
| `ResultHistory` | Scrollable log of past results; receives `history` array as prop | All three tab containers |
| `useWheel()` | Items state, spin logic, localStorage sync, history append | Used only by `WheelTab` |
| `useDice()` | Dice count, roll logic, animation flag, history append | Used only by `DiceTab` |
| `useCoin()` | Coin count, flip logic, animation flag, history append | Used only by `CoinTab` |
| `useHistory()` | Generic result history array — append, clear | Used by each game hook |

## Recommended Project Structure

```
apps/web/src/
├── routes/
│   └── _authenticated/
│       └── randomizer.tsx          # TanStack Router route file
│
├── components/
│   └── randomizer/
│       ├── RandomizerPage.tsx      # Tab shell
│       ├── wheel/
│       │   ├── WheelTab.tsx        # State orchestrator
│       │   ├── WheelCanvas.tsx     # Canvas/SVG renderer
│       │   ├── ItemList.tsx        # Editable item list
│       │   └── WheelControls.tsx   # Spin button + reset
│       ├── dice/
│       │   ├── DiceTab.tsx         # State orchestrator
│       │   ├── DiceGrid.tsx        # Die layout
│       │   ├── Die.tsx             # Single die (CSS 3D)
│       │   └── DiceControls.tsx    # Roll button + count selector
│       ├── coin/
│       │   ├── CoinTab.tsx         # State orchestrator
│       │   ├── CoinGrid.tsx        # Coin layout
│       │   ├── Coin.tsx            # Single coin (CSS 3D flip)
│       │   └── CoinControls.tsx    # Flip button + count selector
│       └── shared/
│           └── ResultHistory.tsx   # Shared history display
│
└── lib/
    └── randomizer/
        ├── useWheel.ts             # Wheel hook: items + spin + localStorage
        ├── useDice.ts              # Dice hook: count + roll logic
        ├── useCoin.ts              # Coin hook: count + flip logic
        ├── useHistory.ts           # Generic result history hook
        ├── randomizer.ts           # Pure random functions (Math.random wrappers)
        └── localStorage.ts         # localStorage read/write for wheel items
```

### Structure Rationale

- **`components/randomizer/` sub-folders per tool:** Each tool (wheel, dice, coin) has its own folder. This keeps related components together and makes it easy to add a new tool in future without touching existing folders.
- **`shared/` inside randomizer:** `ResultHistory` is used by all three tab containers but is specific to this feature — it does not belong in `components/ui/`.
- **`lib/randomizer/` for logic:** Custom hooks and utilities are separated from rendering. This enables unit testing without a DOM and keeps components thin.
- **Route under `_authenticated/`:** The randomizer lives inside the existing authenticated layout (sidebar + header), consistent with every other page in the app. No new layout is needed.
- **No new `packages/` entry:** All code lives in `apps/web`. The feature is entirely client-side and shares no cross-workspace concerns.

## Architectural Patterns

### Pattern 1: Container/Leaf Separation

**What:** Tab containers (`WheelTab`, `DiceTab`, `CoinTab`) own state and behavior via hooks. Leaf components (`Die`, `Coin`, `WheelCanvas`) are stateless and receive everything as props.

**When to use:** Any animated UI component — keeps animation triggering in one place and visual components purely declarative.

**Trade-offs:** Slightly more prop-passing, but animation state never leaks between components and leaf components are trivially testable.

**Example:**
```typescript
// WheelTab.tsx — owns state
function WheelTab() {
  const { items, spinning, spin, reset, removeItem, history } = useWheel()

  return (
    <>
      <WheelCanvas items={items} spinning={spinning} onSpinEnd={spin.onEnd} />
      <WheelControls onSpin={spin.start} onReset={reset} />
      <ResultHistory entries={history} />
    </>
  )
}
```

### Pattern 2: Custom Hook Encapsulates All Tool Logic

**What:** Each tool's entire state machine lives in one custom hook: current values, animation state flag, history append, and (for wheel) localStorage sync.

**When to use:** Whenever state has multiple related pieces that always change together (e.g. `rolling: true` always pairs with generating new dice values).

**Trade-offs:** Hook logic is not visible in the component tree, but this is outweighed by the benefit of testable, reusable logic.

**Example:**
```typescript
// lib/randomizer/useDice.ts
function useDice() {
  const [count, setCount] = useState(2)
  const [values, setValues] = useState<number[]>([1, 1])
  const [rolling, setRolling] = useState(false)
  const { history, addEntry } = useHistory<number[]>()

  const roll = useCallback(() => {
    setRolling(true)
    setTimeout(() => {
      const next = Array.from({ length: count }, () => Math.ceil(Math.random() * 6))
      setValues(next)
      addEntry(next)
      setRolling(false)
    }, 600) // matches CSS animation duration
  }, [count, addEntry])

  return { count, setCount, values, rolling, roll, history }
}
```

### Pattern 3: Animation via CSS Classes + State Flag

**What:** Animation is driven by a boolean state flag (`rolling`, `flipping`, `spinning`). Components apply a CSS class when the flag is true. The animation duration is fixed in CSS; the hook clears the flag after the same duration using `setTimeout`.

**When to use:** All three randomizer tools — this approach works with `tw-animate-css` classes already in the project and avoids adding an animation library dependency.

**Trade-offs:** Duration must be synchronized between the CSS class and the `setTimeout` value. Acceptable for this use case; document the duration constant in one place.

**Example (coin):**
```typescript
// Coin.tsx
function Coin({ face, flipping }: { face: 'heads' | 'tails'; flipping: boolean }) {
  return (
    <div
      className={cn(
        "relative w-20 h-20 [transform-style:preserve-3d] transition-transform",
        flipping && "animate-[coin-flip_0.6s_ease-in-out]",
        face === 'tails' && "[transform:rotateY(180deg)]"
      )}
    >
      <div className="absolute inset-0 [backface-visibility:hidden] rounded-full bg-yellow-400">H</div>
      <div className="absolute inset-0 [backface-visibility:hidden] rounded-full bg-yellow-600 [transform:rotateY(180deg)]">T</div>
    </div>
  )
}
```

### Pattern 4: Canvas for Spinning Wheel (not SVG)

**What:** Render the wheel using an HTML5 `<canvas>` element controlled via `useRef` and `requestAnimationFrame`. The canvas is redrawn each frame during the spin deceleration.

**When to use:** The spinning wheel specifically — it has dynamic segments (items are removed) and requires smooth 60fps rotation with easing. Canvas avoids the overhead of updating many SVG DOM nodes per frame.

**Trade-offs:** Canvas is imperative and harder to style than SVG. Acceptable here because the wheel is a self-contained visual component with a clear `useRef`-based API.

**Example:**
```typescript
// WheelCanvas.tsx
function WheelCanvas({ items, spinning, onSpinEnd }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    if (!spinning) return
    // requestAnimationFrame loop: draw segments, rotate, decelerate
    // Call onSpinEnd(winningItem) when angular velocity reaches zero
  }, [spinning, items, onSpinEnd])

  return <canvas ref={canvasRef} width={400} height={400} />
}
```

## Data Flow

### Spin Flow (Wheel)

```
User clicks "Spin"
  ↓
WheelControls → calls spin.start() prop
  ↓
useWheel() sets spinning = true, picks winning index
  ↓
WheelCanvas receives spinning = true via prop, starts requestAnimationFrame loop
  ↓
WheelCanvas calls onSpinEnd(winner) when animation completes
  ↓
useWheel() sets spinning = false, removes winner from items, appends to history
  ↓
WheelCanvas re-renders with updated items (reduced segment count)
ResultHistory re-renders with new entry
ItemList re-renders with item removed
```

### Roll Flow (Dice / Coin)

```
User clicks "Roll" / "Flip"
  ↓
DiceControls/CoinControls → calls roll()/flip() prop
  ↓
useDice()/useCoin() sets rolling/flipping = true, starts setTimeout(duration)
  ↓
Die/Coin receives rolling = true → CSS animation class applied
  ↓
setTimeout fires → new random values generated, rolling = false
  ↓
Die/Coin receives rolling = false → animation class removed, face shows new value
ResultHistory receives new history entry
```

### State Management

```
useWheel / useDice / useCoin
  ↓ (useState + useCallback)
Tab container (WheelTab / DiceTab / CoinTab)
  ↓ (props)
Leaf components (WheelCanvas, Die, Coin, ResultHistory, Controls)
  ↓ (callback props)
Tab container (onSpinEnd, etc.)
  ↓ (state update)
Re-render propagates downward
```

### localStorage Sync (Wheel Items Only)

```
useWheel() initializes items from localStorage.getItem("wheel-items")
  ↓
On every items mutation (add / remove / reset):
  localStorage.setItem("wheel-items", JSON.stringify(items))
```

No other state is persisted. History is in-memory per session.

### Key Data Flows

1. **Wheel item persistence:** `useWheel` reads on mount, writes on every items change. No external trigger needed.
2. **Animation synchronization:** A single `ANIMATION_DURATION_MS` constant (e.g. `600`) is imported by both the hook's `setTimeout` and the CSS `animation-duration`. Defined once in `lib/randomizer/randomizer.ts`.
3. **History append:** `useHistory()` is a generic hook with `addEntry(value)` and `clear()`. Each tool hook calls `addEntry` after the animation resolves, ensuring history shows the settled result, not the pending one.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (1 page, 3 tools) | Current architecture is sufficient — no external state manager needed |
| Adding more tools (e.g. spinner, number picker) | Add new tool folder under `components/randomizer/`, new hook under `lib/randomizer/` — existing structure scales naturally |
| Persistence across devices | Replace localStorage layer with TanStack Query mutation to a backend endpoint — hook interface stays the same, only `localStorage.ts` changes |

### Scaling Priorities

1. **First bottleneck:** The canvas `requestAnimationFrame` loop only runs during active spinning and is isolated in `WheelCanvas`. No performance issue unless hundreds of segments are added.
2. **History unbounded growth:** Default behavior keeps all session history in memory. If history grows very long (unlikely for a session), cap the array at ~100 entries in `useHistory()`.

## Anti-Patterns

### Anti-Pattern 1: Animation State in the Route Component

**What people do:** Put `spinning`, `rolling`, `flipping` booleans directly in `randomizer.tsx` (the route file).

**Why it's wrong:** Route components re-render when route params change. Animation state belongs to the tool component, not the router. Also conflates routing concerns with UI concerns.

**Do this instead:** Keep all tool state in the tab container components (`WheelTab`, `DiceTab`, `CoinTab`) via their dedicated hooks.

### Anti-Pattern 2: Single Monolithic Randomizer Hook

**What people do:** Create one `useRandomizer()` hook that manages state for all three tools.

**Why it's wrong:** The wheel has unique concerns (localStorage, item removal). The dice has unique concerns (count configuration). Coupling them adds conditional branches everywhere and makes testing harder.

**Do this instead:** Three separate hooks (`useWheel`, `useDice`, `useCoin`) that each compose the shared `useHistory()` hook. Shared logic stays in shared utilities.

### Anti-Pattern 3: Canvas Drawing in the Hook

**What people do:** Put `requestAnimationFrame` and `canvas.getContext("2d")` calls inside `useWheel()`.

**Why it's wrong:** Canvas rendering is a DOM concern, not a state concern. Hooks cannot hold `useRef` to a DOM element they don't own. The canvas element lives in `WheelCanvas`.

**Do this instead:** `useWheel()` exposes `spinning: boolean` and the winning index. `WheelCanvas` holds its own `canvasRef` and runs the animation loop as a `useEffect` reacting to `spinning`.

### Anti-Pattern 4: Framer Motion for Coin/Dice Animation

**What people do:** Install `framer-motion` (now `motion/react`) for the coin flip and dice roll animations.

**Why it's wrong:** The project already has `tw-animate-css` available. CSS 3D transforms (`rotateY`, `rotateX`, `perspective`, `transform-style: preserve-3d`) are the standard approach for coin/dice flip animations and require zero new dependencies.

**Do this instead:** Use CSS `@keyframes` with Tailwind's arbitrary value syntax and `tw-animate-css` utilities. Reserve `motion/react` consideration for a future milestone if physics-based animation is needed.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Route → RandomizerPage | Direct render — no props needed | Route is a thin wrapper |
| Tab container → Leaf components | Props down, callbacks up | Standard React data flow |
| Tab container → Custom hook | Hook call at container top level | Hook is co-located in `lib/randomizer/` |
| useWheel → localStorage | Direct read/write in `lib/randomizer/localStorage.ts` | Isolated helper, easy to swap |
| Sidebar navigation → randomizer route | TanStack Router `<Link to="/randomizer">` in `_authenticated.tsx` | Add NavItem alongside existing items |

### External Services

None. All randomization is client-side (`Math.random()`). No API calls, no WebSockets, no third-party services.

## Suggested Build Order

Dependencies between components determine build sequence:

1. **`lib/randomizer/randomizer.ts`** — Pure random functions. No dependencies. All hooks depend on this.
2. **`lib/randomizer/useHistory.ts`** — Generic history hook. No dependencies. All tool hooks depend on this.
3. **`lib/randomizer/localStorage.ts`** — localStorage helper. No dependencies. `useWheel` depends on this.
4. **`lib/randomizer/useCoin.ts` + `useDice.ts`** — Simpler hooks (no localStorage). Build these before `useWheel`.
5. **`lib/randomizer/useWheel.ts`** — Most complex hook (localStorage + item removal). Depends on steps 1-3.
6. **Leaf components** — `Die`, `Coin`, `ResultHistory` can be built in parallel once step 2 is done. `WheelCanvas` can be built once step 5 is done.
7. **Tab containers** — `DiceTab`, `CoinTab` (depend on steps 4 + 6), then `WheelTab` (depends on step 5 + 6).
8. **`RandomizerPage`** — Tab shell, assembled from containers. Depends on step 7.
9. **`randomizer.tsx` route** — TanStack Router file, wraps step 8. Add `<Link>` to sidebar.

This order ensures every piece has its dependencies ready before it is written.

## Sources

- [TanStack Router overview — client-first routing](https://tanstack.com/router/v1/docs/framework/react/overview)
- [tw-animate-css — Tailwind v4 animation utilities](https://github.com/Wombosvideo/tw-animate-css)
- [Canvas-based spinning wheel pattern](https://dev.to/sababg/custom-wheel-of-prize-with-canvas-589h)
- [Building a Spin Wheel in React — segment + animation architecture](https://dev.to/gprakasha/building-a-spin-wheel-in-react-c78)
- [Wheel of Names in React + TypeScript — full implementation reference](https://www.freecodecamp.org/news/build-your-own-wheel-of-names/)
- [CSS 3D coin flip with Tailwind — card flip technique](https://dev.to/mematthew123/how-to-3d-flip-cards-using-tailwind-css-a2f)
- [3D dice animation — translateZ + rotateX/Y transform pattern](https://codepen.io/AlaDyn172/pen/vYOGOGG)
- [useReducer for game history state management](https://react.dev/reference/react/useReducer)
- [Motion (Framer Motion) — React SVG animation](https://motion.dev/docs/react-svg-animation)
- [SVG vs Canvas vs WebGL performance — 2025 benchmarks](https://www.svggenie.com/blog/svg-vs-canvas-vs-webgl-performance-2025)

---
*Architecture research for: animated randomizer toolkit (spinning wheel, dice, coin)*
*Researched: 2026-03-26*
