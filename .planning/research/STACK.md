# Stack Research

**Domain:** Animated randomizer UI (spinning wheel, dice roller, coin flipper) in React
**Researched:** 2026-03-26
**Confidence:** HIGH (core animation library verified via official docs; CSS techniques verified via multiple authoritative sources)

---

## Context: What Already Exists

The following are already installed and must NOT be re-added:

- React 19.2.0
- TanStack Router 1.150.0
- Tailwind CSS 4.1.17 + `@tailwindcss/vite`
- Shadcn / Radix UI
- tw-animate-css 1.4.0
- Vite 7.2.4
- TypeScript ~5.9.3
- clsx + tailwind-merge
- lucide-react

All new library choices must integrate cleanly with this stack.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `motion` (formerly framer-motion) | `^12.37.0` | Spinning wheel and coin flip animations | React 19-compatible, declarative API that fits React's component model, MIT license, 18 KB (smaller than GSAP at 23 KB), hardware-accelerated via native browser APIs, `useAnimate` hook gives imperative timeline control for sequenced spin-then-land animations. Official package renamed from `framer-motion` to `motion` in mid-2025. |
| HTML5 Canvas (built-in) | N/A | Render spinning wheel segments | Canvas is the correct primitive for a dynamically-segmented wheel: arbitrary segment count, radial text placement, and color fills without DOM thrashing. No library needed — just a `<canvas>` ref with `requestAnimationFrame`. |
| CSS 3D Transforms (built-in) | N/A | Dice roll and coin flip 3D illusion | `transform-style: preserve-3d`, `backface-visibility: hidden`, and `rotateX`/`rotateY` keyframe animations produce convincing 3D without a WebGL library. Tailwind v4's `@theme` block makes custom `@keyframes` first-class utilities. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none beyond core) | — | — | No additional libraries are required. Motion, Canvas, and CSS 3D are sufficient for all three randomizers. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Browser DevTools Performance tab | Profile animation frame rate | Verify 60 fps target during spin; catch dropped frames from canvas overdraw |
| React DevTools Profiler | Detect re-render cost | Ensure Canvas drawing happens in a `useEffect`/`useRef` loop, not on every React render |

---

## Installation

```bash
# From apps/web (or workspace root with -F flag)
pnpm add motion
```

That is the only new dependency. Verify the import path is `motion/react` (not `framer-motion`).

```ts
import { motion, useAnimate } from "motion/react"
```

---

## Implementation Patterns

### Spinning Wheel — Canvas + CSS rotation

**Render:** Use a `<canvas>` ref to draw segments with `ctx.arc` and `ctx.fillText`. Recalculate and redraw when the item list changes.

**Animate:** Apply a CSS `transform: rotate(Ndeg)` on the canvas wrapper element via Motion's `animate()` or `useAnimate`. The final angle is computed as `(targetSegmentMidpoint + extraFullSpins * 360)`. Use `easeOut` or a cubic-bezier deceleration curve to simulate momentum.

**Why not a pre-built wheel library:** Available npm packages (`react-wheel-of-prizes`, `@mertercelik/react-prize-wheel`) are lightly maintained, opinionated about styling, and conflict with Tailwind + Shadcn. Custom Canvas costs ~80 lines of code and gives full control over colors, fonts, and removal logic.

### Dice Roll — CSS 3D cube faces

**Render:** Six `<div>` faces positioned with Tailwind's `translate-z-*` and `rotate-*` utilities or inline CSS transforms (Tailwind v4 does not yet ship `translateZ` as a utility; use inline style or a tiny CSS class).

**Animate:** Define a `@keyframes spin-dice` in the app's CSS (inside `@theme` for Tailwind utility generation, or bare `@keyframes` for one-off use) that spins the cube rapidly, then Motion's `animate()` resolves to the correct face rotation. Alternatively, use React state to flip through faces at 100 ms intervals for 1 second, then snap — simpler and still looks good.

**Why not `react-dice-complete` or `dice-box`:** `react-dice-complete` is unmaintained (last commit 2019). `dice-box` is a full BabylonJS/AmmoJS 3D physics engine — gross overkill for a standard 6-sided die.

### Coin Flip — CSS 3D card flip

**Render:** Two absolutely-positioned face divs (heads/tails) inside a `preserve-3d` wrapper. Back face uses `rotateY(180deg)` + `backface-visibility: hidden`.

**Animate:** A `@keyframes flip-coin` rotates the wrapper many full turns (e.g. 2520° for heads, 2340° for tails) via `rotateX`. Motion animates the rotation value and resolves to a final resting angle. The multiple-full-turns trick is what creates the "multiple flips" illusion.

