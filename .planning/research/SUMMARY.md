# Project Research Summary

**Project:** Randomizer Toolkit (Spinning Wheel, Dice Roller, Coin Flipper)
**Domain:** Animated client-side randomizer SPA in React
**Researched:** 2026-03-26
**Confidence:** HIGH

## Executive Summary

This is a client-side-only, animated randomizer toolkit built in React with three distinct tools — a spinning wheel, a dice roller, and a coin flipper — all living behind a tabbed interface inside an existing authenticated React SPA. Research confirms that the correct approach is to build each tool as a self-contained tab container backed by a dedicated custom hook, with leaf components that are purely presentational. No backend, no external state manager, and only one new dependency (`motion@^12`) are required. The existing stack (React 19, Tailwind v4, Shadcn, tw-animate-css) covers nearly all needs; the wheel spin animation benefits from `motion/react` for deterministic deceleration to a specific landing angle, while the dice and coin animations are best handled with CSS 3D transforms and `@keyframes` at zero additional dependency cost.

The recommended approach centres on pre-determining the random outcome before starting any animation, then driving the animation to that known result. This single architectural decision eliminates the most common and most expensive class of bugs in this domain (angle mismatch between visual pointer and announced winner). The spinning wheel uses HTML5 Canvas for rendering, which is the correct primitive for dynamic segment counts — DOM-based approaches thrash the layout engine on every redraw. CSS `preserve-3d` with `backface-visibility: hidden` is the standard, dependency-free approach for dice and coin 3D flip illusions.

The primary risks are: (1) angle calculation bugs in the wheel that misalign the visual result with the recorded winner — mitigated by unit-testing the angle mapping function before wiring animation; (2) React Strict Mode double-firing animation effects in development — mitigated by rigorous `useEffect` cleanup with `cancelAnimationFrame`; and (3) rapid-click race conditions that corrupt history or item counts — mitigated by using `useRef` (not `useState`) as the in-flight animation guard. None of these risks are novel; all have well-documented prevention patterns.

---

## Key Findings

### Recommended Stack

The project already has React 19, Tailwind v4, Shadcn/Radix, tw-animate-css, Vite 7, and TypeScript installed. The only new dependency is `motion@^12.37.0` (formerly `framer-motion`, renamed mid-2025), which provides `useAnimate` for deterministic wheel spin-down to a precise target angle. It is React 19-compatible and smaller than GSAP (18 KB vs 23 KB). Do not use the old `framer-motion` package name — it is now a redirect shim.

HTML5 Canvas (no library) is the correct primitive for the spinning wheel: dynamic segment counts, radial text placement, and per-frame rotation are all handled natively without DOM thrashing. CSS 3D transforms (`transform-style: preserve-3d`, `backface-visibility: hidden`, `rotateX`/`rotateY`) are sufficient for dice and coin — no WebGL or physics engine is needed, and no library beyond what is already installed.

**Core technologies:**
- `motion@^12.37.0`: Wheel spin deceleration animation — React 19-compatible declarative API; `useAnimate` for imperative timeline targeting a pre-calculated stop angle
- HTML5 Canvas (built-in): Spinning wheel rendering — correct for dynamic segment count, radial text, 60fps rotation without DOM overhead
- CSS 3D Transforms (built-in): Dice and coin flip illusions — `preserve-3d` + `backface-visibility: hidden` + `rotateX`/`rotateY` keyframes; zero extra dependencies
- Tailwind v4 `@theme` block: Custom `@keyframes` for sustained animations (coin flip multi-turn rotation, dice spin); existing `tw-animate-css` covers mount/unmount transitions only

**What not to use:** `react-wheel-of-prizes`, `react-dice-complete` (abandoned), `dice-box` (BabylonJS physics overkill at ~2 MB), `react-spring` (physics model fights deterministic landing angle), D3.js (300 KB for a pie-chart shape is unreasonable).

### Expected Features

Research against live competitors (Wheel of Names, Picker Wheel, flipsimu.com) confirms a clear MVP feature set with well-understood user expectations.

