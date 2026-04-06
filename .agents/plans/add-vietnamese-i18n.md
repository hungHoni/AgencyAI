# Feature: Vietnamese Language Support with Auto-Detection

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Add Vietnamese language support to the AgencyAI marketing site with:
1. A language switcher (EN/VI toggle) in the navigation bar
2. Auto-detection of user's locale via `Accept-Language` header in middleware
3. Vietnamese visitors see Vietnamese by default, everyone else sees English
4. All 150+ hardcoded strings extracted into translation files
5. Localized chat system prompt so the AI chatbot responds in the user's language
6. Localized demo conversation in the hero chat widget
7. Localized metadata (title, description, OG tags) for SEO

**Approach chosen: Client-side context with cookie-based preference + middleware detection.**

Why NOT middleware URL routing (`/vi/`, `/en/`): This is a single-page marketing site with anchor navigation (`#services`, `#contact`). Adding locale prefixes would break all internal anchor links, require restructuring the entire app directory with `[lang]/` route groups, and add complexity with no SEO benefit (Vietnamese local businesses searching in Vietnamese will find the site via Google's language detection regardless). A cookie + context approach keeps the flat URL structure, anchor links work unchanged, and implementation is dramatically simpler.

## User Story

As a Vietnamese-speaking visitor
I want to see the website in Vietnamese automatically
So that I can understand the services and take action without a language barrier

As any visitor
I want to toggle between English and Vietnamese
So that I can read the site in my preferred language

## Problem Statement

The site only serves English. Vietnamese visitors (a primary target market) bounce because they can't understand the content. There's no locale detection or language switching.

## Solution Statement

Implement a lightweight i18n system using React context + JSON translation files. Middleware detects the user's preferred language from `Accept-Language` headers and sets a cookie. A context provider reads the cookie and serves the correct translations. A language toggle in the nav lets users override. The chatbot system prompt and demo conversation are also localized.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: All 12 components, layout, middleware, API routes, chat system prompt
**Dependencies**: None (no new npm packages needed)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `app/layout.tsx` (full file) - Why: Root layout with hardcoded `lang="en"`, metadata, skip-to-content text. Must become locale-aware.
- `app/page.tsx` (full file) - Why: Page composition with all section components. Imports ScrollToTop.
- `app/not-found.tsx` (full file) - Why: Contains 4 hardcoded strings to extract.
- `app/globals.css` (full file) - Why: Tailwind theme config with custom tokens. No changes needed but read for context.
- `app/api/chat/route.ts` (full file) - Why: Contains SYSTEM_PROMPT (26 lines) and 3 error messages. System prompt must be localized so chatbot responds in Vietnamese when locale=vi.
- `app/api/contact/route.ts` (full file) - Why: Contains validation errors and email template strings. API errors should be localized based on locale sent in request body.
- `components/Nav.tsx` (full file) - Why: Navigation with 4 link labels + "Book a Free Call" button. Language toggle goes here.
- `components/Hero.tsx` (full file) - Why: Tag, headline, subtext, 2 button labels. Uses staggered entrance animations.
- `components/Metrics.tsx` (full file) - Why: 4 metric values + labels. Client component with animated counter.
- `components/Capabilities.tsx` (full file) - Why: Section header + 4 capability cards (title + description each). Client component.
- `components/Services.tsx` (full file) - Why: Section header + 3 service cards with features lists (20+ strings total). Client component.
- `components/HowItWorks.tsx` (full file) - Why: Section header + 3 steps (title + description each). Client component.
- `components/CtaBanner.tsx` (full file) - Why: Headline + subtext + button label. Client component.
- `components/ContactForm.tsx` (full file) - Why: Most string-heavy component. 4 form labels, 4 placeholders, 4 validation errors, success message, submit button states, 3 trust signals.
- `components/Footer.tsx` (full file) - Why: Logo tagline, 3 links, copyright, 2 legal links.
- `components/ChatWidget.tsx` (full file) - Why: Greeting message, demo conversation (5 messages), typing indicators, lead capture form, "Online now" status, input placeholder, error messages.
- `components/ScrollToTop.tsx` (full file) - Why: Utility component, no strings but imported in page.tsx.
- `components/AnimateOnScroll.tsx` (full file) - Why: Utility component, no strings.
- `next.config.ts` (full file) - Why: Currently empty config. No changes needed for this approach.

### New Files to Create

- `lib/i18n/translations/en.json` - All English strings organized by component namespace
- `lib/i18n/translations/vi.json` - All Vietnamese translations
- `lib/i18n/context.tsx` - React context provider for locale state + `useTranslation` hook
- `lib/i18n/types.ts` - TypeScript types for translation keys (type-safe i18n)
- `middleware.ts` - Next.js middleware for Accept-Language detection + cookie setting

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
  - Specific section: matcher config, request headers, cookies
  - Why: Middleware reads Accept-Language and sets locale cookie
- [Next.js Internationalization Guide](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
  - Specific section: Locale detection strategies
  - Why: Shows the recommended approach for App Router i18n
- [MDN Accept-Language Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
  - Why: Understanding the format for parsing user locale preferences

### Patterns to Follow

**Naming Conventions:**
- Files: kebab-case (`en.json`, `vi.json`, `context.tsx`)
- Components: PascalCase (existing pattern)
- Translation keys: dot notation organized by component (`hero.headline`, `nav.bookCall`)
- Locale codes: ISO 639-1 (`en`, `vi`)

**Component Pattern (existing):**
All components are `"use client"` with hooks. The `useTranslation` hook fits naturally:
```tsx
// Existing pattern in every component:
const [visible, setVisible] = useState(false);
// Add alongside:
const { t } = useTranslation();
```

**Cookie Pattern:**
Use `document.cookie` for client reads and `NextResponse.cookies` in middleware. Cookie name: `locale`. Values: `"en"` | `"vi"`.

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation — Translation Infrastructure

Create the i18n system: types, JSON files, React context, and middleware.

**Tasks:**
- Define TypeScript types for translation keys
- Create English and Vietnamese JSON translation files
- Build the React context provider and `useTranslation` hook
- Create middleware for Accept-Language detection

### Phase 2: Core Implementation — Component Integration

Wire every component to use the translation system instead of hardcoded strings.

**Tasks:**
- Wrap the app in the locale provider
- Update each component to use `t()` function
- Add language toggle to Nav
- Localize the ChatWidget (demo conversation, greeting, UI strings)

### Phase 3: API & Metadata Integration

Localize server-side strings and metadata.

**Tasks:**
- Pass locale to chat API for system prompt selection
- Pass locale to contact API for error messages
- Make metadata locale-aware in layout.tsx
- Update `html lang` attribute dynamically

### Phase 4: Testing & Validation

Verify everything works in both languages.

**Tasks:**
- Test Vietnamese auto-detection
- Test language toggle persistence
- Test chat API responds in correct language
- Test all form validation errors in both languages
- Visual check of all sections in Vietnamese
- Build verification

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### Task 1: CREATE `lib/i18n/types.ts`

Define the shape of translation files for type safety.

- **IMPLEMENT**: Export a `Translations` type matching the JSON structure. Export `Locale` type as `"en" | "vi"`. Export `SUPPORTED_LOCALES` array and `DEFAULT_LOCALE` constant.
- **PATTERN**: Use a flat namespace approach with dot-separated keys: `{ nav: { capabilities: string, services: string }, hero: { tag: string, headline: string } }`
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 2: CREATE `lib/i18n/translations/en.json`

Extract ALL hardcoded English strings organized by component namespace.

- **IMPLEMENT**: JSON file with these top-level namespaces:
  - `meta` — page title, description, og title, og description, og image alt
  - `nav` — capabilities, services, process, contact, bookCall, openMenu, closeMenu
  - `hero` — tag, headline, subtext, getStarted, bookCall
  - `metrics` — 4 objects with value + label each
  - `capabilities` — sectionTag, headline, subtext, 4 items with title + description
  - `services` — sectionTag, headline, subtext, 3 services with tag/title/description/features array
  - `howItWorks` — sectionTag, headline, subtext, 3 steps with title + description
  - `ctaBanner` — headline, subtext, buttonLabel
  - `contact` — sectionTag, headline, subtext, trustSignals (3 items), formLabels (4), formPlaceholders (4), validation (4 errors), successTitle, successSubtext, submitButton, submittingButton, errorMessage
  - `footer` — tagline, services, process, contact, copyright, privacyPolicy, termsOfService
  - `chat` — greeting, onlineNow, inputPlaceholder, leadPrompt, leadNamePlaceholder, leadEmailPlaceholder, leadSend, leadSending, leadNoThanks, leadSuccess, demoPrompt, demoCta, errorFallback
  - `chatDemo` — 5 messages (role + content for each)
  - `notFound` — title, heading, description, backHome
  - `skipToContent` — label
  - `api` — chatErrors (3), contactErrors (4)

- **GOTCHA**: Do NOT include the chat system prompt in this file. That stays server-side in the API route since it's not served to the client.
- **VALIDATE**: `node -e "JSON.parse(require('fs').readFileSync('lib/i18n/translations/en.json','utf8')); console.log('Valid JSON')"`

---

### Task 3: CREATE `lib/i18n/translations/vi.json`

Vietnamese translation file with identical structure to en.json.

- **IMPLEMENT**: Same keys as en.json, all values translated to Vietnamese. Key translations:
  - "AI-Powered for Local Businesses" → "AI Hỗ Trợ Doanh Nghiệp Địa Phương"
  - "An AI employee that never sleeps." → "Một nhân viên AI không bao giờ ngủ."
  - "Get Started" → "Bắt Đầu"
  - "Book a Free Call" → "Đặt Cuộc Gọi Miễn Phí"
  - "24/7" → "24/7" (keep as-is)
  - "~80%" → "~80%" (keep as-is)
  - "Zero" → "Không"
  - "No code" → "Không cần code"
  - Demo conversation: localize to a Vietnamese hair salon context (use Vietnamese names like "Minh", "Thuý", Vietnamese currency VND equivalent or keep USD)
  - Form placeholder names: "Nguyễn Minh Anh" instead of "Priya Ramirez", "Thẩm Mỹ Viện Hoa Sen" instead of "Rosewood Hair Studio"

- **GOTCHA**: Vietnamese uses diacritical marks extensively. Make sure the JSON is UTF-8 encoded. Outfit font supports Vietnamese characters.
- **VALIDATE**: `node -e "const v=JSON.parse(require('fs').readFileSync('lib/i18n/translations/vi.json','utf8')); const e=JSON.parse(require('fs').readFileSync('lib/i18n/translations/en.json','utf8')); console.log('Keys match:', JSON.stringify(Object.keys(v)) === JSON.stringify(Object.keys(e)))"`

---

### Task 4: CREATE `lib/i18n/context.tsx`

React context provider + `useTranslation` hook.

- **IMPLEMENT**:
  1. `LocaleContext` with `{ locale, setLocale, t }` shape
  2. `LocaleProvider` component that:
     - Reads initial locale from cookie `locale` on mount (default `"en"`)
     - Loads the correct JSON translation file
     - Provides a `t(key)` function using dot-notation lookup (e.g., `t("hero.headline")`)
     - Provides `setLocale(locale)` that updates cookie + state
     - Updates `document.documentElement.lang` when locale changes
  3. `useTranslation` hook that returns `{ locale, setLocale, t }`
  4. Helper `getCookieLocale()` to parse document.cookie
- **PATTERN**: Follow existing hook patterns in components (useState, useEffect, useCallback)
- **IMPORTS**: Import en.json and vi.json statically (small files, no dynamic import needed for 2 locales)
- **GOTCHA**: The `t()` function must handle nested keys like `t("metrics.0.value")` for array items. Use a recursive lookup. If key not found, return the key itself as fallback.
- **GOTCHA**: Must be a `"use client"` component since it accesses `document.cookie`.
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 5: CREATE `middleware.ts`

Next.js middleware at project root for locale auto-detection.

- **IMPLEMENT**:
  1. Read the `locale` cookie from the request. If present, do nothing (user already has a preference).
  2. If no cookie, parse the `Accept-Language` header. Look for `vi` in any position (e.g., `vi`, `vi-VN`, `vi-vn`).
  3. If Vietnamese is detected, set a `locale=vi` cookie on the response. Otherwise set `locale=en`.
  4. Cookie settings: `path=/`, `maxAge=365*24*60*60` (1 year), `sameSite=lax`.
  5. Use `NextResponse.next()` — no redirects, no rewrites.
- **PATTERN**: Standard Next.js middleware pattern
- **IMPORTS**: `import { NextResponse, type NextRequest } from "next/server"`
- **GOTCHA**: The middleware matcher should exclude API routes, static files, and Next.js internals: `matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|og-image.png).*)"]`
- **GOTCHA**: The `Accept-Language` header format is like `vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7`. Parse it properly.
- **VALIDATE**: `npx tsc --noEmit`

---

### Task 6: UPDATE `app/layout.tsx`

Wrap the app in LocaleProvider and make `lang` dynamic.

- **IMPLEMENT**:
  1. Import `LocaleProvider` from `lib/i18n/context`
  2. Wrap `{children}` with `<LocaleProvider>{children}</LocaleProvider>`
  3. Keep `lang="en"` on the `<html>` tag (the provider will update it client-side via `document.documentElement.lang`)
  4. Keep metadata as English — it's the default. For full SSR metadata localization, that would require the middleware URL routing approach. For now, the English metadata serves as the canonical version.
  5. Localize the "Skip to content" text using the provider (or keep it in English since it's a screen-reader-only element and English is the universal web accessibility language)
- **IMPORTS**: `import { LocaleProvider } from "@/lib/i18n/context"`
- **GOTCHA**: The `LocaleProvider` must be inside `<body>` since it's a client component. The `<html>` tag attributes are set imperatively via `document.documentElement.lang`.
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 7: UPDATE `components/Nav.tsx`

Add language toggle and use translations.

- **IMPLEMENT**:
  1. Import `useTranslation` hook
  2. Replace all hardcoded strings with `t()` calls: link labels, button text, aria-labels
  3. Add a language toggle button between the nav links and the "Book a Free Call" button:
     - Display: `EN | VI` with the active locale highlighted (font-semibold, text-zinc-900)
     - The inactive locale is dimmed (text-zinc-400)
     - On click, call `setLocale("vi")` or `setLocale("en")`
     - Style: small, minimal, fits the existing nav aesthetic. Use `text-xs font-medium` with a subtle separator
  4. Show the toggle on both desktop and mobile menu
- **PATTERN**: Mirror existing nav link styling for consistency
- **GOTCHA**: The toggle must also be in the mobile overlay menu, not just desktop
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 8: UPDATE `components/Hero.tsx`

Replace hardcoded strings with translations.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace: tag text, h1 text, p text, button labels
  3. Use `t("hero.tag")`, `t("hero.headline")`, etc.
- **GOTCHA**: The `&nbsp;` in "never&nbsp;sleeps" — handle this by putting the non-breaking space in the translation string itself or using a CSS approach. Simplest: include `\u00A0` in the JSON value.
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 9: UPDATE `components/Metrics.tsx`

Replace hardcoded metric values and labels.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace the metrics array values with `t()` calls
  3. The animated number for ~80% should still work — the number (80) stays hardcoded, but the prefix (~) and suffix (%) and label come from translations
- **GOTCHA**: Metrics values like "24/7" and "Zero" are text-based, not numeric. These come directly from translations.
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 10: UPDATE `components/Capabilities.tsx`

Replace hardcoded capability strings.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace section tag, headline, subtext, and all 4 capability titles + descriptions
  3. Use indexed keys: `t("capabilities.items.0.title")`, `t("capabilities.items.0.description")`
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 11: UPDATE `components/Services.tsx`

Replace hardcoded service strings.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace section tag, headline, subtext
  3. Replace 3 service cards: tag, title, description, features arrays
  4. Features are arrays of strings — use indexed keys: `t("services.items.0.features.0")`
- **GOTCHA**: This is the most string-heavy section. Double-check all 20+ strings are extracted.
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 12: UPDATE `components/HowItWorks.tsx`

Replace hardcoded step strings.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace section tag, headline, subtext, 3 step titles + descriptions
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 13: UPDATE `components/CtaBanner.tsx`

Replace hardcoded CTA strings.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace headline, subtext, button label
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 14: UPDATE `components/ContactForm.tsx`

Replace all form-related strings.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace: section tag, headline, subtext
  3. Replace 3 trust signals (title + description each)
  4. Replace 4 form labels
  5. Replace 4 form placeholders
  6. Replace 4 client-side validation errors
  7. Replace success title + subtext
  8. Replace button states: "Send Message" / "Sending..."
  9. Replace error message
- **GOTCHA**: Form validation errors are in the `validate()` function. These must use `t()` at call time, not at component init.
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 15: UPDATE `components/Footer.tsx`

Replace footer strings.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace tagline, link labels, copyright text, legal link labels
  3. For copyright: include `{year}` placeholder in translation and replace at render time, or keep `new Date().getFullYear()` inline with translated surrounding text
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 16: UPDATE `components/ChatWidget.tsx`

Localize chat widget — most complex component.

- **IMPLEMENT**:
  1. Import `useTranslation`
  2. Replace GREETING message content with `t("chat.greeting")`
  3. Replace DEMO_CONVERSATION with locale-aware version — read from translations: `t("chatDemo.0.content")`, etc.
  4. Replace "Online now" status text
  5. Replace input placeholder
  6. Replace lead capture strings (prompt, placeholders, buttons)
  7. Replace post-demo prompt and CTA text
  8. Replace error fallback text
  9. **CRITICAL**: The demo conversation must be rebuilt when locale changes. Use `useMemo` keyed on `locale` to regenerate the demo messages array from translations.
  10. Pass `locale` to the `/api/chat` endpoint in the request body so the API can select the correct system prompt.
- **GOTCHA**: The GREETING and DEMO_CONVERSATION are currently defined at module level (outside the component). They must move inside the component or be computed from translations inside a `useMemo`.
- **GOTCHA**: The ChatShell `title` prop for demo mode ("Rosewood Hair Studio") must also be localized.
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 17: UPDATE `app/api/chat/route.ts`

Add locale-aware system prompt.

- **IMPLEMENT**:
  1. Create a Vietnamese version of SYSTEM_PROMPT (same rules, but instruct the AI to respond in Vietnamese)
  2. Read `locale` from the request body: `const locale = body.locale === "vi" ? "vi" : "en"`
  3. Select the appropriate system prompt based on locale
  4. Localize the 3 error messages based on locale
- **GOTCHA**: The Vietnamese system prompt should include: "You MUST respond in Vietnamese. All your responses must be in Vietnamese language."
- **GOTCHA**: Do NOT import from the translation JSON files in the API route. Keep server-side strings inline to avoid bundling client translation files on the server.
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 18: UPDATE `app/api/contact/route.ts`

Add locale-aware validation errors.

- **IMPLEMENT**:
  1. Read `locale` from the request body
  2. Localize the 4 validation error messages
  3. The email template can stay in English (it's sent to the business owner, not the customer)
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

### Task 19: UPDATE `app/not-found.tsx`

Localize 404 page.

- **IMPLEMENT**:
  1. Convert to `"use client"` component
  2. Import `useTranslation`
  3. Replace "404", heading, description, button text
- **GOTCHA**: The "404" text can stay as-is (it's universal). Localize the heading, description, and button.
- **VALIDATE**: `npx next build 2>&1 | tail -5`

---

## TESTING STRATEGY

### Unit Tests

No new unit test files required for this feature. The existing Vitest setup can be extended if desired, but the primary validation is visual + build.

### Integration Tests

- Verify middleware sets correct cookie based on Accept-Language header
- Verify language toggle updates cookie and re-renders UI
- Verify chat API receives locale and responds appropriately

### Edge Cases

- User with `Accept-Language: vi-VN,en-US` should get Vietnamese
- User with `Accept-Language: en-US` should get English
- User with no Accept-Language header should get English
- User manually toggles to Vietnamese, refreshes — should stay Vietnamese (cookie)
- User clears cookies — should re-detect from Accept-Language
- Chat API receives no locale — should default to English
- Vietnamese text with diacritical marks renders correctly with Outfit font
- Very long Vietnamese translations don't break layouts (Vietnamese text can be longer than English)

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
npx tsc --noEmit
npx next lint
```

### Level 2: Build

```bash
npx next build
```

### Level 3: Manual Validation

1. Start dev server: `npx next dev --turbopack`
2. Open http://localhost:3000 — should show English (default)
3. Open browser DevTools > Network > Headers, change Accept-Language to include `vi`
4. Clear the `locale` cookie, refresh — should auto-detect Vietnamese
5. Click EN/VI toggle — should switch languages instantly
6. Refresh page — language preference should persist
7. Test the chat widget — send a message, verify AI responds in the selected language
8. Test the contact form — submit with empty fields, verify error messages are localized
9. Check all sections visually in Vietnamese for layout issues (long text, overflow)
10. Test on mobile viewport — verify language toggle is accessible in hamburger menu

### Level 4: Cross-Browser

- Test in Chrome and Safari (macOS)
- Test in mobile viewport (responsive mode)

---

## ACCEPTANCE CRITERIA

- [ ] Vietnamese visitor (Accept-Language: vi) sees Vietnamese on first visit
- [ ] English visitor sees English on first visit
- [ ] Language toggle in nav switches between EN and VI instantly
- [ ] Language preference persists across page refreshes (cookie)
- [ ] All 150+ strings are translated — no English text visible when in Vietnamese mode
- [ ] Chat demo conversation plays in Vietnamese when locale is VI
- [ ] Real chatbot responds in Vietnamese when locale is VI
- [ ] Contact form validation errors appear in the selected language
- [ ] No layout breakage with Vietnamese text (longer strings, diacritical marks)
- [ ] Build passes with zero TypeScript errors
- [ ] html `lang` attribute updates to match selected locale
- [ ] Existing animations and interactions work identically in both languages

---

## COMPLETION CHECKLIST

- [ ] All 19 tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Full build passes
- [ ] No linting or type checking errors
- [ ] Manual testing confirms both languages work
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability

---

## NOTES

### Design Decisions

1. **No `next-intl` or other i18n library**: For 2 locales and ~150 strings, a 30-line React context + JSON files is simpler than adding a dependency. If more locales are added later, migrating to `next-intl` is straightforward.

2. **Cookie-based, not URL-based**: Keeps the single-page anchor navigation working (`#services`, `#contact`). URL-based would require `app/[lang]/page.tsx` restructuring and break all `href="#section"` links.

3. **Middleware for detection only**: The middleware only sets a cookie on first visit. It doesn't redirect or rewrite. The client reads the cookie and renders the correct language.

4. **Static imports for translations**: Both JSON files are imported statically in the context provider. They're small (~5KB each) so no code-splitting benefit from dynamic imports.

5. **Server-side strings stay inline**: The chat system prompt and API error messages are kept inline in the route files rather than importing from the JSON files. This avoids accidentally bundling client translations on the server and keeps the API routes self-contained.

6. **Outfit font Vietnamese support**: Outfit (Google Fonts) supports Vietnamese diacritical marks (Latin Extended subset). The `subsets: ["latin"]` config in layout.tsx automatically includes Latin Extended which covers Vietnamese. Verify this renders correctly.

### Risks

- **Vietnamese text length**: Vietnamese translations can be 10-30% longer than English. Watch for text overflow in buttons, nav items, and tight card layouts.
- **Font rendering**: Verify Outfit renders Vietnamese diacritical marks (ă, â, ê, ô, ơ, ư, đ) correctly at all weights.
- **SEO**: Without URL-based locale routing, search engines won't see separate Vietnamese/English pages. This is acceptable for a marketing site targeting local businesses, but worth noting.
