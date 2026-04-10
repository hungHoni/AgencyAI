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
    <section id="services" ref={ref} className="max-w-site mx-auto px-12 py-16 max-sm:px-5 max-sm:py-12">
      <div
        className="text-center mb-12"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="text-xs font-semibold text-blue-500 dark:text-blue-400 tracking-[1.2px] uppercase mb-3">{t("services.sectionTag")}</div>
        <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 text-wrap-balance mx-auto">{t("services.headline")}</h2>
        <p className="text-[17px] text-[var(--text-secondary)] max-w-[480px] leading-[1.7] mx-auto">{t("services.subtext")}</p>
      </div>

      {/* Bento grid — 5 columns, asymmetric */}
      <div className="grid grid-cols-5 gap-2 max-lg:grid-cols-1 max-lg:gap-3">

        {/* Card 1: AI Chatbot — spans 3 columns, top-left */}
        <div
          className="group sm:col-span-3 max-lg:col-span-1 bg-zinc-900/80 dark:bg-[#151518] backdrop-blur-xl overflow-hidden rounded-tl-[20px] max-lg:rounded-card relative"
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
            <p className="text-[15px] text-zinc-400 leading-[1.6] max-w-[400px] mb-6">{items[0].description}</p>
          </div>

          {/* Stunning Chat UI Mockup */}
          <div className="relative h-[240px] ml-8 mt-2 max-sm:ml-4 max-sm:mt-0 rounded-tl-2xl border-t border-l border-white/[0.08] bg-[#1e1e24] shadow-2xl overflow-hidden flex flex-col pointer-events-none group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-700 ease-smooth">
            {/* Header */}
            <div className="h-14 border-b border-white/[0.06] bg-[#1a1a1f] px-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white tracking-wide leading-tight">AgencyAI</div>
                  <div className="text-[10px] text-blue-400 font-medium">Trợ lý trực tuyến</div>
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="flex-1 p-5 pb-0 flex flex-col gap-4 relative">
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1e1e24] to-transparent z-10" />

              <div className="self-start relative z-0 flex items-end gap-2 animate-[chat-slide-up_0.5s_ease-out_both] delay-100">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/20 shrink-0" />
                <div className="bg-[#2a2a32] border border-white/[0.04] rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[90%] shadow-sm">
                  <div className="text-[12px] text-zinc-300 leading-relaxed">Xin chào! Chào mừng bạn đến với Thẩm Mỹ Viện Hoa Sen.</div>
                </div>
              </div>

              <div className="self-end relative z-0 animate-[chat-slide-up_0.5s_ease-out_both] delay-500">
                <div className="bg-blue-500 rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[90%] shadow-md">
                  <div className="text-[12px] text-white font-medium shadow-sm">Mình muốn hỏi chi phí nhuộm Balayage?</div>
                </div>
              </div>

              <div className="self-start relative z-0 flex items-end gap-2 animate-[chat-slide-up_0.5s_ease-out_both] delay-700">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/20 shrink-0" />
                <div className="bg-[#2a2a32] border border-white/[0.04] rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm flex items-center gap-1.5 h-[36px]">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-[typing-dot_1.4s_infinite]" />
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-[typing-dot_1.4s_infinite_0.2s]" />
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-[typing-dot_1.4s_infinite_0.4s]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Website Design — spans 2 columns, top-right */}
        <div
          className="group sm:col-span-2 max-lg:col-span-1 bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden rounded-tr-[20px] max-lg:rounded-card"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          <div className="p-8 max-sm:p-6">
            <h3 className="text-[20px] font-bold tracking-[-0.4px] mb-2">{items[1].title}</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-[1.6]">{items[1].description}</p>
          </div>

          {/* Abstract Floating UI components */}
          <div className="relative h-[240px] w-full overflow-hidden flex justify-center items-end bg-gradient-to-b from-transparent to-[var(--border)]">
            <div className="w-[85%] h-[190px] bg-[var(--bg-card)] rounded-t-[24px] border border-[var(--border)] shadow-[var(--shadow-card)] relative flex flex-col items-center pt-8 px-6 transition-transform duration-700 ease-smooth group-hover:translate-y-[-8px]">

              {/* Header skeleton */}
              <div className="w-[45%] h-3.5 bg-[var(--text-muted)]/20 rounded-full mb-3" />
              <div className="w-[25%] h-2.5 bg-[var(--text-muted)]/10 rounded-full mb-8" />

              {/* Bento inside bento */}
              <div className="w-full grid grid-cols-2 gap-3 relative z-10">
                <div className="h-24 bg-[var(--bg)] rounded-xl border border-[var(--border)] p-4 flex flex-col justify-between shadow-sm">
                  <div className="w-8 h-8 bg-blue-100/60 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-md shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-[var(--text-muted)]/20 rounded-full" />
                    <div className="w-2/3 h-2 bg-[var(--text-muted)]/20 rounded-full" />
                  </div>
                </div>
                <div className="h-24 bg-[var(--bg)] rounded-xl border border-[var(--border)] p-4 flex flex-col justify-between shadow-sm">
                  <div className="w-8 h-8 bg-amber-100/60 dark:bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-md shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-[var(--text-muted)]/20 rounded-full" />
                    <div className="w-1/2 h-2 bg-[var(--text-muted)]/20 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Card 3: Automation — spans full 5 columns, bottom */}
        <div
          className="sm:col-span-5 max-lg:col-span-1 bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden rounded-b-[20px] max-lg:rounded-card grid grid-cols-[1fr_1.2fr] gap-0 max-sm:grid-cols-1"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          <div className="p-8 flex flex-col justify-center max-sm:p-6">
            <h3 className="text-[20px] font-bold tracking-[-0.4px] mb-2">{items[2].title}</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-[1.6] mb-5 max-w-[360px]">{items[2].description}</p>
            <div className="flex flex-wrap gap-2">
              {items[2].features.map((f, fi) => (
                <span key={fi} className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] bg-[var(--border)] px-3 py-1.5 rounded-full">
                  <CheckIcon />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Crystal Clear Pipeline Animation */}
          <div className="relative flex items-center justify-center p-8 max-sm:p-4 w-full h-[200px] max-lg:h-[220px]">
            {/* Pipeline Container */}
            <div className="flex items-center justify-center w-full max-w-[500px]">

              {/* Step 1: Input (e.g. Lead) */}
              <div className="relative group/node flex flex-col items-center">
                <div className="w-14 h-14 bg-[var(--bg-card)] rounded-2xl shadow-[var(--shadow-card)] border border-[var(--border-strong)] flex items-center justify-center relative z-10 transition-transform duration-500 group-hover/node:translate-y-[-4px]">
                  <svg className="w-6 h-6 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div className="absolute -bottom-8 text-[11px] font-semibold text-[var(--text-secondary)] whitespace-nowrap bg-[var(--bg-card)]/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-[var(--border)]">Khách truy cập</div>
              </div>

              {/* Connecting Line 1 */}
              <div className="flex-1 h-[3px] bg-[var(--border-strong)] rounded-full relative overflow-hidden mx-3">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>

              {/* Step 2: AI brain */}
              <div className="relative group/node flex flex-col items-center scale-[1.15] mx-[-4px] z-20">
                <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
                <div className="w-16 h-16 bg-zinc-900 dark:bg-[#151518] rounded-[20px] shadow-2xl border border-zinc-800 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover/node:scale-110">
                  <svg className="w-7 h-7 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="absolute -bottom-9 text-[12px] font-bold whitespace-nowrap bg-blue-400/10 text-blue-500 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-400/20">AI Xử Lý</div>
              </div>

              {/* Connecting Line 2 */}
              <div className="flex-1 h-[3px] bg-[var(--border-strong)] rounded-full relative overflow-hidden mx-3">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[shimmer_1.5s_infinite_0.4s]" />
              </div>

              {/* Step 3: Automation Action 1 (Calendar) */}
              <div className="relative group/node flex flex-col items-center">
                <div className="w-12 h-12 bg-[var(--bg-card)] rounded-2xl shadow-[var(--shadow-card)] border border-[var(--border-strong)] flex items-center justify-center relative z-10 transition-transform duration-500 group-hover/node:translate-y-[-4px]">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="absolute -bottom-8 text-[11px] font-semibold text-[var(--text-secondary)] whitespace-nowrap bg-[var(--bg-card)]/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-[var(--border)]">Chốt hẹn</div>
              </div>

              {/* Split line */}
              <div className="w-5 h-[3px] bg-[var(--border-strong)] rounded-full relative mx-3 hidden sm:block">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-[shimmer_1.5s_infinite_0.6s]" />
              </div>

              {/* Step 4: Automation Action 2 (Mail) */}
              <div className="relative group/node flex flex-col items-center hidden sm:flex">
                <div className="w-12 h-12 bg-[var(--bg-card)] rounded-2xl shadow-[var(--shadow-card)] border border-[var(--border-strong)] flex items-center justify-center relative z-10 transition-transform duration-500 group-hover/node:translate-y-[-4px]">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div className="absolute -bottom-8 text-[11px] font-semibold text-[var(--text-secondary)] whitespace-nowrap bg-[var(--bg-card)]/80 px-2.5 py-1 rounded-full backdrop-blur-sm border border-[var(--border)]">Gửi Email</div>
              </div>

            </div>
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
          <div key={si} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-card px-7 py-5 max-sm:px-5">
            <div className="flex flex-wrap gap-2">
              {items[si].features.map((f, fi) => (
                <span key={fi} className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
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
