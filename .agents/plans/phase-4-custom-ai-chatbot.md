# Feature: Phase 4 — Custom AI Chatbot

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Build a real, interactive AI chatbot powered by Claude Haiku that replaces the static ChatPreview mockup in the hero section. The chatbot streams responses in real-time, appears both inline in the hero and as a floating bubble in the bottom-right corner, captures leads after 3+ messages, and gracefully handles errors. This is the product demo — visitors experience exactly what they'd be buying.

## User Story

As a local business owner visiting the AgencyAI website
I want to chat with a live AI assistant that demonstrates the product
So that I can see the chatbot in action and feel confident booking a call

## Problem Statement

The hero section currently shows a static ChatPreview with hardcoded conversation bubbles. Visitors can't interact with it. The site promises "See It In Action" but doesn't deliver. The founder needs the chatbot to work live so cold DM recipients experience the product immediately.

## Solution Statement

Replace the static `ChatPreview.tsx` with a live `ChatWidget.tsx` Client Component that:
1. Sends user messages to `POST /api/chat` with conversation history
2. Renders streaming tokens from Claude Haiku in real-time
3. Appears inline in the hero section (replacing the mockup) AND as a floating bubble (bottom-right)
4. Prompts for lead capture (name + email) after 3+ messages
5. Posts captured leads to the existing `/api/contact` endpoint
6. Falls back gracefully when the API is unavailable

The API route (`app/api/chat/route.ts`) builds a system prompt with agency info and streams Claude's response as a `ReadableStream`.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: High
**Primary Systems Affected**: `components/ChatWidget.tsx` (new), `app/api/chat/route.ts` (new), `components/Hero.tsx` (update import), `app/page.tsx` (no change — Hero handles it)
**Dependencies**: `@anthropic-ai/sdk` npm package, `ANTHROPIC_API_KEY` environment variable

---

## CONTEXT REFERENCES

### Relevant Codebase Files — YOU MUST READ THESE BEFORE IMPLEMENTING!

- `components/ChatPreview.tsx` (full file) — **Replace this.** Contains the exact visual structure (dark card, chat header, bubble styles, compose bar) that ChatWidget.tsx must preserve. The CSS classes are the source of truth for styling.
- `components/Hero.tsx` (line 2, line 41) — Currently imports `ChatPreview`. Must be updated to import `ChatWidget` instead.
- `app/api/contact/route.ts` (full file) — **Pattern reference** for API route structure. Also the endpoint ChatWidget will POST lead capture data to.
- `app/globals.css` (lines 48-51) — The `breathe` keyframe animation used for the status dot.
- `DESIGN.md` (full file) — Design tokens, anti-slop rules. Chatbot preview section defines colors, radius, shadows.
- `design-doc.md` (lines 135-150) — Chatbot personality spec: what it knows, how it responds, lead capture behavior, fallback.
- `implementation-plan.md` (lines 74-94) — Data flow diagram for chatbot.
- `implementation-plan.md` (lines 136-155) — Phase 4 task checklist.

### New Files to Create

- `app/api/chat/route.ts` — POST handler: build system prompt, call Claude Haiku with streaming, return ReadableStream
- `components/ChatWidget.tsx` — `'use client'` — interactive chatbot with hero mode + floating mode, streaming, lead capture

### Files to Modify

- `components/Hero.tsx` — Change `import ChatPreview` to `import ChatWidget`, swap `<ChatPreview />` to `<ChatWidget />`
- `.env.local` — Add `ANTHROPIC_API_KEY`

### Relevant Documentation — READ BEFORE IMPLEMENTING!

- Anthropic SDK: `import Anthropic from "@anthropic-ai/sdk"`. Constructor reads `ANTHROPIC_API_KEY` from env automatically. Use `client.messages.stream()` for streaming. Returns typed events — filter for `content_block_delta` with `text_delta`.
- Claude Haiku model ID: `claude-haiku-4-5`
- `max_tokens` is required (no default). Use 1024 for chatbot responses.
- Messages must alternate user/assistant roles. First message must be `user`.
- System prompt is a separate `system` parameter, NOT in the messages array.
- SDK has built-in retries for 429/529 errors (2 retries by default).

### Patterns to Follow

**API Route Pattern** (from `app/api/contact/route.ts`):
```ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // ... process
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return Response.json({ error: "..." }, { status: 500 });
  }
}
```

**Streaming Route Pattern** (Anthropic SDK → Web ReadableStream):
```ts
const stream = client.messages.stream({
  model: "claude-haiku-4-5",
  max_tokens: 1024,
  system: systemPrompt,
  messages,
});

const readableStream = new ReadableStream({
  async start(controller) {
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        controller.enqueue(new TextEncoder().encode(event.delta.text));
      }
    }
    controller.close();
  },
});

return new Response(readableStream, {
  headers: { "Content-Type": "text/plain; charset=utf-8" },
});
```

