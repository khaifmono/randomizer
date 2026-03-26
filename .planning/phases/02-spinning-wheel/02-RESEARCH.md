# Phase 2: Spinning Wheel - Research

**Researched:** 2026-03-26
**Domain:** HTML5 Canvas spinning wheel, `motion@^12` animation, React custom hooks, localStorage persistence
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Dual-mode item entry: quick-add input (single text field + "Add" button for one item at a time) AND expandable bulk textarea (one item per line, for pasting lists)
- **D-02:** Visible item list below input showing all items with individual remove (x) buttons per item
- **D-03:** Classic downward-pointing triangle pointer at 12 o'clock position
- **D-04:** Segment colors at Claude's discretion — should be visually appealing and distinct between adjacent segments
- **D-05:** Both click/tap the wheel AND a dedicated "Spin" button trigger a spin — maximum flexibility
- **D-06:** Fast + dramatic spin: 4-6 full rotations, quick start, dramatic slow-down, ~4-5 seconds total duration
- **D-07:** Center overlay on the wheel — winner name pops up bold with celebration styling, then fades out after a moment
- **D-08:** After fade, the winning item is automatically removed from the wheel (per WHEL-04)

### Claude's Discretion

- Segment color palette (rainbow, themed, or custom)
- Text placement on segments (radial vs horizontal)
- Wheel size relative to container
- Exact overlay fade timing and animation
- Quick-add vs bulk textarea toggle UX details
- Spin button placement (below wheel, beside wheel, etc.)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WHEL-01 | User can enter custom items for the wheel (add/remove from list) | Dual-mode input (D-01/D-02); item list with per-item remove buttons; `useWheel` hook manages items array |
| WHEL-02 | User sees a spinning wheel that animates with smooth deceleration to a result | HTML5 Canvas + `requestAnimationFrame` draw loop; `motion@^12` `animate()` drives rotation angle with custom easing |
| WHEL-03 | User sees the winning item clearly announced after the wheel stops | Center overlay rendered on canvas or as absolute-positioned div; appears when `onSpinEnd` fires |
| WHEL-04 | Winning item is automatically removed from the active wheel after each spin | `onSpinEnd(winner)` callback in `useWheel` calls `setItems(items.filter(...))` after animation completes |
| WHEL-05 | User can reset the wheel to restore all removed items | `reset()` function in `useWheel` restores from `originalItemsRef`; triggers localStorage write |
| WHEL-06 | Wheel item list persists in browser localStorage across sessions | `localStorage.ts` utility; `useState(() => tryRead())` initializer pattern; write on every items mutation |
| WHEL-07 | Wheel spin uses smooth cubic-bezier deceleration that feels premium | `motion@^12` `animate()` with custom easing; 4-6 rotations + target stop angle pre-calculated before animation starts |
</phase_requirements>

---

## Summary

Phase 2 implements the full spinning wheel tool: item management, Canvas rendering, smooth deceleration animation, remove-on-hit behavior, manual reset, and localStorage persistence. It replaces the `WheelPlaceholder` in the existing `randomizer.tsx` page.

The core architecture is already established in the project-level research (SUMMARY.md and ARCHITECTURE.md). The pattern is: `useWheel` hook owns all state (items, spin flag, winner, history), `WheelCanvas` owns the Canvas `ref` and drives the `requestAnimationFrame` loop, and `WheelTab` wires them together via props. The most important invariant is **pre-determine the winner before animation starts** — calculating the stop angle from the pre-selected index eliminates angle-mismatch bugs entirely.

Animation deceleration uses `motion@^12` (package name `motion`, import path `motion/react`). The current registry version is `12.38.0`. It is NOT installed yet in `apps/web` — installation is required as a Wave 0 task. The Canvas draw loop runs independently via `requestAnimationFrame`; `motion` is used imperatively via `useAnimate()` to drive a single rotation angle value that the Canvas reads each frame, producing the cubic-bezier deceleration feel required by D-06 and WHEL-07.

**Primary recommendation:** Use `useAnimate()` from `motion/react` to animate a `useRef` rotation value, read it inside the `requestAnimationFrame` draw callback each frame, and call `onSpinEnd(winner)` when the animation completes. Pre-determine the winner index with `Math.random()` before calling `animate()`. This is the only pattern that satisfies both the smooth deceleration requirement (WHEL-07) and the angle accuracy requirement (WHEL-03).

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `motion` | 12.38.0 (latest, verified via npm registry 2026-03-26) | Wheel spin deceleration — drives rotation angle with cubic-bezier easing to a pre-calculated stop angle | Only library that provides deterministic easing to a target angle with React 19 compatibility; 18 KB; formerly `framer-motion` |
| HTML5 Canvas 2D API | Built-in (browser) | Wheel rendering — segments, text, pointer triangle | Correct primitive for dynamic segment counts and per-frame rotation; no DOM thrashing |
| `requestAnimationFrame` | Built-in (browser) | Draw loop — 60fps redraws during spin | Standard animation primitive; pairs with `cancelAnimationFrame` cleanup |
| `localStorage` | Built-in (browser) | Wheel item persistence across sessions | Established in Phase 1 via `localStorage.ts` utility |

