# Feature: Interactive 3D Spline Scene in Hero Section

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Add an interactive 3D Spline scene as a background/accent element in the hero section, inspired by the 21st.dev Spline Scene component. The 3D scene adds visual depth and a "whoa" factor that makes the site feel premium and immediately communicates "this is a tech company" to visitors. The existing hero layout (text left, ChatWidget right) stays intact — the Spline scene is layered behind or around the content as an ambient 3D element.

## User Story

As a site visitor
I want to see an interactive 3D element in the hero section
So that the site feels premium, modern, and immediately impressive

## Problem Statement

The hero section is text + chat widget on a flat `#fafaf9` background with only subtle radial gradients for depth. It looks clean but doesn't create a "wow" moment. An interactive 3D element adds the visual magnetism needed to keep visitors on the page.

## Solution Statement

Install `@splinetool/react-spline` and `@splinetool/runtime`, create a lazy-loaded SplineScene wrapper component, and embed it in the hero section as a background layer behind the existing content. The ChatWidget stays in the right column. The Spline scene fills the hero area behind the text, creating depth without obstructing the content. A Spotlight overlay adds a dynamic gradient effect.

**Design approach**: The Spline scene is positioned absolutely behind the hero content with reduced opacity and pointer-events-none so it doesn't interfere with the text or chat. It acts as an ambient background, not a competing element.

**Scene URL**: Use the robot scene from the 21st.dev example: `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`. This can be swapped later for a custom scene.

## Feature Metadata

**Feature Type**: Enhancement
**Estimated Complexity**: Medium
**Primary Systems Affected**: Hero component, package.json
**Dependencies**: `@splinetool/react-spline`, `@splinetool/runtime`

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `components/Hero.tsx` (full file) - Why: The hero component where the Spline scene will be integrated. Has staggered entrance animations, 5fr/4fr grid, ChatWidget on right.
- `app/globals.css` (full file) - Why: Contains all animation keyframes and CSS variables. May need a new animation or loading state.
- `DESIGN.md` (full file) - Why: Design constraints. No purple/violet. Emerald accent only. No gradient text. Asymmetric layouts mandatory.
- `package.json` (full file) - Why: Current dependencies. Need to add spline packages.
- `app/layout.tsx` (full file) - Why: Font setup (Outfit). The Spline scene must work within this layout.

### New Files to Create

