# AgencyAI — Implementation Plan

## Context

Building a professional single-page agency website for AgencyAI, an AI chatbot service targeting local businesses (dentists, salons, restaurants). The site serves as both marketing page AND product demo: a live chatbot widget shows visitors exactly what they'd be buying. The goal: a URL the founder can paste in 20 cold DMs to local dentists with confidence.

Design doc: `design-doc.md` (approved)
Visual reference: `wireframe-v2.html` (approved, follows taste-skill rules)

## Architecture Decisions (locked)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js App Router | Founder preference, familiar ecosystem |
| Styling | Tailwind CSS v4.2 | Ships with create-next-app@16, CSS-based `@theme inline` config |
| Font | Outfit via `next/font` | Self-hosted, no layout shift |
| Chatbot | Custom-built with Claude Haiku API | Full branding, no watermarks, cheaper than third-party (~$0.0005/conversation), hero preview becomes the real chatbot |
| Contact form | Next.js API route + Resend | Self-contained, no external automation tool |
| Hosting | Vercel (free tier) | Zero-config Next.js deployment |
| Analytics | Vercel Analytics | Free, zero-config, Web Vitals + page views |
| Tests | Vitest + Playwright | Unit/component + E2E smoke |

## Component Structure

```
app/
  page.tsx              ← imports all section components
  layout.tsx            ← html, body, Outfit font, metadata, analytics
  api/contact/
    route.ts            ← POST handler: validate → send email via Resend
  api/chat/
    route.ts            ← POST handler: system prompt + Claude Haiku → streaming response
components/
  Nav.tsx               ← sticky, blur backdrop, mobile hamburger
  Hero.tsx              ← 5fr/4fr grid, headline, CTAs
  ChatWidget.tsx        ← 'use client' — real AI chatbot (hero preview + floating bubble)
  Metrics.tsx           ← 24/7, ~80%, Zero, No code
  Capabilities.tsx      ← 2-col grid, icon+text, hover cards
  Services.tsx          ← 2fr/1fr grid, dark hero card spans 2 rows
  HowItWorks.tsx        ← 3 steps with connecting line
  CtaBanner.tsx         ← dark section CTA
  ContactForm.tsx       ← 'use client' — form state, validation, submit
  Footer.tsx            ← links, copyright
```

Two Client Components: `ContactForm.tsx` (form state) and `ChatWidget.tsx` (chat state + streaming). Everything else is Server Component (zero JS shipped).

**Tech stack (actual, post-Phase 1):** Next.js 16.2.2, React 19.2.4, Tailwind CSS 4.2.2, TypeScript 5.x, @vercel/analytics 2.x.
**GitHub:** https://github.com/hungHoni/AgencyAI (branch: `main`)

## Data Flow

```
CONTACT FORM FLOW
═══════════════════════════════════════════════
  Browser                    Server                  Resend
  ───────                    ──────                  ──────
  User fills form
  ↓
  Client validation
  (name, email required)
  ↓
  POST /api/contact ──────→  route.ts
                              ├── validate fields
                              ├── sanitize input
                              ├── call Resend API ──→ send email
                              │                       to founder
                              ├── return 200 ←────── success
  Show success msg ←──────── │
                              └── return 400/500
  Show error msg ←────────── (validation or API error)


CUSTOM CHATBOT FLOW
═══════════════════════════════════════════════
  Browser (ChatWidget.tsx)     Server                     Claude API
  ────────────────────         ──────                     ──────────
  User types message
  ↓
  POST /api/chat ───────────→  app/api/chat/route.ts
    { message, history }        ├── build system prompt
                                │   (agency info, services,
                                │    pricing, FAQs)
                                ├── call Claude Haiku ────→ stream response
                                │                          (claude-haiku-4-5)
                                ├── stream back ←───────── tokens
  Render streaming text ←────── │
  Append to history             │
                                ├── if lead detected
  ↓                             │   (name+email in convo)
  Lead capture prompt           └── email via Resend
  (inline name/email form)

  Cost: ~$0.0005 per conversation (2,000 tokens avg)
```

## Implementation Phases (Revised)

### Phase 0: DNS & Accounts (Day 1, first thing) — SKIPPED
- [ ] Register custom domain (Namecheap/Cloudflare)
- [ ] Point domain to Vercel (DNS records)
- [ ] Create Resend account, add domain, start DNS verification (MX/TXT records)
- [ ] Create Anthropic account, get API key for Claude Haiku
- [ ] Create Vercel account, link GitHub repo

### Phase 1: Foundation (Day 1) — DONE (2026-04-05)
- [x] `npx create-next-app@latest` with App Router + Tailwind CSS v4 + TypeScript
- [x] Configure Outfit font via `next/font/google` in `layout.tsx` (weights 400-800)
- [x] Set up design system tokens in `app/globals.css` via `@theme inline` (Tailwind v4 format)
- [x] Build `Nav.tsx` (sticky, backdrop-blur, responsive link hiding, CTA button)
- [x] Build `Footer.tsx` (responsive column stacking)
- [x] Install `@vercel/analytics`, add `<Analytics />` to `layout.tsx`
- [x] Add metadata in `layout.tsx` (title, description, OG tags)
- [x] Push to GitHub: https://github.com/hungHoni/AgencyAI
- [x] Deploy to Vercel (connect GitHub repo via dashboard)

