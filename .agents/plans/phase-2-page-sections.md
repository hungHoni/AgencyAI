# Feature: Phase 2 — Page Sections

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Build all visual sections for the AgencyAI single-page marketing website. This phase transforms the placeholder `app/page.tsx` into a fully designed page with 8 content sections: Hero (with static chatbot preview), Metrics bar, Capabilities, Services, How It Works, CTA Banner, Contact Form (UI only — backend is Phase 3), and real copy throughout. Every section must pixel-match `wireframe-v2.html` and follow the design system in `DESIGN.md`.

## User Story

As a solo founder building an AI chatbot agency
I want a professional, polished single-page marketing site
So that I can paste the URL into 20 cold DMs to local dentists with confidence

## Problem Statement

Phase 1 delivered the foundation (Next.js 16, Tailwind v4, Nav, Footer, design tokens). The page currently shows a "Sections coming in Phase 2" placeholder. The founder needs all marketing sections built with real copy, responsive layouts, hover effects, and the chatbot preview — so the site looks credible enough for a local business owner to trust.

## Solution Statement

Build 8 React Server Components (+ 1 Client Component for the contact form) that implement the exact layouts, typography, colors, spacing, and interactions defined in `wireframe-v2.html`. Use Tailwind v4 utility classes with the custom design tokens already configured in `globals.css`. All sections are Server Components except `ContactForm.tsx` (which needs form state). The chatbot preview in the hero is a **static mockup** for Phase 2 — it becomes the real AI chatbot in Phase 4.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: `components/` directory, `app/page.tsx`
**Dependencies**: None (all design tokens and foundation already in place from Phase 1)

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING!

- `wireframe-v2.html` (full file) — **Source of truth.** Every section's exact HTML structure, CSS, copy, icons, grid layouts, spacing, hover effects, responsive breakpoints. The implementation must pixel-match this file.
- `DESIGN.md` (full file) — Design system tokens, anti-slop rules, component patterns. Read before every component.
- `app/globals.css` (full file) — Tailwind v4 `@theme inline` tokens. All custom utilities: `rounded-card`, `rounded-btn`, `shadow-card`, `shadow-elevated`, `ease-smooth`, `duration-400`, `max-w-site`. Also CSS custom properties (`:root`) and the `breathe` keyframe animation.
- `app/page.tsx` (full file) — Current placeholder. Replace the placeholder div with section component imports.
- `app/layout.tsx` (full file) — Root layout with Outfit font variable `--font-outfit`, metadata, Analytics. Shows the import pattern.
- `components/Nav.tsx` (full file) — **Pattern reference.** Shows exact Tailwind class conventions: `bg-[#fafaf9]/85`, `backdrop-blur-[16px]`, `rounded-btn`, `ease-smooth`, `duration-400`, `max-sm:` responsive prefix, `hover:-translate-y-px`, `active:scale-[0.98]`.
- `components/Footer.tsx` (full file) — Shows `max-w-site` usage, responsive `max-sm:flex-col` pattern.
- `implementation-plan.md` — Phase 2 task list and component structure reference.
- `design-doc.md` — Full design document with visual direction, chatbot preview spec, button specs, and responsive rules.

### New Files to Create

- `components/Hero.tsx` — Hero section with headline, CTAs, and chatbot preview
- `components/ChatPreview.tsx` — Static chatbot mockup (dark card, conversation bubbles, breathing dot)
- `components/Metrics.tsx` — 4-stat bar (24/7, ~80%, Zero, No code)
- `components/Capabilities.tsx` — 2-col grid with icon+text capability cards
- `components/Services.tsx` — Asymmetric 2fr/1fr grid with dark hero card spanning 2 rows
- `components/HowItWorks.tsx` — 3 steps with connecting line
- `components/CtaBanner.tsx` — Dark section CTA with radial gradient
- `components/ContactForm.tsx` — `'use client'` — split layout (info left, form card right), validation, success/error states

### Relevant Documentation — READ BEFORE IMPLEMENTING!

