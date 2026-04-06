"use client";

import { useRef, useEffect, useState } from "react";

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="#10b981"
      className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const services = [
  {
    tag: "Most requested",
    title: "AI Chatbot",
    description:
      "A custom AI assistant embedded on your website. Trained specifically on your business. Handles everything from answering questions to booking appointments to capturing leads after hours.",
    features: [
      "Custom trained on your business data",
      "Answers any customer question accurately",
      "Books appointments directly",
      "Captures leads around the clock",
      "Works on any existing website",
      "Learns and improves over time",
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    isHero: true,
  },
  {
    title: "Website Design",
    description:
      "Professional sites that turn visitors into customers. Fast, mobile-first, built for local search.",
    features: [
      "Custom design",
      "Mobile responsive",
      "SEO optimized",
      "Google Business ready",
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    isHero: false,
  },
  {
    title: "Automation Flows",
    description:
      "Connect your tools. Automate follow-ups, reminders, review requests, and reporting.",
    features: [
      "Appointment reminders",
      "Review requests",
      "Email sequences",
      "Custom workflows",
    ],
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-emerald-500 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
    isHero: false,
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={ref} className="max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16">
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="text-xs font-semibold text-emerald-600 tracking-[1.2px] uppercase mb-3">
          Services
        </div>
        <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 max-w-[520px] text-wrap-balance">
          How we help you grow.
        </h2>
        <p className="text-base text-zinc-600 max-w-[480px] leading-[1.7] mb-14">
          Start with a chatbot. Add a website or automations when you&apos;re ready.
        </p>
      </div>

      <div className="grid grid-cols-[2fr_1fr] grid-rows-[auto_auto] gap-4 max-lg:grid-cols-1">
        {services.map((service, i) => (
          <div
            key={service.title}
            className={`group rounded-card p-10 px-9 relative flex flex-col ${
              service.isHero
                ? "row-span-2 bg-zinc-900 text-zinc-300 border border-transparent hover:border-white/[0.08] max-lg:row-span-1"
                : "bg-white border border-black/[0.06] hover:shadow-elevated hover:-translate-y-[3px] hover:border-black/10"
            }`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
              transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.12}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.12}s, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            {service.tag && (
              <div
                className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full tracking-[0.6px] uppercase mb-6 ${
                  service.isHero
                    ? "bg-emerald-500 text-white"
                    : "bg-[rgba(16,185,129,0.06)] text-emerald-600"
                }`}
              >
                {service.tag}
              </div>
            )}
            {!service.tag && <div className="mb-6" />}

            <div
              className={`w-11 h-11 rounded-btn flex items-center justify-center mb-5 transition-transform duration-400 ease-smooth group-hover:scale-110 ${
                service.isHero
                  ? "bg-[rgba(16,185,129,0.15)]"
                  : "bg-[rgba(16,185,129,0.06)]"
              }`}
            >
              {service.icon}
            </div>

            <h3
              className={`text-[22px] font-bold tracking-[-0.4px] mb-2.5 ${
                service.isHero ? "text-zinc-100" : "text-zinc-900"
              }`}
            >
              {service.title}
            </h3>

            <p
              className={`text-[15px] leading-[1.65] mb-6 max-w-[65ch] ${
                service.isHero ? "text-zinc-400" : "text-zinc-600"
              } ${!service.isHero ? "min-h-[52px]" : ""}`}
            >
              {service.description}
            </p>

            <ul className="list-none mt-auto">
              {service.features.map((feature) => (
                <li
                  key={feature}
                  className={`text-sm py-2.5 pl-6 relative border-t ${
                    service.isHero
                      ? "text-zinc-400 border-white/[0.06]"
                      : "text-zinc-600 border-black/[0.06]"
                  }`}
                >
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