- `components/SplineScene.tsx` - Lazy-loaded Spline wrapper component with loading state and error boundary

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [React-Spline GitHub](https://github.com/splinetool/react-spline)
  - Specific section: Installation, Next.js usage, lazy loading
  - Why: Primary library for embedding Spline 3D scenes

### Patterns to Follow

**Component pattern**: All components in this project are `"use client"` with React hooks. The SplineScene wrapper follows this pattern.

**Animation pattern**: Use the project's standard easing `cubic-bezier(0.16, 1, 0.3, 1)` for the scene fade-in.

**Loading pattern**: The ChatWidget uses a similar pattern — complex interactive content that loads asynchronously. The Spline scene should follow the same approach: render a placeholder during loading, then fade in.

---

## IMPLEMENTATION PLAN

### Phase 1: Dependencies

Install Spline packages.

### Phase 2: Create SplineScene Wrapper

Build a lazy-loaded, error-handled wrapper component for the Spline viewer.

### Phase 3: Integrate into Hero

Add the Spline scene as a background layer in the hero section behind the existing content. Keep the 5fr/4fr grid and ChatWidget intact.

### Phase 4: Responsive + Performance

Ensure the 3D scene is disabled on mobile (too heavy for mobile GPUs), has a smooth loading state, and doesn't block page interactivity.

---

## STEP-BY-STEP TASKS

### Task 1: ADD dependencies

- **IMPLEMENT**: Run `npm install @splinetool/react-spline @splinetool/runtime`
- **VALIDATE**: `node -e "require('@splinetool/react-spline'); console.log('OK')"`

---

### Task 2: CREATE `components/SplineScene.tsx`

- **IMPLEMENT**: A `"use client"` component that:
  1. Uses `React.lazy` + `Suspense` to lazy-load the Spline component
  2. Shows a subtle loading skeleton (just a div with the page background) while loading
  3. Wraps in an error boundary that renders nothing on failure (graceful degradation)
  4. Accepts `scene` (URL string) and `className` props
  5. Fades in with opacity transition when loaded (using `onLoad` callback from Spline)
  6. Has `pointer-events: none` by default so it doesn't capture mouse events from content above

```tsx
"use client";

import React, { Suspense, useState, useCallback } from "react";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

function SplineErrorBoundary({ children }: { children: React.ReactNode }) {
  // Simple error boundary using error state
  // On error, render nothing — graceful degradation
}

export default function SplineScene({
  scene,
  className = "",
}: {
  scene: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <div className={`${className} transition-opacity duration-1000 ease-smooth ${loaded ? "opacity-100" : "opacity-0"}`}>
      <Suspense fallback={null}>
        <Spline scene={scene} onLoad={onLoad} />
      </Suspense>
    </div>
  );
}
```

- **GOTCHA**: The Spline component MUST be in a `"use client"` component. It uses WebGL and cannot render on the server.
- **GOTCHA**: Use `React.lazy` for code splitting — the Spline runtime is ~500KB+ and should NOT be in the initial bundle.
- **GOTCHA**: The `onLoad` callback receives the Spline Application instance. We just need to know it loaded to trigger the fade-in.
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 3: UPDATE `components/Hero.tsx`

- **IMPLEMENT**:
  1. Import `SplineScene` component
  2. Add a state `const [showSpline, setShowSpline] = useState(false)` that becomes true after mount (delayed by 500ms to prioritize text/chat loading)
  3. Add the SplineScene as an absolutely positioned background layer BEHIND the hero content
  4. Position it on the right side of the hero, overlapping with and extending behind the ChatWidget area
  5. Use `pointer-events-none` on the Spline container so text/buttons/chat remain clickable
  6. On mobile (`max-lg`), hide the Spline scene entirely — too heavy for mobile GPUs
  7. Add a subtle opacity (60-70%) so the 3D doesn't overpower the content
  8. Keep ALL existing entrance animations unchanged

  Layout approach:
  ```
  <section> (relative)
    <!-- Existing ambient gradients -->
    <!-- NEW: Spline scene, absolutely positioned, right side, behind content -->
    <div class="absolute right-0 top-0 bottom-0 w-[55%] max-lg:hidden pointer-events-none opacity-60">
      <SplineScene scene="..." className="w-full h-full" />
    </div>
    <!-- Existing grid: text left (5fr), ChatWidget right (4fr) -->
  </section>
  ```

- **GOTCHA**: The Spline scene URL `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode` is the robot from 21st.dev. This can be swapped later. Consider using a more abstract/ambient scene that fits the emerald/dark aesthetic. If the robot doesn't fit the brand, search for alternative Spline community scenes.
- **GOTCHA**: Do NOT remove the existing ambient gradients — they provide the base visual layer when Spline is loading or on mobile.
- **GOTCHA**: The `z-index` ordering must be: Spline scene (lowest) → ambient gradients → hero content (highest). Use `z-0` for Spline, keep content at default or `relative z-10`.
- **GOTCHA**: The existing ChatWidget in the right column sits above the Spline scene. Both are in the same area but on different z-layers. The ChatWidget should be clearly readable over the 3D scene.
- **VALIDATE**: `npx next build 2>&1 | tail -10`

---

### Task 4: UPDATE `app/globals.css` (if needed)

- **IMPLEMENT**: If the Spline canvas needs specific styling overrides (like preventing it from stretching or adding a mask/fade at edges), add them here. Common needs:
  1. The Spline `<canvas>` element may need `width: 100% !important; height: 100% !important` to fill its container
  2. A gradient mask on the left edge of the Spline container to fade it into the text area smoothly

  ```css
  /* Spline scene edge fade */
  .spline-mask {
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%);
    mask-image: linear-gradient(to right, transparent 0%, black 30%);
  }
  ```

- **GOTCHA**: Only add CSS if needed after testing. The Spline component may work perfectly with just Tailwind classes.
- **VALIDATE**: `npx next build 2>&1 | tail -10`

---

## TESTING STRATEGY

### Manual Validation (Primary — 3D is visual)

1. Open http://localhost:3000
2. Verify the 3D scene loads in the hero background (right side)
3. Verify the scene fades in smoothly after loading
4. Verify ALL existing text, buttons, and ChatWidget remain fully interactive (clickable, hoverable)
5. Verify the ChatWidget demo conversation still auto-plays
6. Resize to mobile viewport — verify the Spline scene is hidden
7. Check the page doesn't scroll-jump or layout-shift during Spline loading
8. Verify the page still loads fast — the Spline scene should lazy-load AFTER the main content

### Performance Validation

1. Open DevTools → Network tab → reload
2. Verify the Spline runtime (~500KB) loads AFTER the initial page render (lazy loaded)
3. Verify Largest Contentful Paint (LCP) is not degraded — the text should still be the LCP element
4. Check GPU usage is reasonable (not pegging the GPU at 100%)

### Edge Cases

- Slow connection: Spline scene should gracefully not appear until loaded, no broken UI
- WebGL not supported: Error boundary renders nothing, page looks normal without 3D
- Ad blocker blocking Spline CDN: Graceful fallback to no 3D

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
npx tsc --noEmit
```

### Level 2: Build

```bash
npx next build
```

### Level 3: Manual Validation

1. `npx next dev --turbopack` → open http://localhost:3000
2. Verify 3D scene in hero
3. Verify mobile responsiveness (hide on mobile)
4. Verify all existing features still work

---

## ACCEPTANCE CRITERIA

- [ ] Spline 3D scene renders in the hero section background
- [ ] Scene is lazy-loaded and doesn't block initial page render
- [ ] Scene fades in smoothly after loading
- [ ] All existing hero content (text, buttons, ChatWidget) remains fully interactive
- [ ] Scene is hidden on mobile/tablet viewports (max-lg)
- [ ] Graceful degradation when WebGL is unavailable or scene fails to load
- [ ] Build passes with zero TypeScript errors
- [ ] No layout shift during scene loading
- [ ] Existing entrance animations work identically

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Build passes
- [ ] Manual testing confirms 3D scene works
- [ ] Mobile shows no 3D (performance)
- [ ] ChatWidget fully functional over the 3D layer

---

## NOTES

### Design Decisions

1. **Background layer, not replacement**: The Spline scene is ambient — it enhances the hero without replacing the chat widget or text. This follows the existing design philosophy of subtle depth (noise overlay, ambient gradients).

2. **Right-side positioning**: The scene is positioned on the right side overlapping with the ChatWidget area. This creates depth behind the chat without cluttering the text side.

3. **Hidden on mobile**: 3D WebGL is heavy on mobile GPUs and drains battery. The ambient gradients provide sufficient visual interest on mobile.

4. **Lazy loading**: The Spline runtime is ~500KB. Lazy loading ensures the critical content (text, chat) loads first. The 3D is a progressive enhancement.

5. **Scene choice**: The robot scene from 21st.dev is a placeholder. For production, consider:
   - A custom Spline scene with the emerald brand color
   - An abstract floating shape or particle system
   - A chat bubble / AI brain visualization
   - Something that reinforces the "AI assistant" concept

### Risks

- **Performance**: WebGL can be heavy. The `renderOnDemand={true}` prop (default) helps by only rendering when the scene changes.
- **Bundle size**: `@splinetool/runtime` is large (~500KB). Lazy loading mitigates first-load impact but it still downloads.
- **Scene loading time**: The `.splinecode` file must download from Spline's CDN. First load can take 2-5 seconds depending on connection.
- **WebGL compatibility**: Very old browsers may not support WebGL. The error boundary handles this gracefully.