### Supporting (already installed in apps/web)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `react` | 19.2.0 | Component framework | All components and hooks |
| `tailwindcss` | 4.1.17 | Styling utility classes | All component styling |
| `tw-animate-css` | 1.4.0 | Winner overlay fade animation | Overlay appear/disappear enter/exit transitions only |
| `lucide-react` | 0.562.0 | Icons (Reset, Spin triggers) | Button icons |
| `clsx` + `tailwind-merge` (`cn`) | installed | Conditional class merging | All className composition |
| `vitest` + `@testing-library/react` | 3.2.4 / 16.3.2 | TDD test runner | Every new file gets `.test.ts` / `.test.tsx` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `motion` for deceleration | `react-spring` | react-spring's physics model fights deterministic landing angle — winner calculated from final physics state, not pre-determined; angle mismatch bugs guaranteed |
| `motion` for deceleration | Raw `requestAnimationFrame` with manual easing | Workable but requires implementing cubic-bezier easing from scratch; `motion` gives this free with cleaner API |
| `motion` for deceleration | GSAP | 23 KB vs 18 KB; licensing complexity; no benefit for this use case |
| HTML5 Canvas | SVG with React elements | SVG DOM nodes require re-render on each frame — unacceptable at 60fps with 2-20 segments |
| HTML5 Canvas | `react-wheel-of-prizes` | Abandoned library; no React 19 support |

**Installation (Wave 0 task):**
```bash
pnpm --filter @base-project/web add motion@^12.38.0
```

**Version verified:** `npm view motion version` → `12.38.0` (2026-03-26)

---

## Architecture Patterns

### Recommended File Structure for Phase 2

```
apps/web/src/
├── components/
│   └── randomizer/
│       └── wheel/
│           ├── wheel-tab.tsx          # Container: wires useWheel to leaf components
│           ├── wheel-canvas.tsx       # Canvas renderer: rAF loop + motion animation
│           ├── wheel-item-list.tsx    # Editable item list with add/remove/bulk-add
│           └── wheel-controls.tsx    # Spin button + Reset button
├── lib/
│   └── randomizer/
│       ├── use-wheel.ts              # Hook: items, spin, reset, history, localStorage
│       └── local-storage.ts          # localStorage read/write utility (if not already created in Phase 1)
└── routes/
    └── randomizer.tsx               # Existing — replace WheelPlaceholder with <WheelTab />
```

**Note on existing code:** Phase 1 created `types.ts` and `ResultHistory` only. `local-storage.ts` and `use-wheel.ts` are new in this phase. Check if `local-storage.ts` exists before creating it.

### Pattern 1: Pre-Determine Winner Before Animation

**What:** Call `Math.random()` to select the winning index before starting the animation. Calculate the exact stop angle from the index. Pass the stop angle to `motion`'s `animate()`. The canvas draws to whatever angle `motion` reports each frame.

**When to use:** Required. Any approach that derives the winner from the final animation angle is incorrect — floating-point drift causes misalignment between the visual pointer position and the reported winner.

**Implementation:**
```typescript
// lib/randomizer/use-wheel.ts
function spin() {
  if (isSpinningRef.current || items.length === 0) return;
  isSpinningRef.current = true;
  setSpinning(true);

  const winnerIndex = Math.floor(Math.random() * items.length);
  const segmentAngle = (2 * Math.PI) / items.length;
  // Target: pointer (top = -PI/2) lands at center of winning segment
  // Segments are drawn starting from currentRotation; winner index i means
  // segment center is at: currentRotation + i * segmentAngle + segmentAngle/2
  // We need that to equal -PI/2 (top), so:
  // stopAngle = -Math.PI/2 - (winnerIndex * segmentAngle + segmentAngle/2)
  // Add 4-6 full rotations for drama
  const fullRotations = (4 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
  const rawStop = -Math.PI / 2 - (winnerIndex * segmentAngle + segmentAngle / 2);
  const targetAngle = rotationRef.current - fullRotations + rawStop;

  winnerRef.current = items[winnerIndex];
  itemsSnapshotRef.current = [...items]; // freeze items for animation duration
  // ...trigger motion animate()
}
```

