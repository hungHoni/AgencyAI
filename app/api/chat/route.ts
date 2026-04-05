import Anthropic from "@anthropic-ai/sdk";

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
    const client = new Anthropic();
    const body = await request.json();
    const message =
      typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
    const history = Array.isArray(body.history)
      ? body.history.slice(-MAX_MESSAGES)
      : [];

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Validate history format — must be user/assistant with string content
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

    // Rate limit — max user messages per session
    if (messages.filter((m) => m.role === "user").length > MAX_MESSAGES) {
      return Response.json(
        {
          error:
            "You've reached the message limit. Book a free call for more!",
        },
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