- Tailwind CSS v4 docs: uses `@theme inline` in CSS, NOT `tailwind.config.ts`. Custom utilities like `rounded-card` are defined via `--radius-card` in `@theme inline`.
- Next.js 16 App Router: Server Components by default, `'use client'` directive only on components with state/effects.
- SVG icons: All icons are inline SVG, stroke-based (no fill), viewBox="0 0 24 24", stroke-width 1.8, stroke-linecap round, stroke-linejoin round. Exact SVG paths are in `wireframe-v2.html`.

### Patterns to Follow

**Import Pattern** (from Nav.tsx):
```tsx
import Link from "next/link";
export default function ComponentName() { ... }
```

**Tailwind Class Convention** (from Nav.tsx):
- Use Tailwind built-in classes where possible: `text-zinc-900`, `bg-emerald-500`, `text-sm`, `font-semibold`
- Use CSS custom properties via arbitrary values for non-standard values: `bg-[#fafaf9]/85`, `backdrop-blur-[16px]`
- Use custom theme tokens: `rounded-btn`, `rounded-card`, `shadow-card`, `shadow-elevated`, `ease-smooth`, `duration-400`, `max-w-site`
- Responsive: `max-sm:` for mobile (<640px), `lg:` for desktop (>=1024px), `max-lg:` for below desktop
- Hover/active: `hover:-translate-y-px`, `hover:bg-zinc-700`, `active:translate-y-0`, `active:scale-[0.98]`
- Transitions: `transition-all duration-400 ease-smooth`

**Section Container Pattern:**
```tsx
<section className="max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16">
```

**Section Header Pattern:**
```tsx
<div className="text-xs font-semibold text-emerald-600 tracking-[1.2px] uppercase mb-3">
  Section Label
</div>
<h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 max-w-[520px]">
  Section Title
</h2>
<p className="text-base text-zinc-600 max-w-[480px] leading-[1.7] mb-14">
  Section description text.
</p>
```

**Button Patterns:**
- Primary (dark): `bg-zinc-900 text-[#fafaf9] px-7 py-3.5 rounded-btn text-[15px] font-semibold tracking-[-0.2px] hover:bg-zinc-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth`
- Ghost: `bg-transparent text-zinc-600 px-6 py-3.5 rounded-btn text-[15px] font-medium tracking-[-0.2px] border border-black/10 hover:border-zinc-400 hover:text-zinc-900 hover:-translate-y-0.5 transition-all duration-400 ease-smooth`
- Accent: `bg-emerald-500 text-white px-9 py-4 rounded-btn text-[15px] font-semibold tracking-[-0.2px] hover:bg-emerald-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth`

**Anti-Slop Rules (BANNED — enforced by DESIGN.md):**
1. No purple/violet/indigo
2. No 3-column equal card grids
3. No gradient text on headlines
4. No neon/outer glow effects
5. No Inter/Roboto/system font defaults
6. No centered-everything layouts
7. No icons in colored circles (use rounded squares)
8. No emoji as design elements
9. No generic hero copy ("Welcome to...", "Unlock the power...")
10. No cookie-cutter section rhythm

---

## IMPLEMENTATION PLAN

### Phase 1: Static Components (Hero through HowItWorks)

Build all Server Components that require no client-side interactivity. These are pure HTML rendered on the server with zero JavaScript shipped to the browser.

**Tasks:**
- Create Hero.tsx with 5fr/4fr grid, headline, description, CTA buttons
- Create ChatPreview.tsx as static mockup (dark card with conversation bubbles)
- Create Metrics.tsx with 4 left-aligned stats
- Create Capabilities.tsx with 2-col grid, 4 icon+text items, hover cards
- Create Services.tsx with 2fr/1fr grid, dark hero card spanning 2 rows
- Create HowItWorks.tsx with 3 steps and connecting line

### Phase 2: CTA Banner & Contact Form

Build the CTA banner (Server Component) and ContactForm (Client Component with form state).

**Tasks:**
- Create CtaBanner.tsx with dark background and radial gradient
- Create ContactForm.tsx with split layout, form validation, success/error states

### Phase 3: Page Assembly & Responsive QA

Wire all sections into page.tsx and verify responsive behavior.