**Source:** .planning/research/SUMMARY.md — Critical Pitfall #1; ARCHITECTURE.md — Spin Flow diagram

### Pattern 2: useAnimate() Drives Canvas Rotation Ref

**What:** Use `useAnimate()` from `motion/react` to animate a `useRef<number>` holding the current rotation angle. The `requestAnimationFrame` draw callback reads `rotationRef.current` each frame. When `motion` finishes animating, the `onComplete` callback fires `onSpinEnd(winner)`.

**When to use:** This is the correct pattern for using `motion` with Canvas. Never use `motion`'s `animate()` on a DOM element for wheel rotation — Canvas is imperative, not declarative.

**Implementation:**
```typescript
// wheel-canvas.tsx (simplified)
import { useAnimate } from "motion/react";

function WheelCanvas({ items, spinning, winnerIndex, onSpinEnd }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Draw loop — runs continuously, reads rotationRef.current each frame
    function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      drawWheel(canvas, items, rotationRef.current);
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [items]);

  useEffect(() => {
    if (!spinning || winnerIndex == null) return;
    const segmentAngle = (2 * Math.PI) / items.length;
    const fullRotations = (4 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const rawStop = -Math.PI / 2 - (winnerIndex * segmentAngle + segmentAngle / 2);
    const targetAngle = rotationRef.current - fullRotations + ((rawStop - rotationRef.current) % (2 * Math.PI));

    animate(rotationRef, { current: targetAngle }, {
      duration: 4.5,
      ease: [0.17, 0.67, 0.35, 0.99], // cubic-bezier: fast start, dramatic slowdown
      onComplete: () => onSpinEnd(),
    });
  }, [spinning]);

  return <canvas ref={canvasRef} />;
}
```

**Source:** motion.dev official docs — `useAnimate`, `animate` function; ARCHITECTURE.md Pattern 4

### Pattern 3: Canvas DPR Scaling (Retina / High-DPI)

**What:** At canvas initialization and on resize, set `canvas.width/height = cssSize * devicePixelRatio`, then `ctx.scale(dpr, dpr)`. CSS width/height remains at `cssSize`.

**When to use:** Required at canvas mount. Skip this and the wheel will look blurry on any retina display (all modern MacBooks, most smartphones).

**Implementation:**
```typescript
function initCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const cssSize = canvas.getBoundingClientRect().width; // or fixed value
  canvas.width = cssSize * dpr;
  canvas.height = cssSize * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return ctx;
}
// Re-call on ResizeObserver callback
```

**Source:** MDN Canvas API — Optimizing canvas; SUMMARY.md Critical Pitfall #5

### Pattern 4: useRef as In-Flight Animation Guard

**What:** Use `isSpinningRef = useRef(false)` (NOT `useState`) as the guard that prevents double-spin. Pair with `useState(false)` for the visual `disabled` state on the Spin button.

**When to use:** Required. `useRef` updates synchronously and does not stale in closures; `useState` can be stale in event handlers called during the same render cycle.

```typescript
const isSpinningRef = useRef(false);
const [spinButtonDisabled, setSpinButtonDisabled] = useState(false);

function spin() {
  if (isSpinningRef.current || items.length === 0) return;
  isSpinningRef.current = true;
  setSpinButtonDisabled(true);
  // ...start animation
}

function onSpinEnd() {
  isSpinningRef.current = false;
  setSpinButtonDisabled(false);
  // remove winner, append history
}
```

**Source:** SUMMARY.md Critical Pitfall #3; ARCHITECTURE.md Pattern 3

### Pattern 5: localStorage Read in useState Initializer

**What:** Read from `localStorage` synchronously in the `useState` initializer function, wrapped in try/catch. Never read in `useEffect` — that causes an empty-flash on first render.

```typescript
const [items, setItems] = useState<string[]>(() => {
  try {
    const raw = localStorage.getItem("wheel-items");
    if (!raw) return DEFAULT_ITEMS;
    return JSON.parse(raw) as string[];
  } catch {
    return DEFAULT_ITEMS;
  }
});

// Write on every mutation:
function addItem(text: string) {
  const next = [...items, text];
  setItems(next);
  localStorage.setItem("wheel-items", JSON.stringify(next));
}
```

**Source:** SUMMARY.md Critical Pitfall #6

### Pattern 6: Items Snapshot Ref During Animation

**What:** At spin start, copy `items` into a `useRef`. The Canvas draw function reads from this snapshot, not from live `items` state. The `useWheel` hook only calls `setItems(items.filter(...))` in `onSpinEnd`, never during animation.