**Client Component Pattern** (from `components/ContactForm.tsx`):
```tsx
"use client";
import { useState, type FormEvent } from "react";
```

**Chat Bubble Styles** (from `ChatPreview.tsx`):
- Bot bubble: `bg-white/5 border border-white/[0.06] px-4 py-[13px] rounded-[14px_14px_14px_4px] text-[13px] text-zinc-400 leading-[1.65] max-w-[85%]`
- User bubble: `bg-emerald-500 px-4 py-[13px] rounded-[14px_14px_4px_14px] text-[13px] text-white leading-[1.65] max-w-[85%] ml-auto`

**Tailwind Class Convention** (from Nav.tsx):
- Transitions: `transition-all duration-400 ease-smooth`
- Hover: `hover:-translate-y-px`, `hover:bg-zinc-700`
- Active: `active:translate-y-0 active:scale-[0.98]`
- Custom tokens: `rounded-btn`, `rounded-card`, `shadow-card`, `shadow-elevated`

---

## IMPLEMENTATION PLAN

### Phase 1: API Route (Backend)

Create the streaming chat API route with system prompt.

**Tasks:**
- Install `@anthropic-ai/sdk`
- Add `ANTHROPIC_API_KEY` to `.env.local`
- Create `app/api/chat/route.ts` with streaming response
- Write the agency system prompt

### Phase 2: Chat Widget (Frontend)

Build the interactive ChatWidget component with two modes.

**Tasks:**
- Create `components/ChatWidget.tsx` with hero mode + floating bubble
- Implement streaming text rendering
- Implement message history in React state
- Add lead capture prompt after 3+ messages
- Add error fallback UI

### Phase 3: Integration

Wire the widget into the existing page.

**Tasks:**
- Update `Hero.tsx` to use ChatWidget instead of ChatPreview
- Wire "See It In Action" CTA to scroll to chatbot and focus input

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### 1. ADD `@anthropic-ai/sdk` dependency

```bash
npm install @anthropic-ai/sdk
```

**VALIDATE:** `npm ls @anthropic-ai/sdk` shows the package is installed

---

### 2. UPDATE `.env.local` — add Anthropic API key

Add `ANTHROPIC_API_KEY` to the existing `.env.local` file (which already has Resend keys).

**IMPLEMENT:** Append to `.env.local`:

```env
# Anthropic API key — get from https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-YOUR_API_KEY_HERE
```

**GOTCHA:** The SDK reads `ANTHROPIC_API_KEY` automatically — no need to pass it to the constructor.
**VALIDATE:** File updated, key present

---

### 3. CREATE `app/api/chat/route.ts`

The streaming chat API route. Accepts `{ message, history }`, validates, builds system prompt, streams Claude Haiku response.

**IMPLEMENT:**

```tsx
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are the AI assistant for AgencyAI, a service agency that builds custom AI chatbots for local businesses like dentists, salons, and restaurants.

Your role: Help visitors understand the services and encourage them to book a free call.

What you know:
- SERVICES: (1) AI Chatbot — custom AI assistant embedded on their website, trained on their business data, handles questions/bookings/leads 24/7. (2) Website Design — professional, mobile-first sites built for local search. (3) Automation Flows — appointment reminders, review requests, email sequences, custom workflows.
- PROCESS: Book a free 15-minute call → we build a custom chatbot in days (not weeks) → one line of code to go live. We handle deployment, monitoring, and updates.
- PRICING: "Pricing depends on your specific needs — book a free call and we'll give you a custom quote." Never state specific prices.
- TURNAROUND: Most chatbots are live within a week.
- WHO WE SERVE: Local businesses — dentists, salons, restaurants, real estate agents, clinics, gyms. Anyone with a physical business who needs online presence and customer support automation.

Personality rules:
- Be friendly, professional, and concise. Keep responses under 3 sentences when possible.
- Never be pushy. Be helpful first.
- If asked something you don't know, say: "Great question! Let me connect you with the team — you can use the contact form below or book a free call."
- Gently guide conversations toward booking a free call, but only when natural.
- Never make up specific pricing, timelines, or guarantees not listed above.
- You are NOT a general-purpose AI. Stay focused on AgencyAI's services. If asked about unrelated topics, politely redirect: "I'm best at helping with questions about AI chatbots and our services! Is there anything about that I can help with?"`;

