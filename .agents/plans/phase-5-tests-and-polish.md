# Feature: Phase 5 — Tests & Polish

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Add unit tests (Vitest), E2E smoke tests (Playwright), and final polish to the AgencyAI website before launch. This phase ensures code quality, catches regressions, and handles remaining launch prep: custom favicon, responsive QA, performance audit, and copy proofreading.

## User Story

As the solo founder
I want automated tests and a polished site
So that I can deploy with confidence and not break things when making future changes

## Problem Statement

Phases 1-4 built the entire site (foundation, sections, contact form backend, AI chatbot) but with zero automated tests. The site has the default Next.js favicon. No responsive QA has been done systematically. The founder needs confidence that the site works correctly before sending it to potential clients.

## Solution Statement

1. Install Vitest + testing-library for unit/component tests
2. Write API route tests for `/api/contact` (4 test cases)
3. Write component test for `ContactForm.tsx` (5 test cases)
4. Install Playwright for E2E smoke tests (3 test cases)
5. Replace default favicon with a custom AgencyAI favicon
6. Verify responsive behavior at all breakpoints
7. Run Lighthouse performance audit

## Feature Metadata

**Feature Type**: Enhancement (testing + polish)
**Estimated Complexity**: Medium
**Primary Systems Affected**: `__tests__/`, `e2e/`, config files, `app/favicon.ico`
**Dependencies**: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@playwright/test`

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING!

- `app/api/contact/route.ts` (full file) — API route to test. Exports `POST`. Uses lazy-init Resend client. Validates name, business, email. Returns 200/400/500.
- `components/ContactForm.tsx` (full file) — Client component to test. Has form state, validation, submit to `/api/contact`, success/error states.
- `app/page.tsx` (full file) — Home page with all sections. Used by E2E tests to verify page loads.
- `package.json` (full file) — Current deps and scripts. Need to add test scripts.
- `tsconfig.json` — Has `@/*` path alias mapping to project root. Vitest config must mirror this.
- `implementation-plan.md` (lines 170-207) — Test plan with 22 test cases across 5 files.

### New Files to Create

- `vitest.config.ts` — Vitest configuration with React plugin, jsdom, path aliases
- `vitest.setup.ts` — Setup file for jest-dom matchers
- `__tests__/api/contact.test.ts` — Unit tests for contact API route
- `__tests__/components/ContactForm.test.tsx` — Component tests for contact form
- `playwright.config.ts` — Playwright configuration with dev server
- `e2e/smoke.spec.ts` — E2E smoke tests

### Relevant Documentation

- Vitest: Use `vitest/config` for config, `vitest` for test runner. Test API routes by importing the POST function and calling with a `new Request()`.
- @testing-library/react v16+: Supports React 19. Use `render`, `screen`, `userEvent.setup()`.
- @testing-library/jest-dom/vitest: Provides `.toBeInTheDocument()`, `.toBeVisible()` matchers.
- Playwright: Use `defineConfig` from `@playwright/test`. `webServer` config starts dev server automatically.

### Patterns to Follow

**API Route Test Pattern:**
```ts
import { POST } from "@/app/api/contact/route";

const req = new Request("http://localhost/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Test", business: "Biz", email: "a@b.com", message: "Hi" }),
});
const res = await POST(req);
expect(res.status).toBe(200);
```

**Component Test Pattern:**
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

render(<ContactForm />);
await userEvent.type(screen.getByPlaceholderText("Priya Ramirez"), "Test User");
```

**E2E Test Pattern:**
```ts
import { test, expect } from "@playwright/test";

test("page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("nav")).toBeVisible();
});
```

---

## IMPLEMENTATION PLAN

### Phase 1: Vitest Setup

Install dependencies, create config files, add test scripts.

### Phase 2: Unit Tests

Write API route tests for /api/contact and component tests for ContactForm.

### Phase 3: Playwright Setup

Install Playwright, create config, write E2E smoke tests.

### Phase 4: Polish

Custom favicon, responsive verification, performance check.

---

## STEP-BY-STEP TASKS

---

### 1. ADD Vitest dependencies

```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**VALIDATE:** `npm ls vitest` shows the package installed

---

### 2. CREATE `vitest.config.ts`

**IMPLEMENT:**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    css: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

**GOTCHA:** The `@` alias maps to the project root (not `./src`), matching `tsconfig.json`'s `"@/*": ["./*"]`.
**VALIDATE:** File exists, no syntax errors

---

### 3. CREATE `vitest.setup.ts`

**IMPLEMENT:**

```ts
import "@testing-library/jest-dom/vitest";
```

**VALIDATE:** File exists

---

### 4. UPDATE `package.json` — add test scripts

Add to the `"scripts"` section:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

**VALIDATE:** `npm run test -- --help` shows vitest help

---

### 5. CREATE `__tests__/api/contact.test.ts`

Test the contact API route. Since the route calls Resend, we need to mock it. Use `vi.mock("resend")` to prevent real API calls during tests.

**IMPLEMENT:**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";

// Mock Resend to prevent real API calls
vi.mock("resend", () => {
  const mockSend = vi.fn().mockResolvedValue({ data: { id: "test-id" }, error: null });
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: { send: mockSend },
    })),
  };
});

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 on valid submission", async () => {
    const res = await POST(makeRequest({
      name: "Priya Ramirez",
      business: "Rosewood Hair Studio",
      email: "priya@rosewoodhair.com",
      message: "I need a chatbot",
    }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({
      name: "",
      business: "Biz",
      email: "a@b.com",
      message: "",
    }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.errors).toContain("Name is required");
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(makeRequest({
      name: "Test",
      business: "Biz",
      email: "not-an-email",
      message: "",
    }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.errors).toContain("Invalid email format");
  });

  it("returns 400 when multiple fields are missing", async () => {
    const res = await POST(makeRequest({
      name: "",
      business: "",
      email: "",
      message: "",
    }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("returns 200 when message is empty (optional field)", async () => {
    const res = await POST(makeRequest({
      name: "Test",
      business: "Biz",
      email: "a@b.com",
      message: "",
    }));
    expect(res.status).toBe(200);
  });

  it("returns 500 when Resend fails", async () => {
    // Re-mock with error
    const { Resend } = await import("resend");
    vi.mocked(Resend).mockImplementationOnce(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ data: null, error: { message: "API down" } }),
      },
    }) as unknown as InstanceType<typeof Resend>);

    const res = await POST(makeRequest({
      name: "Test",
      business: "Biz",
      email: "a@b.com",
      message: "Hello",
    }));
    expect(res.status).toBe(500);
  });
});
```

**GOTCHA:** The Resend client is instantiated inside the POST handler (lazy init), so the mock must be at the module level via `vi.mock("resend")`. The mock returns `{ data, error }` matching the real Resend SDK pattern.
**VALIDATE:** `npx vitest run __tests__/api/contact.test.ts`

---

### 6. CREATE `__tests__/components/ContactForm.test.tsx`

Test the ContactForm client component rendering, validation, and submission.

**IMPLEMENT:**

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ContactForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText("Priya Ramirez")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Rosewood Hair Studio")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("priya@rosewoodhair.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Answer questions about services/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Message" })).toBeInTheDocument();
  });

  it("shows validation errors for empty required fields", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Business name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    // fetch should NOT have been called
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Priya Ramirez"), "Test");
    await user.type(screen.getByPlaceholderText("Rosewood Hair Studio"), "Biz");
    await user.type(screen.getByPlaceholderText("priya@rosewoodhair.com"), "bad-email");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("submits valid data and shows success message", async () => {
    mockFetch.mockResolvedValueOnce({ ok: true });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Priya Ramirez"), "Priya");
    await user.type(screen.getByPlaceholderText("Rosewood Hair Studio"), "Rosewood");
    await user.type(screen.getByPlaceholderText("priya@rosewoodhair.com"), "priya@test.com");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText(/Thanks!/)).toBeInTheDocument();
    });
    expect(mockFetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({
      method: "POST",
    }));
  });

  it("shows error message when API fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByPlaceholderText("Priya Ramirez"), "Test");
    await user.type(screen.getByPlaceholderText("Rosewood Hair Studio"), "Biz");
    await user.type(screen.getByPlaceholderText("priya@rosewoodhair.com"), "a@b.com");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });
});
```

**GOTCHA:** ContactForm is a default export (not named), so import as `import ContactForm from "@/components/ContactForm"`. The component uses `fetch` directly — mock `global.fetch` instead of mocking a library.
**VALIDATE:** `npx vitest run __tests__/components/ContactForm.test.tsx`

---

### 7. ADD Playwright dependency

```bash
npm i -D @playwright/test
npx playwright install chromium
```

Only install Chromium (not all browsers) to keep CI fast. Firefox/Safari can be added later.

**VALIDATE:** `npx playwright --version` shows version

---

### 8. CREATE `playwright.config.ts`

**IMPLEMENT:**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
});
```

**VALIDATE:** File exists, no syntax errors

---

### 9. CREATE `e2e/smoke.spec.ts`

Basic E2E smoke tests that verify the page loads and key sections are visible.

**IMPLEMENT:**

```ts
import { test, expect } from "@playwright/test";

test("homepage loads with all sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("nav")).toBeVisible();
  await expect(page.getByText("An AI employee that never")).toBeVisible();
  await expect(page.getByText("24/7")).toBeVisible();
  await expect(page.getByText("Everything your customers need")).toBeVisible();
  await expect(page.getByText("How we help you grow")).toBeVisible();
  await expect(page.getByText("Three steps")).toBeVisible();
  await expect(page.getByText("Ready to stop missing customers")).toBeVisible();
  await expect(page.getByText("Tell us about your business")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});

test("nav links scroll to sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Services" }).first().click();
  await expect(page.locator("#services")).toBeInViewport();
});

test("contact form shows validation errors", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Name is required")).toBeVisible();
  await expect(page.getByText("Email is required")).toBeVisible();
});
```

**GOTCHA:** Use `.first()` on nav link selectors since the same text may appear in footer links too. Don't test actual form submission in E2E (depends on Resend API key).
**VALIDATE:** `npx playwright test` (requires dev server)

---

### 10. GENERATE custom favicon

Create a simple SVG favicon for AgencyAI — the logo text "AI" in emerald on a dark background. Next.js supports `app/icon.svg` as a favicon.

**IMPLEMENT:** Create `app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#18181b"/>
  <text x="16" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#10b981">AI</text>
</svg>
```

This gives a dark rounded square with emerald "AI" text — matching the brand colors from DESIGN.md. Next.js will automatically use `app/icon.svg` as the favicon.

The existing `app/favicon.ico` (default Next.js) can remain as a fallback for older browsers, but `icon.svg` takes priority in modern browsers.

**VALIDATE:** `npm run dev` → check browser tab shows the new icon

---

### 11. RUN all validation commands

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Fix any failures before proceeding.

**VALIDATE:** All commands pass with zero errors

---

## TESTING STRATEGY

### Unit Tests (Vitest)

**API route tests** (`__tests__/api/contact.test.ts`):
- Valid submission → 200 + `{ success: true }`
- Missing name → 400 + error
- Invalid email → 400 + error
- Multiple missing fields → 400 + multiple errors
- Empty message (optional) → 200
- Resend failure → 500

**Component tests** (`__tests__/components/ContactForm.test.tsx`):
- Renders all form fields with placeholders
- Empty submit → shows validation errors, no fetch call
- Invalid email → shows email error
- Valid submit → shows success message
- API failure → shows error message

### E2E Tests (Playwright)

**Smoke tests** (`e2e/smoke.spec.ts`):
- Homepage loads with all sections visible
- Nav links scroll to correct sections
- Contact form shows validation errors

### Edge Cases

- Form double-submit (button disabled during submission)
- Very long input values (server truncates)
- HTML injection in form fields (React escapes by default)

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
npx tsc --noEmit
npm run lint
```

### Level 2: Unit Tests

```bash
npm run test
```

### Level 3: E2E Tests

```bash
npm run test:e2e
```

### Level 4: Build

```bash
npm run build
```

---

## ACCEPTANCE CRITERIA

- [ ] Vitest installed and configured with React plugin + jsdom
- [ ] 6 API route tests passing for `/api/contact`
- [ ] 5 component tests passing for `ContactForm`
- [ ] Playwright installed with Chromium
- [ ] 3 E2E smoke tests passing
- [ ] Custom SVG favicon displays in browser tab
- [ ] `npm run test` passes with zero failures
- [ ] `npm run build` passes with zero errors
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Unit tests pass (vitest)
- [ ] E2E tests pass (playwright)
- [ ] No linting or type checking errors
- [ ] Build succeeds
- [ ] Acceptance criteria all met

---

## NOTES

### Design Decisions

1. **Vitest over Jest** — Vitest is faster, supports ESM natively, and works with Vite's React plugin. Jest has compatibility issues with Next.js App Router's ESM modules.
2. **Mock Resend at module level** — The contact route lazy-inits Resend inside the handler. `vi.mock("resend")` intercepts the import, so the mock is used when the handler creates `new Resend()`.
3. **Mock fetch for component tests** — ContactForm calls `fetch("/api/contact")` directly. Mocking `global.fetch` is simpler than running a real server.
4. **Playwright only installs Chromium** — Firefox and WebKit add significant install time. Chromium covers the primary use case. Cross-browser testing can be added later.
5. **No chat API/widget tests** — Testing the streaming chat endpoint requires mocking the Anthropic SDK's streaming interface, which is complex. The chatbot is better tested manually for now. Can be added in a future iteration.
6. **SVG favicon** — Modern browsers prefer SVG. The existing `favicon.ico` remains as fallback for IE/legacy browsers.

### Confidence Assessment

**Confidence Score: 8/10** — Vitest setup with Next.js App Router has some path alias and module resolution quirks that may need tweaking. The 2-point deduction is for: (1) possible `@testing-library/react` compatibility issues with React 19.2.4, and (2) Playwright webServer startup timing.