**Must have (table stakes):**
- Tabbed interface (Wheel / Dice / Coin) — expected navigation structure for multi-tool apps
- Wheel: custom item entry + spin animation with eased deceleration — core product identity
- Wheel: remove-on-hit after each spin + manual reset — standard in every major wheel app; explicitly required in PROJECT.md
- Wheel: localStorage persistence for item list — users expect their list to survive tab close
- Dice: 1-6 dice selector + CSS roll animation + sum total display — all competitors support this; single-die-only feels broken
- Coin: 1-N coin selector + CSS 3D flip animation + heads/tails count display — table stakes for coin flipper tools
- Result history log per tab (append-only, newest at top) — present in every reference app

**Should have (competitive differentiators):**
- Smooth cubic-bezier deceleration on wheel spin (makes the tool feel premium vs. mechanical)
- All dice animate simultaneously on roll (parallel animation looks more satisfying than sequential)
- Wheel item count badge ("X items remaining") — drives engagement during sequential draws
- Individual die pip face icons (SVG/CSS dots vs. flat numbers)
- Coin tally over session ("5H 3T across 8 flips") derived from existing history array

**Defer (v2+):**
- Sound effects — browser autoplay policy makes this non-trivial; add as opt-in toggle only after v1 is solid
- Export/import wheel lists — covers cross-device use case without accounts
- Custom dice types (D4, D8, D12, D20) — clear demand but significant scope expansion
- Probability/statistics view — educational value but detracts from casual feel

**Anti-features (do not build in v1):** Cloud sync/accounts, URL sharing, weighted segments, confetti libraries, dark mode toggle as a v1 explicit feature (audit if Tailwind/Shadcn scaffold already handles `prefers-color-scheme`).

### Architecture Approach

The architecture is a clean container/leaf component hierarchy with logic fully extracted into custom hooks. `RandomizerPage` is a stateless tab shell. Each tab (`WheelTab`, `DiceTab`, `CoinTab`) is a container that owns its state via a dedicated hook (`useWheel`, `useDice`, `useCoin`). All leaf components (`WheelCanvas`, `Die`, `Coin`, `ResultHistory`) are purely presentational — they receive values and callbacks as props and emit no events beyond the callbacks passed to them. All randomizer logic, history management, and localStorage sync live in `apps/web/src/lib/randomizer/`. No new layout wrapper, no new `packages/` entry, no external state manager.

**Major components:**
1. `RandomizerPage` — Shadcn `<Tabs>` shell; no state; renders the three tab containers
2. `WheelTab` / `DiceTab` / `CoinTab` — state orchestrators; each calls its dedicated hook and wires props to leaf components
3. `WheelCanvas` — HTML5 Canvas renderer; holds `canvasRef`; runs `requestAnimationFrame` loop reacting to `spinning` prop; calls `onSpinEnd(winner)` when animation completes
4. `Die` / `Coin` — CSS 3D animated leaf components; stateless; apply animation class from `rolling`/`flipping` boolean prop
5. `ResultHistory` — shared scrollable log; receives `history` array as prop; used by all three tab containers
6. `useWheel` / `useDice` / `useCoin` — custom hooks encapsulating state machine, animation flag, random value generation, and history append; each composes the shared `useHistory` hook
7. `randomizer.ts` / `localStorage.ts` — pure utility functions with no React dependencies; unit-testable in isolation

**Key data flow rule:** Pre-determine the winner using `Math.random()` before the animation starts, then compute the target stop angle and animate to it. Never run the animation first and derive the winner from the final angle.

### Critical Pitfalls

1. **Winner detection angle mismatch** — Pre-determine the winning item with `Math.random()` before the animation starts; calculate `stopAngle = (targetIndex * segmentAngle) + (segmentAngle / 2)` with a 1° safety margin; unit-test the angle mapping with 100 spins before wiring canvas animation.

