# AgencyAI — Implementation Plan

## Context

Building a professional single-page agency website for AgencyAI, an AI chatbot service targeting local businesses (dentists, salons, restaurants). The site serves as both marketing page AND product demo: a live chatbot widget shows visitors exactly what they'd be buying. The goal: a URL the founder can paste in 20 cold DMs to local dentists with confidence.

Design doc: `design-doc.md` (approved)
Visual reference: `wireframe-v2.html` (approved, follows taste-skill rules)

## Architecture Decisions (locked)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js App Router | Founder preference, familiar ecosystem |
| Styling | Tailwind CSS v3.4 | Reliable setup with Next.js |
| Font | Outfit via `next/font` | Self-hosted, no layout shift |
| Chatbot v1 | Third-party embed (Botpress/Voiceflow) | Ship fast, watermark accepted for v1 |
| Chatbot v2 | API-based custom UI (deferred) | Full branding control, hero preview becomes real |
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
components/
  Nav.tsx               ← sticky, blur backdrop, mobile hamburger
  Hero.tsx              ← 5fr/4fr grid, headline, CTAs
  ChatPreview.tsx       ← static chat mockup in hero (dark card)
  Metrics.tsx           ← 24/7, ~80%, Zero, No code
  Capabilities.tsx      ← 2-col grid, icon+text, hover cards
  Services.tsx          ← 2fr/1fr grid, dark hero card spans 2 rows
  HowItWorks.tsx        ← 3 steps with connecting line
  CtaBanner.tsx         ← dark section CTA
  ContactForm.tsx       ← 'use client' — form state, validation, submit
  Footer.tsx            ← links, copyright
```

Only `ContactForm.tsx` is a Client Component. Everything else is Server Component (zero JS shipped).

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


CHATBOT EMBED FLOW (v1)
═══════════════════════════════════════════════
  page loads → <Script> tag injects widget JS
  → floating bubble appears (bottom-right)
  → user clicks bubble → chat UI opens
  → conversations handled by Botpress/Voiceflow servers
  → lead capture → platform sends to founder's email
```

## Implementation Phases (Revised)

### Phase 0: DNS & Accounts (Day 1, first thing)
- [ ] Register custom domain (Namecheap/Cloudflare)
- [ ] Point domain to Vercel (DNS records)
- [ ] Create Resend account, add domain, start DNS verification (MX/TXT records)
- [ ] Create Botpress or Voiceflow account
- [ ] Create Vercel account, link GitHub repo

### Phase 1: Foundation (Day 1)
- [ ] `npx create-next-app@latest` with App Router + Tailwind CSS
- [ ] Configure Outfit font via `next/font/google` in `layout.tsx`
- [ ] Set up color system in `tailwind.config.ts` (Zinc neutrals + Emerald accent from wireframe)
- [ ] Build `Nav.tsx` (sticky, backdrop-blur, mobile hamburger menu)
- [ ] Build `Footer.tsx`
- [ ] Deploy to Vercel (get live URL early)
- [ ] Install `@vercel/analytics`, add `<Analytics />` to `layout.tsx`
- [ ] Add metadata in `layout.tsx` (title, description, OG image)

### Phase 2: Page Sections (Day 2-3)
- [ ] Build `Hero.tsx` — `grid-template-columns: 5fr 4fr`, headline, description, CTA buttons
- [ ] Build `ChatPreview.tsx` — static chat mockup (dark card, conversation bubbles, breathing dot)
- [ ] Build `Metrics.tsx` — 4 stats, left-aligned, no cards
- [ ] Build `Capabilities.tsx` — 2-col grid, icon+text rows, hover card effect
- [ ] Build `Services.tsx` — `2fr/1fr` grid, AI Chatbot dark card spans rows 1-2
- [ ] Build `HowItWorks.tsx` — 3 steps with connecting line
- [ ] Build `CtaBanner.tsx` — dark section with subtle radial gradient
- [ ] Build `ContactForm.tsx` — 'use client', split layout (info left, form right), validation, success/error states
- [ ] Write real copy for all sections (not placeholder text)

### Phase 3: Contact Form Backend (Day 3)
- [ ] Install `resend` package
- [ ] Create `app/api/contact/route.ts`
- [ ] Implement: validate required fields (name, business, email), sanitize, call Resend API
- [ ] Return appropriate status codes (200 success, 400 validation error, 500 API error)
- [ ] Wire `ContactForm.tsx` to POST to `/api/contact`
- [ ] Test end-to-end: submit → receive email

### Phase 4: Chatbot Integration (Day 4)
- [ ] Choose platform (evaluate Botpress vs Voiceflow vs Chatbase for: free tier limits, embeddability, branding)
- [ ] Create chatbot knowledge base (services, process, pricing guidance, FAQs, turnaround times)
- [ ] Configure conversation flows and lead capture
- [ ] Add embed `<Script>` tag to `layout.tsx` or `page.tsx`
- [ ] Wire "See It In Action" CTA to open the chatbot widget
- [ ] Test 10+ conversation scenarios
- [ ] Set up lead notifications (chatbot → founder email)

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

COVERAGE: 12 cases across 3 files
```

## Failure Modes

| Failure | Test? | Error handling? | User impact |
|---------|-------|----------------|-------------|
| Resend API down | YES | 500 response → error msg | User sees "Something went wrong, try again" |
| Invalid email format | YES | 400 response → inline error | User sees "Please enter a valid email" |
| Chatbot widget fails to load | NO (manual) | None (3rd party) | No chatbot bubble appears. User can still use contact form. |
| DNS not propagated at launch | NO | None | Site not reachable on custom domain. Vercel subdomain works as fallback. |

## NOT in scope (v1)

- Dashboard / internal tooling (deferred until 3-5 clients)
- API-based custom chatbot UI (v2 TODO)
- Multiple industry demo scenarios (start with 1, add based on customer feedback)
- Pricing page (using "Book a Free Call" CTA until pricing validated)
- Blog / content section
- Authentication / user accounts
- CRM integration
- Payment processing

## What already exists

- `wireframe-v2.html` — fully styled HTML/CSS reference for all sections. Can be used as a pixel-perfect guide. Contains the exact color values, spacing, typography, and layout specifications.
- `design-doc.md` — approved design document with all constraints, premises, and requirements.
- `.claude/skills/taste-skill/SKILL.md` — design rules to enforce during implementation.

## Worktree Parallelization

| Step | Modules touched | Depends on |
|------|----------------|------------|
| Phase 1: Foundation | app/, config files | — |
| Phase 2: Sections | components/ | Phase 1 |
| Phase 3: Form backend | app/api/, components/ContactForm | Phase 1 |
| Phase 4: Chatbot | app/layout or page | Phase 1 |
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