**Define keyframes in CSS:** Use Tailwind v4's `@theme` block so the flip animation becomes an `animate-flip-coin` utility class. tw-animate-css's built-in `spin-in/out` utilities are enter/exit only and not suitable for sustained multi-turn coin flip animations.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `motion` (MIT) | GSAP (closed-source) | GSAP is better for scroll-linked timelines, SVG morphing, and multi-step cinematic sequences. This project has none of those needs. GSAP's imperative ref-based API also creates friction in a React component model. |
| `motion` | React Spring | React Spring's spring-physics model is excellent for drag/gesture-driven animations. For a spin wheel, spring physics fights you — you need a deterministic final angle, not physics that overshoots. |
| Custom Canvas wheel | `react-wheel-of-prizes` / `@mertercelik/react-prize-wheel` | Only if timeline is extremely tight and no custom styling is needed. Both libraries have opinionated color/font handling that clashes with the existing Tailwind + Shadcn design system. |
| CSS 3D dice | `dice-box` (BabylonJS) | Only if a photorealistic 3D physics simulation is explicitly required. Adds ~2 MB to the bundle for a casual randomizer. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `framer-motion` (old package name) | Superseded by `motion` package in 2025; framer-motion on npm is now a redirect shim. Using the old name creates confusion and may pull in stale typings. | `motion` with `import { motion } from "motion/react"` |
| `react-dice-complete` | Last commit 2019, no React 19 support, abandoned. | Custom CSS 3D cube (80–100 lines) |
| `dice-box` | BabylonJS + AmmoJS physics — ~2 MB bundle bloat for a standard D6. | CSS 3D transforms |
| `react-wheel-of-prizes` / `react-prize-wheel` | Opinionated styling that overrides Tailwind; poor TypeScript coverage; low maintenance signals. | Custom Canvas implementation |
| D3.js for wheel rendering | D3 is a data visualization framework (300+ KB). Using it for a pie-chart-shaped wheel is importing a freight train to drive a nail. | Native Canvas 2D API (`ctx.arc`, `ctx.fillText`) |
| GIF / video animations | Not interactive, cannot reflect actual random result in real time. | CSS/JS animations tied to runtime random value |

---

## Stack Patterns by Variant

**If you want the smoothest possible deceleration on the wheel spin:**
- Use Motion's `useAnimate` with `transition: { duration: 4, ease: [0.17, 0.67, 0.35, 0.99] }` (cubic-bezier ease-out)
- The cubic-bezier values simulate fast initial spin slowing dramatically near the end

**If you prefer zero JS animation library (pure CSS only):**
- Define `@keyframes spin-wheel` in `@theme` for Tailwind utility generation
- Trigger via class toggle from React state
- Limitation: Cannot easily target a specific final angle — works for "spin and stop randomly" but not "land exactly on item X"

**For the coin flip specifically:**
- Define the keyframe natively in CSS (not Motion animate) — a fixed `rotateX(2520deg)` CSS animation is simpler than computing rotation imperatively
- Use Motion only to trigger/sequence the animation start and listen for completion via `onAnimationComplete`

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `motion@^12.37.0` | React 19.x | React 19 requires motion v12+. v11 and below are not compatible. |
| `motion@^12.37.0` | Vite 7 | No known incompatibilities. Tree-shaking works correctly with Vite's ESM bundling. |
| `tw-animate-css@1.4.0` | Tailwind CSS v4 | Already installed. Use for enter/exit transitions; define custom `@keyframes` in `@theme` for sustained animations (spin, flip). |

---

## Sources

- [motion.dev — Official docs](https://motion.dev/docs/react-quick-start) — Package name, version 12.37.0, React 19 compatibility confirmed
- [motion.dev — Installation guide](https://motion.dev/docs/react-installation) — `pnpm add motion`, import from `motion/react`
- [motion.dev — GSAP vs Motion comparison](https://motion.dev/docs/gsap-vs-motion) — Bundle size (18 KB motion vs 23 KB GSAP), hardware acceleration, licensing comparison
- [github.com/Wombosvideo/tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) — tw-animate-css v1.4.0 capabilities, spin-in/out scope confirmed
- [dev.to — 3D Dice in CSS](https://dev.to/dailydevtips1/creating-a-3d-dice-in-css-3ad5) — `preserve-3d`, `backface-visibility`, face rotation transforms
- [dev.to — 3D Flipping Coin](https://dev.to/shahibur_rahman_6670cd024/build-a-3d-flipping-coin-with-html-css-javascript-deep-dive-26h2) — Multi-turn rotateX keyframe technique
- [dev.to — Canvas Wheel of Prize](https://dev.to/sababg/custom-wheel-of-prize-with-canvas-589h) — Custom canvas implementation pattern
- WebSearch (MEDIUM confidence) — Ecosystem survey of available npm packages and their maintenance status

---

*Stack research for: Randomizer Toolkit (spinning wheel, dice roller, coin flipper)*
*Researched: 2026-03-26*
