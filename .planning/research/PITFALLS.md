# Pitfalls Research

**Domain:** Animated randomizer toolkit (spinning wheel, dice roller, coin flipper) in React
**Researched:** 2026-03-26
**Confidence:** HIGH — most pitfalls are domain-specific, verified via multiple sources including official docs, community issue trackers, and React documentation.

---

## Critical Pitfalls

### Pitfall 1: Winner Detection Angle Mismatch

**What goes wrong:**
The wheel visually stops on one segment but the code awards a different item. The pointer appears to point at "Apple" but "Banana" is recorded as the winner.

**Why it happens:**
Developers calculate the winning segment by mapping `finalRotation % 360` to an item index, but forget two things: (1) the wheel's starting orientation adds an offset (often 90°, since canvas draws arcs from the rightmost point, not the top), and (2) CSS `transform: rotate()` and canvas `ctx.rotate()` use opposite sign conventions. Additionally, segment boundaries are shared — if the stop angle lands exactly on a boundary, the index can flip to the neighboring segment.

**How to avoid:**
Pre-determine the winning item before the animation starts using `Math.random()`, then calculate the exact stop angle for that item and animate to it — do not run the animation and then calculate the winner from the final angle. The formula is: `stopAngle = (targetIndex * segmentAngle) + (segmentAngle / 2)` with a safety margin of at least 1° inside each segment boundary. Always normalize angles to `[0, 360)` before mapping to segment indices.

**Warning signs:**
- Testing with a two-item wheel: if you always win the same item, the offset is wrong
- Off-by-one errors when you have exactly 4 or 8 items (common because 360/4=90 triggers exact boundary conditions)
- Pointer visual and announced winner disagree in any test case

**Phase to address:**
Wheel implementation phase — build the angle-to-winner mapping as a unit-tested pure function before wiring up the canvas animation.

---

### Pitfall 2: React Strict Mode Double-Fires Animations

**What goes wrong:**
In development, React 19 Strict Mode mounts → unmounts → remounts every component. Any `useEffect` with animation side effects (starting a `requestAnimationFrame` loop, writing to canvas, triggering CSS class changes) fires twice. The wheel starts spinning twice, the dice shakes before a roll is initiated, or the history log appends two identical entries on first load.

**Why it happens:**
React 18+ intentionally double-invokes effects in development to surface missing cleanup. This behavior is only in development (not production), but it exposes real bugs: an animation loop that was never cancelled, a `setTimeout`-based state change that fires when the component is already unmounted.

**How to avoid:**
Every `useEffect` that starts an animation loop must return a cleanup function that cancels it. For `requestAnimationFrame`: store the ID in a `useRef`, cancel it in the cleanup. For `setTimeout`/`setInterval`: same pattern. For canvas drawing: reset canvas state in cleanup. Use `useRef` (not `useState`) to track animation frame IDs — `useRef` changes do not trigger re-renders and survive across the mount/unmount/remount cycle.

```typescript
const rafRef = useRef<number>(0);
useEffect(() => {
  const animate = (timestamp: number) => {
    // draw frame
    rafRef.current = requestAnimationFrame(animate);
  };
  rafRef.current = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(rafRef.current);
}, []);
```

**Warning signs:**
- History shows duplicate first entries on page load
- Canvas flickers on initial mount
- Console shows animation-related state update warnings about unmounted components

**Phase to address:**
Each tool's animation implementation phase — enforce as a code review checklist item that every `useEffect` starting a loop has a corresponding cleanup.

---

### Pitfall 3: Interrupting In-Flight Animations via Rapid Clicks

**What goes wrong:**
A user clicks "Spin" while the wheel is still decelerating from a previous spin. Two animation loops run concurrently. Canvas frames from both loops are drawn in the same frame, producing a visual glitch. The final winner calculation fires twice, recording two history entries and removing two items from the wheel.

**Why it happens:**
A `isSpinning` guard on the button is added, but it is set via `useState`, which updates asynchronously. A second click within the same render cycle can bypass the check. Additionally, if the state setter and the animation loop are in different closures, the guard flag may be stale (classic stale closure).

**How to avoid:**
Use a `useRef` boolean for the in-flight guard, not `useState`. Refs update synchronously and are accessible inside closures without staling.

```typescript
const isSpinning = useRef(false);

const handleSpin = () => {
  if (isSpinning.current) return; // synchronous, no stale risk
  isSpinning.current = true;
  // start animation...
};
```
Disable the spin button visually using a `useState` flag (for UX), but gate the logic with the `useRef` flag.

**Warning signs:**
- History log accumulates two entries per rapid double-click
- Item list shrinks by 2 instead of 1 after a fast double-click
- Canvas visually judders with two overlapping rotation values

