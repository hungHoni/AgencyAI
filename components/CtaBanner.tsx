"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";

export default function CtaBanner() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="px-12 max-sm:px-5">
      <div
        className="max-w-site mx-auto bg-zinc-900/80 backdrop-blur-xl rounded-card p-16 grid grid-cols-[1fr_auto] gap-12 items-center relative overflow-hidden max-lg:grid-cols-1 max-lg:text-center max-lg:p-12 max-lg:px-8 max-sm:p-10 max-sm:px-6"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)", transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[radial-gradient(ellipse_at_top_right,rgba(96,165,250,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[60%] bg-[radial-gradient(ellipse_at_bottom_left,rgba(96,165,250,0.05)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold text-zinc-100 tracking-[-1px] leading-[1.1] mb-2 text-wrap-balance">{t("ctaBanner.headline")}</h2>
          <p className="text-base text-zinc-500 max-w-[420px] leading-[1.6] max-lg:mx-auto">{t("ctaBanner.subtext")}</p>
        </div>

        <Link href="#contact" className="relative z-10 bg-blue-400 text-white px-9 py-4 rounded-btn text-[15px] font-semibold tracking-[-0.2px] whitespace-nowrap shrink-0 hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-400 ease-smooth animate-[cta-glow_3s_ease-in-out_infinite]">
          {t("ctaBanner.buttonLabel")}
        </Link>
      </div>
    </section>
  );
}
