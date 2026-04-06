"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation, useTranslationData } from "@/lib/i18n/context";

const icons = [
  <svg key="chat" viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-blue-400 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  <svg key="cal" viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-blue-400 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  <svg key="leads" viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-blue-400 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  <svg key="support" viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-blue-400 fill-none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
];

export default function Capabilities() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const data = useTranslationData();

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
    <section id="capabilities" ref={ref} className="max-w-site mx-auto px-12 py-24 max-sm:px-5 max-sm:py-16">
      <div className="grid grid-cols-[1fr_1.4fr] gap-16 items-start max-lg:grid-cols-1 max-lg:gap-10">
        <div
          className="max-lg:max-w-[520px]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="text-xs font-semibold text-blue-500 tracking-[1.2px] uppercase mb-3">
            {t("capabilities.sectionTag")}
          </div>
          <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 text-wrap-balance">
            {t("capabilities.headline")}
          </h2>
          <p className="text-base text-zinc-600 leading-[1.7]">
            {t("capabilities.subtext")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {data.capabilities.items.map((cap, i) => (
            <div
              key={i}
              className="group grid grid-cols-[44px_1fr] gap-4 p-5 rounded-card border border-transparent items-start transition-all duration-400 ease-smooth hover:bg-white hover:border-black/[0.06] hover:shadow-card hover:-translate-y-0.5"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(24px)",
                transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.1}s, background 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <div className="w-11 h-11 bg-[rgba(96,165,250,0.06)] rounded-btn flex items-center justify-center transition-transform duration-400 ease-smooth group-hover:scale-110">
                {icons[i]}
              </div>
              <div>
                <h4 className="text-base font-bold tracking-[-0.3px] mb-1">{cap.title}</h4>
                <p className="text-sm text-zinc-600 leading-[1.6]">{cap.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