const MAX_MESSAGES = 20;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
    const history = Array.isArray(body.history) ? body.history.slice(-MAX_MESSAGES) : [];

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Validate history format — must alternate user/assistant
    const messages: Anthropic.MessageParam[] = [];
    for (const msg of history) {
      if (
        msg &&
        typeof msg.role === "string" &&
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string"
      ) {
        messages.push({ role: msg.role, content: msg.content.slice(0, 2000) });
      }
    }
    messages.push({ role: "user", content: message });

    // Rate limit check — max messages per session
    if (messages.filter((m) => m.role === "user").length > MAX_MESSAGES) {
      return Response.json(
        { error: "You've reached the message limit. Book a free call for more!" },
        { status: 429 }
      );
    }

    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
          controller.close();
        } catch {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    if (err instanceof Anthropic.APIError && err.status === 429) {
      return Response.json(
        { error: "Lots of people chatting! Try again in a moment." },
        { status: 429 }
      );
    }
    return Response.json(
      { error: "Our AI is taking a break. Use the contact form below." },
      { status: 500 }
    );
  }
}
```

**Key decisions:**
- System prompt embedded as a const string at module level (not fetched from DB — this is a solo founder site)
- Message history capped at 20 messages, each capped at 2000 chars
- User message capped at 1000 chars
- History validated: only `user`/`assistant` roles with string content pass through
- Stream events filtered for `content_block_delta` + `text_delta` only
- Error fallback returns human-friendly messages matching the design doc spec
- `Cache-Control: no-cache` prevents streaming response from being cached

**PATTERN:** Mirror `app/api/contact/route.ts` structure — try/catch, `Response.json()` for errors
**IMPORTS:** `Anthropic` default import from `@anthropic-ai/sdk`
**GOTCHA:** The `Anthropic.MessageParam` type requires `role: "user" | "assistant"` — validate history entries before passing.
**VALIDATE:** `npx tsc --noEmit` + `npm run build`

---

### 4. CREATE `components/ChatWidget.tsx`

The interactive chatbot component. This is a `'use client'` component with:
- **Hero mode:** Embedded in the hero section (same visual as ChatPreview, but interactive)
- **Floating mode:** A bubble button in the bottom-right that expands to a chat panel
- **Streaming:** Tokens appear as they arrive from the API
- **Lead capture:** After 3+ user messages, show an inline name/email form
- **Error fallback:** Shows a message pointing to the contact form

**IMPLEMENT:**

The component must preserve the exact visual styling from `ChatPreview.tsx`:
- Dark card container: `bg-zinc-900 rounded-[calc(var(--radius)+4px)] p-6 shadow-elevated text-zinc-300 relative`
- Inner border refraction: `absolute top-3 left-3 right-3 bottom-3 border border-white/[0.04] rounded-card pointer-events-none`
- Chat header with avatar, name "AgencyAI", status "Online now" with breathing dot
- Bot bubbles: `bg-white/5 border border-white/[0.06] px-4 py-[13px] rounded-[14px_14px_14px_4px] text-[13px] text-zinc-400 leading-[1.65] max-w-[85%]`
- User bubbles: `bg-emerald-500 px-4 py-[13px] rounded-[14px_14px_4px_14px] text-[13px] text-white leading-[1.65] max-w-[85%] ml-auto`
- Compose bar: input + send button matching ChatPreview styling

**State management:**
```ts
type Message = { role: "user" | "assistant"; content: string };
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [isStreaming, setIsStreaming] = useState(false);
const [error, setError] = useState<string | null>(null);
const [showLeadCapture, setShowLeadCapture] = useState(false);
const [leadCaptured, setLeadCaptured] = useState(false);
const [floatingOpen, setFloatingOpen] = useState(false);
```

**Initial greeting:** On mount, prepend a bot message:
```
"Hi! I'm the AgencyAI assistant. Ask me anything about our AI chatbot services, pricing, or process. How can I help?"
```
This is NOT sent to the API — it's a static welcome message in the messages state.

**Streaming implementation:**
```ts
async function sendMessage() {
  if (!input.trim() || isStreaming) return;
  const userMessage = input.trim();
  setInput("");
  setError(null);

  const newMessages = [...messages, { role: "user" as const, content: userMessage }];
  setMessages(newMessages);
  setIsStreaming(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        history: messages, // send previous messages as history (NOT including the current one — API adds it)
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to get response");
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = "";

    // Add empty assistant message that we'll update as tokens stream in
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantMessage += decoder.decode(value, { stream: true });
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
        return updated;
      });
    }

    // Check if lead capture should trigger (3+ user messages, not already captured)
    const userCount = newMessages.filter((m) => m.role === "user").length;
    if (userCount >= 3 && !leadCaptured) {
      setShowLeadCapture(true);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : "Our AI is taking a break. Use the contact form below.");
  } finally {
    setIsStreaming(false);
  }
}
```

**Lead capture form** (inline, appears after 3+ messages):
- Small inline form below the chat: name + email + "Send" button
- On submit: POST to `/api/contact` with `{ name, business: "Via chatbot", email, message: "Lead captured from chatbot conversation" }`
- On success: hide form, set `leadCaptured = true`, show "Thanks! We'll be in touch."
- On dismiss: hide form, set `leadCaptured = true` (don't show again)

**Floating bubble mode:**
- Fixed position `bottom-6 right-6`, z-50
- Bubble button: 56px circle, emerald background, white chat icon, shadow-elevated
- When clicked: `setFloatingOpen(true)` → expands to a chat panel (same ChatWidget UI but in a fixed popup)
- Close button (X) in the chat panel header to collapse back to bubble
- The floating panel should be approximately 380px wide × 520px tall, fixed bottom-right
- When floating panel is open, the hero-mode widget still shows in the hero (both can exist)

**Hero mode vs Floating mode:**
The component renders BOTH modes:
1. The inline hero version (always visible in the hero section, same place as ChatPreview was)
2. The floating bubble + popup (fixed bottom-right, toggleable)

Both share the SAME state (messages, streaming, etc.) — they're the same component instance. The hero mode is the full-size embedded version. The floating mode is a compact popup.

To implement this cleanly: render the chat UI as a shared inner function/component, and render it in two places — once inline (hero) and once in the floating popup. Both read from the same state.

**Error fallback UI:**
When `error` is set, show an error message in place of the bot's response:
```
"Our AI is taking a break. Use the contact form below."
```
With a link/button to scroll to `#contact`.

