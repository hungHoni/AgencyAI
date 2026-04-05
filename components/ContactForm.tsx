"use client";

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!business.trim()) newErrors.business = "Business name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, email, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="max-w-site mx-auto px-12 py-24 grid grid-cols-2 gap-20 items-start max-lg:grid-cols-1 max-lg:gap-12 max-sm:px-5 max-sm:py-16"
    >
      {/* Left column — info & trust signals */}
      <div>
        <div className="text-xs font-semibold text-emerald-600 tracking-[1.2px] uppercase mb-3">
          Contact
        </div>
        <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 max-w-[400px]">
          Tell us about your business.
        </h2>
        <p className="text-base text-zinc-600 max-w-[480px] leading-[1.7]">
          We&apos;ll show you exactly what your AI chatbot could handle, with a
          custom demo for your industry.
        </p>

        <div className="mt-10 flex flex-col gap-5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 bg-[rgba(16,185,129,0.06)] rounded-btn flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
            </div>
            <div>
              <h5 className="text-sm font-semibold tracking-[-0.2px]">
                Quick response
              </h5>
              <p className="text-[13px] text-zinc-600 mt-px">
                We respond within 2 hours during business days
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 bg-[rgba(16,185,129,0.06)] rounded-btn flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h5 className="text-sm font-semibold tracking-[-0.2px]">
                Free consultation
              </h5>
              <p className="text-[13px] text-zinc-600 mt-px">
                15-minute call to understand your needs
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 bg-[rgba(16,185,129,0.06)] rounded-btn flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h5 className="text-sm font-semibold tracking-[-0.2px]">
                No commitment
              </h5>
              <p className="text-[13px] text-zinc-600 mt-px">
                No contracts, no obligations. See the value first.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column — form card */}
      <div className="bg-white border border-black/[0.06] rounded-card p-10 shadow-card">
        {status === "success" ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 20 20" fill="white" className="w-6 h-6">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold tracking-[-0.4px] mb-2">
              Thanks! We&apos;ll be in touch within 24 hours.
            </h3>
            <p className="text-sm text-zinc-600">
              We&apos;ll review your info and reach out with a custom demo plan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5 tracking-[-0.1px]">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Priya Ramirez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fafaf9] border border-black/10 rounded-btn py-[13px] px-3.5 text-sm outline-none transition-all duration-400 ease-smooth focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.06)] placeholder:text-zinc-400"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold mb-1.5 tracking-[-0.1px]">
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="Rosewood Hair Studio"
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  className="w-full bg-[#fafaf9] border border-black/10 rounded-btn py-[13px] px-3.5 text-sm outline-none transition-all duration-400 ease-smooth focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.06)] placeholder:text-zinc-400"
                />
                {errors.business && (
                  <p className="text-red-500 text-xs mt-1">{errors.business}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold mb-1.5 tracking-[-0.1px]">
                Email
              </label>
              <input
                type="email"
                placeholder="priya@rosewoodhair.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#fafaf9] border border-black/10 rounded-btn py-[13px] px-3.5 text-sm outline-none transition-all duration-400 ease-smooth focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.06)] placeholder:text-zinc-400"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-[13px] font-semibold mb-1.5 tracking-[-0.1px]">
                What would you want your AI chatbot to do?
              </label>
              <textarea
                placeholder="Answer questions about services, book appointments, handle after-hours inquiries..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#fafaf9] border border-black/10 rounded-btn py-[13px] px-3.5 text-sm outline-none transition-all duration-400 ease-smooth focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.06)] placeholder:text-zinc-400 h-[100px] resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-zinc-900 text-[#fafaf9] py-3.5 px-7 rounded-btn text-[15px] font-semibold w-full mt-1 tracking-[-0.2px] hover:bg-zinc-700 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>

            {status === "error" && (
              <p className="text-red-500 text-sm mt-3 text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