**Phase to address:**
Each tool's animation implementation phase — wire both the `useRef` logic guard and the `useState` UI disable together from the start.

---

### Pitfall 4: Winning Item Removed Before Animation Completes

**What goes wrong:**
The wheel "remove on hit" feature removes the winner from the item list at the moment the spin starts (or immediately when the random winner is picked), causing the canvas to redraw mid-animation with one fewer segment. The wheel redraws to a different size per segment while the spin animation is still playing, so the pointer lands on a visually wrong slice.

**Why it happens:**
Developers call `setItems(items.filter(...))` right after picking the winner, then pass `items` into the canvas draw loop via a closure. The closure captures the updated items array, causing the canvas to rerender with the new segment layout before the animation completes.

**How to avoid:**
Separate the "committed items" (what the canvas draws during animation) from the "current items" (the live state). Only apply the removal after the animation's `onComplete` callback fires. Store the items array used for the animation in a `useRef` that is set once at spin start and does not change during the animation.

**Warning signs:**
- Visible "snap" in segment size mid-spin
- Pointer lands on the wrong item visually when the list is short (3-4 items)
- Console shows the canvas `drawWheel` being called with different segment counts during a single spin

**Phase to address:**
Wheel implementation phase — specifically in the animation-to-state-update handoff design.

---

### Pitfall 5: localStorage Out of Sync With React State

**What goes wrong:**
The wheel item list initialises from `localStorage` inside `useState`'s initializer function, but a user opens two tabs. Tab 2 adds items, Tab 1 is still showing the old list. Tab 1 saves on unmount, overwriting Tab 2's additions.

A second mode of failure: the initial render uses the `useState` default (empty array), the component renders visually empty, then `useEffect` reads `localStorage` and calls `setItems`, causing a visible flash from empty to populated.

**Why it happens:**
Reading `localStorage` in `useEffect` (not in the `useState` initializer) delays hydration and causes a flash. Reading it in the `useState` initializer is synchronous and correct for single-tab use, but does not handle cross-tab changes. The `storage` event is rarely wired up.

**How to avoid:**
For this project's scope (single-tab, no SSR), read `localStorage` synchronously in the `useState` initializer — this is the simplest correct approach. Add a `window.addEventListener('storage', ...)` handler if multi-tab support matters. Always JSON.parse with a try/catch since corrupted localStorage values will throw.

```typescript
const [items, setItems] = useState<string[]>(() => {
  try {
    const stored = localStorage.getItem('wheel-items');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
});
```

**Warning signs:**
- Wheel renders empty for one frame then populates (indicates `useEffect` read instead of initializer read)
- Console errors like `SyntaxError: Unexpected token` from JSON.parse (corrupted storage value)
- Items disappear when browser localStorage is full (5MB limit — unlikely for this app but worth guarding)

**Phase to address:**
Wheel implementation phase — specifically the localStorage persistence task.

---

### Pitfall 6: Canvas Not Responding to DPI / Device Pixel Ratio

**What goes wrong:**
The spinning wheel looks blurry on retina/high-DPI displays. Text segment labels are unreadable on mobile devices. The wheel looks sharp in Chrome DevTools at 1x but blurry on an actual phone.

**Why it happens:**
Canvas elements have a logical size (CSS `width`/`height`) and a physical pixel size (`canvas.width`/`canvas.height` attributes). By default they match 1:1. On a 2x DPI screen, the canvas is stretched to fill twice as many physical pixels, and the browser interpolates, causing blur.

**How to avoid:**
Scale the canvas drawing context by `window.devicePixelRatio` at initialization and after any resize:

```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = cssWidth * dpr;
canvas.height = cssHeight * dpr;
ctx.scale(dpr, dpr);
```
Keep the CSS dimensions unchanged so layout is unaffected. Re-apply when the component resizes (use `ResizeObserver`).

**Warning signs:**
- Wheel looks pixelated/blurry on MacBook Pro or any OLED phone
- Text on wheel segments is readable at small sizes in Chrome on desktop but not on iOS Safari
- Screenshots taken on mobile show noticeably lower quality wheel than on desktop

