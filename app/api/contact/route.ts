import { Resend } from "resend";

const clean = (s: string) => s.replace(/<[^>]*>/g, "");

const VALIDATION_ERRORS = {
  en: {
    nameRequired: "Name is required",
    businessRequired: "Business name is required",
    emailRequired: "Email is required",
    emailInvalid: "Invalid email format",
  },
  vi: {
    nameRequired: "Vui lòng nhập họ tên",
    businessRequired: "Vui lòng nhập tên doanh nghiệp",
    emailRequired: "Vui lòng nhập email",
    emailInvalid: "Email không hợp lệ",
  },
};

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await request.json();
    const locale = body.locale === "vi" ? "vi" : "en";

    const name =
      typeof body.name === "string" ? body.name.trim().slice(0, 200) : "";
    const business =
      typeof body.business === "string"
        ? body.business.trim().slice(0, 200)
        : "";
    const email =
      typeof body.email === "string" ? body.email.trim().slice(0, 320) : "";
    const message =
      typeof body.message === "string"
        ? body.message.trim().slice(0, 2000)
        : "";

    const msgs = VALIDATION_ERRORS[locale];
    const errors: string[] = [];
    if (!name) errors.push(msgs.nameRequired);
    if (!business) errors.push(msgs.businessRequired);
    if (!email) {
      errors.push(msgs.emailRequired);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push(msgs.emailInvalid);
    }

    if (errors.length > 0) {
      return Response.json({ errors }, { status: 400 });
    }

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
        <p><strong>Locale:</strong> ${locale}</p>
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
