"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation, useTranslationData } from "@/lib/i18n/context";

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#60a5fa" className="w-3.5 h-3.5 shrink-0 mt-0.5">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const data = useTranslationData();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items = data.services.items;

  return (
    <section id="services" ref={ref} className="max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16">
      <div
        className="text-center mb-12"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="text-xs font-semibold text-blue-500 tracking-[1.2px] uppercase mb-3">{t("services.sectionTag")}</div>
        <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 text-wrap-balance mx-auto">{t("services.headline")}</h2>
        <p className="text-base text-zinc-600 max-w-[480px] leading-[1.7] mx-auto">{t("services.subtext")}</p>
      </div>

      {/* Bento grid — 5 columns, asymmetric */}
      <div className="grid grid-cols-5 gap-2 max-lg:grid-cols-1 max-lg:gap-3">

        {/* Card 1: AI Chatbot — spans 3 columns, top-left */}
        <div
          className="group sm:col-span-3 max-lg:col-span-1 bg-zinc-900/80 backdrop-blur-xl overflow-hidden rounded-tl-[20px] max-lg:rounded-card relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          <div className="p-8 pb-0 max-sm:p-6 max-sm:pb-0">
            {items[0].tag && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[0.5px] uppercase bg-blue-400 text-white mb-4 inline-block">
                {items[0].tag}
              </span>
            )}
            <h3 className="text-[22px] font-bold tracking-[-0.4px] text-zinc-100 mb-2">{items[0].title}</h3>
            <p className="text-[14px] text-zinc-400 leading-[1.6] max-w-[400px] mb-6">{items[0].description}</p>
          </div>

          {/* Chat illustration — polished SVG */}
          <div className="relative pl-8 max-sm:pl-6 pb-2">
            <div className="absolute -inset-6 top-0 [background:radial-gradient(75%_95%_at_50%_0%,transparent,rgb(24,24,27)_100%)] z-10 pointer-events-none" />
            <svg className="w-full max-w-[420px]" viewBox="0 0 420 220" fill="none">
              {/* Chat window frame */}
              <rect x="0" y="0" width="420" height="220" rx="16" className="fill-zinc-800/80 stroke-white/[0.06]" strokeWidth="1" />

              {/* Header bar */}
              <rect x="0" y="0" width="420" height="44" rx="16" className="fill-zinc-800" />
              <rect x="0" y="28" width="420" height="16" className="fill-zinc-800" />
              <line x1="0" y1="44" x2="420" y2="44" className="stroke-white/[0.06]" strokeWidth="1" />
              <circle cx="28" cy="22" r="12" className="fill-blue-400" />
              <path d="M24 22a1 1 0 011-1h6l-3 4V21a1 1 0 01-1-1H25a1 1 0 01-1 1z" className="fill-white" transform="translate(0, 1) scale(0.7)" style={{ transformOrigin: "28px 22px" }} />
              <text x="48" y="19" className="fill-zinc-200 text-[11px] font-semibold">AgencyAI</text>
              <circle cx="48" cy="28" r="2.5" className="fill-blue-400">
                <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <text x="56" y="31" className="fill-blue-400 text-[8px]">Online</text>

              {/* Assistant bubble 1 */}
              <rect x="16" y="56" width="240" height="42" rx="12" className="fill-white/[0.05] stroke-white/[0.06]" strokeWidth="1">
                <animate attributeName="opacity" values="0;1" dur="0.5s" fill="freeze" begin="0.3s" />
              </rect>
              <text x="28" y="73" className="fill-zinc-400 text-[10px]">Hi! How can I help you today?</text>
              <text x="28" y="88" className="fill-zinc-500 text-[9px]">Ask about services, pricing, or booking</text>

              {/* User bubble */}
              <rect x="180" y="108" width="224" height="34" rx="12" className="fill-blue-400">
                <animate attributeName="opacity" values="0;1" dur="0.4s" fill="freeze" begin="0.8s" />
              </rect>
              <text x="196" y="129" className="fill-white text-[10px]">Do you do balayage? Price?</text>

              {/* Assistant bubble 2 */}
              <rect x="16" y="152" width="280" height="52" rx="12" className="fill-white/[0.05] stroke-white/[0.06]" strokeWidth="1">
                <animate attributeName="opacity" values="0;1" dur="0.5s" fill="freeze" begin="1.3s" />
              </rect>
              <text x="28" y="172" className="fill-zinc-400 text-[10px]">Balayage starts at $165. Priya has</text>
              <text x="28" y="192" className="fill-zinc-400 text-[10px]">openings Thu &amp; Fri. Want to book?</text>

              {/* Typing indicator dots */}
              <circle cx="28" cy="215" r="3" className="fill-zinc-600">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="38" cy="215" r="3" className="fill-zinc-600">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" begin="0.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="48" cy="215" r="3" className="fill-zinc-600">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" begin="0.4s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>

        {/* Card 2: Website Design — spans 2 columns, top-right */}
        <div
          className="group sm:col-span-2 max-lg:col-span-1 bg-white border border-black/[0.06] overflow-hidden rounded-tr-[20px] max-lg:rounded-card"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          <div className="p-8 max-sm:p-6">
            <h3 className="text-[20px] font-bold tracking-[-0.4px] text-zinc-900 mb-2">{items[1].title}</h3>
            <p className="text-[14px] text-zinc-500 leading-[1.6]">{items[1].description}</p>
          </div>

          {/* Website illustration — polished SVG */}
          <div className="relative px-6 pb-6 max-sm:px-4 max-sm:pb-4">
            <svg className="w-full transition-transform duration-500 ease-smooth group-hover:-translate-y-1" viewBox="0 0 340 260" fill="none">
              {/* Browser frame */}
              <rect x="0" y="0" width="340" height="260" rx="12" className="fill-white stroke-black/[0.08]" strokeWidth="1" />

              {/* Title bar */}
              <rect x="0" y="0" width="340" height="32" rx="12" className="fill-[#fafaf9]" />
              <rect x="0" y="16" width="340" height="16" className="fill-[#fafaf9]" />
              <line x1="0" y1="32" x2="340" y2="32" className="stroke-black/[0.06]" strokeWidth="1" />
              <circle cx="16" cy="16" r="4" className="fill-red-400/50" />
              <circle cx="28" cy="16" r="4" className="fill-yellow-400/50" />
              <circle cx="40" cy="16" r="4" className="fill-blue-300/50" />
              <rect x="80" y="10" width="120" height="12" rx="6" className="fill-black/[0.04]" />

              {/* Hero section of the website */}
              <rect x="16" y="44" width="308" height="80" rx="8" className="fill-blue-400/[0.05]" />
              <rect x="32" y="58" width="140" height="8" rx="4" className="fill-zinc-900/70" />
              <rect x="32" y="72" width="100" height="6" rx="3" className="fill-zinc-400/40" />
              <rect x="32" y="84" width="120" height="6" rx="3" className="fill-zinc-400/30" />
              <rect x="32" y="100" width="60" height="16" rx="6" className="fill-zinc-900" />
              <text x="47" y="112" className="fill-white text-[7px] font-medium">Get Started</text>
              {/* Phone mockup */}
              <rect x="230" y="52" width="60" height="65" rx="6" className="fill-white stroke-black/[0.08]" strokeWidth="1" />
              <rect x="234" y="60" width="52" height="32" rx="3" className="fill-blue-400/10" />
              <rect x="238" y="96" width="30" height="4" rx="2" className="fill-black/[0.06]" />
              <rect x="238" y="104" width="44" height="4" rx="2" className="fill-black/[0.04]" />

              {/* Cards row */}
              <rect x="16" y="136" width="96" height="60" rx="6" className="fill-[#fafaf9] stroke-black/[0.06]" strokeWidth="0.5" />
              <rect x="24" y="144" width="20" height="20" rx="4" className="fill-blue-400/10" />
              <rect x="24" y="172" width="60" height="5" rx="2.5" className="fill-zinc-300/60" />
              <rect x="24" y="182" width="40" height="4" rx="2" className="fill-zinc-200/60" />

              <rect x="122" y="136" width="96" height="60" rx="6" className="fill-[#fafaf9] stroke-black/[0.06]" strokeWidth="0.5" />
              <rect x="130" y="144" width="20" height="20" rx="4" className="fill-blue-400/10" />
              <rect x="130" y="172" width="60" height="5" rx="2.5" className="fill-zinc-300/60" />
              <rect x="130" y="182" width="40" height="4" rx="2" className="fill-zinc-200/60" />

              <rect x="228" y="136" width="96" height="60" rx="6" className="fill-[#fafaf9] stroke-black/[0.06]" strokeWidth="0.5" />
              <rect x="236" y="144" width="20" height="20" rx="4" className="fill-blue-400/10" />
              <rect x="236" y="172" width="60" height="5" rx="2.5" className="fill-zinc-300/60" />
              <rect x="236" y="182" width="40" height="4" rx="2" className="fill-zinc-200/60" />

              {/* Stats bar */}
              <rect x="16" y="208" width="308" height="36" rx="6" className="fill-[#fafaf9]" />
              <rect x="32" y="218" width="40" height="14" rx="4" className="fill-blue-400/15" />
              <text x="39" y="228" className="fill-blue-600 text-[7px] font-bold">98%</text>
              <rect x="82" y="222" width="50" height="5" rx="2.5" className="fill-zinc-300/40" />
              <rect x="200" y="218" width="40" height="14" rx="4" className="fill-blue-400/15" />
              <text x="207" y="228" className="fill-blue-600 text-[7px] font-bold">4.9★</text>
              <rect x="250" y="222" width="50" height="5" rx="2.5" className="fill-zinc-300/40" />

              {/* Pulse animation on the CTA */}
              <rect x="30" y="98" width="64" height="20" rx="7" className="stroke-blue-400/30 fill-none" strokeWidth="1">
                <animate attributeName="opacity" values="0;0.6;0" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="width" values="64;72;64" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="x" values="30;26;30" dur="2.5s" repeatCount="indefinite" />
              </rect>
            </svg>
          </div>
        </div>

        {/* Card 3: Automation — spans full 5 columns, bottom */}
        <div
          className="sm:col-span-5 max-lg:col-span-1 bg-white border border-black/[0.06] overflow-hidden rounded-b-[20px] max-lg:rounded-card grid grid-cols-[1fr_1.2fr] gap-0 max-sm:grid-cols-1"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          <div className="p-8 flex flex-col justify-center max-sm:p-6">
            <h3 className="text-[20px] font-bold tracking-[-0.4px] text-zinc-900 mb-2">{items[2].title}</h3>
            <p className="text-[14px] text-zinc-500 leading-[1.6] mb-5 max-w-[360px]">{items[2].description}</p>
            <div className="flex flex-wrap gap-2">
              {items[2].features.map((f, fi) => (
                <span key={fi} className="flex items-center gap-1.5 text-[13px] text-zinc-600 bg-black/[0.03] px-3 py-1.5 rounded-full">
                  <CheckIcon />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Animated flow diagram */}
          <div className="relative flex items-center justify-center p-8 max-sm:p-6 max-sm:pt-0 overflow-hidden">
            <div className="absolute inset-0 [background:radial-gradient(50%_80%_at_80%_50%,transparent,white_100%)] pointer-events-none z-10 max-sm:hidden" />
            <svg className="w-full max-w-[400px] h-[140px]" viewBox="0 0 400 140">
              {/* Flow lines */}
              <path d="M 60 70 Q 130 30, 200 70" fill="none" className="stroke-blue-400/25" strokeWidth="2" strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 200 70 Q 270 110, 340 70" fill="none" className="stroke-blue-400/25" strokeWidth="2" strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
              </path>

              {/* Nodes */}
              <g>
                <rect x="20" y="45" width="80" height="50" rx="12" className="fill-blue-400/[0.08] stroke-blue-400/25" strokeWidth="1.5" />
                <text x="60" y="65" textAnchor="middle" className="fill-blue-600 text-[11px] font-semibold">Trigger</text>
                <text x="60" y="82" textAnchor="middle" className="fill-blue-500/60 text-[9px]">Form / Chat</text>
              </g>
              <g>
                <rect x="160" y="45" width="80" height="50" rx="12" className="fill-zinc-900 stroke-zinc-700" strokeWidth="1.5">
                  <animate attributeName="opacity" values="1;0.85;1" dur="2.5s" repeatCount="indefinite" />
                </rect>
                <text x="200" y="65" textAnchor="middle" className="fill-white text-[11px] font-semibold">AI Process</text>
                <text x="200" y="82" textAnchor="middle" className="fill-zinc-400 text-[9px]">Classify + Act</text>
              </g>
              <g>
                <rect x="300" y="45" width="80" height="50" rx="12" className="fill-blue-400/[0.08] stroke-blue-400/25" strokeWidth="1.5" />
                <text x="340" y="65" textAnchor="middle" className="fill-blue-600 text-[11px] font-semibold">Output</text>
                <text x="340" y="82" textAnchor="middle" className="fill-blue-500/60 text-[9px]">CRM / Email</text>
              </g>

              {/* Animated dots on paths */}
              <circle r="3" className="fill-blue-400">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 60 70 Q 130 30, 200 70" />
              </circle>
              <circle r="3" className="fill-blue-400">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 200 70 Q 270 110, 340 70" />
              </circle>
            </svg>
          </div>
        </div>
      </div>

      {/* Features for first two services — compact grid below */}
      <div
        className="grid grid-cols-2 gap-2 mt-2 max-lg:grid-cols-1 max-lg:gap-3 max-lg:mt-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
        }}
      >
        {[0, 1].map((si) => (
          <div key={si} className="bg-white border border-black/[0.06] rounded-card px-7 py-5 max-sm:px-5">
            <div className="flex flex-wrap gap-2">
              {items[si].features.map((f, fi) => (
                <span key={fi} className="flex items-center gap-1.5 text-[13px] text-zinc-600">
                  <CheckIcon />
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