### Phase 2: Page Sections (Day 2-3) — DONE (2026-04-05)
- [x] Build `Hero.tsx` — `grid-template-columns: 5fr 4fr`, headline, description, CTA buttons
- [x] Build `ChatPreview.tsx` — static chat mockup (dark card, conversation bubbles, breathing dot)
- [x] Build `Metrics.tsx` — 4 stats, left-aligned, no cards
- [x] Build `Capabilities.tsx` — 2-col grid, icon+text rows, hover card effect
- [x] Build `Services.tsx` — `2fr/1fr` grid, AI Chatbot dark card spans rows 1-2
- [x] Build `HowItWorks.tsx` — 3 steps with connecting line
- [x] Build `CtaBanner.tsx` — dark section with subtle radial gradient
- [x] Build `ContactForm.tsx` — 'use client', split layout (info left, form right), validation, success/error states
- [x] Write real copy for all sections (not placeholder text)

### Phase 3: Contact Form Backend (Day 3) — DONE (2026-04-05)
- [x] Install `resend` package (v6.10.0)
- [x] Create `app/api/contact/route.ts`
- [x] Implement: validate required fields (name, business, email), sanitize, call Resend API
- [x] Return appropriate status codes (200 success, 400 validation error, 500 API error)
- [x] Wire `ContactForm.tsx` to POST to `/api/contact` (already wired in Phase 2)
- [ ] Test end-to-end: submit → receive email (requires valid Resend API key + domain verification)

### Phase 4: Custom AI Chatbot (Day 4)
- [ ] Install `@anthropic-ai/sdk`
- [ ] Add `ANTHROPIC_API_KEY` to `.env.local` and Vercel env vars
- [ ] Create `app/api/chat/route.ts`:
  - Accept `{ message, history }` POST body
  - Build system prompt with agency info (services, pricing, process, FAQs)
  - Call Claude Haiku (`claude-haiku-4-5`) with streaming
  - Return `ReadableStream` for real-time token rendering
  - Rate limit: max 20 messages per session (prevent abuse)
- [ ] Create `components/ChatWidget.tsx` ('use client'):
  - Hero mode: embedded in hero section, replaces static mockup with real AI chat
  - Floating mode: bubble bottom-right, expands to chat panel on click
  - Streaming text rendering (tokens appear as they arrive)
  - Message history in React state
  - Lead capture: after 3+ messages, prompt for name + email
  - Error fallback: "Our AI is taking a break. Use the contact form below."
- [ ] Write system prompt (agency services, process, pricing guidance, turnaround)
- [ ] Wire "See It In Action" CTA to scroll to hero and focus chat input
- [ ] Test 10+ conversation scenarios (services, pricing, edge cases, abuse)
- [ ] Lead notification: when chatbot collects name+email, POST to /api/contact

### Phase 5: Tests & Polish (Day 5)
- [ ] Install Vitest + testing-library
- [ ] Write API route tests: `__tests__/api/contact.test.ts` (valid submit, missing fields, invalid email, Resend failure)
- [ ] Write component test: `__tests__/components/ContactForm.test.tsx` (render, validate, success, error)
- [ ] Install Playwright, write E2E smoke test: `e2e/smoke.spec.ts` (page loads, sections visible, form submits)
- [ ] Responsive QA: 1440px, 1024px, 768px, 375px
- [ ] Performance: Lighthouse audit, target >90 performance score
- [ ] Add favicon
- [ ] Cross-browser: Chrome, Safari, Firefox, mobile Safari
- [ ] Proofread all copy
- [ ] Verify custom domain + SSL working
- [ ] Final production deploy

## Test Plan

```
CODE PATH COVERAGE
═══════════════════════════════════════════════
[+] app/api/contact/route.ts
    ├── POST valid submission → sends email, returns 200
    ├── POST missing required field → returns 400 + error details
    ├── POST invalid email format → returns 400
    └── POST Resend API failure → returns 500 + error message

[+] components/ContactForm.tsx
    ├── Renders all form fields with labels
    ├── Submit valid data → shows success message
    ├── Submit missing fields → shows inline errors
    ├── Submit while loading → button disabled, shows spinner
    └── API error → shows error message

[+] E2E smoke (Playwright)
    ├── Page loads, all sections render
    ├── Nav links scroll to sections
    └── Contact form submission end-to-end

[+] app/api/chat/route.ts
    ├── POST valid message + history → streams response
    ├── POST empty message → returns 400
    ├── POST exceeds 20 message limit → returns 429 + limit message
    ├── Claude API failure → returns 500 + fallback message
    └── Claude API timeout → returns 504 + timeout message

[+] components/ChatWidget.tsx
    ├── Renders chat input and send button
    ├── Send message → shows streaming response
    ├── API error → shows fallback message
    ├── 20 message limit → shows limit message
    └── Lead capture prompt appears after 3+ messages

COVERAGE: 22 cases across 5 files
```