2. **React Strict Mode double-fires animation effects** — Every `useEffect` that starts a `requestAnimationFrame` loop or `setTimeout` must return a cleanup function; store rAF IDs in `useRef`, not `useState`; verify by checking for duplicate history entries on first mount in development.

3. **Rapid-click race condition corrupts history/item count** — Use `useRef` (not `useState`) as the in-flight animation guard; `useRef` updates synchronously and never stales in closures; pair with a `useState` flag only for the visual button-disabled state.

4. **Winning item removed before animation completes** — Store the items snapshot used for animation in a `useRef` at spin start; only call `setItems(items.filter(...))` in the `onSpinEnd` callback, never at spin initiation; canvas draws from the frozen ref, not the live state.

5. **Canvas blur on retina/high-DPI displays** — Apply `window.devicePixelRatio` scaling at canvas initialization: set `canvas.width/height = cssSize * dpr`, then `ctx.scale(dpr, dpr)`; use `ResizeObserver` to reapply on resize; apply from the start, not as an afterthought.

6. **localStorage crash on corrupted data** — Read synchronously in `useState(() => { try { JSON.parse(...) } catch { return [] } })` initializer, not in `useEffect`; the initializer approach eliminates the empty-flash bug and the try/catch guards against corrupt values.

---

## Implications for Roadmap

The dependency graph is clear and dictates build order. Pure utilities have no dependencies and must come first. Hooks depend on utilities and compose `useHistory`. Leaf components depend on hooks being defined. Tab containers wire hooks to leaf components. The page shell and route are assembled last.

### Phase 1: Foundation — Utilities, Hooks, and Shared Infrastructure

**Rationale:** Every other component depends on these. Building them first and testing them in isolation eliminates the entire class of angle-mismatch and history-append bugs before any UI exists.
**Delivers:** `randomizer.ts` (pure random functions), `useHistory.ts` (generic append-only log), `localStorage.ts` (try/catch read/write helper), `ResultHistory.tsx` (shared display component), TanStack Router route file (`randomizer.tsx`) with empty page scaffold.
**Addresses:** Table-stakes tabbed interface structure; localStorage persistence foundation; result history per tab.
**Avoids:** Winner detection angle bugs (angle mapping is a unit-tested pure function by end of this phase); localStorage crash (try/catch baked in from the start).
**Research flag:** Standard patterns — no deeper research needed.

### Phase 2: Spinning Wheel

**Rationale:** The wheel is the most complex tool (Canvas, DPI scaling, angle math, localStorage, remove-on-hit). Building it second gives it full attention before simpler tools are added.
**Delivers:** `useWheel.ts` (items state, spin logic, localStorage sync, history append), `WheelCanvas.tsx` (Canvas renderer with DPR scaling and rAF loop), `ItemList.tsx` (editable item list), `WheelControls.tsx` (spin + reset buttons), `WheelTab.tsx` (container wiring all of the above).
**Uses:** `motion@^12.37.0` for deceleration curve targeting pre-calculated stop angle; HTML5 Canvas 2D API.
**Implements:** Pre-determine-winner-then-animate pattern; `useRef` in-flight guard; animation-snapshot items ref; DPR scaling at init.
**Avoids:** All 6 critical pitfalls apply here — this phase addresses all of them.
**Research flag:** No deeper research needed — patterns are well-documented and verified in ARCHITECTURE.md. Unit-test angle mapping before canvas integration.

### Phase 3: Dice Roller

**Rationale:** Simpler than the wheel (no Canvas, no localStorage, straightforward CSS animation). Can be built with high confidence using patterns established in Phase 2.
**Delivers:** `useDice.ts` (count state, roll logic, animation flag, history append), `Die.tsx` (CSS 3D cube face), `DiceGrid.tsx` (renders 1-6 Die instances), `DiceControls.tsx` (roll button + count selector), `DiceTab.tsx` (container).
**Uses:** CSS 3D transforms (`preserve-3d`, `backface-visibility: hidden`); Tailwind v4 `@keyframes` for dice spin; `ANIMATION_DURATION_MS` constant shared between CSS and `setTimeout`.
**Implements:** Simultaneous parallel animation on all dice; `useRef` in-flight guard; Strict Mode cleanup for `setTimeout`.
**Avoids:** Strict Mode double-fire (cleanup function on setTimeout); rapid-click race condition (useRef guard).
**Research flag:** Standard patterns — no deeper research needed.

