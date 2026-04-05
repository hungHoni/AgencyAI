# Feature: Phase 3 — Contact Form Backend

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Wire the existing ContactForm.tsx client component to a real backend API route that validates form data and sends a notification email to the founder via Resend. The frontend already POSTs to `/api/contact` with `{ name, business, email, message }` — this phase creates the server-side handler.

## User Story

As a local business owner visiting the AgencyAI website
I want to submit a contact form with my info
So that the founder receives my inquiry and can follow up within 24 hours

## Problem Statement

The ContactForm.tsx component (built in Phase 2) already sends a `POST /api/contact` request, but no API route exists yet. Submissions currently fail silently with a network error, showing the "Something went wrong" error state. The founder has no way to receive leads from the website.

## Solution Statement

Create a single Next.js App Router API route (`app/api/contact/route.ts`) that:
1. Validates required fields (name, business, email) server-side
2. Sanitizes input to prevent injection
3. Sends a formatted notification email to the founder via the Resend API
4. Returns appropriate HTTP status codes (200/400/500)

The frontend is already wired — no changes to ContactForm.tsx are needed.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Low
**Primary Systems Affected**: `app/api/contact/` (new), `.env.local` (new)
**Dependencies**: `resend` npm package (v4+), Resend API key

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING!

- `components/ContactForm.tsx` (lines 27-44) — **Critical.** Shows the exact fetch call: `POST /api/contact` with body `{ name, business, email, message }`. The frontend checks `res.ok` and throws on non-2xx. No response body is consumed — only the status code matters.
- `implementation-plan.md` (lines 54-71) — Data flow diagram showing the exact request/response sequence.
- `implementation-plan.md` (lines 128-134) — Phase 3 task checklist.
- `app/layout.tsx` — Root layout pattern. Shows how the project structures files.
- `package.json` — Current dependencies (Next.js 16.2.2, React 19.2.4, Tailwind 4.2.2). No `resend` yet.

### New Files to Create

- `app/api/contact/route.ts` — POST handler: validate → sanitize → send email via Resend → return status
- `.env.local` — Environment variables: `RESEND_API_KEY`, `CONTACT_EMAIL_TO`

### Relevant Documentation — READ BEFORE IMPLEMENTING!

- Resend SDK: `npm install resend`. Import `{ Resend } from 'resend'`. The SDK returns `{ data, error }` — it does NOT throw on API errors. You must check `error` explicitly.
- Resend `emails.send()` params: `from` (required string), `to` (required string[]), `subject` (required), `html` or `text` (required), `replyTo` (optional).
- Free tier: 3,000 emails/month, 100/day, 5 req/sec rate limit.
- **Dev mode `from` address:** Before a custom domain is verified, use `onboarding@resend.dev` as the `from` address. This is Resend's sandbox sender.
- Next.js App Router route handlers: Export named functions (`POST`, `GET`). Use `Response.json()` (Web API standard). No default export. Runs server-side only.

### Patterns to Follow

**API Route Pattern** (Next.js App Router):
```ts
export async function POST(request: Request) {
  const body = await request.json();
  // ... validate, process
  return Response.json({ success: true }, { status: 200 });
}
```

**Frontend Contract** (from ContactForm.tsx lines 34-40):
```ts
const res = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, business, email, message }),
});
if (!res.ok) throw new Error("Failed to send");
```

The frontend:
- Sends JSON body: `{ name: string, business: string, email: string, message: string }`
- Only checks `res.ok` (status 200-299 = success, anything else = error)
- Does NOT parse the response body
- Shows "Something went wrong. Please try again." on error
- Shows success state on 2xx

**Input Validation Pattern:**
- name: required, non-empty after trim, max 200 chars
- business: required, non-empty after trim, max 200 chars
- email: required, valid format (same regex as frontend: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), max 320 chars
- message: optional, max 2000 chars

