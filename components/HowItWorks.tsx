"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslation, useTranslationData } from "@/lib/i18n/context";

const stepImages = [
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=870&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=870&auto=format&fit=crop",
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();
  const data = useTranslationData();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section id="how-it-works" ref={ref} className="max-w-site mx-auto px-12 py-20 max-sm:px-5 max-sm:py-14 relative z-10">

      {/* Header */}
      <div
        className="text-center mb-14 max-sm:mb-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="text-xs font-semibold text-blue-500 dark:text-blue-400 tracking-[1.2px] uppercase mb-3">{t("howItWorks.sectionTag")}</div>
        <h2 className="text-[clamp(2rem,3.5vw,2.75rem)] font-extrabold tracking-[-1.2px] leading-[1.08] mb-4 text-wrap-balance mx-auto">{t("howItWorks.headline")}</h2>
        <p className="text-lg text-[var(--text-secondary)] leading-[1.7] max-w-[520px] mx-auto">{t("howItWorks.subtext")}</p>
      </div>

      {/* Step cards */}
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1 max-lg:gap-5">
        {data.howItWorks.steps.map((step, i) => {
          const isActive = activeStep === i;

          return (
            <div
              key={i}
              className="group relative cursor-pointer"
              onClick={() => setActiveStep(i)}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.12}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.12}s`,
              }}
            >
              {/* Image */}
              <div className={`relative aspect-[4/5] max-lg:aspect-[16/9] rounded-2xl overflow-hidden transition-all duration-700 ease-smooth ${isActive ? "" : "opacity-50 group-hover:opacity-75"}`}>
                <img
                  src={stepImages[i]}
                  alt={step.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-smooth ${isActive ? "scale-105" : "scale-100 group-hover:scale-[1.02]"}`}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />

                {/* Step number — top left */}
                <div className={`absolute top-5 left-5 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(96,165,250,0.5)]"
                    : "bg-white/15 text-white/70 backdrop-blur-sm"
                }`}>
                  {i + 1}
                </div>

                {/* Text overlay — bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 max-sm:p-5">
                  <h4 className={`text-[22px] max-sm:text-lg font-bold tracking-[-0.4px] text-white mb-1.5 transition-all duration-500 ${isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-80"}`}>
                    {step.title}
                  </h4>
                  <p className={`text-[15px] max-sm:text-sm text-zinc-300 leading-[1.55] transition-all duration-500 ${isActive ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0 max-lg:opacity-70"}`}>
                    {step.description}
                  </p>
                </div>

                {/* Active indicator — bottom bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-blue-400 transition-transform duration-700 origin-left ${isActive ? "scale-x-100" : "scale-x-0"}`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