### Phase 4: Coin Flipper

**Rationale:** Simplest tool — same CSS 3D pattern as dice but with only two faces and a multi-turn rotation. Builds on all patterns already proven in Phases 2-3.
**Delivers:** `useCoin.ts` (count state, flip logic, animation flag, history append), `Coin.tsx` (CSS 3D two-face flip), `CoinGrid.tsx` (renders 1-N Coin instances), `CoinControls.tsx` (flip button + count selector), `CoinTab.tsx` (container).
**Uses:** CSS `@keyframes flip-coin` defined in Tailwind v4 `@theme` block using multi-turn `rotateX` (e.g. 2520° for heads, 2340° for tails); each coin gets independent `Math.random()` call.
**Implements:** Per-coin independent randomization; minimum animation duration of ~800ms.
**Avoids:** All coins showing same face (independent RNG per coin); animation interruption on tab switch.
**Research flag:** Standard patterns — no deeper research needed.

### Phase 5: Polish and Differentiators

**Rationale:** Core value is proven across all three tools. Now add the differentiating features that elevate user experience without scope risk.
**Delivers:** Die pip face icons (SVG/CSS dot layouts), wheel item count badge ("X items remaining"), coin session tally ("5H 3T across 8 flips"), `prefers-reduced-motion` support across all tools, aria-live announcements on result display, empty-state for wheel when all items removed.
**Addresses:** All P2 features from FEATURES.md; accessibility requirements from PITFALLS.md UX section.
**Avoids:** Accessibility failures (vestibular disorder risk from unsuppressed animation); screen reader users missing results.
**Research flag:** `prefers-reduced-motion` is a two-line CSS media query — no research needed. SVG pip layouts are well-documented.

### Phase Ordering Rationale

- Pure utilities first because every hook depends on them; unit-testing them before any UI saves debugging time across all subsequent phases.
- Wheel second because it has the highest complexity (Canvas, DPI, angle math, localStorage, remove-on-hit) and the most critical pitfalls — solving it first means later tools reuse proven patterns.
- Dice and coin in ascending simplicity order — each tool's pattern is a subset of the wheel's, so implementation is fast and confident.
- Polish last because it requires functioning core tools to validate against; adding accessibility without a working animation is meaningless.
- The `motion` library is only installed for the wheel spin deceleration; dice and coin use zero new dependencies — this keeps the bundle minimal.

### Research Flags

Phases with standard patterns (skip research-phase):
- **Phase 1:** Pure React hooks and localStorage — entirely standard patterns; no novel integration.
- **Phase 2:** Canvas + motion animation — patterns fully documented in ARCHITECTURE.md and STACK.md; angle math is a pure function verifiable by unit test.
- **Phase 3:** CSS 3D dice — standard CSS transform technique; well-documented across multiple authoritative sources.
- **Phase 4:** CSS 3D coin flip — standard multi-turn rotateX technique; no unknowns.
- **Phase 5:** Polish and accessibility — established patterns; `prefers-reduced-motion` is two lines of CSS.

No phases in this project are flagged as needing `/gsd:research-phase` during planning. All technology choices are verified against official documentation and live implementations.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | `motion@^12.37.0` verified against official motion.dev docs; React 19 compatibility confirmed; Canvas and CSS 3D approaches verified via multiple authoritative implementation guides |
| Features | HIGH | Feature set validated against three live competitor products (Wheel of Names, Picker Wheel, flipsimu.com); feature expectations are well-established in this domain |
| Architecture | HIGH | Container/leaf + custom hook pattern is standard React architecture; Canvas-in-useRef pattern verified against MDN and React docs; build order is derived from concrete dependency graph |
| Pitfalls | HIGH | Critical pitfalls verified via official React docs (Strict Mode), MDN (Canvas DPR), real-world GitHub issues (angle calculation bugs, localStorage hydration), and CSS-Tricks (rAF + useRef pattern) |