**Sanitization:** Strip HTML tags from all string inputs to prevent stored XSS in the email. A simple regex replace `/<[^>]*>/g` is sufficient for plain-text email content.

---

## IMPLEMENTATION PLAN

### Phase 1: Dependencies & Environment

Install the `resend` package and create the environment file.

**Tasks:**
- Install `resend` via npm
- Create `.env.local` with Resend API key and recipient email

### Phase 2: API Route

Create the contact form POST handler with validation, sanitization, and email sending.

**Tasks:**
- Create `app/api/contact/route.ts`
- Implement server-side validation matching frontend rules
- Sanitize inputs
- Send formatted email via Resend
- Return appropriate status codes

### Phase 3: Validation

Run type check, lint, build, and manual test.

**Tasks:**
- TypeScript compiles
- ESLint passes
- Build succeeds
- Manual test: submit form → receive email (requires valid Resend API key)

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### 1. ADD `resend` dependency

```bash
npm install resend
```

**VALIDATE:** `npm ls resend` shows the package is installed

---

### 2. CREATE `.env.local`

Create environment variables file at project root. This file is already in `.gitignore` (standard Next.js).

**IMPLEMENT:**

```env
# Resend API key — get from https://resend.com/api-keys
# Keys start with re_
RESEND_API_KEY=re_YOUR_API_KEY_HERE

# Email recipient for contact form submissions
CONTACT_EMAIL_TO=founder@example.com
```

**GOTCHA:** The `from` address in the API route should use `onboarding@resend.dev` until a custom domain is verified with Resend. After domain verification, switch to `hello@yourdomain.com`.

**VALIDATE:** File exists at project root, not tracked by git (`git status` should NOT show it)

---

### 3. CREATE `app/api/contact/route.ts`

This is the core implementation. Single file, single POST export.