## Failure Modes

| Failure | Test? | Error handling? | User impact |
|---------|-------|----------------|-------------|
| Resend API down | YES | 500 response → error msg | User sees "Something went wrong, try again" |
| Invalid email format | YES | 400 response → inline error | User sees "Please enter a valid email" |
| Claude API down/slow | YES | Error fallback msg | User sees "Our AI is taking a break. Use the contact form below." |
| Claude API rate limited | YES | 429 handling | User sees "Lots of people chatting! Try again in a moment." |
| Malformed API response | YES | Try/catch | Graceful fallback to contact form |
| Session abuse (spam) | YES | 20 msg limit | User sees "You've reached the message limit. Book a free call for more." |
| DNS not propagated at launch | NO | None | Site not reachable on custom domain. Vercel subdomain works as fallback. |

## NOT in scope (v1)

- Dashboard / internal tooling (deferred until 3-5 clients)
- Multi-industry chatbot personalities (dental, restaurant, salon variants)
- Multiple industry demo scenarios (start with 1, add based on customer feedback)
- Pricing page (using "Book a Free Call" CTA until pricing validated)
- Blog / content section
- Authentication / user accounts
- CRM integration
- Payment processing

## What already exists

- `wireframe-v2.html` — fully styled HTML/CSS reference for all sections. Pixel-perfect guide with exact color values, spacing, typography, and layout specifications.
- `design-doc.md` — approved design document with all constraints, premises, and requirements.
- `DESIGN.md` — extracted design system tokens (colors, typography, spacing, radius, shadows, motion, anti-slop rules).
- `app/globals.css` — Tailwind v4 `@theme inline` with all design tokens. Custom tokens: `accent`, `accent-muted`, `accent-bg`, `accent-border`, `rounded-card`, `rounded-btn`, `shadow-card`, `shadow-elevated`, `ease-smooth`, `duration-400`, `max-w-site`.
- `app/layout.tsx` — Root layout with Outfit font, SEO metadata, OG tags, Vercel Analytics.
- `components/Nav.tsx` — Sticky nav, backdrop-blur, logo, 4 links (hidden <1024px), CTA button.
- `components/Footer.tsx` — Logo + 3 links, responsive column stacking.
- `app/page.tsx` — Page shell importing Nav + Footer, placeholder for Phase 2 sections.
- `.agents/plans/phase-1-foundation.md` — Detailed Phase 1 execution plan (completed).

## Worktree Parallelization

| Step | Modules touched | Depends on |
|------|----------------|------------|
| Phase 1: Foundation | app/, config files | — |
| Phase 2: Sections | components/ | Phase 1 |
| Phase 3: Form backend | app/api/, components/ContactForm | Phase 1 |
| Phase 4: Chatbot | app/api/chat/, components/ChatWidget | Phase 1 |
| Phase 5: Tests | __tests__/, e2e/ | Phases 2-4 |

**Parallel lanes:**
- Lane A: Phase 2 (sections) — sequential after Phase 1
- Lane B: Phase 3 (form backend) — can run parallel with Phase 2 after Phase 1
- Lane C: Phase 4 (chatbot) — can run parallel with Phase 2-3 after Phase 1

**Execution:** Phase 1 first (foundation). Then launch A + B + C in parallel. Phase 5 last.

## Verification

1. `npm run dev` — all sections render, responsive at all breakpoints
2. Submit contact form → receive email in founder's inbox
3. Click chatbot widget → conversation works
4. `npx vitest run` — all unit/component tests pass
5. `npx playwright test` — E2E smoke passes
6. Lighthouse audit → performance >90
7. Check custom domain loads with valid SSL
8. Paste URL in a mobile browser → page loads in <2s, looks professional

## Completion Summary

- Step 0: Scope Challenge — scope accepted as-is (greenfield, minimum surface area)
- Architecture Review: 3 issues found (framework, chatbot pattern, form backend) — all resolved
- Code Quality Review: 1 issue found (component structure) — resolved
- Test Review: diagram produced, 12 gaps identified, all added to plan
- Performance Review: 1 issue found (font loading) — resolved with next/font
- Outside voice: ran (claude subagent) — 9 findings, 3 incorporated (DNS timing, analytics, chatbot branding noted)
- NOT in scope: written
- What already exists: written
- TODOS.md updates: 1 item proposed (v2 chatbot API), accepted
- Failure modes: 0 critical gaps (all failures have either tests or graceful fallbacks)
- Parallelization: 3 lanes, 3 parallel / 1 sequential
- Lake Score: 7/7 recommendations chose complete option

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 1 | ISSUES_FOUND | 9 findings from outside voice |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR (PLAN) | 7 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

**VERDICT:** ENG CLEARED — ready to implement