**Tasks:**
- Update page.tsx to import and render all sections in order
- Verify responsive behavior at 1440px, 1024px, 768px, 640px, 375px
- Run build to confirm zero errors

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### 1. CREATE `components/ChatPreview.tsx`

Build the static chatbot preview card that sits in the hero section. This is a pure Server Component — a visual mockup of a chatbot conversation with the Rosewood Hair Studio demo.

**IMPLEMENT:**

```tsx
// Server Component — no 'use client'
export default function ChatPreview() { ... }
```

Structure (from wireframe-v2.html lines 717-736):
- Outer container: dark bg (`bg-zinc-900`), `rounded-[calc(var(--radius)+4px)]` (24px), padding 24px (p-6), elevated shadow, relative positioning
- Inner border refraction: `::before` pseudo-element with `border border-white/[0.04]`, inset 12px, rounded-card, pointer-events-none. **Use a div overlay instead of ::before** since Tailwind doesn't support `::before` content easily.
- Chat header: flex row, avatar (36px emerald square, rounded-btn, white chat SVG icon), name ("Rosewood Hair Studio" in #f4f4f5), status with breathing green dot + "Online now"
- Chat bubbles:
  - Bot bubbles: `bg-white/5 border border-white/[0.06]` rounded `rounded-[14px_14px_14px_4px]`, text #a1a1aa, 13px, max-w-[85%]
  - User bubbles: `bg-emerald-500` rounded `rounded-[14px_14px_4px_14px]`, white text, ml-auto
  - 4 bubbles total matching wireframe conversation (balayage salon demo)
- Chat compose bar: flex, input (dark transparent bg, subtle border, placeholder "Ask anything about our services...") + send button (emerald bg, white arrow SVG)

**EXACT COPY (from wireframe):**
- Bot 1: "Hi there! Welcome to Rosewood. I can answer questions about our services, help you book an appointment, or check pricing. How can I help?"
- User 1: "Do you do balayage? How much is it?"
- Bot 2: "Absolutely. Balayage starts at $165 for medium-length hair, including consultation, color, and blowout. Our colorist Priya specializes in balayage and has openings this week. Want to book, or any other questions?"
- User 2: "What's the difference between balayage and highlights?"
- Bot 3: "Balayage is hand-painted for a natural, sun-kissed gradient. Highlights use foils for more defined streaks. Balayage grows out more naturally, so fewer touch-ups. Most clients prefer it for low-maintenance color."

**EXACT SVG ICONS (from wireframe):**
- Chat avatar icon: `<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>`
- Send button icon: `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`

**PATTERN:** Mirror `Nav.tsx` Server Component pattern — default export, no 'use client'
**VALIDATE:** `npx tsc --noEmit` (TypeScript compiles)

---

### 2. CREATE `components/Hero.tsx`

Build the hero section with asymmetric 5fr/4fr grid layout.

**IMPLEMENT:**

```tsx
import Link from "next/link";
import ChatPreview from "@/components/ChatPreview";

export default function Hero() { ... }
```

Structure (from wireframe-v2.html lines 703-738):
- Section: `grid grid-cols-[5fr_4fr] gap-20 px-12 py-24 pb-20 max-w-site mx-auto items-center min-h-[85dvh]`
- Responsive: `max-lg:grid-cols-1 max-lg:gap-12 max-lg:min-h-auto max-lg:px-8 max-lg:py-16 max-sm:px-5 max-sm:py-12`
- Left column:
  - Hero tag: inline-flex pill with breathing green dot + "AI-Powered for Local Businesses" (uppercase, 12px, weight 600, accent color, accent-bg, accent-border, rounded-full, letter-spacing 0.3px, mb-7)
  - H1: "An AI employee that never\u00a0sleeps." — `text-[clamp(2.75rem,5vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-1.8px] mb-6 max-w-[560px]`
  - Description paragraph: wireframe copy — `text-[17px] text-zinc-600 mb-10 max-w-[480px] leading-[1.7] tracking-[-0.1px]`
  - Hero actions: flex row, gap-3, two buttons (primary "See It In Action" + ghost "Book a Free Call")
    - "See It In Action" is a link/button. For now, link to `#capabilities` or scroll behavior. In Phase 4 it will trigger the chatbot.
    - "Book a Free Call" links to `#contact`
- Right column: `<ChatPreview />`

**EXACT COPY:**
- Tag: "AI-Powered for Local Businesses"
- H1: "An AI employee that never\u00a0sleeps." (note: `&nbsp;` before "sleeps" to prevent orphan)
- Description: "Custom AI chatbots that answer customer questions, capture leads, book appointments, and handle support around the clock. Built for businesses that can't afford to miss a single customer."
- CTA 1: "See It In Action"
- CTA 2: "Book a Free Call"

**GOTCHA:** The breathing dot animation (`breathe` keyframe) is already defined in `globals.css`. Use `animate-[breathe_2.4s_ease-in-out_infinite]` or define a custom animation class.
**VALIDATE:** `npx tsc --noEmit` + `npm run dev` (visually check hero layout)

---

### 3. CREATE `components/Metrics.tsx`

Build the metrics bar — 4 stats, left-aligned, no cards, border-top separator.

**IMPLEMENT:**

Structure (from wireframe-v2.html lines 741-758):
- Container: `flex justify-start gap-16 px-12 py-14 max-w-site mx-auto border-t border-black/[0.06]`
- Responsive: `max-sm:px-5 max-sm:py-10 max-sm:gap-8 max-sm:flex-wrap`
- Each metric:
  - Value: `text-[32px] font-bold tracking-[-1px]`
  - Label: `text-[13px] text-zinc-400 font-medium mt-0.5`

**EXACT DATA:**
| Value | Label |
|-------|-------|
| 24/7 | Always available |
| ~80% | Questions handled instantly |
| Zero | Missed customer inquiries |
| No code | Required to get started |

**PATTERN:** Use a const array to map data, keeping JSX clean.
**VALIDATE:** `npx tsc --noEmit`

---

### 4. CREATE `components/Capabilities.tsx`

Build the capabilities section — 2-col grid, 4 icon+text rows, hover card effect.

**IMPLEMENT:**

Structure (from wireframe-v2.html lines 761-803):
- Section: `max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16` with `id="capabilities"`
- Section header: label + title + description (use section header pattern above)
- Grid: `grid grid-cols-2 gap-4 max-lg:grid-cols-1`
- Each capability item:
  - Container: `grid grid-cols-[52px_1fr] gap-4 p-7 rounded-card border border-transparent transition-all duration-400 ease-smooth items-start`
  - Hover: `hover:bg-white hover:border-black/[0.06] hover:shadow-card hover:-translate-y-0.5`
  - Icon box: 52px square, `bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)] rounded-btn flex items-center justify-center`
  - Icon SVG: 22px, stroke emerald, no fill, stroke-width 1.8
  - Text: h4 (16px, weight 700, letter -0.3px, mb-1) + p (14px, text-zinc-600, leading-[1.6])

**EXACT DATA & SVG ICONS (from wireframe):**

1. **Answer questions** — "Services, pricing, hours, policies, directions. Anything a customer would normally call about."
   - Icon SVG: `<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>`

2. **Book appointments** — "Checks availability, books slots, sends confirmations. Syncs directly with your calendar."
   - Icon SVG: `<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`

3. **Capture leads** — "Collects name, email, phone from interested visitors. Sends them to you the moment they come in."
   - Icon SVG: `<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>`

4. **Handle support** — "Returns, complaints, status checks. Resolves simple issues on the spot, escalates when needed."
   - Icon SVG: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`

**GOTCHA:** Section label uses `text-emerald-600` (which is `#059669`, matching `accent-muted`), NOT `text-emerald-500`.
**VALIDATE:** `npx tsc --noEmit` + visual check that hover cards appear correctly

---

### 5. CREATE `components/Services.tsx`

Build the services section with asymmetric 2fr/1fr grid where the AI Chatbot dark card spans 2 rows.

**IMPLEMENT:**

Structure (from wireframe-v2.html lines 806-854):
- Section: `max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16` with `id="services"`
- Section header: label "Services" + title "How we help you grow." + description
- Grid: `grid grid-cols-[2fr_1fr] grid-rows-[auto_auto] gap-4 max-lg:grid-cols-1`
- Service card base: `bg-white border border-black/[0.06] rounded-card p-10 px-9 relative transition-all duration-400 ease-smooth`
  - Hover: `hover:shadow-elevated hover:-translate-y-[3px] hover:border-black/10`
- Hero card (AI Chatbot): `row-span-2 bg-zinc-900 text-zinc-300 border-transparent`
  - Hover: `hover:border-white/[0.08]`
  - Service tag: `bg-emerald-500 text-white` (NOT accent-bg)
  - h3 color: `text-zinc-100`
  - p color: `text-zinc-400`
  - Feature list items: `text-zinc-400`, border-top `border-white/[0.06]`
- Regular cards: default white bg, standard colors

**Service tag:** inline-block, `bg-[rgba(16,185,129,0.06)] text-emerald-600 text-[11px] font-bold px-2.5 py-1 rounded-full tracking-[0.6px] uppercase mb-6`
- Hero card override: `bg-emerald-500 text-white`

**Service icon box:** `w-11 h-11 bg-[rgba(16,185,129,0.06)] rounded-btn flex items-center justify-center mb-6`
- Hero card override: `bg-[rgba(16,185,129,0.15)]`

**Feature list:** ul with no list-style. Each li: `text-sm text-zinc-600 py-2.5 pl-6 relative border-t border-black/[0.06]`
- Checkmark: Use a `::before` pseudo-element with the green checkmark SVG. Since Tailwind doesn't support `content: url(...)` easily, use a `<span>` or `<svg>` element positioned absolutely to the left of each li item.
- Hero card override: `text-zinc-400 border-white/[0.06]`

**EXACT DATA & SVG ICONS:**

1. **AI Chatbot** (hero card, "Most requested" tag):
   - Icon: `<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>`
   - Description: "A custom AI assistant embedded on your website. Trained specifically on your business. Handles everything from answering questions to booking appointments to capturing leads after hours."
   - Features: "Custom trained on your business data", "Answers any customer question accurately", "Books appointments directly", "Captures leads around the clock", "Works on any existing website", "Learns and improves over time"

2. **Website Design** (no tag):
   - Icon: `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`
   - Description: "Professional sites that turn visitors into customers. Fast, mobile-first, built for local search."
   - Features: "Custom design", "Mobile responsive", "SEO optimized", "Google Business ready"

3. **Automation Flows** (no tag):
   - Icon: `<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>`
   - Description: "Connect your tools. Automate follow-ups, reminders, review requests, and reporting."
   - Features: "Appointment reminders", "Review requests", "Email sequences", "Custom workflows"

**GOTCHA:** The hero card spans 2 rows with `row-span-2`. On mobile (`max-lg:grid-cols-1`), reset to `max-lg:row-span-1` or let it auto-flow. The wireframe CSS uses `grid-row: auto` at 1024px breakpoint.
**VALIDATE:** `npx tsc --noEmit` + visual check that hero card spans 2 rows on desktop

---

### 6. CREATE `components/HowItWorks.tsx`

Build the "How It Works" section with 3 numbered steps and a connecting horizontal line.

**IMPLEMENT:**

Structure (from wireframe-v2.html lines 857-878):
- Section: `max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16` with `id="how-it-works"`
- Section header: label "Process" + title "Three steps. That's it." + description "No technical knowledge required. We handle everything from start to finish."
- Steps container: `grid grid-cols-3 gap-12 mt-14 relative max-lg:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-8`
  - Connecting line: Use a `div` with `absolute top-7 left-[15%] right-[15%] h-px bg-black/10` positioned behind the step numbers. **Hide on mobile:** `max-sm:hidden`. Also `hidden` when steps stack: the wireframe hides it at 1024px, so use `max-lg:hidden` since steps still show as 3-col at tablet but the line is hidden.
    - Actually, per wireframe CSS: `.steps::before { display: none; }` is at 1024px. So: `max-lg:hidden`.
- Each step:
  - Step number: `w-14 h-14 bg-white border border-black/10 rounded-full flex items-center justify-center text-xl font-bold mb-5 relative z-[1] tracking-[-0.5px]`
  - h4: `text-[17px] font-bold tracking-[-0.3px] mb-1.5`
  - p: `text-sm text-zinc-600 leading-[1.6] max-w-[280px]`

**EXACT DATA:**
1. "Book a free call" — "Tell us about your business, your customers, and what you need help with."
2. "We build it" — "Custom chatbot trained on your business data, ready in days, not weeks."
3. "Go live" — "One line of code on your site. We handle deployment, monitoring, and updates."

**VALIDATE:** `npx tsc --noEmit`

---

### 7. CREATE `components/CtaBanner.tsx`

Build the dark CTA banner section with subtle radial gradient overlay.

**IMPLEMENT:**

Structure (from wireframe-v2.html lines 881-887):
- Container: `mx-12 max-w-[1304px] ml-auto mr-auto bg-zinc-900 rounded-card p-16 grid grid-cols-[1fr_auto] gap-12 items-center relative overflow-hidden`
- Responsive: `max-lg:grid-cols-1 max-lg:text-center max-lg:p-12 max-lg:px-8 max-sm:mx-5 max-sm:p-10 max-sm:px-6`
- Radial gradient overlay: Use a `div` with `absolute top-0 right-0 w-[40%] h-full bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none`
- h2: `text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold text-zinc-100 tracking-[-1px] leading-[1.1] mb-2`
- p: `text-[15px] text-zinc-500 max-w-[420px] leading-[1.6]`
  - Responsive: `max-lg:mx-auto`
- Button: Accent style, "Book a Free Call", links to `#contact`

**EXACT COPY:**
- h2: "Ready to stop missing customers?"
- p: "Book a free 15-minute call. We'll show you exactly what your AI chatbot could do for your business."

**GOTCHA:** The margin uses `mx-12` (48px) NOT `mx-auto` — the banner is inset from the page edges, not full-width. Max-width is 1304px (1400 - 2*48).
**VALIDATE:** `npx tsc --noEmit`

---

### 8. CREATE `components/ContactForm.tsx`

Build the contact section with split layout: info/trust signals on the left, form card on the right. This is a **Client Component** because it needs form state, validation, and submit handling.

**IMPLEMENT:**

```tsx
'use client';
import { useState } from 'react';
```

Structure (from wireframe-v2.html lines 890-946):
- Section: `max-w-site mx-auto px-12 py-24 grid grid-cols-2 gap-20 items-start max-lg:grid-cols-1 max-lg:gap-12 max-sm:px-5 max-sm:py-16` with `id="contact"`
- **Left column (contact-info):**
  - Section header: label "Contact" + title "Tell us about your business." (max-w-[400px]) + description "We'll show you exactly what your AI chatbot could handle, with a custom demo for your industry."
  - Contact details (3 items, mt-10, flex-col, gap-5):
    1. Phone icon + "Quick response" / "We respond within 2 hours during business days"
    2. Clock icon + "Free consultation" / "15-minute call to understand your needs"
    3. Shield icon + "No commitment" / "No contracts, no obligations. See the value first."
  - Each detail item: flex, items-start, gap-3.5
    - Icon box: `w-10 h-10 bg-[rgba(16,185,129,0.06)] rounded-btn flex items-center justify-center shrink-0`
    - Icon SVG: 18px, stroke emerald, no fill, stroke-width 1.8
    - h5: `text-sm font-semibold tracking-[-0.2px]`
    - p: `text-[13px] text-zinc-600 mt-px`

- **Right column (form card):**
  - Card: `bg-white border border-black/[0.06] rounded-card p-10 shadow-card`
  - Form row (name + business): `grid grid-cols-2 gap-3.5 max-sm:grid-cols-1`
  - Form group: `mb-4`
    - Label: `block text-[13px] font-semibold mb-1.5 tracking-[-0.1px]`
    - Input: `w-full bg-[#fafaf9] border border-black/10 rounded-btn py-[13px] px-3.5 text-sm outline-none transition-all duration-400 ease-smooth focus:border-emerald-500 focus:ring-[3px] focus:ring-[rgba(16,185,129,0.06)]`
    - Textarea: same + `h-[100px] resize-y`
  - Submit button: `bg-zinc-900 text-[#fafaf9] py-3.5 px-7 rounded-btn text-[15px] font-semibold w-full mt-1 tracking-[-0.2px] hover:bg-zinc-700 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth`

**FORM STATE:**
- Fields: `name`, `business`, `email`, `message`
- Validation: name required, business required, email required + format check
- States: `idle`, `submitting`, `success`, `error`
- On submit: prevent default, validate, POST to `/api/contact` (returns error for now since backend is Phase 3 — handle gracefully)
- Success state: replace form with "Thanks! We'll be in touch within 24 hours." message
- Error state: inline red text below submit button

**EXACT SVG ICONS (contact detail items):**
1. Phone: `<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>`
2. Clock: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`
3. Shield: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`

**FORM PLACEHOLDERS:**
- Name: "Priya Ramirez"
- Business: "Rosewood Hair Studio"
- Email: "priya@rosewoodhair.com"
- Message label: "What would you want your AI chatbot to do?"
- Message placeholder: "Answer questions about services, book appointments, handle after-hours inquiries..."
- Submit: "Send Message"

**GOTCHA:** Use `focus:ring-[3px] focus:ring-[rgba(16,185,129,0.06)]` for the focus ring effect (matching wireframe `box-shadow: 0 0 0 3px var(--accent-bg)`). Tailwind v4 should support this. If not, use `focus:shadow-[0_0_0_3px_rgba(16,185,129,0.06)]`.
**VALIDATE:** `npx tsc --noEmit` + visual check form renders correctly

---

### 9. UPDATE `app/page.tsx`

Wire all section components into the page.

**IMPLEMENT:**

Replace the entire placeholder content. Import all components and render in order:

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import Capabilities from "@/components/Capabilities";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import CtaBanner from "@/components/CtaBanner";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Metrics />
        <Capabilities />
        <Services />
        <HowItWorks />
        <CtaBanner />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
```

**PATTERN:** Mirror existing pattern in `app/page.tsx` — same structure, just more imports.
**VALIDATE:** `npm run dev` (all sections render), `npm run build` (zero errors)

---

### 10. ADD feature-list checkmark styles to `app/globals.css`

The service cards use a green checkmark before each feature list item. This requires a CSS `::before` pseudo-element with an SVG background-image, which is cleaner to define in CSS than inline Tailwind.

**IMPLEMENT:**

Add to `globals.css` after the `@keyframes breathe` block:

```css
/* Feature list checkmark (Services section) */
.feature-check li {
  position: relative;
  padding-left: 24px;
}
.feature-check li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2310b981'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E") no-repeat center;
}
```

Then use `className="feature-check"` on the `<ul>` in Services.tsx.

**GOTCHA:** This is the exact SVG data URI from wireframe-v2.html line 449.
**VALIDATE:** `npm run dev` (checkmarks visible in service cards)

---

### 11. RESPONSIVE VERIFICATION

Manually verify all breakpoints match wireframe responsive behavior.

**CHECK AT EACH BREAKPOINT:**

| Breakpoint | Expected behavior |
|------------|-------------------|
| 1440px | Full desktop: all grids active, nav links visible |
| 1024px | Hero → 1fr, Capabilities → 1fr, Services → 1fr, Contact → 1fr, CTA Banner → 1fr centered, Steps connecting line hidden |
| 768px | Same as 1024px (tablet) |
| 640px | Nav links hidden, padding reduced (20px), metrics wrap, steps → 1fr, form-row → 1fr, footer stacks |
| 375px | Everything single-column, no horizontal scroll |

**VALIDATE:** `npm run dev` + browser DevTools responsive mode at each breakpoint

---

## TESTING STRATEGY

### Build Verification (Phase 2 — no test framework yet, that's Phase 5)

- `npm run build` — zero errors, zero warnings
- `npx tsc --noEmit` — TypeScript compiles without errors
- `npm run lint` — ESLint passes

### Visual Verification

- Compare each section against wireframe-v2.html at 1440px
- Responsive check at 1024px, 768px, 640px, 375px
- Hover effects on capability cards, service cards, buttons
- Breathing dot animation on hero tag and chatbot preview
- Contact form focus states (emerald border + ring)

### Edge Cases

- Very long business name in contact form — doesn't overflow
- Hero headline with different viewport widths — clamp() works correctly
- Chatbot preview conversation bubbles — max-width 85% prevents overflow
- Mobile nav — links hidden, CTA visible, no horizontal scroll

---

## VALIDATION COMMANDS

### Level 1: Syntax & Type Checking

```bash
npx tsc --noEmit
npm run lint
```

### Level 2: Build

```bash
npm run build
```

### Level 3: Dev Server

```bash
npm run dev
# Open http://localhost:3000 and visually verify
```

### Level 4: Manual Validation

- Open DevTools → responsive mode → test at 1440px, 1024px, 768px, 640px, 375px
- Hover over capability cards → should lift and show shadow
- Hover over service cards → should lift and show shadow
- Click "Book a Free Call" in hero → should smooth-scroll to #contact
- Click "See It In Action" in hero → should scroll to chatbot or capabilities
- Fill contact form → validate fields → submit (will fail until Phase 3 backend, but UI should show error gracefully)
- Check no horizontal scroll at any viewport
- Verify breathing dot animation on hero tag and chatbot status

---

## ACCEPTANCE CRITERIA

- [ ] All 8 sections render correctly at desktop (1440px)
- [ ] All sections responsive at 1024px, 768px, 640px, 375px
- [ ] Hero: 5fr/4fr grid with chatbot preview, breathing dot, correct copy
- [ ] Metrics: 4 left-aligned stats with border-top separator
- [ ] Capabilities: 2-col grid, hover cards appear on hover with shadow + lift
- [ ] Services: 2fr/1fr grid, AI Chatbot dark card spans 2 rows, green checkmarks
- [ ] How It Works: 3 steps with connecting line (hidden on mobile)
- [ ] CTA Banner: dark bg with radial gradient, accent button
- [ ] Contact Form: split layout, form validation works, focus states correct
- [ ] All copy matches wireframe-v2.html exactly (no placeholder text)
- [ ] All SVG icons match wireframe exactly
- [ ] All hover/active transitions use `cubic-bezier(0.16, 1, 0.3, 1)`
- [ ] No anti-slop violations (no purple, no 3-col equal grids, no gradient text, etc.)
- [ ] `npm run build` passes with zero errors
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Only ContactForm.tsx uses 'use client' — all other sections are Server Components
- [ ] No horizontal scroll at any viewport width
- [ ] Breathing dot animation works on hero tag and chatbot preview status

---

## COMPLETION CHECKLIST

- [ ] All 11 tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] `npm run build` succeeds with zero errors
- [ ] No linting or type checking errors
- [ ] Manual visual testing confirms pixel-match with wireframe
- [ ] Responsive testing at all 5 breakpoints
- [ ] Acceptance criteria all met

---

## NOTES

### Design Decisions

1. **ChatPreview as separate component** — Extracted from Hero so it can be swapped for the real ChatWidget in Phase 4 without touching Hero.tsx.
2. **ContactForm as Client Component** — Only component that needs `'use client'` in Phase 2. Form state (values, errors, submission status) requires React state.
3. **Feature list checkmarks in CSS** — Using a global CSS class (`.feature-check li::before`) instead of inline Tailwind because the SVG data URI is too long for a className. This matches how the wireframe implements it.
4. **No mobile hamburger menu yet** — Nav links are simply hidden below 1024px. A mobile hamburger drawer requires client-side state and is deferred to Phase 5 polish.
5. **"See It In Action" button** — Currently links to `#capabilities` as a scroll target. In Phase 4, it will trigger the chatbot widget focus.

### Confidence Assessment

**Confidence Score: 9/10** — All patterns are established, wireframe provides exact specs, design tokens are in place. The 1-point deduction is for potential Tailwind v4 edge cases with arbitrary values and responsive utilities that may need tweaking.