**Overall confidence:** HIGH

### Gaps to Address

- **Tailwind v4 `@theme` block `@keyframes` integration:** Research confirms this is the correct location for custom sustained animations, but exact Tailwind v4 syntax for arbitrary `rotateX`/`rotateY` keyframe utilities should be validated against the project's actual Tailwind config during Phase 3-4 implementation. Fallback: define `@keyframes` as a bare CSS rule outside `@theme` — equally valid.
- **`motion` wheel deceleration tuning:** The cubic-bezier values `[0.17, 0.67, 0.35, 0.99]` cited in STACK.md are a starting point; the exact feel requires in-browser tuning during Phase 2. This is expected and does not represent a research gap.
- **`prefers-reduced-motion` + existing Shadcn scaffold:** Whether the existing scaffold already handles this globally is unknown; audit during Phase 5 before adding redundant overrides.
- **Dark mode:** FEATURES.md flags that the existing Tailwind + Shadcn setup may already handle system `prefers-color-scheme`. Audit the scaffold before treating this as a feature to build; it may already be free.

---

## Sources

### Primary (HIGH confidence)

- [motion.dev — Official docs](https://motion.dev/docs/react-quick-start) — Package name `motion`, version 12.37.0, React 19 compatibility, import path `motion/react`
- [motion.dev — GSAP vs Motion comparison](https://motion.dev/docs/gsap-vs-motion) — Bundle size comparison, hardware acceleration, licensing
- [React Docs — StrictMode](https://react.dev/reference/react/StrictMode) — Double-invoke behavior, cleanup requirements
- [MDN — Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) — DPR scaling, offscreen canvas technique
- [TanStack Router overview](https://tanstack.com/router/v1/docs/framework/react/overview) — Client-first routing, route file conventions

### Secondary (MEDIUM confidence)

- [Wheel of Names](https://wheelofnames.com/) — Live competitor feature analysis
- [Picker Wheel](https://pickerwheel.com/) — Live competitor feature analysis
- [flipsimu.com](https://flipsimu.com/) — Live competitor feature analysis (coin flip + dice)
- [FreeCodeCamp: Build Your Own Wheel of Names](https://www.freecodecamp.org/news/build-your-own-wheel-of-names/) — Angle calculation approach and canvas sync patterns
- [CSS-Tricks: Using requestAnimationFrame with React Hooks](https://css-tricks.com/using-requestanimationframe-with-react-hooks/) — rAF + useRef cleanup pattern
- [dev.to — Custom Wheel of Prize with Canvas](https://dev.to/sababg/custom-wheel-of-prize-with-canvas-589h) — Canvas implementation reference
- [dev.to — 3D Dice in CSS](https://dev.to/dailydevtips1/creating-a-3d-dice-in-css-3ad5) — `preserve-3d`, `backface-visibility`, face rotation transforms
- [dev.to — 3D Flipping Coin](https://dev.to/shahibur_rahman_6670cd024/build-a-3d-flipping-coin-with-html-css-javascript-deep-dive-26h2) — Multi-turn rotateX keyframe technique
- [github.com/Wombosvideo/tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) — tw-animate-css v1.4.0 scope (enter/exit only, not sustained animations)
- [javascript-winwheel Issue #65](https://github.com/zarocknz/javascript-winwheel/issues/65) — Real-world segment calculation bug reports

### Tertiary (MEDIUM-LOW confidence)

- Web search: "spinning wheel randomizer app features 2026" — Ecosystem survey confirming feature expectations
- Web search: "coin flipper web app features animation multi coin 2026" — Ecosystem survey
- Web search: "dice roller app features multiple dice sum display animation UX 2025" — Ecosystem survey

---

*Research completed: 2026-03-26*
*Ready for roadmap: yes*