**Auto-scroll:** The chat messages area should auto-scroll to the bottom when new messages arrive or while streaming. Use a `useRef` on the messages container and `scrollIntoView` on the last message.

**Input handling:**
- Send on Enter key (not Shift+Enter — that inserts newline)
- Disable send button while streaming
- Clear input immediately after sending (optimistic)

**EXACT SVG ICONS (reuse from ChatPreview):**
- Chat avatar: `<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>`
- Send button: `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`
- Close (X) icon for floating panel: `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`
- Floating bubble icon: same chat avatar icon

**VALIDATE:** `npx tsc --noEmit` + `npm run dev` (chat should work with valid API key)

---

### 5. UPDATE `components/Hero.tsx` — swap ChatPreview for ChatWidget

**IMPLEMENT:**

Change line 2: `import ChatPreview from "@/components/ChatPreview";` → `import ChatWidget from "@/components/ChatWidget";`

Change line 41: `<ChatPreview />` → `<ChatWidget />`

**GOTCHA:** ChatWidget is a Client Component (`'use client'`), but Hero.tsx is a Server Component. This is fine — Server Components can import and render Client Components. The `'use client'` boundary is declared in ChatWidget.tsx itself.

**VALIDATE:** `npx tsc --noEmit` + `npm run dev` (hero should show interactive chatbot)

---

### 6. UPDATE Hero.tsx — wire "See It In Action" CTA

The "See It In Action" button currently links to `#capabilities`. It should instead scroll the page up to the hero and focus the chat input.

**IMPLEMENT:**

Since the chatbot IS in the hero section (visible on page load), the CTA should focus the chat input. The simplest approach: give the chat input an `id="chat-input"` in ChatWidget.tsx, then change the Hero CTA to use a click handler that focuses it.

However, Hero.tsx is a Server Component and can't have onClick handlers. Two options:
1. Make the CTA a simple anchor `href="#chat-input"` which scrolls to the input (works with `scroll-behavior: smooth` already set in globals.css)
2. Keep it as a link but point to the top of the page

**Decision:** Use `href="#chat-input"` — the browser will smooth-scroll to the chat input. Add `id="chat-input"` to the actual input element in ChatWidget.tsx.

Change: `href="#capabilities"` → `href="#chat-input"`

**VALIDATE:** Click "See It In Action" → page scrolls to chat input area

---

## TESTING STRATEGY

### Manual Testing (Primary — no test framework until Phase 5)

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Test scenarios:

**Basic conversation:**
- Type "What services do you offer?" → bot streams response about chatbot, website, automation
- Type "How much does it cost?" → bot mentions booking a free call, doesn't give specific prices
- Type "How long does it take?" → bot mentions "within a week"

**Lead capture:**
- Send 3+ messages → lead capture form appears
- Fill name + email → submit → form disappears, "Thanks" message shown
- Verify POST to /api/contact was made (check network tab)

