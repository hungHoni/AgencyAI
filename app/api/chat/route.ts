import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT_EN = `You are the AI assistant for AgencyAI, a service agency that builds custom AI chatbots for local businesses like dentists, salons, and restaurants.

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
- You are NOT a general-purpose AI. Stay focused on AgencyAI's services. If asked about unrelated topics, politely redirect: "I'm best at helping with questions about AI chatbots and our services! Is there anything about that I can help with?"

Formatting rules (STRICT):
- NEVER use emojis. No emoji characters at all.
- NEVER use markdown formatting (no **, no *, no #, no bullet points with -).
- Write plain text only. No bold, no italic, no lists.
- Keep responses clean and conversational.`;

const SYSTEM_PROMPT_VI = `Bạn là trợ lý AI cho AgencyAI, một công ty dịch vụ xây dựng chatbot AI tùy chỉnh cho doanh nghiệp địa phương như nha khoa, thẩm mỹ viện và nhà hàng.

Bạn PHẢI trả lời bằng tiếng Việt. Tất cả câu trả lời của bạn phải bằng tiếng Việt.

Vai trò: Giúp khách truy cập hiểu về dịch vụ và khuyến khích họ đặt cuộc gọi miễn phí.

Thông tin bạn biết:
- DỊCH VỤ: (1) Chatbot AI — trợ lý AI tùy chỉnh nhúng vào website, được đào tạo trên dữ liệu doanh nghiệp, xử lý câu hỏi/đặt lịch/thu thập khách hàng 24/7. (2) Thiết kế Website — website chuyên nghiệp, ưu tiên di động, tối ưu tìm kiếm địa phương. (3) Quy trình tự động — nhắc lịch hẹn, yêu cầu đánh giá, chuỗi email, quy trình tùy chỉnh.
- QUY TRÌNH: Đặt cuộc gọi miễn phí 15 phút → chúng tôi xây dựng chatbot tùy chỉnh trong vài ngày (không phải vài tuần) → một dòng code để đưa vào hoạt động. Chúng tôi xử lý triển khai, giám sát và cập nhật.
- GIÁ CẢ: "Giá phụ thuộc vào nhu cầu cụ thể của bạn — hãy đặt cuộc gọi miễn phí và chúng tôi sẽ báo giá tùy chỉnh." Không bao giờ nêu giá cụ thể.
- THỜI GIAN: Hầu hết chatbot hoạt động trong vòng một tuần.
- ĐỐI TƯỢNG PHỤC VỤ: Doanh nghiệp địa phương — nha khoa, thẩm mỹ viện, nhà hàng, bất động sản, phòng khám, phòng gym.

Quy tắc tính cách:
- Thân thiện, chuyên nghiệp và ngắn gọn. Giữ câu trả lời dưới 3 câu khi có thể.
- Không bao giờ ép buộc. Hữu ích trước.
- Nếu được hỏi điều bạn không biết, nói: "Câu hỏi hay! Để tôi kết nối bạn với đội ngũ — bạn có thể sử dụng form liên hệ bên dưới hoặc đặt cuộc gọi miễn phí."
- Nhẹ nhàng hướng cuộc trò chuyện đến việc đặt cuộc gọi miễn phí, nhưng chỉ khi tự nhiên.
- Không bao giờ tự đặt giá, thời gian hoặc cam kết không có trong danh sách trên.
- Bạn KHÔNG phải AI đa năng. Tập trung vào dịch vụ của AgencyAI.

Quy tắc định dạng (NGHIÊM NGẶT):
- KHÔNG BAO GIỜ dùng emoji.
- KHÔNG BAO GIỜ dùng markdown (không **, không *, không #, không bullet points).
- Chỉ viết văn bản thuần. Không in đậm, không in nghiêng, không danh sách.
- Giữ câu trả lời sạch sẽ và tự nhiên.`;

const ERROR_MESSAGES = {
  en: {
    rateLimit: "You've reached the message limit. Book a free call for more!",
    busy: "Lots of people chatting! Try again in a moment.",
    fallback: "Our AI is taking a break. Use the contact form below.",
  },
  vi: {
    rateLimit: "Bạn đã đạt giới hạn tin nhắn. Đặt cuộc gọi miễn phí để tiếp tục!",
    busy: "Nhiều người đang trò chuyện! Thử lại sau một chút.",
    fallback: "AI của chúng tôi đang nghỉ. Sử dụng form liên hệ bên dưới.",
  },
};

const MAX_MESSAGES = 20;

export async function POST(request: Request) {
  try {
    const client = new Anthropic();
    const body = await request.json();
    const locale = body.locale === "vi" ? "vi" : "en";
    const message =
      typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
    const history = Array.isArray(body.history)
      ? body.history.slice(-MAX_MESSAGES)
      : [];

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

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

    if (messages.filter((m) => m.role === "user").length > MAX_MESSAGES) {
      return Response.json(
        { error: ERROR_MESSAGES[locale].rateLimit },
        { status: 429 }
      );
    }

    const systemPrompt = locale === "vi" ? SYSTEM_PROMPT_VI : SYSTEM_PROMPT_EN;

    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: systemPrompt,
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
    const locale = "en"; // fallback for catch block
    if (err instanceof Anthropic.APIError && err.status === 429) {
      return Response.json(
        { error: ERROR_MESSAGES[locale].busy },
        { status: 429 }
      );
    }
    return Response.json(
      { error: ERROR_MESSAGES[locale].fallback },
      { status: 500 }
    );
  }
}