**Phase to address:**
Wheel implementation phase — apply DPI scaling at canvas initialization, not as an afterthought.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-code canvas size (e.g. 500×500) | Simpler initial implementation | Wheel is wrong size on small screens; blurry on retina | Never — use CSS sizing + `ResizeObserver` from the start |
| Use `Math.random()` and map final angle to winner | Simple one-step logic | High risk of angle boundary bugs, wrong winner | Never — always pre-determine winner, then animate to it |
| Store entire history log in localStorage | Zero extra code | 5MB limit fills fast if entries are verbose; slow JSON serialization | Only store last N entries (e.g. 50 per tool) |
| Use `useState` for animation in-flight flag | Idiomatic React pattern | Stale closure allows double-trigger on rapid click | Never for animation guards — use `useRef` |
| Remove item immediately when spin starts | Simpler state logic | Canvas redraws mid-animation with fewer segments | Never — always defer removal to `onAnimationComplete` |
| Skip `prefers-reduced-motion` support | Saves development time | App causes motion sickness for sensitive users; accessibility failure | Never — add the media query early, it is a two-line addition |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Canvas + React | Mutating canvas context inside render function | Put all canvas drawing in `useEffect` or `useCallback`, never in the render body |
| Tailwind + CSS animations | Adding `animate-spin` (Tailwind's loading spinner class) to the wheel div, conflicting with custom rotation logic | Use custom `@keyframes` or JS-driven rotation via `style={{ transform }}`, never mix Tailwind animation utilities with imperative rotation |
| tw-animate-css + custom animations | Using animate-in/out presets that conflict with mid-animation state transitions | Reserve tw-animate-css for mount/unmount transitions; use JS-controlled transforms for in-progress wheel/dice/coin animations |
| localStorage + React state | Reading localStorage in `useEffect` (delayed hydration) instead of the `useState` initializer | Read synchronously in `useState(() => ...)` initializer for client-only apps with no SSR |
| `requestAnimationFrame` + `useState` | Calling `setState` inside every rAF tick to drive animation position | Store animation position in a `useRef`, call `setState` only once on completion to record the result |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Calling `setState` inside `requestAnimationFrame` loop | React schedules a re-render on every frame (60/sec), causing the entire component tree to re-render 60 times per second during spin | Store all mid-animation values in `useRef`; only call `setState` on animation completion | Immediately — visible jank on first spin with any real component tree |
| Full canvas redraw every frame without pre-rendering static layer | CPU spikes during wheel spin, especially with many segments | Pre-render the static wheel segments to an offscreen canvas once; in the animation loop, rotate and composite the offscreen canvas | Noticeable on mid-range mobile at >12 segments |
| Growing history array with no limit | UI slows down as history accumulates over a long session | Cap history at a fixed limit (e.g. 50 entries per tool) or use virtualized rendering | Becomes noticeable around 200+ entries in the DOM |
| Redrawing canvas on every React render (not just animation frames) | Canvas flickers when unrelated state changes cause re-render | Gate canvas redraws inside `useEffect` with dependencies scoped to animation state only | Any time a parent component re-renders (e.g. tab switching) |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No `prefers-reduced-motion` support | Users with vestibular disorders experience motion sickness; accessibility guidelines violated | Wrap all animations in `@media (prefers-reduced-motion: reduce)` to skip or shorten animations; show result immediately |
| Spin button not disabled during animation | User can spam-click and create race conditions or inflated history | Disable the button visually (and guard logically with `useRef`) for the animation duration |
| Wheel item text truncated or unreadable when segment is small | When many items are added, text overflows or overlaps — users can't see what they entered | Truncate text dynamically based on segment arc length; show a tooltip or popover on hover for full text |
| No empty-state handling for the wheel | Spin button still appears with 0 or 1 items; clicking causes a broken or trivial spin | Disable spin when `items.length < 2`; show a helper message when the list is empty |
| History log has no "clear" affordance | History grows across sessions and becomes noisy; users cannot start fresh | Add a "Clear history" button per tab; do not persist history to localStorage (keep it session-only) |
| Result announced only visually | Screen reader users do not know the outcome | Use `aria-live="polite"` on the result display element; update the text content when a result is determined |
| Coin flip shows final face immediately on fast devices | "Flip" feels instant rather than satisfying | Enforce a minimum animation duration (e.g. 800ms) regardless of perceived randomness speed |
| Multiple coins all show the same face | User configured 5 coins expecting variation; all land heads | Randomize each coin independently with a separate `Math.random()` call per coin |

---

## "Looks Done But Isn't" Checklist

- [ ] **Wheel winner detection:** The wheel looks right visually — verify that the announced winner matches the segment the pointer is actually on by testing with a 2-item list 20 times
- [ ] **Remove on hit:** Item removal looks correct with many items — verify the edge case where only 1 item remains (should the spin be disabled? the item should not be removed if it was the only one)
- [ ] **localStorage persistence:** Wheel items appear after page refresh — verify that corrupted JSON in localStorage does not crash the app (delete the key and re-add a garbage value manually)
- [ ] **DPI scaling:** Wheel looks sharp on desktop — verify on a physical mobile device (or Chrome DevTools at 3x DPR) that the wheel text is legible
- [ ] **Rapid click guard:** Spin appears to work correctly — verify that clicking Spin 3 times in rapid succession results in exactly 1 history entry and 1 item removed
- [ ] **Strict Mode cleanup:** Animations work in development — verify that no duplicate history entries appear on initial mount (Strict Mode double-fire check)
- [ ] **Reduced motion:** Animations play correctly for most users — verify the result is still shown (immediately) when `prefers-reduced-motion` is enabled in OS settings
- [ ] **Multiple coins:** Coin flip looks right for 1 coin — verify that 5 coins all flip independently and can produce mixed heads/tails results
- [ ] **Animation interruption:** Dice roll completes correctly — verify that switching tabs mid-animation does not cause state corruption (tab visibility change fires `visibilitychange` event)
- [ ] **History tab isolation:** Wheel history shows wheel results — verify that dice history only shows dice rolls, not results from other tabs

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong winner detection (angle mismatch) | HIGH | Rewrite winner selection to pre-determine winner before animation; add unit tests for the angle mapping function |
| Strict Mode double-fire bugs | LOW | Add cleanup functions to affected `useEffect` hooks; verify with React DevTools |
| Rapid-click race condition | LOW | Replace `useState` animation guard with `useRef`; test with rapid clicking |
| Item removed mid-animation | MEDIUM | Decouple animation items snapshot from live items state; requires refactor of wheel component data flow |
| localStorage crash on corrupted data | LOW | Wrap JSON.parse in try/catch; fall back to default value; add a "Reset items" escape hatch in UI |
| Canvas blur on retina | LOW | Apply DPR scaling at canvas init; no state or logic changes required |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Winner detection angle mismatch | Wheel canvas + animation phase | Unit test: spin 100 times, verify announced winner always matches visually indicated segment |
| Strict Mode double-fire | Each tool's animation phase | Dev build: check history log on first mount shows zero pre-populated entries |
| Rapid-click race condition | Each tool's animation phase | Manual test: click Spin button 5 times in 200ms, verify exactly 1 result recorded |
| Item removed mid-animation | Wheel implementation phase | Visual test: spin wheel with 3 items, confirm segment count does not change during spin |
| localStorage crash on corrupt data | Wheel persistence phase | QA: manually set localStorage key to `"not-json"`, reload, confirm no crash |
| Canvas DPI blur | Wheel canvas setup phase | Visual check on physical mobile device or Chrome 3x DPR emulation |
| No `prefers-reduced-motion` | Any animation phase (apply early) | OS setting: enable reduced motion, verify result appears instantly without animation |
| Multiple coins same face | Coin flip implementation phase | Test: flip 10 coins 10 times, verify results are not all identical |
| History not tab-isolated | Tabbed interface / history phase | Spin wheel, flip coin, verify wheel history tab shows only wheel results |

---

## Sources

- [FreeCodeCamp: Build Your Own Wheel of Names](https://www.freecodecamp.org/news/build-your-own-wheel-of-names/) — angle calculation approach and canvas sync patterns
- [Winwheel.js tutorial #13: Prize detection](http://dougtesting.net/winwheel/docs/tut13_prize_detection) — segment boundary edge case (shared startAngle/endAngle)
- [javascript-winwheel Issue #65: Segments overlap](https://github.com/zarocknz/javascript-winwheel/issues/65) — real-world segment calculation bug reports
- [CSS-Tricks: Using requestAnimationFrame with React Hooks](https://css-tricks.com/using-requestanimationframe-with-react-hooks/) — rAF + useRef cleanup pattern
- [React GitHub Issue #24502: useEffect runs twice in StrictMode](https://github.com/facebook/react/issues/24502) — Strict Mode double-invoke behavior
- [React Docs: StrictMode](https://react.dev/reference/react/StrictMode) — authoritative description of double-invoke behavior
- [MDN: Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) — DPR scaling, offscreen canvas, partial redraw
- [web.dev: Improving HTML5 Canvas performance](https://web.dev/canvas-performance/) — offscreen canvas pre-rendering technique
- [LogRocket: useEffect cleanup](https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/) — cleanup patterns and memory leak prevention
- [spinthewheel.cc: Why Is My Wheel Spin Biased?](https://spinthewheel.cc/blog/biased-spins/) — modulo/rounding bugs in RNG
- [CSS3 3D Transformations: backface-visibility](https://www.sitepoint.com/css3-transformations-3d-backface-visibility/) — preserve-3d pitfalls including multi-axis animation complexity
- [Sentry: React useEffect running twice](https://sentry.io/answers/react-useeffect-running-twice/) — Strict Mode guidance
- [RxDB: Using localStorage in Modern Applications](https://rxdb.info/articles/localstorage.html) — localStorage 5MB limit, JSON parse overhead
- [use-local-storage-state Issue #23](https://github.com/astoilkov/use-local-storage-state/issues/23) — localStorage hydration mismatch

---
*Pitfalls research for: Animated randomizer toolkit (spinning wheel, dice roller, coin flipper) in React*
*Researched: 2026-03-26*