**Why:** If `setItems` were called at spin start, the Canvas would redraw with fewer segments mid-animation, causing visual glitch.

```typescript
const itemsSnapshotRef = useRef<string[]>([]);

function spin() {
  itemsSnapshotRef.current = [...items]; // freeze snapshot
  // ...start animation, canvas reads itemsSnapshotRef.current
}

function onSpinEnd(winner: string) {
  setItems(prev => prev.filter(i => i !== winner)); // update AFTER animation
}
```

**Source:** SUMMARY.md Critical Pitfall #4

### Anti-Patterns to Avoid

- **Deriving winner from final angle:** Never read the canvas rotation angle at animation end and compute the winner from it. Pre-determine the winner, compute the target angle from it.
- **setState in animation frame:** Never call `setState` inside the `requestAnimationFrame` callback. React's batching fights rAF; use refs for animation state, state only for React renders.
- **Framer-motion on DOM element for Canvas:** `motion` cannot animate a Canvas element directly. Animate a `ref` value, read it imperatively in `drawWheel()`.
- **Single `isSpinning` in useState as both guard and UI state:** One `useState` cannot serve both — use `useRef` for the synchronous guard, `useState` for the visible button disabled state.
- **Canvas drawing in the hook:** `useWheel` must not hold `canvasRef` or call `canvas.getContext("2d")`. Canvas is a DOM concern; the hook is a state concern. See ARCHITECTURE.md Anti-Pattern 3.
- **`framer-motion` package name:** The package is now `motion`. `framer-motion` is a redirect shim. Always install and import from `motion` / `motion/react`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth easing to specific angle | Custom cubic-bezier rAF loop | `motion` `animate()` with `ease` array | Implementing floating-point cubic-bezier solver and ensuring it terminates exactly at target is non-trivial; `motion` handles this reliably |
| Canvas DPR scaling | Custom resize logic | `ResizeObserver` + standard DPR pattern (3 lines) | Edge cases with orientation change, fractional DPR values; established pattern covers all cases |
| localStorage JSON parse guard | Try/catch wrapper each time | `local-storage.ts` utility with built-in try/catch | Duplicate try/catch at every call site; util encapsulates the guard |
| Angle normalization (modulo 2PI) | Custom normalizer | Standard `((angle % (2*PI)) + 2*PI) % (2*PI)` | The two-step modulo prevents negative angles; single-step `%` fails for negative inputs in JS |