**IMPLEMENT:**

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim().slice(0, 200) : "";
    const business = typeof body.business === "string" ? body.business.trim().slice(0, 200) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 320) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";

    // Server-side validation
    const errors: string[] = [];
    if (!name) errors.push("Name is required");
    if (!business) errors.push("Business name is required");
    if (!email) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Invalid email format");
    }

    if (errors.length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

    // Sanitize — strip HTML tags
    const clean = (s: string) => s.replace(/<[^>]*>/g, "");

    const { error } = await resend.emails.send({
      from: "AgencyAI <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL_TO || "founder@example.com"],
      subject: `New lead: ${clean(business)} — ${clean(name)}`,
      replyTo: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${clean(name)}</p>
        <p><strong>Business:</strong> ${clean(business)}</p>
        <p><strong>Email:</strong> ${clean(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${clean(message) || "<em>No message provided</em>"}</p>
        <hr>
        <p style="color: #888; font-size: 12px;">Sent from the AgencyAI contact form</p>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Key decisions:**
- `resend` client instantiated at module scope (reused across requests, not re-created per request)
- `from` uses `onboarding@resend.dev` (Resend sandbox) until custom domain verified — swap to `hello@yourdomain.com` after
- `replyTo` set to the visitor's email so the founder can reply directly
- `subject` includes business name and contact name for easy scanning in inbox
- Input lengths capped server-side (200 chars name/business, 320 email, 2000 message) even though frontend doesn't enforce limits
- HTML sanitization via simple tag strip — sufficient for email content
- Error from Resend SDK is checked explicitly (SDK returns `{ data, error }`, does NOT throw)
- Outer try/catch handles JSON parse failures or network errors

**IMPORTS:** `{ Resend }` from `resend`
**PATTERN:** Next.js App Router route handler — named `POST` export, `Response.json()`, no default export
**GOTCHA:** Resend SDK does NOT throw on API errors — you must check `error` in the returned object. The outer try/catch is only for request parsing / network failures.
**VALIDATE:** `npx tsc --noEmit` + `npm run build`

---

### 4. VERIFY no changes needed in `ContactForm.tsx`

Read `components/ContactForm.tsx` to confirm the existing fetch call matches the API route:
- URL: `/api/contact` ✓ (matches `app/api/contact/route.ts`)
- Method: `POST` ✓
- Body: `JSON.stringify({ name, business, email, message })` ✓ (route reads these exact fields)
- Success check: `res.ok` ✓ (route returns 200 on success, 400/500 on error)

**No changes needed.** The frontend is already wired correctly from Phase 2.

**VALIDATE:** Visual inspection only — no code changes.

---

## TESTING STRATEGY

### Manual Testing (Primary — no test framework until Phase 5)

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000#contact`
3. Test cases:
   - Submit with all fields empty → should show client-side validation errors (frontend handles this)
   - Submit with valid data → should show success state (requires valid `RESEND_API_KEY` in `.env.local`)
   - Submit with valid data but invalid/missing API key → should show "Something went wrong" error state
4. Check founder's email inbox for the notification

### Edge Cases

- Empty message field (optional) — should send email with "No message provided"
- Very long inputs — server truncates to max lengths
- HTML tags in input — stripped before email send
- Invalid JSON body — caught by outer try/catch, returns 500
- Missing `RESEND_API_KEY` env var — Resend constructor handles gracefully, returns error on send

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

### Level 3: Manual Validation

```bash
npm run dev
# Open http://localhost:3000#contact
# Fill form with valid data
# Submit → check for success state
# Check email inbox for notification
```

### Level 4: cURL smoke test

```bash
# Valid submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","business":"Test Biz","email":"test@example.com","message":"Hello"}'
# Expected: {"success":true} with status 200

# Missing required fields
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"","business":"","email":"","message":""}'
# Expected: {"errors":[...]} with status 400

# Invalid email
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","business":"Biz","email":"not-an-email","message":""}'
# Expected: {"errors":["Invalid email format"]} with status 400
```

---

## ACCEPTANCE CRITERIA

- [ ] `resend` package installed in `package.json`
- [ ] `.env.local` created with `RESEND_API_KEY` and `CONTACT_EMAIL_TO`
- [ ] `app/api/contact/route.ts` exists and exports `POST`
- [ ] Server-side validation: returns 400 for missing name, business, or email
- [ ] Server-side validation: returns 400 for invalid email format
- [ ] Input sanitization: HTML tags stripped from all fields
- [ ] Input length limits enforced server-side (200/200/320/2000)
- [ ] Email sent via Resend with correct `from`, `to`, `subject`, `replyTo`, and HTML body
- [ ] Returns 200 on success, 400 on validation error, 500 on API/server error
- [ ] No changes to ContactForm.tsx (frontend already wired)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes with zero errors
- [ ] cURL smoke tests return expected status codes

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] `npm run build` succeeds with zero errors
- [ ] No linting or type checking errors
- [ ] Manual testing confirms form submission works
- [ ] Acceptance criteria all met

---

## NOTES

### Design Decisions

1. **Single file implementation** — The entire backend is one route file (~60 lines). No need for separate validation utilities, email templates, or middleware at this scale.
2. **`onboarding@resend.dev` as sender** — Resend's sandbox sender works without domain verification. Switch to a custom domain sender after DNS setup (Phase 0, currently skipped).
3. **No rate limiting on the API route** — At the current scale (cold outreach to 20 dentists), abuse is unlikely. Resend's own rate limit (5 req/sec, 100/day free tier) provides a natural ceiling. Add server-side rate limiting if traffic grows.
4. **No database** — Leads go directly to email. A database/CRM is explicitly out of scope until 3-5 clients (per implementation plan "NOT in scope" section).
5. **replyTo set to visitor email** — Lets the founder reply directly from their inbox without copy-pasting the email address.

### Confidence Assessment

**Confidence Score: 9/10** — This is a straightforward API route with well-documented patterns. The 1-point deduction is for the dependency on a valid Resend API key during testing — if the user hasn't created a Resend account yet, email sending will fail (but the route will still build and return proper error responses).