**Floating bubble:**
- Scroll down past hero → floating bubble visible in bottom-right
- Click bubble → chat panel opens with same conversation
- Close panel → collapses back to bubble

**Error handling:**
- Remove ANTHROPIC_API_KEY from .env.local → restart → send message → error fallback shows
- Send 20+ messages → rate limit message appears

**Edge cases:**
- Empty message → send button disabled / no request made
- Very long message (1000+ chars) → truncated server-side
- Rapid-fire messages while streaming → send disabled during stream
- Refresh page → conversation resets (expected — no persistence)

### Edge Cases

- Stream disconnects mid-response — should display partial text, not crash
- API returns 429 (rate limit) — user sees friendly rate limit message
- API returns 500 — user sees "AI is taking a break" message
- User sends HTML/script tags — displayed as text in bubble (React escapes by default)

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
# Open http://localhost:3000
# Test chatbot interaction in hero section
# Test floating bubble
# Test lead capture after 3 messages
```

### Level 4: cURL smoke test

```bash
# Valid chat message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What services do you offer?","history":[]}'
# Expected: streaming text response about AgencyAI services

# Empty message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"","history":[]}'
# Expected: {"error":"Message is required"} with status 400
```

---

## ACCEPTANCE CRITERIA

- [ ] `@anthropic-ai/sdk` installed in package.json
- [ ] `ANTHROPIC_API_KEY` added to `.env.local`
- [ ] `app/api/chat/route.ts` exists and exports `POST`
- [ ] API route streams Claude Haiku responses as `ReadableStream`
- [ ] System prompt contains agency services, process, pricing guidance, personality rules
- [ ] Server-side validation: returns 400 for empty message
- [ ] Server-side rate limit: returns 429 after 20+ user messages
- [ ] Input sanitization: message capped at 1000 chars, history at 20 messages
- [ ] `components/ChatWidget.tsx` replaces `ChatPreview.tsx` in hero section
- [ ] ChatWidget preserves exact visual styling from ChatPreview (dark card, bubble styles, compose bar)
- [ ] Streaming text renders token-by-token as it arrives
- [ ] Initial greeting message displayed on mount (static, not from API)
- [ ] Chat auto-scrolls to newest message
- [ ] Send on Enter key, disabled while streaming
- [ ] Floating bubble appears bottom-right, expands to chat panel on click
- [ ] Lead capture form appears after 3+ user messages
- [ ] Lead capture POSTs to `/api/contact`
- [ ] Error fallback: "Our AI is taking a break. Use the contact form below."
- [ ] "See It In Action" CTA scrolls to and focuses chat input
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes with zero errors
- [ ] No regressions in existing sections (Nav, Metrics, Capabilities, Services, HowItWorks, CtaBanner, ContactForm, Footer)

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] `npm run build` succeeds with zero errors
- [ ] No linting or type checking errors
- [ ] Manual testing confirms chatbot works end-to-end
- [ ] Acceptance criteria all met

---

## NOTES

### Design Decisions

1. **Shared state between hero mode and floating mode** — Both render the same ChatWidget instance. The floating popup is a portal/overlay that shows the same conversation. This avoids duplicate API calls and split conversations.
2. **Static initial greeting** — The welcome message is NOT sent to Claude. It's a hardcoded string prepended to the messages state. This saves one API call per page load and ensures instant display.
3. **No message persistence** — Conversations reset on page refresh. This is intentional for v1 — no localStorage, no database. Visitors are expected to have short exploratory conversations.
4. **Lead capture after 3 messages** — This threshold is a balance between letting visitors explore (too early = annoying) and capturing leads before they leave (too late = missed). The form is dismissible.
5. **`ChatPreview.tsx` is NOT deleted** — It remains in the codebase as a reference but is no longer imported. It can be removed in Phase 5 cleanup if desired.
6. **System prompt as const string** — For a solo founder site with one chatbot personality, a hardcoded system prompt is simpler than a database/config approach. Update it by editing the code.
7. **Rate limit is session-based (message count in request)** — Not IP-based or token-based. The client sends full history, and the server counts user messages. This is bypassable (visitor can clear history) but sufficient for preventing casual abuse. Resend's 100/day email limit provides a natural ceiling for lead spam.

### Confidence Assessment

**Confidence Score: 8/10** — The streaming pattern is well-established, and all visual specs come from the existing ChatPreview. The 2-point deduction is for: (1) the floating bubble + hero dual-render adds UI complexity that may need polish, and (2) the lead capture integration with `/api/contact` needs the Resend API key to fully test.