**Key insight:** The angle calculation math looks simple but has three subtle traps: negative modulo in JavaScript, the coordinate system origin (Canvas `0` angle is 3 o'clock, not 12), and segment-center vs. segment-edge targeting. Unit-test the angle mapping function with at least 10 different item counts before wiring it to Canvas.

---

## Common Pitfalls

### Pitfall 1: Winner Announced Does Not Match Pointer

**What goes wrong:** The visual pointer stops on segment A, but the overlay says segment B is the winner.
**Why it happens:** Winner was derived from the final angle by dividing angle into segment buckets — floating-point imprecision and off-by-one in angle ranges cause mismatches, especially at segment boundaries.
**How to avoid:** Pre-determine `winnerIndex = Math.floor(Math.random() * items.length)` before animation. Calculate `targetAngle` from `winnerIndex`. Animate TO `targetAngle`. Winner is always `items[winnerIndex]`, never re-derived from the final angle.
**Warning signs:** Tests for angle calculation fail for item counts that are not powers of 2; winner mismatches cluster at the edges of segments.

### Pitfall 2: Canvas Blurry on Retina

**What goes wrong:** Wheel text and segment edges look blurry on MacBook/iPhone. Looks fine on non-retina monitors.
**Why it happens:** Canvas has a 1:1 pixel ratio by default. On a `devicePixelRatio=2` screen, the 400px canvas is stretched to 800 CSS pixels, causing blur.
**How to avoid:** Apply DPR scaling at init and on resize. `canvas.width = cssWidth * dpr; ctx.scale(dpr, dpr)`. Do this before the first draw.
**Warning signs:** Text on canvas looks fuzzy; segment border lines have visible aliasing.

### Pitfall 3: React Strict Mode Double-Fires rAF Loop

**What goes wrong:** In development, the draw loop starts twice, causing double history entries on first spin, or animation fighting itself.
**Why it happens:** React 18+ Strict Mode double-invokes `useEffect` on mount in development.
**How to avoid:** Always return a cleanup function from `useEffect` that calls `cancelAnimationFrame(rafRef.current)`. The second mount's effect will cancel the first mount's loop before starting a new one.
**Warning signs:** History shows duplicate entries on the first spin only in development; disappears in production.

### Pitfall 4: Spin Button Spams History

**What goes wrong:** Clicking Spin rapidly creates multiple simultaneous animations and history entries for a single logical spin.
**Why it happens:** `useState` spinning flag is read inside a closure that captured a stale `false` value before the state update propagated.
**How to avoid:** Use `isSpinningRef.current` (not `isSpinning` state) as the early-return guard in the `spin()` function.
**Warning signs:** Clicking Spin rapidly produces multiple history entries; item list empties faster than expected.

### Pitfall 5: Item Removed Before Animation Completes

**What goes wrong:** The winning segment disappears mid-animation (the wheel redraws with one fewer segment while still spinning), causing a visible jump in segment sizes.
**Why it happens:** `setItems(...)` called at spin start rather than in `onSpinEnd`.
**How to avoid:** Freeze items in `itemsSnapshotRef.current = [...items]` at spin start. Canvas reads from the snapshot. Only call `setItems(items.filter(...))` inside `onSpinEnd()`.
**Warning signs:** Canvas shows visual glitch/jump mid-spin; segment count changes before animation completes.

### Pitfall 6: Canvas Coordinate Origin

**What goes wrong:** Segment 0 does not start at the top of the wheel — it starts at the right (3 o'clock).
**Why it happens:** Canvas arc angle `0` is 3 o'clock. The pointer is at 12 o'clock (-PI/2 radians). Initial rotation must account for this offset.
**How to avoid:** Start drawing segments from `-Math.PI/2` (12 o'clock) as the base rotation angle. All stop angle calculations must also use `-Math.PI/2` as the pointer position.
**Warning signs:** First item always ends up at 3 o'clock instead of 12; stop angle is exactly 90 degrees off.

---

## Code Examples

Verified patterns from official/project sources:

### Segment Color Palette (Claude's Discretion — Recommended)

A rainbow palette with 8 distinct oklch colors that cycle for any segment count. Adjacent segments always have different hues.

```typescript
// lib/randomizer/use-wheel.ts
const SEGMENT_COLORS = [
  "oklch(0.72 0.17 25)",   // red-orange
  "oklch(0.72 0.16 55)",   // amber
  "oklch(0.72 0.15 140)",  // green
  "oklch(0.72 0.17 200)",  // teal
  "oklch(0.72 0.17 260)",  // blue
  "oklch(0.72 0.18 300)",  // violet
  "oklch(0.72 0.17 340)",  // pink
  "oklch(0.72 0.15 95)",   // yellow-green
] as const;

function getSegmentColor(index: number): string {
  return SEGMENT_COLORS[index % SEGMENT_COLORS.length];
}
```

### drawWheel Function (Canvas Core)

```typescript
// components/randomizer/wheel/wheel-canvas.tsx
function drawWheel(
  canvas: HTMLCanvasElement,
  items: string[],
  rotation: number,
  ctx: CanvasRenderingContext2D,
  cssSize: number,
) {
  const cx = cssSize / 2;
  const cy = cssSize / 2;
  const radius = cssSize / 2 - 4;
  const segmentAngle = (2 * Math.PI) / items.length;

  ctx.clearRect(0, 0, cssSize, cssSize);

  items.forEach((item, i) => {
    const startAngle = rotation + i * segmentAngle;
    const endAngle = startAngle + segmentAngle;

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = getSegmentColor(i);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Radial text (rotate context to text midpoint)
    const midAngle = startAngle + segmentAngle / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(midAngle);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = `bold ${Math.max(11, Math.min(14, radius / items.length * 2))}px sans-serif`;
    const maxTextWidth = radius * 0.7;
    const text = item.length > 16 ? item.slice(0, 14) + "…" : item;
    ctx.fillText(text, radius - 8, 5);
    ctx.restore();
  });

  // Center circle (cover hub)
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();

  // Triangle pointer at 12 o'clock (drawn in CSS/HTML overlay, not canvas)
}
```

### Triangle Pointer (HTML Overlay)

The pointer is simpler and crisper as an HTML/CSS element over the canvas than drawn on canvas — avoids redrawing it on every frame.

```tsx
// Absolute-positioned over the canvas container
<div className="relative">
  <canvas ref={canvasRef} className="w-full aspect-square" />
  {/* Triangle pointer at top center */}
  <div
    className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
    style={{
      borderLeft: "10px solid transparent",
      borderRight: "10px solid transparent",
      borderTop: "20px solid oklch(0.25 0.01 0)",
    }}
  />
  {/* Winner overlay */}
  {winner && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black/75 text-white font-bold text-xl px-6 py-3 rounded-xl animate-in fade-in zoom-in-95">
        {winner}
      </div>
    </div>
  )}
</div>
```

### useWheel Hook Skeleton

```typescript
// lib/randomizer/use-wheel.ts
import { useState, useRef, useCallback } from "react";
import type { HistoryEntry } from "./types";

const STORAGE_KEY = "wheel-items";
const DEFAULT_ITEMS = ["Option 1", "Option 2", "Option 3", "Option 4"];

export function useWheel() {
  const [items, setItemsState] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : DEFAULT_ITEMS;
    } catch {
      return DEFAULT_ITEMS;
    }
  });

  const originalItemsRef = useRef<string[]>(items); // for reset
  const itemsSnapshotRef = useRef<string[]>(items);  // frozen during animation
  const isSpinningRef = useRef(false);
  const winnerIndexRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const setItems = useCallback((next: string[]) => {
    setItemsState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addItem = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next = [...items, trimmed];
    setItems(next);
    originalItemsRef.current = next;
  }, [items, setItems]);

  const removeItem = useCallback((index: number) => {
    const next = items.filter((_, i) => i !== index);
    setItems(next);
    originalItemsRef.current = next;
  }, [items, setItems]);

  const reset = useCallback(() => {
    const restored = [...originalItemsRef.current];
    setItems(restored);
  }, [setItems]);

  const startSpin = useCallback(() => {
    if (isSpinningRef.current || items.length === 0) return;
    isSpinningRef.current = true;
    itemsSnapshotRef.current = [...items];
    winnerIndexRef.current = Math.floor(Math.random() * items.length);
    setWinner(null);
    setSpinning(true); // WheelCanvas reacts to this
  }, [items]);

  const onSpinEnd = useCallback(() => {
    const idx = winnerIndexRef.current!;
    const won = itemsSnapshotRef.current[idx];
    setWinner(won);
    setItems(items.filter((_, i) => i !== idx));
    setHistory(prev => [
      { id: nextIdRef.current++, label: won, timestamp: Date.now() },
      ...prev,
    ]);
    // Winner overlay auto-dismiss after 2s, then clear winner
    setTimeout(() => {
      setWinner(null);
      isSpinningRef.current = false;
      setSpinning(false);
    }, 2000);
  }, [items, setItems]);

  return {
    items: itemsSnapshotRef.current, // Canvas reads snapshot during spin
    liveItems: items,                // ItemList reads live state
    spinning,
    winner,
    history,
    winnerIndex: winnerIndexRef.current,
    addItem,
    removeItem,
    reset,
    startSpin,
    onSpinEnd,
  };
}
```

### localStorage Utility

```typescript
// lib/randomizer/local-storage.ts
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}
```

### Angle Normalization (Critical Math Utility)

```typescript
// lib/randomizer/randomizer.ts (add to existing file)
/**
 * Normalize an angle to [0, 2*PI) range.
 * JavaScript's % operator returns negative for negative inputs — this fixes it.
 */
export function normalizeAngle(angle: number): number {
  return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

/**
 * Given a rotation angle and segment count, return the item index under the pointer.
 * Pointer is at top (angle = -PI/2 = 3*PI/2 normalized).
 * Segments are drawn clockwise starting from angle 0 (3 o'clock) + rotation.
 * Unit-test this function independently before wiring to Canvas.
 */
export function getWinnerIndex(rotation: number, itemCount: number): number {
  const segmentAngle = (2 * Math.PI) / itemCount;
  const pointerAngle = normalizeAngle(-rotation - Math.PI / 2);
  // ... wait — DO NOT use this for winner detection.
  // ALWAYS pre-determine winner before animation. This function exists only for verification tests.
  return Math.floor(pointerAngle / segmentAngle) % itemCount;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (same library, renamed) | Mid-2025 | Import from `motion/react` not `framer-motion`; old package is a shim redirect |
| Canvas text at horizontal position | Canvas text drawn radially (rotated context) | Ongoing standard | Radial text fits longer item names; horizontal text clips for items beyond ~5 chars |
| Single `useState` for spin guard | `useRef` for guard + `useState` for UI state | React 18 patterns matured | Prevents stale closure bugs in concurrent mode and Strict Mode double-invoke |

**Not deprecated:**
- `requestAnimationFrame` + Canvas 2D API — still the correct primitive for this use case in 2026
- `localStorage` JSON — still correct for client-only, no-auth persistence

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build toolchain | Yes | v24.12.0 | — |
| pnpm | Package manager | Yes | 10.5.2 | — |
| `motion` npm package | Wheel deceleration | Not installed | Latest: 12.38.0 | None — must install before implementing WheelCanvas |
| HTML5 Canvas 2D | Wheel rendering | Yes (browser built-in) | — | — |
| `localStorage` | Item persistence | Yes (browser built-in) | — | — |
| Vitest + jsdom | Tests | Yes | 3.2.4 | — |
| `@testing-library/react` | Component tests | Yes | 16.3.2 | — |

**Missing dependencies with no fallback:**
- `motion@^12.38.0` — must be installed in `apps/web` before `WheelCanvas` can be implemented. Wave 0 task: `pnpm --filter @base-project/web add motion@^12.38.0`

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 + jsdom + @testing-library/react 16.3.2 |
| Config file | `apps/web/vitest.config.ts` |
| Quick run command | `pnpm --filter @base-project/web vitest run` |
| Full suite command | `pnpm --filter @base-project/web vitest run --reporter=verbose` |

**Note:** Canvas 2D API is not available in jsdom. Tests for `WheelCanvas` rendering logic must mock `canvas.getContext("2d")`. Angle math and hook logic are pure functions — fully testable without Canvas.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WHEL-01 | Add item via quick-add input adds to list | unit | `pnpm --filter @base-project/web vitest run src/lib/randomizer/use-wheel.test.ts` | Wave 0 |
| WHEL-01 | Add items via bulk textarea adds all non-empty lines | unit | same | Wave 0 |
| WHEL-01 | Remove item by index removes correct item | unit | same | Wave 0 |
| WHEL-02 | `startSpin` sets `spinning: true` and pre-selects winner | unit | same | Wave 0 |
| WHEL-02 | `winnerIndex` is within valid range for any item count | unit | same | Wave 0 |
| WHEL-03 | `onSpinEnd` sets `winner` to correct item name | unit | same | Wave 0 |
| WHEL-04 | `onSpinEnd` removes winner from items | unit | same | Wave 0 |
| WHEL-05 | `reset()` restores all originally-added items | unit | same | Wave 0 |
| WHEL-06 | `useWheel` reads items from localStorage on init | unit | same | Wave 0 |
| WHEL-06 | Items written to localStorage on add/remove | unit | same | Wave 0 |
| WHEL-06 | Corrupted localStorage value falls back to defaults | unit | same | Wave 0 |
| WHEL-07 | Angle math: `getWinnerIndex(targetAngle, N)` returns pre-selected index | unit | `pnpm --filter @base-project/web vitest run src/lib/randomizer/randomizer.test.ts` | Existing (extend) |
| WHEL-07 | Angle math: correct for all item counts 1-20 | unit | same | Existing (extend) |
| WHEL-01 | WheelItemList renders all items with remove buttons | component | `pnpm --filter @base-project/web vitest run src/components/randomizer/wheel/wheel-item-list.test.tsx` | Wave 0 |
| WHEL-01 | WheelItemList calls onRemove with correct index | component | same | Wave 0 |
| Integration | WheelTab renders WheelCanvas when items exist | component | `pnpm --filter @base-project/web vitest run src/components/randomizer/wheel/wheel-tab.test.tsx` | Wave 0 |
| Integration | Existing randomizer page tests still pass | regression | `pnpm --filter @base-project/web vitest run` | Existing — must stay green |

**Canvas mocking pattern for jsdom:**
```typescript
// In test setup or test file
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  arc: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  measureText: vi.fn(() => ({ width: 50 })),
}));
```

### Sampling Rate

- **Per task commit:** `pnpm --filter @base-project/web vitest run`
- **Per wave merge:** `pnpm --filter @base-project/web vitest run --reporter=verbose`
- **Phase gate:** Full suite green (all 13 existing + all new Phase 2 tests) before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `apps/web/src/lib/randomizer/use-wheel.test.ts` — covers WHEL-01 through WHEL-06 hook behavior
- [ ] `apps/web/src/lib/randomizer/local-storage.test.ts` — covers try/catch fallback behavior
- [ ] `apps/web/src/components/randomizer/wheel/wheel-item-list.test.tsx` — covers WHEL-01 component behavior
- [ ] `apps/web/src/components/randomizer/wheel/wheel-tab.test.tsx` — integration smoke test
- [ ] Canvas mock setup (inline in test files or shared in vitest setup) — required for jsdom compatibility
- [ ] Install `motion`: `pnpm --filter @base-project/web add motion@^12.38.0`

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 2 |
|-----------|-------------------|
| No new UI frameworks — must use existing React + Tailwind + Shadcn | All wheel UI uses Tailwind utilities and Shadcn `Button`, `Input`, `Textarea`; no component library additions |
| Client-side only — no API calls | `localStorage` only; no fetch calls in `useWheel` |
| Animations must feel smooth — CSS/JS animations, not GIF/video | `motion@^12` for deceleration + Canvas rAF for draw loop |
| kebab-case filenames | `wheel-tab.tsx`, `wheel-canvas.tsx`, `wheel-item-list.tsx`, `wheel-controls.tsx`, `use-wheel.ts`, `local-storage.ts` |
| `type` keyword for TypeScript type aliases | `type WheelState = {...}` not `interface WheelState` |
| `@base-project/web/` import alias | All cross-file imports use this alias |
| Named exports (not default) | All components and hooks use named exports |
| TDD approach: write failing tests first (RED), then implement (GREEN) | Unit test angle math + hook before implementing Canvas |
| `motion@^12.37.0` (NOT `framer-motion`) | Import from `motion/react` |
| HTML5 Canvas for wheel rendering | No SVG-based wheel |
| Pre-determine winner before animation | Winner derived from `Math.random()` before `animate()` call |

---

## Open Questions

1. **Does `local-storage.ts` already exist from Phase 1?**
   - What we know: Phase 1 plan mentions it as a deliverable; the lib/randomizer directory currently only contains `types.ts`
   - What's unclear: Whether Phase 1 created it or deferred it
   - Recommendation: Wave 0 plan should `ls` the directory at task start and create the file only if absent

2. **motion `animate()` with a plain `useRef` value — is this the correct API?**
   - What we know: `motion/react` exports `useAnimate()` which returns `[scope, animate]`; `animate()` can target DOM elements or motion values
   - What's unclear: Whether `animate(plainRef, { current: targetValue }, options)` is a supported call signature in v12.38.0, or whether a `motionValue` from `useMotionValue()` is required
   - Recommendation: Use `useMotionValue(0)` from `motion/react` as the rotation value, subscribe with `useEffect` + `motionValue.on("change", ...)` to update `rotationRef.current` for canvas reads. This is the documented pattern. Verify at implementation time against motion.dev docs.

3. **`randomizer.tsx` needs to pass `onAddWheelHistory` to `WheelTab` or let `WheelTab` manage its own history**
   - What we know: `randomizer.tsx` currently manages `wheelHistory` state and `handleClearHistory`; `ResultHistory` is rendered outside the tab with `activeHistory`
   - What's unclear: Whether `wheelHistory` moves into `useWheel` (self-contained) or stays in `RandomizerPage` with a callback prop
   - Recommendation: Keep `wheelHistory` inside `useWheel` for cohesion; expose `history` and `clearHistory` from the hook; pass them up to `RandomizerPage` which already has the `ResultHistory` rendering plumbing. This matches the ARCHITECTURE.md data flow exactly.

---

## Sources

### Primary (HIGH confidence)

- `.planning/research/SUMMARY.md` — All 6 critical pitfalls, stack recommendations, feature analysis (project-level research, 2026-03-26)
- `.planning/research/ARCHITECTURE.md` — Component hierarchy, data flow, anti-patterns, build order (project-level research, 2026-03-26)
- `apps/web/src/routes/randomizer.tsx` — Existing code: `WheelPlaceholder`, `wheelHistory` state, `ResultHistory` wiring
- `apps/web/src/lib/randomizer/types.ts` — `HistoryEntry` and `TabId` types
- `apps/web/src/index.css` — `--color-wheel-accent` token (`oklch(0.55 0.18 240)`)
- `apps/web/vitest.config.ts` — Test runner config, jsdom environment, include pattern
- `apps/web/package.json` — Confirmed `motion` is NOT yet in dependencies (verified 2026-03-26)
- npm registry — `motion` latest version `12.38.0` (verified via `npm view motion version`, 2026-03-26)

### Secondary (MEDIUM confidence)

- [motion.dev official docs](https://motion.dev/docs/react-quick-start) — Package name, import path, React 19 compatibility
- [MDN Canvas API — Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) — DPR scaling pattern
- [React docs — StrictMode](https://react.dev/reference/react/StrictMode) — Double-invoke behavior, cleanup requirements

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `motion` version verified on npm registry; Canvas and localStorage are built-in browser APIs
- Architecture: HIGH — Fully defined in project-level ARCHITECTURE.md; integration points confirmed by reading actual Phase 1 source code
- Pitfalls: HIGH — All 6 pitfalls documented in SUMMARY.md with root causes and prevention; verified against Phase 1 code patterns
- Test infrastructure: HIGH — Vitest + jsdom confirmed working (13 tests passing); Canvas mock pattern is standard jsdom workaround

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (30 days — `motion` stable library; Canvas API stable)
